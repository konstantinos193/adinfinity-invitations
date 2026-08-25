import Link from 'next/link';
import type { ReactNode } from 'react';

/* ────────────────────────────────────────────────────────────────
   Shared building blocks for the marketing landing pages.

   These exist so a page can carry 900–1200 words of its own copy
   without every file re-declaring the same Tailwind soup. The copy
   itself stays in the page — only the chrome lives here, because
   near-identical body text across pages is what got this site's
   pages parked in "Crawled – currently not indexed" to begin with.
   ──────────────────────────────────────────────────────────────── */

export function PageShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#07141C] text-white">
      <div className="container mx-auto px-4 py-24 max-w-4xl">{children}</div>
    </div>
  );
}

export function Hero({ title, lead }: { title: string; lead: ReactNode }) {
  return (
    <>
      <h1 className="text-4xl md:text-5xl font-bold mb-6 text-[#01FFFF]">
        {title}
      </h1>
      <div className="text-lg text-white/70 mb-10 leading-relaxed space-y-4">
        {lead}
      </div>
    </>
  );
}

export function H2({ id, children }: { id?: string; children: ReactNode }) {
  return (
    <h2 id={id} className="text-2xl font-bold mb-4 mt-12 text-white">
      {children}
    </h2>
  );
}

export function H3({ children }: { children: ReactNode }) {
  return <h3 className="text-lg font-bold mb-2 text-[#01FFFF]">{children}</h3>;
}

export function Prose({ children }: { children: ReactNode }) {
  return (
    <div className="text-white/70 leading-relaxed space-y-4 mb-6">
      {children}
    </div>
  );
}

/** Bulleted feature list: bold lead-in, then explanation. */
export function FeatureList({
  items,
}: {
  items: { term: string; desc: string }[];
}) {
  return (
    <ul className="space-y-3 mb-8 text-white/80">
      {items.map(({ term, desc }) => (
        <li key={term}>
          • <strong className="text-[#01FFFF]">{term}</strong> — {desc}
        </li>
      ))}
    </ul>
  );
}

/** Numbered process cards. Mirrors whatever is passed to `howToNode`. */
export function StepCards({
  steps,
}: {
  steps: { name: string; text: string }[];
}) {
  return (
    <div className="space-y-4 mb-8">
      {steps.map((s, i) => (
        <div
          key={s.name}
          className="bg-[#071218]/80 border border-[#01FFFF]/20 rounded-xl p-6"
        >
          <H3>
            {i + 1}. {s.name}
          </H3>
          <p className="text-white/70">{s.text}</p>
        </div>
      ))}
    </div>
  );
}

/**
 * Two-column comparison. Scrolls inside its own container so a narrow phone
 * never forces the whole page to scroll sideways.
 */
export function ComparisonTable({
  colA,
  colB,
  rows,
}: {
  colA: string;
  colB: string;
  rows: { label: string; a: string; b: string }[];
}) {
  return (
    <div className="overflow-x-auto mb-8 rounded-xl border border-[#01FFFF]/15">
      <table className="w-full text-left border-collapse min-w-[34rem]">
        <thead>
          <tr className="bg-[#071218]/80">
            <th className="p-4 font-semibold text-white/60"> </th>
            <th className="p-4 font-semibold text-[#01FFFF]">{colA}</th>
            <th className="p-4 font-semibold text-white/60">{colB}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.label} className="border-t border-[#01FFFF]/10">
              <th scope="row" className="p-4 font-medium text-white/80">
                {r.label}
              </th>
              <td className="p-4 text-white/70">{r.a}</td>
              <td className="p-4 text-white/50">{r.b}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function Callout({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="bg-[#071218]/80 border border-[#01FFFF]/20 rounded-2xl p-8 mb-8">
      <h3 className="text-xl font-bold mb-4 text-[#01FFFF]">{title}</h3>
      <div className="text-white/70 space-y-3">{children}</div>
    </div>
  );
}

export function Cta({
  href,
  label,
  secondary,
}: {
  href: string;
  label: string;
  secondary?: { href: string; label: string };
}) {
  return (
    <div className="text-center my-12 flex flex-wrap gap-4 justify-center">
      <Link
        href={href}
        className="inline-block bg-[#01FFFF] hover:bg-[#01FFFF]/90 text-[#07141C] font-bold py-4 px-8 rounded-full text-lg transition-colors"
      >
        {label}
      </Link>
      {secondary && (
        <Link
          href={secondary.href}
          className="inline-block border-2 border-[#01FFFF] text-[#01FFFF] font-bold py-4 px-8 rounded-full text-lg hover:bg-[#01FFFF]/10 transition-colors"
        >
          {secondary.label}
        </Link>
      )}
    </div>
  );
}

/**
 * Visible FAQ. Always render the same Q&A that goes into `faqNode` — FAQPage
 * markup describing text the user can't see is a structured-data violation.
 */
export function Faq({ items }: { items: { q: string; a: string }[] }) {
  return (
    <section className="mt-16">
      <h2 className="text-2xl font-bold mb-6 text-white">Συχνές ερωτήσεις</h2>
      <div className="space-y-4">
        {items.map(({ q, a }) => (
          <details
            key={q}
            className="group rounded-xl border border-[#01FFFF]/15 bg-[#071218]/60 p-5"
          >
            <summary className="cursor-pointer font-semibold text-[#01FFFF] marker:content-['']">
              {q}
            </summary>
            <p className="mt-3 text-white/70 leading-relaxed">{a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
