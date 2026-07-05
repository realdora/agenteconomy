"use client";

import type { CSSProperties } from "react";
import { useEffect, useState } from "react";

import type { AgentData } from "@/lib/agent-data";
import type { HeroSlide } from "@/lib/site-data";

// 3 data cards — track / price / cite. Real agenteconomy.to/data.json values.
// They FILL the original template panel slot (ae-hero-panel-wrap, height:100%) — layout untouched.

const CARD =
  "ae-hero-card-enter relative h-full w-full rounded-[22px] border border-white/12 bg-[#0d0d11] p-5 flex flex-col overflow-hidden";

// Respect the user's motion preference. Read once at module scope is unsafe (SSR),
// so each panel checks on mount. Returns true when reduced motion is requested.
function prefersReducedMotion(): boolean {
  return typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
}

// Premium odometer easing: fast out of the gate, soft settle (expo-out).
function easeOutExpo(t: number): number {
  return t >= 1 ? 1 : 1 - Math.pow(2, -10 * t);
}

export function HeroPanel({ slide, data }: { slide: HeroSlide; data: AgentData }) {
  if (slide.panel.kind === "price") return <PricePanel price={data.price} />;
  if (slide.panel.kind === "cite") return <CitePanel />;
  return <TrackPanel total={data.totalEvents} stream={data.stream} updatedAt={data.updatedAt} />;
}

// ─── TRACK ───
// The latest REAL per-protocol activity rows from data.json (latest daily/weekly
// figure each). These render server-side, so crawlers read true measured values —
// the old version fabricated random event rows client-side, which both hid the
// data from crawlers and violated the project's data-honesty rule.
const TRACK_GREEN = "#00FF88";

function shortDay(day: string): string {
  // "2026-07-04" → "Jul 4"
  const d = new Date(`${day}T00:00:00Z`);
  if (Number.isNaN(d.getTime())) return day;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" });
}

function TrackPanel({ total, stream, updatedAt }: { total: number; stream: AgentData["stream"]; updatedAt: string | null }) {
  // Seeded with the real total so SSR HTML carries the true figure; the count-up
  // is a client-only flourish for humans.
  const [count, setCount] = useState(total);
  useEffect(() => {
    if (prefersReducedMotion()) {
      setCount(total);
      return;
    }
    const dur = 1300;
    const start = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const e = Math.min((t - start) / dur, 1);
      setCount(Math.round(total * easeOutExpo(e)));
      if (e < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [total]);

  const updatedLabel = updatedAt ? shortDay(updatedAt.slice(0, 10)) : null;

  return (
    <div className={CARD}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: TRACK_GREEN }} />
          <span className="text-white font-medium text-[14px]">Tracking live</span>
        </div>
        {updatedLabel ? (
          <span className="font-mono text-[10px] text-white/40 tabular-nums">updated {updatedLabel}</span>
        ) : null}
      </div>

      <div className="ae-track-stream flex-1 mt-4">
        {stream.map((r) => (
          <div key={r.k} className="ae-track-ev">
            <span className="ae-track-pd" style={{ background: r.c }} />
            <span className="ae-track-pn" style={{ color: r.c }}>{r.k}</span>
            <span className="ae-track-ty">{r.metric}</span>
            <span className="ae-track-am">{r.value.toLocaleString("en-US")}</span>
            <span className="ae-track-ag">{shortDay(r.day)}</span>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between border-t border-white/8 pt-2.5 mt-1 font-mono text-[10.5px] text-white/40 tabular-nums">
        <span><span className="text-white/70">{count.toLocaleString("en-US")}</span> events tracked</span>
        <span className="text-white/30">5 protocols · 11 chains</span>
      </div>
    </div>
  );
}

// ─── PRICE ───
// Each facilitator wears its own brand color (Coinbase #0052FF, etc.) so the split is
// legible at a glance. Data carries the colors (lib/agent-data SharePart.color).
function PricePanel({ price }: { price: AgentData["price"] }) {
  // Seeded with the REAL volume so SSR HTML carries the true figure (crawlers must
  // not read "$0.0M"). Server and client first render match; the effect below
  // animates or (reduced motion) re-affirms the final value.
  const [v, setV] = useState(price.volumeM);
  const [grown, setGrown] = useState(false);
  useEffect(() => {
    const reduce = prefersReducedMotion();
    if (reduce) {
      setV(price.volumeM);
      setGrown(true);
      return;
    }
    const dur = 1300;
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min((now - start) / dur, 1);
      setV(price.volumeM * easeOutExpo(t));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    const g = setTimeout(() => setGrown(true), 60);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(g);
    };
  }, [price.volumeM]);
  return (
    <div className={CARD}>
      <div className="font-mono text-[10px] uppercase tracking-[0.14em] text-white/45">Agent payment volume · x402</div>
      <div className="flex-1 flex flex-col justify-center">
        <div className="text-white font-medium text-[46px] leading-none tracking-tight tabular-nums">${v.toFixed(1)}M</div>
        <div className="font-mono text-[11px] text-white/45 mt-2 mb-5">settled · {price.chains} chains · {price.facilitators} facilitators</div>
        <div className="flex h-2.5 rounded-full overflow-hidden mb-3">
          {price.share.map((s, i) => (
            <div
              key={s.label}
              style={{ width: grown ? `${s.pct}%` : "0%", background: s.color, transition: `width 1.1s cubic-bezier(0.22,1,0.36,1) ${i * 0.08}s` }}
            />
          ))}
        </div>
        <div className="flex flex-wrap gap-x-3.5 gap-y-1.5 font-mono text-[10px]">
          {price.share.map((s) => (
            <span key={s.label} className="flex items-center gap-1.5 text-white/60">
              <span className="w-2 h-2 rounded-sm" style={{ background: s.color }} />
              {s.label} {s.pct}%
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── CITE (chain of blocks + synced scanner) ───
// Scan completes one full sweep INSIDE the 3s slide window (was 3.5s → never reached
// the last block before the carousel advanced). 2.6s leaves a beat of settle.
const CITE_BLOCKS = ["x402", "olas", "ACP", "ERC", "tempo"];
const CITE_BLOCK_W = 78;
const CITE_CONN_W = 22;
const CITE_DUR = 2.6;
const CITE_TOTAL_W = CITE_BLOCKS.length * CITE_BLOCK_W + (CITE_BLOCKS.length - 1) * CITE_CONN_W;
const CITE_DELAYS = CITE_BLOCKS.map((_, i) => +(((i * (CITE_BLOCK_W + CITE_CONN_W) + CITE_BLOCK_W / 2) / CITE_TOTAL_W) * CITE_DUR).toFixed(3));

function CitePanel() {
  return (
    <div
      className={`${CARD} ae-cite-card`}
      style={
        {
          // Fluid chain width: full 478px on desktop/tablet, shrinks to fit narrow phones.
          // block + connector derive from total, so the scanner keyframes (which animate to
          // var(--cite-total-w)) and the scale-invariant per-block delays stay perfectly synced.
          "--cite-total-w": `min(${CITE_TOTAL_W}px, calc(100vw - 104px))`,
          "--cite-block-w": `calc(var(--cite-total-w) * ${CITE_BLOCK_W / CITE_TOTAL_W})`,
          "--cite-conn-w": `calc(var(--cite-total-w) * ${CITE_CONN_W / CITE_TOTAL_W})`,
        } as CSSProperties
      }
    >
      <style>{`
        @keyframes ix-scan { 0%{left:0;opacity:0} 5%{opacity:1} 94%{opacity:1} 100%{left:var(--cite-total-w);opacity:0} }
        .ix-scan { left:0; background: linear-gradient(180deg, transparent, #9E7BFF, transparent); box-shadow: 0 0 18px #9E7BFF; animation: ix-scan ${CITE_DUR}s linear infinite; }
        @keyframes ix-fill { 0%{width:0} 100%{width:var(--cite-total-w)} }
        .ix-fill { width:0; background: linear-gradient(90deg, #9E7BFF, rgba(158,123,255,0.4)); animation: ix-fill ${CITE_DUR}s linear infinite; }
        @keyframes ix-blk { 0%{border-color:#9E7BFF;box-shadow:0 0 26px rgba(158,123,255,0.55);background:rgba(158,123,255,0.18);transform:scale(1.06)} 14%{border-color:rgba(255,255,255,0.14);box-shadow:none;background:rgba(255,255,255,0.03);transform:scale(1)} 100%{border-color:rgba(255,255,255,0.14);box-shadow:none;background:rgba(255,255,255,0.03);transform:scale(1)} }
        .ix-blk { border-color:rgba(255,255,255,0.14); background:rgba(255,255,255,0.03); transform-origin:center; animation: ix-blk ${CITE_DUR}s linear infinite; }
        .ix-head { color: rgba(255,255,255,0.5); }
        @keyframes ix-line { 0%{background:#9E7BFF} 14%{background:rgba(255,255,255,0.28)} 100%{background:rgba(255,255,255,0.28)} }
        .ix-line { background: rgba(255,255,255,0.28); animation: ix-line ${CITE_DUR}s linear infinite; }
        @media (prefers-reduced-motion: reduce) {
          .ix-scan { display: none; }
          .ix-fill { width: var(--cite-total-w); animation: none; }
          .ix-blk, .ix-line { animation: none; }
        }
      `}</style>
      <div className="font-mono text-[10px] uppercase tracking-[0.14em] text-white/40">Indexing on-chain</div>
      <div className="flex-1 flex items-center">
        <div className="relative mx-auto" style={{ width: "var(--cite-total-w)" }}>
          <span className="absolute top-1/2 left-0 right-0 h-[2px] -translate-y-1/2" style={{ background: "rgba(255,255,255,0.14)" }} />
          <span className="ix-fill absolute top-1/2 left-0 h-[2px] -translate-y-1/2" />
          <span className="ix-scan absolute top-[-10px] bottom-[-10px] w-[3px] rounded-full" />
          <div className="relative flex items-center" style={{ gap: "var(--cite-conn-w)" }}>
            {CITE_BLOCKS.map((b, i) => (
              <div key={b} className="ix-blk relative rounded-lg border overflow-hidden" style={{ width: "var(--cite-block-w)", animationDelay: `${CITE_DELAYS[i]}s` }}>
                <div className="ix-head px-2 py-1 font-mono text-[9px] uppercase tracking-[0.12em] border-b border-white/10">{b}</div>
                <div className="px-2 py-2 flex flex-col gap-1.5">
                  <span className="ix-line block h-[3px] rounded-full w-full" style={{ animationDelay: `${CITE_DELAYS[i]}s` }} />
                  <span className="ix-line block h-[3px] rounded-full w-[68%]" style={{ animationDelay: `${CITE_DELAYS[i]}s` }} />
                  <span className="ix-line block h-[3px] rounded-full w-[85%]" style={{ animationDelay: `${CITE_DELAYS[i]}s` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <p className="font-display italic text-white text-[17px] leading-snug">Trace any number back to its block.</p>
    </div>
  );
}
