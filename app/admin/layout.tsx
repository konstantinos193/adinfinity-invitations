export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#07141C] text-white relative">
      {/* Subtle grid pattern */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.025]"
        style={{
          backgroundImage:
            'linear-gradient(to right, #01FFFF 1px, transparent 1px), linear-gradient(to bottom, #01FFFF 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />
      {/* Cyan glow top-right */}
      <div className="fixed -top-40 right-20 w-96 h-96 bg-[#01FFFF]/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="fixed -bottom-40 left-20 w-96 h-96 bg-[#01A9FF]/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
