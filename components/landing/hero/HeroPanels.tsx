"use client";

import type { CSSProperties } from "react";
import { useEffect, useState } from "react";

import type { HeroSlide } from "@/lib/site-data";

// 3 data cards — track / price / cite. Real agenteconomy.to/data.json values.
// They FILL the original TT panel slot (tt-hero-panel-wrap, height:100%) — TT layout untouched.

const CARD = "relative h-full w-full rounded-[22px] border border-white/12 bg-[#0d0d11] p-5 flex flex-col overflow-hidden";

export function HeroPanel({ slide }: { slide: HeroSlide }) {
  if (slide.panel.kind === "price") return <PricePanel />;
  if (slide.panel.kind === "cite") return <CitePanel />;
  return <TrackPanel />;
}

// ─── sparkline (draw-on) ───
const SPARK_W = 96;
const SPARK_H = 22;
function sparkPoints(data: number[]) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const step = SPARK_W / (data.length - 1);
  return data.map((v, i) => [i * step, SPARK_H - ((v - min) / range) * SPARK_H] as [number, number]);
}
function Spark({ data, color, idx, drawn }: { data: number[]; color: string; idx: number; drawn: boolean }) {
  const pts = sparkPoints(data);
  let L = 0;
  for (let i = 1; i < pts.length; i++) L += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
  const last = pts[pts.length - 1];
  return (
    <svg width={SPARK_W} height={SPARK_H} className="overflow-visible">
      <polyline
        points={pts.map((p) => p.join(",")).join(" ")}
        fill="none"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ strokeDasharray: L, strokeDashoffset: drawn ? 0 : L, transition: `stroke-dashoffset 1.3s ease-out ${idx * 0.15}s` }}
      />
      <circle cx={last[0]} cy={last[1]} r={2} fill={color} style={{ opacity: drawn ? 1 : 0, transition: `opacity 0.3s ease-out ${idx * 0.15 + 1.2}s` }} />
    </svg>
  );
}

// ─── TRACK ───
const TRACK = [
  { proto: "x402", target: 148.6, suffix: "M", spark: [86, 93, 99, 99, 100, 99, 97, 98, 99] },
  { proto: "Olas", target: 16.4, suffix: "M", spark: [28, 26, 44, 47, 56, 100, 64, 47, 54] },
  { proto: "Virtuals ACP", target: 12.3, suffix: "M", spark: [69, 71, 62, 100, 87, 27, 23, 21, 24] },
  { proto: "ERC-8004", target: 216.7, suffix: "K", spark: [83, 100, 94, 84, 64, 70, 97, 94, 78] },
];
const TRACK_GREEN = "#00FF88";

function TrackPanel() {
  const [vals, setVals] = useState(TRACK.map(() => 0));
  const [block, setBlock] = useState(23455201);
  const [drawn, setDrawn] = useState(false);
  useEffect(() => {
    const dur = 1300;
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min((now - start) / dur, 1);
      const e = 1 - Math.pow(1 - t, 3);
      setVals(TRACK.map((r) => r.target * e));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    const drawT = setTimeout(() => setDrawn(true), 60);
    const live = setInterval(() => {
      setVals((prev) => prev.map((v, i) => v + Math.random() * (i === 0 ? 0.4 : i < 3 ? 0.08 : 0.02)));
      setBlock((b) => b + Math.floor(Math.random() * 3) + 1);
    }, 2500);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(drawT);
      clearInterval(live);
    };
  }, []);
  return (
    <div className={CARD}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: TRACK_GREEN }} />
          <span className="text-white font-medium text-[14px]">Tracking live</span>
        </div>
        <span className="font-mono text-[10px] text-white/40 tabular-nums">block {block.toLocaleString()}</span>
      </div>
      <div className="tt-track-sub font-mono uppercase text-white/40 mt-0.5">6 protocols · 24 chains · from block tip</div>
      <div className="flex-1 flex flex-col justify-center gap-2.5">
        {TRACK.map((r, i) => (
          <div key={r.proto} className="flex items-center justify-between gap-3">
            <span className="text-white/80 text-[13px] w-24">{r.proto}</span>
            <span className="text-white font-medium tabular-nums text-[14px] w-16 text-right">
              {vals[i].toFixed(1)}
              {r.suffix}
            </span>
            <Spark data={r.spark} color={TRACK_GREEN} idx={i} drawn={drawn} />
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── PRICE ───
const SHARE = [
  { label: "Coinbase", pct: 29.4, color: "#0052FF" },
  { label: "Dexter", pct: 22.2, color: "#6366F1" },
  { label: "PayAI", pct: 20.4, color: "#10B981" },
  { label: "DayDreams", pct: 8, color: "#F59E0B" },
  { label: "Other", pct: 20, color: "#8a8f98" },
];
function PricePanel() {
  const [v, setV] = useState(0);
  const [grown, setGrown] = useState(false);
  useEffect(() => {
    const dur = 1300;
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min((now - start) / dur, 1);
      const e = 1 - Math.pow(1 - t, 3);
      setV(40.6 * e);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    const g = setTimeout(() => setGrown(true), 60);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(g);
    };
  }, []);
  return (
    <div className={CARD}>
      <div className="font-mono text-[10px] uppercase tracking-[0.14em] text-white/45">Agent payment volume · x402</div>
      <div className="flex-1 flex flex-col justify-center">
        <div className="text-white font-medium text-[46px] leading-none tracking-tight tabular-nums">${v.toFixed(1)}M</div>
        <div className="font-mono text-[11px] text-white/45 mt-2 mb-5">settled · 7 chains · 18 facilitators</div>
        <div className="flex h-2.5 rounded-full overflow-hidden mb-3">
          {SHARE.map((s, i) => (
            <div key={s.label} style={{ width: grown ? `${s.pct}%` : "0%", background: s.color, transition: `width 1.1s cubic-bezier(0.22,1,0.36,1) ${i * 0.08}s` }} />
          ))}
        </div>
        <div className="flex flex-wrap gap-x-3.5 gap-y-1.5 font-mono text-[10px]">
          {SHARE.map((s) => (
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
const CITE_BLOCKS = ["x402", "olas", "ACP", "ERC", "tempo"];
const CITE_BLOCK_W = 78;
const CITE_CONN_W = 22;
const CITE_TOTAL_W = CITE_BLOCKS.length * CITE_BLOCK_W + (CITE_BLOCKS.length - 1) * CITE_CONN_W;
const CITE_DELAYS = CITE_BLOCKS.map((_, i) => +(((i * (CITE_BLOCK_W + CITE_CONN_W) + CITE_BLOCK_W / 2) / CITE_TOTAL_W) * 3.5).toFixed(3));

function CitePanel() {
  return (
    <div
      className={`${CARD} tt-cite-card`}
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
        .ix-scan { left:0; background: linear-gradient(180deg, transparent, #9E7BFF, transparent); box-shadow: 0 0 18px #9E7BFF; animation: ix-scan 3.5s linear infinite; }
        @keyframes ix-fill { 0%{width:0} 100%{width:var(--cite-total-w)} }
        .ix-fill { width:0; background: linear-gradient(90deg, #9E7BFF, rgba(158,123,255,0.4)); animation: ix-fill 3.5s linear infinite; }
        @keyframes ix-blk { 0%{border-color:#9E7BFF;box-shadow:0 0 26px rgba(158,123,255,0.55);background:rgba(158,123,255,0.18);transform:scale(1.06)} 14%{border-color:rgba(255,255,255,0.14);box-shadow:none;background:rgba(255,255,255,0.03);transform:scale(1)} 100%{border-color:rgba(255,255,255,0.14);box-shadow:none;background:rgba(255,255,255,0.03);transform:scale(1)} }
        .ix-blk { border-color:rgba(255,255,255,0.14); background:rgba(255,255,255,0.03); transform-origin:center; animation: ix-blk 3.5s linear infinite; }
        .ix-head { color: rgba(255,255,255,0.5); }
        @keyframes ix-line { 0%{background:#9E7BFF} 14%{background:rgba(255,255,255,0.28)} 100%{background:rgba(255,255,255,0.28)} }
        .ix-line { background: rgba(255,255,255,0.28); animation: ix-line 3.5s linear infinite; }
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
