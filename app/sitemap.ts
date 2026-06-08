import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://invitations.adinfinity.gr',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      // Public demo invitation linked from the homepage. Individual client
      // invitations are intentionally NOT listed here (personal pages).
      url: 'https://invitations.adinfinity.gr/ioanna-alexandros',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
  ];
}
