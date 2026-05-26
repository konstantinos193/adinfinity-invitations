import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getInvitation } from '@/lib/api';
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

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const { slug } = await params;
    const inv = await getInvitation(slug);
    const title = `${inv.brideName} & ${inv.groomName}`;
    const description = `Ψηφιακή πρόσκληση γάμου — ${inv.brideName} & ${inv.groomName}. RSVP online, χάρτες εκδηλώσεων και λεπτομέρειες γάμου.`;
    const images = inv.coverImageUrl
      ? [{ url: inv.coverImageUrl, width: 1200, height: 630, alt: title }]
      : [];

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        type: 'website',
        locale: 'el_GR',
        ...(images.length > 0 && { images }),
      },
      twitter: {
        card: inv.coverImageUrl ? 'summary_large_image' : 'summary',
        title,
        description,
        ...(inv.coverImageUrl && { images: [inv.coverImageUrl] }),
      },
      robots: {
        index: inv.status === 'ACTIVE',
        follow: true,
      },
    };
  } catch {
    return { title: 'Πρόσκληση' };
  }
}

export default async function InvitationPage({ params }: Props) {
  const { slug } = await params;

  let invitation;
  try {
    invitation = await getInvitation(slug);
  } catch {
    notFound();
  }

  if (invitation.invitationType === 'VIDEO') {
    return <VideoOnlyPage invitation={invitation} />;
  }
  if (invitation.invitationType === 'VIDEO_PROSKLITIRIO') {
    return <VideoProsklitirio invitation={invitation} />;
  }

  const ceremony = invitation.events.find((e) => e.type === 'CEREMONY');
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: `Γάμος ${invitation.brideName} & ${invitation.groomName}`,
    startDate: invitation.weddingDate,
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    ...(ceremony?.address && {
      location: { '@type': 'Place', name: ceremony.name, address: ceremony.address },
    }),
    ...(invitation.coverImageUrl && { image: invitation.coverImageUrl }),
    organizer: { '@type': 'Organization', name: 'adifinity', url: 'https://adinfinity.gr' },
  };

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <InvitationHero
        brideName={invitation.brideName}
        groomName={invitation.groomName}
        weddingDate={invitation.weddingDate}
        coverImageUrl={invitation.coverImageUrl}
        coverImages={invitation.coverImages}
        primaryColor={invitation.primaryColor}
        fontFamily={invitation.fontFamily}
        fontColor={invitation.fontColor}
        backgroundStyle={invitation.backgroundStyle}
      />

      {invitation.story && <OurStory story={invitation.story} color={invitation.primaryColor ?? undefined} />}

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

      <footer className="py-8 text-center text-xs text-[#5c3320]/40 bg-[#fdfaf6] border-t border-[#b8960c]/10">
        Δημιουργήθηκε από{' '}
        <a href="https://adinfinity.gr" className="hover:text-[#b8960c] transition-colors">
          adinfinity.gr
        </a>
      </footer>

      <FloatingBar events={invitation.events} gifts={invitation.giftRegistries} color={invitation.primaryColor ?? undefined} />

      {invitation.musicUrl && <MusicPlayer src={invitation.musicUrl} />}
    </main>
  );
}
