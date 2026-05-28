"use client";

// 5 typewriter variants for the "+686%" number
// Each has Replay button + scroll re-trigger

import { useEffect, useState } from "react";

const NUMBER_TARGET = "+686%";
const TARGET_VALUE = 686;

// ─── Variant A — Instant char-by-char (no fade, no cursor) ───
function VariantA({ playKey }: { playKey: number }) {
  return (
    <span key={playKey} className="va-number">
      {NUMBER_TARGET.split("").map((ch, i) => (
        <span key={i} className="va-char" style={{ animationDelay: `${i * 0.13}s` }}>
          {ch}
        </span>
      ))}
      <style>{`
        @keyframes va-instant { to { opacity: 1; } }
        .va-char { opacity: 0; animation: va-instant 0.001s linear forwards; }
      `}</style>
    </span>
  );
}

// ─── Variant B — Smooth fade per-char (200ms fade, 100ms stagger) ───
function VariantB({ playKey }: { playKey: number }) {
  return (
    <span key={playKey} className="vb-number">
      {NUMBER_TARGET.split("").map((ch, i) => (
        <span key={i} className="vb-char" style={{ animationDelay: `${i * 0.1}s` }}>
          {ch}
        </span>
      ))}
      <style>{`
        @keyframes vb-fade { from { opacity: 0; } to { opacity: 1; } }
        .vb-char { opacity: 0; animation: vb-fade 0.22s ease-out forwards; }
      `}</style>
    </span>
  );
}

// ─── Variant C — Number count-up odometer (0 → 686 over 1.5s) ───
function VariantC({ playKey }: { playKey: number }) {
  const [v, setV] = useState(0);
  useEffect(() => {
    setV(0);
    const start = Date.now();
    const dur = 1500;
    const id = setInterval(() => {
      const elapsed = Date.now() - start;
      const t = Math.min(elapsed / dur, 1);
      const eased = 1 - Math.pow(1 - t, 3); // ease-out cubic
      setV(Math.round(TARGET_VALUE * eased));
      if (t >= 1) clearInterval(id);
    }, 30);
    return () => clearInterval(id);
  }, [playKey]);
  return <span className="tabular-nums">+{v}%</span>;
}

// ─── Variant D — Width clip mask sweep left-to-right ───
function VariantD({ playKey }: { playKey: number }) {
  return (
    <span key={playKey} className="vd-wrap inline-block">
      {NUMBER_TARGET}
      <style>{`
        .vd-wrap { animation: vd-clip 1.1s cubic-bezier(0.22, 1, 0.36, 1) forwards; clip-path: inset(0 100% 0 0); }
        @keyframes vd-clip { from { clip-path: inset(0 100% 0 0); } to { clip-path: inset(0 0% 0 0); } }
      `}</style>
    </span>
  );
}

// ─── Variant E — Scramble digits then lock onto target ───
function VariantE({ playKey }: { playKey: number }) {
  const target = NUMBER_TARGET.split(""); // ["+","6","8","6","%"]
  const [chars, setChars] = useState<string[]>(["+", "0", "0", "0", "%"]);
  useEffect(() => {
    setChars(["+", "0", "0", "0", "%"]);
    const isDigit = (i: number) => target[i] >= "0" && target[i] <= "9";
    const lockTimes = target.map((_, i) => (isDigit(i) ? 700 + (i - 1) * 350 : 0)); // each digit locks staggered
    const start = Date.now();
    const id = setInterval(() => {
      const elapsed = Date.now() - start;
      setChars((prev) =>
        prev.map((c, i) => {
          if (!isDigit(i)) return target[i];
          if (elapsed >= lockTimes[i]) return target[i];
          return String(Math.floor(Math.random() * 10));
        }),
      );
      if (elapsed > Math.max(...lockTimes) + 200) clearInterval(id);
    }, 55);
    return () => clearInterval(id);
  }, [playKey]);
  return <span className="tabular-nums">{chars.join("")}</span>;
}

// ─── Preview page ───
const VARIANTS = [
  { id: "A", title: "Instant char-by-char", note: "no fade, no cursor · 130ms stagger · purest typewriter pop", render: (k: number) => <VariantA playKey={k} /> },
  { id: "B", title: "Smooth fade per-char", note: "0.22s fade · 100ms stagger · ChatGPT/Claude streaming style", render: (k: number) => <VariantB playKey={k} /> },
  { id: "C", title: "Number count-up (odometer)", note: "0 → 686 over 1.5s · ease-out cubic · tabular-nums", render: (k: number) => <VariantC playKey={k} /> },
  { id: "D", title: "Width clip mask sweep", note: "left-to-right reveal · 1.1s · single smooth motion", render: (k: number) => <VariantD playKey={k} /> },
  { id: "E", title: "Scramble digits then lock", note: "random digits roll · digits lock left-to-right · hacker board feel", render: (k: number) => <VariantE playKey={k} /> },
];

function VariantSlot({ id, title, note, render }: { id: string; title: string; note: string; render: (k: number) => React.ReactNode }) {
  const [key, setKey] = useState(0);
  return (
    <div className="border-y border-white/10 py-12">
      <div className="w-[1240px] max-w-full mx-auto px-5">
        <div className="flex items-baseline gap-6 mb-8 flex-wrap">
          <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-[#00FF88]">VARIANT {id}</span>
          <span className="font-medium text-white text-base">{title}</span>
          <span className="font-mono text-[11px] text-white/45">{note}</span>
          <button
            onClick={() => setKey((k) => k + 1)}
            className="ml-auto font-mono text-[11px] uppercase tracking-[0.22em] text-white/55 hover:text-white border border-white/15 hover:border-white/40 px-3 py-1.5 rounded-md transition"
          >
            ↻ Replay
          </button>
        </div>
        <div className="font-medium text-[#00FF88] text-[88px] leading-none tracking-[-0.02em] tabular-nums">
          {render(key)}
        </div>
      </div>
    </div>
  );
}

export default function TypewriterPreviewPage() {
  return (
    <main className="min-h-screen bg-[#060607] text-white">
      <div className="px-6 py-10">
        <div className="font-mono text-[12px] uppercase tracking-[0.22em] text-white/45">
          Typewriter variants · /typewriter-preview
        </div>
        <div className="mt-2 text-white/55 text-[13px] max-w-2xl">
          5 ways to reveal the "+686%" number. Click ↻ Replay on any to re-watch. Pick one and tell me.
        </div>
      </div>
      {VARIANTS.map((v) => (
        <VariantSlot key={v.id} {...v} />
      ))}
      <div className="px-6 py-10 font-mono text-[11px] uppercase tracking-[0.22em] text-white/35">
        end · /typewriter-preview · 选 A / B / C / D / E 告诉我
      </div>
    </main>
  );
}
