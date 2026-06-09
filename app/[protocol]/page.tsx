import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ArrowRightIcon } from "@/components/icons/ArrowRightIcon";
import { FooterSection } from "@/components/landing/FooterSection";
import { HeaderSection } from "@/components/landing/HeaderSection";
import { getProtocol, PROTOCOL_SLUGS } from "@/lib/protocol-data";

type ProtocolPageProps = { params: Promise<{ protocol: string }> };

// Only the known protocols exist; anything else 404s.
export const dynamicParams = false;

export function generateStaticParams() {
  return PROTOCOL_SLUGS.map((protocol) => ({ protocol }));
}

export async function generateMetadata({ params }: ProtocolPageProps): Promise<Metadata> {
  const { protocol } = await params;
  const doc = getProtocol(protocol);
  if (!doc) return {};
  return { title: `${doc.name} | agent economy`, description: doc.tagline };
}

export default async function ProtocolPage({ params }: ProtocolPageProps) {
  const { protocol } = await params;
  const doc = getProtocol(protocol);
  if (!doc) notFound();

  return (
    <>
      <HeaderSection />
      <main className="ae-route-page">
        {/* Hero */}
        <section className="ae-route-hero">
          <div>
            <div className="ae-route-kicker">/{doc.slug}</div>
            <h1>{doc.name}</h1>
            <p>{doc.tagline}</p>
          </div>
          <Link href="/" className="ae-route-home-link">
            Back to home
            <ArrowRightIcon />
          </Link>
        </section>

        {/* What it is */}
        <section className="mt-24 border-t border-white/10 pt-12">
          <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-white/45 mb-6">What it is</div>
          <p className="text-white/75 text-[18px] leading-relaxed max-w-3xl">{doc.overview}</p>
        </section>

        {/* How it works */}
        <section className="mt-24 border-t border-white/10 pt-12">
          <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-white/45 mb-10">How it works</div>
          <div className="grid gap-x-10 gap-y-12 md:grid-cols-3">
            {doc.points.map((p, i) => (
              <div key={p.label}>
                <div className="font-mono text-[13px] text-[#00FF88] mb-4">{String(i + 1).padStart(2, "0")}</div>
                <h3 className="text-white font-medium text-[18px] tracking-tight mb-2.5">{p.label}</h3>
                <p className="text-white/55 text-[15px] leading-relaxed">{p.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* In agent economy */}
        <section className="mt-24 border-t border-white/10 pt-12">
          <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-white/45 mb-3">In agent economy</div>
          <p className="font-display italic text-white text-[26px] leading-snug max-w-3xl mb-6">
            We track {doc.name} on-chain. The live numbers live in the dataset — dedicated dashboards are on the way.
          </p>
          <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
            <Link href="/data" className="ae-hero-cta">
              Browse the data
              <ArrowRightIcon />
            </Link>
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
