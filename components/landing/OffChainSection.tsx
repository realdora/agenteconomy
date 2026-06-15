// OffChainSection — the off-chain axis of the agent economy: the dimensions
// measured on-chain flow can't show. One number per concept (Market / Supply /
// Economy / Developers), matching the hero's "named lens" discipline. The full
// breakdowns (token basket, SDK packages, MCP/Masumi) live in the data feed and
// methodology, not crammed in here. Data via lib/web-sources.

import type { WebSourcesData } from "@/lib/web-sources";
import { formatCount, formatUsd } from "@/lib/web-sources";

// Server-safe date label (formatUpdated lives in a "use client" module).
function formatUpdated(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function Lens({ label, value, sub, accent }: { label: string; value: string; sub: string; accent: string }) {
  return (
    <div className="flex flex-col gap-2.5 py-2">
      <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-white/40">{label}</span>
      <span className="font-medium tracking-tight tabular-nums leading-none text-[40px] md:text-[46px]" style={{ color: accent }}>
        {value}
      </span>
      <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-white/35">{sub}</span>
    </div>
  );
}

export function OffChainSection({ data }: { data: WebSourcesData }) {
  const updated = data.updatedAt ? formatUpdated(data.updatedAt) : null;
  const { agentTokens: at, x402Services: svc, virtuals: vir, devAdoption: dev } = data;

  return (
    <section id="off-chain" className="py-16 md:py-24 lg:py-24 border-t border-white/10">
      <div className="w-[1240px] max-w-full mx-auto px-5">
        <div className="flex items-end justify-between gap-6 mb-4">
          <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-white/45">Off-chain signal</span>
          {updated ? (
            <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-white/35 whitespace-nowrap">
              updated {updated}
            </span>
          ) : null}
        </div>
        <h2 className="font-display italic text-white text-[26px] md:text-4xl leading-snug tracking-tight text-balance max-w-3xl mb-12 md:mb-16">
          Measured off-chain.
        </h2>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-10 border-t border-white/10 pt-10">
          <Lens label="Market" value={formatUsd(at.basketMcap)} sub="agent token mcap" accent="#00FF88" />
          <Lens label="Supply" value={formatCount(svc.uniqueProviders)} sub="x402 providers" accent="#7ad7ff" />
          <Lens label="Economy" value={formatUsd(vir.grossAgenticUsd)} sub="Virtuals gross agentic" accent="#9E7BFF" />
          <Lens label="Developers" value={formatCount(dev.totalWeeklyAvg4w)} sub="weekly SDK downloads" accent="#ffffff" />
        </div>

        <p className="text-white/45 text-[13px] leading-relaxed max-w-3xl mt-10 font-display italic">
          Web-sourced from public market, package-registry and ecosystem APIs, refreshed daily.
        </p>
      </div>
    </section>
  );
}
