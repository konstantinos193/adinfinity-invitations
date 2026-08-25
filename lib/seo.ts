import type { Metadata, MetadataRoute } from 'next';

/* ────────────────────────────────────────────────────────────────
   Single source of truth for SEO.

   Everything that has to agree across the app — canonical URLs,
   sitemap entries, OG image copy, JSON-LD graph — is derived from
   the PAGES registry below. Add a public page here and it lands in
   the sitemap, gets a canonical, and gets an OG image automatically.
   ──────────────────────────────────────────────────────────────── */

export const SITE_URL = 'https://invitations.adinfinity.gr';
export const BRAND_URL = 'https://adinfinity.gr';
export const CONTACT_URL = 'https://adinfinity.gr/contact#contact-form';

export const ORG_ID = `${BRAND_URL}/#organization`;
export const WEBSITE_ID = `${SITE_URL}/#website`;
export const SERVICE_ID = `${SITE_URL}/#service`;

/**
 * Starting price shown as "Πακέτα από €X".
 *
 * Left null until a real figure is confirmed — an invented price on a
 * commercial page is worse than no price at all. Set the number and the anchor
 * renders itself everywhere it's used; nothing else needs changing.
 */
export const PACKAGES_FROM_EUR: number | null = null;

export const LOCALE = 'el_GR';
export const LANG = 'el-GR';
export const SITE_NAME = 'adinfinity — Ψηφιακές Προσκλήσεις';

export interface SeoPage {
  /** Route path, always leading-slash, no trailing slash. */
  path: string;
  /** Fed through the root title template (`%s | adinfinity`) — no brand suffix here. */
  title: string;
  description: string;
  keywords: string[];
  /** Headline burned into the generated OG image. */
  ogHeadline: string;
  ogSub: string;
  priority: number;
  changeFrequency: NonNullable<MetadataRoute.Sitemap[number]['changeFrequency']>;
  /** Bumped by hand when the page's content actually changes — a build-time
   *  `new Date()` would tell Google every page changed on every deploy. */
  lastModified: string;
  /** Keeps the page out of the index and the sitemap. Used for pages still
   *  carrying placeholder content that must not reach search results. */
  noindex?: boolean;
}

export const PAGES = {
  home: {
    path: '/',
    // Targets the "προσκλητήρια" variant on purpose; the "προσκλήσεις"
    // variant is owned by /psifiakes-proskliseis-gamou, so the two pages
    // don't compete for the same query.
    title: 'Ψηφιακά Προσκλητήρια Γάμου με RSVP',
    description:
      'Ψηφιακό προσκλητήριο γάμου σε ένα link: mini site με RSVP online, αντίστροφη μέτρηση, χάρτες Google, λίστα δώρων και video. Σχεδιασμός από την adinfinity, Άρτα.',
    keywords: [
      'ψηφιακά προσκλητήρια γάμου',
      'online προσκλητήριο γάμου',
      'ηλεκτρονικό προσκλητήριο γάμου',
      'προσκλητήριο γάμου με RSVP',
      'ψηφιακή πρόσκληση γάμου',
      'wedding website Ελλάδα',
      'mini site γάμου',
      'ψηφιακό προσκλητήριο βάπτισης',
      'adinfinity',
    ],
    ogHeadline: 'Ψηφιακά Προσκλητήρια Γάμου',
    ogSub: 'Mini site με RSVP online, countdown, χάρτες & video',
    priority: 1,
    changeFrequency: 'weekly',
    lastModified: '2026-08-17',
  },
  psifiakes: {
    path: '/psifiakes-proskliseis-gamou',
    // Retitled away from "Τιμές": the page carries no prices (PACKAGES_FROM_EUR
    // is still null), and promising a figure the page never shows is the kind
    // of title/content mismatch Google rewrites in the SERP.
    //
    // Intent split: adinfinity.gr/psifiako-prosklitirio-gamou sells the service.
    // This page explains how the product works, so the two stop competing.
    title: 'Ψηφιακή Πρόσκληση Γάμου: Πώς Λειτουργεί & Τι Περιλαμβάνει',
    description:
      'Αναλυτικός οδηγός για την ψηφιακή πρόσκληση γάμου: RSVP online, live countdown, χάρτες Google, video, IBAN με ένα tap και dashboard καλεσμένων — βήμα βήμα, με demo.',
    keywords: [
      'ψηφιακές προσκλήσεις γάμου',
      'ψηφιακή πρόσκληση γάμου',
      'ψηφιακό προσκλητήριο',
      'πώς λειτουργεί ψηφιακή πρόσκληση',
      'τι περιλαμβάνει ψηφιακό προσκλητήριο',
      'οικολογικές προσκλήσεις γάμου',
      'πρόσκληση γάμου online',
    ],
    ogHeadline: 'Πώς Λειτουργεί η Ψηφιακή Πρόσκληση',
    ogSub: 'RSVP, countdown, χάρτες, video & IBAN με ένα tap',
    priority: 0.9,
    changeFrequency: 'monthly',
    lastModified: '2026-08-25',
  },
  ilektroniko: {
    path: '/ilektroniko-prosklitirio-gamou',
    // WARNING — this slug is byte-identical to adinfinity.gr's own
    // /ilektroniko-prosklitirio-gamou. That collision is why Google kept the
    // agency page and dropped this one. Both sides must stay differentiated:
    // the agency page sells, this one is the comparison guide (paper vs
    // electronic). Do not retitle this back to a bare service title.
    title: 'Ηλεκτρονικό Προσκλητήριο Γάμου: Οδηγός & Σύγκριση με το Χάρτινο',
    description:
      'Ηλεκτρονικό ή χάρτινο προσκλητήριο γάμου; Αναλυτική σύγκριση σε κόστος, χρόνο, αλλαγές της τελευταίας στιγμής και RSVP — με παραδείγματα και ζωντανό demo.',
    keywords: [
      'ηλεκτρονικό προσκλητήριο γάμου',
      'ηλεκτρονικές προσκλήσεις γάμου',
      'ηλεκτρονικό vs χάρτινο προσκλητήριο',
      'σύγκριση προσκλητηρίων γάμου',
      'digital προσκλητήριο γάμου',
    ],
    ogHeadline: 'Ηλεκτρονικό ή Χάρτινο Προσκλητήριο;',
    ogSub: 'Αναλυτική σύγκριση σε κόστος, χρόνο και αλλαγές',
    priority: 0.9,
    changeFrequency: 'monthly',
    lastModified: '2026-08-25',
  },
  rsvp: {
    path: '/prosklitirio-gamou-rsvp',
    // The only page on this property with real impressions (pos. 28–45 for
    // "rsvp γάμου", "rsvp ελληνικα"). Keep the RSVP keyword dominant here.
    title: 'RSVP Online σε Προσκλητήριο Γάμου: Οδηγός & Demo',
    description:
      'Πώς δουλεύει το RSVP online στον γάμο: οι καλεσμένοι απαντούν από το κινητό χωρίς εγγραφή και βλέπετε συμμετοχές, συνοδούς και διατροφικές προτιμήσεις σε πραγματικό χρόνο.',
    keywords: [
      'προσκλητήριο γάμου RSVP',
      'RSVP online γάμος',
      'RSVP ελληνικά',
      'τι σημαίνει RSVP',
      'φόρμα RSVP γάμου',
      'επιβεβαίωση συμμετοχής γάμου',
      'λίστα καλεσμένων γάμου',
    ],
    ogHeadline: 'RSVP Online σε Προσκλητήριο Γάμου',
    ogSub: 'Απαντήσεις καλεσμένων σε πραγματικό χρόνο',
    priority: 0.9,
    changeFrequency: 'monthly',
    lastModified: '2026-08-25',
  },
  arta: {
    path: '/prosklitiria-gamou-arta',
    title: 'Προσκλητήρια Γάμου Άρτα',
    description:
      'Ψηφιακά προσκλητήρια γάμου στην Άρτα και την Ήπειρο. Σχεδιάζουμε το mini-site του γάμου σας με RSVP, χάρτες και video — από το γραφείο μας στη Βασ. Πύρρου 30.',
    keywords: [
      'προσκλητήρια γάμου Άρτα',
      'προσκλήσεις γάμου Άρτα',
      'ψηφιακά προσκλητήρια Άρτα',
      'προσκλητήρια γάμου Ήπειρος',
      'γάμος Άρτα',
    ],
    ogHeadline: 'Προσκλητήρια Γάμου στην Άρτα',
    ogSub: 'Ψηφιακά προσκλητήρια για Άρτα & Ήπειρο',
    priority: 0.8,
    changeFrequency: 'monthly',
    lastModified: '2026-08-17',
  },
  /* ── Product-variant pages ────────────────────────────────────
     One page per InvitationType (see lib/types.ts). The homepage listed all
     three variants but none had its own URL, so none could rank for the
     distinct intent behind "video προσκλητήριο" vs "wedding website".
     ─────────────────────────────────────────────────────────────── */
  miniWebsite: {
    path: '/mini-website-prosklitirio',
    title: 'Mini Website Προσκλητήριο Γάμου (Wedding Website)',
    description:
      'Το πλήρες mini website γάμου: hero, ιστορία ζευγαριού, εκδηλώσεις με χάρτες, γκαλερί, video, επαφές, λίστα δώρων με IBAN και RSVP — όλα σε μία σελίδα.',
    keywords: [
      'mini website γάμου',
      'wedding website Ελλάδα',
      'site γάμου',
      'ιστοσελίδα γάμου',
      'mini site προσκλητήριο',
    ],
    ogHeadline: 'Mini Website Προσκλητήριο',
    ogSub: 'Το πλήρες site του γάμου σας σε ένα link',
    priority: 0.85,
    changeFrequency: 'monthly',
    lastModified: '2026-08-25',
  },
  videoProsklitirio: {
    path: '/video-prosklitirio-gamou',
    title: 'Video Προσκλητήριο Γάμου',
    description:
      'Video προσκλητήριο γάμου: το βίντεό σας ως hero, γρήγορες ενέργειες για RSVP, εκκλησία, δεξίωση και IBAN, και φόρμα απάντησης κάτω από αυτό.',
    keywords: [
      'video προσκλητήριο γάμου',
      'βίντεο πρόσκληση γάμου',
      'προσκλητήριο γάμου με βίντεο',
      'animated προσκλητήριο',
    ],
    ogHeadline: 'Video Προσκλητήριο Γάμου',
    ogSub: 'Το βίντεό σας ως πρόσκληση, με RSVP από κάτω',
    priority: 0.85,
    changeFrequency: 'monthly',
    lastModified: '2026-08-25',
  },
  videoOnly: {
    path: '/video-only-prosklitirio',
    title: 'Video Only Προσκλητήριο — Minimal Πρόσκληση',
    description:
      'Minimal video προσκλητήριο: ονόματα, ημερομηνία και ένα full-screen βίντεο, χωρίς τίποτα άλλο. Για όσους θέλουν η πρόσκληση να είναι μόνο το βίντεο.',
    keywords: [
      'video only προσκλητήριο',
      'minimal προσκλητήριο γάμου',
      'full screen video πρόσκληση',
      'απλό ψηφιακό προσκλητήριο',
    ],
    ogHeadline: 'Video Only Προσκλητήριο',
    ogSub: 'Ονόματα, ημερομηνία και ένα full-screen video',
    priority: 0.7,
    changeFrequency: 'monthly',
    lastModified: '2026-08-25',
  },
  faq: {
    path: '/syxnes-erotiseis',
    title: 'Συχνές Ερωτήσεις για Ψηφιακά Προσκλητήρια',
    description:
      'Απαντήσεις στις πιο συχνές ερωτήσεις για τα ψηφιακά προσκλητήρια: χρόνος παράδοσης, αλλαγές μετά την αποστολή, RSVP, video, χάρτες, IBAN και τι γίνεται μετά την εκδήλωση.',
    keywords: [
      'ψηφιακό προσκλητήριο ερωτήσεις',
      'πώς λειτουργεί ψηφιακό προσκλητήριο',
      'ψηφιακό προσκλητήριο απορίες',
      'ηλεκτρονικό προσκλητήριο συχνές ερωτήσεις',
    ],
    ogHeadline: 'Συχνές Ερωτήσεις',
    ogSub: 'Ό,τι ρωτούν πιο συχνά για τα ψηφιακά προσκλητήρια',
    priority: 0.8,
    changeFrequency: 'monthly',
    lastModified: '2026-08-25',
  },
  times: {
    path: '/times-psifiakou-prosklitiriou',
    // Deliberately explains how pricing is decided instead of quoting a number.
    // PACKAGES_FROM_EUR is still null and inventing a figure on a commercial
    // page is worse than having none — set that constant and this page can
    // surface it automatically.
    title: 'Τιμές Ψηφιακού Προσκλητηρίου: Τι Επηρεάζει το Κόστος',
    description:
      'Πόσο κοστίζει ένα ψηφιακό προσκλητήριο γάμου; Τι επηρεάζει την τιμή — τύπος πρόσκλησης, video, γκαλερί, RSVP και χρόνος παράδοσης — και πώς δίνουμε προσφορά.',
    keywords: [
      'ψηφιακό προσκλητήριο γάμου τιμή',
      'ψηφιακό προσκλητήριο κόστος',
      'πόσο κοστίζει ψηφιακό προσκλητήριο',
      'τιμές ηλεκτρονικού προσκλητηρίου',
      'online προσκλητήριο γάμου τιμές',
    ],
    ogHeadline: 'Τιμές Ψηφιακού Προσκλητηρίου',
    ogSub: 'Τι επηρεάζει το κόστος και πώς δίνουμε προσφορά',
    priority: 0.85,
    changeFrequency: 'monthly',
    lastModified: '2026-08-25',
  },
  /* ── Non-wedding event cluster ────────────────────────────────
     The product has supported BAPTISM / WEDDING_BAPTISM / BIRTHDAY /
     ANNIVERSARY / EVENT since June 2026 (see lib/types.ts EventCategory) but
     none of it had a landing page, so none of it could rank.

     These slugs are also the only ones on this property with zero overlap
     against adinfinity.gr's sitemap — nothing to cannibalise, which makes them
     the cleanest ranking opportunity the site has.
     ─────────────────────────────────────────────────────────────── */
  vaptisi: {
    path: '/prosklitirio-vaptisis',
    title: 'Ψηφιακό Προσκλητήριο Βάπτισης με RSVP',
    description:
      'Ψηφιακό προσκλητήριο βάπτισης σε ένα link: όνομα και ημερομηνία, χάρτης για εκκλησία και δεξίωση, RSVP online με αριθμό παιδιών και ενηλίκων, φωτογραφίες και video.',
    keywords: [
      'ψηφιακό προσκλητήριο βάπτισης',
      'προσκλητήριο βάπτισης',
      'ηλεκτρονικό προσκλητήριο βάπτισης',
      'προσκλητήρια βάπτισης online',
      'πρόσκληση βάπτισης με RSVP',
      'ψηφιακές προσκλήσεις βάπτισης',
    ],
    ogHeadline: 'Ψηφιακό Προσκλητήριο Βάπτισης',
    ogSub: 'RSVP online, χάρτες, φωτογραφίες & video',
    priority: 0.9,
    changeFrequency: 'monthly',
    lastModified: '2026-08-25',
  },
  vaptisiArta: {
    path: '/prosklitiria-vaptisis-arta',
    title: 'Προσκλητήρια Βάπτισης Άρτα',
    description:
      'Ψηφιακά προσκλητήρια βάπτισης στην Άρτα και την Ήπειρο. Σχεδιάζουμε το προσκλητήριο της βάπτισης με RSVP, χάρτες και φωτογραφίες — από το γραφείο μας στη Βασ. Πύρρου 30.',
    keywords: [
      'προσκλητήρια βάπτισης Άρτα',
      'προσκλήσεις βάπτισης Άρτα',
      'ψηφιακά προσκλητήρια βάπτισης Άρτα',
      'βάπτιση Άρτα',
      'προσκλητήρια βάπτισης Ήπειρος',
    ],
    ogHeadline: 'Προσκλητήρια Βάπτισης στην Άρτα',
    ogSub: 'Ψηφιακά προσκλητήρια για Άρτα & Ήπειρο',
    priority: 0.8,
    changeFrequency: 'monthly',
    lastModified: '2026-08-25',
  },
  gamosVaptisi: {
    path: '/prosklitirio-gamou-vaptisis',
    // WEDDING_BAPTISM is a distinctly Greek combined ceremony with its own
    // search demand and no competing page on either domain.
    title: 'Προσκλητήριο Γάμου & Βάπτισης Μαζί',
    description:
      'Ένα προσκλητήριο για γάμο και βάπτιση μαζί: δύο τελετές, ένα link. Ξεχωριστές ώρες και χάρτες ανά εκδήλωση, ενιαίο RSVP και μία λίστα καλεσμένων για όλα.',
    keywords: [
      'προσκλητήριο γάμου και βάπτισης',
      'γάμος και βάπτιση μαζί',
      'κοινό προσκλητήριο γάμου βάπτισης',
      'ψηφιακό προσκλητήριο γάμου βάπτισης',
      'διπλή τελετή προσκλητήριο',
    ],
    ogHeadline: 'Γάμος & Βάπτιση Μαζί',
    ogSub: 'Δύο τελετές, ένα link, ένα RSVP',
    priority: 0.85,
    changeFrequency: 'monthly',
    lastModified: '2026-08-25',
  },
  genethlia: {
    path: '/prosklitirio-genethlion',
    title: 'Ψηφιακό Προσκλητήριο Γενεθλίων',
    description:
      'Ψηφιακό προσκλητήριο γενεθλίων με RSVP: στείλτε ένα link, δείτε ποιοι θα έρθουν σε πραγματικό χρόνο και αλλάξτε ώρα ή τοποθεσία χωρίς να ξαναστείλετε πρόσκληση.',
    keywords: [
      'ψηφιακό προσκλητήριο γενεθλίων',
      'πρόσκληση γενεθλίων online',
      'ηλεκτρονική πρόσκληση γενεθλίων',
      'προσκλητήριο πάρτι',
      'πρόσκληση πάρτι με RSVP',
    ],
    ogHeadline: 'Ψηφιακό Προσκλητήριο Γενεθλίων',
    ogSub: 'Ένα link, RSVP σε πραγματικό χρόνο',
    priority: 0.75,
    changeFrequency: 'monthly',
    lastModified: '2026-08-25',
  },
  epeteios: {
    path: '/prosklitirio-epeteiou',
    title: 'Ψηφιακό Προσκλητήριο Επετείου Γάμου',
    description:
      'Ψηφιακό προσκλητήριο για επέτειο γάμου: ιστορία του ζευγαριού, γκαλερί φωτογραφιών από τα χρόνια μαζί, χάρτης δεξίωσης και RSVP online σε ένα link.',
    keywords: [
      'προσκλητήριο επετείου γάμου',
      'πρόσκληση επετείου',
      'ψηφιακό προσκλητήριο επετείου',
      'αργυροί γάμοι πρόσκληση',
      'χρυσοί γάμοι πρόσκληση',
    ],
    ogHeadline: 'Προσκλητήριο Επετείου Γάμου',
    ogSub: 'Η ιστορία σας, σε ένα link με RSVP',
    priority: 0.7,
    changeFrequency: 'monthly',
    lastModified: '2026-08-25',
  },
  ekdiloseis: {
    path: '/psifiakes-proskliseis-ekdilosewn',
    title: 'Ψηφιακές Προσκλήσεις Εκδηλώσεων & Εταιρικών Events',
    description:
      'Ψηφιακές προσκλήσεις για εκδηλώσεις, εγκαίνια και εταιρικά events: πρόγραμμα με ώρες, χάρτες, RSVP με λίστα συμμετεχόντων και εξαγωγή σε αρχείο.',
    keywords: [
      'ψηφιακές προσκλήσεις εκδηλώσεων',
      'εταιρική πρόσκληση online',
      'πρόσκληση εκδήλωσης με RSVP',
      'ηλεκτρονική πρόσκληση εγκαινίων',
      'προσκλήσεις events',
    ],
    ogHeadline: 'Προσκλήσεις Εκδηλώσεων',
    ogSub: 'Πρόγραμμα, χάρτες & RSVP με εξαγωγή λίστας',
    priority: 0.7,
    changeFrequency: 'monthly',
    lastModified: '2026-08-25',
  },
  demo: {
    path: '/demo',
    title: 'Demo Προσκλητήριο Γάμου',
    description:
      'Δείτε ζωντανά ένα demo ψηφιακού προσκλητηρίου γάμου — αντίστροφη μέτρηση, ιστορία ζευγαριού, εκδηλώσεις με χάρτες, video και φόρμα RSVP.',
    keywords: [
      'demo προσκλητήριο γάμου',
      'δείγμα ψηφιακής πρόσκλησης',
      'παράδειγμα ηλεκτρονικού προσκλητηρίου',
    ],
    ogHeadline: 'Demo Προσκλητήριο Γάμου',
    ogSub: 'Δείτε ζωντανά πώς είναι μια ψηφιακή πρόσκληση',
    priority: 0.7,
    changeFrequency: 'monthly',
    lastModified: '2026-08-17',
  },
  ioanna: {
    path: '/ioanna-alexandros',
    title: 'Ιωάννα & Αλέξανδρος',
    description:
      'Ψηφιακή πρόσκληση γάμου — Ιωάννα & Αλέξανδρος. Δείγμα mini-site με RSVP online, χάρτες εκδηλώσεων, ιστορία ζευγαριού και λεπτομέρειες δεξίωσης.',
    keywords: ['ψηφιακή πρόσκληση γάμου', 'δείγμα προσκλητηρίου γάμου'],
    ogHeadline: 'Ιωάννα & Αλέξανδρος',
    ogSub: 'Ψηφιακή πρόσκληση γάμου — δείγμα',
    priority: 0.6,
    changeFrequency: 'yearly',
    lastModified: '2026-08-17',
  },
  request: {
    path: '/request',
    title: 'Ζητήστε το Προσκλητήριό σας',
    description:
      'Ζητήστε το ψηφιακό σας προσκλητήριο γάμου. Στείλτε ονόματα, ημερομηνία και τύπο πρόσκλησης — απαντάμε με πρόταση και τιμή.',
    keywords: [
      'παραγγελία ψηφιακού προσκλητηρίου',
      'ζητήστε προσκλητήριο γάμου',
      'τιμή ψηφιακού προσκλητηρίου',
    ],
    ogHeadline: 'Ζητήστε το Προσκλητήριό σας',
    ogSub: 'Στείλτε τα στοιχεία σας και σας απαντάμε με πρόταση',
    priority: 0.9,
    changeFrequency: 'monthly',
    lastModified: '2026-08-17',
  },
  karaiskakia: {
    path: '/karaiskakia-2026',
    title: 'Καραϊσκάκεια 2026 — 200 Χρόνια από τον Γεώργιο Καραϊσκάκη',
    description:
      'Καραϊσκάκεια 2026: εκδηλώσεις μνήμης για τα 200 χρόνια από τον θάνατο του Γεωργίου Καραϊσκάκη — πρόγραμμα, τοποθεσίες και δήλωση συμμετοχής.',
    keywords: [
      'Καραϊσκάκεια 2026',
      'Γεώργιος Καραϊσκάκης',
      'εκδηλώσεις Άρτα 2026',
      'Δήμος Γεωργίου Καραϊσκάκη',
    ],
    ogHeadline: 'Καραϊσκάκεια 2026',
    ogSub: '200 χρόνια από τον Γεώργιο Καραϊσκάκη',
    priority: 0.7,
    changeFrequency: 'monthly',
    lastModified: '2026-08-17',
    // Held back from search on purpose. The page currently renders placeholder
    // event/contact data — including a dummy phone number and an invented
    // `@karaiskaki.gov.gr` address — for a real municipality. Publishing that
    // as indexable content (or as Event structured data) would put fabricated
    // contact details for a public body into Google.
    // Flip to `false`/remove once real programme and contact data are in.
    noindex: true,
  },
} as const satisfies Record<string, SeoPage>;

export type PageKey = keyof typeof PAGES;

/** Absolute URL for a route path. Root collapses to the bare origin. */
export function abs(path: string): string {
  return path === '/' ? SITE_URL : `${SITE_URL}${path}`;
}

/**
 * Builds a complete, self-consistent Metadata object for a registry page.
 *
 * Every page MUST get its own `alternates.canonical`: the root layout declares
 * `canonical: '/'`, and Next inherits it into any segment that doesn't override
 * it — which silently canonicalises that page to the homepage.
 */
export function pageMetadata(key: PageKey): Metadata {
  const p: SeoPage = PAGES[key];
  const url = abs(p.path);

  return {
    title: p.title,
    description: p.description,
    keywords: [...p.keywords],
    alternates: {
      canonical: p.path,
      languages: { [LANG]: p.path, 'x-default': p.path },
    },
    openGraph: {
      type: 'website',
      locale: LOCALE,
      siteName: SITE_NAME,
      url,
      title: p.title,
      description: p.description,
    },
    twitter: {
      card: 'summary_large_image',
      title: p.title,
      description: p.description,
    },
    robots: p.noindex
      ? { index: false, follow: true }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            'max-image-preview': 'large',
            'max-snippet': -1,
            'max-video-preview': -1,
          },
        },
  };
}

/* ── JSON-LD nodes ─────────────────────────────────────────────── */

/** The business entity. Kept identical to adinfinity.gr so Google ties the
 *  subdomain to the established brand rather than treating it as a stranger. */
export const organizationNode = {
  '@type': 'Organization',
  '@id': ORG_ID,
  name: 'adinfinity Advertising Agency',
  alternateName: 'adinfinity',
  url: BRAND_URL,
  logo: {
    '@type': 'ImageObject',
    url: `${BRAND_URL}/logo.png`,
    caption: 'adinfinity',
  },
  image: `${BRAND_URL}/logo.png`,
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Vas. Pirrou 30',
    addressLocality: 'Arta',
    addressRegion: 'Ήπειρος',
    postalCode: '471 32',
    addressCountry: 'GR',
  },
  areaServed: { '@type': 'Country', name: 'Greece' },
  sameAs: [
    'https://www.facebook.com/1.adinfinity',
    'https://www.instagram.com/adinfinityads/',
    'https://www.linkedin.com/in/adinfinity-ads-bb0a398a/?originalSubdomain=gr',
  ],
} as const;

export const websiteNode = {
  '@type': 'WebSite',
  '@id': WEBSITE_ID,
  url: SITE_URL,
  name: SITE_NAME,
  description: PAGES.home.description,
  inLanguage: LANG,
  publisher: { '@id': ORG_ID },
} as const;

export const serviceNode = {
  '@type': 'Service',
  '@id': SERVICE_ID,
  name: 'Ψηφιακές Προσκλήσεις Γάμου & Βάπτισης',
  serviceType: 'Digital wedding & baptism invitations',
  description: PAGES.home.description,
  url: SITE_URL,
  areaServed: { '@type': 'Country', name: 'Greece' },
  provider: { '@id': ORG_ID },
  audience: { '@type': 'Audience', audienceType: 'Ζευγάρια που παντρεύονται' },
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Τύποι ψηφιακών προσκλητηρίων',
    itemListElement: [
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Mini Website Προσκλητήριο',
          description:
            'Πλήρες mini-site: hero, ιστορία ζευγαριού, video, εκδηλώσεις με χάρτες, επαφές, IBAN και RSVP.',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Video Προσκλητήριο',
          description:
            'Βίντεο ως hero, quick action bar (RSVP / Εκκλησία / Δεξίωση / IBAN) και φόρμα RSVP.',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Video Only Προσκλητήριο',
          description:
            'Minimal σχεδίαση: ονόματα, ημερομηνία και ένα full-screen video.',
        },
      },
    ],
  },
} as const;

/**
 * Category-scoped Service node.
 *
 * `serviceNode` above describes the wedding offering. Emitting it on a baptism
 * or birthday page would tell Google those pages are about weddings — the exact
 * signal confusion that keeps a page out of the index for its own topic. Each
 * non-wedding landing page emits its own Service instead.
 */
export function serviceNodeFor(opts: {
  id: string;
  name: string;
  description: string;
  path: string;
  serviceType: string;
  audienceType: string;
}) {
  return {
    '@type': 'Service',
    '@id': `${SITE_URL}/#${opts.id}`,
    name: opts.name,
    serviceType: opts.serviceType,
    description: opts.description,
    url: abs(opts.path),
    areaServed: { '@type': 'Country', name: 'Greece' },
    provider: { '@id': ORG_ID },
    audience: { '@type': 'Audience', audienceType: opts.audienceType },
  };
}

/**
 * HowTo — the ordered "πώς λειτουργεί" steps every landing page shows.
 *
 * Google dropped HowTo *rich results* in 2023, so this earns no SERP decoration.
 * It's emitted because it still feeds entity understanding and is one of the
 * formats AI answer engines parse well when summarising a process.
 */
export function howToNode(
  path: string,
  name: string,
  steps: { name: string; text: string }[],
) {
  return {
    '@type': 'HowTo',
    '@id': `${abs(path)}/#howto`,
    name,
    inLanguage: LANG,
    step: steps.map((s, i) => ({
      '@type': 'HowToStep',
      position: i + 1,
      name: s.name,
      text: s.text,
    })),
  };
}

/** Local-SEO node for the Arta page. Deliberately carries no geo coordinates,
 *  phone or opening hours — those aren't known here, and inventing them would
 *  put false data in front of Google. Add them when confirmed. */
export const localBusinessNode = {
  '@type': 'LocalBusiness',
  '@id': `${BRAND_URL}/#localbusiness`,
  name: 'adinfinity Advertising Agency',
  url: BRAND_URL,
  image: `${BRAND_URL}/logo.png`,
  parentOrganization: { '@id': ORG_ID },
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Vas. Pirrou 30',
    addressLocality: 'Arta',
    addressRegion: 'Ήπειρος',
    postalCode: '471 32',
    addressCountry: 'GR',
  },
  areaServed: [
    { '@type': 'City', name: 'Άρτα' },
    { '@type': 'AdministrativeArea', name: 'Ήπειρος' },
  ],
} as const;

/** BreadcrumbList — the one structured-data type here that still reliably
 *  changes how the result is drawn in Google. */
export function breadcrumbNode(trail: { name: string; path: string }[]) {
  return {
    '@type': 'BreadcrumbList',
    '@id': `${abs(trail[trail.length - 1].path)}/#breadcrumb`,
    itemListElement: trail.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: abs(item.path),
    })),
  };
}

/**
 * @param hasBreadcrumb pass false when the page emits no BreadcrumbList — a
 * `breadcrumb` reference to an @id that isn't in the graph is a dangling node.
 */
export function webPageNode(key: PageKey, hasBreadcrumb = true) {
  const p = PAGES[key];
  return {
    '@type': 'WebPage',
    '@id': `${abs(p.path)}/#webpage`,
    url: abs(p.path),
    name: p.title,
    description: p.description,
    inLanguage: LANG,
    isPartOf: { '@id': WEBSITE_ID },
    about: { '@id': ORG_ID },
    ...(hasBreadcrumb && { breadcrumb: { '@id': `${abs(p.path)}/#breadcrumb` } }),
    primaryImageOfPage: {
      '@type': 'ImageObject',
      url: `${abs(p.path)}/opengraph-image`,
    },
  };
}

/** FAQPage. Note: since Google's Aug-2023 change this rarely renders as a rich
 *  result for commercial sites — it's kept because it is still parsed for
 *  entity understanding and by AI answer engines. */
export function faqNode(path: string, qa: { q: string; a: string }[]) {
  return {
    '@type': 'FAQPage',
    '@id': `${abs(path)}/#faq`,
    mainEntity: qa.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  };
}

/** Wraps nodes into a single @graph document. One script tag per page. */
export function graph(...nodes: object[]) {
  return { '@context': 'https://schema.org', '@graph': nodes };
}