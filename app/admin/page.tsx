'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { adminApi } from '@/lib/api';
import type { Invitation } from '@/lib/types';
import {
  AlertTriangle, ExternalLink, Pencil, Trash2, Users,
  Search, RefreshCw, Copy, Check, X, Calendar, TrendingUp,
  Globe, Video, Film, Mail,
} from 'lucide-react';
import { format, differenceInDays, isPast } from 'date-fns';
import { el } from 'date-fns/locale';

type InvitationWithCount = Invitation & {
  _count?: { rsvps: number };
  invitationType?: string;
};

type StatusFilter = 'ALL' | 'ACTIVE' | 'DRAFT' | 'EXPIRED';
type TypeFilter   = 'ALL' | 'MINI_WEBSITE' | 'VIDEO_PROSKLITIRIO' | 'VIDEO';
type SortKey      = 'date' | 'created' | 'rsvps' | 'name';

const statusMeta: Record<string, { text: string; cls: string }> = {
  ACTIVE:  { text: 'Ενεργή',    cls: 'bg-[#01FFFF]/10 text-[#01FFFF] border border-[#01FFFF]/20' },
  DRAFT:   { text: 'Draft',     cls: 'bg-white/8 text-white/50 border border-white/10' },
  EXPIRED: { text: 'Έληξε',     cls: 'bg-red-500/10 text-red-400 border border-red-500/20' },
};

const typeMeta: Record<string, { text: string; icon: React.ElementType; cls: string }> = {
  MINI_WEBSITE:       { text: 'Mini Web',  icon: Globe,  cls: 'text-white/40' },
  VIDEO_PROSKLITIRIO: { text: 'Video Pro', icon: Film,   cls: 'text-purple-400' },
  VIDEO:              { text: 'Video',     icon: Video,  cls: 'text-blue-400' },
};

function StatCard({ label, value, sub, accent }: { label: string; value: number | string; sub?: string; accent?: boolean }) {
  return (
    <div className={`rounded-2xl p-5 border ${accent ? 'bg-[#01FFFF]/5 border-[#01FFFF]/20' : 'bg-[#071218]/60 border-[#01FFFF]/10'}`}>
      <p className="text-white/40 text-xs uppercase tracking-widest mb-1">{label}</p>
      <p className={`text-3xl font-bold ${accent ? 'text-[#01FFFF]' : 'text-white'}`}>{value}</p>
      {sub && <p className="text-white/30 text-xs mt-1">{sub}</p>}
    </div>
  );
}

function DeleteModal({ name, onConfirm, onCancel }: { name: string; onConfirm: () => void; onCancel: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onCancel}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div
        className="relative bg-[#071218] border border-[#01FFFF]/15 rounded-2xl p-6 max-w-sm w-full shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-12 h-12 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center justify-center mb-4">
          <Trash2 size={20} className="text-red-400" />
        </div>
        <h3 className="text-white font-semibold text-lg mb-1">Διαγραφή πρόσκλησης</h3>
        <p className="text-white/50 text-sm mb-6">
          Η πρόσκληση <span className="text-white font-medium">{name}</span> και όλα τα RSVPs θα διαγραφούν οριστικά.
        </p>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 py-2.5 rounded-xl border border-white/10 text-white/50 text-sm hover:text-white hover:border-white/20 transition-colors">
            Ακύρωση
          </button>
          <button onClick={onConfirm} className="flex-1 py-2.5 rounded-xl bg-red-500/15 border border-red-500/30 text-red-400 text-sm font-medium hover:bg-red-500/25 transition-colors">
            Διαγραφή
          </button>
        </div>
      </div>
    </div>
  );
}

function CopyLinkButton({ slug }: { slug: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    await navigator.clipboard.writeText(`${window.location.origin}/${slug}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      onClick={copy}
      className={`p-1.5 rounded-lg transition-colors ${copied ? 'text-green-400 bg-green-500/10' : 'text-white/30 hover:text-white hover:bg-white/5'}`}
      title="Αντιγραφή link"
    >
      {copied ? <Check size={15} /> : <Copy size={15} />}
    </button>
  );
}

export default function AdminPage() {
  const router = useRouter();
  const [invitations, setInvitations] = useState<InvitationWithCount[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<InvitationWithCount | null>(null);

  // Filters & sort
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('ALL');
  const [typeFilter, setTypeFilter]   = useState<TypeFilter>('ALL');
  const [sortKey, setSortKey]         = useState<SortKey>('date');

  const load = (showSpinner = true) => {
    const token = localStorage.getItem('admin_token');
    if (!token) { router.replace('/admin/login'); return; }
    if (showSpinner) setLoading(true);
    else setRefreshing(true);
    adminApi(token)
      .get<InvitationWithCount[]>('/admin/invitations')
      .then((r) => setInvitations(r.data))
      .catch(() => router.replace('/admin/login'))
      .finally(() => { setLoading(false); setRefreshing(false); });
  };

  useEffect(() => { load(); }, []); // eslint-disable-line

  const handleDelete = async () => {
    if (!deleteTarget) return;
    const token = localStorage.getItem('admin_token')!;
    await adminApi(token).delete(`/admin/invitations/${deleteTarget.id}`);
    setInvitations((prev) => prev.filter((i) => i.id !== deleteTarget.id));
    setDeleteTarget(null);
  };

  const toggleStatus = async (inv: InvitationWithCount) => {
    const token = localStorage.getItem('admin_token')!;
    const next = inv.status === 'ACTIVE' ? 'DRAFT' : 'ACTIVE';
    await adminApi(token).patch(`/admin/invitations/${inv.id}`, { status: next });
    setInvitations((prev) => prev.map((i) => i.id === inv.id ? { ...i, status: next } : i));
  };

  // Stats
  const stats = useMemo(() => ({
    total:   invitations.length,
    active:  invitations.filter((i) => i.status === 'ACTIVE').length,
    rsvps:   invitations.reduce((s, i) => s + (i._count?.rsvps ?? 0), 0),
    upcoming: invitations.filter((i) => !isPast(new Date(i.weddingDate))).length,
  }), [invitations]);

  // Filtered + sorted list
  const filtered = useMemo(() => {
    let list = [...invitations];
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((i) =>
        i.brideName.toLowerCase().includes(q) ||
        i.groomName.toLowerCase().includes(q) ||
        i.slug.toLowerCase().includes(q)
      );
    }
    if (statusFilter !== 'ALL') list = list.filter((i) => i.status === statusFilter);
    if (typeFilter !== 'ALL')   list = list.filter((i) => (i.invitationType ?? 'MINI_WEBSITE') === typeFilter);
    list.sort((a, b) => {
      if (sortKey === 'date')    return new Date(a.weddingDate).getTime() - new Date(b.weddingDate).getTime();
      if (sortKey === 'rsvps')   return (b._count?.rsvps ?? 0) - (a._count?.rsvps ?? 0);
      if (sortKey === 'name')    return a.brideName.localeCompare(b.brideName);
      if (sortKey === 'created') return new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime();
      return 0;
    });
    return list;
  }, [invitations, search, statusFilter, typeFilter, sortKey]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center gap-2 text-[#01FFFF]/60 text-sm">
          <div className="w-4 h-4 border-2 border-[#01FFFF]/30 border-t-[#01FFFF] rounded-full animate-spin" />
          Φόρτωση...
        </div>
      </div>
    );
  }

  return (
    <>
      {deleteTarget && (
        <DeleteModal
          name={`${deleteTarget.brideName} & ${deleteTarget.groomName}`}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}

      <main className="max-w-7xl mx-auto px-4 py-8 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-white/70 font-semibold text-base">Προσκλήσεις</h1>
          <button
            onClick={() => load(false)}
            className={`p-2 rounded-xl text-white/30 hover:text-white hover:bg-white/5 transition-colors ${refreshing ? 'animate-spin text-[#01FFFF]/60' : ''}`}
            title="Ανανέωση"
          >
            <RefreshCw size={16} />
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Σύνολο" value={stats.total} sub="προσκλήσεις" />
          <StatCard label="Ενεργές" value={stats.active} sub="δημοσιευμένες" accent />
          <StatCard label="Σύνολο RSVPs" value={stats.rsvps} sub="από όλες τις προσκλήσεις" />
          <StatCard label="Επερχόμενοι" value={stats.upcoming} sub="γάμοι που δεν έχουν παρέλθει" />
        </div>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Αναζήτηση ζευγαριού ή slug..."
              className="w-full bg-[#071218]/60 border border-[#01FFFF]/15 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-[#01FFFF]/40 focus:ring-1 focus:ring-[#01FFFF]/20 transition-colors"
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white">
                <X size={14} />
              </button>
            )}
          </div>

          {/* Sort */}
          <select
            value={sortKey}
            onChange={(e) => setSortKey(e.target.value as SortKey)}
            className="bg-[#071218]/60 border border-[#01FFFF]/15 rounded-xl px-3 py-2.5 text-sm text-white/70 focus:outline-none focus:border-[#01FFFF]/40 transition-colors"
          >
            <option value="date">Ταξινόμηση: Ημερομηνία γάμου</option>
            <option value="created">Ταξινόμηση: Νεότερες πρώτα</option>
            <option value="rsvps">Ταξινόμηση: Περισσότερα RSVPs</option>
            <option value="name">Ταξινόμηση: Αλφαβητικά</option>
          </select>
        </div>

        {/* Filter tabs */}
        <div className="flex flex-wrap gap-2">
          {/* Status filters */}
          <div className="flex gap-1 bg-[#071218]/60 border border-[#01FFFF]/10 rounded-xl p-1">
            {(['ALL', 'ACTIVE', 'DRAFT', 'EXPIRED'] as StatusFilter[]).map((f) => (
              <button
                key={f}
                onClick={() => setStatusFilter(f)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  statusFilter === f
                    ? 'bg-[#01FFFF]/15 text-[#01FFFF]'
                    : 'text-white/40 hover:text-white/70'
                }`}
              >
                {f === 'ALL' ? 'Όλες' : f === 'ACTIVE' ? 'Ενεργές' : f === 'DRAFT' ? 'Draft' : 'Έληξε'}
                {f !== 'ALL' && (
                  <span className="ml-1.5 opacity-60">
                    {invitations.filter((i) => i.status === f).length}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Type filters */}
          <div className="flex gap-1 bg-[#071218]/60 border border-[#01FFFF]/10 rounded-xl p-1">
            {(['ALL', 'MINI_WEBSITE', 'VIDEO_PROSKLITIRIO', 'VIDEO'] as TypeFilter[]).map((f) => (
              <button
                key={f}
                onClick={() => setTypeFilter(f)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  typeFilter === f
                    ? 'bg-[#01FFFF]/15 text-[#01FFFF]'
                    : 'text-white/40 hover:text-white/70'
                }`}
              >
                {f === 'ALL' ? 'Όλοι τύποι' : f === 'MINI_WEBSITE' ? 'Mini Web' : f === 'VIDEO_PROSKLITIRIO' ? 'Video Pro' : 'Video Only'}
              </button>
            ))}
          </div>
        </div>

        {/* Results */}
        {filtered.length === 0 ? (
          <div className="text-center py-20 text-white/20">
            <div className="flex justify-center mb-3">
              {search || statusFilter !== 'ALL' || typeFilter !== 'ALL' ? <Search size={32} className="opacity-30" /> : <Mail size={32} className="opacity-30" />}
            </div>
            <p className="text-sm">
              {search || statusFilter !== 'ALL' || typeFilter !== 'ALL'
                ? 'Δεν βρέθηκαν αποτελέσματα.'
                : 'Δεν υπάρχουν προσκλήσεις ακόμη.'}
            </p>
            {!search && statusFilter === 'ALL' && typeFilter === 'ALL' && (
              <a href="/admin/create/mini-web" className="inline-block mt-4 text-[#01FFFF] text-sm hover:underline">
                Δημιουργήστε την πρώτη →
              </a>
            )}
          </div>
        ) : (
          <>
            <p className="text-white/30 text-xs">
              {filtered.length} {filtered.length === 1 ? 'αποτέλεσμα' : 'αποτελέσματα'}
              {(search || statusFilter !== 'ALL' || typeFilter !== 'ALL') && (
                <button
                  onClick={() => { setSearch(''); setStatusFilter('ALL'); setTypeFilter('ALL'); }}
                  className="ml-2 text-[#01FFFF]/60 hover:text-[#01FFFF] transition-colors"
                >
                  Καθαρισμός φίλτρων ×
                </button>
              )}
            </p>

            <div className="bg-[#071218]/60 backdrop-blur-sm rounded-2xl border border-[#01FFFF]/10 overflow-x-auto">
              <table className="w-full text-sm min-w-200">
                <thead className="border-b border-[#01FFFF]/10">
                  <tr className="text-white/30 text-xs uppercase tracking-widest">
                    <th className="text-left px-5 py-3 font-medium">Ζευγάρι</th>
                    <th className="text-left px-5 py-3 font-medium">Slug</th>
                    <th className="text-left px-5 py-3 font-medium">Γάμος</th>
                    <th className="text-left px-5 py-3 font-medium">Αντίστροφη</th>
                    <th className="text-center px-5 py-3 font-medium">RSVPs</th>
                    <th className="text-left px-5 py-3 font-medium">Τύπος</th>
                    <th className="text-left px-5 py-3 font-medium">Κατάσταση</th>
                    <th className="px-5 py-3" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#01FFFF]/5">
                  {filtered.map((inv) => {
                    const s = statusMeta[inv.status] ?? statusMeta.DRAFT;
                    const tm = typeMeta[inv.invitationType ?? 'MINI_WEBSITE'] ?? typeMeta.MINI_WEBSITE;
                    const TypeIcon = tm.icon;
                    const rsvpCount = inv._count?.rsvps ?? 0;
                    const hasEmail = inv.contacts?.some(
                      (c) => (c.role === 'BRIDE' || c.role === 'GROOM') && c.email,
                    );
                    const daysLeft = differenceInDays(new Date(inv.weddingDate), new Date());
                    const past = isPast(new Date(inv.weddingDate));

                    return (
                      <tr key={inv.id} className="hover:bg-white/2 transition-colors group">
                        {/* Couple */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-white">{inv.brideName} & {inv.groomName}</span>
                            {!hasEmail && (
                              <span title="Χωρίς email — RSVP ειδοποιήσεις δεν θα σταλούν">
                                <AlertTriangle size={12} className="text-amber-400 shrink-0" />
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Slug */}
                        <td className="px-5 py-4 text-white/35 font-mono text-xs">/{inv.slug}</td>

                        {/* Wedding date */}
                        <td className="px-5 py-4 text-white/55 text-xs whitespace-nowrap">
                          <div className="flex items-center gap-1.5">
                            <Calendar size={11} className="text-white/25" />
                            {format(new Date(inv.weddingDate), 'd MMM yyyy', { locale: el })}
                          </div>
                        </td>

                        {/* Countdown */}
                        <td className="px-5 py-4 text-xs whitespace-nowrap">
                          {past ? (
                            <span className="text-white/25">Παρήλθε</span>
                          ) : (
                            <span className={`flex items-center gap-1 ${daysLeft <= 30 ? 'text-amber-400' : 'text-white/40'}`}>
                              <TrendingUp size={11} />
                              σε {daysLeft} μέρες
                            </span>
                          )}
                        </td>

                        {/* RSVPs */}
                        <td className="px-5 py-4 text-center">
                          <a
                            href={`/admin/rsvps/${inv.id}`}
                            className={`inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full transition-colors ${
                              rsvpCount > 0
                                ? 'bg-[#01FFFF]/10 text-[#01FFFF] hover:bg-[#01FFFF]/20'
                                : 'bg-white/5 text-white/25 hover:bg-white/10 hover:text-white/50'
                            }`}
                          >
                            <Users size={11} /> {rsvpCount}
                          </a>
                        </td>

                        {/* Type */}
                        <td className="px-5 py-4">
                          <span className={`flex items-center gap-1.5 text-xs ${tm.cls}`}>
                            <TypeIcon size={12} />
                            {tm.text}
                          </span>
                        </td>

                        {/* Status — clickable toggle */}
                        <td className="px-5 py-4">
                          <button
                            onClick={() => toggleStatus(inv)}
                            title={inv.status === 'ACTIVE' ? 'Κλικ για Draft' : 'Κλικ για Ενεργοποίηση'}
                            className={`px-2.5 py-1 rounded-full text-xs font-medium cursor-pointer transition-opacity hover:opacity-70 ${s.cls}`}
                          >
                            {s.text}
                          </button>
                        </td>

                        {/* Actions */}
                        <td className="px-5 py-4">
                          <div className="flex gap-0.5 justify-end opacity-60 group-hover:opacity-100 transition-opacity">
                            <CopyLinkButton slug={inv.slug} />
                            <a
                              href={`/${inv.slug}`}
                              target="_blank"
                              className="text-white/30 hover:text-[#01FFFF] p-1.5 rounded-lg hover:bg-[#01FFFF]/10 transition-colors"
                              title="Προβολή"
                            >
                              <ExternalLink size={15} />
                            </a>
                            <a
                              href={`/admin/edit/${inv.id}`}
                              className="text-white/30 hover:text-white p-1.5 rounded-lg hover:bg-white/5 transition-colors"
                              title="Επεξεργασία"
                            >
                              <Pencil size={15} />
                            </a>
                            <button
                              onClick={() => setDeleteTarget(inv)}
                              className="text-white/20 hover:text-red-400 p-1.5 rounded-lg hover:bg-red-500/10 transition-colors"
                              title="Διαγραφή"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}
      </main>
    </>
  );
}
