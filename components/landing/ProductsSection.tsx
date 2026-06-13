"use client";

// ProductsSection — the protocol index. Five tracked standards as an editorial
// ledger: numbered rows with the real headline total and the real activity series
// per protocol (data.json values via lib/protocol-index). Rows stagger in and the
// sparklines draw on scroll-into-view; everything links to its protocol page.

import { useEffect, useState } from "react";

import type { ProtocolIndexData, ProtocolRow } from "@/lib/protocol-index";
import { formatMetric } from "@/lib/protocol-index";

import { formatUpdated, useInViewReplay } from "./PlatformTerminal";

const SPARK_W = 200;
const SPARK_H = 40;
const SPARK_PAD = 3;

// Plot the cumulative trajectory, not the per-period rate. A running sum is
// monotonic, so every protocol's line rises — honestly: a decelerating protocol
// (ACP, Tempo) shows as a curve that flattens, never one that crashes downward.
function cumulative(data: number[]): number[] {
  let sum = 0;
  return data.map((v) => (sum += v));
}

function sparkPoints(data: number[]) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const step = SPARK_W / (data.length - 1);
  return data.map(
    (v, i) =>
      [i * step, SPARK_PAD + (SPARK_H - SPARK_PAD * 2) * (1 - (v - min) / range)] as [number, number],
  );
}

function Spark({ data, color, idx, drawn }: { data: number[]; color: string; idx: number; drawn: boolean }) {
  const pts = sparkPoints(cumulative(data));
  let len = 0;
  for (let i = 1; i < pts.length; i++) len += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
  const last = pts[pts.length - 1];
  return (
    <svg viewBox={`0 0 ${SPARK_W} ${SPARK_H}`} height={SPARK_H} preserveAspectRatio="none" className="overflow-visible block w-full">
      <polyline
        points={pts.map((p) => p.join(",")).join(" ")}
        fill="none"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{
          strokeDasharray: len,
          strokeDashoffset: drawn ? 0 : len,
          transition: `stroke-dashoffset 1.4s ease-out ${0.25 + idx * 0.12}s`,
        }}
      />
      <circle
        cx={last[0]}
        cy={last[1]}
        r={2.5}
        fill={color}
        style={{ opacity: drawn ? 1 : 0, transition: `opacity 0.3s ease-out ${1.55 + idx * 0.12}s` }}
      />
    </svg>
  );
}

function ProtocolMark({ row }: { row: ProtocolRow }) {
  return (
    <span className="ae-pi-mark flex items-center justify-center bg-white rounded-[11px] w-11 h-11 shrink-0 overflow-hidden">
      {row.logo ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={row.logo} alt="" className="w-7 h-7 object-contain" />
      ) : (
        <span className="font-mono font-semibold text-[16px] text-[#15151a]">{row.name.charAt(0)}</span>
      )}
    </span>
  );
}

function LedgerRow({ row, idx, drawn }: { row: ProtocolRow; idx: number; drawn: boolean }) {
  return (
    <a
      href={row.href}
      className="ae-pi-row group relative border-t border-white/10 last:border-b hover:bg-white/[0.02] transition-colors"
      style={{ animationDelay: `${idx * 0.09}s` }}
    >
      {/* protocol-colored rule, revealed on hover */}
      <span
        className="absolute left-0 top-0 bottom-0 w-[2px] opacity-0 group-hover:opacity-100 transition-opacity"
        style={{ background: row.color }}
      />

      <span className="ae-pi-idx font-mono text-[12px] tabular-nums text-white/30 group-hover:text-white/60 transition-colors">
        {String(idx + 1).padStart(2, "0")}
      </span>

      <span className="ae-pi-head flex items-center gap-4 min-w-0">
        <ProtocolMark row={row} />
        <span className="min-w-0">
          <span className="block text-white font-medium text-[17px] leading-tight tracking-tight">{row.name}</span>
          <span className="block text-white/50 text-[13px] leading-snug mt-1">{row.desc}</span>
        </span>
      </span>

      <span className="ae-pi-spark flex flex-col gap-1.5">
        <Spark data={row.spark} color={row.color} idx={idx} drawn={drawn} />
        <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-white/30">{row.sparkUnit}</span>
      </span>

      <span className="ae-pi-metric flex flex-col items-end gap-1">
        <span className="text-white font-medium text-[26px] leading-none tracking-tight tabular-nums">
          {formatMetric(row.metric)}
        </span>
        <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-white/40 text-right whitespace-nowrap">
          {row.unit}
        </span>
        {row.extra ? (
          <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-white/25 text-right whitespace-nowrap">
            {row.extra}
          </span>
        ) : null}
      </span>

      <span className="ae-pi-arrow flex justify-end text-white/30 group-hover:text-white group-hover:translate-x-1 transition">
        <svg width="16" height="16" viewBox="0 0 256 256" fill="currentColor">
          <path d="M221.66,133.66l-72,72a8,8,0,0,1-11.32-11.32L196.69,136H40a8,8,0,0,1,0-16H196.69L138.34,61.66a8,8,0,0,1,11.32-11.32l72,72A8,8,0,0,1,221.66,133.66Z" />
        </svg>
      </span>
    </a>
  );
}

export function ProductsSection({ data }: { data: ProtocolIndexData }) {
  const { ref, playKey } = useInViewReplay<HTMLDivElement>();
  const [drawn, setDrawn] = useState(false);
  const updated = data.updatedAt ? formatUpdated(data.updatedAt) : null;

  useEffect(() => {
    setDrawn(false);
    const t = setTimeout(() => setDrawn(true), 60);
    return () => clearTimeout(t);
  }, [playKey]);

  return (
    <section id="protocols" className="py-16 md:py-24 lg:py-32 border-t border-white/10">
      <div className="w-[1240px] max-w-full mx-auto px-5">
        <div className="flex items-end justify-between gap-6 mb-4">
          <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-white/45">Protocol index</span>
          {updated ? (
            <span className="ae-pi-updated font-mono text-[11px] uppercase tracking-[0.18em] text-white/35 whitespace-nowrap">
              updated {updated}
            </span>
          ) : null}
        </div>
        <h2 className="font-display italic text-white text-[26px] md:text-4xl leading-snug tracking-tight text-balance max-w-3xl mb-10 md:mb-14">
          Five standards, measured on-chain.
        </h2>

        <div key={playKey} ref={ref} className="flex flex-col">
          {data.rows.map((row, i) => (
            <LedgerRow key={row.slug} row={row} idx={i} drawn={drawn} />
          ))}
        </div>

        <p className="text-white/55 text-[14px] leading-relaxed max-w-3xl mt-6 font-display italic">
          Plus Base agentic-ecosystem activity ({formatMetric(data.baseAgenticTxs)} transactions) — tracked as
          ecosystem context in the daily feed below, not as a standard. Source: agenteconomy.to/data.json.
        </p>
      </div>
    </section>
  );
}
