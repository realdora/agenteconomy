import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ArrowRightIcon } from "@/components/icons/ArrowRightIcon";
import { FooterSection } from "@/components/landing/FooterSection";
import { HeaderSection } from "@/components/landing/HeaderSection";
import { getProtocolView, PROTOCOL_SLUGS } from "@/lib/protocol-data";

type ProtocolPageProps = { params: Promise<{ protocol: string }> };

// Only the known protocols exist; anything else 404s.
export const dynamicParams = false;

export function generateStaticParams() {
  return PROTOCOL_SLUGS.map((protocol) => ({ protocol }));
}

export async function generateMetadata({ params }: ProtocolPageProps): Promise<Metadata> {
  const { protocol } = await params;
  const view = await getProtocolView(protocol);
  if (!view) return {};
  return {
    title: `${view.name} | agent economy`,
    description: `${view.tagline} On-chain activity tracked by agent economy.`,
  };
}

export default async function ProtocolPage({ params }: ProtocolPageProps) {
  const { protocol } = await params;
  const view = await getProtocolView(protocol);
  if (!view) notFound();

  const updated = view.updatedAt
    ? new Date(view.updatedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    : null;

  return (
    <>
      <HeaderSection />
      <main className="tt-route-page">
        {/* Hero */}
        <section className="tt-route-hero">
          <div>
            <div className="tt-route-kicker">/{view.slug}</div>
            <h1>{view.name}</h1>
            <p>{view.tagline}</p>
          </div>
          <Link href="/" className="tt-route-home-link">
            Back to home
            <ArrowRightIcon />
          </Link>
        </section>

        {/* Stats */}
        {view.stats.length > 0 ? (
          <section className="mt-20 border-t border-white/10 pt-12">
            <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-white/45 mb-8">
              On-chain{updated ? ` · updated ${updated}` : ""}
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10">
              {view.stats.map((s) => (
                <div key={s.label}>
                  <div className="text-white font-medium text-[40px] leading-none tracking-tight tabular-nums">{s.value}</div>
                  <div className="font-mono text-[11px] uppercase tracking-[0.16em] text-white/45 mt-3">{s.label}</div>
                </div>
              ))}
            </div>
          </section>
        ) : null}

        {/* Breakdown */}
        {view.breakdown ? (
          <section className="mt-24 border-t border-white/10 pt-12">
            <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-white/45 mb-8">{view.breakdown.title}</div>
            <div className="flex flex-col gap-5 max-w-3xl">
              {view.breakdown.bars.map((b) => (
                <div key={b.label}>
                  <div className="flex items-baseline justify-between mb-2 gap-4">
                    <span className="text-white/80 text-[15px] truncate">{b.label}</span>
                    <span className="text-white/90 font-medium tabular-nums text-[14px] shrink-0">{b.value}</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${b.pct}%`, background: b.color }} />
                  </div>
                </div>
              ))}
              {view.breakdown.moreCount > 0 ? (
                <div className="font-mono text-[12px] text-white/35 mt-1">+{view.breakdown.moreCount} more in data.json</div>
              ) : null}
            </div>
          </section>
        ) : null}

        {/* Source + CTA */}
        <section className="mt-24 border-t border-white/10 pt-12">
          <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-white/45 mb-3">Source</div>
          <p className="text-white/60 text-[16px] leading-relaxed max-w-3xl mb-8">
            Sourced from public on-chain data through Dune and direct indexing. Find this protocol under the{" "}
            <span className="font-mono text-[#00FF88]">{view.dataKey}</span> key in the dataset.
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
              How it&apos;s measured →
            </Link>
          </div>
        </section>
      </main>
      <FooterSection />
    </>
  );
}
