import Link from 'next/link';
import JsonLd from '@/components/JsonLd';
import RelatedLinks from '@/components/RelatedLinks';
import {
  CONTACT_URL,
  PAGES,
  breadcrumbNode,
  faqNode,
  graph,
  pageMetadata,
  serviceNode,
  webPageNode,
} from '@/lib/seo';

export const metadata = pageMetadata('psifiakes');

const FAQ = [
  {
    q: 'Τι είναι η ψηφιακή πρόσκληση γάμου;',
    a: 'Είναι ένα mini-site με δική του διεύθυνση, που περιέχει όλες τις λεπτομέρειες του γάμου σας — ονόματα, ημερομηνία, αντίστροφη μέτρηση, εκδηλώσεις με χάρτες, video και φόρμα RSVP. Το στέλνετε ως ένα link σε όλους τους καλεσμένους, χωρίς εκτύπωση και χωρίς αποστολή.',
  },
  {
    q: 'Χρειάζεται οι καλεσμένοι να εγκαταστήσουν εφαρμογή;',
    a: 'Όχι. Η πρόσκληση ανοίγει σε οποιονδήποτε browser, σε κινητό, tablet ή υπολογιστή. Δεν απαιτείται εγκατάσταση ούτε εγγραφή για να απαντήσουν στο RSVP.',
  },
  {
    q: 'Μπορώ να αλλάξω λεπτομέρειες μετά την αποστολή;',
    a: 'Ναι. Επειδή όλοι βλέπουν το ίδιο link, κάθε αλλαγή σε ώρα, τοποθεσία ή πρόγραμμα εμφανίζεται αμέσως σε όλους — κάτι αδύνατο με χάρτινες προσκλήσεις.',
  },
  {
    q: 'Πώς βλέπω ποιοι θα έρθουν;',
    a: 'Οι απαντήσεις καταγράφονται αυτόματα σε dashboard, με αριθμό ατόμων, συνοδούς και σχόλια. Βλέπετε τα στατιστικά σε πραγματικό χρόνο και μπορείτε να τα εξάγετε.',
  },
  {
    q: 'Πόσο καιρό παραμένει online η πρόσκληση;',
    a: 'Η πρόσκληση παραμένει ενεργή πριν και μετά τον γάμο, ώστε οι καλεσμένοι να έχουν πρόσβαση στις πληροφορίες όποτε τις χρειαστούν.',
  },
];

export default function PsifiakesProskliseisGamouPage() {
  return (
    <div className="min-h-screen bg-[#07141C] text-white">
      <JsonLd
        data={graph(
          webPageNode('psifiakes'),
          breadcrumbNode([
            { name: 'Αρχική', path: '/' },
            { name: 'Ψηφιακές Προσκλήσεις Γάμου', path: PAGES.psifiakes.path },
          ]),
          serviceNode,
          faqNode(PAGES.psifiakes.path, FAQ),
        )}
      />
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
            href={CONTACT_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-block bg-[#01FFFF] hover:bg-[#01FFFF]/90 text-[#07141C] font-bold py-4 px-8 rounded-full text-lg transition-colors"
          >
            Ζητήστε την πρόσκλησή σας →
          </Link>
        </div>

        {/* Rendered visibly on purpose: FAQPage structured data must reflect
            content the user can actually see on the page. */}
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

        <RelatedLinks current="psifiakes" />
      </div>
    </div>
  );
}
