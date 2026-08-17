/**
 * The 8 display faces an invitation can be rendered in. All have confirmed
 * Greek glyph coverage on Google Fonts.
 *
 * Loaded via a plain <link> rather than next/font because the family is picked
 * per-invitation at runtime, which next/font's build-time API can't express.
 *
 * Scoped to the routes that actually render invitations (and to admin, whose
 * font pickers preview them). Keeping it out of the root layout spares the
 * marketing/SEO pages a render-blocking cross-origin stylesheet.
 */
export default function WeddingFonts() {
  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link
        rel="preconnect"
        href="https://fonts.gstatic.com"
        crossOrigin="anonymous"
      />
      <link
        rel="stylesheet"
        href={
          'https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,600;1,400;1,600' +
          '&family=Alegreya:ital,wght@0,400;0,700;1,400;1,700' +
          '&family=GFS+Didot:ital,wght@0,400;1,400' +
          '&family=Cardo:ital,wght@0,400;0,700;1,400' +
          '&family=Gentium+Plus:ital,wght@0,400;0,700;1,400;1,700' +
          '&family=Noto+Serif:ital,wght@0,400;0,700;1,400;1,700' +
          '&family=Tinos:ital,wght@0,400;0,700;1,400;1,700' +
          '&family=Old+Standard+TT:ital,wght@0,400;0,700;1,400' +
          '&display=swap'
        }
      />
    </>
  );
}
