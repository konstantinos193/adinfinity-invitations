'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import JsonLd from '@/components/JsonLd';
import { graph, serviceNode, webPageNode } from '@/lib/seo';
import {
  MapPin, Heart, Clock, Mail, Copy, Video, Users,
  ChevronDown, Globe, Clapperboard, Play, ArrowRight,
} from 'lucide-react';

const features = [
  { icon: Heart,  title: 'RSVP Online',            desc: 'Οι καλεσμένοι απαντούν απευθείας από το κινητό τους, χωρίς εγγραφή.', large: true },
  { icon: Clock,  title: 'Αντίστροφη Μέτρηση',   desc: 'Live countdown μέχρι την ημέρα σε κάθε επίσκεψη.',                      large: false },
  { icon: Video,  title: 'Video Πρόσκληση',        desc: 'Ενσωματωμένο βίντεο από YouTube ή Vimeo.',                             large: false },
  { icon: MapPin, title: 'Χάρτες & Πλοήγηση',     desc: 'Google Maps για εκκλησία και δεξίωση — με ένα tap.',                   large: false },
  { icon: Copy,   title: 'IBAN με 1 Tap',          desc: 'Αντιγραφή τραπεζικού IBAN χωρίς λάθη, χωρίς χαρτί.',                  large: false },
  { icon: Users,  title: 'Διαχείριση Καλεσμένων', desc: 'Dashboard με στατιστικά RSVPs σε πραγματικό χρόνο.',                   large: false },
];

const invitationTypes = [
  {
    icon: Globe,
    type: 'MINI_WEBSITE',

    title: 'Mini Website',
    subtitle: 'Προσκλητήριο',
    desc: 'Hero, ιστορία, video, εκδηλώσεις, επαφές, IBAN, RSVP — ένα πλήρες mini-site για τον γάμο σας.',
    highlights: ['Countdown', 'Ιστορία ζευγαριού', 'RSVP form', 'Φωτογραφίες'],
    accent: '#01FFFF',
  },
  {
    icon: Clapperboard,
    type: 'VIDEO_PROSKLITIRIO',

    title: 'Video',
    subtitle: 'Προσκλητήριο',
    desc: 'Βίντεο ως hero, 4-κουμπί quick bar (RSVP / Εκκλησία / Δεξίωση / IBAN) και φόρμα RSVP.',
    highlights: ['Full-width video', 'Quick action bar', 'Events cards', 'RSVP form'],
    accent: '#01A9FF',
  },
  {
    icon: Play,
    type: 'VIDEO',

    title: 'Video',
    subtitle: 'Only',
    desc: 'Elegant, minimal. Ονόματα, ημερομηνία και ένα εντυπωσιακό video — τίποτα παραπάνω.',
    highlights: ['Full-screen video', 'Serif typography', 'Ονόματα & ημερομηνία', 'Minimal design'],
    accent: '#a78bfa',
  },
];

const steps = [
  { n: '01', title: 'Επικοινωνείτε μαζί μας',       desc: 'Μας στέλνετε τα στοιχεία σας — ονόματα, ημερομηνία, τοποθεσία.' },
  { n: '02', title: 'Φτιάχνουμε την πρόσκλησή σας', desc: 'Ετοιμάζουμε το δικό σας mini-site με φωτογραφίες, ιστορία και RSVP.' },
  { n: '03', title: 'Στέλνετε τον σύνδεσμο',         desc: 'Ένα link για όλους τους καλεσμένους. Δεν χρειάζεται εγκατάσταση.' },
];

export default function LandingPage() {
  const prefersReduced = useReducedMotion();

  const fadeUp = prefersReduced
    ? {}
    : { initial: { opacity: 0, y: 24 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.5 } };

  // The Organization and WebSite nodes now live in the root layout so every
  // route carries them; this page adds only what's specific to it. Rendered
  // into the initial SSR HTML even though this is a client component.
  const homeJsonLd = graph(webPageNode('home', false), serviceNode);

  return (
    <div className="min-h-screen bg-[#07141C] text-white overflow-x-hidden">
      <JsonLd data={homeJsonLd} />

      {/* Background */}
      <div className="fixed inset-0 bg-linear-to-b from-[#07141C] via-[#071a24] to-[#061218] opacity-80 pointer-events-none" />
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: 'linear-gradient(to right,#01FFFF 1px,transparent 1px),linear-gradient(to bottom,#01FFFF 1px,transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />
      <div className="fixed -top-20 right-0 w-100 h-100 bg-[#01FFFF]/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="fixed top-1/2 -left-40 w-100 h-100 bg-[#01A9FF]/5 rounded-full blur-[100px] pointer-events-none" />

      {/* ── NAV ───────────────────────────────────────────── */}
      <nav className="relative z-20 border-b border-[#01FFFF]/10 bg-[#07141C]/80 backdrop-blur-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Image src="/logo.png" alt="adinfinity" width={120} height={40} className="object-contain" />
          <a
            href="https://adinfinity.gr/contact#contact-form"
            target="_blank"
            rel="noreferrer"
            className="bg-[#01FFFF] hover:bg-[#01FFFF]/90 text-[#07141C] text-sm font-bold px-6 py-2.5 rounded-full transition-colors"
          >
            Ζητήστε την πρόσκλησή σας
          </a>
        </div>
      </nav>

      {/* ── HERO (split layout) ────────────────────────────── */}
      <section className="relative z-10 min-h-dvh flex items-center overflow-hidden">
        <div className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center py-24">

          {/* Left — text */}
          <div>
            <motion.div
              {...(prefersReduced ? {} : { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.4 } })}
            >
              <span className="px-4 py-1.5 rounded-full bg-[#0A1A24] border border-[#01FFFF]/20 text-sm text-[#01FFFF] font-medium tracking-widest uppercase">
                Ψηφιακές Προσκλήσεις Γάμου
              </span>
            </motion.div>

            <motion.h1
              className="text-4xl md:text-5xl lg:text-6xl font-bold mt-6 mb-5 leading-tight"
              {...(prefersReduced ? {} : { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.4, delay: 0.08 } })}
            >
              Η πρόσκλησή σας,{' '}
              <span className="text-[#01FFFF]">ζωντανή online</span>
            </motion.h1>

            <motion.p
              className="text-white/60 text-lg leading-relaxed mb-8 max-w-lg"
              {...(prefersReduced ? {} : { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.4, delay: 0.16 } })}
            >
              Ένα όμορφο mini-site για τον γάμο σας με αντίστροφη μέτρηση, ιστορία, χάρτες,
              RSVP και λίστα δώρων — με ένα μόνο link.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4"
              {...(prefersReduced ? {} : { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.4, delay: 0.24 } })}
            >
              <motion.a
                href="https://adinfinity.gr/contact#contact-form"
                target="_blank"
                rel="noreferrer"
                className="bg-[#01FFFF] hover:bg-[#01FFFF]/90 text-[#07141C] font-bold py-3.5 px-8 rounded-full text-base text-center transition-colors"
                whileHover={prefersReduced ? {} : { scale: 1.02 }}
                whileTap={prefersReduced ? {} : { scale: 0.98 }}
              >
                Ξεκινήστε τώρα →
              </motion.a>
              <Link
                href="/ioanna-alexandros"
                className="border-2 border-[#01FFFF] text-[#01FFFF] font-bold py-3.5 px-8 rounded-full text-base text-center hover:bg-[#01FFFF]/10 transition-colors"
              >
                Δείτε demo πρόσκληση
              </Link>
            </motion.div>

            {/* Tags */}
            <motion.div
              className="flex flex-wrap gap-2 mt-8"
              {...(prefersReduced ? {} : { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 0.4, delay: 0.36 } })}
            >
              {['RSVP Online', 'Αντίστροφη μέτρηση', 'Google Maps', 'Video', 'IBAN Αντιγραφή'].map((tag) => (
                <span key={tag} className="px-3 py-1 rounded-full bg-[#0A1A24] border border-[#01FFFF]/15 text-xs text-white/50">
                  {tag}
                </span>
              ))}
            </motion.div>
          </div>

          {/* Right — floating invitation card */}
          <motion.div
            className="relative flex justify-center"
            {...(prefersReduced ? {} : { initial: { opacity: 0, x: 30 }, animate: { opacity: 1, x: 0 }, transition: { duration: 0.6, delay: 0.2 } })}
          >
            {/* Glow behind card */}
            <div className="absolute inset-0 bg-[#01FFFF]/5 rounded-full blur-[80px]" />

            {/* Browser chrome mockup */}
            <div className="relative z-10 w-full max-w-sm bg-[#071218] rounded-2xl border border-[#01FFFF]/15 shadow-2xl shadow-black/60 overflow-hidden">
              {/* Chrome bar */}
              <div className="flex items-center gap-2 px-4 py-3 border-b border-[#01FFFF]/10 bg-[#07141C]">
                <div className="w-2.5 h-2.5 rounded-full bg-red-400/60" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/60" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-400/60" />
                <div className="flex-1 bg-[#0A1A24] rounded-md px-3 py-1 text-[10px] text-white/25 ml-2 truncate">
                  invitations.adinfinity.gr/ioanna-alexandros
                </div>
              </div>

              {/* Invitation preview */}
              <div
                className="p-8 text-center"
                style={{ background: 'linear-gradient(135deg, #2c1810 0%, #5c3320 60%, #8b5e3c 100%)' }}
              >
                <p className="text-white/50 tracking-[0.3em] text-[10px] uppercase mb-4">Με μεγάλη χαρά σας προσκαλούμε</p>
                <h2 className="text-white text-3xl italic mb-1" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>Ιωάννα</h2>
                <p className="text-white/40 text-xl my-1">&</p>
                <h2 className="text-white text-3xl italic mb-6" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>Αλέξανδρος</h2>

                {/* Countdown */}
                <div className="flex gap-2 justify-center mb-6">
                  {[['127','Μέρες'],['14','Ώρες'],['36','Λεπτά']].map(([v, l]) => (
                    <div key={l} className="bg-white/10 rounded-lg px-3 py-2 min-w-12 text-center">
                      <p className="text-white font-bold text-lg leading-none">{v}</p>
                      <p className="text-white/40 text-[9px] uppercase tracking-wider mt-0.5">{l}</p>
                    </div>
                  ))}
                </div>

                {/* Mini action buttons */}
                <div className="flex gap-2 justify-center">
                  <div className="bg-white/15 rounded-lg px-3 py-1.5 text-[10px] text-white/70">Εκκλησία</div>
                  <div className="bg-white/15 rounded-lg px-3 py-1.5 text-[10px] text-white/70">Δεξίωση</div>
                  <div className="bg-white/15 rounded-lg px-3 py-1.5 text-[10px] text-white/70">RSVP</div>
                </div>
              </div>

              {/* URL bar bottom hint */}
              <div className="px-4 py-2.5 border-t border-[#01FFFF]/10 flex items-center justify-between">
                <span className="text-[10px] text-white/20">3 εκδηλώσεις · IBAN · RSVP</span>
                <span className="text-[10px] text-[#01FFFF]/50">Mini Website ✓</span>
              </div>
            </div>

          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-[#01FFFF]/40 z-10"
          animate={prefersReduced ? {} : { y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
        >
          <ChevronDown size={26} />
        </motion.div>
      </section>

      {/* ── FEATURES (Bento grid) ──────────────────────────── */}
      <section className="relative z-10 py-24 px-4">
        <div className="container mx-auto">
          <motion.div className="text-center mb-12" {...fadeUp}>
            <p className="text-[#01FFFF] text-xs tracking-widest uppercase font-medium mb-3">Τι περιλαμβάνει</p>
            <h2 className="text-4xl font-bold text-white">Όλα σε <span className="text-[#01FFFF]">ένα link</span></h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-auto">

            {/* Large card — RSVP (spans 2 cols on lg) */}
            <motion.div
              className="lg:col-span-2 bg-[#071218]/80 rounded-2xl border border-cyan-900/30 hover:border-[#01FFFF] transition-all duration-200 hover:shadow-[0_0_20px_rgba(1,255,255,0.12)] p-8 flex flex-col sm:flex-row gap-6 items-start will-change-transform"
              {...(prefersReduced ? {} : {
                initial: { opacity: 0, y: 24 },
                whileInView: { opacity: 1, y: 0 },
                viewport: { once: true },
                transition: { duration: 0.4 },
                whileHover: { y: -3, transition: { duration: 0.15 } },
              })}
            >
              <div className="bg-linear-to-br from-[#0A1A24] to-[#0D2436] p-5 rounded-2xl w-18 h-18 flex items-center justify-center shrink-0">
                <Heart size={26} className="text-[#01FFFF]" />
              </div>
              <div>
                <div className="text-[#01FFFF] text-xs font-semibold tracking-widest uppercase mb-2">Κύρια λειτουργία</div>
                <h3 className="text-white font-bold text-2xl mb-2">RSVP Online</h3>
                <p className="text-white/50 leading-relaxed">
                  Οι καλεσμένοι σας απαντούν απευθείας από το κινητό τους, χωρίς εγκατάσταση app.
                  Βλέπετε σε πραγματικό χρόνο ποιος έρχεται — από το dashboard σας.
                </p>
              </div>
            </motion.div>

            {/* Small cards */}
            {features.slice(1).map(({ icon: Icon, title, desc }, i) => (
              <motion.div
                key={title}
                className="bg-[#071218]/80 rounded-2xl border border-cyan-900/30 hover:border-[#01FFFF] transition-all duration-200 hover:shadow-[0_0_15px_rgba(1,255,255,0.12)] p-6 will-change-transform"
                {...(prefersReduced ? {} : {
                  initial: { opacity: 0, y: 24 },
                  whileInView: { opacity: 1, y: 0 },
                  viewport: { once: true },
                  transition: { duration: 0.4, delay: (i + 1) * 0.07 },
                  whileHover: { y: -3, transition: { duration: 0.15 } },
                })}
              >
                <div className="bg-linear-to-br from-[#0A1A24] to-[#0D2436] p-3.5 rounded-xl w-14 h-14 flex items-center justify-center mb-4">
                  <Icon size={20} className="text-[#01FFFF]" />
                </div>
                <h3 className="text-white font-semibold text-base mb-1.5">{title}</h3>
                <p className="text-white/45 text-sm leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── INVITATION TYPES ──────────────────────────────── */}
      <section className="relative z-10 py-24 px-4 border-t border-[#01FFFF]/8">
        <div className="container mx-auto">
          <motion.div className="text-center mb-12" {...fadeUp}>
            <p className="text-[#01FFFF] text-xs tracking-widest uppercase font-medium mb-3">3 τύποι πρόσκλησης</p>
            <h2 className="text-4xl font-bold text-white">Διαλέξτε το στυλ <span className="text-[#01FFFF]">σας</span></h2>
            <p className="text-white/40 mt-3 text-base max-w-xl mx-auto">
              Κάθε ζευγάρι είναι μοναδικό. Σας προσφέρουμε τρεις διαφορετικές εμπειρίες.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {invitationTypes.map(({ icon: TypeIcon, title, subtitle, desc, highlights, accent }, i) => (
              <motion.div
                key={title + subtitle}
                className="bg-[#071218]/80 rounded-2xl border border-cyan-900/30 p-7 flex flex-col hover:shadow-[0_0_20px_rgba(1,255,255,0.10)] transition-all duration-200 will-change-transform group"
                style={{ '--accent': accent } as React.CSSProperties}
                {...(prefersReduced ? {} : {
                  initial: { opacity: 0, y: 24 },
                  whileInView: { opacity: 1, y: 0 },
                  viewport: { once: true },
                  transition: { duration: 0.4, delay: i * 0.1 },
                  whileHover: { y: -4, transition: { duration: 0.15 } },
                })}
              >
                <div className="bg-linear-to-br from-[#0A1A24] to-[#0D2436] p-3.5 rounded-xl w-14 h-14 flex items-center justify-center mb-5">
                  <TypeIcon size={22} style={{ color: accent }} />
                </div>
                <div className="mb-1">
                  <span className="text-white font-bold text-xl">{title} </span>
                  <span className="font-light text-white/50 text-xl">{subtitle}</span>
                </div>
                <p className="text-white/45 text-sm leading-relaxed mb-5 flex-1">{desc}</p>
                <ul className="space-y-1.5">
                  {highlights.map((h) => (
                    <li key={h} className="flex items-center gap-2 text-xs text-white/60">
                      <span className="w-1 h-1 rounded-full bg-[#01FFFF]/60 shrink-0" />
                      {h}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS (horizontal) ─────────────────────── */}
      <section className="relative z-10 py-24 px-4 border-t border-[#01FFFF]/8">
        <div className="container mx-auto max-w-5xl">
          <motion.div className="text-center mb-14" {...fadeUp}>
            <p className="text-[#01FFFF] text-xs tracking-widest uppercase font-medium mb-3">Πώς λειτουργεί</p>
            <h2 className="text-4xl font-bold text-white">Απλά, γρήγορα, <span className="text-[#01FFFF]">όμορφα</span></h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-0 relative">
            {/* Connecting line */}
            <div className="hidden md:block absolute top-10 left-1/6 right-1/6 h-px bg-linear-to-r from-transparent via-[#01FFFF]/20 to-transparent" />

            {steps.map(({ n, title, desc }, i) => (
              <motion.div
                key={n}
                className="relative flex flex-col items-center text-center px-6 pb-10 md:pb-0"
                {...(prefersReduced ? {} : {
                  initial: { opacity: 0, y: 20 },
                  whileInView: { opacity: 1, y: 0 },
                  viewport: { once: true },
                  transition: { duration: 0.4, delay: i * 0.12 },
                })}
              >
                {/* Step circle */}
                <div className="w-20 h-20 rounded-full border-2 border-[#01FFFF]/30 bg-[#071218] flex items-center justify-center mb-5 relative z-10">
                  <span className="text-[#01FFFF]/60 font-mono font-bold text-xl">{n}</span>
                </div>

                {/* Arrow between steps (mobile: hidden, desktop: shown) */}
                {i < 2 && (
                  <div className="hidden md:flex absolute top-10 -right-3 z-20 text-[#01FFFF]/25 items-center">
                    <ArrowRight size={18} />
                  </div>
                )}

                <h3 className="text-white font-semibold text-base mb-2">{title}</h3>
                <p className="text-white/45 text-sm leading-relaxed max-w-xs">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA (full-width gradient) ──────────────────────── */}
      <section className="relative z-10 py-24 px-4">
        <div className="container mx-auto">
          <motion.div
            className="relative rounded-3xl overflow-hidden"
            {...(prefersReduced ? {} : {
              initial: { opacity: 0, y: 24 },
              whileInView: { opacity: 1, y: 0 },
              viewport: { once: true },
              transition: { duration: 0.5 },
            })}
          >
            {/* Gradient bg */}
            <div className="absolute inset-0 bg-linear-to-br from-[#0A2530] via-[#071218] to-[#071218]" />
            <div className="absolute inset-0 bg-linear-to-r from-[#01FFFF]/8 via-transparent to-[#01A9FF]/6" />
            {/* Grid overlay */}
            <div
              className="absolute inset-0 opacity-[0.04]"
              style={{
                backgroundImage: 'linear-gradient(to right,#01FFFF 1px,transparent 1px),linear-gradient(to bottom,#01FFFF 1px,transparent 1px)',
                backgroundSize: '30px 30px',
              }}
            />

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center px-10 md:px-16 py-16">
              <div>
                <p className="text-[#01FFFF] text-xs tracking-widest uppercase font-medium mb-4">Έτοιμοι;</p>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  Φτιάχνουμε την πρόσκλησή σας<br />
                  <span className="text-[#01FFFF]">σε 24 ώρες</span>
                </h2>
                <p className="text-white/45 text-base leading-relaxed">
                  Επικοινωνήστε μαζί μας, στείλτε τα στοιχεία σας και σε λιγότερο από 24 ώρες
                  το link είναι έτοιμο για τους καλεσμένους σας.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row gap-4 lg:justify-end">
                <motion.a
                  href="https://adinfinity.gr/contact#contact-form"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-2 bg-[#01FFFF] hover:bg-[#01FFFF]/90 text-[#07141C] font-bold px-8 py-4 rounded-full text-base transition-colors"
                  whileHover={prefersReduced ? {} : { scale: 1.02 }}
                  whileTap={prefersReduced ? {} : { scale: 0.98 }}
                >
                  <Mail size={17} /> Επικοινωνήστε μαζί μας
                </motion.a>
                <Link
                  href="/ioanna-alexandros"
                  className="inline-flex items-center justify-center gap-2 border-2 border-[#01FFFF]/40 text-[#01FFFF] font-bold px-8 py-4 rounded-full text-base hover:border-[#01FFFF] hover:bg-[#01FFFF]/8 transition-all"
                >
                  Δείτε demo →
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── FOOTER ────────────────────────────────────────── */}
      <footer className="relative z-10 border-t border-[#01FFFF]/10 py-8 px-4">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-white/30 text-sm">
          <Image src="/logo.png" alt="adinfinity" width={90} height={30} className="object-contain opacity-50" />
          <p>© {new Date().getFullYear()} adinfinity. Όλα τα δικαιώματα διατηρούνται.</p>
        </div>
      </footer>

    </div>
  );
}
