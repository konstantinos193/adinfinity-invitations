import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'adinfinity — Ψηφιακές Προσκλήσεις',
    short_name: 'adinfinity',
    description:
      'Δημιουργήστε την ψηφιακή πρόσκληση γάμου σας — mini-site με αντίστροφη μέτρηση, RSVP online, χάρτες Google, λίστα δώρων και video.',
    start_url: '/',
    display: 'standalone',
    background_color: '#fdfaf6',
    theme_color: '#b8960c',
    lang: 'el',
    icons: [
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
  };
}
