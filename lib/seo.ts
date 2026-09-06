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
    title: 'Ψηφιακό Προσκλητήριο Γάμου σε 24h - RSVP Online',
    description:
      'Σχεδιάζουμε το ψηφιακό προσκλητήριό σας σε λιγότερο από 24 ώρες. Mini-site με RSVP online, countdown, χάρτες Google και video — όλα σε ένα link. Ζητήστε προσφορά σήμερα.',
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
    lastModified: '2026-09-06',
  },
  psifiakes: {
    path: '/psifiakes-proskliseis-gamou',
    // Retitled away from "Τιμές": the page carries no prices (PACKAGES_FROM_EUR
    // is still null), and promising a figure the page never shows is the kind
    // of title/content mismatch Google rewrites in the SERP.
    //
    // Intent split: adinfinity.gr/psifiako-prosklitirio-gamou sells the service.
    // This page explains how the product works, so the two stop competing.
    title: 'Ψηφιακές Προσκλήσεις Γάμου - Ολοκληρωμένος Οδηγός',
    description:
      'Πώς λειτουργούν οι ψηφιακές προσκλήσεις: RSVP online χωρίς εγγραφή, live countdown, χάρτες Google, video υπό ταχυδρόμηση, IBAN με tap και πρόσβαση καλεσμένων. Δείτε ολόκληρο παράδειγμα.',
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
    lastModified: '2026-09-06',
  },
  ilektroniko: {
    path: '/ilektroniko-prosklitirio-gamou',
    // WARNING — this slug is byte-identical to adinfinity.gr's own
    // /ilektroniko-prosklitirio-gamou. That collision is why Google kept the
    // agency page and dropped this one. Both sides must stay differentiated:
    // the agency page sells, this one is the comparison guide (paper vs
    // electronic). Do not retitle this back to a bare service title.
    title: 'Ηλεκτρονικό vs Χάρτινο Προσκλητήριο Γάμου - Σύγκριση',
    description:
      'Ηλεκτρονικό ή χάρτινο; Σύγκριση σε κόστος (€0 ανά καλεσμένο), χρόνο παράδοσης, αλλαγές της τελευταίας στιγμής χωρίς κόστος και RSVP online. Δείτε παραδείγματα.',
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
    lastModified: '2026-09-06',
  },
  rsvp: {
    path: '/prosklitirio-gamou-rsvp',
    // The only page on this property with real impressions (pos. 28–45 for
    // "rsvp γάμου", "rsvp ελληνικα"). Keep the RSVP keyword dominant here.
    title: 'RSVP Online Γάμου - Καλεσμένοι Απαντούν Χωρίς Εγγραφή',
    description:
      'Το RSVP online γάμου αλλάζει τα δεδομένα: καλεσμένοι απαντούν σε 15 δευτερόλεπτα χωρίς εγγραφή. Δείτε απαντήσεις σε πραγματικό χρόνο και εξάγετε τη λίστα αυτόματα για τα τραπέζια.',
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
    lastModified: '2026-09-06',
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
    title: 'Mini Website Γάμου - Ιστορία, Χάρτες, RSVP & Δώρα',
    description:
      'Πλήρες mini website γάμου σε ένα link: ιστορία ζευγαριού, εκδηλώσεις με Google Maps, γκαλερί φωτογραφιών, video, RSVP online, αντιγραφή IBAN και λίστα δώρων.',
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
    lastModified: '2026-09-06',
  },
  videoProsklitirio: {
    path: '/video-prosklitirio-gamou',
    title: 'Video Προσκλητήριο Γάμου - Βίντεο + RSVP + Χάρτες',
    description:
      'Video προσκλητήριο γάμου με το βίντεό σας ως hero, γρήγορα κουμπιά για RSVP, εκκλησία, δεξίωση και IBAN αντιγραφής, φόρμα απάντησης και χάρτες στο χώρο.',
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
    lastModified: '2026-09-06',
  },
  videoOnly: {
    path: '/video-only-prosklitirio',
    title: 'Video Only Προσκλητήριο Γάμου - Minimal & Κομψό',
    description:
      'Minimal video προσκλητήριο: ονόματα, ημερομηνία και full-screen βίντεο. Χωρίς περισσότερες λεπτομέρειες. Ιδανικό για όσους θέλουν την πρόσκληση να είναι μόνο το βίντεο.',
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
    lastModified: '2026-09-06',
  },
  faq: {
    path: '/syxnes-erotiseis',
    title: 'Συχνές Ερωτήσεις Ψηφιακών Προσκλητηρίων - Όλες οι Απαντήσεις',
    description:
      'Όλες οι συχνές ερωτήσεις και απαντήσεις: χρόνος παράδοσης (24h), αλλαγές μετά την αποστολή (δωρεάν), RSVP online, video, χάρτες, IBAN αντιγραφή, τι μετά την εκδήλωση.',
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
    lastModified: '2026-09-06',
  },
  times: {
    path: '/times-psifiakou-prosklitiriou',
    // Deliberately explains how pricing is decided instead of quoting a number.
    // PACKAGES_FROM_EUR is still null and inventing a figure on a commercial
    // page is worse than having none — set that constant and this page can
    // surface it automatically.
    title: 'Ψηφιακό Προσκλητήριο Γάμου - Τιμές & Κόστος',
    description:
      'Το κόστος ενός ψηφιακού προσκλητηρίου εξαρτάται από τον τύπο και το υλικό σας. Δεν υπάρχει χρέωση ανά καλεσμένο. Ζητήστε προσφορά σε 2 λεπτά — δωρεάν και χωρίς δέσμευση.',
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
    lastModified: '2026-09-06',
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
    title: 'Ψηφιακό Προσκλητήριο Βάπτισης - Όνομα, Χάρτες, RSVP',
    description:
      'Ψηφιακό προσκλητήριο βάπτισης σε ένα link: όνομα και ημερομηνία, χάρτης για εκκλησία και δεξίωση, RSVP χωρίς εγγραφή, αριθμός ενηλίκων/παιδιών, φωτογραφίες και video.',
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
    lastModified: '2026-09-06',
  },
  vaptisiArta: {
    path: '/prosklitiria-vaptisis-arta',
    title: 'Προσκλητήρια Βάπτισης Άρτα - Ψηφιακά & Γρήγορα',
    description:
      'Ψηφιακά προσκλητήρια βάπτισης στην Άρτα και Ήπειρο. Σχεδιάζουμε το προσκλητήριό σας σε 24 ώρες με RSVP online, χάρτες και φωτογραφίες. Επαφή: Βας. Πύρρου 30, Άρτα.',
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
    lastModified: '2026-09-06',
  },
  gamosVaptisi: {
    path: '/prosklitirio-gamou-vaptisis',
    // WEDDING_BAPTISM is a distinctly Greek combined ceremony with its own
    // search demand and no competing page on either domain.
    title: 'Προσκλητήριο Γάμου & Βάπτισης Μαζί - Ένα Link',
    description:
      'Προσκλητήριο για γάμο και βάπτιση μαζί: δύο τελετές, ένα link, μία RSVP φόρμα. Ξεχωριστές ώρες και χάρτες ανά εκδήλωση, μία λίστα καλεσμένων για όλα.',
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
    lastModified: '2026-09-06',
  },
  genethlia: {
    path: '/prosklitirio-genethlion',
    title: 'Ψηφιακό Προσκλητήριο Γενεθλίων - RSVP Σε Πραγματικό Χρόνο',
    description:
      'Ψηφιακό προσκλητήριο γενεθλίων με RSVP: ένα link, δείτε ποιοι θα έρθουν σε πραγματικό χρόνο. Αλλάξτε ώρα, τοποθεσία ή λεπτομέρειες χωρίς ξανά-αποστολή.',
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
    lastModified: '2026-09-06',
  },
  epeteios: {
    path: '/prosklitirio-epeteiou',
    title: 'Προσκλητήριο Επετείου Γάμου - Ιστορία & Φωτογραφίες',
    description:
      'Προσκλητήριο επετείου γάμου: η ιστορία του ζευγαριού, γκαλερί φωτογραφιών από τα χρόνια μαζί, χάρτης δεξίωσης και RSVP online. Για αργυρούς και χρυσούς γάμους.',
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
    lastModified: '2026-09-06',
  },
  ekdiloseis: {
    path: '/psifiakes-proskliseis-ekdilosewn',
    title: 'Ψηφιακές Προσκλήσεις Εκδηλώσεων - Πρόγραμμα & RSVP',
    description:
      'Ψηφιακές προσκλήσεις για εκδηλώσεις, εγκαίνια και corporate events: πρόγραμμα με ώρες, χάρτες venue, RSVP με λίστα συμμετεχόντων και εξαγωγή σε Excel/PDF.',
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
    lastModified: '2026-09-06',
  },
  demo: {
    path: '/demo',
    title: 'Demo Προσκλητήριο Γάμου - Δοκιμάστε Ζωντανά',
    description:
      'Δείτε ένα δείγμα ψηφιακού προσκλητηρίου γάμου με countdown, ιστορία ζευγαριού, εκδηλώσεις με χάρτες, video, RSVP φόρμα και IBAN αντιγραφή.',
    keywords: [
      'demo προσκλητήριο γάμου',
      'δείγμα ψηφιακής πρόσκλησης',
      'παράδειγμα ηλεκτρονικού προσκλητηρίου',
    ],
    ogHeadline: 'Demo Προσκλητήριο Γάμου',
    ogSub: 'Δείτε ζωντανά πώς είναι μια ψηφιακή πρόσκληση',
    priority: 0.7,
    changeFrequency: 'monthly',
    lastModified: '2026-09-06',
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
    title: 'Παραγγελία Ψηφιακού Προσκλητηρίου - Ζητήστε Προσφορά',
    description:
      'Ζητήστε το ψηφιακό προσκλητήριό σας σε 24 ώρες. Συμπληρώστε ονόματα, ημερομηνία και τύπο πρόσκλησης — απαντάμε άμεσα με προσφορά και τιμή. Δωρεάν συμβουλή.',
    keywords: [
      'παραγγελία ψηφιακού προσκλητηρίου',
      'ζητήστε προσκλητήριο γάμου',
      'τιμή ψηφιακού προσκλητηρίου',
    ],
    ogHeadline: 'Ζητήστε το Προσκλητήριό σας',
    ogSub: 'Στείλτε τα στοιχεία σας και σας απαντάμε με πρόταση',
    priority: 0.9,
    changeFrequency: 'monthly',
    lastModified: '2026-09-06',
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