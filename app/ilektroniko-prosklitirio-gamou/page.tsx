import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Ηλεκτρονικό Προσκλητήριο Γάμου | adinfinity',
  description: 'Το ηλεκτρονικό προσκλητήριο γάμου είναι η σύγχρονη εναλλακτική λύση για τις χάρτινες προσκλήσεις. Δημιουργήστε το δικό σας mini-site με RSVP, χάρτες και video.',
  openGraph: {
    title: 'Ηλεκτρονικό Προσκλητήριο Γάμου | adinfinity',
    description: 'Mini-site για τον γάμο σας με αντίστροφη μέτρηση, RSVP, χάρτες και video.',
    type: 'website',
    locale: 'el_GR',
  },
};

export default function IlektronikoProsklitirioGamouPage() {
  return (
    <div className="min-h-screen bg-[#07141C] text-white">
      <div className="container mx-auto px-4 py-24 max-w-4xl">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 text-[#01FFFF]">Ηλεκτρονικό Προσκλητήριο Γάμου</h1>
        
        <p className="text-lg text-white/70 mb-8 leading-relaxed">
          Το ηλεκτρονικό προσκλητήριο γάμου είναι η σύγχρονη εναλλακτική λύση για τις παραδοσιακές χάρτινες 
          προσκλήσεις. Με ένα μόνο link, οι καλεσμένοι σας έχουν πρόσβαση σε όλες τις πληροφορίες του γάμου 
          σας — από την τοποθεσία μέχρι το RSVP και τη λίστα δώρων.
        </p>

        <h2 className="text-2xl font-bold mb-4 text-white">Πλεονεκτήματα του ηλεκτρονικού προσκλητηρίου</h2>
        <ul className="space-y-3 mb-8 text-white/80">
          <li>• <strong className="text-[#01FFFF]">Οικολογική λύση</strong> — Χωρίς χαρτί και εκτύπωση</li>
          <li>• <strong className="text-[#01FFFF]">Οικονομική</strong> — Μειωμένο κόστος σε σχέση με τις χάρτινες προσκλήσεις</li>
          <li>• <strong className="text-[#01FFFF]">Πάντα διαθέσιμο</strong> — Οι καλεσμένοι το έχουν πάντα στο κινητό τους</li>
          <li>• <strong className="text-[#01FFFF]">Εύκολη ενημέρωση</strong> — Αλλάζετε λεπτομέρειες ανά πάσα στιγμή</li>
          <li>• <strong className="text-[#01FFFF]">RSVP αυτόματα</strong> — Οι απαντήσεις καταγράφονται αυτόματα</li>
          <li>• <strong className="text-[#01FFFF]">Διαδραστικό</strong> — Χάρτες, video, countdown και φωτογραφίες</li>
        </ul>

        <h2 className="text-2xl font-bold mb-4 text-white">Τι περιλαμβάνει το ηλεκτρονικό προσκλητήριο;</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="bg-[#071218]/80 border border-[#01FFFF]/20 rounded-xl p-6">
            <h3 className="text-lg font-bold mb-2 text-[#01FFFF]">Hero Section</h3>
            <p className="text-white/70 text-sm">Ονόματα, ημερομηνία και εντυπωσιακό background</p>
          </div>
          <div className="bg-[#071218]/80 border border-[#01FFFF]/20 rounded-xl p-6">
            <h3 className="text-lg font-bold mb-2 text-[#01FFFF]">Ιστορία Ζευγαριού</h3>
            <p className="text-white/70 text-sm">Η ιστορία της σχέσης σας με φωτογραφίες</p>
          </div>
          <div className="bg-[#071218]/80 border border-[#01FFFF]/20 rounded-xl p-6">
            <h3 className="text-lg font-bold mb-2 text-[#01FFFF]">Εκδηλώσεις</h3>
            <p className="text-white/70 text-sm">Εκκλησία, δεξίωση και άλλες εκδηλώσεις με χάρτες</p>
          </div>
          <div className="bg-[#071218]/80 border border-[#01FFFF]/20 rounded-xl p-6">
            <h3 className="text-lg font-bold mb-2 text-[#01FFFF]">RSVP Form</h3>
            <p className="text-white/70 text-sm">Φόρμα απάντησης για τους καλεσμένους</p>
          </div>
        </div>

        <div className="bg-[#071218]/80 border border-[#01FFFF]/20 rounded-2xl p-8 mb-8">
          <h3 className="text-xl font-bold mb-4 text-[#01FFFF]">Δείτε ένα παράδειγμα</h3>
          <p className="text-white/70 mb-4">
            Επισκεφθείτε το demo μας για να δείτε πώς λειτουργεί ένα ηλεκτρονικό προσκλητήριο.
          </p>
          <Link
            href="/ioanna-alexandros"
            className="inline-block border-2 border-[#01FFFF] text-[#01FFFF] font-bold py-3 px-6 rounded-full hover:bg-[#01FFFF]/10 transition-colors"
          >
            Δείτε demo →
          </Link>
        </div>

        <div className="text-center">
          <Link
            href="https://adinfinity.gr/contact#contact-form"
            target="_blank"
            rel="noreferrer"
            className="inline-block bg-[#01FFFF] hover:bg-[#01FFFF]/90 text-[#07141C] font-bold py-4 px-8 rounded-full text-lg transition-colors"
          >
            Δημιουργήστε το δικό σας →
          </Link>
        </div>

        <div className="mt-12 pt-8 border-t border-[#01FFFF]/10">
          <Link href="/" className="text-white/50 hover:text-[#01FFFF] transition-colors">
            ← Επιστροφή στην αρχική
          </Link>
        </div>
      </div>
    </div>
  );
}
