'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { adminApi } from '@/lib/api';
import { ArrowLeft, Video, Play } from 'lucide-react';
import { format } from 'date-fns';
import { el } from 'date-fns/locale';
import CoverImageUpload from '@/components/CoverImageUpload';
import VideoUpload from '@/components/VideoUpload';

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

function VideoPreviewCard({ brideName, groomName, weddingDate, coverImageUrl }: {
  brideName: string; groomName: string; weddingDate: string; coverImageUrl: string;
}) {
  const dateStr = weddingDate
    ? format(new Date(weddingDate), 'd MMMM yyyy', { locale: el })
    : 'Ημερομηνία γάμου';

  return (
    <div className="rounded-2xl overflow-hidden shadow-2xl border border-white/10">
      <div
        className="relative flex flex-col items-center justify-center py-14 px-6 text-center"
        style={coverImageUrl
          ? { backgroundImage: `url(${coverImageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }
          : { background: 'linear-gradient(135deg,#050510 0%,#101030 50%,#1e1e50 100%)' }
        }
      >
        {coverImageUrl && <div className="absolute inset-0 bg-black/50" />}
        <div className="absolute inset-0 opacity-10">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="absolute rounded-full bg-white"
              style={{ width: 60 + i * 20, height: 60 + i * 20, top: `${10 + i * 14}%`, left: `${5 + i * 12}%`, opacity: 0.15 }} />
          ))}
        </div>
        <p className="relative text-white/60 text-[10px] tracking-[0.3em] uppercase mb-4">Βίντεο Πρόσκληση</p>
        <h2 className="relative text-white text-3xl font-light italic">
          {brideName || 'Νύφη'} & {groomName || 'Γαμπρός'}
        </h2>
        <div className="relative mt-3 w-20 h-px bg-white/20" />
        <p className="relative mt-3 text-white/60 text-[10px] tracking-widest uppercase mb-6">{dateStr}</p>
        <div className="relative w-14 h-14 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center">
          <Play size={20} className="text-white ml-1" fill="white" />
        </div>
      </div>
      <div className="bg-[#fdfaf6] py-3 px-6 text-center">
        <p className="text-[10px] text-[#5c3320]/50 uppercase tracking-widest">Video Only Preview</p>
      </div>
    </div>
  );
}

type EventCategory = 'WEDDING' | 'BAPTISM' | 'WEDDING_BAPTISM';

const CATEGORY_OPTIONS: { id: EventCategory; label: string; activeClass: string }[] = [
  { id: 'WEDDING',         label: 'Γάμος',         activeClass: 'bg-rose-500/15 border-rose-400/50 text-rose-300' },
  { id: 'BAPTISM',         label: 'Βάπτιση',        activeClass: 'bg-sky-500/15 border-sky-400/50 text-sky-300' },
  { id: 'WEDDING_BAPTISM', label: 'Γαμοβάπτιση',   activeClass: 'bg-violet-500/15 border-violet-400/50 text-violet-300' },
];

export default function VideoOnlyCreatePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [eventCategory, setEventCategory] = useState<EventCategory>('WEDDING');
  const [slug, setSlug] = useState('');
  const [brideName, setBrideName] = useState('');
  const [groomName, setGroomName] = useState('');
  const [childName, setChildName] = useState('');
  const [fatherName, setFatherName] = useState('');
  const [motherName, setMotherName] = useState('');
  const [weddingDate, setWeddingDate] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [coverImageUrl, setCoverImageUrl] = useState('');
  const [status, setStatus] = useState<'DRAFT' | 'ACTIVE'>('DRAFT');

  const autoSlug = (b: string, g: string) =>
    `${b}-${g}`.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const isWedding = eventCategory === 'WEDDING' || eventCategory === 'WEDDING_BAPTISM';
    const isBaptism = eventCategory === 'BAPTISM' || eventCategory === 'WEDDING_BAPTISM';
    if (!slug || !weddingDate) { setError('Συμπληρώστε τα υποχρεωτικά πεδία.'); return; }
    if (isWedding && (!brideName || !groomName)) { setError('Συμπληρώστε ονόματα νύφης και γαμπρού.'); return; }
    if (isBaptism && !childName) { setError('Συμπληρώστε το όνομα του παιδιού.'); return; }
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('admin_token');
      if (!token) { router.replace('/admin/login'); return; }
      await adminApi(token).post('/admin/invitations', {
        slug,
        eventCategory,
        ...(isWedding && { brideName, groomName }),
        ...(isBaptism && { childName, fatherName: fatherName || undefined, motherName: motherName || undefined }),
        weddingDate: new Date(weddingDate).toISOString(),
        videoUrl: videoUrl || undefined,
        coverImageUrl: coverImageUrl || undefined,
        status,
        invitationType: 'VIDEO',
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
    <div className="max-w-7xl mx-auto px-4 py-8">

      {/* Page header */}
      <div className="flex items-center gap-3 mb-6">
        <button type="button" onClick={() => router.push('/admin')} className="text-white/40 hover:text-white transition-colors">
          <ArrowLeft size={18} />
        </button>
        <Video size={16} className="text-[#01FFFF]/60" />
        <h1 className="text-white font-semibold">Νέο Video Only</h1>
        <span className="text-white/20 text-sm ml-auto">Απλή βίντεο πρόσκληση</span>
      </div>

      {/* Category toggle */}
      <div className="flex gap-2 mb-8">
        {CATEGORY_OPTIONS.map((opt) => (
          <button key={opt.id} type="button" onClick={() => setEventCategory(opt.id)}
            className={`flex-1 py-2.5 rounded-xl border text-sm font-medium transition-all ${
              eventCategory === opt.id
                ? opt.activeClass
                : 'border-white/10 text-white/40 hover:text-white/70 hover:border-white/20'
            }`}>
            {opt.label}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit}>
        <div className="flex gap-8 items-start">

          {/* Left: form */}
          <div className="flex-1 min-w-0 space-y-6">

            <section className={sec}>
              <SecTitle title="Βασικά στοιχεία" />
              {(eventCategory === 'WEDDING' || eventCategory === 'WEDDING_BAPTISM') && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={lbl}>Νύφη *</label>
                    <input className={inp} value={brideName}
                      onChange={(e) => { setBrideName(e.target.value); if (!slug) setSlug(autoSlug(e.target.value, groomName)); }}
                      placeholder="Ιωάννα" />
                  </div>
                  <div>
                    <label className={lbl}>Γαμπρός *</label>
                    <input className={inp} value={groomName}
                      onChange={(e) => { setGroomName(e.target.value); if (!slug) setSlug(autoSlug(brideName, e.target.value)); }}
                      placeholder="Αλέξανδρος" />
                  </div>
                </div>
              )}
              {(eventCategory === 'BAPTISM' || eventCategory === 'WEDDING_BAPTISM') && (
                <>
                  <div>
                    <label className={lbl}>Όνομα παιδιού *</label>
                    <input className={inp} value={childName} onChange={(e) => setChildName(e.target.value)} placeholder="π.χ. Ελπίδα" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div><label className={lbl}>Μπαμπάς</label><input className={inp} value={fatherName} onChange={(e) => setFatherName(e.target.value)} placeholder="Γιώργης" /></div>
                    <div><label className={lbl}>Μαμά</label><input className={inp} value={motherName} onChange={(e) => setMotherName(e.target.value)} placeholder="Μαρία" /></div>
                  </div>
                </>
              )}
              <div>
                <label className={lbl}>{eventCategory === 'BAPTISM' ? 'Ημερομηνία βάπτισης *' : eventCategory === 'WEDDING_BAPTISM' ? 'Ημερομηνία εκδήλωσης *' : 'Ημερομηνία γάμου *'}</label>
                <input type="datetime-local" className={inp} value={weddingDate} onChange={(e) => setWeddingDate(e.target.value)} required />
              </div>
              <div>
                <label className={lbl}>Σύνδεσμος πρόσκλησης *</label>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-white/30 shrink-0">/</span>
                  <input className={inp} value={slug}
                    onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''))}
                    placeholder="ioanna-alexandros" required />
                </div>
              </div>
              <div>
                <label className={lbl}>Κατάσταση</label>
                <select className={inp} value={status} onChange={(e) => setStatus(e.target.value as any)}>
                  <option value="DRAFT">Προσχέδιο</option>
                  <option value="ACTIVE">Ενεργή</option>
                </select>
              </div>
            </section>

            <section className={sec}>
              <SecTitle title="Βίντεο & Εικόνα" desc="Το κεντρικό βίντεο και η εικόνα εξωφύλλου" />
              <div>
                <label className={lbl}>Βίντεο</label>
                <VideoUpload value={videoUrl} onChange={setVideoUrl} />
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex-1 h-px bg-[#01FFFF]/10" />
                  <span className="text-xs text-white/20">ή URL</span>
                  <div className="flex-1 h-px bg-[#01FFFF]/10" />
                </div>
                <input className={`${inp} mt-2`} value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} placeholder="https://youtube.com/..." />
              </div>
              <div>
                <label className={lbl}>Φωτογραφία εξωφύλλου</label>
                <CoverImageUpload value={coverImageUrl} onChange={setCoverImageUrl} />
                <p className="text-xs text-white/25 mt-1">Εμφανίζεται ως φόντο πριν ξεκινήσει το βίντεο.</p>
              </div>
            </section>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-sm text-red-400">{error}</div>
            )}

            <div className="flex gap-3 pb-12">
              <button type="button" onClick={() => router.push('/admin')}
                className="flex-1 py-3 rounded-xl border border-[#01FFFF]/20 text-white/50 text-sm font-medium hover:border-[#01FFFF]/40 hover:text-white/70 transition-colors">
                Ακύρωση
              </button>
              <button type="submit" disabled={loading}
                className="flex-1 py-3 rounded-xl bg-[#01FFFF] text-[#07141C] text-sm font-bold hover:bg-[#01FFFF]/90 transition-colors disabled:opacity-50">
                {loading ? 'Αποθήκευση...' : `Δημιουργία Video Only — ${eventCategory === 'BAPTISM' ? 'Βάπτιση' : eventCategory === 'WEDDING_BAPTISM' ? 'Γαμοβάπτιση' : 'Γάμος'}`}
              </button>
            </div>
          </div>

          {/* Right: sticky live preview */}
          <div className="w-72 shrink-0 sticky top-8 hidden xl:block space-y-4">
            <p className="text-white/30 text-xs uppercase tracking-widest text-center">Live Preview</p>
            <VideoPreviewCard
              brideName={brideName}
              groomName={groomName}
              weddingDate={weddingDate}
              coverImageUrl={coverImageUrl}
            />
            <div className="bg-[#071218]/60 rounded-2xl p-4 border border-[#01FFFF]/10 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-white/30">Τύπος</span>
                <span className="text-white/70">Video Only</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-white/30">Βίντεο</span>
                <span className={videoUrl ? 'text-[#01FFFF]/70' : 'text-white/20'}>
                  {videoUrl ? 'Ορίσθηκε' : 'Δεν έχει οριστεί'}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-white/30">Εξώφυλλο</span>
                <span className={coverImageUrl ? 'text-[#01FFFF]/70' : 'text-white/20'}>
                  {coverImageUrl ? 'Ανέβηκε' : 'Δεν έχει οριστεί'}
                </span>
              </div>
            </div>
          </div>

        </div>
      </form>
    </div>
  );
}
