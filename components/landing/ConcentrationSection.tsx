// ConcentrationSection — how much of each headline number is one source.
// Server-rendered, no animation: the figures are the content. Each card states
// a total, the share from its largest single source, and what is left without
// it (lib/concentration.ts). Renders nothing when no series can be split.

import Link from "next/link";

import type { CoverageSummary } from "@/lib/coverage-feed";
import { pct, type Concentration } from "@/lib/concentration";

const fmt = (v: number): string => v.toLocaleString("en-US");
const shortDay = (day: string): string =>
  new Date(`${day}T00:00:00Z`).toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" });

function Card({ label, figure, caption, detail }: { label: string; figure: string; caption: string; detail: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.015] p-6 md:p-7 flex flex-col">
      <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/45 mb-6">{label}</div>
      <div className="font-medium text-white text-[44px] md:text-[52px] leading-none tracking-[-0.02em] tabular-nums">{figure}</div>
      <div className="text-white/80 text-[15px] leading-snug mt-3">{caption}</div>
      <div className="text-white/45 text-[13px] leading-relaxed mt-4">{detail}</div>
    </div>
  );
}

export function ConcentrationSection({
  erc,
  x402,
  acp,
}: {
  erc: Concentration | null;
  x402: Concentration | null;
  acp: CoverageSummary["acp"];
}) {
  if (!erc && !x402) return null;
  return (
    <section className="py-16 md:py-24 border-b border-white/10">
      <div className="w-[1240px] max-w-full mx-auto px-5">
        <h2 className="font-display italic text-white text-[32px] md:text-[44px] lg:text-[52px] leading-[1.1] tracking-tight max-w-4xl text-balance mb-3">
          A big number can be one source.
        </h2>
        <p className="text-white/55 max-w-3xl text-[15px] leading-relaxed mb-10">
          Wherever a total can be split, we show how much of it comes from its largest single source, and what is left
          without it. One rule, applied the same way to every series.{" "}
          <Link
            href="/stats/how-concentrated-is-the-agent-economy"
            className="text-white/80 underline decoration-white/30 underline-offset-4 hover:text-white transition"
          >
            How concentrated is the agent economy?
          </Link>
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {erc ? (
            <Card
              label="ERC-8004 registrations"
              figure={pct(erc.share)}
              caption="from one source"
              detail={`${fmt(erc.total)} registered in the 7 days to ${shortDay(erc.to)}; ${fmt(erc.exLargest)} without ${erc.largest}.`}
            />
          ) : null}
          {x402 ? (
            <Card
              label="x402 transactions"
              figure={pct(x402.share)}
              caption="through one facilitator"
              detail={`${fmt(x402.total)} settled in the ${x402.days} days to ${shortDay(x402.to)}; ${fmt(x402.exLargest)} without the largest, ${x402.largest}'s.`}
            />
          ) : null}
          {acp && acp.last7.created > 0 ? (
            <Card
              label="Virtuals ACP jobs"
              figure={pct(acp.last7.completed / acp.last7.created)}
              caption="of jobs completed"
              detail={`${fmt(acp.last7.created)} created in the 7 days to ${shortDay(acp.last7.to)}, between ${fmt(acp.latest.clients)} buyers and ${fmt(acp.latest.providers)} sellers on the latest day. EVM chains only.`}
            />
          ) : null}
        </div>
      </div>
    </section>
  );
}
