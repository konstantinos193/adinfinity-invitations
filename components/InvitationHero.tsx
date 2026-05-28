'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { el } from 'date-fns/locale';
import CountdownTimer from './CountdownTimer';

const BG_GRADIENTS: Record<string, string> = {
  'warm-ivory': 'linear-gradient(135deg,#2c1810 0%,#5c3320 50%,#8b5e3c 100%)',
  'blush':      'linear-gradient(135deg,#3d0d1e 0%,#7a2a44 50%,#b86080 100%)',
  'sage':       'linear-gradient(135deg,#0d1e10 0%,#1e4022 50%,#386840 100%)',
  'midnight':   'linear-gradient(135deg,#050510 0%,#101030 50%,#1e1e50 100%)',
  'golden':     'linear-gradient(135deg,#1e1000 0%,#3d2400 50%,#6b4400 100%)',
};

const GOOGLE_FONTS_URL =
  'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400;1,600' +
  '&family=Playfair+Display:ital,wght@0,400;0,700;1,400;1,700' +
  '&family=Great+Vibes' +
  '&family=Dancing+Script:wght@400;700' +
  '&family=Lora:ital,wght@0,400;0,600;1,400;1,600' +
  '&family=Cinzel:wght@400;600;700' +
  '&family=EB+Garamond:ital,wght@0,400;0,600;1,400;1,600' +
  '&family=Libre+Baskerville:ital,wght@0,400;0,700;1,400' +
  '&display=swap';

interface Props {
  brideName: string;
  groomName: string;
  weddingDate: string;
  coverImageUrl?: string | null;
  coverImages?: string[];
  primaryColor?: string | null;
  fontFamily?: string | null;
  fontColor?: string | null;
  backgroundStyle?: string | null;
  eventCategory?: string | null;
  childName?: string | null;
  fatherName?: string | null;
  motherName?: string | null;
}

export default function InvitationHero({
  brideName, groomName, weddingDate,
  coverImageUrl, coverImages, primaryColor, fontFamily, fontColor, backgroundStyle,
  eventCategory, childName, fatherName, motherName,
}: Props) {
  const formattedDate = weddingDate ? format(new Date(weddingDate), 'd MMMM yyyy', { locale: el }) : '';
  const isBaptism = eventCategory === 'BAPTISM';
  const isWeddingBaptism = eventCategory === 'WEDDING_BAPTISM';
  const color = primaryColor ?? '#b8960c';
  const nameColor = fontColor ?? '#ffffff';
  const rawFont = fontFamily ?? 'Playfair Display';
  const isCustomFont = rawFont.startsWith('custom:');
  const customFontSrc = isCustomFont ? rawFont.slice(7) : null;
  const font = isCustomFont ? 'CustomWeddingFont' : rawFont;
  const bgKey = backgroundStyle ?? 'warm-ivory';
  const bgGradient = bgKey.startsWith('custom:')
    ? (() => {
        const [from, to] = bgKey.slice(7).split(',');
        const mid = from && to ? (() => {
          const parse = (h: string) => ({ r: parseInt(h.slice(1,3),16)||0, g: parseInt(h.slice(3,5),16)||0, b: parseInt(h.slice(5,7),16)||0 });
          const a = parse(from), b2 = parse(to);
          const hex = (n: number) => n.toString(16).padStart(2,'0');
          return `#${hex(Math.round((a.r+b2.r)/2))}${hex(Math.round((a.g+b2.g)/2))}${hex(Math.round((a.b+b2.b)/2))}`;
        })() : from;
        return `linear-gradient(135deg, ${from} 0%, ${mid} 50%, ${to} 100%)`;
      })()
    : BG_GRADIENTS[bgKey] ?? BG_GRADIENTS['warm-ivory'];

  // Build the ordered image list: coverImages takes priority, fall back to coverImageUrl
  const images: string[] = (coverImages && coverImages.length > 0)
    ? coverImages
    : (coverImageUrl ? [coverImageUrl] : []);

  const [activeIdx, setActiveIdx] = useState(0);

  // Auto-advance carousel
  useEffect(() => {
    if (images.length < 2) return;
    const timer = setInterval(() => {
      setActiveIdx((i) => (i + 1) % images.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [images.length]);

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

  const hasImages = images.length > 0;

  return (
    <section
      className="relative min-h-screen flex flex-col items-center justify-center text-center px-4 overflow-hidden"
      style={hasImages ? undefined : { background: bgGradient }}
    >
      {/* Carousel background */}
      {hasImages && (
        <div className="absolute inset-0">
          <AnimatePresence mode="sync">
            <motion.div
              key={activeIdx}
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2, ease: 'easeInOut' }}
              style={{
                backgroundImage: `url(${images[activeIdx]})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            />
          </AnimatePresence>
          <div className="absolute inset-0 bg-black/50" />
        </div>
      )}

      {/* Gradient background (no images) */}
      {!hasImages && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-white/5"
              style={{
                width: Math.random() * 120 + 40,
                height: Math.random() * 120 + 40,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
              }}
              animate={{ y: [0, -20, 0], opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: Math.random() * 4 + 3, repeat: Infinity, delay: Math.random() * 3 }}
            />
          ))}
        </div>
      )}

      {/* Content */}
      <motion.div
        className="relative z-10 max-w-2xl mx-auto"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <motion.p
          className="text-white/70 tracking-[0.4em] uppercase text-sm mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {isBaptism ? 'Βάπτιση' : isWeddingBaptism ? 'Γαμοβάπτιση' : 'Με μεγάλη χαρά σας προσκαλούμε'}
        </motion.p>

        {isBaptism ? (
          <>
            <motion.h1
              className="text-6xl md:text-8xl font-bold italic leading-tight mb-4"
              style={{ fontFamily: `'${font}', serif`, color: nameColor }}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              {childName || ''}
            </motion.h1>
            {(fatherName || motherName) && (
              <motion.p
                className="text-white/60 text-lg tracking-wide mb-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                {fatherName && motherName ? `${fatherName} & ${motherName}` : fatherName || motherName}
              </motion.p>
            )}
          </>
        ) : (
          <>
            <motion.h1
              className="text-6xl md:text-8xl font-bold italic leading-tight mb-4"
              style={{ fontFamily: `'${font}', serif`, color: nameColor }}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              {brideName}
            </motion.h1>
            <motion.div
              className="text-3xl my-2 font-light"
              style={{ color }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              &
            </motion.div>
            <motion.h1
              className="text-6xl md:text-8xl font-bold italic leading-tight mb-4"
              style={{ fontFamily: `'${font}', serif`, color: nameColor }}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.9, duration: 0.8 }}
            >
              {groomName}
            </motion.h1>
            {isWeddingBaptism && childName && (
              <motion.p
                className="text-white/60 text-lg tracking-wide mb-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.0 }}
              >
                Βάπτιση: {childName}
              </motion.p>
            )}
          </>
        )}

        <motion.div
          className="mb-6 mx-auto h-px w-32"
          style={{ backgroundColor: color, opacity: 0.7 }}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 1.1, duration: 0.6 }}
        />

        <motion.p
          className="text-white/90 text-xl tracking-widest mb-10 font-light"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          {formattedDate}
        </motion.p>

        {weddingDate && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4 }}
          >
            <CountdownTimer targetDate={weddingDate} />
          </motion.div>
        )}
      </motion.div>

      {/* Carousel dots */}
      {images.length > 1 && (
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveIdx(i)}
              className="transition-all duration-300 rounded-full"
              style={{
                width: i === activeIdx ? 20 : 8,
                height: 8,
                backgroundColor: i === activeIdx ? color : 'rgba(255,255,255,0.4)',
              }}
            />
          ))}
        </div>
      )}

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 1.5 }}
      >
        <div className="w-px h-12 bg-gradient-to-b from-transparent to-white/50 mx-auto" />
      </motion.div>
    </section>
  );
}
