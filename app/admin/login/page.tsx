'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { adminLogin } from '@/lib/api';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const token = await adminLogin(email, password);
      localStorage.setItem('admin_token', token);
      router.push('/admin');
    } catch {
      setError('Λάθος email ή password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex justify-center mb-10">
          <Image src="/logo.png" alt="adinfinity" width={140} height={48} className="object-contain" />
        </div>

        {/* Card */}
        <div className="bg-[#071218]/80 backdrop-blur-sm border border-[#01FFFF]/10 rounded-2xl p-8 space-y-5 shadow-xl shadow-black/30">
          <div className="mb-2">
            <h1 className="text-white font-semibold text-lg">Σύνδεση</h1>
            <p className="text-white/40 text-xs mt-1">Πλατφόρμα διαχείρισης προσκλήσεων</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-white/50 mb-1.5 uppercase tracking-wide">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-[#07141C] border border-[#01FFFF]/20 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-[#01FFFF]/30 focus:border-[#01FFFF]/40 transition-colors"
                placeholder="admin@adinfinity.gr"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-white/50 mb-1.5 uppercase tracking-wide">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-[#07141C] border border-[#01FFFF]/20 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-[#01FFFF]/30 focus:border-[#01FFFF]/40 transition-colors"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <p className="text-red-400 text-xs bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-linear-to-r from-[#01FFFF] to-[#01A9FF] text-[#07141C] font-semibold py-3 rounded-xl text-sm hover:opacity-90 transition-opacity disabled:opacity-50 mt-2"
            >
              {loading ? 'Σύνδεση...' : 'Σύνδεση →'}
            </button>
          </form>
        </div>

        {/* Top separator line */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#01FFFF]/20 to-transparent" />
      </div>
    </div>
  );
}
