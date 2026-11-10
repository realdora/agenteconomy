"use client";

// HighlightSection — x402 month by month.
// Plots complete-month transaction counts as bars (real data.json values) next
// to the cumulative total. An earlier version plotted the cumulative curve under
// an "emerged as the standard" headline; a running total rises by construction,
// so that chart read as momentum while monthly activity sat far below its
// late-2025 peak. The bars show the shape as it is, and the copy states the
// latest month, the average payment and the peak. Re-triggers its entrance on
// each scroll-into-view via IntersectionObserver.

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import type { AgentData, MonthPoint } from "@/lib/agent-data";

const W = 1180;
const H = 360;
const PAD_L = 44;
const PAD_R = 20;
const PAD_T = 40;
const PAD_B = 50;
const INNER_W = W - PAD_L - PAD_R;
const INNER_H = H - PAD_T - PAD_B;

function formatUpdated(iso: string | null): string | null {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

const MONTHS: Record<string, string> = {
  Jan: "January", Feb: "February", Mar: "March", Apr: "April", May: "May", Jun: "June",
  Jul: "July", Aug: "August", Sep: "September", Oct: "October", Nov: "November", Dec: "December",
};
// "Oct 26" → "October 2026". The feed's short label reads like a day of the month in prose.
function longMonth(label: string): string {
  const [m, yy] = label.split(" ");
  return MONTHS[m] && /^\d\d$/.test(yy ?? "") ? `${MONTHS[m]} 20${yy}` : label;
}
function millions(n: number): string {
  return n >= 1e6 ? `${(n / 1e6).toFixed(1)}M` : Math.round(n).toLocaleString("en-US");
}
function dollars(n: number): string {
  if (n >= 1e6) return `$${(n / 1e6).toFixed(1)}M`;
  if (n >= 1e3) return `$${Math.round(n / 1e3).toLocaleString("en-US")}K`;
  return `$${Math.round(n).toLocaleString("en-US")}`;
}
function averagePayment(m: MonthPoint): string {
  if (!m.txs) return "—";
  const avg = m.vol / m.txs;
  return avg < 0.01 ? "under $0.01" : `about $${avg.toFixed(2)}`;
}

export function HighlightSection({ data }: { data: AgentData }) {
  const { bars, last, peak, totalM } = data.highlight;
  const total = Math.round(totalM);
  const updated = formatUpdated(data.updatedAt);
  const max = Math.max(...bars.map((b) => b.txsM), 1);
  const slot = INNER_W / Math.max(bars.length, 1);
  const barW = Math.min(slot * 0.62, 64);
  const atPeak = last.month === peak.month;

  const sectionRef = useRef<HTMLDivElement>(null);
  const [playKey, setPlayKey] = useState(0);
  const wasInViewRef = useRef(false);

  // Count-up toward the cumulative total. Seeded with the REAL total so the
  // server-rendered HTML carries the true figure (crawlers and AI engines never
  // run the animation — they must not read "0M").
  const [count, setCount] = useState(total);
  useEffect(() => {
    if (playKey === 0) return;
    setCount(0);
    const start = Date.now();
    const dur = 1500;
    const startDelay = 400;
    let intervalId: ReturnType<typeof setInterval> | undefined;
    const timeoutId = setTimeout(() => {
      intervalId = setInterval(() => {
        const t = Math.min((Date.now() - start - startDelay) / dur, 1);
        setCount(Math.round(total * (1 - Math.pow(1 - t, 3))));
        if (t >= 1 && intervalId) clearInterval(intervalId);
      }, 30);
    }, startDelay);
    return () => {
      clearTimeout(timeoutId);
      if (intervalId) clearInterval(intervalId);
    };
  }, [playKey, total]);

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
    <section ref={sectionRef} className="py-16 md:py-24 lg:py-24 border-t border-b border-white/10">
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
              x402 is the busiest agent-payment rail we measure.
            </h2>
            <p className="text-white/55 max-w-3xl text-[15px] leading-relaxed">
              In {longMonth(last.month)} it settled {millions(last.txs)} transactions moving {dollars(last.vol)} —{" "}
              {averagePayment(last)} per payment.{" "}
              {atPeak
                ? "That is its busiest month on record."
                : `Its busiest month was ${longMonth(peak.month)}, at ${millions(peak.txs)}.`}{" "}
              <Link
                href="/stats/is-x402-growing"
                className="text-white/80 underline decoration-white/30 underline-offset-4 hover:text-white transition"
              >
                Is x402 growing?
              </Link>
            </p>
            <p className="text-white/40 text-[13px] leading-relaxed mt-4">
              Complete months only; the month in progress is left out. Sourced from public on-chain data
              {updated ? `, updated ${updated}` : ""}.
            </p>
          </div>
          <div className="flex-shrink-0 flex flex-col items-start lg:items-end gap-3 lg:ml-12">
            <div className="font-medium text-[#00FF88] text-[56px] md:text-[72px] lg:text-[88px] leading-none tracking-[-0.02em] tabular-nums">
              {count}M
            </div>
            <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-white/45">
              x402 transactions · cumulative
            </div>
          </div>
        </div>

        <div key={`chart-${playKey}`} className="relative w-full rounded-2xl border border-white/10 bg-white/[0.015] overflow-hidden">
          <svg viewBox={`0 0 ${W} ${H}`} width="100%" className="block" role="img" aria-label="x402 transactions per month, complete months">
            <defs>
              <style>{`
                @keyframes hc-bar-rise { from { transform: scaleY(0); } to { transform: scaleY(1); } }
                .hc-bar { transform-origin: bottom; transform-box: fill-box; animation: hc-bar-rise 0.7s cubic-bezier(0.22, 1, 0.36, 1) both; }
                @media (prefers-reduced-motion: reduce) { .hc-bar { animation: none; } }
                /* The SVG scales with the viewport, so 11px axis text shrinks to ~3px on a phone.
                   There: enlarge the month labels, keep only the first, peak and latest, and drop
                   the y-axis text (the peak value is stated in the copy above). */
                @media (max-width: 640px) {
                  .hc-lab { font-size: 30px; }
                  .hc-lab-mid, .hc-lab-y { display: none; }
                }
              `}</style>
            </defs>

            {/* y-axis gridlines + labels */}
            {[0, 0.25, 0.5, 0.75, 1].map((t) => {
              const y = PAD_T + INNER_H * (1 - t);
              return (
                <g key={t}>
                  <line x1={PAD_L} y1={y} x2={W - PAD_R} y2={y} stroke="rgba(255,255,255,0.06)" strokeDasharray="2 4" />
                  <text className="hc-lab-y" x={PAD_L - 8} y={y + 4} textAnchor="end" fill="rgba(255,255,255,0.35)" fontSize="11" fontFamily="var(--font-geist-mono), monospace">
                    {Math.round(max * t)}M
                  </text>
                </g>
              );
            })}

            {bars.map((b, i) => {
              const h = Math.max((b.txsM / max) * INNER_H, 2);
              const x = PAD_L + i * slot + (slot - barW) / 2;
              const isLast = i === bars.length - 1;
              return (
                <g key={b.month}>
                  <rect
                    className="hc-bar"
                    style={{ animationDelay: `${0.2 + i * 0.05}s` }}
                    x={x}
                    y={PAD_T + INNER_H - h}
                    width={barW}
                    height={h}
                    rx="2"
                    fill="#00FF88"
                    opacity={isLast ? 1 : 0.45}
                  />
                  <text
                    className={`hc-lab ${i === 0 || isLast || b.month === peak.month ? "" : "hc-lab-mid"}`}
                    x={x + barW / 2}
                    y={H - PAD_B + 24}
                    textAnchor="middle"
                    fill={isLast ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.35)"}
                    fontSize="11"
                    fontFamily="var(--font-geist-mono), monospace"
                  >
                    {b.month}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* The chart is SVG-only; this table carries the same series as crawlable text. */}
        {/* sr-only on a wrapper, not the table: a table ignores the 1px width and widened the page on phones */}
        <div className="sr-only">
        <table>
          <caption>x402 transactions per complete month, in millions{updated ? `, updated ${updated}` : ""}</caption>
          <thead>
            <tr>
              <th scope="col">Month</th>
              <th scope="col">x402 transactions (millions)</th>
            </tr>
          </thead>
          <tbody>
            {bars.map((b) => (
              <tr key={b.month}>
                <td>{b.month}</td>
                <td>{b.txsM}M</td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>

        <p className="text-white/55 text-[14px] leading-relaxed max-w-3xl mt-6 font-display italic">
          Source: agenteconomy.to/data.json{updated ? ` · updated ${updated}` : ""}
        </p>
      </div>
    </section>
  );
}
