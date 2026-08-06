import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ArrowRightIcon } from "@/components/icons/ArrowRightIcon";
import { FooterSection } from "@/components/landing/FooterSection";
import { HeaderSection } from "@/components/landing/HeaderSection";
import { getProtocol, PROTOCOL_SLUGS } from "@/lib/protocol-data";
import { formatAsOf, getProtocolStats } from "@/lib/protocol-stats";
import { safeJsonLd } from "@/lib/seo";

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
  // Lead with the live figure. "x402 | agent economy" told a searcher nothing the
  // result snippet didn't, and measured 0.2–0.4% CTR on the two highest-impression
  // protocol pages while question-titled stat pages hit 9%. The count is the one
  // thing only this site can put in a SERP, and hourly ISR keeps it honest.
  const stats = await getProtocolStats(doc.slug);
  const title = stats?.headline
    ? `${doc.name} — ${stats.headline.value} ${stats.headline.noun} | agent economy`
    : `${doc.name} | agent economy`;

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
    twitter: {
      card: "summary_large_image",
      title,
      description: doc.seoDescription,
      images: ["/og.png"],
      creator: "@realdora_eth",
    },
  };
}

export default async function ProtocolPage({ params }: ProtocolPageProps) {
  const { protocol } = await params;
  const doc = getProtocol(protocol);
  if (!doc) notFound();

  const stats = await getProtocolStats(doc.slug);
  const asOfLabel = stats ? formatAsOf(stats.asOf) : null;
  const siblings = PROTOCOL_SLUGS.filter((slug) => slug !== doc.slug)
    .map((slug) => getProtocol(slug))
    .filter((d): d is NonNullable<typeof d> => Boolean(d));

  const faq = [
    { q: `What is ${doc.name}?`, a: doc.overview },
    ...(stats?.faq ?? []),
    {
      q: "Where do these numbers come from?",
      a: "Every figure is built from public on-chain activity — decoded events and transactions aggregated by the agent economy pipeline and published in data.json, with per-source provenance and freshness stamps. See the methodology page for how each metric is measured.",
    },
  ];

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `https://agenteconomy.to/${doc.slug}#faq`,
    mainEntity: faq.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

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

        {/* Live numbers — server-rendered so the current figures are in the HTML */}
        <section className="mt-24 border-t border-white/10 pt-12">
          <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-white/45 mb-3">
            {doc.name} by the numbers
          </div>
          {stats ? (
            <>
              <p className="text-white/55 text-[15px] leading-relaxed max-w-3xl mb-8">
                Live figures from the agent economy dataset
                {asOfLabel ? (
                  <>
                    , updated as of <time dateTime={stats.asOf ?? undefined}>{asOfLabel}</time> (UTC)
                  </>
                ) : null}
                . Measured from public on-chain activity — see{" "}
                <Link href="/methodology" className="underline decoration-white/30 underline-offset-4 hover:text-white transition">
                  methodology
                </Link>
                .
              </p>
              <table className="w-full max-w-3xl border-collapse text-left">
                <caption className="sr-only">
                  Current {doc.name} on-chain metrics from agenteconomy.to/data.json
                </caption>
                <tbody>
                  {stats.rows.map((row) => (
                    <tr key={row.label} className="border-t border-white/10">
                      <th scope="row" className="py-3.5 pr-6 font-normal text-white/55 text-[15px] align-top">
                        {row.label}
                      </th>
                      <td className="py-3.5 text-white font-medium text-[17px] tabular-nums">
                        {row.value}
                        {row.note ? <span className="ml-3 font-mono text-[11px] text-white/40 font-normal">{row.note}</span> : null}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          ) : (
            <p className="text-white/55 text-[15px] leading-relaxed max-w-3xl">
              The live figures were unavailable at render time — the always-current numbers live in{" "}
              <Link href="/data" className="underline decoration-white/30 underline-offset-4 hover:text-white transition">
                the dataset
              </Link>
              .
            </p>
          )}
          <div className="mt-9 flex flex-wrap items-center gap-x-8 gap-y-4">
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
                      <p key={paragraph} className="text-white/70 text-[17px] leading-relaxed max-w-3xl">
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
                          <p className="text-white/50 text-[14px] leading-relaxed">{item.body}</p>
                        </div>
                      ))}
                    </div>
                  ) : null}
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ — visible Q&A, mirrored in FAQPage JSON-LD */}
        <section className="mt-28 border-t border-white/10 pt-14">
          <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-white/45 mb-10">
            Frequently asked questions
          </div>
          <div className="space-y-10 max-w-3xl">
            {faq.map((item) => (
              <div key={item.q}>
                <h3 className="text-white font-medium text-[18px] tracking-tight mb-3">{item.q}</h3>
                <p className="text-white/60 text-[15.5px] leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Related protocols — lateral links so authority flows between the guides */}
        <section className="mt-28 border-t border-white/10 pt-14 pb-4">
          <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-white/45 mb-10">
            Related protocols
          </div>
          <div className="grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
            {siblings.map((sib) => (
              <Link key={sib.slug} href={`/${sib.slug}`} className="group block border-t border-white/10 pt-4">
                <div className="text-white font-medium text-[16px] tracking-tight mb-2 group-hover:text-[#00FF88] transition">
                  {sib.name}
                </div>
                <p className="text-white/50 text-[13.5px] leading-relaxed">{sib.tagline}</p>
              </Link>
            ))}
          </div>
        </section>
      </main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: safeJsonLd({
            ...doc.jsonLd,
            url: `https://agenteconomy.to/${doc.slug}`,
            name: doc.name,
            description: doc.seoDescription,
            // The page states "updated as of …" in prose; this is the same
            // instant in the form an engine can read without parsing copy.
            ...(stats?.asOf ? { dateModified: stats.asOf } : {}),
          }),
        }}
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(faqJsonLd) }} />
      <FooterSection />
    </>
  );
}
