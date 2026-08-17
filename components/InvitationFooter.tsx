import Link from 'next/link';

/**
 * Attribution footer shown at the bottom of every invitation.
 *
 * Doubles as the product's acquisition loop: a wedding link reaches hundreds of
 * guests, some of whom will be planning their own. The CTA is deliberately
 * quiet so it never competes with the couple's design.
 *
 * Invitation pages are `noindex, follow`, so this link still passes signal.
 */
export default function InvitationFooter({
  tone = 'light',
}: {
  /** 'light' = cream background; 'dark' = the full-screen video template. */
  tone?: 'light' | 'dark';
}) {
  const isDark = tone === 'dark';

  return (
    <footer
      className={
        isDark
          ? 'text-center py-8 text-xs text-white/20 border-t border-white/5'
          : 'py-8 text-center text-xs text-[#5c3320]/40 bg-[#fdfaf6] border-t border-[#b8960c]/10'
      }
    >
      <p>
        Δημιουργήθηκε από{' '}
        <a
          href="https://adinfinity.gr"
          className={
            isDark
              ? 'hover:text-white/50 transition-colors'
              : 'hover:text-[#b8960c] transition-colors'
          }
        >
          adinfinity.gr
        </a>
      </p>
      <p className="mt-2">
        <Link
          href="/"
          className={
            isDark
              ? 'hover:text-white/50 transition-colors underline underline-offset-4 decoration-white/10'
              : 'hover:text-[#b8960c] transition-colors underline underline-offset-4 decoration-[#b8960c]/20'
          }
        >
          Θέλετε κι εσείς ψηφιακό προσκλητήριο;
        </Link>
      </p>
    </footer>
  );
}
