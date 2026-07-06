'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { el } from 'date-fns/locale';

const GOOGLE_FONTS_URL =
  'https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400;1,700' +
  '&family=EB+Garamond:ital,wght@0,400;0,600;1,400;1,600' +
  '&family=Alegreya:ital,wght@0,400;0,700;1,400;1,700' +
  '&family=GFS+Didot' +
  '&family=Cardo:ital,wght@0,400;0,700;1,400' +
  '&family=Gentium+Plus:ital,wght@0,400;0,700;1,400;1,700' +
  '&family=Old+Standard+TT:ital,wght@0,400;0,700;1,400' +
  '&family=Tinos:ital,wght@0,400;0,700;1,400;1,700' +
  '&family=Noto+Serif:ital,wght@0,400;0,700;1,400;1,700' +
  '&display=swap';

// Palette of the heritage/print look: taupe panel, beige canvas, ivory card, slate ink
const C = {
  leftBg: '#b3a68f',
  rightBg: '#dbd5c6',
  card: '#f6f3ea',
  band: '#c6bca4',
  ink: '#3f4249',
  text: '#3a352b',
  cream: '#f3ecd8',
  overlay: 'rgba(163,152,128,0.8)',
};

interface Props {
  eventTitle: string;
  hostName?: string | null;
  subtitle?: string | null;
  quote?: string | null;
  eventDate?: string | null;
  photoUrl?: string | null;
  logoUrl?: string | null;
  fontFamily?: string | null;
  fontColor?: string | null;
}

function useTimeLeft(target?: string | null) {
  const calc = () => {
    if (!target) return null;
    const diff = new Date(target).getTime() - Date.now();
    if (diff <= 0) return null;
    return {
      days: Math.floor(diff / 86400000),
      hours: Math.floor((diff % 86400000) / 3600000),
      minutes: Math.floor((diff % 3600000) / 60000),
    };
  };
  const [time, setTime] = useState(calc);
  useEffect(() => {
    const id = setInterval(() => setTime(calc()), 30000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target]);
  return time;
}

export default function EventHeritageHero({
  eventTitle, hostName, subtitle, quote, eventDate, photoUrl, logoUrl, fontFamily, fontColor,
}: Props) {
  const rawFont = fontFamily ?? 'GFS Didot';
  const isCustomFont = rawFont.startsWith('custom:');
  const customFontSrc = isCustomFont ? rawFont.slice(7) : null;
  const font = isCustomFont ? 'CustomWeddingFont' : rawFont;
  const titleColor = fontColor && fontColor !== '#ffffff' ? fontColor : C.cream;
  const formattedDate = eventDate ? format(new Date(eventDate), 'd MMMM yyyy', { locale: el }) : '';
  const timeLeft = useTimeLeft(eventDate);

  useEffect(() => {
    if (isCustomFont && customFontSrc) {
      const ff = new FontFace('CustomWeddingFont', `url(${customFontSrc})`);
      ff.load().then((loaded) => document.fonts.add(loaded)).catch(() => {});
      return;
    }
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = GOOGLE_FONTS_URL;
    document.head.appendChild(link);
    return () => { document.head.removeChild(link); };
  }, [isCustomFont, customFontSrc]);

  return (
    <section className="relative min-h-screen flex flex-col lg:flex-row" style={{ backgroundColor: C.rightBg }}>
      {/* Left panel — emblem, subtitle, quote, organizer credits */}
      <div
        className="lg:w-[38%] flex flex-col items-center text-center px-8 py-14 lg:py-16 gap-8"
        style={{ backgroundColor: C.leftBg }}
      >
        <motion.div
          className="w-full max-w-xs px-8 py-8 shadow-md"
          style={{ backgroundColor: C.card }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {logoUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={logoUrl} alt={hostName ?? eventTitle} className="mx-auto max-h-44 object-contain" />
          )}
          {hostName && (
            <p
              className={`font-bold tracking-wide text-xl ${logoUrl ? 'mt-5' : ''}`}
              style={{ fontFamily: `'${font}', serif`, color: C.ink }}
            >
              {hostName}
            </p>
          )}
        </motion.div>

        {subtitle && (
          <motion.p
            className="text-base tracking-wide"
            style={{ color: C.text, fontFamily: `'${font}', serif` }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {subtitle}
          </motion.p>
        )}

        {quote && (
          <motion.blockquote
            className="flex-1 flex items-center text-lg lg:text-xl italic leading-relaxed max-w-sm"
            style={{ color: C.text, fontFamily: `'${font}', serif` }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <span>&laquo;{quote}&raquo;</span>
          </motion.blockquote>
        )}

        {hostName && (
          <motion.div
            className="text-xs tracking-[0.18em] uppercase space-y-1 mt-auto"
            style={{ color: C.text }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            <p className="font-semibold">Διοργάνωση</p>
            <p>{hostName}</p>
          </motion.div>
        )}
      </div>

      {/* Right panel — host band, framed photo with title overlay, date */}
      <div className="flex-1 flex flex-col justify-center px-6 sm:px-12 lg:px-16 py-14 lg:py-16">
        {hostName && (
          <motion.div
            className="self-center lg:self-start mb-10 px-8 py-3 shadow-sm"
            style={{ backgroundColor: C.band }}
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <p
              className="font-bold uppercase tracking-[0.08em] text-lg sm:text-2xl"
              style={{ fontFamily: `'${font}', serif`, color: C.ink }}
            >
              {hostName}
            </p>
          </motion.div>
        )}

        <motion.div
          className="relative"
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
        >
          <div
            className="relative w-full aspect-[16/10] border shadow-2xl overflow-hidden"
            style={{ borderColor: '#1f1d1a', backgroundColor: '#8d8674' }}
          >
            {photoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={photoUrl} alt={eventTitle} className="absolute inset-0 w-full h-full object-cover" />
            ) : (
              <div
                className="absolute inset-0"
                style={{ background: 'linear-gradient(160deg,#a49b86 0%,#8d8674 55%,#6f6a5b 100%)' }}
              />
            )}
          </div>

          {/* Title band, wider than the photo like the printed original */}
          <div
            className="absolute bottom-[10%] -inset-x-3 sm:-inset-x-8 py-3 sm:py-4 pr-8 sm:pr-14 text-right shadow-lg"
            style={{ backgroundColor: C.overlay }}
          >
            <h1
              className="italic leading-tight text-4xl sm:text-5xl lg:text-6xl"
              style={{ fontFamily: `'${font}', serif`, color: titleColor, textShadow: '0 1px 3px rgba(0,0,0,0.25)' }}
            >
              {eventTitle}
            </h1>
          </div>
        </motion.div>

        {(formattedDate || timeLeft) && (
          <motion.div
            className="mt-12 flex flex-col items-center gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            {formattedDate && (
              <div className="flex items-center gap-4">
                <span className="h-px w-12" style={{ backgroundColor: C.ink, opacity: 0.4 }} />
                <p className="text-sm sm:text-base tracking-[0.25em] uppercase" style={{ color: C.ink }}>
                  {formattedDate}
                </p>
                <span className="h-px w-12" style={{ backgroundColor: C.ink, opacity: 0.4 }} />
              </div>
            )}
            {timeLeft && (
              <p className="text-xs tracking-[0.15em] uppercase" style={{ color: C.text, opacity: 0.8 }}>
                σε {timeLeft.days} μέρες, {timeLeft.hours} ώρες και {timeLeft.minutes} λεπτά
              </p>
            )}
          </motion.div>
        )}
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-4 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 1.5 }}
      >
        <div className="w-px h-10 mx-auto" style={{ background: `linear-gradient(to bottom, transparent, ${C.ink}80)` }} />
      </motion.div>
    </section>
  );
}
