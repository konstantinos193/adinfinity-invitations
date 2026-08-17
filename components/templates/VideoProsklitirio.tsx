'use client';

import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { el } from 'date-fns/locale';
import { MapPin, CreditCard, Send, CheckCircle } from 'lucide-react';
import RSVPForm from '@/components/RSVPForm';
import type { Invitation } from '@/lib/types';
import InvitationFooter from '@/components/InvitationFooter';

function embedUrl(url: string): string {
  const ytMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&?/]+)/);
  if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}?rel=0`;
  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
  if (vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
  return url;
}

interface Props { invitation: Invitation }

export default function VideoProsklitirio({ invitation }: Props) {
  const { brideName, groomName, weddingDate, videoUrl, events, giftRegistries, slug, rsvpDeadline, eventCategory, childName, fatherName, motherName, honoreeName, eventTitle, yearsCount } = invitation;
  const formattedDate = weddingDate ? format(new Date(weddingDate), "d MMMM yyyy", { locale: el }) : '';
  const isBaptism = eventCategory === 'BAPTISM';
  const isWeddingBaptism = eventCategory === 'WEDDING_BAPTISM';
  const isAnniversary = eventCategory === 'ANNIVERSARY';
  const isBirthday = eventCategory === 'BIRTHDAY';
  const isEvent = eventCategory === 'EVENT';
  const rsvpRef = useRef<HTMLDivElement>(null);
  const [ibanCopied, setIbanCopied] = useState(false);

  const ceremony = events.find((e) => e.type === 'CEREMONY');
  const reception = events.find((e) => e.type === 'RECEPTION');
  const firstIban = giftRegistries[0]?.iban ?? null;

  const copyIban = async () => {
    if (!firstIban) return;
    await navigator.clipboard.writeText(firstIban);
    setIbanCopied(true);
    setTimeout(() => setIbanCopied(false), 2500);
  };

  const scrollToRsvp = () => rsvpRef.current?.scrollIntoView({ behavior: 'smooth' });

  return (
    <div className="min-h-screen bg-[#fdfaf6] text-[#2c1810]">

      {/* Hero */}
      <section
        className="relative min-h-[50vh] flex flex-col items-center justify-center text-center px-6 py-16 overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #2c1810 0%, #5c3320 50%, #8b5e3c 100%)' }}
      >
        <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-10">
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-white"
              style={{ width: 60 + i * 15, height: 60 + i * 15, top: `${(i * 8) % 100}%`, left: `${(i * 13) % 100}%` }}
              animate={{ y: [0, -15, 0], opacity: [0.2, 0.5, 0.2] }}
              transition={{ duration: 4 + i * 0.3, repeat: Infinity, delay: i * 0.5 }}
            />
          ))}
        </div>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9 }}
          className="relative z-10"
        >
          <p className="text-white/50 tracking-[0.4em] text-xs uppercase mb-6">
            {isBaptism ? 'Βάπτιση' : isWeddingBaptism ? 'Γαμοβάπτιση' : isAnniversary ? 'Επέτειος' : isBirthday ? 'Γενέθλια' : isEvent ? 'Εκδήλωση' : 'Με μεγάλη χαρά σας προσκαλούμε'}
          </p>

          {isBaptism ? (
            <>
              <h1 className="text-white text-5xl md:text-7xl mb-2 leading-none" style={{ fontFamily: "'Cormorant Garamond', 'Playfair Display', Georgia, serif", fontStyle: 'italic' }}>
                {childName}
              </h1>
              {(fatherName || motherName) && (
                <p className="text-white/50 text-base tracking-wide mt-2 mb-4">
                  {fatherName && motherName ? `${fatherName} & ${motherName}` : fatherName || motherName}
                </p>
              )}
            </>
          ) : isBirthday ? (
            <>
              <h1 className="text-white text-5xl md:text-7xl mb-2 leading-none" style={{ fontFamily: "'Cormorant Garamond', 'Playfair Display', Georgia, serif", fontStyle: 'italic' }}>
                {honoreeName}
              </h1>
              {yearsCount && (
                <p className="text-white/50 text-base tracking-wide mt-2 mb-4">
                  {yearsCount} Ετών
                </p>
              )}
            </>
          ) : isEvent ? (
            <>
              <h1 className="text-white text-5xl md:text-7xl mb-2 leading-none" style={{ fontFamily: "'Cormorant Garamond', 'Playfair Display', Georgia, serif", fontStyle: 'italic' }}>
                {eventTitle}
              </h1>
            </>
          ) : (
            <>
              <h1 className="text-white text-5xl md:text-7xl mb-2 leading-none" style={{ fontFamily: "'Cormorant Garamond', 'Playfair Display', Georgia, serif", fontStyle: 'italic' }}>
                {brideName}
              </h1>
              <p className="text-white/40 text-3xl my-2">&amp;</p>
              <h1 className="text-white text-5xl md:text-7xl leading-none" style={{ fontFamily: "'Cormorant Garamond', 'Playfair Display', Georgia, serif", fontStyle: 'italic' }}>
                {groomName}
              </h1>
              {isWeddingBaptism && childName && (
                <p className="text-white/50 text-sm tracking-wide mt-3">Βάπτιση: {childName}</p>
              )}
              {isAnniversary && yearsCount && (
                <p className="text-white/50 text-sm tracking-wide mt-3">{yearsCount} Χρόνια</p>
              )}
            </>
          )}

          <div className="flex items-center gap-3 justify-center mb-4 mt-6">
            <div className="h-px w-12 bg-white/30" />
            <span className="text-white/30 text-xs">◆</span>
            <div className="h-px w-12 bg-white/30" />
          </div>
          <p className="text-white/60 text-sm tracking-widest uppercase">{formattedDate}</p>
        </motion.div>
      </section>

      {/* Video */}
      {videoUrl && (
        <section className="bg-[#1a0f0a] py-10 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl" style={{ paddingBottom: '56.25%' }}>
              <iframe
                src={embedUrl(videoUrl)}
                className="absolute inset-0 w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title={`${brideName} & ${groomName}`}
              />
            </div>
          </div>
        </section>
      )}

      {/* 4-button quick bar */}
      <section className="bg-[#fdfaf6] border-b border-[#b8960c]/15 py-6 px-4 sticky top-0 z-40 backdrop-blur-sm bg-[#fdfaf6]/90">
        <div className="max-w-2xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-3">
          <button
            onClick={scrollToRsvp}
            className="flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl bg-[#2c1810] text-white hover:bg-[#5c3320] transition-colors text-xs font-medium"
          >
            <Send size={18} />
            Αποστολή RSVP
          </button>
          {ceremony?.mapsUrl && (
            <a
              href={ceremony.mapsUrl}
              target="_blank"
              rel="noreferrer"
              className="flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl border border-[#b8960c]/30 text-[#5c3320] hover:bg-[#f5efe6] transition-colors text-xs font-medium text-center"
            >
              <MapPin size={18} />
              Πλοήγηση Εκκλησία
            </a>
          )}
          {reception?.mapsUrl && (
            <a
              href={reception.mapsUrl}
              target="_blank"
              rel="noreferrer"
              className="flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl border border-[#b8960c]/30 text-[#5c3320] hover:bg-[#f5efe6] transition-colors text-xs font-medium text-center"
            >
              <MapPin size={18} />
              Πλοήγηση Δεξίωση
            </a>
          )}
          {firstIban && (
            <button
              onClick={copyIban}
              className={`flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl border transition-colors text-xs font-medium ${
                ibanCopied
                  ? 'border-green-500/30 bg-green-50 text-green-700'
                  : 'border-[#b8960c]/30 text-[#5c3320] hover:bg-[#f5efe6]'
              }`}
            >
              {ibanCopied ? <CheckCircle size={18} /> : <CreditCard size={18} />}
              {ibanCopied ? 'Αντιγράφηκε!' : 'Αντιγραφή IBAN'}
            </button>
          )}
        </div>
      </section>

      {/* Events */}
      {events.length > 0 && (
        <section className="py-16 px-4">
          <div className="max-w-2xl mx-auto space-y-6">
            <h2 className="text-center text-2xl mb-8" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontStyle: 'italic', color: '#2c1810' }}>
              Πρόγραμμα εκδηλώσεων
            </h2>
            {events.map((ev) => (
              <motion.div
                key={ev.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl p-6 border border-[#b8960c]/15 shadow-sm"
              >
                <p className="text-xs font-semibold tracking-widest uppercase text-[#b8960c] mb-2">
                  {ev.type === 'CEREMONY' ? 'Μυστήριο' : 'Δεξίωση'}
                </p>
                <h3 className="text-lg font-semibold text-[#2c1810] mb-1">{ev.name}</h3>
                <p className="text-sm text-[#5c3320]/70 mb-1">
                  {format(new Date(ev.date), "d MMMM yyyy, HH:mm", { locale: el })}
                </p>
                {ev.address && <p className="text-sm text-[#5c3320]/60 mb-3">{ev.address}</p>}
                {ev.mapsUrl && (
                  <a
                    href={ev.mapsUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-[#b8960c] hover:text-[#5c3320] transition-colors"
                  >
                    <MapPin size={13} /> Άνοιγμα στο Google Maps →
                  </a>
                )}
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* RSVP */}
      <div ref={rsvpRef} id="rsvp">
        <RSVPForm slug={slug} rsvpDeadline={rsvpDeadline} />
      </div>

      {/* Footer */}
      <InvitationFooter />
    </div>
  );
}
