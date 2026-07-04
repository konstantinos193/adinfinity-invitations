import type { Metadata } from 'next';
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

export const metadata: Metadata = {
  title: 'Ιωάννα & Αλέξανδρος | adinfinity',
  description: 'Ψηφιακή πρόσκληση γάμου — Ιωάννα & Αλέξανδρος. RSVP online, χάρτες εκδηλώσεων και λεπτομέρειες.',
  openGraph: {
    title: 'Ιωάννα & Αλέξανδρος | adinfinity',
    description: 'Ψηφιακή πρόσκληση γάμου — Ιωάννα & Αλέξανδρος. RSVP online, χάρτες εκδηλώσεων και λεπτομέρειες.',
    type: 'website',
    locale: 'el_GR',
  },
};

const demoInvitation = {
  brideName: 'Ιωάννα',
  groomName: 'Αλέξανδρος',
  weddingDate: '2025-06-15',
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
      date: '2025-06-15T17:00:00',
      address: 'Εκκλησία Αγίου Νικολάου, Άρτα',
      mapsUrl: null,
    },
    {
      id: '2',
      type: 'RECEPTION' as const,
      name: 'Γαμήλια Δεξίωση',
      date: '2025-06-15T20:00:00',
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
  rsvpDeadline: '2025-05-15',
  musicUrl: null,
  status: 'ACTIVE',
  invitationType: 'MINI_WEBSITE',
};

export default function DemoInvitationPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: 'Γάμος Ιωάννα & Αλέξανδρος',
    startDate: demoInvitation.weddingDate,
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    location: { '@type': 'Place', name: demoInvitation.events[0].name, address: demoInvitation.events[0].address },
    organizer: { '@type': 'Organization', name: 'adinfinity', url: 'https://adinfinity.gr' },
  };

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
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

      <footer className="py-8 text-center text-xs text-[#5c3320]/40 bg-[#fdfaf6] border-t border-[#b8960c]/10">
        Δημιουργήθηκε από{' '}
        <a href="https://adinfinity.gr" className="hover:text-[#b8960c] transition-colors">
          adinfinity.gr
        </a>
      </footer>

      <FloatingBar events={demoInvitation.events} gifts={demoInvitation.giftRegistries} color={demoInvitation.primaryColor} />

      {demoInvitation.musicUrl && <MusicPlayer src={demoInvitation.musicUrl} />}
    </main>
  );
}
