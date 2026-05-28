'use client';

import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { el } from 'date-fns/locale';
import type { Invitation } from '@/lib/types';

function embedUrl(url: string): string {
  // YouTube
  const ytMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&?/]+)/);
  if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=0&rel=0`;
  // Vimeo
  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
  if (vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
  return url;
}

interface Props { invitation: Invitation }

export default function VideoOnlyPage({ invitation }: Props) {
  const { brideName, groomName, weddingDate, videoUrl, eventCategory, childName, fatherName, motherName } = invitation;
  const formattedDate = weddingDate ? format(new Date(weddingDate), "d MMMM yyyy", { locale: el }) : '';
  const isBaptism = eventCategory === 'BAPTISM';
  const isWeddingBaptism = eventCategory === 'WEDDING_BAPTISM';

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white flex flex-col">

      {/* Hero */}
      <section className="relative flex flex-col items-center justify-center text-center px-6 pt-20 pb-12 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-white/3 rounded-full blur-[120px]" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="relative z-10"
        >
          <p className="text-white/40 tracking-[0.4em] text-xs uppercase mb-8">
            {isBaptism ? 'Βάπτιση' : isWeddingBaptism ? 'Γαμοβάπτιση' : 'Με μεγάλη χαρά σας προσκαλούμε'}
          </p>

          {isBaptism ? (
            <>
              <h1 className="font-serif text-6xl md:text-8xl text-white mb-4 leading-none" style={{ fontFamily: "'Cormorant Garamond', 'Playfair Display', Georgia, serif" }}>
                {childName}
              </h1>
              {(fatherName || motherName) && (
                <p className="text-white/50 text-lg tracking-wide mb-6">
                  {fatherName && motherName ? `${fatherName} & ${motherName}` : fatherName || motherName}
                </p>
              )}
            </>
          ) : (
            <>
              <h1 className="font-serif text-6xl md:text-8xl text-white mb-4 leading-none" style={{ fontFamily: "'Cormorant Garamond', 'Playfair Display', Georgia, serif" }}>
                {brideName}
              </h1>
              <p className="text-white/30 text-3xl my-3" style={{ fontFamily: "serif" }}>&amp;</p>
              <h1 className="font-serif text-6xl md:text-8xl text-white mb-4 leading-none" style={{ fontFamily: "'Cormorant Garamond', 'Playfair Display', Georgia, serif" }}>
                {groomName}
              </h1>
              {isWeddingBaptism && childName && (
                <p className="text-white/50 text-base tracking-wide mb-2">Βάπτιση: {childName}</p>
              )}
            </>
          )}

          <div className="flex items-center gap-4 justify-center mb-6 mt-4">
            <div className="h-px w-16 bg-white/20" />
            <span className="text-white/25 text-xs">◆</span>
            <div className="h-px w-16 bg-white/20" />
          </div>

          <p className="text-white/50 text-base tracking-widest uppercase">{formattedDate}</p>
        </motion.div>
      </section>

      {/* Video */}
      {videoUrl ? (
        <motion.section
          className="flex-1 flex items-center justify-center px-4 pb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <div className="w-full max-w-4xl">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-black/60" style={{ paddingBottom: '56.25%' }}>
              <iframe
                src={embedUrl(videoUrl)}
                className="absolute inset-0 w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title={isBaptism ? `Βάπτιση ${childName} — Video Invitation` : `${brideName} & ${groomName} — Video Invitation`}
              />
            </div>
          </div>
        </motion.section>
      ) : (
        <div className="flex-1 flex items-center justify-center pb-16 text-white/20 text-sm">
          Δεν έχει οριστεί βίντεο.
        </div>
      )}

      {/* Footer */}
      <footer className="text-center py-8 text-xs text-white/20 border-t border-white/5">
        Δημιουργήθηκε από{' '}
        <a href="https://adinfinity.gr" className="hover:text-white/50 transition-colors">
          adinfinity.gr
        </a>
      </footer>
    </div>
  );
}
