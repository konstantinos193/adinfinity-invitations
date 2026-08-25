import InvitationHero from '@/components/InvitationHero';
import WeddingFonts from '@/components/WeddingFonts';
import JsonLd from '@/components/JsonLd';
import {
  PAGES,
  breadcrumbNode,
  graph,
  pageMetadata,
  webPageNode,
} from '@/lib/seo';
import OurStory from '@/components/OurStory';
import EventsSection from '@/components/EventsSection';
import ContactsSection from '@/components/ContactsSection';
import GiftRegistry from '@/components/GiftRegistry';
import RSVPForm from '@/components/RSVPForm';
import VideoSection from '@/components/VideoSection';
import FloatingBar from '@/components/FloatingBar';
import MusicPlayer from '@/components/MusicPlayer';
import PhotoGallery from '@/components/PhotoGallery';
import InvitationFooter from '@/components/InvitationFooter';
import DemoNotice from '@/components/DemoNotice';

export const metadata = pageMetadata('ioanna');

/**
 * Fictional showcase invitation. Every value here is deliberately fake — the
 * phone numbers and IBAN are sequential placeholders, not customer data.
 *
 * KEEP THE DATES IN THE FUTURE. This page is indexable and is the main "see it
 * working" link from the landing pages; when the date passes, the RSVP form
 * flips to «Η προθεσμία έχει παρέλθει» and the showcase demonstrates a dead
 * form to every visitor and to Google. It sat expired from June 2025 until
 * August 2026 for exactly that reason.
 */
const demoInvitation = {
  brideName: 'Ιωάννα',
  groomName: 'Αλέξανδρος',
  weddingDate: '2027-06-12',
  eventCategory: 'WEDDING',
  childName: null,
  fatherName: null,
  motherName: null,
  coverImageUrl: null,
  coverImages: [],
  primaryColor: '#b8960c',
  fontFamily: 'Cormorant Garamond',
  fontColor: '#5c3320',
  backgroundStyle: 'gradient',
  story: 'Η ιστορία μας ξεκίνησε το 2018, όταν συναντηθήκαμε σε μια καφετέρια στην Άρτα. Από τότε, μοιραστήκαμε πολλά όνειρα, ταξίδια και στιγμές που θα μας μείνουν αξέχαστες. Σήμερα, με χαρά σας προσκαλούμε να γιορτάσετε μαζί μας την αρχή του κοινού μας ταξιδιού.',
  videoUrl: null,
  galleryImages: [],
  events: [
    {
      id: '1',
      type: 'CEREMONY' as const,
      name: 'Γαμήλια Τελετή',
      date: '2027-06-12T17:00:00',
      address: 'Εκκλησία Αγίου Νικολάου, Άρτα',
      mapsUrl: null,
    },
    {
      id: '2',
      type: 'RECEPTION' as const,
      name: 'Γαμήλια Δεξίωση',
      date: '2027-06-12T20:00:00',
      address: 'Κέντρο Εκδηλώσεων "Άρτα Palace", Άρτα',
      mapsUrl: null,
    },
  ],
  contacts: [
    {
      id: '1',
      role: 'BEST_MAN' as const,
      name: 'Νίκος Παπαδόπουλος',
      phone: '+30 691 234 5678',
      email: null,
    },
    {
      id: '2',
      role: 'MAID_OF_HONOR' as const,
      name: 'Μαρία Γεωργίου',
      phone: '+30 692 345 6789',
      email: null,
    },
  ],
  giftRegistries: [
    {
      id: '1',
      ownerName: 'Ιωάννα Παπαδοπούλου',
      bankName: 'Eurobank',
      iban: 'GR16 0026 0280 0001 2345 6789 012',
    },
  ],
  rsvpDeadline: '2027-05-15',
  musicUrl: null,
  status: 'ACTIVE',
  invitationType: 'MINI_WEBSITE',
};

export default function DemoInvitationPage() {
  /**
   * Deliberately NOT an `Event` node.
   *
   * This page used to emit Event structured data — a wedding that does not
   * exist, at a venue in Arta, with a concrete start date. That invites Google
   * to treat a fabricated ceremony as a real indexable event, which is exactly
   * what Google's structured-data policy prohibits.
   *
   * A WebPage tied to the site graph describes what this page honestly is: a
   * showcase of the product, published by adinfinity.
   */
  const jsonLd = graph(
    webPageNode('ioanna'),
    breadcrumbNode([
      { name: 'Αρχική', path: '/' },
      { name: 'Δείγμα: Ιωάννα & Αλέξανδρος', path: PAGES.ioanna.path },
    ]),
  );

  return (
    <main>
      <DemoNotice />
      <WeddingFonts />
      <JsonLd data={jsonLd} />
      <InvitationHero
        brideName={demoInvitation.brideName}
        groomName={demoInvitation.groomName}
        weddingDate={demoInvitation.weddingDate}
        eventCategory={demoInvitation.eventCategory}
        childName={demoInvitation.childName}
        fatherName={demoInvitation.fatherName}
        motherName={demoInvitation.motherName}
        coverImageUrl={demoInvitation.coverImageUrl}
        coverImages={demoInvitation.coverImages}
        primaryColor={demoInvitation.primaryColor}
        fontFamily={demoInvitation.fontFamily}
        fontColor={demoInvitation.fontColor}
        backgroundStyle={demoInvitation.backgroundStyle}
      />

      <OurStory story={demoInvitation.story} color={demoInvitation.primaryColor} />

      {demoInvitation.videoUrl && <VideoSection videoUrl={demoInvitation.videoUrl} />}

      {demoInvitation.galleryImages?.length > 0 && (
        <PhotoGallery images={demoInvitation.galleryImages} color={demoInvitation.primaryColor} />
      )}

      {demoInvitation.events.length > 0 && (
        <EventsSection events={demoInvitation.events} color={demoInvitation.primaryColor} />
      )}

      {demoInvitation.contacts.length > 0 && (
        <ContactsSection contacts={demoInvitation.contacts} color={demoInvitation.primaryColor} />
      )}

      {demoInvitation.giftRegistries.length > 0 && (
        <GiftRegistry gifts={demoInvitation.giftRegistries} color={demoInvitation.primaryColor} />
      )}

      <RSVPForm slug="ioanna-alexandros" rsvpDeadline={demoInvitation.rsvpDeadline} color={demoInvitation.primaryColor} />

      <InvitationFooter />

      <FloatingBar events={demoInvitation.events} gifts={demoInvitation.giftRegistries} color={demoInvitation.primaryColor} />

      {demoInvitation.musicUrl && <MusicPlayer src={demoInvitation.musicUrl} />}
    </main>
  );
}
