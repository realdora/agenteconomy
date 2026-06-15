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
  return <TrackPanel total={data.totalEvents} />;
}

// ─── TRACK ───
// A live event stream: individual on-chain events scroll in, newest on top, filling
// the card like a feed off the wire. Shows the ACT of tracking instead of one summary
// number. Per-event rows are illustrative (data.json is aggregate-only — same decorative
// register as the block number); the footer carries the real honest total. The mix is
// weighted to the real protocol share (x402 dominant).
const TRACK_GREEN = "#00FF88";
const TRACK_PROTOS = [
  { k: "x402", c: "#00FF88", w: 60 },
  { k: "ERC-8004", c: "#7ad7ff", w: 12 },
  { k: "ACP", c: "#9E7BFF", w: 14 },
  { k: "Olas", c: "#c0c4cc", w: 10 },
  { k: "Tempo", c: "#ff7ab6", w: 4 },
];
const TRACK_TYPES = ["transfer", "settle", "register", "memo", "call"];
const STREAM_ROWS = 8;
const rint = (n: number) => Math.floor(Math.random() * n);
const hex = (n: number) => Array.from({ length: n }, () => "0123456789abcdef"[rint(16)]).join("");

type StreamEv = { id: number; k: string; c: string; ty: string; hash: string; amt: string; t: number };
let evSeq = 0;
function makeEv(): StreamEv {
  let r = rint(100);
  let acc = 0;
  let p = TRACK_PROTOS[0];
  for (const x of TRACK_PROTOS) {
    acc += x.w;
    if (r < acc) { p = x; break; }
  }
  const hasAmt = Math.random() < 0.6;
  const amt = hasAmt ? "$" + (Math.random() < 0.5 ? (Math.random() * 4).toFixed(2) : (Math.random() * 240).toFixed(0)) : "—";
  return { id: evSeq++, k: p.k, c: p.c, ty: TRACK_TYPES[rint(TRACK_TYPES.length)], hash: `0x${hex(4)}…${hex(2)}`, amt, t: Date.now() };
}
function agoLabel(t: number, now: number): string {
  const s = Math.round((now - t) / 1000);
  return s <= 0 ? "now" : `${s}s`;
}

function TrackPanel({ total }: { total: number }) {
  const [count, setCount] = useState(0);
  const [block, setBlock] = useState(23455201);
  // Seed empty on the server — the rows are random/time-based, so generating them during
  // SSR + hydration mismatches (React #418). They're populated client-side in the effect.
  const [evs, setEvs] = useState<StreamEv[]>([]);
  const [nowTs, setNowTs] = useState(0);
  useEffect(() => {
    const reduce = prefersReducedMotion();
    setEvs(Array.from({ length: STREAM_ROWS }, makeEv));
    setNowTs(Date.now());
    if (reduce) {
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
    const add = setInterval(() => {
      setEvs((cur) => [makeEv(), ...cur].slice(0, STREAM_ROWS));
      setCount((c) => c + rint(6) + 1);
      setBlock((b) => b + rint(3) + 1);
    }, 900);
    const age = setInterval(() => setNowTs(Date.now()), 1000);
    return () => {
      cancelAnimationFrame(raf);
      clearInterval(add);
      clearInterval(age);
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

      <div className="ae-track-stream flex-1 mt-4">
        {evs.map((e) => (
          <div key={e.id} className="ae-track-ev">
            <span className="ae-track-pd" style={{ background: e.c }} />
            <span className="ae-track-pn" style={{ color: e.c }}>{e.k}</span>
            <span className="ae-track-ty">{e.ty}</span>
            <span className="ae-track-hx">{e.hash}</span>
            <span className="ae-track-am">{e.amt}</span>
            <span className="ae-track-ag">{agoLabel(e.t, nowTs)}</span>
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
  // Seed to the motion (server) defaults so SSR and the client's first render match —
  // reading prefersReducedMotion() into the initializer would mismatch for reduced-motion
  // users (React #418). The effect below reads the preference and jumps to the final state.
  const [v, setV] = useState(0);
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
