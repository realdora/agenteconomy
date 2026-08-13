import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ArrowRightIcon } from "@/components/icons/ArrowRightIcon";
import { FooterSection } from "@/components/landing/FooterSection";
import { HeaderSection } from "@/components/landing/HeaderSection";
import { asOfLabel, buildMonthlyReport, isClosedMonth, isValidYm, monthName } from "@/lib/report-data";
import { safeJsonLd } from "@/lib/seo";
import { getStatsContext } from "@/lib/stats-data";

const SITE = "https://agenteconomy.to";

type ReportPageProps = { params: Promise<{ month: string }> };

// Dynamic on purpose: when a new month closes and the pipeline has its data,
// the report route starts existing — no deploy required. Invalid or not-yet-
// closed months 404 below.
export const dynamicParams = true;

export function generateStaticParams() {
  return [{ month: "2026-06" }];
}

export async function generateMetadata({ params }: ReportPageProps): Promise<Metadata> {
  const { month } = await params;
  if (!isValidYm(month)) return {};
  const name = monthName(month);
  const canonical = `${SITE}/reports/${month}`;
  const title = `State of the Agent Economy — ${name} | agent economy`;
  const description = `The ${name} agent economy, measured on-chain: x402 payments, ERC-8004 registrations, ACP commerce and more — with month-over-month changes.`;
  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      type: "article",
      url: canonical,
      siteName: "agent economy",
      title,
      description,
      images: [{ url: "/og.png", width: 1200, height: 630, alt: title }],
    },
    twitter: { card: "summary_large_image", title, description, images: ["/og.png"], creator: "@realdora_eth" },
  };
}

export default async function MonthlyReportPage({ params }: ReportPageProps) {
  const { month } = await params;
  if (!isValidYm(month) || !isClosedMonth(month, new Date())) notFound();

  const ctx = await getStatsContext();
  const report = buildMonthlyReport(month, ctx);
  if (!report) notFound();

  const stamp = asOfLabel(report.asOf);
  const canonical = `${SITE}/reports/${report.ym}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Report",
        "@id": `${canonical}#report`,
        headline: `State of the Agent Economy — ${report.monthName}`,
        url: canonical,
        // Both dates are the month-close instant, not the render time. A closed
        // month's figures are month-bounded and do not move, so claiming a fresh
        // modification on every ISR pass would be the same lie the old
        // render-timestamped datePublished told.
        datePublished: report.publishedAt,
        dateModified: report.publishedAt,
        author: { "@type": "Person", name: "realdora", url: "https://x.com/realdora_eth" },
        publisher: { "@id": `${SITE}/#organization` },
        about: "on-chain AI agent economy activity",
        isBasedOn: `${SITE}/data.json`,
        inLanguage: "en",
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${canonical}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "agent economy", item: `${SITE}/` },
          { "@type": "ListItem", position: 2, name: "Reports", item: `${SITE}/reports` },
          { "@type": "ListItem", position: 3, name: report.monthName, item: canonical },
        ],
      },
    ],
  };

  return (
    <>
      <HeaderSection />
      <main className="ae-route-page ae-report-page">
        <section className="ae-route-hero">
          <div>
            <div className="ae-route-kicker">
              <Link href="/reports" className="hover:text-white transition">/reports</Link>
            </div>
            <h1>State of the Agent Economy — {report.monthName}</h1>
            <p>The month's agent-protocol activity, measured from public chains.</p>
          </div>
          <Link href="/reports" className="ae-route-home-link">
            All reports
            <ArrowRightIcon />
          </Link>
        </section>

        {/* The month in quotable numbers */}
        <section className="mt-16 border-t border-white/10 pt-12">
          <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-white/45 mb-8">
            The month in numbers
          </div>
          <ul className="space-y-5 max-w-3xl list-none">
            {report.metrics.map((m) => (
              <li key={m.label} className="text-white text-[18px] md:text-[20px] leading-relaxed">
                {m.quotable}
                {m.momPct !== null ? (
                  <span className={`ml-3 font-mono text-[12px] ${m.momPct >= 0 ? "text-[#00FF88]" : "text-[#ff7ab6]"}`}>
                    {m.momPct >= 0 ? "+" : ""}
                    {m.momPct}% MoM
                  </span>
                ) : null}
              </li>
            ))}
          </ul>
          {stamp ? (
            <p className="mt-8 font-mono text-[11px] uppercase tracking-[0.22em] text-white/40">
              Data as of <time dateTime={report.asOf ?? undefined}>{stamp}</time> (UTC) · source:{" "}
              <a href="/data.json" className="underline decoration-white/30 underline-offset-4 hover:text-white transition">
                agenteconomy.to/data.json
              </a>
            </p>
          ) : null}
        </section>

        {/* Metric table */}
        <section className="mt-16">
          <table className="w-full max-w-3xl border-collapse text-left">
            <caption className="sr-only">Agent economy metrics for {report.monthName}, with month-over-month change</caption>
            <thead>
              <tr className="border-t border-white/10">
                <th scope="col" className="py-3 pr-6 font-mono text-[10.5px] uppercase tracking-[0.18em] text-white/40 font-normal">Metric</th>
                <th scope="col" className="py-3 pr-6 font-mono text-[10.5px] uppercase tracking-[0.18em] text-white/40 font-normal">{report.monthName}</th>
                <th scope="col" className="py-3 font-mono text-[10.5px] uppercase tracking-[0.18em] text-white/40 font-normal">MoM</th>
              </tr>
            </thead>
            <tbody>
              {report.metrics.map((m) => (
                <tr key={m.label} className="border-t border-white/10">
                  <th scope="row" className="py-3.5 pr-6 font-normal text-white/55 text-[15px] align-top">
                    {m.label}
                    {m.note ? <span className="ml-2 font-mono text-[10.5px] text-white/35">{m.note}</span> : null}
                  </th>
                  <td className="py-3.5 pr-6 text-white font-medium text-[17px] tabular-nums">{m.value}</td>
                  <td className={`py-3.5 font-mono text-[13px] tabular-nums ${m.momPct === null ? "text-white/30" : m.momPct >= 0 ? "text-[#00FF88]" : "text-[#ff7ab6]"}`}>
                    {m.momPct === null ? "—" : `${m.momPct >= 0 ? "+" : ""}${m.momPct}%`}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {report.coverageNotes.length > 0 ? (
            <ul className="mt-6 space-y-1.5 max-w-3xl">
              {report.coverageNotes.map((note) => (
                <li key={note} className="text-white/40 text-[13px] leading-relaxed">
                  ⚠ {note}
                </li>
              ))}
            </ul>
          ) : null}
        </section>

        {/* Method + citation */}
        <section className="mt-20 border-t border-white/10 pt-12 max-w-3xl space-y-14">
          <article>
            <h2 className="font-display italic text-white text-[26px] md:text-[30px] leading-[1.15] tracking-tight mb-6">
              How this report is built
            </h2>
            <div className="space-y-5">
              <p className="text-white/70 text-[16.5px] leading-relaxed">
                Every figure is computed from agent economy&apos;s open dataset at render time — nothing is hand-entered,
                estimated, or sourced from press releases. Monthly totals are sums of the measured daily (or weekly) series
                for each protocol family; month-over-month changes compare against the same measurement of the prior month.
                Units are deliberately not blended: a payment settlement, a registry registration, a commerce memo, and a
                channel event are different acts, reported side by side.
              </p>
              <p className="text-white/70 text-[16.5px] leading-relaxed">
                Anything the pipeline could not fully measure for the month is omitted and flagged rather than estimated. The
                raw feed behind every number is public, free, and CORS-open — recompute anything on this page from{" "}
                <a href="/data.json" className="underline decoration-white/25 underline-offset-4 hover:text-white transition">
                  data.json
                </a>
                , or read the{" "}
                <Link href="/methodology" className="underline decoration-white/25 underline-offset-4 hover:text-white transition">
                  methodology
                </Link>
                .
              </p>
            </div>
          </article>

          <article>
            <h2 className="font-display italic text-white text-[26px] md:text-[30px] leading-[1.15] tracking-tight mb-6">
              Citing this report
            </h2>
            <p className="text-white/70 text-[16.5px] leading-relaxed mb-5">
              Journalists and researchers are welcome to quote any figure with attribution. Suggested form:
            </p>
            <p className="border-l border-[#00FF88] pl-5 font-display italic text-white text-[19px] leading-relaxed">
              &ldquo;…according to agenteconomy.to&apos;s State of the Agent Economy report for {report.monthName}{" "}
              ({canonical}).&rdquo;
            </p>
          </article>
        </section>

        {/* Cross-links */}
        <section className="mt-20 border-t border-white/10 pt-12 pb-4">
          <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-white/45 mb-8">Keep digging</div>
          <div className="grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
            <Link href="/stats" className="group block border-t border-white/10 pt-4">
              <div className="text-white font-medium text-[15.5px] tracking-tight mb-1.5 group-hover:text-[#00FF88] transition">
                Live stats
              </div>
              <p className="text-white/50 text-[13px] leading-relaxed">Dated answers to the sector&apos;s most-asked questions.</p>
            </Link>
            <Link href="/data" className="group block border-t border-white/10 pt-4">
              <div className="text-white font-medium text-[15.5px] tracking-tight mb-1.5 group-hover:text-[#00FF88] transition">
                The open dataset
              </div>
              <p className="text-white/50 text-[13px] leading-relaxed">Everything behind this report, as JSON.</p>
            </Link>
            <Link href="/methodology" className="group block border-t border-white/10 pt-4">
              <div className="text-white font-medium text-[15.5px] tracking-tight mb-1.5 group-hover:text-[#00FF88] transition">
                Methodology
              </div>
              <p className="text-white/50 text-[13px] leading-relaxed">How every metric is measured on-chain.</p>
            </Link>
          </div>
        </section>
      </main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd) }} />
      <FooterSection />
    </>
  );
}
