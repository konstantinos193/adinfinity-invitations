'use client';

import { motion } from 'framer-motion';
import { MapPin, Copy, Check, Heart } from 'lucide-react';
import { useState } from 'react';
import type { Event, GiftRegistry } from '@/lib/types';
import { copyToClipboard } from '@/lib/clipboard';

interface Props {
  events: Event[];
  gifts: GiftRegistry[];
  color?: string;
}

export default function FloatingBar({ events, gifts, color }: Props) {
  const c = color ?? '#b8960c';
  const [copied, setCopied] = useState<string | null>(null);

  const ceremony = events.find((e) => e.type === 'CEREMONY');
  const reception = events.find((e) => e.type === 'RECEPTION');
  const firstGift = gifts[0];

  const copyIban = async (iban: string) => {
    await copyToClipboard(iban);
    setCopied(iban);
    setTimeout(() => setCopied(null), 2000);
  };

  const scrollToRsvp = () => {
    document.getElementById('rsvp')?.scrollIntoView({ behavior: 'smooth' });
  };

  const buttons = [
    ceremony?.mapsUrl && {
      key: 'ceremony',
      label: 'Εκκλησία',
      icon: <MapPin size={15} />,
      onClick: () => window.open(ceremony.mapsUrl!, '_blank'),
      primary: false,
    },
    reception?.mapsUrl && {
      key: 'reception',
      label: 'Δεξίωση',
      icon: <MapPin size={15} />,
      onClick: () => window.open(reception.mapsUrl!, '_blank'),
      primary: false,
    },
    firstGift && {
      key: 'iban',
      label: copied === firstGift.iban ? 'Αντιγράφηκε!' : 'IBAN',
      icon: copied === firstGift.iban ? <Check size={15} /> : <Copy size={15} />,
      onClick: () => copyIban(firstGift.iban),
      primary: false,
    },
    {
      key: 'rsvp',
      label: 'RSVP',
      icon: <Heart size={15} />,
      onClick: scrollToRsvp,
      primary: true,
    },
  ].filter(Boolean) as {
    key: string;
    label: string;
    icon: React.ReactNode;
    onClick: () => void;
    primary?: boolean;
  }[];

  if (!buttons.length) return null;

  return (
    <motion.div
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50"
      initial={{ y: 80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 1.8, duration: 0.5, type: 'spring' }}
    >
      <div
        className="flex items-center gap-2 bg-white/90 backdrop-blur-md rounded-full px-3 py-2 shadow-xl"
        style={{ border: `1px solid ${c}33` }}
      >
        {buttons.map((btn) => (
          <button
            key={btn.key}
            onClick={btn.onClick}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-medium transition-all"
            style={btn.primary
              ? { backgroundColor: c, color: '#fff' }
              : { color: '#5c3320' }
            }
          >
            {btn.icon}
            <span>{btn.label}</span>
          </button>
        ))}
      </div>
    </motion.div>
  );
}
