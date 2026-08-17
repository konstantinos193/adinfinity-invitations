import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from '@/lib/og';
import { PAGES } from '@/lib/seo';

export const alt = PAGES.rsvp.title;
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return renderOgImage(PAGES.rsvp.ogHeadline, PAGES.rsvp.ogSub);
}
