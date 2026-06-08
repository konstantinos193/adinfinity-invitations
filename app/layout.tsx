import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({ variable: "--font-inter", subsets: ["latin", "greek"] });
const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

// Loaded via <link> so we're not restricted by next/font subset types.
// All 8 fonts have confirmed Greek glyph support on Google Fonts.
const WEDDING_FONTS =
  'https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,600;1,400;1,600' +
  '&family=Alegreya:ital,wght@0,400;0,700;1,400;1,700' +
  '&family=GFS+Didot:ital,wght@0,400;1,400' +
  '&family=Cardo:ital,wght@0,400;0,700;1,400' +
  '&family=Gentium+Plus:ital,wght@0,400;0,700;1,400;1,700' +
  '&family=Noto+Serif:ital,wght@0,400;0,700;1,400;1,700' +
  '&family=Tinos:ital,wght@0,400;0,700;1,400;1,700' +
  '&family=Old+Standard+TT:ital,wght@0,400;0,700;1,400' +
  '&display=swap';

export const metadata: Metadata = {
  metadataBase: new URL('https://invitations.adinfinity.gr'),
  alternates: { canonical: '/' },
  title: {
    default: 'Ψηφιακές Προσκλήσεις Γάμου | adifinity',
    template: '%s | adifinity',
  },
  description:
    'Δημιουργήστε την ψηφιακή πρόσκληση γάμου σας — mini-site με αντίστροφη μέτρηση, RSVP online, χάρτες Google, λίστα δώρων και video. Ένα μόνο link για όλους τους καλεσμένους.',
  keywords: [
    'ψηφιακή πρόσκληση γάμου',
    'online πρόσκληση γάμου',
    'ηλεκτρονική πρόσκληση',
    'RSVP online',
    'προσκλητήριο γάμου',
    'adifinity',
  ],
  authors: [{ name: 'adifinity', url: 'https://adinfinity.gr' }],
  openGraph: {
    type: 'website',
    locale: 'el_GR',
    siteName: 'adifinity — Ψηφιακές Προσκλήσεις',
    title: 'Ψηφιακές Προσκλήσεις Γάμου | adifinity',
    description:
      'Mini-site για τον γάμο σας με αντίστροφη μέτρηση, RSVP, χάρτες και video. Ένα link για όλους τους καλεσμένους.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ψηφιακές Προσκλήσεις Γάμου | adifinity',
    description:
      'Mini-site για τον γάμο σας με αντίστροφη μέτρηση, RSVP, χάρτες και video.',
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: '#b8960c',
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="el" className={`${inter.variable} ${playfair.variable}`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="stylesheet" href={WEDDING_FONTS} />
      </head>
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
