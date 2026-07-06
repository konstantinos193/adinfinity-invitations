import type { Metadata } from 'next';
import EventHeritageHero from '@/components/templates/EventHeritageHero';
import EventsSection from '@/components/EventsSection';
import ContactsSection from '@/components/ContactsSection';
import RSVPForm from '@/components/RSVPForm';

export const metadata: Metadata = {
  title: 'Καραϊσκάκεια 2026 | adinfinity',
  description: 'Επετείου 200 ετών από τον θάνατο του Γεωργίου Καραϊσκάκη. Εκδηλώσεις τιμής στη μνήμη του Αρχιστράτηγου της Ελληνικής Επανάστασης.',
  openGraph: {
    title: 'Καραϊσκάκεια 2026',
    description: 'Επετείου 200 ετών από τον θάνατο του Γεωργίου Καραϊσκάκη. Εκδηλώσεις τιμής στη μνήμη του Αρχιστράτηγου της Ελληνικής Επανάστασης.',
    type: 'website',
    locale: 'el_GR',
  },
};

const mockEvents = [
  {
    id: '1',
    type: 'CEREMONY' as const,
    name: 'Επιμνημόσυνη Τελετή',
    date: '2026-04-23T10:00:00',
    address: 'Πλατεία Γεωργίου Καραϊσκάκη, Άρτα',
    mapsUrl: 'https://maps.google.com/?q=Πλατεία+Γεωργίου+Καραϊσκάκη+Άρτα',
  },
  {
    id: '2',
    type: 'RECEPTION' as const,
    name: 'Παρέλαση & Εκδηλώσεις',
    date: '2026-04-23T12:00:00',
    address: 'Κέντρο Πόλης Άρτας',
    mapsUrl: 'https://maps.google.com/?q=Κέντρο+Πόλης+Άρτας',
  },
];

const mockContacts = [
  {
    id: '1',
    role: 'HOST' as const,
    name: 'Δήμος Γ. Καραϊσκάκη',
    phone: '+30 26810 12345',
    email: 'info@karaiskaki.gov.gr',
  },
];

export default function Karaiskakia2026Page() {
  return (
    <main>
      <EventHeritageHero
        eventTitle="Καραϊσκάκεια 2026"
        hostName="Δήμος Γεωργίου Καραϊσκάκη"
        subtitle="Αρχιστράτηγος Ελληνικής Επανάστασης"
        quote="Ο θάνατός μου θα είναι η αρχή της νίκης μας"
        eventDate="2026-04-23"
        photoUrl="https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=1200&h=800&fit=crop"
        logoUrl="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/Flag_of_Greece_%281822-1978%29.svg/1200px-Flag_of_Greece_%281822-1978%29.svg.png"
        fontFamily="GFS Didot"
        fontColor="#f3ecd8"
      />

      <EventsSection events={mockEvents} color="#b8960c" />

      <ContactsSection contacts={mockContacts} color="#b8960c" />

      <RSVPForm slug="karaiskakia-2026" rsvpDeadline="2026-04-15" color="#b8960c" />

      <footer className="py-8 text-center text-xs text-[#5c3320]/40 bg-[#fdfaf6] border-t border-[#b8960c]/10">
        Δημιουργήθηκε από{' '}
        <a href="https://adinfinity.gr" className="hover:text-[#b8960c] transition-colors">
          adinfinity.gr
        </a>
      </footer>
    </main>
  );
}
