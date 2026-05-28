"use client";

// Variant B — 5 protocol cards with mini sparkline + delta vs 7d
// Animation: sparkline draws on mount, count subtle ticks every few seconds

import { useEffect, useState } from "react";

type Card = {
  protocol: string;
  chip: string;
  startCount: number;
  delta: string;
  deltaPositive: boolean;
  series: number[]; // 0-100 normalized
  href: string;
};

const CARDS: Card[] = [
  {
    protocol: "x402",
    chip: "HTTP 402 payments",
    startCount: 38244,
    delta: "+12%",
    deltaPositive: true,
    series: [22, 28, 31, 35, 30, 38, 44, 47, 54, 58, 67, 71],
    href: "/x402",
  },
  {
    protocol: "ERC-8004",
    chip: "agent-to-agent tx",
    startCount: 12907,
    delta: "+8%",
    deltaPositive: true,
    series: [15, 18, 22, 24, 28, 31, 30, 34, 37, 41, 44, 48],
    href: "/erc-8004",
  },
  {
    protocol: "Virtuals ACP",
    chip: "Agent Commerce",
    startCount: 7281,
    delta: "+43%",
    deltaPositive: true,
    series: [5, 8, 12, 14, 18, 23, 28, 34, 41, 52, 64, 78],
    href: "/virtuals-acp",
  },
  {
    protocol: "Olas",
    chip: "autonomous coord.",
    startCount: 4153,
    delta: "-2%",
    deltaPositive: false,
    series: [50, 48, 52, 47, 45, 49, 51, 46, 44, 42, 43, 41],
    href: "/olas",
  },
  {
    protocol: "Tempo MPP",
    chip: "multi-party payment",
    startCount: 1024,
    delta: "new",
    deltaPositive: true,
    series: [0, 0, 0, 0, 0, 4, 12, 28, 47, 68, 84, 95],
    href: "/tempo-mpp",
  },
];

function Sparkline({ series, positive }: { series: number[]; positive: boolean }) {
  const w = 140;
  const h = 36;
  const max = Math.max(...series);
  const min = Math.min(...series);
  const range = max - min || 1;
  const step = w / (series.length - 1);
  const points = series.map((v, i) => `${i * step},${h - ((v - min) / range) * h}`).join(" ");
  const color = positive ? "#00FF88" : "#ff6b6b";
  return (
    <svg width={w} height={h} className="overflow-visible">
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx={(series.length - 1) * step} cy={h - ((series[series.length - 1] - min) / range) * h} r="2.5" fill={color} />
    </svg>
  );
}

export function HighlightVariantB() {
  const [counts, setCounts] = useState(CARDS.map((c) => c.startCount));
  useEffect(() => {
    const id = setInterval(() => {
      setCounts((prev) => prev.map((c, i) => c + Math.floor(Math.random() * 3) + (i === 0 ? 1 : 0)));
    }, 2500);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="py-16 md:py-24 lg:py-32 border-t border-b border-white/10">
      <div className="w-[1240px] max-w-full mx-auto px-5">
        <div className="flex items-baseline justify-between flex-wrap gap-4 mb-10">
          <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-white/45">
            // Today on agenteconomy
          </div>
          <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-white/35">
            24h · vs prior 7d trend
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {CARDS.map((card, i) => (
            <a
              key={card.protocol}
              href={card.href}
              className="border border-white/10 rounded-xl p-5 hover:bg-white/[0.02] transition flex flex-col gap-4"
            >
              <div className="flex items-baseline justify-between">
                <div className="font-medium text-white text-[15px]">{card.protocol}</div>
                <div className={`font-mono text-[12px] ${card.deltaPositive ? "text-[#00FF88]" : "text-[#ff6b6b]"}`}>
                  {card.delta}
                </div>
              </div>
              <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-white/40">{card.chip}</div>
              <div className="font-medium text-white text-[28px] md:text-[32px] tabular-nums tracking-tight">
                {counts[i].toLocaleString()}
              </div>
              <Sparkline series={card.series} positive={card.deltaPositive} />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
