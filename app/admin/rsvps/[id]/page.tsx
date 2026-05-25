'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { adminApi } from '@/lib/api';
import { ArrowLeft, Download, Inbox, AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';
import { el } from 'date-fns/locale';

interface RSVP {
  id: string;
  guestName: string;
  phone: string | null;
  attending: boolean;
  adultCount: number;
  hasChildren: boolean;
  childCount: number;
  dietary: string;
  hasAllergy: boolean;
  allergyNote: string | null;
  message: string | null;
  submittedAt: string;
}

const dietaryLabel: Record<string, string> = {
  NONE: '—',
  VEGAN: 'Vegan',
  VEGETARIAN: 'Vegetarian',
};

export default function RsvpsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [rsvps, setRsvps] = useState<RSVP[]>([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) { router.replace('/admin/login'); return; }

    Promise.all([
      adminApi(token).get<RSVP[]>(`/admin/invitations/${id}/rsvps`),
      adminApi(token).get<any>(`/admin/invitations/${id}`),
    ])
      .then(([rsvpRes, invRes]) => {
        setRsvps(rsvpRes.data);
        setTitle(`${invRes.data.brideName} & ${invRes.data.groomName}`);
      })
      .catch(() => router.replace('/admin'))
      .finally(() => setLoading(false));
  }, [id, router]);

  const attending = rsvps.filter((r) => r.attending);
  const notAttending = rsvps.filter((r) => !r.attending);
  const totalAdults = attending.reduce((s, r) => s + r.adultCount, 0);
  const totalChildren = attending.reduce((s, r) => s + r.childCount, 0);

  const exportCsv = () => {
    const header = 'Ονοματεπώνυμο,Τηλέφωνο,Παρουσία,Ενήλικες,Παιδιά,Διατροφή,Αλλεργία,Μήνυμα,Ημερομηνία';
    const rows = rsvps.map((r) =>
      [
        r.guestName,
        r.phone ?? '',
        r.attending ? 'Ναι' : 'Όχι',
        r.adultCount,
        r.childCount,
        dietaryLabel[r.dietary] ?? r.dietary,
        r.hasAllergy ? (r.allergyNote ?? 'Ναι') : 'Όχι',
        (r.message ?? '').replace(/,/g, ' '),
        format(new Date(r.submittedAt), 'dd/MM/yyyy HH:mm'),
      ].join(',')
    );
    const csv = [header, ...rows].join('\n');
    const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `rsvp-${id}.csv`;
    a.click();
    URL.revokeObjectURL(url);
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
      <div className="flex items-center justify-between px-6 pt-6 pb-2">
        <div className="flex items-center gap-4">
          <button onClick={() => router.push('/admin')} className="text-white/40 hover:text-white transition-colors">
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-white font-semibold">RSVPs — {title}</h1>
            <p className="text-xs text-white/40 mt-0.5">
              {attending.length} θα έρθουν · {notAttending.length} δεν θα έρθουν ·{' '}
              {totalAdults} ενήλικες · {totalChildren} παιδιά
            </p>
          </div>
        </div>
        {rsvps.length > 0 && (
          <button
            onClick={exportCsv}
            className="flex items-center gap-1.5 text-sm text-white/60 border border-[#01FFFF]/20 px-4 py-2 rounded-xl hover:border-[#01FFFF]/40 hover:text-white transition-colors"
          >
            <Download size={14} /> CSV
          </button>
        )}
      </div>

      <main className="max-w-5xl mx-auto px-4 py-8">
        {/* Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Συνολικές απαντήσεις', value: rsvps.length },
            { label: 'Θα παραστούν', value: attending.length },
            { label: 'Ενήλικες', value: totalAdults },
            { label: 'Παιδιά', value: totalChildren },
          ].map(({ label, value }) => (
            <div key={label} className="bg-[#071218]/60 border border-[#01FFFF]/10 rounded-2xl p-4 text-center">
              <p className="text-3xl font-bold text-[#01FFFF]">{value}</p>
              <p className="text-xs text-white/40 mt-1">{label}</p>
            </div>
          ))}
        </div>

        {rsvps.length === 0 ? (
          <div className="text-center py-20 text-white/20">
            <Inbox size={36} className="mx-auto mb-3 opacity-30" />
            <p>Δεν υπάρχουν απαντήσεις ακόμη.</p>
          </div>
        ) : (
          <div className="bg-[#071218]/60 backdrop-blur-sm rounded-2xl border border-[#01FFFF]/10 overflow-x-auto">
            <table className="w-full text-sm min-w-175">
              <thead className="border-b border-[#01FFFF]/10">
                <tr className="text-white/40 text-xs uppercase tracking-widest">
                  <th className="text-left px-4 py-3 font-medium">Ονοματεπώνυμο</th>
                  <th className="text-left px-4 py-3 font-medium">Τηλέφωνο</th>
                  <th className="text-center px-4 py-3 font-medium">Παρουσία</th>
                  <th className="text-center px-4 py-3 font-medium">Ενήλικες</th>
                  <th className="text-center px-4 py-3 font-medium">Παιδιά</th>
                  <th className="text-left px-4 py-3 font-medium">Διατροφή</th>
                  <th className="text-left px-4 py-3 font-medium">Μήνυμα</th>
                  <th className="text-left px-4 py-3 font-medium">Ημερομηνία</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#01FFFF]/5">
                {rsvps.map((r) => (
                  <tr key={r.id} className={`hover:bg-white/2 transition-colors ${!r.attending ? 'opacity-50' : ''}`}>
                    <td className="px-4 py-3 font-medium text-white">{r.guestName}</td>
                    <td className="px-4 py-3 text-white/50">{r.phone ?? '—'}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        r.attending
                          ? 'bg-green-500/15 text-green-400'
                          : 'bg-red-500/15 text-red-400'
                      }`}>
                        {r.attending ? 'Ναι' : 'Όχι'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center text-white/50">{r.attending ? r.adultCount : '—'}</td>
                    <td className="px-4 py-3 text-center text-white/50">
                      {r.attending && r.hasChildren ? r.childCount : '—'}
                    </td>
                    <td className="px-4 py-3 text-white/50">
                      {dietaryLabel[r.dietary] ?? r.dietary}
                      {r.hasAllergy && (
                        <span title={r.allergyNote ?? 'Αλλεργία'}><AlertTriangle size={12} className="inline ml-1 text-amber-400" /></span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-white/50 max-w-45 truncate" title={r.message ?? ''}>
                      {r.message ?? '—'}
                    </td>
                    <td className="px-4 py-3 text-white/30 text-xs whitespace-nowrap">
                      {format(new Date(r.submittedAt), 'd MMM yyyy, HH:mm', { locale: el })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
