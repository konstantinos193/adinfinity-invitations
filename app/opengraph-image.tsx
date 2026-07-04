import { ImageResponse } from 'next/og';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

// Static metadata for the generated image (also used for twitter:image).
export const alt = 'adinfinity — Ψηφιακές Προσκλήσεις Γάμου';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function OpengraphImage() {
  // DejaVu Sans (bundled in public/fonts) has full Greek glyph coverage, which
  // the default OG font lacks. This route is statically prerendered at build
  // time, so reading the font from disk here bakes it into the output PNG.
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
            fontSize: 78,
            marginTop: 28,
            lineHeight: 1.12,
            maxWidth: 980,
          }}
        >
          Ψηφιακές Προσκλήσεις Γάμου
        </div>
        <div
          style={{
            display: 'flex',
            fontSize: 34,
            marginTop: 30,
            color: '#cdd6dc',
            maxWidth: 900,
          }}
        >
          Mini-site με countdown, RSVP online, χάρτες & video
        </div>
        <div
          style={{
            display: 'flex',
            fontSize: 26,
            marginTop: 56,
            color: '#b8960c',
          }}
        >
          invitations.adinfinity.gr
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [{ name: 'DejaVu', data: font, weight: 700, style: 'normal' }],
    },
  );
}
