'use client';

import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { el } from 'date-fns/locale';
import CountdownTimer from './CountdownTimer';

interface Props {
  brideName: string;
  groomName: string;
  weddingDate: string;
  coverImageUrl?: string | null;
}

export default function InvitationHero({ brideName, groomName, weddingDate, coverImageUrl }: Props) {
  const formattedDate = format(new Date(weddingDate), "d MMMM yyyy", { locale: el });

  return (
    <section
      className="relative min-h-screen flex flex-col items-center justify-center text-center px-4 overflow-hidden"
      style={coverImageUrl ? {
        backgroundImage: `url(${coverImageUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      } : {
        background: 'linear-gradient(135deg, #2c1810 0%, #5c3320 40%, #8b5e3c 100%)',
      }}
    >
      {/* Dark overlay when cover photo is used */}
      {coverImageUrl && (
        <div className="absolute inset-0 bg-black/50" />
      )}
      {/* Decorative petals / dots */}
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
            transition={{
              duration: Math.random() * 4 + 3,
              repeat: Infinity,
              delay: Math.random() * 3,
            }}
          />
        ))}
      </div>

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
          Με μεγάλη χαρά σας προσκαλούμε
        </motion.p>

        <motion.h1
          className="font-serif text-6xl md:text-8xl font-bold text-white italic leading-tight mb-4"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          {brideName}
        </motion.h1>

        <motion.div
          className="text-white/60 text-3xl my-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          &
        </motion.div>

        <motion.h1
          className="font-serif text-6xl md:text-8xl font-bold text-white italic leading-tight mb-8"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.9, duration: 0.8 }}
        >
          {groomName}
        </motion.h1>

        <motion.div
          className="divider mb-6"
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

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4 }}
        >
          <CountdownTimer targetDate={weddingDate} />
        </motion.div>
      </motion.div>

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
