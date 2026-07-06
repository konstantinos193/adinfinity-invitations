'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useRef, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { adminApi } from '@/lib/api';
import type { EventCategory, InvitationType, EventType, ContactRole } from '@/lib/types';
import { Plus, Trash2, ArrowLeft, Check, Upload, Loader2, Globe, Film, Video, Heart, Cake, PartyPopper } from 'lucide-react';
import { format } from 'date-fns';
import { el } from 'date-fns/locale';
import { supabase, COVER_BUCKET } from '@/lib/supabase';
import CoverImagesUpload from '@/components/CoverImagesUpload';
import MusicUpload from '@/components/MusicUpload';

interface EventForm { type: EventType; name: string; date: string; address: string; mapsUrl: string; }
interface ContactForm { role: ContactRole; name: string; phone: string; email: string; }
interface GiftForm { ownerName: string; bankName: string; iban: string; }

const inp = 'w-full bg-[#07141C] border border-[#01FFFF]/20 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/25 focus:outline-none focus:ring-2 focus:ring-[#01FFFF]/30 focus:border-[#01FFFF]/40 transition-colors';
const lbl = 'block text-xs font-medium text-white/50 mb-1 uppercase tracking-wide';
const sec = 'bg-[#071218]/60 backdrop-blur-sm rounded-2xl p-6 border border-[#01FFFF]/10 space-y-4';

function SecTitle({ title, desc }: { title: string; desc?: string }) {
  return (
    <div className="border-b border-[#01FFFF]/10 pb-3 mb-4">
      <h2 className="text-white font-semibold text-sm tracking-wide">{title}</h2>
      {desc && <p className="text-white/35 text-xs mt-0.5">{desc}</p>}
    </div>
  );
}

const FONTS = [
  { name: 'EB Garamond',     label: 'Garamond',     tag: 'Διαχρονικό' },
  { name: 'Alegreya',        label: 'Alegreya',     tag: 'Εκλεπτυσμένο' },
  { name: 'GFS Didot',       label: 'GFS Didot',    tag: 'Ελληνικό' },
  { name: 'Cardo',           label: 'Cardo',        tag: 'Κλασικό' },
  { name: 'Gentium Plus',    label: 'Gentium',      tag: 'Παραδοσιακό' },
  { name: 'Old Standard TT', label: 'Old Standard', tag: 'Ακαδημαϊκό' },
  { name: 'Tinos',           label: 'Tinos',        tag: 'Επίσημο' },
  { name: 'Noto Serif',      label: 'Noto Serif',   tag: 'Καθαρό' },
];

function mixColors(hex1: string, hex2: string) {
  const a = hexToRgb(hex1), b = hexToRgb(hex2);
  return rgbToHex(Math.round((a.r + b.r) / 2), Math.round((a.g + b.g) / 2), Math.round((a.b + b.b) / 2));
}
function hexToRgb(hex: string) {
  const h = hex.replace('#', '').padEnd(6, '0');
  return { r: parseInt(h.slice(0, 2), 16) || 0, g: parseInt(h.slice(2, 4), 16) || 0, b: parseInt(h.slice(4, 6), 16) || 0 };
}
function rgbToHex(r: number, g: number, b: number) {
  return '#' + [r, g, b].map((v) => Math.max(0, Math.min(255, v)).toString(16).padStart(2, '0')).join('');
}

const PALETTES = [
  { id: 'gold',      label: 'Χρυσό',       primary: '#b8960c', dark: '#8a6e08', swatch: '#b8960c' },
  { id: 'rose',      label: 'Rose Gold',   primary: '#b76e79', dark: '#8a4a55', swatch: '#b76e79' },
  { id: 'sage',      label: 'Sage',        primary: '#5a7a4e', dark: '#3d5635', swatch: '#5a7a4e' },
  { id: 'navy',      label: 'Navy',        primary: '#1e3a5f', dark: '#122340', swatch: '#1e3a5f' },
  { id: 'dusty',     label: 'Dusty Mauve', primary: '#9e7b7b', dark: '#7a5555', swatch: '#9e7b7b' },
  { id: 'terra',     label: 'Terracotta',  primary: '#c4623a', dark: '#a04828', swatch: '#c4623a' },
  { id: 'champagne', label: 'Champagne',   primary: '#c09a5e', dark: '#8a6a3a', swatch: '#c09a5e' },
  { id: 'burgundy',  label: 'Burgundy',    primary: '#7a1e3d', dark: '#550f28', swatch: '#7a1e3d' },
];

const BG_STYLES = [
  { id: 'warm-ivory', label: 'Warm Ivory',  gradient: 'linear-gradient(135deg,#2c1810 0%,#5c3320 50%,#8b5e3c 100%)', dot: '#8b5e3c' },
  { id: 'blush',      label: 'Blush',       gradient: 'linear-gradient(135deg,#3d0d1e 0%,#7a2a44 50%,#b86080 100%)', dot: '#b86080' },
  { id: 'sage',       label: 'Forest',      gradient: 'linear-gradient(135deg,#0d1e10 0%,#1e4022 50%,#386840 100%)', dot: '#386840' },
  { id: 'midnight',   label: 'Midnight',    gradient: 'linear-gradient(135deg,#050510 0%,#101030 50%,#1e1e50 100%)', dot: '#1e1e50' },
  { id: 'golden',     label: 'Golden Hour', gradient: 'linear-gradient(135deg,#1e1000 0%,#3d2400 50%,#6b4400 100%)', dot: '#6b4400' },
  { id: 'heritage',   label: 'Heritage',    gradient: 'linear-gradient(135deg,#b3a68f 0%,#c9c1ad 50%,#dbd5c6 100%)', dot: '#b3a68f' },
];

type PaletteShape = typeof PALETTES[0];

const CATEGORY_OPTIONS: { id: EventCategory; label: string; icon: React.ElementType; color: string }[] = [
  { id: 'ANNIVERSARY', label: 'Επέτειος', icon: Heart, color: 'text-rose-400' },
  { id: 'BIRTHDAY',   label: 'Γενέθλια', icon: Cake, color: 'text-amber-400' },
  { id: 'EVENT',      label: 'Εκδήλωση', icon: PartyPopper, color: 'text-purple-400' },
];

const FORMAT_OPTIONS: { id: InvitationType; label: string; desc: string; icon: React.ElementType; color: string }[] = [
  { id: 'MINI_WEBSITE',       label: 'Mini Web',   desc: 'Πλήρης ψηφιακή πρόσκληση με στυλ & gallery', icon: Globe, color: 'text-[#01FFFF]' },
  { id: 'VIDEO_PROSKLITIRIO', label: 'Video Pro',  desc: 'Video με πρόσκληση και custom cover',          icon: Film,  color: 'text-purple-400' },
  { id: 'VIDEO',              label: 'Video Only', desc: 'Απλό video invitation',                         icon: Video, color: 'text-blue-400' },
];

function PreviewCard({ eventCategory, brideName, groomName, honoreeName, eventTitle, yearsCount, eventDate, fontFamily, fontColor, palette, bgStyle }: {
  eventCategory: EventCategory;
  brideName: string; groomName: string;
  honoreeName: string; eventTitle: string;
  yearsCount: string; eventDate: string;
  fontFamily: string; fontColor: string;
  palette: PaletteShape; bgStyle: typeof BG_STYLES[0];
}) {
  const dateStr = eventDate ? format(new Date(eventDate), 'd MMMM yyyy', { locale: el }) : 'Ημερομηνία εκδήλωσης';
  const effectiveFont = fontFamily === 'CustomWeddingFont' ? 'CustomWeddingFont' : fontFamily;
  useEffect(() => {
    if (fontFamily === 'CustomWeddingFont') return;
    if (document.getElementById('editor-google-fonts')) return;
    const link = document.createElement('link');
    link.id = 'editor-google-fonts';
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400;1,700&family=EB+Garamond:ital,wght@0,400;0,600;1,400;1,600&family=Alegreya:ital,wght@0,400;0,700;1,400;1,700&family=GFS+Didot&family=Cardo:ital,wght@0,400;0,700;1,400&family=Gentium+Plus:ital,wght@0,400;0,700;1,400;1,700&family=Old+Standard+TT:ital,wght@0,400;0,700;1,400&family=Tinos:ital,wght@0,400;0,700;1,400;1,700&family=Noto+Serif:ital,wght@0,400;0,700;1,400;1,700&display=swap';
    document.head.appendChild(link);
  }, [fontFamily]);

  const getTitle = () => {
    if (eventCategory === 'ANNIVERSARY') return `${brideName || 'Όνομα'} & ${groomName || 'Όνομα'}`;
    if (eventCategory === 'BIRTHDAY') return honoreeName || 'Όνομα';
    return eventTitle || 'Τίτλος Εκδήλωσης';
  };

  const getSubtitle = () => {
    if (eventCategory === 'ANNIVERSARY' && yearsCount) return `${yearsCount} Χρόνια`;
    if (eventCategory === 'BIRTHDAY' && yearsCount) return `${yearsCount} Ετών`;
    return '';
  };

  const getCategoryLabel = () => {
    if (eventCategory === 'ANNIVERSARY') return 'Επέτειος';
    if (eventCategory === 'BIRTHDAY') return 'Γενέθλια';
    return 'Εκδήλωση';
  };

  return (
    <div className="rounded-2xl overflow-hidden shadow-2xl border border-white/10">
      <div className="relative flex flex-col items-center justify-center py-12 px-6 text-center" style={{ background: bgStyle.gradient }}>
        <div className="absolute inset-0 opacity-10">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="absolute rounded-full bg-white"
              style={{ width: 60 + i * 20, height: 60 + i * 20, top: `${10 + i * 14}%`, left: `${5 + i * 12}%`, opacity: 0.15 }} />
          ))}
        </div>
        <p className="relative text-white/60 text-[10px] tracking-[0.3em] uppercase mb-4">{getCategoryLabel()}</p>
        <h2 className="relative text-4xl italic leading-tight" style={{ fontFamily: `'${effectiveFont}', serif`, color: fontColor }}>
          {getTitle()}
        </h2>
        {getSubtitle() && (
          <p className="relative mt-2 text-white/70 text-sm font-medium">{getSubtitle()}</p>
        )}
        <div className="relative mt-4 w-24 h-px" style={{ backgroundColor: palette.primary, opacity: 0.8 }} />
        <p className="relative mt-3 text-white/80 text-xs tracking-widest uppercase">{dateStr}</p>
      </div>
      <div className="bg-[#fdfaf6] py-4 px-6 text-center">
        <p className="text-[10px] text-[#5c3320]/50 uppercase tracking-widest">Event Preview</p>
      </div>
    </div>
  );
}

function EventCreatePageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const typeParam = searchParams.get('type') as EventCategory | null;
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [eventCategory, setEventCategory] = useState<EventCategory>(typeParam && ['ANNIVERSARY', 'BIRTHDAY', 'EVENT'].includes(typeParam) ? typeParam : 'ANNIVERSARY');
  const [invitationType, setInvitationType] = useState<InvitationType>('MINI_WEBSITE');

  // Common fields
  const [slug, setSlug] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [story, setStory] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [coverImages, setCoverImages] = useState<string[]>([]);
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [rsvpDeadline, setRsvpDeadline] = useState('');
  const [status, setStatus] = useState<'DRAFT' | 'ACTIVE'>('DRAFT');

  // Category-specific fields
  const [brideName, setBrideName] = useState('');
  const [groomName, setGroomName] = useState('');
  const [honoreeName, setHonoreeName] = useState('');
  const [eventTitle, setEventTitle] = useState('');
  const [hostName, setHostName] = useState('');
  const [yearsCount, setYearsCount] = useState('');

  // Style fields
  const [fontFamily, setFontFamily] = useState(FONTS[0].name);
  const [paletteId, setPaletteId] = useState(PALETTES[0].id);
  const [bgStyleId, setBgStyleId] = useState(BG_STYLES[0].id);
  const [customFontUrl, setCustomFontUrl] = useState('');
  const [customFontUploading, setCustomFontUploading] = useState(false);
  const [customFontError, setCustomFontError] = useState('');
  const fontInputRef = useRef<HTMLInputElement>(null);
  const [customColor, setCustomColor] = useState('#b8960c');
  const [customHexInput, setCustomHexInput] = useState('B8960C');
  const colorInputRef = useRef<HTMLInputElement>(null);
  const [fontColor, setFontColor] = useState('#ffffff');
  const [fontColorHexInput, setFontColorHexInput] = useState('FFFFFF');
  const fontColorInputRef = useRef<HTMLInputElement>(null);
  const [musicUrl, setMusicUrl] = useState('');
  const [customBgFrom, setCustomBgFrom] = useState('#1a0a2e');
  const [customBgTo, setCustomBgTo] = useState('#4a1050');
  const bgFromRef = useRef<HTMLInputElement>(null);
  const bgToRef = useRef<HTMLInputElement>(null);

  const [events, setEvents] = useState<EventForm[]>([
    { type: 'CEREMONY', name: '', date: '', address: '', mapsUrl: '' },
  ]);
  const [contacts, setContacts] = useState<ContactForm[]>([
    { role: 'HOST', name: '', phone: '', email: '' },
  ]);
  const [gifts, setGifts] = useState<GiftForm[]>([{ ownerName: '', bankName: '', iban: '' }]);

  const uploadFont = async (file: File) => {
    const ext = file.name.split('.').pop()?.toLowerCase();
    if (!['woff', 'woff2', 'ttf', 'otf'].includes(ext ?? '')) { setCustomFontError('Επιλέξτε .woff, .woff2, .ttf ή .otf'); return; }
    setCustomFontError(''); setCustomFontUploading(true);
    try {
      const path = `fonts/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error: upErr } = await supabase.storage.from(COVER_BUCKET).upload(path, file, { contentType: file.type || 'font/woff2', upsert: false });
      if (upErr) throw upErr;
      const { data } = supabase.storage.from(COVER_BUCKET).getPublicUrl(path);
      const ff = new FontFace('CustomWeddingFont', `url(${data.publicUrl})`);
      await ff.load(); document.fonts.add(ff);
      setCustomFontUrl(data.publicUrl); setFontFamily('CustomWeddingFont');
    } catch (e: any) { setCustomFontError(e?.message ?? 'Αποτυχία μεταφόρτωσης.'); }
    finally { setCustomFontUploading(false); }
  };

  const resolvedPalette = paletteId === 'custom'
    ? { id: 'custom', label: 'Custom', primary: customColor, dark: customColor, swatch: customColor }
    : PALETTES.find((p) => p.id === paletteId) ?? PALETTES[0];
  const customBgGradient = `linear-gradient(135deg, ${customBgFrom} 0%, ${mixColors(customBgFrom, customBgTo)} 50%, ${customBgTo} 100%)`;
  const bgStyle = bgStyleId === 'custom' ? { id: 'custom', label: 'Custom', gradient: customBgGradient, dot: customBgTo } : BG_STYLES.find((b) => b.id === bgStyleId) ?? BG_STYLES[0];
  const rgb = hexToRgb(customColor);

  const autoSlug = (name: string) => name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  const upEv = (i: number, k: keyof EventForm, v: string) => setEvents((p) => p.map((e, idx) => idx === i ? { ...e, [k]: v } : e));
  const upCo = (i: number, k: keyof ContactForm, v: string) => setContacts((p) => p.map((c, idx) => idx === i ? { ...c, [k]: v } : c));
  const upGi = (i: number, k: keyof GiftForm, v: string) => setGifts((p) => p.map((g, idx) => idx === i ? { ...g, [k]: v } : g));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation per category
    if (eventCategory === 'ANNIVERSARY' && (!brideName || !groomName || !eventDate)) {
      setError('Συμπληρώστε τα ονόματα του ζευγαριού και την ημερομηνία.');
      return;
    }
    if (eventCategory === 'BIRTHDAY' && (!honoreeName || !eventDate)) {
      setError('Συμπληρώστε το όνομα και την ημερομηνία.');
      return;
    }
    if (eventCategory === 'EVENT' && (!eventTitle || !eventDate)) {
      setError('Συμπληρώστε τον τίτλο και την ημερομηνία.');
      return;
    }
    if (!slug) { setError('Συμπληρώστε το slug.'); return; }

    setLoading(true); setError('');
    try {
      const token = localStorage.getItem('admin_token');
      if (!token) { router.replace('/admin/login'); return; }
      
      const payload: Record<string, unknown> = {
        slug,
        eventCategory,
        weddingDate: new Date(eventDate).toISOString(),
        story: story || undefined,
        rsvpDeadline: rsvpDeadline ? new Date(rsvpDeadline).toISOString() : undefined,
        status,
        invitationType,
        events: events.filter((ev) => ev.name && ev.date).map((ev) => ({ ...ev, date: new Date(ev.date).toISOString(), address: ev.address || undefined, mapsUrl: ev.mapsUrl || undefined })),
        contacts: contacts.filter((c) => c.name).map((c) => ({ ...c, phone: c.phone || undefined, email: c.email || undefined })),
        giftRegistries: gifts.filter((g) => g.ownerName && g.iban).map((g) => ({ ...g, bankName: g.bankName || undefined })),
      };

      // Category-specific fields
      if (eventCategory === 'ANNIVERSARY') {
        payload.brideName = brideName;
        payload.groomName = groomName;
        payload.yearsCount = yearsCount ? parseInt(yearsCount) : undefined;
      } else if (eventCategory === 'BIRTHDAY') {
        payload.honoreeName = honoreeName;
        payload.yearsCount = yearsCount ? parseInt(yearsCount) : undefined;
      } else if (eventCategory === 'EVENT') {
        payload.eventTitle = eventTitle;
        payload.hostName = hostName || undefined;
        payload.honoreeName = honoreeName || undefined;
      }

      if (invitationType === 'MINI_WEBSITE') {
        payload.coverImageUrl = coverImages[0] || undefined;
        payload.coverImages = coverImages.length > 0 ? coverImages : undefined;
        payload.galleryImages = galleryImages.length > 0 ? galleryImages : undefined;
        payload.primaryColor = resolvedPalette.primary;
        payload.fontFamily = fontFamily === 'CustomWeddingFont' && customFontUrl ? `custom:${customFontUrl}` : fontFamily;
        payload.fontColor = fontColor;
        payload.backgroundStyle = bgStyleId === 'custom' ? `custom:${customBgFrom},${customBgTo}` : bgStyleId;
        payload.musicUrl = musicUrl || undefined;
      } else {
        payload.videoUrl = videoUrl || undefined;
      }

      await adminApi(token).post('/admin/invitations', payload);
      router.push('/admin');
    } catch (err: any) {
      const msg = err?.response?.data?.message;
      setError(Array.isArray(msg) ? msg.join(', ') : (msg ?? 'Σφάλμα κατά την αποθήκευση.'));
    } finally { setLoading(false); }
  };

  const isMiniWeb = invitationType === 'MINI_WEBSITE';
  const hasStyleFields = isMiniWeb || invitationType === 'VIDEO_PROSKLITIRIO';

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-8">
        <button type="button" onClick={() => router.push('/admin')} className="text-white/40 hover:text-white transition-colors">
          <ArrowLeft size={18} />
        </button>
        {(() => {
          const cat = CATEGORY_OPTIONS.find(c => c.id === eventCategory);
          const Icon = cat?.icon || PartyPopper;
          return <Icon size={16} className={cat?.color || 'text-white/70'} />;
        })()}
        <h1 className="text-white font-semibold">Νέα Πρόσκληση {eventCategory === 'ANNIVERSARY' ? 'Επετείου' : eventCategory === 'BIRTHDAY' ? 'Γενεθλίων' : 'Εκδήλωσης'}</h1>
        <span className="text-white/20 text-sm ml-auto">{CATEGORY_OPTIONS.find(c => c.id === eventCategory)?.label}</span>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="flex gap-8 items-start">
          <div className="flex-1 min-w-0 space-y-6">

            {/* Category selector */}
            <section className={sec}>
              <SecTitle title="Τύπος Εκδήλωσης" desc="Επιλέξτε την κατηγορία της πρόσκλησης" />
              <div className="grid grid-cols-3 gap-3">
                {CATEGORY_OPTIONS.map((c) => {
                  const Icon = c.icon;
                  return (
                    <button key={c.id} type="button" onClick={() => setEventCategory(c.id)}
                      className={`relative flex flex-col items-start p-4 rounded-xl border transition-all text-left ${
                        eventCategory === c.id ? 'border-[#01FFFF]/60 bg-[#01FFFF]/8' : 'border-white/8 bg-[#07141C]/50 hover:border-white/20'
                      }`}>
                      {eventCategory === c.id && (
                        <span className="absolute top-2 right-2 w-4 h-4 rounded-full bg-[#01FFFF] flex items-center justify-center">
                          <Check size={10} className="text-[#07141C]" />
                        </span>
                      )}
                      <Icon size={18} className={`mb-2 ${c.color}`} />
                      <span className="text-white text-sm font-medium">{c.label}</span>
                    </button>
                  );
                })}
              </div>
            </section>

            {/* Category-specific fields */}
            <section className={sec}>
              <SecTitle title="Στοιχεία Εκδήλωσης" />
              
              {eventCategory === 'ANNIVERSARY' && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={lbl}>Όνομα 1</label>
                    <input type="text" value={brideName} onChange={(e) => setBrideName(e.target.value)} className={inp} placeholder="Όνομα" />
                  </div>
                  <div>
                    <label className={lbl}>Όνομα 2</label>
                    <input type="text" value={groomName} onChange={(e) => setGroomName(e.target.value)} className={inp} placeholder="Όνομα" />
                  </div>
                  <div>
                    <label className={lbl}>Χρόνια μαζί (προαιρετικό)</label>
                    <input type="number" value={yearsCount} onChange={(e) => setYearsCount(e.target.value)} className={inp} placeholder="π.χ. 10" />
                  </div>
                </div>
              )}

              {eventCategory === 'BIRTHDAY' && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={lbl}>Όνομα Εορτάζοντος</label>
                    <input type="text" value={honoreeName} onChange={(e) => setHonoreeName(e.target.value)} className={inp} placeholder="Όνομα" />
                  </div>
                  <div>
                    <label className={lbl}>Ηλικία (προαιρετικό)</label>
                    <input type="number" value={yearsCount} onChange={(e) => setYearsCount(e.target.value)} className={inp} placeholder="π.χ. 30" />
                  </div>
                </div>
              )}

              {eventCategory === 'EVENT' && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className={lbl}>Τίτλος Εκδήλωσης</label>
                    <input type="text" value={eventTitle} onChange={(e) => setEventTitle(e.target.value)} className={inp} placeholder="π.χ. Χριστουγεννιάτικο Πάρτι" />
                  </div>
                  <div>
                    <label className={lbl}>Διοργανωτής (προαιρετικό)</label>
                    <input type="text" value={hostName} onChange={(e) => setHostName(e.target.value)} className={inp} placeholder="Όνομα" />
                  </div>
                  <div>
                    <label className={lbl}>Υπότιτλος (προαιρετικό)</label>
                    <input type="text" value={honoreeName} onChange={(e) => setHonoreeName(e.target.value)} className={inp} placeholder="π.χ. Αρχιστράτηγος Ελληνικής Επανάστασης" />
                  </div>
                </div>
              )}

              <div className="mt-4">
                <label className={lbl}>Ημερομηνία Εκδήλωσης</label>
                <input type="datetime-local" value={eventDate} onChange={(e) => setEventDate(e.target.value)} className={inp} />
              </div>
            </section>

            {/* Format selector */}
            <section className={sec}>
              <SecTitle title="Τύπος Πρόσκλησης" desc="Επιλέξτε τη μορφή της ψηφιακής πρόσκλησης" />
              <div className="grid grid-cols-3 gap-3">
                {FORMAT_OPTIONS.map((f) => {
                  const Icon = f.icon;
                  return (
                    <button key={f.id} type="button" onClick={() => setInvitationType(f.id)}
                      className={`relative flex flex-col items-start p-4 rounded-xl border transition-all text-left ${
                        invitationType === f.id ? 'border-[#01FFFF]/60 bg-[#01FFFF]/8' : 'border-white/8 bg-[#07141C]/50 hover:border-white/20'
                      }`}>
                      {invitationType === f.id && (
                        <span className="absolute top-2 right-2 w-4 h-4 rounded-full bg-[#01FFFF] flex items-center justify-center">
                          <Check size={10} className="text-[#07141C]" />
                        </span>
                      )}
                      <Icon size={18} className={`mb-2 ${f.color}`} />
                      <span className="text-white text-sm font-medium">{f.label}</span>
                      <span className="text-white/35 text-[11px] mt-0.5 leading-snug">{f.desc}</span>
                    </button>
                  );
                })}
              </div>
            </section>

            {/* Style section — MINI_WEBSITE and VIDEO_PROSKLITIRIO */}
            {hasStyleFields && (
              <section className={sec}>
                <SecTitle title="Στυλ & Αισθητική" desc="Επιλέξτε τον χαρακτήρα της πρόσκλησης" />
                
                {/* Font picker */}
                <div>
                  <label className={lbl}>Γραμματοσειρά</label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {FONTS.map((f) => (
                      <button key={f.name} type="button" onClick={() => setFontFamily(f.name)}
                        className={`relative flex flex-col items-start p-3 rounded-xl border transition-all text-left ${
                          fontFamily === f.name ? 'border-[#01FFFF]/60 bg-[#01FFFF]/8' : 'border-white/8 bg-[#07141C]/50 hover:border-white/20'
                        }`}>
                        {fontFamily === f.name && (
                          <span className="absolute top-2 right-2 w-4 h-4 rounded-full bg-[#01FFFF] flex items-center justify-center">
                            <Check size={10} className="text-[#07141C]" />
                          </span>
                        )}
                        <span className="text-white text-2xl leading-tight mb-1" style={{ fontFamily: `'${f.name}', serif` }}>ΑΒΓ</span>
                        <span className="text-white/40 text-[10px] uppercase tracking-wider">{f.label}</span>
                        <span className="text-white/20 text-[10px]">{f.tag}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Color palette */}
                <div>
                  <label className={lbl}>Χρωματική παλέτα</label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {PALETTES.map((p) => (
                      <button key={p.id} type="button" onClick={() => setPaletteId(p.id)} title={p.label}
                        className={`group relative flex flex-col items-center gap-1.5 p-2.5 rounded-xl border transition-all ${
                          paletteId === p.id ? 'border-[#01FFFF]/60 bg-[#01FFFF]/5' : 'border-white/8 hover:border-white/20'
                        }`}>
                        <div className="w-8 h-8 rounded-full shadow-lg ring-2 ring-offset-2 ring-offset-[#071218] transition-all" style={{ backgroundColor: p.swatch }} />
                        <span className="text-[10px] text-white/40 whitespace-nowrap">{p.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Background mood */}
                <div>
                  <label className={lbl}>Φόντο</label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {BG_STYLES.map((b) => (
                      <button key={b.id} type="button" onClick={() => setBgStyleId(b.id)}
                        className={`relative flex flex-col items-center gap-1.5 p-2 rounded-xl border transition-all ${
                          bgStyleId === b.id ? 'border-[#01FFFF]/60 bg-[#01FFFF]/5' : 'border-white/8 hover:border-white/20'
                        }`}>
                        {bgStyleId === b.id && (
                          <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-[#01FFFF] flex items-center justify-center z-10">
                            <Check size={9} className="text-[#07141C]" />
                          </span>
                        )}
                        <div className="w-14 h-10 rounded-lg shadow-md" style={{ background: b.gradient }} />
                        <span className="text-[10px] text-white/40 whitespace-nowrap">{b.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Font color */}
                <div>
                  <label className={lbl}>Χρώμα γραμματοσειράς</label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {[
                      { hex: '#ffffff', label: 'Λευκό' },
                      { hex: '#f5efe6', label: 'Κρεμ' },
                      { hex: '#b8960c', label: 'Χρυσό' },
                      { hex: '#b76e79', label: 'Rose' },
                      { hex: '#1a1a1a', label: 'Μαύρο' },
                    ].map(({ hex, label }) => (
                      <button key={hex} type="button"
                        onClick={() => { setFontColor(hex); setFontColorHexInput(hex.slice(1).toUpperCase()); }}
                        title={label}
                        className={`flex flex-col items-center gap-1 p-2 rounded-xl border transition-all ${
                          fontColor === hex ? 'border-[#01FFFF]/60 bg-[#01FFFF]/5' : 'border-white/8 hover:border-white/20'
                        }`}>
                        <div className="w-7 h-7 rounded-full border border-white/20" style={{ backgroundColor: hex }} />
                        <span className="text-[10px] text-white/40">{label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {isMiniWeb && (
                  <div>
                    <MusicUpload value={musicUrl} onChange={setMusicUrl} />
                  </div>
                )}
              </section>
            )}

            {/* Cover images */}
            {isMiniWeb && (
              <section className={sec}>
                <SecTitle title="Εικόνες" />
                <CoverImagesUpload values={coverImages} onChange={setCoverImages} />
                {bgStyleId === 'heritage' && eventCategory === 'EVENT' && (
                  <p className="text-white/35 text-xs">Στο στυλ Heritage: η 1η εικόνα είναι η κεντρική φωτογραφία, η 2η (προαιρετικά) το λογότυπο/έμβλημα.</p>
                )}
              </section>
            )}

            {/* Video URL (for VIDEO types) */}
            {!isMiniWeb && (
              <section className={sec}>
                <SecTitle title="Video" />
                <div>
                  <label className={lbl}>URL Video</label>
                  <input type="url" value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} className={inp} placeholder="https://..." />
                </div>
              </section>
            )}

            {/* Events */}
            <section className={sec}>
              <SecTitle title="Συμβάντα" />
              {events.map((ev, i) => (
                <div key={i} className="grid grid-cols-2 gap-3 p-4 bg-[#07141C]/40 rounded-xl">
                  <div>
                    <label className={lbl}>Τύπος</label>
                    <select value={ev.type} onChange={(e) => upEv(i, 'type', e.target.value)} className={inp}>
                      <option value="CEREMONY">Τελετή</option>
                      <option value="RECEPTION">Δεξίωση</option>
                    </select>
                  </div>
                  <div>
                    <label className={lbl}>Όνομα</label>
                    <input type="text" value={ev.name} onChange={(e) => upEv(i, 'name', e.target.value)} className={inp} placeholder="π.χ. Τελετή" />
                  </div>
                  <div>
                    <label className={lbl}>Ημερομηνία/Ώρα</label>
                    <input type="datetime-local" value={ev.date} onChange={(e) => upEv(i, 'date', e.target.value)} className={inp} />
                  </div>
                  <div>
                    <label className={lbl}>Διεύθυνση</label>
                    <input type="text" value={ev.address} onChange={(e) => upEv(i, 'address', e.target.value)} className={inp} placeholder="Διεύθυνση" />
                  </div>
                  <div className="col-span-2">
                    <label className={lbl}>Google Maps URL (προαιρετικό)</label>
                    <input type="url" value={ev.mapsUrl} onChange={(e) => upEv(i, 'mapsUrl', e.target.value)} className={inp} placeholder="https://maps.google.com/..." />
                  </div>
                  {events.length > 1 && (
                    <button type="button" onClick={() => setEvents((p) => p.filter((_, idx) => idx !== i))} className="col-span-2 text-red-400 text-xs hover:text-red-300">
                      <Trash2 size={12} className="inline mr-1" /> Διαγραφή
                    </button>
                  )}
                </div>
              ))}
              <button type="button" onClick={() => setEvents((p) => [...p, { type: 'CEREMONY', name: '', date: '', address: '', mapsUrl: '' }])} className="text-[#01FFFF] text-xs hover:text-[#01FFFF]/80">
                <Plus size={12} className="inline mr-1" /> Προσθήκη συμβάντος
              </button>
            </section>

            {/* Contacts */}
            <section className={sec}>
              <SecTitle title="Επαφές" />
              {contacts.map((c, i) => (
                <div key={i} className="grid grid-cols-2 gap-3 p-4 bg-[#07141C]/40 rounded-xl">
                  <div>
                    <label className={lbl}>Ρόλος</label>
                    <select value={c.role} onChange={(e) => upCo(i, 'role', e.target.value as ContactRole)} className={inp}>
                      <option value="HOST">Διοργανωτής</option>
                      <option value="BRIDE">Νύφη</option>
                      <option value="GROOM">Γαμπρός</option>
                      <option value="FATHER">Πατέρας</option>
                      <option value="MOTHER">Μητέρα</option>
                      <option value="BEST_MAN">Κουμπάρος</option>
                      <option value="MAID_OF_HONOR">Κουμπάρα</option>
                      <option value="GODFATHER">Νονός</option>
                      <option value="GODMOTHER">Νονά</option>
                    </select>
                  </div>
                  <div>
                    <label className={lbl}>Όνομα</label>
                    <input type="text" value={c.name} onChange={(e) => upCo(i, 'name', e.target.value)} className={inp} placeholder="Όνομα" />
                  </div>
                  <div>
                    <label className={lbl}>Τηλέφωνο</label>
                    <input type="tel" value={c.phone} onChange={(e) => upCo(i, 'phone', e.target.value)} className={inp} placeholder="Τηλέφωνο" />
                  </div>
                  <div>
                    <label className={lbl}>Email</label>
                    <input type="email" value={c.email} onChange={(e) => upCo(i, 'email', e.target.value)} className={inp} placeholder="Email" />
                  </div>
                  {contacts.length > 1 && (
                    <button type="button" onClick={() => setContacts((p) => p.filter((_, idx) => idx !== i))} className="col-span-2 text-red-400 text-xs hover:text-red-300">
                      <Trash2 size={12} className="inline mr-1" /> Διαγραφή
                    </button>
                  )}
                </div>
              ))}
              <button type="button" onClick={() => setContacts((p) => [...p, { role: 'HOST', name: '', phone: '', email: '' }])} className="text-[#01FFFF] text-xs hover:text-[#01FFFF]/80">
                <Plus size={12} className="inline mr-1" /> Προσθήκη επαφής
              </button>
            </section>

            {/* Gift registries */}
            <section className={sec}>
              <SecTitle title="Λογαριασμοί Δώρων" />
              {gifts.map((g, i) => (
                <div key={i} className="grid grid-cols-3 gap-3 p-4 bg-[#07141C]/40 rounded-xl">
                  <div>
                    <label className={lbl}>Όνομα ιδιοκτήτη</label>
                    <input type="text" value={g.ownerName} onChange={(e) => upGi(i, 'ownerName', e.target.value)} className={inp} placeholder="Όνομα" />
                  </div>
                  <div>
                    <label className={lbl}>Τράπεζα (προαιρετικό)</label>
                    <input type="text" value={g.bankName} onChange={(e) => upGi(i, 'bankName', e.target.value)} className={inp} placeholder="Τράπεζα" />
                  </div>
                  <div>
                    <label className={lbl}>IBAN</label>
                    <input type="text" value={g.iban} onChange={(e) => upGi(i, 'iban', e.target.value)} className={inp} placeholder="IBAN" />
                  </div>
                  {gifts.length > 1 && (
                    <button type="button" onClick={() => setGifts((p) => p.filter((_, idx) => idx !== i))} className="col-span-3 text-red-400 text-xs hover:text-red-300">
                      <Trash2 size={12} className="inline mr-1" /> Διαγραφή
                    </button>
                  )}
                </div>
              ))}
              <button type="button" onClick={() => setGifts((p) => [...p, { ownerName: '', bankName: '', iban: '' }])} className="text-[#01FFFF] text-xs hover:text-[#01FFFF]/80">
                <Plus size={12} className="inline mr-1" /> Προσθήκη λογαριασμού
              </button>
            </section>

            {/* Story */}
            <section className={sec}>
              <SecTitle title="Περιγραφή / Ιστορία" />
              <textarea value={story} onChange={(e) => setStory(e.target.value)} className={inp} rows={4} placeholder="Προσθέστε περιγραφή..." />
            </section>

            {/* Settings */}
            <section className={sec}>
              <SecTitle title="Ρυθμίσεις" />
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={lbl}>Slug (URL)</label>
                  <input type="text" value={slug} onChange={(e) => setSlug(e.target.value)} className={inp} placeholder="my-event" />
                </div>
                <div>
                  <label className={lbl}>Κατάσταση</label>
                  <select value={status} onChange={(e) => setStatus(e.target.value as 'DRAFT' | 'ACTIVE')} className={inp}>
                    <option value="DRAFT">Προσχέδιο</option>
                    <option value="ACTIVE">Ενεργή</option>
                  </select>
                </div>
                <div>
                  <label className={lbl}>RSVP Deadline (προαιρετικό)</label>
                  <input type="datetime-local" value={rsvpDeadline} onChange={(e) => setRsvpDeadline(e.target.value)} className={inp} />
                </div>
              </div>
            </section>

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-red-400 text-sm">
                {error}
              </div>
            )}

            <div className="flex gap-3">
              <button type="submit" disabled={loading} className="flex-1 bg-[#01FFFF] text-[#07141C] font-semibold py-3 px-6 rounded-xl hover:bg-[#01FFFF]/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
                {loading ? <><Loader2 size={16} className="animate-spin" /><span>Αποθήκευση...</span></> : <span>Αποθήκευση</span>}
              </button>
              <button type="button" onClick={() => router.push('/admin')} className="px-6 py-3 rounded-xl border border-white/10 text-white/60 hover:text-white hover:border-white/20 transition-colors">
                Ακύρωση
              </button>
            </div>
          </div>

          {/* Preview sidebar */}
          <div className="w-80 shrink-0 space-y-6 sticky top-8">
            <PreviewCard
              eventCategory={eventCategory}
              brideName={brideName}
              groomName={groomName}
              honoreeName={honoreeName}
              eventTitle={eventTitle}
              yearsCount={yearsCount}
              eventDate={eventDate}
              fontFamily={fontFamily}
              fontColor={fontColor}
              palette={resolvedPalette}
              bgStyle={bgStyle}
            />
          </div>
        </div>
      </form>
    </div>
  );
}

export default function EventCreatePage() {
  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto px-4 py-8 text-white/50">Φόρτωση...</div>}>
      <EventCreatePageContent />
    </Suspense>
  );
}
