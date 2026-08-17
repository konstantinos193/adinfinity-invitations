import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import JsonLd from "@/components/JsonLd";
import {
  LANG,
  LOCALE,
  PAGES,
  SITE_NAME,
  SITE_URL,
  BRAND_URL,
  graph,
  organizationNode,
  websiteNode,
} from "@/lib/seo";

const inter = Inter({ variable: "--font-inter", subsets: ["latin", "greek"] });
const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

// NOTE: the homepage (app/page.tsx) is a client component and so cannot export
// its own `metadata` — the values below ARE the homepage's metadata.
//
// Consequence to watch: `alternates.canonical` here is inherited by any route
// that doesn't set its own, which silently canonicalises it to the homepage.
// Every page under app/ must declare its own canonical (see lib/seo.ts).
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  alternates: {
    canonical: '/',
    languages: { [LANG]: '/', 'x-default': '/' },
  },
  title: {
    default: `${PAGES.home.title} | adinfinity`,
    template: '%s | adinfinity',
  },
  description: PAGES.home.description,
  keywords: [...PAGES.home.keywords],
  applicationName: SITE_NAME,
  category: 'Wedding',
  authors: [{ name: 'adinfinity', url: BRAND_URL }],
  creator: 'adinfinity',
  publisher: 'adinfinity',
  formatDetection: { telephone: false, address: false, email: false },
  openGraph: {
    type: 'website',
    locale: LOCALE,
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `${PAGES.home.title} | adinfinity`,
    description: PAGES.home.description,
  },
  twitter: {
    card: 'summary_large_image',
    title: `${PAGES.home.title} | adinfinity`,
    description: PAGES.home.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      // Let Google use full-size image previews and untruncated snippets.
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  // Not locked to 1 — pinch-zoom is an accessibility requirement.
  maximumScale: 5,
  userScalable: true,
  themeColor: '#b8960c',
  colorScheme: 'light',
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="el" className={`${inter.variable} ${playfair.variable}`}>
      <body className="min-h-screen antialiased">
        {/* Site-wide entity graph: emitted on every route so each page ties
            back to the same Organization and WebSite nodes. */}
        <JsonLd data={graph(organizationNode, websiteNode)} />
        {children}
      </body>
    </html>
  );
}
