'use client';

import { motion } from 'framer-motion';

interface Props {
  videoUrl: string;
}

function toEmbedUrl(url: string): string | null {
  try {
    const u = new URL(url);
    // YouTube
    if (u.hostname.includes('youtube.com')) {
      const v = u.searchParams.get('v');
      return v ? `https://www.youtube.com/embed/${v}?autoplay=0&rel=0` : null;
    }
    if (u.hostname.includes('youtu.be')) {
      const v = u.pathname.slice(1);
      return v ? `https://www.youtube.com/embed/${v}?autoplay=0&rel=0` : null;
    }
    // Vimeo
    if (u.hostname.includes('vimeo.com')) {
      const v = u.pathname.slice(1);
      return v ? `https://player.vimeo.com/video/${v}` : null;
    }
    return null;
  } catch {
    return null;
  }
}

export default function VideoSection({ videoUrl }: Props) {
  const embedUrl = toEmbedUrl(videoUrl);
  if (!embedUrl) return null;

  return (
    <section className="py-20 px-4 bg-[#2c1810]">
      <div className="max-w-3xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <p className="tracking-[0.3em] uppercase text-[#b8960c] text-sm mb-4 font-medium">
            Βίντεο Προσκλητήριο
          </p>
          <h2 className="font-serif text-4xl text-white italic mb-8">
            Δείτε το βίντεο μας
          </h2>
          <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-2xl">
            <iframe
              src={embedUrl}
              className="absolute inset-0 w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title="Βίντεο προσκλητήριο"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
