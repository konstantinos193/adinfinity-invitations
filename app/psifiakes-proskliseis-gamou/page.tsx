import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Ψηφιακές Προσκλήσεις Γάμου | adinfinity',
  description: 'Δημιουργήστε την ψηφιακή πρόσκληση γάμου σας — mini-site με αντίστροφη μέτρηση, RSVP online, χάρτες Google, λίστα δώρων και video. Ένα μόνο link για όλους τους καλεσμένους.',
  openGraph: {
    title: 'Ψηφιακές Προσκλήσεις Γάμου | adinfinity',
    description: 'Mini-site για τον γάμο σας με αντίστροφη μέτρηση, RSVP, χάρτες και video.',
    type: 'website',
    locale: 'el_GR',
  },
};

export default function PsifiakesProskliseisGamouPage() {
  return (
    <div className="min-h-screen bg-[#07141C] text-white">
      <div className="container mx-auto px-4 py-24 max-w-4xl">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 text-[#01FFFF]">Ψηφιακές Προσκλήσεις Γάμου</h1>
        
        <p className="text-lg text-white/70 mb-8 leading-relaxed">
          Οι ψηφιακές προσκλήσεις γάμου είναι η σύγχρονη λύση για να προσκαλέσετε τους καλεσμένους σας με έναν 
          όμορφο και λειτουργικό τρόπο. Αντί για χάρτινες προσκλήσεις που χάνουν ή ξεχνούν, ένα ψηφιακό 
          προσκλητήριο είναι πάντα διαθέσιμο στο κινητό τους.
        </p>

        <h2 className="text-2xl font-bold mb-4 text-white">Τι προσφέρουμε</h2>
        <ul className="space-y-3 mb-8 text-white/80">
          <li>• <strong className="text-[#01FFFF]">RSVP Online</strong> — Οι καλεσμένοι απαντούν απευθείας από το κινητό τους</li>
          <li>• <strong className="text-[#01FFFF]">Αντίστροφη Μέτρηση</strong> — Live countdown μέχρι την ημέρα του γάμου</li>
          <li>• <strong className="text-[#01FFFF]">Χάρτες Google</strong> — Ακριβείς τοποθεσίες για εκκλησία και δεξίωση</li>
          <li>• <strong className="text-[#01FFFF]">Video</strong> — Ενσωματωμένο βίντεο από YouTube ή Vimeo</li>
          <li>• <strong className="text-[#01FFFF]">IBAN με 1 Tap</strong> — Αντιγραφή τραπεζικού λογαριασμού χωρίς λάθη</li>
          <li>• <strong className="text-[#01FFFF]">Διαχείριση Καλεσμένων</strong> — Dashboard με στατιστικά RSVPs</li>
        </ul>

        <h2 className="text-2xl font-bold mb-4 text-white">Γιατί να επιλέξετε ψηφιακή πρόσκληση;</h2>
        <p className="text-white/70 mb-8 leading-relaxed">
          Οι ψηφιακές προσκλήσεις είναι οικολογικές, οικονομικές και πιο πρακτικές. Δεν χρειάζεται να 
          εκτυπώσετε και να στείλετε χάρτινες προσκλήσεις. Μπορείτε να ενημερώσετε τις λεπτομέρειες ανά πάσα 
          στιγμή και οι καλεσμένοι σας έχουν πάντα πρόσβαση σε όλες τις πληροφορίες.
        </p>

        <div className="bg-[#071218]/80 border border-[#01FFFF]/20 rounded-2xl p-8 mb-8">
          <h3 className="text-xl font-bold mb-4 text-[#01FFFF]">Πώς λειτουργεί;</h3>
          <ol className="space-y-3 text-white/80 list-decimal list-inside">
            <li>Επικοινωνείτε μαζί μας με τα στοιχεία του γάμου σας</li>
            <li>Φτιάχνουμε το δικό σας mini-site με φωτογραφίες και ιστορία</li>
            <li>Στέλνετε τον σύνδεσμο σε όλους τους καλεσμένους</li>
          </ol>
        </div>

        <div className="text-center">
          <Link
            href="https://adinfinity.gr/contact#contact-form"
            target="_blank"
            rel="noreferrer"
            className="inline-block bg-[#01FFFF] hover:bg-[#01FFFF]/90 text-[#07141C] font-bold py-4 px-8 rounded-full text-lg transition-colors"
          >
            Ζητήστε την πρόσκλησή σας →
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
