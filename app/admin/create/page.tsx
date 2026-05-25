'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { adminApi } from '@/lib/api';
import { Plus, Trash2, ArrowLeft } from 'lucide-react';
import CoverImageUpload from '@/components/CoverImageUpload';

type EventType = 'CEREMONY' | 'RECEPTION';
type ContactRole = 'BRIDE' | 'GROOM' | 'BEST_MAN' | 'MAID_OF_HONOR';
type InvitationType = 'MINI_WEBSITE' | 'VIDEO' | 'VIDEO_PROSKLITIRIO';

interface EventForm {
  type: EventType;
  name: string;
  date: string;
  address: string;
  mapsUrl: string;
}

interface ContactForm {
  role: ContactRole;
  name: string;
  phone: string;
  email: string;
}

interface GiftForm {
  ownerName: string;
  bankName: string;
  iban: string;
}

const inputCls = 'w-full bg-[#07141C] border border-[#01FFFF]/20 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/25 focus:outline-none focus:ring-2 focus:ring-[#01FFFF]/30 focus:border-[#01FFFF]/40 transition-colors';
const labelCls = 'block text-xs font-medium text-white/50 mb-1 uppercase tracking-wide';
const sectionCls = 'bg-[#071218]/60 backdrop-blur-sm rounded-2xl p-6 border border-[#01FFFF]/10 space-y-4';

function SectionTitle({ title }: { title: string }) {
  return (
    <div className="border-b border-[#01FFFF]/10 pb-2 mb-4">
      <h2 className="text-white font-semibold text-sm tracking-wide">{title}</h2>
    </div>
  );
}

const VALID_TYPES: InvitationType[] = ['MINI_WEBSITE', 'VIDEO_PROSKLITIRIO', 'VIDEO'];

function AdminCreatePageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const typeParam = searchParams.get('type') as InvitationType | null;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Core fields
  const [slug, setSlug] = useState('');
  const [brideName, setBrideName] = useState('');
  const [groomName, setGroomName] = useState('');
  const [weddingDate, setWeddingDate] = useState('');
  const [story, setStory] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [coverImageUrl, setCoverImageUrl] = useState('');
  const [rsvpDeadline, setRsvpDeadline] = useState('');
  const [status, setStatus] = useState<'DRAFT' | 'ACTIVE'>('DRAFT');
  const [invitationType, setInvitationType] = useState<InvitationType>(
    typeParam && VALID_TYPES.includes(typeParam) ? typeParam : 'MINI_WEBSITE',
  );

  // Dynamic lists
  const [events, setEvents] = useState<EventForm[]>([
    { type: 'CEREMONY', name: '', date: '', address: '', mapsUrl: '' },
    { type: 'RECEPTION', name: '', date: '', address: '', mapsUrl: '' },
  ]);
  const [contacts, setContacts] = useState<ContactForm[]>([
    { role: 'BRIDE', name: '', phone: '', email: '' },
    { role: 'GROOM', name: '', phone: '', email: '' },
  ]);
  const [gifts, setGifts] = useState<GiftForm[]>([
    { ownerName: '', bankName: '', iban: '' },
  ]);

  // Helpers
  const updateEvent = (i: number, key: keyof EventForm, val: string) =>
    setEvents((prev) => prev.map((e, idx) => (idx === i ? { ...e, [key]: val } : e)));
  const updateContact = (i: number, key: keyof ContactForm, val: string) =>
    setContacts((prev) => prev.map((c, idx) => (idx === i ? { ...c, [key]: val } : c)));
  const updateGift = (i: number, key: keyof GiftForm, val: string) =>
    setGifts((prev) => prev.map((g, idx) => (idx === i ? { ...g, [key]: val } : g)));

  const autoSlug = (bride: string, groom: string) =>
    `${bride}-${groom}`.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!slug || !brideName || !groomName || !weddingDate) {
      setError('Συμπληρώστε τα υποχρεωτικά πεδία (slug, ονόματα, ημερομηνία).');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('admin_token');
      if (!token) { router.replace('/admin/login'); return; }

      const payload = {
        slug,
        brideName,
        groomName,
        weddingDate: new Date(weddingDate).toISOString(),
        story: story || undefined,
        videoUrl: videoUrl || undefined,
        coverImageUrl: coverImageUrl || undefined,
        rsvpDeadline: rsvpDeadline ? new Date(rsvpDeadline).toISOString() : undefined,
        status,
        invitationType,
        events: events
          .filter((ev) => ev.name && ev.date)
          .map((ev) => ({
            ...ev,
            date: new Date(ev.date).toISOString(),
            address: ev.address || undefined,
            mapsUrl: ev.mapsUrl || undefined,
          })),
        contacts: contacts
          .filter((c) => c.name)
          .map((c) => ({
            ...c,
            phone: c.phone || undefined,
            email: c.email || undefined,
          })),
        giftRegistries: gifts
          .filter((g) => g.ownerName && g.iban)
          .map((g) => ({
            ...g,
            bankName: g.bankName || undefined,
          })),
      };

      await adminApi(token).post('/admin/invitations', payload);
      router.push('/admin');
    } catch (err: any) {
      const msg = err?.response?.data?.message;
      setError(Array.isArray(msg) ? msg.join(', ') : (msg ?? 'Σφάλμα κατά την αποθήκευση.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="max-w-3xl mx-auto px-4 py-8 space-y-6">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => router.push('/admin')}
            className="text-white/40 hover:text-white transition-colors"
          >
            <ArrowLeft size={18} />
          </button>
          <h1 className="text-white font-semibold">Νέα Πρόσκληση</h1>
        </div>

        {/* Core */}
        <section className={sectionCls}>
          <SectionTitle title="Βασικά στοιχεία" />
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Νύφη *</label>
              <input
                className={inputCls}
                value={brideName}
                onChange={(e) => {
                  setBrideName(e.target.value);
                  if (!slug) setSlug(autoSlug(e.target.value, groomName));
                }}
                placeholder="Ιωάννα"
                required
              />
            </div>
            <div>
              <label className={labelCls}>Γαμπρός *</label>
              <input
                className={inputCls}
                value={groomName}
                onChange={(e) => {
                  setGroomName(e.target.value);
                  if (!slug) setSlug(autoSlug(brideName, e.target.value));
                }}
                placeholder="Αλέξανδρος"
                required
              />
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
            <label className={labelCls}>Slug (URL) *</label>
            <div className="flex items-center gap-2">
              <span className="text-sm text-white/30 shrink-0">/</span>
              <input
                className={inputCls}
                value={slug}
                onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''))}
                placeholder="ioanna-alexandros"
                required
              />
            </div>
          </div>
          <div>
            <label className={labelCls}>Φωτογραφία εξωφύλλου</label>
            <CoverImageUpload value={coverImageUrl} onChange={setCoverImageUrl} />
          </div>
          <div>
            <label className={labelCls}>Τύπος Πρόσκλησης</label>
            <select className={inputCls} value={invitationType} onChange={(e) => setInvitationType(e.target.value as InvitationType)}>
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
              <select className={inputCls} value={status} onChange={(e) => setStatus(e.target.value as any)}>
                <option value="DRAFT">Προσχέδιο</option>
                <option value="ACTIVE">Ενεργή</option>
              </select>
            </div>
          </div>
          <div>
            <label className={labelCls}>Ιστορία ζευγαριού</label>
            <textarea className={`${inputCls} resize-none`} rows={4} value={story} onChange={(e) => setStory(e.target.value)} placeholder="Πώς γνωριστήκατε..." />
          </div>
        </section>

        {/* Events */}
        <section className={sectionCls}>
          <div className="flex items-center justify-between">
            <SectionTitle title="Εκδηλώσεις" />
            <button
              type="button"
              onClick={() => setEvents((prev) => [...prev, { type: 'RECEPTION', name: '', date: '', address: '', mapsUrl: '' }])}
              className="flex items-center gap-1 text-xs text-[#01FFFF]/60 hover:text-[#01FFFF] transition-colors"
            >
              <Plus size={14} /> Προσθήκη
            </button>
          </div>
          {events.map((ev, i) => (
            <div key={i} className="border border-[#01FFFF]/10 rounded-xl p-4 space-y-3 relative bg-[#07141C]/50">
              <div className="flex items-center justify-between mb-1">
                <select
                  className="text-xs font-medium text-[#01FFFF]/80 bg-transparent border-none outline-none cursor-pointer"
                  value={ev.type}
                  onChange={(e) => updateEvent(i, 'type', e.target.value)}
                >
                  <option value="CEREMONY">Μυστήριο</option>
                  <option value="RECEPTION">Δεξίωση</option>
                </select>
                {events.length > 1 && (
                  <button type="button" onClick={() => setEvents((p) => p.filter((_, idx) => idx !== i))} className="text-red-400 hover:text-red-600">
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>Όνομα χώρου</label>
                  <input className={inputCls} value={ev.name} onChange={(e) => updateEvent(i, 'name', e.target.value)} placeholder="Ιερός Ναός..." />
                </div>
                <div>
                  <label className={labelCls}>Ημερομηνία & ώρα</label>
                  <input type="datetime-local" className={inputCls} value={ev.date} onChange={(e) => updateEvent(i, 'date', e.target.value)} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>Διεύθυνση</label>
                  <input className={inputCls} value={ev.address} onChange={(e) => updateEvent(i, 'address', e.target.value)} placeholder="Οδός, Πόλη" />
                </div>
                <div>
                  <label className={labelCls}>Google Maps URL</label>
                  <input className={inputCls} value={ev.mapsUrl} onChange={(e) => updateEvent(i, 'mapsUrl', e.target.value)} placeholder="https://maps.google.com/..." />
                </div>
              </div>
            </div>
          ))}
        </section>

        {/* Contacts */}
        <section className={sectionCls}>
          <div className="flex items-center justify-between">
            <SectionTitle title="Επαφές" />
            <button
              type="button"
              onClick={() => setContacts((p) => [...p, { role: 'BEST_MAN', name: '', phone: '', email: '' }])}
              className="flex items-center gap-1 text-xs text-[#01FFFF]/60 hover:text-[#01FFFF] transition-colors"
            >
              <Plus size={14} /> Προσθήκη
            </button>
          </div>
          {contacts.map((c, i) => (
            <div key={i} className="border border-[#01FFFF]/10 rounded-xl p-4 space-y-3 bg-[#07141C]/50">
              <div className="flex items-center justify-between">
                <select
                  className="text-xs font-medium text-[#01FFFF]/80 bg-transparent border-none outline-none cursor-pointer"
                  value={c.role}
                  onChange={(e) => updateContact(i, 'role', e.target.value)}
                >
                  <option value="BRIDE">Νύφη</option>
                  <option value="GROOM">Γαμπρός</option>
                  <option value="BEST_MAN">Κουμπάρος</option>
                  <option value="MAID_OF_HONOR">Κουμπάρα</option>
                </select>
                {contacts.length > 1 && (
                  <button type="button" onClick={() => setContacts((p) => p.filter((_, idx) => idx !== i))} className="text-red-400 hover:text-red-600">
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className={labelCls}>Όνομα</label>
                  <input className={inputCls} value={c.name} onChange={(e) => updateContact(i, 'name', e.target.value)} placeholder="Όνομα" />
                </div>
                <div>
                  <label className={labelCls}>Κινητό</label>
                  <input className={inputCls} value={c.phone} onChange={(e) => updateContact(i, 'phone', e.target.value)} placeholder="69X..." />
                </div>
                <div>
                  <label className={labelCls}>Email</label>
                  <input className={inputCls} value={c.email} onChange={(e) => updateContact(i, 'email', e.target.value)} placeholder="email@..." />
                </div>
              </div>
            </div>
          ))}
        </section>

        {/* Gift Registry */}
        <section className={sectionCls}>
          <div className="flex items-center justify-between">
            <SectionTitle title="Λίστα γάμου (IBAN)" />
            <button
              type="button"
              onClick={() => setGifts((p) => [...p, { ownerName: '', bankName: '', iban: '' }])}
              className="flex items-center gap-1 text-xs text-[#01FFFF]/60 hover:text-[#01FFFF] transition-colors"
            >
              <Plus size={14} /> Προσθήκη
            </button>
          </div>
          {gifts.map((g, i) => (
            <div key={i} className="border border-[#01FFFF]/10 rounded-xl p-4 space-y-3 bg-[#07141C]/50">
              <div className="flex justify-end">
                {gifts.length > 1 && (
                  <button type="button" onClick={() => setGifts((p) => p.filter((_, idx) => idx !== i))} className="text-red-400 hover:text-red-600">
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className={labelCls}>Ονοματεπώνυμο</label>
                  <input className={inputCls} value={g.ownerName} onChange={(e) => updateGift(i, 'ownerName', e.target.value)} placeholder="Ιωάννα" />
                </div>
                <div>
                  <label className={labelCls}>Τράπεζα</label>
                  <input className={inputCls} value={g.bankName} onChange={(e) => updateGift(i, 'bankName', e.target.value)} placeholder="Εθνική, Πειραιώς..." />
                </div>
                <div>
                  <label className={labelCls}>IBAN</label>
                  <input className={inputCls} value={g.iban} onChange={(e) => updateGift(i, 'iban', e.target.value.toUpperCase())} placeholder="GR00..." />
                </div>
              </div>
            </div>
          ))}
        </section>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}

        <div className="flex gap-3 pb-8">
          <button
            type="button"
            onClick={() => router.push('/admin')}
            className="flex-1 py-3 rounded-xl border border-[#01FFFF]/20 text-white/50 text-sm font-medium hover:border-[#01FFFF]/40 hover:text-white/70 transition-colors"
          >
            Ακύρωση
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 py-3 rounded-xl bg-[#01FFFF] text-[#07141C] text-sm font-bold hover:bg-[#01FFFF]/90 transition-colors disabled:opacity-50"
          >
            {loading ? 'Αποθήκευση...' : '✓ Δημιουργία Πρόσκλησης'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default function AdminCreatePage() {
  return (
    <Suspense>
      <AdminCreatePageInner />
    </Suspense>
  );
}
