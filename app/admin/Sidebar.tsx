'use client';

import { usePathname, useRouter } from 'next/navigation';
import Image from 'next/image';
import { Heart, Baby, Sparkles, LogOut, LayoutDashboard, Menu, X } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  if (pathname === '/admin/login') return null;

  const logout = () => {
    localStorage.removeItem('admin_token');
    router.push('/admin/login');
  };

  const isDashboard = pathname === '/admin';
  const close = () => setMobileOpen(false);

  const navContent = (
    <>
      <div className="px-5 py-5 border-b border-[#01FFFF]/10 flex items-center justify-between">
        <Image src="/logo.png" alt="adifinity" width={100} height={34} className="object-contain" />
        <button onClick={close} className="md:hidden text-white/40 hover:text-white p-1 -mr-1">
          <X size={20} />
        </button>
      </div>

      <nav className="flex-1 p-3 space-y-0.5">
        <Link
          href="/admin"
          onClick={close}
          className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm transition-colors ${
            isDashboard
              ? 'bg-[#01FFFF]/10 text-[#01FFFF]'
              : 'text-white/50 hover:text-white hover:bg-white/5'
          }`}
        >
          <LayoutDashboard size={15} />
          Προσκλήσεις
        </Link>
      </nav>

      <div className="p-3 border-t border-[#01FFFF]/10 space-y-0.5">
        <p className="text-[10px] font-medium text-white/25 uppercase tracking-widest px-3 mb-2">
          Νέα Πρόσκληση
        </p>
        <Link
          href="/admin/create/wedding"
          onClick={close}
          className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm transition-colors ${
            pathname === '/admin/create/wedding'
              ? 'bg-rose-500/10 text-rose-300'
              : 'text-rose-400/60 hover:text-rose-300 hover:bg-rose-500/10'
          }`}
        >
          <Heart size={14} />
          Γάμος
        </Link>
        <Link
          href="/admin/create/baptism"
          onClick={close}
          className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm transition-colors ${
            pathname === '/admin/create/baptism'
              ? 'bg-sky-500/10 text-sky-300'
              : 'text-sky-400/60 hover:text-sky-300 hover:bg-sky-500/10'
          }`}
        >
          <Baby size={14} />
          Βάπτιση
        </Link>
        <Link
          href="/admin/create/wedding-baptism"
          onClick={close}
          className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm transition-colors ${
            pathname === '/admin/create/wedding-baptism'
              ? 'bg-violet-500/10 text-violet-300'
              : 'text-violet-400/60 hover:text-violet-300 hover:bg-violet-500/10'
          }`}
        >
          <Sparkles size={14} />
          Γαμοβάπτιση
        </Link>
      </div>

      <div className="p-3 border-t border-[#01FFFF]/10">
        <button
          onClick={logout}
          className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-white/30 hover:text-red-400 hover:bg-red-500/10 transition-colors w-full"
        >
          <LogOut size={14} />
          Αποσύνδεση
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-[#071218]/95 backdrop-blur-md border-b border-[#01FFFF]/10 flex items-center gap-3 px-4 py-3">
        <button
          onClick={() => setMobileOpen(true)}
          className="text-white/60 hover:text-white p-1 -ml-1"
          aria-label="Άνοιγμα μενού"
        >
          <Menu size={22} />
        </button>
        <Image src="/logo.png" alt="adifinity" width={80} height={27} className="object-contain" />
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex" onClick={close}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <aside
            className="relative w-64 h-full flex flex-col bg-[#071218] border-r border-[#01FFFF]/10 overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {navContent}
          </aside>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-52 shrink-0 h-screen flex-col bg-[#071218]/90 backdrop-blur-md border-r border-[#01FFFF]/10 sticky top-0 z-40 overflow-y-auto">
        {navContent}
      </aside>
    </>
  );
}
