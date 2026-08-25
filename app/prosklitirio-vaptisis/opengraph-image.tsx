import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from '@/lib/og';
import { PAGES } from '@/lib/seo';

export const alt = PAGES.vaptisi.title;
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return renderOgImage(PAGES.vaptisi.ogHeadline, PAGES.vaptisi.ogSub);
}
