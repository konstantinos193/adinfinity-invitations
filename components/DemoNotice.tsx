import Link from 'next/link';

/**
 * Marks the sample invitation as a demo.
 *
 * Everything on that page — names, dates, venues, the koumbaroi's phone
 * numbers, the IBAN — is invented. Without a label a visitor can't tell it
 * from a real couple's page, so it's stated plainly rather than in fine print.
 */
export default function DemoNotice() {
  return (
    <div className="relative z-50 bg-[#2c1810] text-[#fdfaf6] px-4 py-2.5 text-center text-xs sm:text-sm">
      <span className="font-bold tracking-[0.15em] uppercase text-[#e8c14a]">
        Demo πρόσκληση
      </span>
      <span className="mx-2 opacity-40">·</span>
      <span className="opacity-80">
        Τα στοιχεία που εμφανίζονται είναι ενδεικτικά
      </span>
      <span className="mx-2 opacity-40 hidden sm:inline">·</span>
      <Link
        href="/"
        className="underline underline-offset-4 decoration-[#e8c14a]/40 hover:text-[#e8c14a] transition-colors block sm:inline mt-1 sm:mt-0"
      >
        Δείτε την υπηρεσία
      </Link>
    </div>
  );
}
