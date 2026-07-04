import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Προσκλητήριο Γάμου με RSVP Online | adinfinity',
  description: 'Δημιουργήστε προσκλητήριο γάμου με RSVP online. Οι καλεσμένοι απαντούν απευθείας από το κινητό τους και εσείς βλέπετε τις απαντήσεις σε πραγματικό χρόνο.',
  openGraph: {
    title: 'Προσκλητήριο Γάμου με RSVP Online | adinfinity',
    description: 'Mini-site για τον γάμο σας με αντίστροφη μέτρηση, RSVP, χάρτες και video.',
    type: 'website',
    locale: 'el_GR',
  },
};

export default function ProsklitirioGamouRsvpPage() {
  return (
    <div className="min-h-screen bg-[#07141C] text-white">
      <div className="container mx-auto px-4 py-24 max-w-4xl">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 text-[#01FFFF]">Προσκλητήριο Γάμου με RSVP Online</h1>
        
        <p className="text-lg text-white/70 mb-8 leading-relaxed">
          Το RSVP online είναι η πιο πρακτική λύση για να μάθετε πόσοι καλεσμένοι θα παρευρεθούν στον γάμο σας. 
          Οι καλεσμένοι απαντούν απευθείας από το κινητό τους, χωρίς να χρειάζεται να τηλεφωνήσουν ή να στείλουν SMS.
        </p>

        <h2 className="text-2xl font-bold mb-4 text-white">Πώς λειτουργεί το RSVP online;</h2>
        <div className="space-y-4 mb-8">
          <div className="bg-[#071218]/80 border border-[#01FFFF]/20 rounded-xl p-6">
            <h3 className="text-lg font-bold mb-2 text-[#01FFFF]">1. Ο καλεσμένος ανοίγει το link</h3>
            <p className="text-white/70">Λαμβάνει το link της πρόσκλησης και το ανοίγει στο κινητό ή στον υπολογιστή του</p>
          </div>
          <div className="bg-[#071218]/80 border border-[#01FFFF]/20 rounded-xl p-6">
            <h3 className="text-lg font-bold mb-2 text-[#01FFFF]">2. Συμπληρώνει τη φόρμα</h3>
            <p className="text-white/70">Επιλέγει αν θα παρευρεθεί, πόσοι άτομα θα έρθουν και προσθέτει σχόλια</p>
          </div>
          <div className="bg-[#071218]/80 border border-[#01FFFF]/20 rounded-xl p-6">
            <h3 className="text-lg font-bold mb-2 text-[#01FFFF]">3. Εσείς βλέπετε τις απαντήσεις</h3>
            <p className="text-white/70">Όλες οι απαντήσεις καταγράφονται αυτόματα στο dashboard σας</p>
          </div>
        </div>

        <h2 className="text-2xl font-bold mb-4 text-white">Πλεονεκτήματα του RSVP online</h2>
        <ul className="space-y-3 mb-8 text-white/80">
          <li>• <strong className="text-[#01FFFF]">Αυτόματη καταγραφή</strong> — Δεν χρειάζεται να σημειώνετε χειροκίνητα</li>
          <li>• <strong className="text-[#01FFFF]">Πραγματικός χρόνος</strong> — Βλέπετε τις απαντήσεις καθώς έρχονται</li>
          <li>• <strong className="text-[#01FFFF]">Εύκολη χρήση</strong> — Οι καλεσμένοι απαντούν με ένα tap</li>
          <li>• <strong className="text-[#01FFFF]">Στατιστικά</strong> — Δείτε ποσοστό συμμετοχής και λεπτομέρειες</li>
          <li>• <strong className="text-[#01FFFF]">Υπενθυμίσεις</strong> — Στείλτε υπενθυμίσεις σε όσους δεν απάντησαν</li>
        </ul>

        <h2 className="text-2xl font-bold mb-4 text-white">Τι πληροφορίες συλλέγουμε;</h2>
        <p className="text-white/70 mb-8 leading-relaxed">
          Η φόρμα RSVP μπορεί να προσαρμοστεί ανάλογα με τις ανάγκες σας. Συνηθισμένα πεδία περιλαμβάνουν: 
          όνομα, τηλέφωνο, αριθμό ατόμων, επιλογή φαγητού (αν υπάρχει), σχόλια και ειδικές ανάγκες.
        </p>

        <div className="bg-[#071218]/80 border border-[#01FFFF]/20 rounded-2xl p-8 mb-8">
          <h3 className="text-xl font-bold mb-4 text-[#01FFFF]">Δείτε το RSVP σε δράση</h3>
          <p className="text-white/70 mb-4">
            Επισκεφθείτε το demo μας για να δείτε πώς λειτουργεί η φόρμα RSVP.
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
            Δημιουργήστε με RSVP →
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
