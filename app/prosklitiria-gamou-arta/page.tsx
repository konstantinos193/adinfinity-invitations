import Link from 'next/link';
import JsonLd from '@/components/JsonLd';
import RelatedLinks from '@/components/RelatedLinks';
import {
  PAGES,
  breadcrumbNode,
  faqNode,
  graph,
  localBusinessNode,
  pageMetadata,
  serviceNode,
  webPageNode,
} from '@/lib/seo';

export const metadata = pageMetadata('arta');

const FAQ = [
  {
    q: 'Εξυπηρετείτε ζευγάρια εκτός Άρτας;',
    a: 'Ναι. Το προσκλητήριο σχεδιάζεται και παραδίδεται εξ ολοκλήρου ψηφιακά, οπότε συνεργαζόμαστε με ζευγάρια σε όλη την Ήπειρο και την Ελλάδα. Το γραφείο μας βρίσκεται στη Βασ. Πύρρου 30 στην Άρτα για όσους προτιμούν δια ζώσης συνάντηση.',
  },
  {
    q: 'Μπορείτε να προσθέσετε τοποθεσίες γάμου στην Άρτα;',
    a: 'Ναι. Κάθε εκδήλωση — εκκλησία, δεξίωση, δείπνο — μπαίνει με ακριβή διεύθυνση και σύνδεσμο Google Maps, ώστε οι καλεσμένοι να πλοηγηθούν με ένα tap.',
  },
  {
    q: 'Πόσο χρόνο χρειάζεται η δημιουργία;',
    a: 'Αφού λάβουμε τα στοιχεία και το φωτογραφικό υλικό σας, το προσκλητήριο είναι συνήθως έτοιμο για έλεγχο μέσα σε λίγες ημέρες, με διορθώσεις πριν την τελική δημοσίευση.',
  },
];

export default function ProsklitiriaGamouArtaPage() {
  return (
    <div className="min-h-screen bg-[#07141C] text-white">
      <JsonLd
        data={graph(
          webPageNode('arta'),
          breadcrumbNode([
            { name: 'Αρχική', path: '/' },
            { name: 'Προσκλητήρια Γάμου Άρτα', path: PAGES.arta.path },
          ]),
          localBusinessNode,
          serviceNode,
          faqNode(PAGES.arta.path, FAQ),
        )}
      />
      <div className="container mx-auto px-4 py-24 max-w-4xl">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 text-[#01FFFF]">Προσκλήσεις Γάμου Άρτα</h1>
        
        <p className="text-lg text-white/70 mb-8 leading-relaxed">
          Η adinfinity προσφέρει ψηφιακές προσκλήσεις γάμου στην Άρτα και σε όλη την Ελλάδα. Δημιουργούμε 
          όμορφα mini-sites για τον γάμο σας με αντίστροφη μέτρηση, RSVP online, χάρτες Google, video και 
          πολλά άλλα.
        </p>

        <h2 className="text-2xl font-bold mb-4 text-white">Υπηρεσίες στην Άρτα</h2>
        <ul className="space-y-3 mb-8 text-white/80">
          <li>• <strong className="text-[#01FFFF]">Ψηφιακές Προσκλήσεις</strong> — Mini-site για τον γάμο σας</li>
          <li>• <strong className="text-[#01FFFF]">RSVP Online</strong> — Αυτόματη καταγραφή απαντήσεων</li>
          <li>• <strong className="text-[#01FFFF]">Google Maps</strong> — Ακριβείς τοποθεσίες στην Άρτα</li>
          <li>• <strong className="text-[#01FFFF]">Video Πρόσκληση</strong> — Ενσωματωμένο βίντεο</li>
          <li>• <strong className="text-[#01FFFF]">Διαχείριση Καλεσμένων</strong> — Dashboard με στατιστικά</li>
        </ul>

        <h2 className="text-2xl font-bold mb-4 text-white">Γιατί adinfinity στην Άρτα;</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="bg-[#071218]/80 border border-[#01FFFF]/20 rounded-xl p-6">
            <h3 className="text-lg font-bold mb-2 text-[#01FFFF]">Τοπική Εξυπηρέτηση</h3>
            <p className="text-white/70 text-sm">Βρισκόμαστε στην Άρτα και καταλαβαίνουμε τις ανάγκες της περιοχής</p>
          </div>
          <div className="bg-[#071218]/80 border border-[#01FFFF]/20 rounded-xl p-6">
            <h3 className="text-lg font-bold mb-2 text-[#01FFFF]">Γρήγορη Παράδοση</h3>
            <p className="text-white/70 text-sm">Το mini-site σας είναι έτοιμο σε 24 ώρες</p>
          </div>
          <div className="bg-[#071218]/80 border border-[#01FFFF]/20 rounded-xl p-6">
            <h3 className="text-lg font-bold mb-2 text-[#01FFFF]">Επαγγελματικό Design</h3>
            <p className="text-white/70 text-sm">Μοντέρνα και κομψά designs για κάθε γούστο</p>
          </div>
          <div className="bg-[#071218]/80 border border-[#01FFFF]/20 rounded-xl p-6">
            <h3 className="text-lg font-bold mb-2 text-[#01FFFF]">Υποστήριξη</h3>
            <p className="text-white/70 text-sm">Διαθέσιμη υποστήριξη για τυχόν ερωτήσεις</p>
          </div>
        </div>

        <h2 className="text-2xl font-bold mb-4 text-white">Δημοφιλείς τοποθεσίες στην Άρτα</h2>
        <p className="text-white/70 mb-8 leading-relaxed">
          Δημιουργούμε προσκλήσεις για γάμους σε όλες τις δημοφιλείς τοποθεσίες της Άρτας: 
          Εκκλησία Αγίου Νικολάου, Κέντρα Εκδηλώσεων, παραδοσιακά ξενοδοχεία και πολλά άλλα. 
          Οι χάρτες Google ενσωματώνονται αυτόματα στο mini-site σας.
        </p>

        <div className="bg-[#071218]/80 border border-[#01FFFF]/20 rounded-2xl p-8 mb-8">
          <h3 className="text-xl font-bold mb-4 text-[#01FFFF]">Επικοινωνήστε μαζί μας</h3>
          <p className="text-white/70 mb-4">
            Είμαστε στην Άρτα και είμαστε έτοιμοι να δημιουργήσουμε την πρόσκληση του γάμου σας.
          </p>
          <Link
            href="https://adinfinity.gr/contact#contact-form"
            target="_blank"
            rel="noreferrer"
            className="inline-block bg-[#01FFFF] hover:bg-[#01FFFF]/90 text-[#07141C] font-bold py-3 px-6 rounded-full transition-colors"
          >
            Επικοινωνήστε μαζί μας →
          </Link>
        </div>

        <div className="text-center">
          <Link
            href="/ioanna-alexandros"
            className="inline-block border-2 border-[#01FFFF] text-[#01FFFF] font-bold py-3 px-6 rounded-full hover:bg-[#01FFFF]/10 transition-colors"
          >
            Δείτε demo →
          </Link>
        </div>

        {/* Visible counterpart to the FAQPage structured data above. */}
        <section className="mt-16">
          <h2 className="text-2xl font-bold mb-6 text-white">Συχνές ερωτήσεις</h2>
          <div className="space-y-4">
            {FAQ.map(({ q, a }) => (
              <details
                key={q}
                className="group rounded-xl border border-[#01FFFF]/15 bg-[#071218]/60 p-5"
              >
                <summary className="cursor-pointer font-semibold text-[#01FFFF] marker:content-['']">
                  {q}
                </summary>
                <p className="mt-3 text-white/70 leading-relaxed">{a}</p>
              </details>
            ))}
          </div>
        </section>

        <RelatedLinks current="arta" />
      </div>
    </div>
  );
}
