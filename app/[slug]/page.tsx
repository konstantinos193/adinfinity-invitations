import InvitationFooter from '@/components/InvitationFooter';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getInvitation } from '@/lib/api';
import { isLocked } from '@/lib/types';
import { accessCookieName } from '@/lib/access-cookie';
import PinGate from '@/components/PinGate';
import InvitationHero from '@/components/InvitationHero';
import OurStory from '@/components/OurStory';
import EventsSection from '@/components/EventsSection';
import ContactsSection from '@/components/ContactsSection';
import GiftRegistry from '@/components/GiftRegistry';
import RSVPForm from '@/components/RSVPForm';
import VideoSection from '@/components/VideoSection';
import FloatingBar from '@/components/FloatingBar';
import MusicPlayer from '@/components/MusicPlayer';
import PhotoGallery from '@/components/PhotoGallery';
import VideoOnlyPage from '@/components/templates/VideoOnlyPage';
import VideoProsklitirio from '@/components/templates/VideoProsklitirio';
import EventHeritageHero from '@/components/templates/EventHeritageHero';
import WeddingFonts from '@/components/WeddingFonts';
import { SITE_NAME, SITE_URL } from '@/lib/seo';

interface Props {
  params: Promise<{ slug: string }>;
}

function invitationTitle(inv: { eventCategory?: string | null; brideName?: string | null; groomName?: string | null; childName?: string | null; honoreeName?: string | null; eventTitle?: string | null }): string {
  if (inv.eventCategory === 'BAPTISM') return inv.childName ?? 'Βάπτιση';
  if (inv.eventCategory === 'WEDDING_BAPTISM') return `${inv.brideName ?? ''} & ${inv.groomName ?? ''} · ${inv.childName ?? ''}`.trim();
  if (inv.eventCategory === 'ANNIVERSARY') return `${inv.brideName ?? ''} & ${inv.groomName ?? ''}`.trim();
  if (inv.eventCategory === 'BIRTHDAY') return inv.honoreeName ?? 'Γενέθλια';
  if (inv.eventCategory === 'EVENT') return inv.eventTitle ?? 'Εκδήλωση';
  return `${inv.brideName ?? ''} & ${inv.groomName ?? ''}`.trim();
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const { slug } = await params;

    // Deliberately fetched WITHOUT the unlock token.
    //
    // Link-preview crawlers (Viber, WhatsApp, Messenger) request the page with
    // no cookies, so whatever lands in og:title/og:image is visible to anyone
    // holding the link. Reading the public response means a PIN-protected
    // invitation yields the locked stub here, and the preview can't leak the
    // couple's names or cover photo — which is the whole point of the PIN.
    const inv = await getInvitation(slug);

    if (isLocked(inv)) {
      return {
        title: 'Ιδιωτική πρόσκληση',
        description: 'Η πρόσκληση αυτή προστατεύεται με κωδικό.',
        alternates: { canonical: `/${slug}` },
        openGraph: {
          title: 'Ιδιωτική πρόσκληση',
          description: 'Η πρόσκληση αυτή προστατεύεται με κωδικό.',
          type: 'website',
          locale: 'el_GR',
          url: `${SITE_URL}/${slug}`,
          siteName: SITE_NAME,
        },
        robots: { index: false, follow: true, noimageindex: true, noarchive: true },
      };
    }

    const title = invitationTitle(inv);
    const description = `Ψηφιακή πρόσκληση — ${title}. RSVP online, χάρτες εκδηλώσεων και λεπτομέρειες.`;
    const images = inv.coverImageUrl
      ? [{ url: inv.coverImageUrl, width: 1200, height: 630, alt: title }]
      : [];

    return {
      title,
      description,
      // Required. Without it this page inherits the root layout's
      // `alternates.canonical: '/'` and tells Google that every client
      // invitation is a duplicate of the homepage.
      alternates: { canonical: `/${slug}` },
      openGraph: {
        title,
        description,
        type: 'website',
        locale: 'el_GR',
        url: `${SITE_URL}/${slug}`,
        siteName: SITE_NAME,
        ...(images.length > 0 && { images }),
      },
      twitter: {
        card: inv.coverImageUrl ? 'summary_large_image' : 'summary',
        title,
        description,
        ...(inv.coverImageUrl && { images: [inv.coverImageUrl] }),
      },
      // Client invitations are never indexed, ACTIVE or not.
      //
      // These pages carry third parties' personal data — the couple's and
      // their relatives' phone numbers and email, venue addresses, and a bank
      // IBAN — none of which the guests consented to publish in a search
      // engine. The SEO asset is the product; a customer's wedding is not.
      //
      // `follow: true` is deliberate: it keeps the footer's adinfinity.gr
      // attribution link live as an acquisition loop.
      // `noimageindex` keeps the couple's photos out of Google Images, and
      // `noarchive` prevents a cached copy outliving the page.
      robots: {
        index: false,
        follow: true,
        noimageindex: true,
        noarchive: true,
      },
    };
  } catch {
    return { title: 'Πρόσκληση' };
  }
}

export default async function InvitationPage({ params }: Props) {
  const { slug } = await params;

  // Reading a cookie makes this route dynamic, which is required: a shared ISR
  // cache would otherwise be able to serve unlocked HTML to a visitor who
  // never entered the PIN.
  const jar = await cookies();
  const accessToken = jar.get(accessCookieName(slug))?.value;

  let response;
  try {
    response = await getInvitation(slug, accessToken);
  } catch {
    notFound();
  }

  if (isLocked(response)) {
    return <PinGate slug={slug} />;
  }

  const invitation = response;

  if (invitation.invitationType === 'VIDEO') {
    return (
      <>
        <WeddingFonts />
        <VideoOnlyPage invitation={invitation} />
      </>
    );
  }
  if (invitation.invitationType === 'VIDEO_PROSKLITIRIO') {
    return (
      <>
        <WeddingFonts />
        <VideoProsklitirio invitation={invitation} />
      </>
    );
  }

  const isHeritage = invitation.eventCategory === 'EVENT' && invitation.backgroundStyle === 'heritage';
  const ceremony = invitation.events.find((e) => e.type === 'CEREMONY');
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: invitationTitle(invitation),
    startDate: invitation.weddingDate ?? undefined,
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    ...(ceremony?.address && {
      location: { '@type': 'Place', name: ceremony.name, address: ceremony.address },
    }),
    ...(invitation.coverImageUrl && { image: invitation.coverImageUrl }),
    organizer: { '@type': 'Organization', name: 'adinfinity', url: 'https://adinfinity.gr' },
  };

  return (
    <main>
      <WeddingFonts />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {isHeritage ? (
        <EventHeritageHero
          eventTitle={invitation.eventTitle ?? ''}
          hostName={invitation.hostName}
          subtitle={invitation.honoreeName}
          quote={invitation.story}
          eventDate={invitation.weddingDate}
          photoUrl={invitation.coverImages?.[0] ?? invitation.coverImageUrl}
          logoUrl={invitation.coverImages?.[1] ?? null}
          fontFamily={invitation.fontFamily}
          fontColor={invitation.fontColor}
        />
      ) : (
        <InvitationHero
          brideName={invitation.brideName ?? ''}
          groomName={invitation.groomName ?? ''}
          weddingDate={invitation.weddingDate ?? ''}
          eventCategory={invitation.eventCategory}
          childName={invitation.childName}
          fatherName={invitation.fatherName}
          motherName={invitation.motherName}
          eventTitle={invitation.eventTitle}
          honoreeName={invitation.honoreeName}
          yearsCount={invitation.yearsCount}
          coverImageUrl={invitation.coverImageUrl}
          coverImages={invitation.coverImages}
          primaryColor={invitation.primaryColor}
          fontFamily={invitation.fontFamily}
          fontColor={invitation.fontColor}
          backgroundStyle={invitation.backgroundStyle}
        />
      )}

      {invitation.story && !isHeritage && <OurStory story={invitation.story} color={invitation.primaryColor ?? undefined} />}

      {invitation.videoUrl && <VideoSection videoUrl={invitation.videoUrl} />}

      {invitation.galleryImages?.length > 0 && (
        <PhotoGallery images={invitation.galleryImages} color={invitation.primaryColor ?? undefined} />
      )}

      {invitation.events.length > 0 && (
        <EventsSection events={invitation.events} color={invitation.primaryColor ?? undefined} />
      )}

      {invitation.contacts.length > 0 && (
        <ContactsSection contacts={invitation.contacts} color={invitation.primaryColor ?? undefined} />
      )}

      {invitation.giftRegistries.length > 0 && (
        <GiftRegistry gifts={invitation.giftRegistries} color={invitation.primaryColor ?? undefined} />
      )}

      <RSVPForm slug={slug} rsvpDeadline={invitation.rsvpDeadline} color={invitation.primaryColor ?? undefined} />

      <InvitationFooter />

      <FloatingBar events={invitation.events} gifts={invitation.giftRegistries} color={invitation.primaryColor ?? undefined} />

      {invitation.musicUrl && <MusicPlayer src={invitation.musicUrl} />}
    </main>
  );
}
