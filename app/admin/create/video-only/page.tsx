'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { adminApi } from '@/lib/api';
import { ArrowLeft, Video } from 'lucide-react';

const inp = 'w-full bg-[#07141C] border border-blue-500/20 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/25 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/40 transition-colors';
const lbl = 'block text-xs font-medium text-white/50 mb-1 uppercase tracking-wide';
const sec = 'bg-[#071218]/60 backdrop-blur-sm rounded-2xl p-6 border border-blue-500/10 space-y-4';

function SecTitle({ title }: { title: string }) {
  return <div className="border-b border-blue-500/10 pb-2 mb-4"><h2 className="text-white font-semibold text-sm tracking-wide">{title}</h2></div>;
}

export default function VideoOnlyCreatePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [slug, setSlug] = useState('');
  const [brideName, setBrideName] = useState('');
  const [groomName, setGroomName] = useState('');
  const [weddingDate, setWeddingDate] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [status, setStatus] = useState<'DRAFT' | 'ACTIVE'>('DRAFT');

  const autoSlug = (b: string, g: string) =>
    `${b}-${g}`.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

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
    <form onSubmit={handleSubmit} className="max-w-xl mx-auto px-4 py-8 space-y-6">

      {/* Page title */}
      <div className="flex items-center gap-3">
        <button type="button" onClick={() => router.push('/admin')} className="text-white/40 hover:text-white transition-colors">
          <ArrowLeft size={18} />
        </button>
        <Video size={16} className="text-blue-400" />
        <h1 className="text-white font-semibold">Νέο Video Only</h1>
      </div>

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
        <div>
          <label className={lbl}>Ημερομηνία γάμου *</label>
          <input type="datetime-local" className={inp} value={weddingDate} onChange={(e) => setWeddingDate(e.target.value)} required />
        </div>
        <div>
          <label className={lbl}>Slug (URL) *</label>
          <div className="flex items-center gap-2">
            <span className="text-sm text-white/30 shrink-0">/</span>
            <input className={inp} value={slug} onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''))} placeholder="ioanna-alexandros" required />
          </div>
        </div>
        <div>
          <label className={lbl}>Video URL</label>
          <input className={inp} value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} placeholder="https://youtube.com/..." />
        </div>
        <div>
          <label className={lbl}>Κατάσταση</label>
          <select className={inp} value={status} onChange={(e) => setStatus(e.target.value as any)}>
            <option value="DRAFT">Προσχέδιο</option>
            <option value="ACTIVE">Ενεργή</option>
          </select>
        </div>
      </section>

      {error && <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-sm text-red-400">{error}</div>}

      <div className="flex gap-3 pb-8">
        <button type="button" onClick={() => router.push('/admin')} className="flex-1 py-3 rounded-xl border border-blue-500/20 text-white/50 text-sm font-medium hover:border-blue-500/40 hover:text-white/70 transition-colors">
          Ακύρωση
        </button>
        <button type="submit" disabled={loading} className="flex-1 py-3 rounded-xl bg-blue-500 text-white text-sm font-bold hover:bg-blue-400 transition-colors disabled:opacity-50">
          {loading ? 'Αποθήκευση...' : '✓ Δημιουργία Video Only'}
        </button>
      </div>
    </form>
  );
}
