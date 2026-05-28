'use client';

import { motion } from 'framer-motion';
import { Phone, Mail } from 'lucide-react';
import type { Contact } from '@/lib/types';

interface Props {
  contacts: Contact[];
  color?: string;
}

const roleLabels: Record<string, string> = {
  BRIDE: 'Νύφη',
  GROOM: 'Γαμπρός',
  BEST_MAN: 'Κουμπάρος',
  MAID_OF_HONOR: 'Κουμπάρα',
};

export default function ContactsSection({ contacts, color }: Props) {
  const c = color ?? '#b8960c';
  if (!contacts.length) return null;
  return (
    <section className="py-20 px-4 bg-[#fdfaf6]">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-14">
          <p className="tracking-[0.3em] uppercase text-sm mb-4 font-medium" style={{ color: c }}>
            Επικοινωνία
          </p>
          <h2 className="font-serif text-4xl text-[#2c1810] italic">
            Οι πρωταγωνιστές
          </h2>
          <div className="divider mt-6" />
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {contacts.map((contact, i) => (
            <motion.div
              key={contact.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="bg-white rounded-2xl p-6 text-center shadow-sm"
              style={{ border: `1px solid ${c}1a` }}
            >
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3"
                style={{ backgroundColor: c + '1a' }}
              >
                <span className="font-serif text-xl font-bold" style={{ color: c }}>
                  {contact.name[0]}
                </span>
              </div>
              <p className="text-xs tracking-widest uppercase mb-1" style={{ color: c }}>
                {roleLabels[contact.role] ?? contact.role}
              </p>
              <h3 className="font-serif text-lg text-[#2c1810] mb-3">{contact.name}</h3>
              <div className="space-y-1.5">
                {contact.phone && (
                  <a
                    href={`tel:${contact.phone}`}
                    className="flex items-center justify-center gap-1.5 text-sm text-[#5c3320]/70 hover:text-[#5c3320] transition-colors"
                  >
                    <Phone size={13} />
                    {contact.phone}
                  </a>
                )}
                {contact.email && (
                  <a
                    href={`mailto:${contact.email}`}
                    className="flex items-center justify-center gap-1.5 text-sm text-[#5c3320]/70 hover:text-[#5c3320] transition-colors min-w-0"
                  >
                    <Mail size={13} className="shrink-0" />
                    <span className="truncate">{contact.email}</span>
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
