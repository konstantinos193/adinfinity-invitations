'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { adminApi } from '@/lib/api';
import { Plus, Trash2, ArrowLeft, Film } from 'lucide-react';
import VideoUpload from '@/components/VideoUpload';
import CoverImageUpload from '@/components/CoverImageUpload';

type EventType = 'CEREMONY' | 'RECEPTION';
type ContactRole = 'BRIDE' | 'GROOM' | 'BEST_MAN' | 'MAID_OF_HONOR';
interface EventForm { type: EventType; name: string; date: string; address: string; mapsUrl: string; }
interface ContactForm { role: ContactRole; name: string; phone: string; email: string; }
interface GiftForm { ownerName: string; bankName: string; iban: string; }

const inp = 'w-full bg-[#07141C] border border-purple-500/20 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/25 focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500/40 transition-colors';
const lbl = 'block text-xs font-medium text-white/50 mb-1 uppercase tracking-wide';
const sec = 'bg-[#071218]/60 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/10 space-y-4';

function SecTitle({ title }: { title: string }) {
  return <div className="border-b border-purple-500/10 pb-2 mb-4"><h2 className="text-white font-semibold text-sm tracking-wide">{title}</h2></div>;
}

export default function VideoProCreatePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [slug, setSlug] = useState('');
  const [brideName, setBrideName] = useState('');
  const [groomName, setGroomName] = useState('');
  const [weddingDate, setWeddingDate] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [coverImageUrl, setCoverImageUrl] = useState('');
  const [rsvpDeadline, setRsvpDeadline] = useState('');
  const [status, setStatus] = useState<'DRAFT' | 'ACTIVE'>('DRAFT');

  const [events, setEvents] = useState<EventForm[]>([
    { type: 'CEREMONY', name: '', date: '', address: '', mapsUrl: '' },
    { type: 'RECEPTION', name: '', date: '', address: '', mapsUrl: '' },
  ]);
  const [contacts, setContacts] = useState<ContactForm[]>([
    { role: 'BRIDE', name: '', phone: '', email: '' },
    { role: 'GROOM', name: '', phone: '', email: '' },
  ]);
  const [gifts, setGifts] = useState<GiftForm[]>([{ ownerName: '', bankName: '', iban: '' }]);

  const autoSlug = (b: string, g: string) =>
    `${b}-${g}`.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

  const upEv = (i: number, k: keyof EventForm, v: string) =>
    setEvents((p) => p.map((e, idx) => idx === i ? { ...e, [k]: v } : e));
  const upCo = (i: number, k: keyof ContactForm, v: string) =>
    setContacts((p) => p.map((c, idx) => idx === i ? { ...c, [k]: v } : c));
  const upGi = (i: number, k: keyof GiftForm, v: string) =>
    setGifts((p) => p.map((g, idx) => idx === i ? { ...g, [k]: v } : g));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!slug || !brideName || !groomName || !weddingDate) {
      setError('Συμπληρώστε τα υποχρεωτικά πεδία.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('admin_token');
      if (!token) { router.replace('/admin/login'); return; }
      await adminApi(token).post('/admin/invitations', {
        slug, brideName, groomName,
        weddingDate: new Date(weddingDate).toISOString(),
        videoUrl: videoUrl || undefined,
        coverImageUrl: coverImageUrl || undefined,
        rsvpDeadline: rsvpDeadline ? new Date(rsvpDeadline).toISOString() : undefined,
        status,
        invitationType: 'VIDEO_PROSKLITIRIO',
        events: events.filter((ev) => ev.name && ev.date).map((ev) => ({
          ...ev,
          date: new Date(ev.date).toISOString(),
          address: ev.address || undefined,
          mapsUrl: ev.mapsUrl || undefined,
        })),
        contacts: contacts.filter((c) => c.name).map((c) => ({
          ...c,
          phone: c.phone || undefined,
          email: c.email || undefined,
        })),
        giftRegistries: gifts.filter((g) => g.ownerName && g.iban).map((g) => ({
          ...g,
          bankName: g.bankName || undefined,
        })),
      });
      router.push('/admin');
    } catch (err: any) {
      const msg = err?.response?.data?.message;
      setError(Array.isArray(msg) ? msg.join(', ') : (msg ?? 'Σφάλμα κατά την αποθήκευση.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl mx-auto px-4 py-8 space-y-6">

      {/* Page title */}
      <div className="flex items-center gap-3">
        <button type="button" onClick={() => router.push('/admin')} className="text-white/40 hover:text-white transition-colors">
          <ArrowLeft size={18} />
        </button>
        <Film size={16} className="text-purple-400" />
        <h1 className="text-white font-semibold">Νέο Video Pro</h1>
      </div>

      {/* Core */}
      <section className={sec}>
        <SecTitle title="Βασικά στοιχεία" />
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={lbl}>Νύφη *</label>
            <input className={inp} value={brideName} onChange={(e) => { setBrideName(e.target.value); if (!slug) setSlug(autoSlug(e.target.value, groomName)); }} placeholder="Ιωάννα" required />
          </div>
          <div>
            <label className={lbl}>Γαμπρός *</label>
            <input className={inp} value={groomName} onChange={(e) => { setGroomName(e.target.value); if (!slug) setSlug(autoSlug(brideName, e.target.value)); }} placeholder="Αλέξανδρος" required />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={lbl}>Ημερομηνία γάμου *</label>
            <input type="datetime-local" className={inp} value={weddingDate} onChange={(e) => setWeddingDate(e.target.value)} required />
          </div>
          <div>
            <label className={lbl}>RSVP deadline</label>
            <input type="datetime-local" className={inp} value={rsvpDeadline} onChange={(e) => setRsvpDeadline(e.target.value)} />
          </div>
        </div>
        <div>
          <label className={lbl}>Slug (URL) *</label>
          <div className="flex items-center gap-2">
            <span className="text-sm text-white/30 shrink-0">/</span>
            <input className={inp} value={slug} onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''))} placeholder="ioanna-alexandros" required />
          </div>
        </div>
        <div>
          <label className={lbl}>Βίντεο</label>
          <VideoUpload value={videoUrl} onChange={setVideoUrl} />
          <div className="flex items-center gap-2 mt-2">
            <div className="flex-1 h-px bg-purple-500/10" />
            <span className="text-xs text-white/20">ή URL</span>
            <div className="flex-1 h-px bg-purple-500/10" />
          </div>
          <input className={`${inp} mt-2`} value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} placeholder="https://youtube.com/..." />
        </div>
        <div>
          <label className={lbl}>Φωτογραφία εξωφύλλου</label>
          <CoverImageUpload value={coverImageUrl} onChange={setCoverImageUrl} />
        </div>
        <div>
          <label className={lbl}>Κατάσταση</label>
          <select className={inp} value={status} onChange={(e) => setStatus(e.target.value as any)}>
            <option value="DRAFT">Προσχέδιο</option>
            <option value="ACTIVE">Ενεργή</option>
          </select>
        </div>
      </section>

      {/* Events */}
      <section className={sec}>
        <div className="flex items-center justify-between">
          <SecTitle title="Εκδηλώσεις" />
          <button type="button" onClick={() => setEvents((p) => [...p, { type: 'RECEPTION', name: '', date: '', address: '', mapsUrl: '' }])} className="flex items-center gap-1 text-xs text-purple-400/60 hover:text-purple-400 transition-colors">
            <Plus size={14} /> Προσθήκη
          </button>
        </div>
        {events.map((ev, i) => (
          <div key={i} className="border border-purple-500/10 rounded-xl p-4 space-y-3 bg-[#07141C]/50">
            <div className="flex items-center justify-between">
              <select className="text-xs font-medium text-purple-400/80 bg-transparent border-none outline-none cursor-pointer" value={ev.type} onChange={(e) => upEv(i, 'type', e.target.value)}>
                <option value="CEREMONY">Μυστήριο</option>
                <option value="RECEPTION">Δεξίωση</option>
              </select>
              {events.length > 1 && <button type="button" onClick={() => setEvents((p) => p.filter((_, idx) => idx !== i))} className="text-red-400 hover:text-red-600"><Trash2 size={14} /></button>}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><label className={lbl}>Όνομα χώρου</label><input className={inp} value={ev.name} onChange={(e) => upEv(i, 'name', e.target.value)} placeholder="Ιερός Ναός..." /></div>
              <div><label className={lbl}>Ημερομηνία & ώρα</label><input type="datetime-local" className={inp} value={ev.date} onChange={(e) => upEv(i, 'date', e.target.value)} /></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><label className={lbl}>Διεύθυνση</label><input className={inp} value={ev.address} onChange={(e) => upEv(i, 'address', e.target.value)} placeholder="Οδός, Πόλη" /></div>
              <div><label className={lbl}>Google Maps URL</label><input className={inp} value={ev.mapsUrl} onChange={(e) => upEv(i, 'mapsUrl', e.target.value)} placeholder="https://maps.google.com/..." /></div>
            </div>
          </div>
        ))}
      </section>

      {/* Contacts */}
      <section className={sec}>
        <div className="flex items-center justify-between">
          <SecTitle title="Επαφές" />
          <button type="button" onClick={() => setContacts((p) => [...p, { role: 'BEST_MAN', name: '', phone: '', email: '' }])} className="flex items-center gap-1 text-xs text-purple-400/60 hover:text-purple-400 transition-colors">
            <Plus size={14} /> Προσθήκη
          </button>
        </div>
        {contacts.map((c, i) => (
          <div key={i} className="border border-purple-500/10 rounded-xl p-4 space-y-3 bg-[#07141C]/50">
            <div className="flex items-center justify-between">
              <select className="text-xs font-medium text-purple-400/80 bg-transparent border-none outline-none cursor-pointer" value={c.role} onChange={(e) => upCo(i, 'role', e.target.value)}>
                <option value="BRIDE">Νύφη</option>
                <option value="GROOM">Γαμπρός</option>
                <option value="BEST_MAN">Κουμπάρος</option>
                <option value="MAID_OF_HONOR">Κουμπάρα</option>
              </select>
              {contacts.length > 1 && <button type="button" onClick={() => setContacts((p) => p.filter((_, idx) => idx !== i))} className="text-red-400 hover:text-red-600"><Trash2 size={14} /></button>}
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div><label className={lbl}>Όνομα</label><input className={inp} value={c.name} onChange={(e) => upCo(i, 'name', e.target.value)} placeholder="Όνομα" /></div>
              <div><label className={lbl}>Κινητό</label><input className={inp} value={c.phone} onChange={(e) => upCo(i, 'phone', e.target.value)} placeholder="69X..." /></div>
              <div><label className={lbl}>Email</label><input className={inp} value={c.email} onChange={(e) => upCo(i, 'email', e.target.value)} placeholder="email@..." /></div>
            </div>
          </div>
        ))}
      </section>

      {/* Gift Registry */}
      <section className={sec}>
        <div className="flex items-center justify-between">
          <SecTitle title="Λίστα γάμου (IBAN)" />
          <button type="button" onClick={() => setGifts((p) => [...p, { ownerName: '', bankName: '', iban: '' }])} className="flex items-center gap-1 text-xs text-purple-400/60 hover:text-purple-400 transition-colors">
            <Plus size={14} /> Προσθήκη
          </button>
        </div>
        {gifts.map((g, i) => (
          <div key={i} className="border border-purple-500/10 rounded-xl p-4 space-y-3 bg-[#07141C]/50">
            <div className="flex justify-end">
              {gifts.length > 1 && <button type="button" onClick={() => setGifts((p) => p.filter((_, idx) => idx !== i))} className="text-red-400 hover:text-red-600"><Trash2 size={14} /></button>}
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div><label className={lbl}>Ονοματεπώνυμο</label><input className={inp} value={g.ownerName} onChange={(e) => upGi(i, 'ownerName', e.target.value)} placeholder="Ιωάννα" /></div>
              <div><label className={lbl}>Τράπεζα</label><input className={inp} value={g.bankName} onChange={(e) => upGi(i, 'bankName', e.target.value)} placeholder="Εθνική..." /></div>
              <div><label className={lbl}>IBAN</label><input className={inp} value={g.iban} onChange={(e) => upGi(i, 'iban', e.target.value.toUpperCase())} placeholder="GR00..." /></div>
            </div>
          </div>
        ))}
      </section>

      {error && <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-sm text-red-400">{error}</div>}

      <div className="flex gap-3 pb-8">
        <button type="button" onClick={() => router.push('/admin')} className="flex-1 py-3 rounded-xl border border-purple-500/20 text-white/50 text-sm font-medium hover:border-purple-500/40 hover:text-white/70 transition-colors">
          Ακύρωση
        </button>
        <button type="submit" disabled={loading} className="flex-1 py-3 rounded-xl bg-purple-500 text-white text-sm font-bold hover:bg-purple-400 transition-colors disabled:opacity-50">
          {loading ? 'Αποθήκευση...' : '✓ Δημιουργία Video Pro'}
        </button>
      </div>
    </form>
  );
}
