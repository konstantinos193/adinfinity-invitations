import Link from 'next/link';
import { PAGES, type PageKey } from '@/lib/seo';

/** Landing pages that should link to one another. Order is the display order. */
const CLUSTER: PageKey[] = [
  'psifiakes',
  'ilektroniko',
  'rsvp',
  'arta',
  'demo',
];

const BLURB: Record<string, string> = {
  psifiakes: 'Τι περιλαμβάνει και πώς λειτουργεί',
  ilektroniko: 'Η σύγχρονη εναλλακτική στη χάρτινη πρόσκληση',
  rsvp: 'Απαντήσεις καλεσμένων σε πραγματικό χρόνο',
  arta: 'Για ζευγάρια στην Άρτα και την Ήπειρο',
  demo: 'Δείτε ζωντανά ένα δείγμα',
};

const LABEL: Record<string, string> = {
  psifiakes: 'Ψηφιακές προσκλήσεις γάμου',
  ilektroniko: 'Ηλεκτρονικό προσκλητήριο γάμου',
  rsvp: 'Προσκλητήριο με RSVP online',
  arta: 'Προσκλητήρια γάμου Άρτα',
  demo: 'Demo προσκλητήριο',
};

/**
 * Internal links between the topic-cluster pages. Without this each landing
 * page was a dead end that only linked back to `/`, so link equity never
 * flowed between them and crawlers had one path in and out.
 */
export default function RelatedLinks({ current }: { current: PageKey }) {
  const others = CLUSTER.filter((k) => k !== current);

  return (
    <nav
      aria-labelledby="related-heading"
      className="mt-12 pt-8 border-t border-[#01FFFF]/10"
    >
      <h2
        id="related-heading"
        className="text-lg font-bold text-white mb-4"
      >
        Δείτε επίσης
      </h2>
      <ul className="grid gap-3 sm:grid-cols-2">
        {others.map((key) => (
          <li key={key}>
            <Link
              href={PAGES[key].path}
              className="block rounded-xl border border-[#01FFFF]/15 bg-[#071218]/60 p-4 hover:border-[#01FFFF]/40 transition-colors"
            >
              <span className="block text-[#01FFFF] font-semibold">
                {LABEL[key]}
              </span>
              <span className="block text-sm text-white/50 mt-1">
                {BLURB[key]}
              </span>
            </Link>
          </li>
        ))}
      </ul>
      <Link
        href="/"
        className="inline-block mt-6 text-white/50 hover:text-[#01FFFF] transition-colors"
      >
        ← Επιστροφή στην αρχική
      </Link>
    </nav>
  );
}
