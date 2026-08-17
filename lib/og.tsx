import { ImageResponse } from 'next/og';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = 'image/png';

/**
 * Shared 1200×630 OG card renderer.
 *
 * DejaVu Sans (bundled in public/fonts) has full Greek glyph coverage, which
 * the default OG font lacks. These routes are statically prerendered at build
 * time, so reading the font from disk here bakes it into the output PNG.
 *
 * Satori renders via flexbox only — no CSS grid.
 */
export async function renderOgImage(headline: string, sub: string) {
  const font = await readFile(
    join(process.cwd(), 'public/fonts/DejaVuSans-Bold.ttf'),
  );

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          padding: '80px',
          background:
            'linear-gradient(135deg, #07141C 0%, #071a24 55%, #061218 100%)',
          color: '#fdfaf6',
          fontFamily: 'DejaVu',
        }}
      >
        <div
          style={{
            display: 'flex',
            fontSize: 30,
            letterSpacing: 10,
            color: '#b8960c',
            textTransform: 'uppercase',
          }}
        >
          adinfinity
        </div>
        <div
          style={{
            display: 'flex',
            fontSize: headline.length > 26 ? 62 : 78,
            marginTop: 28,
            lineHeight: 1.12,
            maxWidth: 1000,
          }}
        >
          {headline}
        </div>
        <div
          style={{
            display: 'flex',
            fontSize: 32,
            marginTop: 30,
            color: '#cdd6dc',
            maxWidth: 920,
            lineHeight: 1.3,
          }}
        >
          {sub}
        </div>
        <div
          style={{
            display: 'flex',
            fontSize: 26,
            marginTop: 52,
            color: '#b8960c',
          }}
        >
          invitations.adinfinity.gr
        </div>
      </div>
    ),
    {
      ...OG_SIZE,
      fonts: [{ name: 'DejaVu', data: font, weight: 700, style: 'normal' }],
    },
  );
}
