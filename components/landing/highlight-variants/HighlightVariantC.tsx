// Variant C — FT-style hero chart (1 big chart + editorial caption)
// Animation: chart area path "draws in" via dasharray on mount (CSS animation)

// 30 daily data points, agentic payment volume growth (mock)
const SERIES = [
  120, 145, 138, 162, 178, 195, 220, 215, 240, 268, 290, 305, 312, 340, 365,
  398, 425, 460, 488, 510, 545, 580, 612, 645, 690, 735, 780, 825, 880, 950,
];

const W = 1180;
const H = 360;
const PAD_L = 40;
const PAD_R = 20;
const PAD_T = 40;
const PAD_B = 50;

function buildPath() {
  const max = Math.max(...SERIES);
  const min = 0;
  const range = max - min || 1;
  const innerW = W - PAD_L - PAD_R;
  const innerH = H - PAD_T - PAD_B;
  const step = innerW / (SERIES.length - 1);
  const points = SERIES.map((v, i) => {
    const x = PAD_L + i * step;
    const y = PAD_T + innerH - ((v - min) / range) * innerH;
    return { x, y };
  });
  const linePath = points
    .map((p, i) => (i === 0 ? `M ${p.x},${p.y}` : `L ${p.x},${p.y}`))
    .join(" ");
  const areaPath =
    `M ${points[0].x},${PAD_T + innerH} ` +
    points.map((p) => `L ${p.x},${p.y}`).join(" ") +
    ` L ${points[points.length - 1].x},${PAD_T + innerH} Z`;
  const lastX = points[points.length - 1].x;
  const lastY = points[points.length - 1].y;
  return { linePath, areaPath, lastX, lastY, max };
}

export function HighlightVariantC() {
  const { linePath, areaPath, lastX, lastY, max } = buildPath();

  return (
    <section className="py-16 md:py-24 lg:py-32 border-t border-b border-white/10">
      <div className="w-[1240px] max-w-full mx-auto px-5">
        <div className="flex items-baseline justify-between flex-wrap gap-4 mb-10">
          <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-white/45">
            // Today on agenteconomy
          </div>
          <a href="/methodology" className="font-mono text-[11px] uppercase tracking-[0.18em] text-white/55 hover:text-white transition">
            methodology →
          </a>
        </div>
        <h2 className="font-display italic text-white text-[32px] md:text-[44px] lg:text-[52px] leading-[1.1] tracking-tight max-w-4xl text-balance mb-3">
          Agentic payment volume is pulling away from human-initiated transactions.
        </h2>
        <p className="text-white/55 max-w-3xl text-[15px] leading-relaxed mb-12">
          Daily on-chain agent payment events, 30 days. Counts include x402, ERC-8004, Virtuals ACP, Olas, and
          Tempo MPP. All series reconstructible from block tip, ingested in real time.
        </p>

        <div className="w-full rounded-2xl border border-white/10 bg-white/[0.015] overflow-hidden">
          <svg viewBox={`0 0 ${W} ${H}`} width="100%" className="block">
            <defs>
              <linearGradient id="hc-area" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#00FF88" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#00FF88" stopOpacity="0" />
              </linearGradient>
              <style>{`
                @keyframes hc-draw { from { stroke-dashoffset: 4000; } to { stroke-dashoffset: 0; } }
                @keyframes hc-fade { from { opacity: 0; } to { opacity: 1; } }
                .hc-line { stroke-dasharray: 4000; stroke-dashoffset: 4000; animation: hc-draw 2s ease-out forwards; }
                .hc-area-anim { opacity: 0; animation: hc-fade 1.4s ease-out 0.6s forwards; }
                .hc-dot { opacity: 0; animation: hc-fade 0.4s ease-out 1.9s forwards; }
              `}</style>
            </defs>

            {/* y-axis gridlines */}
            {[0, 0.25, 0.5, 0.75, 1].map((t) => {
              const y = PAD_T + (H - PAD_T - PAD_B) * (1 - t);
              return (
                <g key={t}>
                  <line x1={PAD_L} y1={y} x2={W - PAD_R} y2={y} stroke="rgba(255,255,255,0.06)" strokeDasharray="2 4" />
                  <text x={PAD_L - 8} y={y + 4} textAnchor="end" fill="rgba(255,255,255,0.35)" fontSize="11" fontFamily="var(--font-geist-mono), monospace">
                    {Math.round(max * t).toLocaleString()}
                  </text>
                </g>
              );
            })}

            {/* x-axis labels */}
            <text x={PAD_L} y={H - PAD_B + 24} fill="rgba(255,255,255,0.35)" fontSize="11" fontFamily="var(--font-geist-mono), monospace">
              30 days ago
            </text>
            <text x={W - PAD_R} y={H - PAD_B + 24} textAnchor="end" fill="rgba(255,255,255,0.35)" fontSize="11" fontFamily="var(--font-geist-mono), monospace">
              today
            </text>

            {/* area fill */}
            <path className="hc-area-anim" d={areaPath} fill="url(#hc-area)" />

            {/* line */}
            <path className="hc-line" d={linePath} stroke="#00FF88" strokeWidth="2" fill="none" />

            {/* last point dot */}
            <circle className="hc-dot" cx={lastX} cy={lastY} r="5" fill="#00FF88" />
            <circle className="hc-dot" cx={lastX} cy={lastY} r="11" fill="#00FF88" opacity="0.18" />
          </svg>
        </div>

        <p className="text-white/55 text-[14px] leading-relaxed max-w-3xl mt-6 font-display italic">
          Source: agenteconomy.to/data.json — indexed from public chain state across 11+ chains. Updated continuously.
        </p>
      </div>
    </section>
  );
}
