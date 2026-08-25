import Link from 'next/link';
import { PAGES, type PageKey } from '@/lib/seo';

/**
 * Internal links between landing pages.
 *
 * Without this each page was a dead end that only linked back to `/`, so link
 * equity never flowed sideways and crawlers had one path in and out.
 *
 * Pages are grouped into two topic clusters. A page links to its siblings in
 * full, plus a couple of bridges into the other cluster — linking all 11 pages
 * from all 11 pages would dilute every link on the site and read as a footer
 * dump rather than navigation.
 */
const WEDDING: PageKey[] = [
  'psifiakes',
  'ilektroniko',
  'rsvp',
  'miniWebsite',
  'videoProsklitirio',
  'videoOnly',
  'times',
  'faq',
  'arta',
  'demo',
];

const EVENTS: PageKey[] = [
  'vaptisi',
  'gamosVaptisi',
  'vaptisiArta',
  'genethlia',
  'epeteios',
  'ekdiloseis',
];

/** Bridges shown to the *other* cluster, in order of commercial value. */
const BRIDGE_INTO_EVENTS: PageKey[] = ['vaptisi', 'gamosVaptisi'];
const BRIDGE_INTO_WEDDING: PageKey[] = ['psifiakes', 'rsvp'];

const LABEL: Record<PageKey, string> = {
  home: 'Αρχική',
  psifiakes: 'Ψηφιακή πρόσκληση γάμου: πώς λειτουργεί',
  ilektroniko: 'Ηλεκτρονικό vs χάρτινο προσκλητήριο',
  rsvp: 'RSVP online σε προσκλητήριο γάμου',
  arta: 'Προσκλητήρια γάμου Άρτα',
  demo: 'Demo προσκλητήριο',
  vaptisi: 'Ψηφιακό προσκλητήριο βάπτισης',
  vaptisiArta: 'Προσκλητήρια βάπτισης Άρτα',
  gamosVaptisi: 'Γάμος & βάπτιση μαζί',
  genethlia: 'Προσκλητήριο γενεθλίων',
  epeteios: 'Προσκλητήριο επετείου',
  ekdiloseis: 'Προσκλήσεις εκδηλώσεων',
  miniWebsite: 'Mini website προσκλητήριο',
  videoProsklitirio: 'Video προσκλητήριο γάμου',
  videoOnly: 'Video only προσκλητήριο',
  faq: 'Συχνές ερωτήσεις',
  times: 'Τιμές και τι επηρεάζει το κόστος',
  ioanna: 'Δείγμα: Ιωάννα & Αλέξανδρος',
  request: 'Ζητήστε το προσκλητήριό σας',
  karaiskakia: 'Καραϊσκάκεια 2026',
};

const BLURB: Record<PageKey, string> = {
  home: 'Επιστροφή στην αρχική',
  psifiakes: 'Τι περιλαμβάνει, βήμα βήμα',
  ilektroniko: 'Σύγκριση σε κόστος, χρόνο και αλλαγές',
  rsvp: 'Απαντήσεις καλεσμένων σε πραγματικό χρόνο',
  arta: 'Για ζευγάρια στην Άρτα και την Ήπειρο',
  demo: 'Δείτε ζωντανά ένα δείγμα',
  vaptisi: 'RSVP με παιδιά και ενήλικες ξεχωριστά',
  vaptisiArta: 'Βάπτιση στην Άρτα και την Ήπειρο',
  gamosVaptisi: 'Δύο τελετές, ένα link, ένα RSVP',
  genethlia: 'Πάρτι και γενέθλια με RSVP',
  epeteios: 'Επέτειος γάμου με γκαλερί και RSVP',
  ekdiloseis: 'Εκδηλώσεις, εγκαίνια και εταιρικά events',
  miniWebsite: 'Το πλήρες site του γάμου σε ένα link',
  videoProsklitirio: 'Το βίντεό σας ως πρόσκληση, με RSVP',
  videoOnly: 'Minimal: ονόματα, ημερομηνία, video',
  faq: 'Χρόνος, αλλαγές, RSVP και τι γίνεται μετά',
  times: 'Πώς διαμορφώνεται η προσφορά',
  ioanna: 'Πλήρες mini-site σε λειτουργία',
  request: 'Στείλτε τα στοιχεία σας',
  karaiskakia: '',
};

function LinkCard({ pageKey }: { pageKey: PageKey }) {
  return (
    <li>
      <Link
        href={PAGES[pageKey].path}
        className="block rounded-xl border border-[#01FFFF]/15 bg-[#071218]/60 p-4 hover:border-[#01FFFF]/40 transition-colors h-full"
      >
        <span className="block text-[#01FFFF] font-semibold">
          {LABEL[pageKey]}
        </span>
        <span className="block text-sm text-white/50 mt-1">
          {BLURB[pageKey]}
        </span>
      </Link>
    </li>
  );
}

export default function RelatedLinks({ current }: { current: PageKey }) {
  const inEvents = EVENTS.includes(current);
  const siblings = (inEvents ? EVENTS : WEDDING).filter((k) => k !== current);
  const bridges = (inEvents ? BRIDGE_INTO_WEDDING : BRIDGE_INTO_EVENTS).filter(
    (k) => k !== current,
  );

  return (
    <nav
      aria-labelledby="related-heading"
      className="mt-16 pt-8 border-t border-[#01FFFF]/10"
    >
      <h2 id="related-heading" className="text-lg font-bold text-white mb-4">
        Δείτε επίσης
      </h2>
      <ul className="grid gap-3 sm:grid-cols-2">
        {siblings.map((key) => (
          <LinkCard key={key} pageKey={key} />
        ))}
      </ul>

      <h2 className="text-lg font-bold text-white mt-8 mb-4">
        {inEvents ? 'Για γάμο' : 'Για άλλες εκδηλώσεις'}
      </h2>
      <ul className="grid gap-3 sm:grid-cols-2">
        {bridges.map((key) => (
          <LinkCard key={key} pageKey={key} />
        ))}
      </ul>

      <Link
        href="/"
        className="inline-block mt-8 text-white/50 hover:text-[#01FFFF] transition-colors"
      >
        ← Επιστροφή στην αρχική
      </Link>
    </nav>
  );
}
