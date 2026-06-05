import type { Metadata } from "next";
import Link from "next/link";

import { ArrowRightIcon } from "@/components/icons/ArrowRightIcon";
import { FooterSection } from "@/components/landing/FooterSection";
import { HeaderSection } from "@/components/landing/HeaderSection";
import { formatEvents, getAgentData } from "@/lib/agent-data";

export const metadata: Metadata = {
  title: "Data | agent economy",
  description:
    "One open dataset for on-chain agentic payments — schema-stable, MCP-native, and free. Everything the site shows, as JSON.",
};

// Top-level shape of agenteconomy.to/data.json.
const SCHEMA = [
  { key: "x402", what: "HTTP 402 payments — settled volume, facilitators, per-app share, monthly & daily series." },
  { key: "olas", what: "Autonomous agent network — total transactions, per-chain breakdown, weekly series." },
  { key: "virtualsAcp", what: "Agent Commerce Protocol — memo throughput between agents, daily." },
  { key: "erc8004Registry", what: "On-chain agent registry — agents registered per chain, daily." },
  { key: "baseAgentic", what: "Agentic activity on Base — consumer vs. infrastructure split, daily." },
  { key: "tempoMpp", what: "Multi-Party Payment channels — events by type, unique payers/payees, daily." },
  { key: "sources", what: "Provenance for every series — where each number is indexed from." },
  { key: "updatedAt", what: "Timestamp of the last refresh." },
];

export default async function DataPage() {
  const data = await getAgentData();
  const events = formatEvents(data.totalEvents);
  const updated = data.updatedAt
    ? new Date(data.updatedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    : null;

  const STATS = [
    { value: `${events}+`, label: "events tracked" },
    { value: "5", label: "standards" },
    { value: "11+", label: "chains" },
    { value: `$${data.price.volumeM}M`, label: "x402 settled" },
  ];

  return (
    <>
      <HeaderSection />
      <main className="tt-route-page">
        {/* Hero */}
        <section className="tt-route-hero">
          <div>
            <div className="tt-route-kicker">/data</div>
            <h1>Data</h1>
            <p>
              One open dataset for on-chain agentic payments — schema-stable, MCP-native, and free. Everything this
              site shows, as JSON.
            </p>
          </div>
          <Link href="/" className="tt-route-home-link">
            Back to home
            <ArrowRightIcon />
          </Link>
        </section>

        {/* Live coverage stats */}
        <section className="mt-20 border-t border-white/10 pt-12">
          <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-white/45 mb-8">
            Coverage{updated ? ` · updated ${updated}` : ""}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10">
            {STATS.map((s) => (
              <div key={s.label}>
                <div className="text-white font-medium text-[40px] leading-none tracking-tight tabular-nums">
                  {s.value}
                </div>
                <div className="font-mono text-[11px] uppercase tracking-[0.16em] text-white/45 mt-3">{s.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Access */}
        <section className="mt-24 border-t border-white/10 pt-12">
          <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-white/45 mb-3">The feed</div>
          <p className="font-display italic text-white text-[26px] leading-snug max-w-3xl mb-8">
            One request. No key, no signup — point an agent at it, or pull it into a sheet.
          </p>
          <div className="rounded-2xl border border-white/10 bg-[#0a0a0e] px-6 py-5 font-mono text-[13px] leading-relaxed overflow-x-auto">
            <span className="text-white/40 select-none">$ </span>
            <span className="text-[#00FF88]">curl</span>{" "}
            <span className="text-white/85">https://agenteconomy.to/data.json</span>
          </div>
          <p className="text-white/55 text-[15px] leading-relaxed max-w-3xl mt-5">
            Served as a single JSON document with permissive CORS, so it works the same from an agent, a browser, or a
            spreadsheet. MCP-native — the same shape an agent reads is the shape you read.
          </p>
        </section>

        {/* What's inside */}
        <section className="mt-24 border-t border-white/10 pt-12">
          <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-white/45 mb-3">What&apos;s inside</div>
          <p className="font-display italic text-white text-[26px] leading-snug max-w-3xl mb-12">
            Eight top-level keys — one per tracked standard, plus provenance and a timestamp.
          </p>
          <div className="flex flex-col">
            {SCHEMA.map((row) => (
              <div
                key={row.key}
                className="grid grid-cols-[1fr] md:grid-cols-[220px_1fr] gap-x-8 gap-y-1.5 py-5 border-t border-white/10 first:border-t-0"
              >
                <span className="font-mono text-[15px] text-[#00FF88]">{row.key}</span>
                <p className="text-white/55 text-[14px] leading-relaxed max-w-2xl">{row.what}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Sources + CTA */}
        <section className="mt-24 border-t border-white/10 pt-12 flex flex-col items-start gap-6">
          <p className="font-display italic text-white text-[26px] leading-snug max-w-2xl">
            Sourced from public on-chain data through Dune and direct indexing — see exactly how it&apos;s built.
          </p>
          <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
            <a href="https://agenteconomy.to/data.json" className="tt-hero-cta">
              GET data.json
              <ArrowRightIcon />
            </a>
            <Link
              href="/methodology"
              className="font-mono text-[13px] uppercase tracking-[0.16em] text-white/55 hover:text-white transition"
            >
              Read the methodology →
            </Link>
          </div>
        </section>
      </main>
      <FooterSection />
    </>
  );
}
