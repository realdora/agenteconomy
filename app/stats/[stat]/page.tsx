import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ArrowRightIcon } from "@/components/icons/ArrowRightIcon";
import { FooterSection } from "@/components/landing/FooterSection";
import { HeaderSection } from "@/components/landing/HeaderSection";
import { StatChart } from "@/components/stats/StatChart";
import { getProtocol } from "@/lib/protocol-data";
import { safeJsonLd } from "@/lib/seo";
import { getStatsContext, asOfLabel } from "@/lib/stats-data";
import { availableStatDocs, getStatDoc, isStatDocAvailable } from "@/lib/stats-registry";

const SITE = "https://agenteconomy.to";

type StatPageProps = { params: Promise<{ stat: string }> };

// Dynamic on purpose (same pattern as /reports/[month]): a gated page
// materializes the moment its feed lands, no deploy required. generateStaticParams
// prebuilds only the currently-available pages; the runtime isStatDocAvailable →
// notFound() guard in the page is the authoritative gate for everything else.
export const dynamicParams = true;

export async function generateStaticParams() {
  // Prebuild the pages whose feed is already present. Gated docs (awaiting a
  // not-yet-present feed) are omitted here and materialize on first request once
  // their feed lands — the runtime availability guard 404s them until then.
  const ctx = await getStatsContext();
  return availableStatDocs(ctx).map((doc) => ({ stat: doc.slug }));
}

export async function generateMetadata({ params }: StatPageProps): Promise<Metadata> {
  const { stat } = await params;
  const doc = getStatDoc(stat);
  if (!doc) return {};
  const canonical = `${SITE}/stats/${doc.slug}`;
  const title = `${doc.question} | agent economy`;
  return {
    title,
    description: doc.seoDescription,
    alternates: { canonical },
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

export default async function StatPage({ params }: StatPageProps) {
  const { stat } = await params;
  const doc = getStatDoc(stat);
  if (!doc) notFound();

  const ctx = await getStatsContext();
  if (!isStatDocAvailable(doc, ctx)) notFound();
  const computed = doc.build(ctx);
  const stamp = computed ? asOfLabel(computed.asOf) : null;
  const protocol = doc.protocolSlug ? getProtocol(doc.protocolSlug) : null;
  const related = doc.related
    .map((slug) => getStatDoc(slug))
    .filter((d): d is NonNullable<typeof d> => Boolean(d))
    // Never link to a gated slug whose feed has not landed — its page 404s.
    .filter((d) => isStatDocAvailable(d, ctx));

  const faq = [
    { q: doc.question, a: computed?.answer ?? doc.seoDescription },
    ...(computed?.extraFaq ?? []),
    {
      q: "Where does this number come from?",
      a: "It is computed at page-render time from agent economy's open feeds (data.json and web-sources.json), which aggregate public on-chain activity with per-source provenance. The feeds are free, CORS-open, and documented in the OpenAPI contract at agenteconomy.to/openapi.json.",
    },
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "FAQPage",
        "@id": `${SITE}/stats/${doc.slug}#faq`,
        mainEntity: faq.map((item) => ({
          "@type": "Question",
          name: item.q,
          acceptedAnswer: { "@type": "Answer", text: item.a },
        })),
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${SITE}/stats/${doc.slug}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "agent economy", item: `${SITE}/` },
          { "@type": "ListItem", position: 2, name: "Stats", item: `${SITE}/stats` },
          { "@type": "ListItem", position: 3, name: doc.shortTitle, item: `${SITE}/stats/${doc.slug}` },
        ],
      },
    ],
  };

  return (
    <>
      <HeaderSection />
      <main className="ae-route-page">
        {/* Hero: the question, then the answer — number first. */}
        <section className="ae-route-hero">
          <div>
            <div className="ae-route-kicker">
              <Link href="/stats" className="hover:text-white transition">/stats</Link>
            </div>
            <h1>{doc.question}</h1>
          </div>
          <Link href="/stats" className="ae-route-home-link">
            All stats
            <ArrowRightIcon />
          </Link>
        </section>

        <section className="mt-16 border-t border-white/10 pt-12">
          {computed ? (
            <>
              <p className="text-white text-[22px] md:text-[26px] leading-relaxed max-w-4xl font-medium">
                {computed.answer}
              </p>
              {stamp ? (
                <p className="mt-5 font-mono text-[11px] uppercase tracking-[0.22em] text-white/40">
                  Updated as of <time dateTime={computed.asOf ?? undefined}>{stamp}</time> (UTC) · source:{" "}
                  <a href="/data.json" className="underline decoration-white/30 underline-offset-4 hover:text-white transition">
                    agenteconomy.to/data.json
                  </a>
                </p>
              ) : null}
            </>
          ) : (
            <p className="text-white/60 text-[17px] leading-relaxed max-w-3xl">
              The live figure was unavailable at render time. The always-current value is in{" "}
              <Link href="/data" className="underline decoration-white/30 underline-offset-4 hover:text-white transition">
                the open dataset
              </Link>
              .
            </p>
          )}
        </section>

        {computed && computed.rows.length > 0 ? (
          <section className="mt-16">
            <table className="w-full max-w-3xl border-collapse text-left">
              <caption className="sr-only">{doc.shortTitle} — key figures</caption>
              <tbody>
                {computed.rows.map((row) => (
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
          </section>
        ) : null}

        {computed?.chart ? <StatChart chart={computed.chart} /> : null}

        {/* Context + methodology prose */}
        <section className="mt-20 space-y-14 max-w-3xl">
          {doc.sections.map((section) => (
            <article key={section.heading} className="border-t border-white/10 pt-9">
              <h2 className="font-display italic text-white text-[26px] md:text-[30px] leading-[1.15] tracking-tight mb-6">
                {section.heading}
              </h2>
              <div className="space-y-5">
                {section.body.map((paragraph) => (
                  <p key={paragraph} className="text-white/70 text-[16.5px] leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>
            </article>
          ))}
        </section>

        {/* Extra FAQ (visible mirror of the JSON-LD beyond the headline answer) */}
        {computed?.extraFaq?.length ? (
          <section className="mt-20 border-t border-white/10 pt-12 max-w-3xl">
            <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-white/45 mb-8">Also asked</div>
            <div className="space-y-8">
              {computed.extraFaq.map((item) => (
                <div key={item.q}>
                  <h3 className="text-white font-medium text-[17px] tracking-tight mb-2.5">{item.q}</h3>
                  <p className="text-white/60 text-[15.5px] leading-relaxed">{item.a}</p>
                </div>
              ))}
            </div>
          </section>
        ) : null}

        {/* Sources */}
        <section className="mt-20 border-t border-white/10 pt-12 max-w-3xl">
          <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-white/45 mb-6">Sources</div>
          <ul className="space-y-2.5">
            {doc.sources.map((s) => (
              <li key={s.url}>
                <a
                  href={s.url}
                  target={s.url.startsWith(SITE) || s.url.startsWith("/") ? undefined : "_blank"}
                  rel={s.url.startsWith(SITE) || s.url.startsWith("/") ? undefined : "noreferrer noopener"}
                  className="text-white/60 text-[14.5px] underline decoration-white/25 underline-offset-4 hover:text-white transition"
                >
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </section>

        {/* Related */}
        <section className="mt-20 border-t border-white/10 pt-12 pb-4">
          <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-white/45 mb-8">Keep digging</div>
          <div className="grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((r) => (
              <Link key={r.slug} href={`/stats/${r.slug}`} className="group block border-t border-white/10 pt-4">
                <div className="text-white font-medium text-[15.5px] tracking-tight mb-1.5 group-hover:text-[#00FF88] transition">
                  {r.question}
                </div>
                <p className="text-white/50 text-[13px] leading-relaxed">{r.shortTitle}</p>
              </Link>
            ))}
            {protocol ? (
              <Link href={`/${protocol.slug}`} className="group block border-t border-white/10 pt-4">
                <div className="text-white font-medium text-[15.5px] tracking-tight mb-1.5 group-hover:text-[#00FF88] transition">
                  {protocol.name} protocol guide
                </div>
                <p className="text-white/50 text-[13px] leading-relaxed">{protocol.tagline}</p>
              </Link>
            ) : null}
          </div>
        </section>
      </main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd) }} />
      <FooterSection />
    </>
  );
}
