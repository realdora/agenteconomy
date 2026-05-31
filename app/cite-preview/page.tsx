"use client";

// Cite — refined Style A (ledger block) with a perfectly-synced indexing scanner.
// Fixed block + connector widths → exact block-center fractions → scanner (linear),
// progress fill, and per-block light all share one 3.5s linear timeline = no drift.

const ACCENT = "#9E7BFF";
const BASE = "#221a40";
const GLOW = "rgba(158,123,255,0.16)";
const DUR = 3.5;

const BLOCK_W = 82;
const CONN_W = 26;
const BLOCKS = ["x402", "olas", "ACP", "ERC", "tempo"];
const N = BLOCKS.length;
const TOTAL_W = N * BLOCK_W + (N - 1) * CONN_W;
// center fraction of each block within the chain track → delay = fraction * DUR
const DELAYS = BLOCKS.map((_, i) => {
  const center = i * (BLOCK_W + CONN_W) + BLOCK_W / 2;
  return +((center / TOTAL_W) * DUR).toFixed(3);
});

function Chain() {
  return (
    <div className="relative mx-auto" style={{ width: TOTAL_W }}>
      {/* base connector line through block centers */}
      <span className="absolute top-1/2 left-0 right-0 h-[2px] -translate-y-1/2" style={{ background: "rgba(255,255,255,0.14)" }} />
      {/* progress fill, synced */}
      <span className="ix-fill absolute top-1/2 left-0 h-[2px] -translate-y-1/2" style={{ background: `linear-gradient(90deg, ${ACCENT}, rgba(158,123,255,0.4))` }} />
      {/* scanner head, synced */}
      <span className="ix-scan absolute top-[-10px] bottom-[-10px] w-[3px] rounded-full" />

      <div className="relative flex items-center" style={{ gap: CONN_W }}>
        {BLOCKS.map((b, i) => (
          <div
            key={b}
            className="ix-blk relative rounded-lg border overflow-hidden"
            style={{ width: BLOCK_W, animationDelay: `${DELAYS[i]}s` }}
          >
            <div className="ix-head px-2 py-1 font-mono text-[9px] uppercase tracking-[0.12em] border-b border-white/10">{b}</div>
            <div className="px-2 py-2.5 flex flex-col gap-1.5">
              <span className="ix-line block h-[3px] rounded-full w-full" style={{ animationDelay: `${DELAYS[i]}s` }} />
              <span className="ix-line block h-[3px] rounded-full w-[68%]" style={{ animationDelay: `${DELAYS[i]}s` }} />
              <span className="ix-line block h-[3px] rounded-full w-[85%]" style={{ animationDelay: `${DELAYS[i]}s` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Card() {
  return (
    <div className="rounded-2xl border border-white/12 bg-black/35 backdrop-blur-md p-7 w-[560px] max-w-full">
      <div className="mb-8">
        <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-white/40">Indexing on-chain</span>
      </div>
      <div className="mb-8">
        <Chain />
      </div>
      <p className="font-display italic text-white text-[20px] leading-snug">Trace any number back to its block.</p>
    </div>
  );
}

export default function CitePreviewPage() {
  return (
    <main className="min-h-screen bg-[#060607] text-white">
      <style>{`
        @keyframes ix-scan { 0%{left:0;opacity:0} 5%{opacity:1} 94%{opacity:1} 100%{left:${TOTAL_W}px;opacity:0} }
        .ix-scan { left:0; background: linear-gradient(180deg, transparent, ${ACCENT}, transparent); box-shadow: 0 0 18px ${ACCENT}; animation: ix-scan ${DUR}s linear infinite; }
        @keyframes ix-fill { 0%{width:0} 100%{width:${TOTAL_W}px} }
        .ix-fill { width:0; animation: ix-fill ${DUR}s linear infinite; }
        @keyframes ix-blk {
          0%   { border-color:${ACCENT}; box-shadow:0 0 26px rgba(158,123,255,0.55); background:rgba(158,123,255,0.18); transform:scale(1.06); }
          14%  { border-color:rgba(255,255,255,0.14); box-shadow:none; background:rgba(255,255,255,0.03); transform:scale(1); }
          100% { border-color:rgba(255,255,255,0.14); box-shadow:none; background:rgba(255,255,255,0.03); transform:scale(1); }
        }
        .ix-blk { border-color:rgba(255,255,255,0.14); background:rgba(255,255,255,0.03); transform-origin:center; animation: ix-blk ${DUR}s linear infinite; }
        .ix-head { color: rgba(255,255,255,0.5); }
        @keyframes ix-line { 0%{background:${ACCENT}} 14%{background:rgba(255,255,255,0.28)} 100%{background:rgba(255,255,255,0.28)} }
        .ix-line { background: rgba(255,255,255,0.28); animation: ix-line ${DUR}s linear infinite; }
      `}</style>

      <div className="px-6 py-10 max-w-[1280px] mx-auto">
        <div className="font-mono text-[12px] uppercase tracking-[0.22em] text-white/45">Cite · refined Style A · /cite-preview</div>
        <div className="mt-2 text-white/55 text-[13px] max-w-2xl">
          Scanner + progress fill + block lights all on one 3.5s linear timeline. Delays computed from exact block
          centers — scanner and light now hit together. New copy below the chain.
        </div>
      </div>

      <div className="border-b border-white/10">
        <div
          className="relative px-10 py-16 flex items-center gap-12 overflow-hidden min-h-[420px]"
          style={{ background: `radial-gradient(120% 120% at 75% 30%, ${BASE} 0%, #060607 70%)` }}
        >
          <div className="pointer-events-none absolute top-[-20%] right-[10%] w-[480px] h-[480px] rounded-full blur-[120px]" style={{ background: GLOW }} />
          <div className="relative shrink-0">
            <div className="font-medium text-white text-[64px] leading-[0.95] tracking-[-0.04em]">Agentic<br />data</div>
            <div className="font-medium text-[64px] leading-[0.95] tracking-[-0.04em] mt-2" style={{ color: ACCENT }}>cite</div>
          </div>
          <div className="relative">
            <Card />
          </div>
        </div>
      </div>

      <div className="px-6 py-8 max-w-[1280px] mx-auto">
        <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-white/40 mb-3">copy alternatives</div>
        <ul className="text-white/55 text-[14px] flex flex-col gap-1.5">
          <li>· Trace any number back to its block. <span className="text-white/30">(current)</span></li>
          <li>· Verifiable down to the block.</li>
          <li>· Re-runnable from public chain state.</li>
          <li>· No estimates — just blocks you can re-read.</li>
        </ul>
      </div>
    </main>
  );
}
