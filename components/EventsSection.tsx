'use client';

import { motion } from 'framer-motion';
import { MapPin, Clock, Building2, Utensils } from 'lucide-react';
import { format } from 'date-fns';
import { el } from 'date-fns/locale';
import type { Event } from '@/lib/types';

interface Props {
  events: Event[];
  color?: string;
}

const labels: Record<string, string> = {
  CEREMONY: 'Το Μυστήριο',
  RECEPTION: 'Η Δεξίωση',
};

export default function EventsSection({ events, color }: Props) {
  const c = color ?? '#b8960c';

  return (
    <section className="py-20 px-4 bg-[#f5efe6]">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-14">
          <p className="tracking-[0.3em] uppercase text-sm mb-4 font-medium" style={{ color: c }}>
            Λεπτομέρειες
          </p>
          <h2 className="font-serif text-4xl text-[#2c1810] italic">
            Η μεγάλη μέρα
          </h2>
          <div className="divider mt-6" />
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {events.map((event, i) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.6 }}
              className="bg-white rounded-2xl p-8 shadow-sm text-center"
              style={{ border: `1px solid ${c}1a` }}
            >
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ backgroundColor: c + '1a' }}
              >
                {event.type === 'CEREMONY'
                  ? <Building2 size={20} style={{ color: c }} />
                  : <Utensils size={20} style={{ color: c }} />}
              </div>
              <p className="tracking-[0.25em] uppercase text-xs mb-2 font-medium" style={{ color: c }}>
                {labels[event.type] ?? event.type}
              </p>
              <h3 className="font-serif text-2xl text-[#2c1810] mb-4">{event.name}</h3>

              <div className="flex items-center justify-center gap-2 text-[#5c3320]/70 mb-2">
                <Clock size={15} />
                <span className="text-sm">
                  {format(new Date(event.date), "d MMMM yyyy, HH:mm", { locale: el })}
                </span>
              </div>

              {event.address && (
                <div className="flex items-center justify-center gap-2 text-[#5c3320]/70 mb-5">
                  <MapPin size={15} />
                  <span className="text-sm">{event.address}</span>
                </div>
              )}

              {event.mapsUrl && (
                <a
                  href={event.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-white px-5 py-2.5 rounded-full transition-colors"
                  style={{ backgroundColor: c }}
                >
                  <MapPin size={14} />
                  Πλοήγηση
                </a>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
