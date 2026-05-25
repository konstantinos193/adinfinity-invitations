'use client';

import { motion } from 'framer-motion';
import { Phone, Mail } from 'lucide-react';
import type { Contact } from '@/lib/types';

interface Props {
  contacts: Contact[];
}

const roleLabels: Record<string, string> = {
  BRIDE: 'Νύφη',
  GROOM: 'Γαμπρός',
  BEST_MAN: 'Κουμπάρος',
  MAID_OF_HONOR: 'Κουμπάρα',
};

export default function ContactsSection({ contacts }: Props) {
  if (!contacts.length) return null;
  return (
    <section className="py-20 px-4 bg-[#fdfaf6]">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-14">
          <p className="tracking-[0.3em] uppercase text-[#b8960c] text-sm mb-4 font-medium">
            Επικοινωνία
          </p>
          <h2 className="font-serif text-4xl text-[#2c1810] italic">
            Οι πρωταγωνιστές
          </h2>
          <div className="divider mt-6" />
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {contacts.map((c, i) => (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="bg-white rounded-2xl p-6 text-center shadow-sm border border-[#b8960c]/10"
            >
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#b8960c]/20 to-[#c9748a]/20 flex items-center justify-center mx-auto mb-3">
                <span className="font-serif text-xl font-bold text-[#b8960c]">
                  {c.name[0]}
                </span>
              </div>
              <p className="text-xs tracking-widest text-[#b8960c] uppercase mb-1">
                {roleLabels[c.role] ?? c.role}
              </p>
              <h3 className="font-serif text-lg text-[#2c1810] mb-3">{c.name}</h3>
              <div className="space-y-1.5">
                {c.phone && (
                  <a
                    href={`tel:${c.phone}`}
                    className="flex items-center justify-center gap-1.5 text-sm text-[#5c3320]/70 hover:text-[#5c3320] transition-colors"
                  >
                    <Phone size={13} />
                    {c.phone}
                  </a>
                )}
                {c.email && (
                  <a
                    href={`mailto:${c.email}`}
                    className="flex items-center justify-center gap-1.5 text-sm text-[#5c3320]/70 hover:text-[#5c3320] transition-colors truncate"
                  >
                    <Mail size={13} />
                    {c.email}
                  </a>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
