import type { Metadata } from "next";
import Link from "next/link";

import { ArrowRightIcon } from "@/components/icons/ArrowRightIcon";
import { FooterSection } from "@/components/landing/FooterSection";
import { HeaderSection } from "@/components/landing/HeaderSection";
import { formatEvents, getAgentData } from "@/lib/agent-data";

export const metadata: Metadata = {
  title: "Methodology | agent economy",
  description:
    "How agent economy builds every metric from public on-chain activity — sourced via Dune and direct indexing, traceable and citable.",
};

const PIPELINE = [
  {
    step: "Pull from the chain",
    body: "Agent-payment events are sourced from public on-chain data — through Dune and direct RPC indexing — across every tracked network.",
  },
  {
    step: "Decode & normalize",
    body: "Raw events become one consistent shape — protocol, chain, agent, amount, timestamp — and are deduplicated across sources.",
  },
  {
    step: "Aggregate",
    body: "Totals, daily and monthly series, and market share are computed from those events — not hand-entered or adjusted.",
  },
  {
    step: "Publish",
    body: "Everything lands in a single schema-stable, MCP-native data.json that refreshes continuously. One source, versioned and citable.",
  },
];

const COVERAGE = [
  { name: "x402", what: "HTTP 402 agent payments — settled volume, facilitators, and per-app market share." },
  { name: "ERC-8004", what: "On-chain agent registry — agents registered across every supported chain." },
  { name: "Virtuals ACP", what: "Agent Commerce Protocol — memo throughput between autonomous agents." },
  { name: "Olas", what: "Autonomous agent network — transaction activity across its deployments." },
  { name: "Tempo MPP", what: "Multi-Party Payment channels — opens, settlements, and unique payers/payees." },
  { name: "Base agentic", what: "Agentic activity on Base — consumer vs. infrastructure transaction split." },
];

export default async function MethodologyPage() {
  const data = await getAgentData();
  const events = formatEvents(data.totalEvents);

  return (
    <>
      <HeaderSection />
      <main className="tt-route-page">
        {/* Hero */}
        <section className="tt-route-hero">
          <div>
            <div className="tt-route-kicker">/methodology</div>
            <h1>Methodology</h1>
            <p>Every metric on agent economy is built from public on-chain activity — here&apos;s exactly how.</p>
          </div>
          <Link href="/" className="tt-route-home-link">
            Back to home
            <ArrowRightIcon />
          </Link>
        </section>

        {/* Pipeline */}
        <section className="mt-24 border-t border-white/10 pt-12">
          <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-white/45 mb-3">From block to number</div>
          <p className="font-display italic text-white text-[26px] leading-snug max-w-3xl mb-12">
            Four steps, run continuously — from public chain data to one clean feed.
          </p>
          <ol className="flex flex-col">
            {PIPELINE.map((s, i) => (
              <li
                key={s.step}
                className="grid grid-cols-[auto_1fr] gap-x-6 md:gap-x-10 py-7 border-t border-white/10 first:border-t-0"
              >
                <span className="font-mono text-[13px] text-white/35 tabular-nums pt-1">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="text-white font-medium text-[19px] tracking-tight mb-2">{s.step}</h3>
                  <p className="text-white/55 text-[15px] leading-relaxed max-w-2xl">{s.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* Coverage */}
        <section className="mt-24 border-t border-white/10 pt-12">
          <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-white/45 mb-3">What we track</div>
          <p className="font-display italic text-white text-[26px] leading-snug max-w-3xl mb-3">
            5 standards across 11+ chains — {events}+ on-chain events tracked and counting.
          </p>
          <p className="text-white/55 text-[15px] leading-relaxed max-w-3xl mb-12">
            Coverage is sourced from public on-chain data through Dune and direct indexing. Each protocol below maps
            to specific on-chain events.
          </p>
          <div className="grid gap-x-10 gap-y-9 md:grid-cols-2">
            {COVERAGE.map((c) => (
              <div key={c.name} className="grid grid-cols-[150px_1fr] gap-x-6 items-baseline border-t border-white/10 pt-5">
                <span className="text-white font-medium text-[17px] tracking-tight">{c.name}</span>
                <p className="text-white/55 text-[14px] leading-relaxed">{c.what}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="mt-24 border-t border-white/10 pt-12 flex flex-col items-start gap-6">
          <p className="font-display italic text-white text-[28px] leading-snug max-w-2xl">
            Don&apos;t take our word for it — every number is live, and the raw feed is one request away.
          </p>
          <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
            <a href="https://agenteconomy.to" className="tt-hero-cta">
              Open agenteconomy.to
              <ArrowRightIcon />
            </a>
            <a
              href="https://agenteconomy.to/data.json"
              className="font-mono text-[13px] uppercase tracking-[0.16em] text-white/55 hover:text-white transition"
            >
              View data.json →
            </a>
          </div>
        </section>
      </main>
      <FooterSection />
    </>
  );
}
