'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { adminApi } from '@/lib/api';
import { ArrowLeft, Download, FileSpreadsheet, Inbox, AlertTriangle, X, MessageSquare } from 'lucide-react';
import * as XLSX from 'xlsx';
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

function MessageModal({ guestName, message, onClose }: { guestName: string; message: string; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div
        className="relative bg-[#071218] border border-[#01FFFF]/15 rounded-2xl p-6 max-w-md w-full shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3 mb-4">
          <div>
            <p className="text-[10px] text-white/30 uppercase tracking-widest mb-0.5">Μήνυμα από</p>
            <h3 className="text-white font-semibold">{guestName}</h3>
          </div>
          <button onClick={onClose} className="text-white/30 hover:text-white transition-colors shrink-0 mt-0.5">
            <X size={18} />
          </button>
        </div>
        <p className="text-white/70 text-sm leading-relaxed whitespace-pre-wrap">{message}</p>
      </div>
    </div>
  );
}

export default function RsvpsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [rsvps, setRsvps] = useState<RSVP[]>([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [msgModal, setMsgModal] = useState<{ guestName: string; message: string } | null>(null);

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

  const rsvpRows = () =>
    rsvps.map((r) => ({
      Ονοματεπώνυμο: r.guestName,
      Τηλέφωνο: r.phone ?? '',
      Παρουσία: r.attending ? 'Ναι' : 'Όχι',
      Ενήλικες: r.attending ? r.adultCount : '',
      Παιδιά: r.attending ? r.childCount : '',
      Διατροφή: dietaryLabel[r.dietary] ?? r.dietary,
      Αλλεργία: r.hasAllergy ? (r.allergyNote ?? 'Ναι') : 'Όχι',
      Μήνυμα: r.message ?? '',
      Ημερομηνία: format(new Date(r.submittedAt), 'dd/MM/yyyy HH:mm'),
    }));

  const exportCsv = () => {
    const rows = rsvpRows();
    const header = Object.keys(rows[0] ?? {}).join(',');
    const lines = rows.map((r) => Object.values(r).map((v) => `"${String(v).replace(/"/g, '""')}"`).join(','));
    const csv = [header, ...lines].join('\n');
    const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `rsvp-${id}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(rsvpRows());
    ws['!cols'] = [20, 16, 10, 10, 10, 14, 20, 40, 18].map((w) => ({ wch: w }));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'RSVPs');
    XLSX.writeFile(wb, `rsvp-${id}.xlsx`);
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
      {msgModal && (
        <MessageModal
          guestName={msgModal.guestName}
          message={msgModal.message}
          onClose={() => setMsgModal(null)}
        />
      )}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-6 pt-6 pb-2">
        <div className="flex items-center gap-4">
          <button onClick={() => router.push('/admin')} className="text-white/40 hover:text-white transition-colors shrink-0">
            <ArrowLeft size={18} />
          </button>
          <div className="min-w-0">
            <h1 className="text-white font-semibold truncate">RSVPs — {title}</h1>
            <p className="text-xs text-white/40 mt-0.5">
              {attending.length} θα έρθουν · {notAttending.length} δεν θα έρθουν ·{' '}
              {totalAdults} ενήλικες · {totalChildren} παιδιά
            </p>
          </div>
        </div>
        {rsvps.length > 0 && (
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={exportExcel}
              className="flex items-center gap-2 text-sm font-medium bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 px-4 py-2 rounded-xl hover:bg-emerald-500/25 hover:border-emerald-500/50 transition-colors"
            >
              <FileSpreadsheet size={15} /> Excel
            </button>
            <button
              onClick={exportCsv}
              className="flex items-center gap-2 text-sm font-medium bg-[#01FFFF]/10 text-[#01FFFF] border border-[#01FFFF]/25 px-4 py-2 rounded-xl hover:bg-[#01FFFF]/20 hover:border-[#01FFFF]/40 transition-colors"
            >
              <Download size={15} /> CSV
            </button>
          </div>
        )}
      </div>

      <main className="max-w-7xl mx-auto px-4 py-8">
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
            <table className="w-full text-sm min-w-max">
              <thead className="border-b border-[#01FFFF]/10">
                <tr className="text-white/40 text-xs uppercase tracking-widest">
                  <th className="text-left px-4 py-3 font-medium">Ονοματεπώνυμο</th>
                  <th className="text-left px-4 py-3 font-medium">Τηλέφωνο</th>
                  <th className="text-center px-4 py-3 font-medium">Παρουσία</th>
                  <th className="text-center px-4 py-3 font-medium">Ενήλικες</th>
                  <th className="text-center px-4 py-3 font-medium">Παιδιά</th>
                  <th className="text-left px-4 py-3 font-medium">Διατροφή / Αλλεργία</th>
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
                      {r.attending ? (r.childCount > 0 ? r.childCount : '—') : '—'}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col gap-1">
                        {r.dietary !== 'NONE'
                          ? <span className="text-white/50">{dietaryLabel[r.dietary] ?? r.dietary}</span>
                          : !r.hasAllergy && <span className="text-white/25">—</span>
                        }
                        {r.hasAllergy && (
                          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-300 bg-amber-400/10 rounded-md px-1.5 py-0.5 w-fit">
                            <AlertTriangle size={11} className="shrink-0" />
                            {r.allergyNote ?? 'Αλλεργία'}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {r.message ? (
                        <button
                          onClick={() => setMsgModal({ guestName: r.guestName, message: r.message! })}
                          className="flex items-center gap-1.5 text-white/50 hover:text-[#01FFFF] transition-colors text-left group"
                        >
                          <MessageSquare size={12} className="shrink-0 group-hover:text-[#01FFFF]" />
                          <span className="max-w-32 truncate text-xs">{r.message}</span>
                        </button>
                      ) : (
                        <span className="text-white/25">—</span>
                      )}
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
