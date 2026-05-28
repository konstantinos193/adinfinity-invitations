'use client';

import { motion } from 'framer-motion';
import { Copy, Check } from 'lucide-react';
import { useState } from 'react';
import type { GiftRegistry as GiftRegistryType } from '@/lib/types';
import { copyToClipboard } from '@/lib/clipboard';

interface Props {
  gifts: GiftRegistryType[];
  color?: string;
}

function IBANCard({ gift, color }: { gift: GiftRegistryType; color: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await copyToClipboard(gift.iban);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm" style={{ border: `1px solid ${color}1a` }}>
      <p className="text-xs tracking-widest uppercase mb-1" style={{ color }}>
        {gift.ownerName}
      </p>
      {gift.bankName && (
        <p className="text-sm text-[#5c3320]/60 mb-3">{gift.bankName}</p>
      )}
      <div className="flex items-center gap-3 bg-[#f5efe6] rounded-xl px-4 py-3">
        <span className="text-[#2c1810] font-mono text-sm flex-1 tracking-wider break-all">
          {gift.iban}
        </span>
        <button
          onClick={copy}
          className="shrink-0 transition-colors hover:opacity-70"
          style={{ color: copied ? '#16a34a' : color }}
          title="Αντιγραφή IBAN"
        >
          {copied ? <Check size={18} /> : <Copy size={18} />}
        </button>
      </div>
    </div>
  );
}

export default function GiftRegistry({ gifts, color }: Props) {
  const c = color ?? '#b8960c';
  if (!gifts.length) return null;
  return (
    <section className="py-20 px-4 bg-[#f5efe6]">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-12">
          <p className="tracking-[0.3em] uppercase text-sm mb-4 font-medium" style={{ color: c }}>
            Λίστα γάμου
          </p>
          <h2 className="font-serif text-4xl text-[#2c1810] italic">
            Προαιρετικά
          </h2>
          <div className="divider mt-6 mb-6" />
          <p className="text-[#5c3320]/70 text-sm">
            Αν επιθυμείτε να μας κάνετε ένα δώρο, μπορείτε να χρησιμοποιήσετε
            τα παρακάτω στοιχεία.
          </p>
        </div>

        <div className={gifts.length === 2 ? "grid grid-cols-2 gap-4" : "space-y-4"}>
          {gifts.map((gift, i) => (
            <motion.div
              key={gift.id}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
            >
              <IBANCard gift={gift} color={c} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
