import type { Metadata } from "next";
import Link from "next/link";

import { ArrowRightIcon } from "@/components/icons/ArrowRightIcon";
import { FooterSection } from "@/components/landing/FooterSection";
import { HeaderSection } from "@/components/landing/HeaderSection";

export const metadata: Metadata = {
  title: "About | agent economy",
  description:
    "agent economy is the data authority for on-chain agentic payments — a neutral, open, on-chain reference for how autonomous agents move money.",
};

const PRINCIPLES = [
  {
    n: "01",
    title: "Neutral",
    body: "Independent of the protocols we track. No one pays for placement, a higher number, or a kinder chart.",
  },
  {
    n: "02",
    title: "Open by default",
    body: "The whole dataset is public and free — one JSON file, no key, no gate. Take it, cite it, build on it.",
  },
  {
    n: "03",
    title: "One source of truth",
    body: "Agentic payment data is scattered and inconsistent. We put it in one place, measured the same way across every standard.",
  },
];

export default function AboutPage() {
  return (
    <>
      <HeaderSection />
      <main className="ae-route-page">
        {/* Hero */}
        <section className="ae-route-hero">
          <div>
            <div className="ae-route-kicker">/about</div>
            <h1>About</h1>
            <p>
              agent economy is the data authority for on-chain agentic payments — a neutral, open reference for how
              autonomous agents move money on-chain.
            </p>
          </div>
          <Link href="/" className="ae-route-home-link">
            Back to home
            <ArrowRightIcon />
          </Link>
        </section>

        {/* Why */}
        <section className="mt-24 border-t border-white/10 pt-12">
          <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-white/45 mb-3">Why</div>
          <p className="font-display italic text-white text-[28px] leading-snug max-w-3xl mb-6">
            AI agents have started paying each other on-chain. Almost nobody has clean numbers on it.
          </p>
          <p className="text-white/60 text-[16px] leading-relaxed max-w-3xl">
            Inference, data, compute, API calls — agents are increasingly settling these in crypto, directly with one
            another. The activity is real and growing fast, but the numbers behind it are scattered across protocols,
            often self-reported, and hard to compare. agent economy turns that into a single, neutral, on-chain
            reference — measured the same way across every standard, and free for anyone to use.
          </p>
        </section>

        {/* What we stand for */}
        <section className="mt-24 border-t border-white/10 pt-12">
          <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-white/45 mb-10">What we stand for</div>
          <div className="grid gap-x-10 gap-y-12 md:grid-cols-3">
            {PRINCIPLES.map((p) => (
              <div key={p.n}>
                <div className="font-mono text-[13px] text-[#00FF88] mb-4">{p.n}</div>
                <h3 className="text-white font-medium text-[20px] tracking-tight mb-2.5">{p.title}</h3>
                <p className="text-white/55 text-[15px] leading-relaxed">{p.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Built in the open */}
        <section className="mt-24 border-t border-white/10 pt-12">
          <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-white/45 mb-3">Built in the open</div>
          <p className="font-display italic text-white text-[26px] leading-snug max-w-3xl mb-6">
            An independent project — the code and the data are public.
          </p>
          <p className="text-white/60 text-[16px] leading-relaxed max-w-3xl mb-8">
            agent economy is built and maintained by @realdora_eth. Every figure comes from public on-chain activity —
            see exactly how on the methodology page, or pull the raw dataset yourself.
          </p>
          <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
            <Link href="/methodology" className="ae-hero-cta">
              Read the methodology
              <ArrowRightIcon />
            </Link>
            <Link
              href="/data"
              className="font-mono text-[13px] uppercase tracking-[0.16em] text-white/55 hover:text-white transition"
            >
              Browse the data →
            </Link>
          </div>
        </section>

        {/* Connect */}
        <section className="mt-24 border-t border-white/10 pt-12 flex flex-col items-start gap-6">
          <p className="font-display italic text-white text-[26px] leading-snug max-w-2xl">
            Open, free, and one request away — come build on it.
          </p>
          <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
            <a href="https://agenteconomy.to" className="ae-hero-cta">
              Open agenteconomy.to
              <ArrowRightIcon />
            </a>
            <a
              href="https://github.com/realdora/agenteconomy"
              className="font-mono text-[13px] uppercase tracking-[0.16em] text-white/55 hover:text-white transition"
            >
              GitHub →
            </a>
            <a
              href="https://x.com/realdora_eth"
              className="font-mono text-[13px] uppercase tracking-[0.16em] text-white/55 hover:text-white transition"
            >
              X →
            </a>
          </div>
        </section>
      </main>
      <FooterSection />
    </>
  );
}
