import JsonLd from '@/components/JsonLd';
import RequestForm from '@/components/RequestForm';
import {
  PACKAGES_FROM_EUR,
  PAGES,
  breadcrumbNode,
  graph,
  pageMetadata,
  serviceNode,
  webPageNode,
} from '@/lib/seo';

export const metadata = pageMetadata('request');

const STEPS = [
  'Στέλνετε τα στοιχεία σας από τη φόρμα.',
  'Σας απαντάμε με πρόταση, χρονοδιάγραμμα και τιμή.',
  'Φτιάχνουμε το προσκλητήριο και το ελέγχετε πριν δημοσιευτεί.',
];

export default function RequestPage() {
  return (
    <div className="min-h-screen bg-[#07141C] text-white">
      <JsonLd
        data={graph(
          webPageNode('request'),
          breadcrumbNode([
            { name: 'Αρχική', path: '/' },
            { name: 'Ζητήστε το προσκλητήριό σας', path: PAGES.request.path },
          ]),
          serviceNode,
        )}
      />

      <div className="container mx-auto px-4 py-24 max-w-3xl">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 text-[#01FFFF]">
          Ζητήστε το προσκλητήριό σας
        </h1>

        <p className="text-lg text-white/70 mb-4 leading-relaxed">
          Συμπληρώστε τα βασικά και σας απαντάμε με πρόταση και τιμή. Δεν
          χρειάζεται να έχετε αποφασίσει τα πάντα — τα υπόλοιπα τα βρίσκουμε
          μαζί.
        </p>

        {PACKAGES_FROM_EUR !== null && (
          <p className="mb-8 inline-block rounded-full border border-[#01FFFF]/30 bg-[#01FFFF]/5 px-5 py-2 text-sm">
            <span className="text-white/60">Πακέτα από</span>{' '}
            <span className="font-bold text-[#01FFFF]">
              €{PACKAGES_FROM_EUR}
            </span>
          </p>
        )}

        <ol className="mb-10 space-y-3 text-white/70">
          {STEPS.map((step, i) => (
            <li key={step} className="flex gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#01FFFF]/10 text-xs font-bold text-[#01FFFF]">
                {i + 1}
              </span>
              <span>{step}</span>
            </li>
          ))}
        </ol>

        <RequestForm />
      </div>
    </div>
  );
}
