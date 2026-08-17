import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/seo';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        // `/_next/` is deliberately NOT disallowed — crawlers need the
        // render-critical CSS/JS to see the page the way users do.
        disallow: ['/admin', '/api/'],
      },
      {
        // AI answer engines that cite sources: explicitly welcome. These are
        // the crawlers that put the site into ChatGPT/Perplexity/Claude answers.
        userAgent: [
          'OAI-SearchBot',
          'ChatGPT-User',
          'PerplexityBot',
          'Perplexity-User',
          'ClaudeBot',
          'Claude-User',
          'Claude-SearchBot',
          'Google-Extended',
          'Applebot',
          'Applebot-Extended',
        ],
        allow: '/',
        disallow: ['/admin', '/api/'],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
