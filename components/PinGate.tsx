'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

/**
 * Shown in place of a PIN-protected invitation.
 *
 * Deliberately says nothing about the couple — no names, no date, no photo.
 * The whole point of the gate is that none of that is knowable until the PIN
 * is entered, and the backend already withholds it.
 */
export default function PinGate({ slug }: { slug: string }) {
  const router = useRouter();
  const [pin, setPin] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (busy || pin.length < 4) return;

    setBusy(true);
    setError(null);
    try {
      const res = await fetch(`/api/unlock/${encodeURIComponent(slug)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setError(body.error ?? 'Λάθος κωδικός.');
        setPin('');
        return;
      }

      // The cookie is set; re-render the server component with it.
      router.refresh();
    } catch {
      setError('Κάτι πήγε στραβά. Δοκιμάστε ξανά.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#fdfaf6] flex flex-col items-center justify-center px-4 text-center">
      <div className="w-full max-w-sm">
        <p className="tracking-[0.3em] uppercase text-[#b8960c] text-xs font-medium mb-4">
          Ιδιωτική πρόσκληση
        </p>
        <h1 className="font-serif text-4xl text-[#2c1810] italic mb-4">
          Εισάγετε τον κωδικό
        </h1>
        <div className="w-24 h-px bg-[#b8960c]/40 mx-auto mb-6" />
        <p className="text-[#5c3320]/60 text-sm mb-8">
          Η πρόσκληση αυτή προστατεύεται με κωδικό. Θα τον βρείτε μαζί με τον
          σύνδεσμο που σας έστειλαν.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <label htmlFor="pin" className="sr-only">
            Κωδικός πρόσκλησης
          </label>
          <input
            id="pin"
            name="pin"
            type="text"
            inputMode="numeric"
            autoComplete="off"
            autoFocus
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            maxLength={64}
            placeholder="••••"
            className="w-full rounded-full border border-[#b8960c]/30 bg-white px-6 py-4 text-center text-2xl tracking-[0.4em] text-[#2c1810] placeholder:text-[#5c3320]/25 focus:border-[#b8960c] focus:outline-none"
          />

          {error && (
            <p role="alert" className="text-sm text-red-700">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={busy || pin.length < 4}
            className="w-full rounded-full bg-[#2c1810] px-8 py-3.5 text-sm text-white transition-colors hover:bg-[#5c3320] disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {busy ? 'Έλεγχος…' : 'Άνοιγμα πρόσκλησης'}
          </button>
        </form>
      </div>

      <footer className="mt-16 text-center text-xs text-[#5c3320]/40">
        Δημιουργήθηκε από{' '}
        <a href="https://adinfinity.gr" className="hover:text-[#b8960c] transition-colors">
          adinfinity.gr
        </a>
      </footer>
    </main>
  );
}
