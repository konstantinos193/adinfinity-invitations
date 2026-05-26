'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface Props {
  images: string[];
  color?: string;
}

export default function PhotoGallery({ images, color }: Props) {
  const c = color ?? '#b8960c';
  const [lightbox, setLightbox] = useState<number | null>(null);

  useEffect(() => {
    if (lightbox === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') setLightbox((i) => i !== null ? (i + 1) % images.length : null);
      if (e.key === 'ArrowLeft')  setLightbox((i) => i !== null ? (i - 1 + images.length) % images.length : null);
      if (e.key === 'Escape')     setLightbox(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lightbox, images.length]);

  if (!images.length) return null;

  return (
    <section className="py-20 bg-[#fdfaf6]">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-xs tracking-[0.4em] uppercase mb-3" style={{ color: c }}>Φωτογραφίες</p>
          <h2 className="text-3xl font-serif italic text-[#2c1810]">Στιγμές</h2>
          <div className="mt-4 mx-auto h-px w-16" style={{ backgroundColor: c, opacity: 0.5 }} />
        </div>

        {/* Masonry grid */}
        <div className="columns-2 md:columns-3 gap-3">
          {images.map((url, i) => (
            <motion.div
              key={url}
              className="break-inside-avoid mb-3 cursor-pointer overflow-hidden rounded-xl relative group"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: Math.min(i * 0.04, 0.3) }}
              onClick={() => setLightbox(i)}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={url}
                alt={`Φωτογραφία ${i + 1}`}
                className="w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-colors duration-300 flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <ChevronRight size={18} className="text-white" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox !== null && (
          <motion.div
            className="fixed inset-0 z-[100] bg-black/92 backdrop-blur-sm flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightbox(null)}
          >
            {/* Close */}
            <button
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors z-10"
              onClick={() => setLightbox(null)}
            >
              <X size={20} />
            </button>

            {/* Prev */}
            {images.length > 1 && (
              <button
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors z-10"
                onClick={(e) => { e.stopPropagation(); setLightbox((i) => i !== null ? (i - 1 + images.length) % images.length : null); }}
              >
                <ChevronLeft size={22} />
              </button>
            )}

            {/* Next */}
            {images.length > 1 && (
              <button
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors z-10"
                onClick={(e) => { e.stopPropagation(); setLightbox((i) => i !== null ? (i + 1) % images.length : null); }}
              >
                <ChevronRight size={22} />
              </button>
            )}

            {/* Image */}
            <AnimatePresence mode="wait">
              <motion.img
                key={lightbox}
                src={images[lightbox]}
                alt={`Φωτογραφία ${lightbox + 1}`}
                className="max-h-[85vh] max-w-[85vw] object-contain rounded-lg shadow-2xl"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.18 }}
                onClick={(e) => e.stopPropagation()}
              />
            </AnimatePresence>

            {/* Dot counter */}
            {images.length > 1 && (
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-1.5">
                {images.map((_, i) => (
                  <button
                    key={i}
                    onClick={(e) => { e.stopPropagation(); setLightbox(i); }}
                    className="transition-all duration-200 rounded-full"
                    style={{
                      width: i === lightbox ? 18 : 6,
                      height: 6,
                      backgroundColor: i === lightbox ? 'white' : 'rgba(255,255,255,0.35)',
                    }}
                  />
                ))}
              </div>
            )}

            {/* Counter text */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 text-white/50 text-xs tracking-widest">
              {lightbox + 1} / {images.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
