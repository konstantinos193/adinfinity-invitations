'use client';

import { useEffect, useRef, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { adminApi } from '@/lib/api';
import type { Invitation, EventType, ContactRole } from '@/lib/types';
import { AlertTriangle, ArrowLeft, Check, Loader2, Plus, Trash2, Upload } from 'lucide-react';
import { format } from 'date-fns';
import { el } from 'date-fns/locale';
import { supabase, COVER_BUCKET } from '@/lib/supabase';
import CoverImagesUpload from '@/components/CoverImagesUpload';
import MusicUpload from '@/components/MusicUpload';

const inputCls = 'w-full bg-[#07141C] border border-[#01FFFF]/20 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/25 focus:outline-none focus:ring-2 focus:ring-[#01FFFF]/30 focus:border-[#01FFFF]/40 transition-colors';
const labelCls = 'block text-xs font-medium text-white/50 mb-1 uppercase tracking-wide';
const sectionCls = 'bg-[#071218]/60 backdrop-blur-sm rounded-2xl p-6 border border-[#01FFFF]/10 space-y-4';

function fmt(iso: string | null | undefined) {
  return iso ? iso.slice(0, 16) : '';
}

interface EventRow { type: EventType; name: string; date: string; address: string; mapsUrl: string; }
interface ContactRow { role: ContactRole; name: string; phone: string; email: string; }
interface GiftRow { ownerName: string; bankName: string; iban: string; }

const blankEvent = (): EventRow => ({ type: 'CEREMONY', name: '', date: '', address: '', mapsUrl: '' });
const blankContact = (): ContactRow => ({ role: 'BRIDE', name: '', phone: '', email: '' });
const blankGift = (): GiftRow => ({ ownerName: '', bankName: '', iban: '' });

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

type PaletteShape = { id: string; label: string; primary: string; dark: string; swatch: string };

function PreviewCard({
  brideName, groomName, weddingDate, fontFamily, palette, bgStyle,
}: {
  brideName: string; groomName: string; weddingDate: string;
  fontFamily: string; palette: PaletteShape; bgStyle: typeof BG_STYLES[0];
}) {
  const dateStr = weddingDate
    ? format(new Date(weddingDate), 'd MMMM yyyy', { locale: el })
    : 'Ημερομηνία γάμου';
  return (
    <div className="rounded-2xl overflow-hidden shadow-2xl border border-white/10">
      <div className="relative flex flex-col items-center justify-center py-12 px-6 text-center" style={{ background: bgStyle.gradient }}>
        <div className="absolute inset-0 opacity-10">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="absolute rounded-full bg-white"
              style={{ width: 60 + i * 20, height: 60 + i * 20, top: `${10 + i * 14}%`, left: `${5 + i * 12}%`, opacity: 0.15 }} />
          ))}
        </div>
        <p className="relative text-white/60 text-[10px] tracking-[0.3em] uppercase mb-4">Με χαρά σας καλούμε</p>
        <h2 className="relative text-white text-4xl italic leading-tight" style={{ fontFamily: `'${fontFamily}', serif` }}>
          {brideName || 'Νύφη'}
        </h2>
        <div className="relative my-2 text-2xl" style={{ color: palette.primary }}>&</div>
        <h2 className="relative text-white text-4xl italic leading-tight" style={{ fontFamily: `'${fontFamily}', serif` }}>
          {groomName || 'Γαμπρός'}
        </h2>
        <div className="relative mt-4 w-24 h-px" style={{ backgroundColor: palette.primary, opacity: 0.8 }} />
        <p className="relative mt-3 text-white/80 text-xs tracking-widest uppercase">{dateStr}</p>
      </div>
      <div className="bg-[#fdfaf6] py-4 px-6 text-center">
        <p className="text-[10px] text-[#5c3320]/50 uppercase tracking-widest">Mini Web Preview</p>
      </div>
    </div>
  );
}

export default function AdminEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // Core fields
  const [slug, setSlug] = useState('');
  const [brideName, setBrideName] = useState('');
  const [groomName, setGroomName] = useState('');
  const [weddingDate, setWeddingDate] = useState('');
  const [story, setStory] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [coverImages, setCoverImages] = useState<string[]>([]);
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [rsvpDeadline, setRsvpDeadline] = useState('');
  const [status, setStatus] = useState('DRAFT');
  const [invitationType, setInvitationType] = useState('MINI_WEBSITE');
  const [events, setEvents] = useState<EventRow[]>([blankEvent()]);
  const [contacts, setContacts] = useState<ContactRow[]>([blankContact()]);
  const [gifts, setGifts] = useState<GiftRow[]>([]);

  // Style fields (active when invitationType === 'MINI_WEBSITE')
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

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) { router.replace('/admin/login'); return; }
    adminApi(token)
      .get<Invitation>(`/admin/invitations/${id}`)
      .then((r) => {
        const inv = r.data;
        setSlug(inv.slug);
        setBrideName(inv.brideName);
        setGroomName(inv.groomName);
        setWeddingDate(fmt(inv.weddingDate));
        setStory(inv.story ?? '');
        setVideoUrl(inv.videoUrl ?? '');
        setCoverImages(inv.coverImages ?? (inv.coverImageUrl ? [inv.coverImageUrl] : []));
        setGalleryImages(inv.galleryImages ?? []);
        setRsvpDeadline(fmt(inv.rsvpDeadline));
        setStatus(inv.status);
        setInvitationType(inv.invitationType ?? 'MINI_WEBSITE');
        setEvents(inv.events.length > 0
          ? inv.events.map((e) => ({ type: e.type, name: e.name, date: fmt(e.date), address: e.address ?? '', mapsUrl: e.mapsUrl ?? '' }))
          : [blankEvent()]);
        setContacts(inv.contacts.length > 0
          ? inv.contacts.map((c) => ({ role: c.role, name: c.name, phone: c.phone ?? '', email: c.email ?? '' }))
          : [blankContact()]);
        setGifts(inv.giftRegistries.map((g) => ({ ownerName: g.ownerName, bankName: g.bankName ?? '', iban: g.iban })));

        // Parse stored style values
        if (inv.fontFamily) {
          if (inv.fontFamily.startsWith('custom:')) {
            const url = inv.fontFamily.slice(7);
            setCustomFontUrl(url);
            setFontFamily('CustomWeddingFont');
            const ff = new FontFace('CustomWeddingFont', `url(${url})`);
            ff.load().then((f) => document.fonts.add(f)).catch(() => {});
          } else {
            setFontFamily(inv.fontFamily);
          }
        }
        if (inv.primaryColor) {
          const match = PALETTES.find((p) => p.primary === inv.primaryColor);
          if (match) {
            setPaletteId(match.id);
          } else {
            setPaletteId('custom');
            setCustomColor(inv.primaryColor);
            setCustomHexInput(inv.primaryColor.slice(1).toUpperCase());
          }
        }
        if (inv.backgroundStyle) {
          if (inv.backgroundStyle.startsWith('custom:')) {
            setBgStyleId('custom');
            const parts = inv.backgroundStyle.slice(7).split(',');
            if (parts[0]) setCustomBgFrom(parts[0]);
            if (parts[1]) setCustomBgTo(parts[1]);
          } else {
            setBgStyleId(inv.backgroundStyle);
          }
        }
        if (inv.fontColor) { setFontColor(inv.fontColor); setFontColorHexInput(inv.fontColor.slice(1).toUpperCase()); }
        if (inv.musicUrl) setMusicUrl(inv.musicUrl);
      })
      .catch(() => router.replace('/admin'))
      .finally(() => setLoading(false));
  }, [id, router]);

  const updateEvent = (i: number, key: keyof EventRow, v: string) =>
    setEvents((rows) => rows.map((r, idx) => idx === i ? { ...r, [key]: v } : r));
  const updateContact = (i: number, key: keyof ContactRow, v: string) =>
    setContacts((rows) => rows.map((r, idx) => idx === i ? { ...r, [key]: v } : r));
  const updateGift = (i: number, key: keyof GiftRow, v: string) =>
    setGifts((rows) => rows.map((r, idx) => idx === i ? { ...r, [key]: v } : r));

  const uploadFont = async (file: File) => {
    const ext = file.name.split('.').pop()?.toLowerCase();
    if (!['woff', 'woff2', 'ttf', 'otf'].includes(ext ?? '')) {
      setCustomFontError('Επιλέξτε αρχείο .woff, .woff2, .ttf ή .otf');
      return;
    }
    setCustomFontError('');
    setCustomFontUploading(true);
    try {
      const path = `fonts/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error: upErr } = await supabase.storage.from(COVER_BUCKET).upload(path, file, {
        contentType: file.type || 'font/woff2',
        upsert: false,
      });
      if (upErr) throw upErr;
      const { data } = supabase.storage.from(COVER_BUCKET).getPublicUrl(path);
      const ff = new FontFace('CustomWeddingFont', `url(${data.publicUrl})`);
      await ff.load();
      document.fonts.add(ff);
      setCustomFontUrl(data.publicUrl);
      setFontFamily('CustomWeddingFont');
    } catch (e: any) {
      setCustomFontError(e?.message ?? 'Αποτυχία μεταφόρτωσης.');
    } finally {
      setCustomFontUploading(false);
    }
  };

  const resolvedPalette: PaletteShape = paletteId === 'custom'
    ? { id: 'custom', label: 'Custom', primary: customColor, dark: customColor, swatch: customColor }
    : PALETTES.find((p) => p.id === paletteId) ?? PALETTES[0];

  const customBgGradient = `linear-gradient(135deg, ${customBgFrom} 0%, ${mixColors(customBgFrom, customBgTo)} 50%, ${customBgTo} 100%)`;
  const resolvedBgStyle = bgStyleId === 'custom'
    ? { id: 'custom', label: 'Custom', gradient: customBgGradient, dot: customBgTo }
    : BG_STYLES.find((b) => b.id === bgStyleId) ?? BG_STYLES[0];
  const rgb = hexToRgb(customColor);
  const isMiniWeb = invitationType === 'MINI_WEBSITE';
  const hasStyleFields = isMiniWeb || invitationType === 'VIDEO_PROSKLITIRIO';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const token = localStorage.getItem('admin_token')!;
      await adminApi(token).patch(`/admin/invitations/${id}`, {
        slug: slug || undefined,
        brideName,
        groomName,
        weddingDate: new Date(weddingDate).toISOString(),
        story: story || undefined,
        videoUrl: videoUrl || undefined,
        coverImageUrl: coverImages[0] || undefined,
        coverImages: coverImages.length > 0 ? coverImages : [],
        galleryImages: galleryImages,
        rsvpDeadline: rsvpDeadline ? new Date(rsvpDeadline).toISOString() : null,
        status,
        invitationType,
        ...(hasStyleFields && {
          primaryColor: resolvedPalette.primary,
          fontFamily: fontFamily === 'CustomWeddingFont' && customFontUrl ? `custom:${customFontUrl}` : fontFamily,
          fontColor: fontColor !== '#ffffff' ? fontColor : undefined,
          backgroundStyle: bgStyleId === 'custom' ? `custom:${customBgFrom},${customBgTo}` : bgStyleId,
          musicUrl: musicUrl || undefined,
        }),
        events: events
          .filter((ev) => ev.name && ev.date)
          .map((ev) => ({ ...ev, date: new Date(ev.date).toISOString(), address: ev.address || undefined, mapsUrl: ev.mapsUrl || undefined })),
        contacts: contacts
          .filter((c) => c.name)
          .map((c) => ({ ...c, phone: c.phone || undefined, email: c.email || undefined })),
        giftRegistries: gifts
          .filter((g) => g.ownerName && g.iban)
          .map((g) => ({ ...g, bankName: g.bankName || undefined })),
      });
      router.push('/admin');
    } catch (err: any) {
      const msg = err?.response?.data?.message;
      setError(Array.isArray(msg) ? msg.join(', ') : (msg ?? 'Σφάλμα αποθήκευσης.'));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="flex items-center gap-2 text-[#01FFFF]/60 text-sm">
          <div className="w-4 h-4 border-2 border-[#01FFFF]/30 border-t-[#01FFFF] rounded-full animate-spin" />
          Φόρτωση...
        </div>
      </div>
    );
  }

  const formSections = (
    <div className="space-y-6">
      {/* Style section — MINI_WEBSITE and VIDEO_PROSKLITIRIO */}
      {hasStyleFields && (
        <div className={sectionCls}>
          <div className="border-b border-[#01FFFF]/10 pb-3 mb-4">
            <h2 className="text-white font-semibold text-sm tracking-wide">Στυλ & Αισθητική</h2>
            <p className="text-white/35 text-xs mt-0.5">Επιλέξτε τον χαρακτήρα της πρόσκλησης</p>
          </div>

          {/* Font picker */}
          <div>
            <label className={labelCls}>Γραμματοσειρά ονομάτων</label>
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
                  <span className="text-white text-2xl leading-tight mb-1" style={{ fontFamily: `'${f.name}', serif` }}>Νύφη & Γαμπρός</span>
                  <span className="text-white/40 text-[10px] uppercase tracking-wider">{f.label}</span>
                  <span className="text-white/20 text-[10px]">{f.tag}</span>
                </button>
              ))}
            </div>
            <div className="mt-2">
              {customFontUrl ? (
                <button type="button" onClick={() => setFontFamily('CustomWeddingFont')}
                  className={`relative w-full flex items-center gap-4 p-3 rounded-xl border transition-all text-left ${
                    fontFamily === 'CustomWeddingFont' ? 'border-[#01FFFF]/60 bg-[#01FFFF]/8' : 'border-white/8 bg-[#07141C]/50 hover:border-white/20'
                  }`}>
                  {fontFamily === 'CustomWeddingFont' && (
                    <span className="absolute top-2 right-2 w-4 h-4 rounded-full bg-[#01FFFF] flex items-center justify-center">
                      <Check size={10} className="text-[#07141C]" />
                    </span>
                  )}
                  <span className="text-white text-2xl italic leading-tight" style={{ fontFamily: 'CustomWeddingFont, serif' }}>Αγάπη</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-white/40 text-[10px] uppercase tracking-wider">Custom Upload</div>
                    <div className="text-white/20 text-[10px]">Your Font</div>
                  </div>
                  <span role="button" onClick={(e) => { e.stopPropagation(); fontInputRef.current?.click(); }}
                    className="text-white/25 hover:text-[#01FFFF]/60 transition-colors p-1 rounded cursor-pointer">
                    <Upload size={13} />
                  </span>
                </button>
              ) : (
                <button type="button" onClick={() => fontInputRef.current?.click()} disabled={customFontUploading}
                  className="w-full flex items-center justify-center gap-2 p-3 rounded-xl border border-dashed border-white/12 hover:border-[#01FFFF]/30 hover:bg-[#01FFFF]/3 transition-all text-white/35 hover:text-white/60 disabled:opacity-50">
                  {customFontUploading
                    ? <><Loader2 size={14} className="animate-spin" /><span className="text-xs">Μεταφόρτωση...</span></>
                    : <><Upload size={14} /><span className="text-xs">Φόρτωση custom γραμματοσειράς (.woff .ttf .otf)</span></>}
                </button>
              )}
              {customFontError && <p className="text-xs text-red-400 mt-1">{customFontError}</p>}
              <input ref={fontInputRef} type="file" accept=".woff,.woff2,.ttf,.otf" className="hidden"
                onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadFont(f); e.target.value = ''; }} />
            </div>
          </div>

          {/* Color palette */}
          <div>
            <label className={labelCls}>Χρωματική παλέτα</label>
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
              <button type="button" onClick={() => setPaletteId('custom')} title="Custom"
                className={`group relative flex flex-col items-center gap-1.5 p-2.5 rounded-xl border transition-all ${
                  paletteId === 'custom' ? 'border-[#01FFFF]/60 bg-[#01FFFF]/5' : 'border-white/8 hover:border-white/20'
                }`}>
                <div className="w-8 h-8 rounded-full shadow-lg ring-2 ring-offset-2 ring-offset-[#071218] overflow-hidden"
                  style={{ background: paletteId === 'custom' ? customColor : 'conic-gradient(from 0deg, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000)' }} />
                <span className="text-[10px] text-white/40 whitespace-nowrap">Custom</span>
              </button>
            </div>
            {paletteId === 'custom' && (
              <div className="mt-3 p-4 bg-[#07141C]/80 rounded-xl border border-[#01FFFF]/15 space-y-3">
                <div className="flex items-start gap-4">
                  <div className="flex flex-col items-center gap-1.5 shrink-0">
                    <div className="w-14 h-14 rounded-xl cursor-pointer border border-white/15 hover:border-white/30 transition-colors shadow-lg"
                      style={{ backgroundColor: customColor }}
                      onClick={() => { if (colorInputRef.current) { colorInputRef.current.value = customColor; colorInputRef.current.click(); } }}
                      title="Κλικ για color picker" />
                    <span className="text-[10px] text-white/25">Picker</span>
                    <input ref={colorInputRef} type="color"
                      onChange={(e) => { setCustomColor(e.target.value); setCustomHexInput(e.target.value.slice(1).toUpperCase()); }}
                      className="sr-only" />
                  </div>
                  <div className="flex-1 space-y-2.5">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-white/35 font-mono w-8 shrink-0">HEX</span>
                      <div className="flex items-center bg-[#07141C] border border-[#01FFFF]/15 rounded-lg overflow-hidden flex-1 focus-within:border-[#01FFFF]/40 transition-colors">
                        <span className="pl-3 text-white/30 text-sm font-mono">#</span>
                        <input type="text" maxLength={6} value={customHexInput}
                          onChange={(e) => {
                            const v = e.target.value.replace(/[^0-9a-fA-F]/g, '').toUpperCase().slice(0, 6);
                            setCustomHexInput(v);
                            if (v.length === 6) setCustomColor('#' + v.toLowerCase());
                          }}
                          onBlur={() => setCustomHexInput(customColor.slice(1).toUpperCase())}
                          className="flex-1 bg-transparent text-white text-sm font-mono py-2 pr-3 focus:outline-none"
                          placeholder="B8960C" />
                      </div>
                    </div>
                    {(['R', 'G', 'B'] as const).map((ch, i) => {
                      const val = [rgb.r, rgb.g, rgb.b][i];
                      const accent = ['#ef4444', '#22c55e', '#3b82f6'][i];
                      return (
                        <div key={ch} className="flex items-center gap-2">
                          <span className="text-[10px] text-white/35 font-mono w-8 shrink-0">{ch}</span>
                          <input type="range" min={0} max={255} value={val}
                            onChange={(e) => {
                              const vals: [number, number, number] = [rgb.r, rgb.g, rgb.b];
                              vals[i] = parseInt(e.target.value);
                              const hex = rgbToHex(vals[0], vals[1], vals[2]);
                              setCustomColor(hex); setCustomHexInput(hex.slice(1).toUpperCase());
                            }}
                            className="flex-1 cursor-pointer" style={{ accentColor: accent }} />
                          <input type="number" min={0} max={255} value={val}
                            onChange={(e) => {
                              const vals: [number, number, number] = [rgb.r, rgb.g, rgb.b];
                              vals[i] = Math.max(0, Math.min(255, parseInt(e.target.value) || 0));
                              const hex = rgbToHex(vals[0], vals[1], vals[2]);
                              setCustomColor(hex); setCustomHexInput(hex.slice(1).toUpperCase());
                            }}
                            className="w-11 text-center text-xs text-white/70 bg-[#07141C] border border-[#01FFFF]/15 rounded-lg py-1.5 focus:outline-none focus:border-[#01FFFF]/40 transition-colors" />
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Background mood */}
          <div>
            <label className={labelCls}>Φόντο hero</label>
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
              <button type="button" onClick={() => setBgStyleId('custom')}
                className={`relative flex flex-col items-center gap-1.5 p-2 rounded-xl border transition-all ${
                  bgStyleId === 'custom' ? 'border-[#01FFFF]/60 bg-[#01FFFF]/5' : 'border-white/8 hover:border-white/20'
                }`}>
                {bgStyleId === 'custom' && (
                  <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-[#01FFFF] flex items-center justify-center z-10">
                    <Check size={9} className="text-[#07141C]" />
                  </span>
                )}
                <div className="w-14 h-10 rounded-lg shadow-md"
                  style={{ background: bgStyleId === 'custom' ? customBgGradient : 'conic-gradient(from 0deg, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000)' }} />
                <span className="text-[10px] text-white/40 whitespace-nowrap">Custom</span>
              </button>
            </div>
            {bgStyleId === 'custom' && (
              <div className="mt-3 p-4 bg-[#07141C]/80 rounded-xl border border-[#01FFFF]/15">
                <div className="grid grid-cols-2 gap-4">
                  {([
                    { label: 'Χρώμα αρχής', color: customBgFrom, setColor: setCustomBgFrom, ref: bgFromRef },
                    { label: 'Χρώμα τέλους', color: customBgTo,   setColor: setCustomBgTo,   ref: bgToRef  },
                  ] as const).map(({ label, color, setColor, ref }) => (
                    <div key={label} className="space-y-2">
                      <span className="text-[10px] text-white/35 uppercase tracking-wide">{label}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-lg cursor-pointer border border-white/15 hover:border-white/30 transition-colors shadow-md shrink-0"
                          style={{ backgroundColor: color }}
                          onClick={() => { if (ref.current) { ref.current.value = color; ref.current.click(); } }} />
                        <div className="flex items-center bg-[#07141C] border border-[#01FFFF]/15 rounded-lg overflow-hidden flex-1 focus-within:border-[#01FFFF]/40 transition-colors">
                          <span className="pl-2 text-white/30 text-xs font-mono">#</span>
                          <input type="text" maxLength={6} defaultValue={color.slice(1).toUpperCase()}
                            onBlur={(e) => {
                              const v = e.target.value.replace(/[^0-9a-fA-F]/g, '').slice(0, 6);
                              if (v.length === 6) setColor('#' + v.toLowerCase());
                              else e.target.value = color.slice(1).toUpperCase();
                            }}
                            className="flex-1 bg-transparent text-white text-xs font-mono py-2 pr-2 focus:outline-none"
                            placeholder="1A0A2E" />
                        </div>
                        <input ref={ref} type="color" onChange={(e) => setColor(e.target.value)} className="sr-only" />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-3 h-8 rounded-lg shadow-inner" style={{ background: customBgGradient }} />
              </div>
            )}
          </div>

          {/* Font color */}
          <div>
            <label className={labelCls}>Χρώμα γραμματοσειράς ονομάτων</label>
            <div className="flex flex-wrap gap-2 mt-2">
              {[
                { hex: '#ffffff', label: 'Λευκό' },
                { hex: '#f5efe6', label: 'Κρεμ' },
                { hex: '#b8960c', label: 'Χρυσό' },
                { hex: '#b76e79', label: 'Rose' },
                { hex: '#fde68a', label: 'Κίτρινο' },
                { hex: '#1a1a1a', label: 'Μαύρο' },
              ].map(({ hex, label }) => (
                <button key={hex} type="button"
                  onClick={() => { setFontColor(hex); setFontColorHexInput(hex.slice(1).toUpperCase()); }}
                  title={label}
                  className={`flex flex-col items-center gap-1 p-2 rounded-xl border transition-all ${
                    fontColor === hex ? 'border-[#01FFFF]/60 bg-[#01FFFF]/5' : 'border-white/8 hover:border-white/20'
                  }`}
                >
                  <div className="w-7 h-7 rounded-full border border-white/20" style={{ backgroundColor: hex }} />
                  <span className="text-[10px] text-white/40">{label}</span>
                </button>
              ))}
              <button type="button" onClick={() => fontColorInputRef.current?.click()} title="Custom"
                className="flex flex-col items-center gap-1 p-2 rounded-xl border border-white/8 hover:border-white/20 transition-all">
                <div className="w-7 h-7 rounded-full border border-white/20 overflow-hidden"
                  style={{ background: 'conic-gradient(from 0deg, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000)' }} />
                <span className="text-[10px] text-white/40">Custom</span>
              </button>
              <input ref={fontColorInputRef} type="color"
                onChange={(e) => { setFontColor(e.target.value); setFontColorHexInput(e.target.value.slice(1).toUpperCase()); }}
                className="sr-only" />
            </div>
            <div className="mt-2 flex items-center gap-2">
              <div className="w-6 h-6 rounded-md border border-white/15 shrink-0" style={{ backgroundColor: fontColor }} />
              <div className="flex items-center bg-[#07141C] border border-[#01FFFF]/15 rounded-lg overflow-hidden focus-within:border-[#01FFFF]/40 transition-colors">
                <span className="pl-3 text-white/30 text-sm font-mono">#</span>
                <input type="text" maxLength={6} value={fontColorHexInput}
                  onChange={(e) => {
                    const v = e.target.value.replace(/[^0-9a-fA-F]/g, '').toUpperCase().slice(0, 6);
                    setFontColorHexInput(v);
                    if (v.length === 6) setFontColor('#' + v.toLowerCase());
                  }}
                  onBlur={() => setFontColorHexInput(fontColor.slice(1).toUpperCase())}
                  className="bg-transparent text-white text-sm font-mono py-1.5 pr-3 focus:outline-none w-24" />
              </div>
            </div>
          </div>

          {/* Music */}
          <div>
            <label className={labelCls}>Μουσική υπόκρουση</label>
            <MusicUpload value={musicUrl} onChange={setMusicUrl} />
            <p className="text-xs text-white/25 mt-1">Παίζει αυτόματα. Κουμπί mute/unmute κάτω δεξιά.</p>
          </div>

          {/* Gallery */}
          <div>
            <label className={labelCls}>Gallery φωτογραφιών</label>
            <CoverImagesUpload values={galleryImages} onChange={setGalleryImages} max={20} />
            <p className="text-xs text-white/25 mt-1">Masonry grid κάτω από το βίντεο. Κλικ → lightbox.</p>
          </div>
        </div>
      )}

      {/* Core fields */}
      <div className={sectionCls}>
        <h2 className="text-white/70 text-xs font-semibold tracking-widest uppercase border-b border-[#01FFFF]/10 pb-2 mb-4">Βασικά Στοιχεία</h2>
        <div>
          <label className={labelCls}>Slug (URL) *</label>
          <div className="flex items-center gap-2">
            <span className="text-sm text-white/30 shrink-0">/</span>
            <input className={`${inputCls} font-mono`} value={slug}
              onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''))}
              required />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Νύφη *</label>
            <input className={inputCls} value={brideName} onChange={(e) => setBrideName(e.target.value)} required />
          </div>
          <div>
            <label className={labelCls}>Γαμπρός *</label>
            <input className={inputCls} value={groomName} onChange={(e) => setGroomName(e.target.value)} required />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Ημερομηνία γάμου *</label>
            <input type="datetime-local" className={inputCls} value={weddingDate} onChange={(e) => setWeddingDate(e.target.value)} required />
          </div>
          <div>
            <label className={labelCls}>RSVP deadline</label>
            <input type="datetime-local" className={inputCls} value={rsvpDeadline} onChange={(e) => setRsvpDeadline(e.target.value)} />
          </div>
        </div>
        <div>
          <label className={labelCls}>Εικόνες hero (carousel)</label>
          <CoverImagesUpload values={coverImages} onChange={setCoverImages} />
        </div>
        <div>
          <label className={labelCls}>Τύπος Πρόσκλησης</label>
          <select className={inputCls} value={invitationType} onChange={(e) => setInvitationType(e.target.value)}>
            <option value="MINI_WEBSITE">Mini Website — Πλήρης πρόσκληση με RSVP, ιστορία, εκδηλώσεις</option>
            <option value="VIDEO_PROSKLITIRIO">Video Προσκλητήριο — Βίντεο + γρήγορες ενέργειες + RSVP</option>
            <option value="VIDEO">Video Only — Μόνο βίντεο, χωρίς RSVP</option>
          </select>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Video URL</label>
            <input className={inputCls} value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} placeholder="https://youtube.com/..." />
          </div>
          <div>
            <label className={labelCls}>Κατάσταση</label>
            <select className={inputCls} value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="DRAFT">Προσχέδιο</option>
              <option value="ACTIVE">Ενεργή</option>
              <option value="EXPIRED">Έληξε</option>
            </select>
          </div>
        </div>
        <div>
          <label className={labelCls}>Ιστορία ζευγαριού</label>
          <textarea className={`${inputCls} resize-none`} rows={5} value={story} onChange={(e) => setStory(e.target.value)} />
        </div>
      </div>

      {/* Events */}
      <div className={sectionCls}>
        <div className="flex items-center justify-between border-b border-[#01FFFF]/10 pb-2 mb-2">
          <h2 className="text-white/70 text-xs font-semibold tracking-widest uppercase">Εκδηλώσεις</h2>
          <button type="button" onClick={() => setEvents((r) => [...r, blankEvent()])}
            className="flex items-center gap-1 text-xs text-[#01FFFF]/60 hover:text-[#01FFFF] transition-colors">
            <Plus size={13} /> Προσθήκη
          </button>
        </div>
        {events.map((ev, i) => (
          <div key={i} className="border border-[#01FFFF]/10 rounded-xl p-4 space-y-3 relative bg-[#07141C]/50">
            {events.length > 1 && (
              <button type="button" onClick={() => setEvents((r) => r.filter((_, idx) => idx !== i))}
                className="absolute top-3 right-3 text-white/20 hover:text-red-400 transition-colors">
                <Trash2 size={14} />
              </button>
            )}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelCls}>Τύπος</label>
                <select className={inputCls} value={ev.type} onChange={(e) => updateEvent(i, 'type', e.target.value as EventType)}>
                  <option value="CEREMONY">Εκκλησία (CEREMONY)</option>
                  <option value="RECEPTION">Δεξίωση (RECEPTION)</option>
                </select>
              </div>
              <div>
                <label className={labelCls}>Όνομα *</label>
                <input className={inputCls} value={ev.name} onChange={(e) => updateEvent(i, 'name', e.target.value)} placeholder="π.χ. Εκκλησία Αγ. Δημητρίου" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelCls}>Ημερομηνία & ώρα *</label>
                <input type="datetime-local" className={inputCls} value={ev.date} onChange={(e) => updateEvent(i, 'date', e.target.value)} />
              </div>
              <div>
                <label className={labelCls}>Διεύθυνση</label>
                <input className={inputCls} value={ev.address} onChange={(e) => updateEvent(i, 'address', e.target.value)} />
              </div>
            </div>
            <div>
              <label className={labelCls}>Google Maps URL</label>
              <input className={inputCls} value={ev.mapsUrl} onChange={(e) => updateEvent(i, 'mapsUrl', e.target.value)} placeholder="https://maps.google.com/..." />
            </div>
          </div>
        ))}
      </div>

      {/* Contacts */}
      <div className={sectionCls}>
        <div className="flex items-center justify-between border-b border-[#01FFFF]/10 pb-2 mb-2">
          <h2 className="text-white/70 text-xs font-semibold tracking-widest uppercase">Επαφές</h2>
          <button type="button" onClick={() => setContacts((r) => [...r, blankContact()])}
            className="flex items-center gap-1 text-xs text-[#01FFFF]/60 hover:text-[#01FFFF] transition-colors">
            <Plus size={13} /> Προσθήκη
          </button>
        </div>
        {!contacts.some((c) => (c.role === 'BRIDE' || c.role === 'GROOM') && c.email.trim()) && (
          <div className="flex items-start gap-2 bg-amber-500/10 border border-amber-500/20 rounded-xl px-4 py-3 text-xs text-amber-400">
            <AlertTriangle size={14} className="shrink-0 mt-0.5" />
            <span>Καμία επαφή νύφης/γαμπρού δεν έχει email. Οι ειδοποιήσεις RSVP δεν θα σταλούν.</span>
          </div>
        )}
        {contacts.map((c, i) => (
          <div key={i} className="border border-[#01FFFF]/10 rounded-xl p-4 space-y-3 relative bg-[#07141C]/50">
            {contacts.length > 1 && (
              <button type="button" onClick={() => setContacts((r) => r.filter((_, idx) => idx !== i))}
                className="absolute top-3 right-3 text-white/20 hover:text-red-400 transition-colors">
                <Trash2 size={14} />
              </button>
            )}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelCls}>Ρόλος</label>
                <select className={inputCls} value={c.role} onChange={(e) => updateContact(i, 'role', e.target.value as ContactRole)}>
                  <option value="BRIDE">Νύφη</option>
                  <option value="GROOM">Γαμπρός</option>
                  <option value="BEST_MAN">Κουμπάρος</option>
                  <option value="MAID_OF_HONOR">Κουμπάρα</option>
                </select>
              </div>
              <div>
                <label className={labelCls}>Όνομα *</label>
                <input className={inputCls} value={c.name} onChange={(e) => updateContact(i, 'name', e.target.value)} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelCls}>Τηλέφωνο</label>
                <input className={inputCls} type="tel" value={c.phone} onChange={(e) => updateContact(i, 'phone', e.target.value)} placeholder="69X XXX XXXX" />
              </div>
              <div>
                <label className={labelCls}>Email</label>
                <input className={inputCls} type="email" value={c.email} onChange={(e) => updateContact(i, 'email', e.target.value)} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Gift Registry */}
      <div className={sectionCls}>
        <div className="flex items-center justify-between border-b border-[#01FFFF]/10 pb-2 mb-2">
          <h2 className="text-white/70 text-xs font-semibold tracking-widest uppercase">Λίστα Γάμου (IBAN)</h2>
          <button type="button" onClick={() => setGifts((r) => [...r, blankGift()])}
            className="flex items-center gap-1 text-xs text-[#01FFFF]/60 hover:text-[#01FFFF] transition-colors">
            <Plus size={13} /> Προσθήκη
          </button>
        </div>
        {gifts.length === 0 && (
          <p className="text-xs text-white/30 text-center py-2">Δεν έχουν προστεθεί IBAN.</p>
        )}
        {gifts.map((g, i) => (
          <div key={i} className="border border-[#01FFFF]/10 rounded-xl p-4 space-y-3 relative bg-[#07141C]/50">
            <button type="button" onClick={() => setGifts((r) => r.filter((_, idx) => idx !== i))}
              className="absolute top-3 right-3 text-white/20 hover:text-red-400 transition-colors">
              <Trash2 size={14} />
            </button>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelCls}>Κάτοχος *</label>
                <input className={inputCls} value={g.ownerName} onChange={(e) => updateGift(i, 'ownerName', e.target.value)} placeholder="π.χ. Ιωάννα Παπαδοπούλου" />
              </div>
              <div>
                <label className={labelCls}>Τράπεζα</label>
                <input className={inputCls} value={g.bankName} onChange={(e) => updateGift(i, 'bankName', e.target.value)} placeholder="π.χ. Πειραιώς" />
              </div>
            </div>
            <div>
              <label className={labelCls}>IBAN *</label>
              <input className={`${inputCls} font-mono`} value={g.iban} onChange={(e) => updateGift(i, 'iban', e.target.value)} placeholder="GR00 0000 0000 0000 0000 0000 000" />
            </div>
          </div>
        ))}
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-sm text-red-400">{error}</div>
      )}

      <div className="flex gap-3 pb-8">
        <button type="button" onClick={() => router.push('/admin')}
          className="flex-1 py-3 rounded-xl border border-[#01FFFF]/20 text-white/50 text-sm font-medium hover:border-[#01FFFF]/40 hover:text-white/70 transition-colors">
          Ακύρωση
        </button>
        <button type="submit" disabled={saving}
          className="flex-1 py-3 rounded-xl bg-[#01FFFF] text-[#07141C] text-sm font-bold hover:bg-[#01FFFF]/90 transition-colors disabled:opacity-50">
          {saving ? 'Αποθήκευση...' : '✓ Αποθήκευση'}
        </button>
      </div>
    </div>
  );

  return (
    <div className={hasStyleFields ? 'max-w-7xl mx-auto px-4 py-8' : ''}>
      <form onSubmit={handleSubmit} className={hasStyleFields ? '' : 'max-w-2xl mx-auto px-4 py-8'}>
        <div className="flex items-center gap-3 mb-6">
          <button type="button" onClick={() => router.push('/admin')} className="text-white/40 hover:text-white transition-colors">
            <ArrowLeft size={18} />
          </button>
          <h1 className="text-white font-semibold">Επεξεργασία Πρόσκλησης</h1>
          <span className="text-xs text-white/30 ml-1">— {brideName} &amp; {groomName}</span>
        </div>

        {hasStyleFields ? (
          <div className="flex gap-8 items-start">
            <div className="flex-1 min-w-0">
              {formSections}
            </div>
            <div className="w-72 shrink-0 sticky top-8 hidden xl:block space-y-4">
              <p className="text-white/30 text-xs uppercase tracking-widest text-center">Live Preview</p>
              <PreviewCard
                brideName={brideName}
                groomName={groomName}
                weddingDate={weddingDate}
                fontFamily={fontFamily}
                palette={resolvedPalette}
                bgStyle={resolvedBgStyle}
              />
              <div className="bg-[#071218]/60 rounded-2xl p-4 border border-[#01FFFF]/10 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-white/30">Γραμματοσειρά</span>
                  <span className="text-white/70"
                    style={{ fontFamily: fontFamily === 'CustomWeddingFont' ? 'CustomWeddingFont, serif' : `'${fontFamily}', serif` }}>
                    {fontFamily === 'CustomWeddingFont' ? 'Custom' : FONTS.find((f) => f.name === fontFamily)?.label}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-white/30">Χρώμα</span>
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: resolvedPalette.primary }} />
                    <span className="text-white/70">{resolvedPalette.label}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-white/30">Φόντο</span>
                  <span className="text-white/70">{resolvedBgStyle.label}</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          formSections
        )}
      </form>
    </div>
  );
}
