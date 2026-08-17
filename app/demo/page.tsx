import Link from 'next/link';
import JsonLd from '@/components/JsonLd';
import RelatedLinks from '@/components/RelatedLinks';
import {
  PAGES,
  breadcrumbNode,
  graph,
  pageMetadata,
  serviceNode,
  webPageNode,
} from '@/lib/seo';

export const metadata = pageMetadata('demo');

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-[#07141C] text-white">
      <JsonLd
        data={graph(
          webPageNode('demo'),
          breadcrumbNode([
            { name: 'Αρχική', path: '/' },
            { name: 'Demo Προσκλητήριο Γάμου', path: PAGES.demo.path },
          ]),
          serviceNode,
        )}
      />
      <div className="container mx-auto px-4 py-24 max-w-4xl">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 text-[#01FFFF]">Demo Προσκλητήριο Γάμου</h1>
        
        <p className="text-lg text-white/70 mb-8 leading-relaxed">
          Δείτε ένα παράδειγμα ψηφιακού προσκλητηρίου γάμου. Το demo δείχνει πώς λειτουργεί ένα 
          mini-site με όλες τις λειτουργίες: αντίστροφη μέτρηση, RSVP, χάρτες, video και πολλά άλλα.
        </p>

        <div className="bg-[#071218]/80 border border-[#01FFFF]/20 rounded-2xl p-8 mb-8">
          <h2 className="text-2xl font-bold mb-4 text-[#01FFFF]">Δείτε το demo</h2>
          <p className="text-white/70 mb-6">
            Πατήστε το παρακάτω κουμπί για να δείτε ένα πλήρες demo προσκλητηρίου γάμου για το ζευγάρι 
            Ιωάννα & Αλέξανδρος.
          </p>
          <Link
            href="/ioanna-alexandros"
            className="inline-block bg-[#01FFFF] hover:bg-[#01FFFF]/90 text-[#07141C] font-bold py-4 px-8 rounded-full text-lg transition-colors"
          >
            Δείτε demo →
          </Link>
        </div>

        <h2 className="text-2xl font-bold mb-4 text-white">Τι θα δείτε στο demo;</h2>
        <ul className="space-y-3 mb-8 text-white/80">
          <li>• <strong className="text-[#01FFFF]">Hero Section</strong> — Ονόματα, ημερομηνία και εντυπωσιακό background</li>
          <li>• <strong className="text-[#01FFFF]">Αντίστροφη Μέτρηση</strong> — Live countdown μέχρι την ημέρα του γάμου</li>
          <li>• <strong className="text-[#01FFFF]">Ιστορία Ζευγαριού</strong> — Η ιστορία της σχέσης με φωτογραφίες</li>
          <li>• <strong className="text-[#01FFFF]">Εκδηλώσεις</strong> — Εκκλησία και δεξίωση με χάρτες Google</li>
          <li>• <strong className="text-[#01FFFF]">Επαφές</strong> — Τηλέφωνα κουμπάρων και συγγενών</li>
          <li>• <strong className="text-[#01FFFF]">Λίστα Δώρων</strong> — IBAN με ένα tap για αντιγραφή</li>
          <li>• <strong className="text-[#01FFFF]">RSVP Form</strong> — Φόρμα απάντησης για τους καλεσμένους</li>
        </ul>

        <h2 className="text-2xl font-bold mb-4 text-white">Τύποι Προσκλήσεων</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-[#071218]/80 border border-[#01FFFF]/20 rounded-xl p-6">
            <h3 className="text-lg font-bold mb-2 text-[#01FFFF]">Mini Website</h3>
            <p className="text-white/70 text-sm">Πλήρες mini-site με όλες τις λειτουργίες</p>
          </div>
          <div className="bg-[#071218]/80 border border-[#01FFFF]/20 rounded-xl p-6">
            <h3 className="text-lg font-bold mb-2 text-[#01FFFF]">Video Προσκλητήριο</h3>
            <p className="text-white/70 text-sm">Βίντεο ως hero με quick action bar</p>
          </div>
          <div className="bg-[#071218]/80 border border-[#01FFFF]/20 rounded-xl p-6">
            <h3 className="text-lg font-bold mb-2 text-[#01FFFF]">Video Only</h3>
            <p className="text-white/70 text-sm">Minimal design με μόνο video</p>
          </div>
        </div>

        <div className="text-center">
          <Link
            href="/request"
            className="inline-block bg-[#01FFFF] hover:bg-[#01FFFF]/90 text-[#07141C] font-bold py-4 px-8 rounded-full text-lg transition-colors"
          >
            Δημιουργήστε το δικό σας →
          </Link>
        </div>

        <RelatedLinks current="demo" />
      </div>
    </div>
  );
}
