'use client';

import { motion } from 'framer-motion';

interface Props {
  story: string;
  color?: string;
}

export default function OurStory({ story, color }: Props) {
  const c = color ?? '#b8960c';
  return (
    <section className="py-20 px-4 bg-[#fdfaf6]">
      <div className="max-w-2xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <p className="tracking-[0.3em] uppercase text-sm mb-4 font-medium" style={{ color: c }}>
            Η ιστορία μας
          </p>
          <h2 className="font-serif text-4xl text-[#2c1810] italic mb-6">
            Πώς γνωριστήκαμε
          </h2>
          <div className="divider mb-8" />
          <p className="text-[#5c3320]/80 leading-relaxed text-lg">{story}</p>
        </motion.div>
      </div>
    </section>
  );
}
