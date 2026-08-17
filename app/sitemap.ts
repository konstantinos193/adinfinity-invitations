import type { MetadataRoute } from 'next';
import { PAGES, abs } from '@/lib/seo';

/**
 * Every entry is derived from the PAGES registry so the sitemap can't drift
 * from the pages' canonicals.
 *
 * Individual client invitations under /[slug] are intentionally excluded —
 * they're personal pages carrying third-party contact details and an IBAN, and
 * they are `noindex` unconditionally (see app/[slug]/page.tsx).
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return Object.values(PAGES)
    .filter((page) => !('noindex' in page && page.noindex))
    .map((page) => ({
      url: abs(page.path),
      lastModified: new Date(page.lastModified),
      changeFrequency: page.changeFrequency,
      priority: page.priority,
      // Image sitemap entry — the per-route generated OG card.
      images: [`${abs(page.path)}/opengraph-image`],
    }));
}
