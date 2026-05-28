"use client";

// HighlightSection — FT-style hero chart with left-to-right reveal animation
// Re-triggers on each scroll-into-view via IntersectionObserver + key bump

import { useEffect, useRef, useState } from "react";

// 30 daily data points (mock) — agentic payment events, in millions
// Day 30 = 173M to match hero claim "173M+ events tracked daily"
const SERIES = [
  22, 26, 25, 30, 32, 36, 40, 39, 44, 49, 53, 56, 57, 62, 67,
  73, 78, 84, 89, 93, 100, 106, 112, 118, 126, 134, 142, 151, 161, 173,
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
  const linePath = points.map((p, i) => (i === 0 ? `M ${p.x},${p.y}` : `L ${p.x},${p.y}`)).join(" ");
  const areaPath =
    `M ${points[0].x},${PAD_T + innerH} ` +
    points.map((p) => `L ${p.x},${p.y}`).join(" ") +
    ` L ${points[points.length - 1].x},${PAD_T + innerH} Z`;
  const lastX = points[points.length - 1].x;
  const lastY = points[points.length - 1].y;
  return { linePath, areaPath, lastX, lastY, max };
}

export function HighlightSection() {
  const { linePath, areaPath, lastX, lastY, max } = buildPath();
  const growthPct = Math.round(((SERIES[SERIES.length - 1] - SERIES[0]) / SERIES[0]) * 100);
  const sectionRef = useRef<HTMLDivElement>(null);
  const [playKey, setPlayKey] = useState(0);
  const wasInViewRef = useRef(false);

  // count-up animation for the +N% number
  const [count, setCount] = useState(0);
  useEffect(() => {
    setCount(0);
    const start = Date.now();
    const dur = 1500;
    const startDelay = 400; // wait briefly before counting begins
    let intervalId: ReturnType<typeof setInterval> | undefined;
    const timeoutId = setTimeout(() => {
      intervalId = setInterval(() => {
        const elapsed = Date.now() - start - startDelay;
        const t = Math.min(elapsed / dur, 1);
        const eased = 1 - Math.pow(1 - t, 3); // ease-out cubic
        setCount(Math.round(growthPct * eased));
        if (t >= 1 && intervalId) clearInterval(intervalId);
      }, 30);
    }, startDelay);
    return () => {
      clearTimeout(timeoutId);
      if (intervalId) clearInterval(intervalId);
    };
  }, [playKey, growthPct]);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !wasInViewRef.current) {
          wasInViewRef.current = true;
          setPlayKey((k) => k + 1);
        } else if (!entry.isIntersecting && wasInViewRef.current) {
          wasInViewRef.current = false;
        }
      },
      { threshold: 0.35 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="py-16 md:py-24 lg:py-32 border-t border-b border-white/10">
      <div className="w-[1240px] max-w-full mx-auto px-5">
        <div className="flex justify-end mb-10">
          <a
            href="/methodology"
            className="font-mono text-[11px] uppercase tracking-[0.18em] text-white/55 hover:text-white transition"
          >
            methodology →
          </a>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 lg:gap-12 mb-12">
          <div className="flex-1">
            <h2 className="font-display italic text-white text-[32px] md:text-[44px] lg:text-[52px] leading-[1.1] tracking-tight max-w-4xl text-balance mb-3">
              Agentic payment volume is pulling away from human-initiated transactions.
            </h2>
            <p className="text-white/55 max-w-3xl text-[15px] leading-relaxed">
              Daily on-chain agent payment events, 30 days.
              <br />
              <br />
              Counts include x402, ERC-8004, Virtuals ACP, Olas, and Tempo MPP. All series reconstructible from
              block tip, ingested in real time.
            </p>
          </div>
          <div className="flex-shrink-0 flex flex-col items-start lg:items-end gap-3 lg:ml-12">
            <div className="font-medium text-[#00FF88] text-[56px] md:text-[72px] lg:text-[88px] leading-none tracking-[-0.02em] tabular-nums">
              +{count}%
            </div>
            <div key={`callout-cap-${playKey}`} className="font-mono text-[11px] uppercase tracking-[0.22em] text-white/45 hc-callout">
              30-day growth
            </div>
          </div>
        </div>

        <div key={`chart-${playKey}`} className="relative w-full rounded-2xl border border-white/10 bg-white/[0.015] overflow-hidden">

          <svg viewBox={`0 0 ${W} ${H}`} width="100%" className="block">
            <defs>
              <linearGradient id="hc-area" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#00FF88" stopOpacity="0.28" />
                <stop offset="100%" stopColor="#00FF88" stopOpacity="0" />
              </linearGradient>
              <clipPath id="hc-clip">
                <rect x="0" y="0" width="0" height={H}>
                  <animate attributeName="width" from="0" to={W} dur="2.4s" begin="0.2s" fill="freeze" calcMode="spline" keySplines="0.22, 1, 0.36, 1" />
                </rect>
              </clipPath>
              <style>{`
                @keyframes hc-dot-pop { 0% { opacity: 0; transform: scale(0); } 80% { transform: scale(1.4); } 100% { opacity: 1; transform: scale(1); } }
                @keyframes hc-callout-in { from { opacity: 0; transform: translateY(-6px); } to { opacity: 1; transform: translateY(0); } }
                .hc-dot-end { opacity: 0; transform-origin: center; transform-box: fill-box; animation: hc-dot-pop 0.5s ease-out 2.4s forwards; }
                .hc-dot-halo { opacity: 0; transform-origin: center; transform-box: fill-box; animation: hc-dot-pop 0.6s ease-out 2.5s forwards; }
                .hc-callout { opacity: 0; animation: hc-callout-in 0.6s ease-out 2.2s forwards; }
              `}</style>
            </defs>

            {/* y-axis gridlines + labels */}
            {[0, 0.25, 0.5, 0.75, 1].map((t) => {
              const y = PAD_T + (H - PAD_T - PAD_B) * (1 - t);
              return (
                <g key={t}>
                  <line x1={PAD_L} y1={y} x2={W - PAD_R} y2={y} stroke="rgba(255,255,255,0.06)" strokeDasharray="2 4" />
                  <text x={PAD_L - 8} y={y + 4} textAnchor="end" fill="rgba(255,255,255,0.35)" fontSize="11" fontFamily="var(--font-geist-mono), monospace">
                    {Math.round(max * t)}M
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

            {/* clipped reveal group — line + area sweep left to right */}
            <g clipPath="url(#hc-clip)">
              <path d={areaPath} fill="url(#hc-area)" />
              <path d={linePath} stroke="#00FF88" strokeWidth="2" fill="none" />
            </g>

            {/* end point dot — pops in after sweep completes */}
            <circle className="hc-dot-halo" cx={lastX} cy={lastY} r="12" fill="#00FF88" opacity="0.18" />
            <circle className="hc-dot-end" cx={lastX} cy={lastY} r="5" fill="#00FF88" />
          </svg>
        </div>

        <p className="text-white/55 text-[14px] leading-relaxed max-w-3xl mt-6 font-display italic">
          Source: agenteconomy.to/data.json
        </p>
      </div>
    </section>
  );
}
