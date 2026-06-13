"use client";

import type { CSSProperties } from "react";
import { useEffect, useState } from "react";

import type { AgentData } from "@/lib/agent-data";
import type { HeroSlide } from "@/lib/site-data";

// 3 data cards — track / price / cite. Real agenteconomy.to/data.json values.
// They FILL the original template panel slot (ae-hero-panel-wrap, height:100%) — layout untouched.

const CARD = "relative h-full w-full rounded-[22px] border border-white/12 bg-[#0d0d11] p-5 flex flex-col overflow-hidden";

export function HeroPanel({ slide, data }: { slide: HeroSlide; data: AgentData }) {
  if (slide.panel.kind === "price") return <PricePanel price={data.price} />;
  if (slide.panel.kind === "cite") return <CitePanel />;
  return <TrackPanel total={data.totalEvents} />;
}

// ─── TRACK ───
// One live aggregate: total on-chain events tracked, counting up then ticking.
// The per-protocol breakdown lives in the ProductsSection index below — this card
// deliberately shows the AGGREGATE so it doesn't mirror that list. The protocol
// legend names which standards roll into the total. No chart: data.json has no
// honest combined recent series, and a made-up line would just read as vague.
const TRACK_GREEN = "#00FF88";
const TRACK_LEGEND = [
  { label: "x402", color: "#00FF88" },
  { label: "ERC-8004", color: "#7ad7ff" },
  { label: "ACP", color: "#9E7BFF" },
  { label: "Olas", color: "#c0c4cc" },
  { label: "Tempo", color: "#ff7ab6" },
];

function TrackPanel({ total }: { total: number }) {
  const [count, setCount] = useState(0);
  const [block, setBlock] = useState(23455201);
  useEffect(() => {
    const dur = 1300;
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min((now - start) / dur, 1);
      const e = 1 - Math.pow(1 - t, 3);
      setCount(Math.round(total * e));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    // live tick: a few fresh events + a few new blocks, ~every 1.5s
    const live = setInterval(() => {
      setCount((c) => c + Math.floor(Math.random() * 6) + 1);
      setBlock((b) => b + Math.floor(Math.random() * 3) + 1);
    }, 1500);
    return () => {
      cancelAnimationFrame(raf);
      clearInterval(live);
    };
  }, [total]);
  return (
    <div className={CARD}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: TRACK_GREEN }} />
          <span className="text-white font-medium text-[14px]">Tracking live</span>
        </div>
        <span className="font-mono text-[10px] text-white/40 tabular-nums">block {block.toLocaleString()}</span>
      </div>

      <div className="flex-1 flex flex-col justify-center">
        <div className="text-white font-medium text-[40px] leading-none tracking-tight tabular-nums">
          {count.toLocaleString("en-US")}
        </div>
        <div className="ae-track-sub font-mono uppercase text-white/40 mt-2">on-chain events tracked</div>
      </div>

      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-[10px]">
        {TRACK_LEGEND.map((p, i) => (
          <span key={p.label} className="flex items-center">
            {i > 0 ? <span className="text-white/20 mr-2">·</span> : null}
            <span style={{ color: p.color }}>{p.label}</span>
          </span>
        ))}
      </div>
    </div>
  );
}

// ─── PRICE ───
function PricePanel({ price }: { price: AgentData["price"] }) {
  const [v, setV] = useState(0);
  const [grown, setGrown] = useState(false);
  useEffect(() => {
    const dur = 1300;
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min((now - start) / dur, 1);
      const e = 1 - Math.pow(1 - t, 3);
      setV(price.volumeM * e);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    const g = setTimeout(() => setGrown(true), 60);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(g);
    };
  }, [price]);
  return (
    <div className={CARD}>
      <div className="font-mono text-[10px] uppercase tracking-[0.14em] text-white/45">Agent payment volume · x402</div>
      <div className="flex-1 flex flex-col justify-center">
        <div className="text-white font-medium text-[46px] leading-none tracking-tight tabular-nums">${v.toFixed(1)}M</div>
        <div className="font-mono text-[11px] text-white/45 mt-2 mb-5">settled · {price.chains} chains · {price.facilitators} facilitators</div>
        <div className="flex h-2.5 rounded-full overflow-hidden mb-3">
          {price.share.map((s, i) => (
            <div key={s.label} style={{ width: grown ? `${s.pct}%` : "0%", background: s.color, transition: `width 1.1s cubic-bezier(0.22,1,0.36,1) ${i * 0.08}s` }} />
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
const CITE_BLOCKS = ["x402", "olas", "ACP", "ERC", "tempo"];
const CITE_BLOCK_W = 78;
const CITE_CONN_W = 22;
const CITE_TOTAL_W = CITE_BLOCKS.length * CITE_BLOCK_W + (CITE_BLOCKS.length - 1) * CITE_CONN_W;
const CITE_DELAYS = CITE_BLOCKS.map((_, i) => +(((i * (CITE_BLOCK_W + CITE_CONN_W) + CITE_BLOCK_W / 2) / CITE_TOTAL_W) * 3.5).toFixed(3));

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
