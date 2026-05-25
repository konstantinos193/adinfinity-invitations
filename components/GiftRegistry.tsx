'use client';

import { motion } from 'framer-motion';
import { Copy, Check } from 'lucide-react';
import { useState } from 'react';
import type { GiftRegistry as GiftRegistryType } from '@/lib/types';
import { copyToClipboard } from '@/lib/clipboard';

interface Props {
  gifts: GiftRegistryType[];
}

function IBANCard({ gift }: { gift: GiftRegistryType }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await copyToClipboard(gift.iban);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#b8960c]/10">
      <p className="text-xs tracking-widest text-[#b8960c] uppercase mb-1">
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
          className="shrink-0 text-[#b8960c] hover:text-[#5c3320] transition-colors"
          title="Αντιγραφή IBAN"
        >
          {copied ? <Check size={18} className="text-green-600" /> : <Copy size={18} />}
        </button>
      </div>
    </div>
  );
}

export default function GiftRegistry({ gifts }: Props) {
  if (!gifts.length) return null;
  return (
    <section className="py-20 px-4 bg-[#f5efe6]">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-12">
          <p className="tracking-[0.3em] uppercase text-[#b8960c] text-sm mb-4 font-medium">
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

        <div className="space-y-4">
          {gifts.map((gift, i) => (
            <motion.div
              key={gift.id}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
            >
              <IBANCard gift={gift} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
