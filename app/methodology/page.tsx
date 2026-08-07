import type { Metadata } from "next";
import Link from "next/link";

import { ArrowRightIcon } from "@/components/icons/ArrowRightIcon";
import { FooterSection } from "@/components/landing/FooterSection";
import { HeaderSection } from "@/components/landing/HeaderSection";
import { DASHBOARD_URL } from "@/lib/site-data";

export const metadata: Metadata = {
  title: "Methodology | agent economy",
  description:
    "How agent economy builds every metric from public on-chain activity — sourced via Dune and direct indexing, traceable and citable.",
  alternates: { canonical: "https://agenteconomy.to/methodology" },
  twitter: {
    card: "summary_large_image",
    title: "Methodology | agent economy",
    description:
      "How agent economy builds every metric from public on-chain activity — sourced via Dune and direct indexing, traceable and citable.",
    creator: "@realdora_eth",
  },
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

export default function MethodologyPage() {
  return (
    <>
      <HeaderSection />
      <main className="ae-route-page">
        {/* Hero */}
        <section className="ae-route-hero">
          <div>
            <div className="ae-route-kicker">/methodology</div>
            <h1>Methodology</h1>
            <p>Every metric on agent economy is built from public on-chain activity — here&apos;s exactly how.</p>
          </div>
          <Link href="/" className="ae-route-home-link">
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

        {/* Coverage — the full per-protocol breakdown lives on /data */}
        <section className="mt-24 border-t border-white/10 pt-12">
          <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-white/45 mb-3">Coverage</div>
          <p className="font-display italic text-white text-[26px] leading-snug max-w-3xl mb-6">
            6 agent-payment standards plus Base activity, across 12+ chains.
          </p>
          <Link
            href="/data"
            className="font-mono text-[13px] uppercase tracking-[0.16em] text-white/55 hover:text-white transition"
          >
            See what&apos;s in the dataset →
          </Link>
        </section>

        {/* CTA */}
        <section className="mt-24 border-t border-white/10 pt-12 flex flex-col items-start gap-6">
          <p className="font-display italic text-white text-[28px] leading-snug max-w-2xl">
            The raw feed behind every figure is public — one request away.
          </p>
          <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
            <a href={DASHBOARD_URL} className="ae-hero-cta">
              Open dashboard
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
