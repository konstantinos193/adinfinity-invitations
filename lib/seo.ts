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
    title: 'Ψηφιακές Προσκλήσεις Γάμου — Τιμές & Χαρακτηριστικά',
    description:
      'Τι περιλαμβάνει μια ψηφιακή πρόσκληση γάμου: RSVP online, live countdown, χάρτες Google, video, IBAN με ένα tap και dashboard καλεσμένων. Δείτε πώς λειτουργεί.',
    keywords: [
      'ψηφιακές προσκλήσεις γάμου',
      'ψηφιακή πρόσκληση γάμου',
      'ψηφιακό προσκλητήριο',
      'οικολογικές προσκλήσεις γάμου',
      'πρόσκληση γάμου online',
    ],
    ogHeadline: 'Ψηφιακές Προσκλήσεις Γάμου',
    ogSub: 'RSVP, countdown, χάρτες, video & IBAN με ένα tap',
    priority: 0.9,
    changeFrequency: 'monthly',
    lastModified: '2026-08-17',
  },
  ilektroniko: {
    path: '/ilektroniko-prosklitirio-gamou',
    title: 'Ηλεκτρονικό Προσκλητήριο Γάμου',
    description:
      'Το ηλεκτρονικό προσκλητήριο γάμου αντικαθιστά τη χάρτινη πρόσκληση: ένα link με όλες τις λεπτομέρειες, RSVP, χάρτες και video — και αλλαγές ανά πάσα στιγμή.',
    keywords: [
      'ηλεκτρονικό προσκλητήριο γάμου',
      'ηλεκτρονικές προσκλήσεις γάμου',
      'ηλεκτρονικό προσκλητήριο',
      'digital προσκλητήριο γάμου',
    ],
    ogHeadline: 'Ηλεκτρονικό Προσκλητήριο Γάμου',
    ogSub: 'Η σύγχρονη εναλλακτική στη χάρτινη πρόσκληση',
    priority: 0.9,
    changeFrequency: 'monthly',
    lastModified: '2026-08-17',
  },
  rsvp: {
    path: '/prosklitirio-gamou-rsvp',
    title: 'Προσκλητήριο Γάμου με RSVP Online',
    description:
      'Προσκλητήριο γάμου με RSVP online: οι καλεσμένοι απαντούν από το κινητό χωρίς εγγραφή και βλέπετε συμμετοχές, συνοδούς και διατροφικές προτιμήσεις σε πραγματικό χρόνο.',
    keywords: [
      'προσκλητήριο γάμου RSVP',
      'RSVP online γάμος',
      'φόρμα RSVP γάμου',
      'επιβεβαίωση συμμετοχής γάμου',
      'λίστα καλεσμένων γάμου',
    ],
    ogHeadline: 'Προσκλητήριο Γάμου με RSVP',
    ogSub: 'Απαντήσεις καλεσμένων σε πραγματικό χρόνο',
    priority: 0.9,
    changeFrequency: 'monthly',
    lastModified: '2026-08-17',
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
