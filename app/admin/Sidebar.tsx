'use client';

import { usePathname, useRouter } from 'next/navigation';
import Image from 'next/image';
import { Globe, Film, Video, LogOut, LayoutDashboard } from 'lucide-react';
import Link from 'next/link';

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  if (pathname === '/admin/login') return null;

  const logout = () => {
    localStorage.removeItem('admin_token');
    router.push('/admin/login');
  };

  const isDashboard = pathname === '/admin';

  return (
    <aside className="w-52 shrink-0 h-screen flex flex-col bg-[#071218]/90 backdrop-blur-md border-r border-[#01FFFF]/10 sticky top-0 z-40 overflow-y-auto">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-[#01FFFF]/10">
        <Image src="/logo.png" alt="adifinity" width={100} height={34} className="object-contain" />
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-0.5">
        <Link
          href="/admin"
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

      {/* New Invitation — per type */}
      <div className="p-3 border-t border-[#01FFFF]/10 space-y-0.5">
        <p className="text-[10px] font-medium text-white/25 uppercase tracking-widest px-3 mb-2">
          Νέα Πρόσκληση
        </p>
        <Link
          href="/admin/create/mini-web"
          className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-white/50 hover:text-white hover:bg-white/5 transition-colors"
        >
          <Globe size={14} className="text-white/40" />
          Mini Web
        </Link>
        <Link
          href="/admin/create/video-pro"
          className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-purple-400/60 hover:text-purple-400 hover:bg-purple-500/10 transition-colors"
        >
          <Film size={14} />
          Video Pro
        </Link>
        <Link
          href="/admin/create/video-only"
          className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-blue-400/60 hover:text-blue-400 hover:bg-blue-500/10 transition-colors"
        >
          <Video size={14} />
          Video Only
        </Link>
      </div>

      {/* Logout */}
      <div className="p-3 border-t border-[#01FFFF]/10">
        <button
          onClick={logout}
          className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-white/30 hover:text-red-400 hover:bg-red-500/10 transition-colors w-full"
        >
          <LogOut size={14} />
          Αποσύνδεση
        </button>
      </div>
    </aside>
  );
}
