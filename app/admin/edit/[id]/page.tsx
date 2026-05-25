'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { adminApi } from '@/lib/api';
import type { Invitation, EventType, ContactRole } from '@/lib/types';
import { AlertTriangle, ArrowLeft, Plus, Trash2 } from 'lucide-react';

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

export default function AdminEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const [slug, setSlug] = useState('');
  const [brideName, setBrideName] = useState('');
  const [groomName, setGroomName] = useState('');
  const [weddingDate, setWeddingDate] = useState('');
  const [story, setStory] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [coverImageUrl, setCoverImageUrl] = useState('');
  const [rsvpDeadline, setRsvpDeadline] = useState('');
  const [status, setStatus] = useState('DRAFT');
  const [invitationType, setInvitationType] = useState('MINI_WEBSITE');
  const [events, setEvents] = useState<EventRow[]>([blankEvent()]);
  const [contacts, setContacts] = useState<ContactRow[]>([blankContact()]);
  const [gifts, setGifts] = useState<GiftRow[]>([]);

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
        setCoverImageUrl(inv.coverImageUrl ?? '');
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
        coverImageUrl: coverImageUrl || undefined,
        rsvpDeadline: rsvpDeadline ? new Date(rsvpDeadline).toISOString() : null,
        status,
        invitationType,
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

  return (
    <div>
      <header className="bg-[#071218]/80 backdrop-blur-md border-b border-[#01FFFF]/10 px-6 py-4 flex items-center gap-4">
        <button onClick={() => router.push('/admin')} className="text-white/40 hover:text-white transition-colors">
          <ArrowLeft size={18} />
        </button>
        <h1 className="text-white font-semibold">Επεξεργασία Πρόσκλησης</h1>
        <span className="text-xs text-white/30 ml-1">— {brideName} &amp; {groomName}</span>
      </header>

      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto px-4 py-8 space-y-6">

        {/* Core fields */}
        <div className={sectionCls}>
          <h2 className="text-white/70 text-xs font-semibold tracking-widest uppercase border-b border-[#01FFFF]/10 pb-2 mb-4">Βασικά Στοιχεία</h2>
          <div>
            <label className={labelCls}>Slug (URL) *</label>
            <div className="flex items-center gap-2">
              <span className="text-sm text-white/30 shrink-0">/</span>
              <input
                className={`${inputCls} font-mono`}
                value={slug}
                onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''))}
                required
              />
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
            <label className={labelCls}>Φωτογραφία εξωφύλλου (URL)</label>
            <input className={inputCls} value={coverImageUrl} onChange={(e) => setCoverImageUrl(e.target.value)} placeholder="https://... (Cloudinary, Drive κ.λπ.)" />
            <p className="text-xs text-white/30 mt-1">Θα εμφανιστεί ως φόντο στο hero. Αφήστε κενό για το προεπιλεγμένο χρώμα.</p>
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
      </form>
    </div>
  );
}
