import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({ variable: "--font-inter", subsets: ["latin", "greek"] });
const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://invitations.adinfinity.gr'),
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

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="el" className={`${inter.variable} ${playfair.variable}`}>
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
