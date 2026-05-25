import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#fdfaf6] flex flex-col items-center justify-center px-4 text-center">
      <div className="mb-8">
        <p className="tracking-[0.3em] uppercase text-[#b8960c] text-sm font-medium mb-4">
          Σφάλμα 404
        </p>
        <h1 className="font-serif text-5xl text-[#2c1810] italic mb-4">
          Η σελίδα δεν βρέθηκε
        </h1>
        <div className="w-24 h-px bg-[#b8960c]/40 mx-auto mb-6" />
        <p className="text-[#5c3320]/60 text-sm max-w-sm">
          Η πρόσκληση που αναζητάτε δεν υπάρχει ή έχει αφαιρεθεί.
        </p>
      </div>
      <Link
        href="/"
        className="inline-block bg-[#2c1810] text-white text-sm px-8 py-3 rounded-full hover:bg-[#5c3320] transition-colors"
      >
        Επιστροφή στην αρχική
      </Link>
    </div>
  );
}
