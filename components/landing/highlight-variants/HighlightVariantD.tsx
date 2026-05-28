"use client";

// Variant D — Live rotating ticker headline (one big sentence, cycles every ~4s)
// NYT-front-page rotating-fact vibe with fade transitions

import { useEffect, useState } from "react";

const HEADLINES = [
  {
    text: "Today, agents settled $1.2M across 11 chains.",
    cite: "11 chains · 24h volume",
  },
  {
    text: "x402 just crossed 38,000 events in the last 24 hours.",
    cite: "x402 · 24h count",
  },
  {
    text: "Olas processed 4,153 autonomous coordination events today.",
    cite: "Olas · 24h coord",
  },
  {
    text: "Virtuals ACP is up 43% week-over-week.",
    cite: "Virtuals ACP · 7d Δ",
  },
  {
    text: "Tempo MPP just crossed 1,000 daily transactions for the first time.",
    cite: "Tempo MPP · milestone",
  },
  {
    text: "MetaMask Snaps accounted for 12% of agent-initiated x402 calls today.",
    cite: "x402 · wallet share",
  },
];

const INTERVAL_MS = 4200;

export function HighlightVariantD() {
  const [i, setI] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const id = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setI((prev) => (prev + 1) % HEADLINES.length);
        setVisible(true);
      }, 350);
    }, INTERVAL_MS);
    return () => clearInterval(id);
  }, []);

  const current = HEADLINES[i];

  return (
    <section className="py-16 md:py-24 lg:py-32 border-t border-b border-white/10">
      <div className="w-[1240px] max-w-full mx-auto px-5">
        <div className="flex items-baseline justify-between flex-wrap gap-4 mb-10">
          <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-white/45">
            // Today on agenteconomy
          </div>
          <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-white/45">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00FF88] animate-pulse" />
            live · {String(i + 1).padStart(2, "0")} / {String(HEADLINES.length).padStart(2, "0")}
          </div>
        </div>

        <div className="min-h-[200px] md:min-h-[260px] flex flex-col justify-center">
          <h2
            className={`font-medium text-white text-[40px] md:text-[60px] lg:text-[72px] leading-[1.05] tracking-[-0.025em] text-balance transition-opacity duration-300 ${
              visible ? "opacity-100" : "opacity-0"
            }`}
          >
            {current.text}
          </h2>
          <div
            className={`mt-6 font-mono text-[12px] uppercase tracking-[0.22em] text-white/45 transition-opacity duration-300 ${
              visible ? "opacity-100" : "opacity-0"
            }`}
          >
            source · {current.cite}
          </div>
        </div>

        <div className="flex items-center gap-1.5 mt-12">
          {HEADLINES.map((_, idx) => (
            <span
              key={idx}
              className={`h-[2px] rounded-full transition-all duration-500 ${
                idx === i ? "w-10 bg-[#00FF88]" : "w-4 bg-white/15"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
