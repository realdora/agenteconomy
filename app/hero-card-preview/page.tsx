"use client";

import { useEffect, useState } from "react";

// Final 3 hero cards — unified 540×340, real data.json values (2026-05-29).
// track = green live tracker (count-up + draw-on) · price = amber $40.6M · cite = violet chain scanner

const PALETTES = {
  track: { accent: "#00FF88", base: "#0a2e22", glow: "rgba(0,255,136,0.16)" },
  price: { accent: "#F5A623", base: "#2b2110", glow: "rgba(245,166,35,0.15)" },
  cite: { accent: "#9E7BFF", base: "#221a40", glow: "rgba(158,123,255,0.16)" },
};

const CARD = "rounded-2xl border border-white/12 bg-black/35 backdrop-blur-md p-7 w-[540px] max-w-full h-[340px] flex flex-col";
const SPARK_W = 110;
const SPARK_H = 26;

function polyPoints(data: number[]) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const step = SPARK_W / (data.length - 1);
  return data.map((v, i) => [i * step, SPARK_H - ((v - min) / range) * SPARK_H] as [number, number]);
}
function polyLen(pts: [number, number][]) {
  let L = 0;
  for (let i = 1; i < pts.length; i++) L += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
  return L;
}

function Spark({ data, color, idx, drawn }: { data: number[]; color: string; idx: number; drawn: boolean }) {
  const pts = polyPoints(data);
  const L = polyLen(pts);
  const d = pts.map((p) => p.join(",")).join(" ");
  const last = pts[pts.length - 1];
  return (
    <svg width={SPARK_W} height={SPARK_H} className="overflow-visible">
      <polyline
        points={d}
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

function TrackCard() {
  const c = PALETTES.track.accent;
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
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: c }} />
          <span className="text-white font-medium text-[15px]">Tracking live</span>
        </div>
        <span className="font-mono text-[11px] text-white/40 tabular-nums">block {block.toLocaleString()}</span>
      </div>
      <div className="font-mono text-[11px] uppercase tracking-[0.16em] text-white/40">6 protocols · 24 chains · from block tip</div>
      <div className="flex-1 flex flex-col justify-center gap-4">
        {TRACK.map((r, i) => (
          <div key={r.proto} className="flex items-center justify-between gap-4">
            <span className="text-white/80 text-[14px] w-28">{r.proto}</span>
            <span className="text-white font-medium tabular-nums text-[15px] w-20 text-right">
              {vals[i].toFixed(1)}
              {r.suffix}
            </span>
            <Spark data={r.spark} color={c} idx={i} drawn={drawn} />
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

function PriceCard() {
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
      <div className="font-mono text-[11px] uppercase tracking-[0.16em] text-white/45">Agent payment volume · x402</div>
      <div className="flex-1 flex flex-col justify-center">
        <div className="text-white font-medium text-[52px] leading-none tracking-tight tabular-nums">${v.toFixed(1)}M</div>
        <div className="font-mono text-[12px] text-white/45 mt-2 mb-6">settled · 7 chains · 18 facilitators</div>
        <div className="flex h-3 rounded-full overflow-hidden mb-4">
          {SHARE.map((s, i) => (
            <div key={s.label} style={{ width: grown ? `${s.pct}%` : "0%", background: s.color, transition: `width 1.1s cubic-bezier(0.22,1,0.36,1) ${i * 0.08}s` }} />
          ))}
        </div>
        <div className="flex flex-wrap gap-x-4 gap-y-2 font-mono text-[11px]">
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
const CV = "#9E7BFF";
const DUR = 3.5;
const BLOCK_W = 82;
const CONN_W = 26;
const BLOCKS = ["x402", "olas", "ACP", "ERC", "tempo"];
const TOTAL_W = BLOCKS.length * BLOCK_W + (BLOCKS.length - 1) * CONN_W;
const DELAYS = BLOCKS.map((_, i) => +(((i * (BLOCK_W + CONN_W) + BLOCK_W / 2) / TOTAL_W) * DUR).toFixed(3));

function CiteCard() {
  return (
    <div className={CARD}>
      <div className="font-mono text-[11px] uppercase tracking-[0.16em] text-white/40">Indexing on-chain</div>
      <div className="my-auto">
        <div className="relative mx-auto" style={{ width: TOTAL_W }}>
          <span className="absolute top-1/2 left-0 right-0 h-[2px] -translate-y-1/2" style={{ background: "rgba(255,255,255,0.14)" }} />
          <span className="ix-fill absolute top-1/2 left-0 h-[2px] -translate-y-1/2" style={{ background: `linear-gradient(90deg, ${CV}, rgba(158,123,255,0.4))` }} />
          <span className="ix-scan absolute top-[-10px] bottom-[-10px] w-[3px] rounded-full" />
          <div className="relative flex items-center" style={{ gap: CONN_W }}>
            {BLOCKS.map((b, i) => (
              <div key={b} className="ix-blk relative rounded-lg border overflow-hidden" style={{ width: BLOCK_W, animationDelay: `${DELAYS[i]}s` }}>
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
      </div>
      <p className="font-display italic text-white text-[20px] leading-snug">Trace any number back to its block.</p>
    </div>
  );
}

function Slide({ word, scheme, card, texture }: { word: string; scheme: { accent: string; base: string; glow: string }; card: React.ReactNode; texture: "grid" | "sheen" | "rain" }) {
  return (
    <div className="border-b border-white/10">
      <div className="px-6 py-3 flex items-baseline gap-4 bg-black/40">
        <span className="font-mono text-[11px] uppercase tracking-[0.22em]" style={{ color: scheme.accent }}>made to {word}</span>
        <span className="font-mono text-[11px] text-white/40">scheme: {scheme.accent}</span>
      </div>
      <div className="relative px-10 py-16 flex items-center gap-12 overflow-hidden min-h-[460px]" style={{ background: `radial-gradient(120% 120% at 75% 30%, ${scheme.base} 0%, #060607 70%)` }}>
        <div className="pointer-events-none absolute top-[-20%] right-[10%] w-[480px] h-[480px] rounded-full blur-[120px]" style={{ background: scheme.glow }} />
        {texture === "grid" && <div className="pointer-events-none absolute inset-0 opacity-[0.06]" style={{ backgroundImage: "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)", backgroundSize: "44px 44px" }} />}
        {texture === "sheen" && <div className="pointer-events-none absolute inset-0 opacity-[0.10]" style={{ background: `linear-gradient(115deg, transparent 30%, ${scheme.accent} 50%, transparent 70%)` }} />}
        {texture === "rain" && <div className="pointer-events-none absolute inset-0 opacity-[0.05] font-mono text-[10px] leading-5 whitespace-pre-wrap break-all -rotate-12 scale-150" aria-hidden="true">{"0xdf1c26ee54465efdc29822e950118e212340 ".repeat(60)}</div>}
        <div className="relative shrink-0">
          <div className="font-medium text-white text-[64px] leading-[0.95] tracking-[-0.04em]">Agentic<br />data</div>
          <div className="font-medium text-[64px] leading-[0.95] tracking-[-0.04em] mt-2" style={{ color: scheme.accent }}>{word}</div>
        </div>
        <div className="relative">{card}</div>
      </div>
    </div>
  );
}

export default function HeroCardPreviewPage() {
  return (
    <main className="min-h-screen bg-[#060607] text-white">
      <style>{`
        @keyframes ix-scan { 0%{left:0;opacity:0} 5%{opacity:1} 94%{opacity:1} 100%{left:${TOTAL_W}px;opacity:0} }
        .ix-scan { left:0; background: linear-gradient(180deg, transparent, ${CV}, transparent); box-shadow: 0 0 18px ${CV}; animation: ix-scan ${DUR}s linear infinite; }
        @keyframes ix-fill { 0%{width:0} 100%{width:${TOTAL_W}px} }
        .ix-fill { width:0; animation: ix-fill ${DUR}s linear infinite; }
        @keyframes ix-blk { 0%{border-color:${CV};box-shadow:0 0 26px rgba(158,123,255,0.55);background:rgba(158,123,255,0.18);transform:scale(1.06)} 14%{border-color:rgba(255,255,255,0.14);box-shadow:none;background:rgba(255,255,255,0.03);transform:scale(1)} 100%{border-color:rgba(255,255,255,0.14);box-shadow:none;background:rgba(255,255,255,0.03);transform:scale(1)} }
        .ix-blk { border-color:rgba(255,255,255,0.14); background:rgba(255,255,255,0.03); transform-origin:center; animation: ix-blk ${DUR}s linear infinite; }
        .ix-head { color: rgba(255,255,255,0.5); }
        @keyframes ix-line { 0%{background:${CV}} 14%{background:rgba(255,255,255,0.28)} 100%{background:rgba(255,255,255,0.28)} }
        .ix-line { background: rgba(255,255,255,0.28); animation: ix-line ${DUR}s linear infinite; }
      `}</style>

      <div className="px-6 py-10 max-w-[1280px] mx-auto">
        <div className="font-mono text-[12px] uppercase tracking-[0.22em] text-white/45">Hero cards · final 3 · unified 540×340 · /hero-card-preview</div>
        <div className="mt-2 text-white/55 text-[13px] max-w-2xl">track: count-up + draw-on sparklines + live tick · price: count-up + bar grow · cite: chain scanner. Reload to replay load animations.</div>
      </div>
      <Slide word="track" scheme={PALETTES.track} card={<TrackCard />} texture="grid" />
      <Slide word="price" scheme={PALETTES.price} card={<PriceCard />} texture="sheen" />
      <Slide word="cite" scheme={PALETTES.cite} card={<CiteCard />} texture="rain" />
      <div className="px-6 py-10 font-mono text-[11px] uppercase tracking-[0.22em] text-white/35">end · 看细节</div>
    </main>
  );
}
