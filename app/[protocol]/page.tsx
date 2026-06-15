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
  const canonical = `https://agenteconomy.to/${doc.slug}`;
  const title = `${doc.name} | agent economy`;

  return {
    title,
    description: doc.seoDescription,
    alternates: {
      canonical,
    },
    openGraph: {
      type: "article",
      url: canonical,
      siteName: "agent economy",
      title,
      description: doc.seoDescription,
      images: [{ url: "/og.png", width: 1200, height: 630, alt: title }],
    },
  };
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

        {/* Long-form protocol guide */}
        <section className="mt-28 border-t border-white/10 pt-14">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,0.78fr)_minmax(0,1.22fr)] lg:gap-16">
            <div className="lg:sticky lg:top-28 lg:self-start">
              <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-white/45 mb-5">Protocol guide</div>
              <h2 className="font-display italic text-white text-[32px] md:text-[44px] leading-[1.08] tracking-tight max-w-md">
                The shape of {doc.name} in the agent economy.
              </h2>
            </div>

            <div className="space-y-14">
              {doc.content.map((section, i) => (
                <article key={section.heading} className="border-t border-white/10 pt-9 first:border-t-0 first:pt-0">
                  <div className="font-mono text-[12px] uppercase tracking-[0.2em] text-[#00FF88] mb-4">
                    {String(i + 1).padStart(2, "0")} / {section.eyebrow}
                  </div>
                  <h3 className="font-display italic text-white text-[28px] md:text-[34px] leading-[1.12] tracking-tight max-w-2xl mb-6">
                    {section.heading}
                  </h3>
                  <div className="space-y-5">
                    {section.body.map((paragraph) => (
                      <p key={paragraph} className="text-white/68 text-[17px] leading-relaxed max-w-3xl">
                        {paragraph}
                      </p>
                    ))}
                  </div>

                  {section.callout ? (
                    <p className="mt-7 border-l border-[#00FF88] pl-5 font-display italic text-white text-[23px] leading-snug max-w-2xl">
                      {section.callout}
                    </p>
                  ) : null}

                  {section.bullets ? (
                    <div className="mt-9 grid gap-4 sm:grid-cols-3">
                      {section.bullets.map((item) => (
                        <div key={item.label} className="border-t border-white/10 pt-4">
                          <h4 className="text-white font-medium text-[15px] tracking-tight mb-2">{item.label}</h4>
                          <p className="text-white/52 text-[14px] leading-relaxed">{item.body}</p>
                        </div>
                      ))}
                    </div>
                  ) : null}
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            ...doc.jsonLd,
            url: `https://agenteconomy.to/${doc.slug}`,
            name: doc.name,
            description: doc.seoDescription,
          }),
        }}
      />
      <FooterSection />
    </>
  );
}
