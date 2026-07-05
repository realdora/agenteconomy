import type { Metadata } from "next";
import Link from "next/link";

import { ArrowRightIcon } from "@/components/icons/ArrowRightIcon";
import { FooterSection } from "@/components/landing/FooterSection";
import { HeaderSection } from "@/components/landing/HeaderSection";
import { getStatsContext, asOfLabel } from "@/lib/stats-data";
import { STAT_DOCS } from "@/lib/stats-registry";

const SITE = "https://agenteconomy.to";

export const metadata: Metadata = {
  title: "Agent economy stats — live answers | agent economy",
  description:
    "Live, dated answers to the agent economy's most-asked questions: x402 transaction counts, on-chain agent census, ERC-8004 registrations — every number measured on-chain and refreshed hourly.",
  alternates: { canonical: `${SITE}/stats` },
  twitter: {
    card: "summary_large_image",
    title: "Agent economy stats — live answers",
    description:
      "Live, dated answers to the agent economy's most-asked questions, every number measured on-chain and refreshed hourly.",
    creator: "@realdora_eth",
  },
};

export default async function StatsHub() {
  const ctx = await getStatsContext();
  const entries = STAT_DOCS.map((doc) => ({ doc, computed: doc.build(ctx) }));

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${SITE}/stats#collection`,
        url: `${SITE}/stats`,
        name: "Agent economy stats",
        description: metadata.description,
        isPartOf: { "@id": `${SITE}/#website` },
        mainEntity: { "@id": `${SITE}/stats#list` },
      },
      {
        "@type": "ItemList",
        "@id": `${SITE}/stats#list`,
        numberOfItems: STAT_DOCS.length,
        itemListElement: STAT_DOCS.map((doc, i) => ({
          "@type": "ListItem",
          position: i + 1,
          url: `${SITE}/stats/${doc.slug}`,
          name: doc.question,
          description: doc.seoDescription,
        })),
      },
    ],
  };

  return (
    <>
      <HeaderSection />
      <main className="ae-route-page">
        <section className="ae-route-hero">
          <div>
            <div className="ae-route-kicker">/stats</div>
            <h1>Stats</h1>
            <p>Live, dated answers to the questions this sector keeps asking — measured on-chain, refreshed hourly.</p>
          </div>
          <Link href="/" className="ae-route-home-link">
            Back to home
            <ArrowRightIcon />
          </Link>
        </section>

        <section className="mt-20 space-y-0">
          {entries.map(({ doc, computed }) => {
            const stamp = computed ? asOfLabel(computed.asOf) : null;
            const headline = computed?.rows?.[0];
            return (
              <Link
                key={doc.slug}
                href={`/stats/${doc.slug}`}
                className="group grid gap-x-10 gap-y-3 md:grid-cols-[minmax(0,1.4fr)_minmax(0,0.6fr)] items-baseline border-t border-white/10 py-8 last:border-b"
              >
                <div>
                  <h2 className="text-white font-medium text-[20px] md:text-[22px] tracking-tight group-hover:text-[#00FF88] transition">
                    {doc.question}
                  </h2>
                  <p className="text-white/50 text-[14px] leading-relaxed mt-2 max-w-xl">{doc.seoDescription}</p>
                </div>
                <div className="md:text-right">
                  {headline ? (
                    <div className="text-white font-medium text-[24px] tabular-nums tracking-tight">{headline.value}</div>
                  ) : null}
                  {stamp ? (
                    <div className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-white/35 mt-1.5">as of {stamp}</div>
                  ) : null}
                </div>
              </Link>
            );
          })}
        </section>

        <section className="mt-16 pb-4">
          <p className="text-white/45 text-[14px] leading-relaxed max-w-2xl">
            Every answer on these pages is computed from the open feeds at render time — nothing is hand-entered. Recompute
            any of them yourself from{" "}
            <a href="/data.json" className="underline decoration-white/25 underline-offset-4 hover:text-white transition">
              data.json
            </a>{" "}
            and{" "}
            <a href="/web-sources.json" className="underline decoration-white/25 underline-offset-4 hover:text-white transition">
              web-sources.json
            </a>
            , or query the{" "}
            <Link href="/data" className="underline decoration-white/25 underline-offset-4 hover:text-white transition">
              MCP endpoint
            </Link>
            .
          </p>
        </section>
      </main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <FooterSection />
    </>
  );
}
