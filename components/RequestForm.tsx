'use client';

import { useState } from 'react';
import { submitLead, type CreateLeadPayload } from '@/lib/api';

const TYPES: { value: CreateLeadPayload['invitationType']; label: string; hint: string }[] = [
  { value: 'MINI_WEBSITE', label: 'Mini Website', hint: 'Πλήρες mini-site με ιστορία, εκδηλώσεις, RSVP' },
  { value: 'VIDEO_PROSKLITIRIO', label: 'Video Προσκλητήριο', hint: 'Video ως hero, quick bar & RSVP' },
  { value: 'VIDEO', label: 'Video Only', hint: 'Minimal: ονόματα, ημερομηνία, video' },
  { value: 'UNSURE', label: 'Δεν έχω αποφασίσει', hint: 'Θα το συζητήσουμε μαζί' },
];

type Status = 'idle' | 'sending' | 'sent' | 'error';

export default function RequestForm() {
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState<string | null>(null);
  const [type, setType] = useState<CreateLeadPayload['invitationType']>('MINI_WEBSITE');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === 'sending') return;

    const form = new FormData(e.currentTarget);
    const payload: CreateLeadPayload = {
      coupleName: String(form.get('coupleName') ?? '').trim(),
      email: String(form.get('email') ?? '').trim(),
      phone: String(form.get('phone') ?? '').trim() || undefined,
      eventDate: String(form.get('eventDate') ?? '').trim() || undefined,
      invitationType: type,
      message: String(form.get('message') ?? '').trim() || undefined,
      website: String(form.get('website') ?? ''),
    };

    setStatus('sending');
    setError(null);
    try {
      await submitLead(payload);
      setStatus('sent');
    } catch {
      setStatus('error');
      setError(
        'Δεν στάλθηκε η αίτηση. Δοκιμάστε ξανά ή γράψτε μας στο info@adinfinity.gr.',
      );
    }
  }

  if (status === 'sent') {
    return (
      <div
        role="status"
        className="rounded-2xl border border-[#01FFFF]/30 bg-[#071218]/80 p-8 text-center"
      >
        <p className="text-2xl font-bold text-[#01FFFF] mb-3">
          Λάβαμε την αίτησή σας
        </p>
        <p className="text-white/70 leading-relaxed">
          Θα επικοινωνήσουμε μαζί σας με πρόταση και τιμή. Αν βιάζεστε, γράψτε
          μας απευθείας στο{' '}
          <a href="mailto:info@adinfinity.gr" className="text-[#01FFFF] underline underline-offset-4">
            info@adinfinity.gr
          </a>
          .
        </p>
      </div>
    );
  }

  const field =
    'w-full rounded-xl border border-[#01FFFF]/20 bg-[#071218]/70 px-4 py-3 text-white placeholder:text-white/30 focus:border-[#01FFFF]/60 focus:outline-none transition-colors';
  const label = 'block text-sm font-semibold text-white/80 mb-2';

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate={false}>
      {/* Honeypot: hidden from users, irresistible to bots. */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div>
        <label className={label} htmlFor="coupleName">
          Ονόματα ζευγαριού <span className="text-[#01FFFF]">*</span>
        </label>
        <input
          id="coupleName"
          name="coupleName"
          type="text"
          required
          minLength={2}
          maxLength={120}
          placeholder="π.χ. Ιωάννα & Αλέξανδρος"
          className={field}
        />
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label className={label} htmlFor="email">
            Email <span className="text-[#01FFFF]">*</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            maxLength={160}
            placeholder="you@example.com"
            className={field}
          />
        </div>
        <div>
          <label className={label} htmlFor="phone">
            Τηλέφωνο
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            maxLength={40}
            placeholder="+30 …"
            className={field}
          />
        </div>
      </div>

      <div>
        <label className={label} htmlFor="eventDate">
          Ημερομηνία γάμου
        </label>
        <input
          id="eventDate"
          name="eventDate"
          type="text"
          maxLength={40}
          placeholder="π.χ. 15/06/2027 — ή απλώς «Ιούνιος 2027»"
          className={field}
        />
        <p className="mt-2 text-xs text-white/40">
          Δεν πειράζει αν δεν την έχετε κλείσει ακόμη.
        </p>
      </div>

      <fieldset>
        <legend className={label}>Τύπος πρόσκλησης</legend>
        <div className="grid gap-3 sm:grid-cols-2">
          {TYPES.map((t) => (
            <label
              key={t.value}
              className={`cursor-pointer rounded-xl border p-4 transition-colors ${
                type === t.value
                  ? 'border-[#01FFFF]/60 bg-[#01FFFF]/5'
                  : 'border-[#01FFFF]/15 bg-[#071218]/60 hover:border-[#01FFFF]/35'
              }`}
            >
              <input
                type="radio"
                name="invitationType"
                value={t.value}
                checked={type === t.value}
                onChange={() => setType(t.value)}
                className="sr-only"
              />
              <span className="block font-semibold text-[#01FFFF]">{t.label}</span>
              <span className="block text-sm text-white/50 mt-1">{t.hint}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <div>
        <label className={label} htmlFor="message">
          Κάτι ακόμη που θέλετε να ξέρουμε;
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          maxLength={2000}
          placeholder="Χρώματα, στυλ, ιδέες, απορίες…"
          className={field}
        />
      </div>

      {error && (
        <p role="alert" className="text-sm text-red-300">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={status === 'sending'}
        className="w-full rounded-full bg-[#01FFFF] px-8 py-4 text-lg font-bold text-[#07141C] transition-colors hover:bg-[#01FFFF]/90 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {status === 'sending' ? 'Αποστολή…' : 'Στείλτε την αίτηση →'}
      </button>

      <p className="text-center text-xs text-white/40">
        Τα στοιχεία σας χρησιμοποιούνται μόνο για να σας απαντήσουμε.
      </p>
    </form>
  );
}