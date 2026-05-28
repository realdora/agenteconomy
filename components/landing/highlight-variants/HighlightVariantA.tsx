// Variant A — Big stats banner (typography-led, near-static)
// 4 stat groups across one wide row; hero-style large numbers + mono captions

export function HighlightVariantA() {
  const STATS = [
    { value: "5", label: "payment protocols", note: "x402 · ERC-8004 · ACP · Olas · MPP" },
    { value: "11+", label: "chains indexed", note: "base · arbitrum · ethereum …" },
    { value: "173M+", label: "events tracked daily", note: "every block, every chain" },
    { value: "24/7", label: "ingest from block tip", note: "no batch jobs, no lag" },
  ];

  return (
    <section className="py-16 md:py-24 lg:py-32 border-t border-b border-white/10">
      <div className="w-[1240px] max-w-full mx-auto px-5">
        <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-white/45 mb-10">
          // Today on agenteconomy
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-y-12 gap-x-6">
          {STATS.map((s) => (
            <div key={s.label} className="flex flex-col gap-3">
              <div className="font-medium text-white text-[64px] md:text-[88px] lg:text-[110px] leading-[0.95] tracking-[-0.04em]">
                {s.value}
              </div>
              <div className="font-display italic text-white/85 text-[18px] md:text-[20px] leading-tight">
                {s.label}
              </div>
              <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-white/40">
                {s.note}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
