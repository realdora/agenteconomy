import type { Metadata } from "next";
import Link from "next/link";

import { ArrowRightIcon } from "@/components/icons/ArrowRightIcon";
import { FooterSection } from "@/components/landing/FooterSection";
import { HeaderSection } from "@/components/landing/HeaderSection";
import { buildMonthlyReport, isClosedMonth, monthName } from "@/lib/report-data";
import { getStatsContext } from "@/lib/stats-data";

const SITE = "https://agenteconomy.to";
const FIRST_REPORT_YM = "2026-06";

export const metadata: Metadata = {
  title: "State of the Agent Economy — monthly reports | agent economy",
  description:
    "A monthly, on-chain-measured report on the agent economy: x402 payments, agent registrations, agent-to-agent commerce, and machine-payment activity — free to cite with attribution.",
  alternates: { canonical: `${SITE}/reports` },
  twitter: {
    card: "summary_large_image",
    title: "State of the Agent Economy — monthly reports",
    description: "A monthly, on-chain-measured report on the agent economy. Free to cite with attribution.",
    creator: "@realdora_eth",
  },
};

function monthsSince(firstYm: string, now: Date): string[] {
  const out: string[] = [];
  const [fy, fm] = firstYm.split("-").map(Number);
  const cursor = new Date(Date.UTC(fy, fm - 1, 1));
  while (isClosedMonth(`${cursor.getUTCFullYear()}-${String(cursor.getUTCMonth() + 1).padStart(2, "0")}`, now)) {
    out.push(`${cursor.getUTCFullYear()}-${String(cursor.getUTCMonth() + 1).padStart(2, "0")}`);
    cursor.setUTCMonth(cursor.getUTCMonth() + 1);
  }
  return out.reverse(); // newest first
}

export default async function ReportsIndex() {
  const ctx = await getStatsContext();
  const candidates = monthsSince(FIRST_REPORT_YM, new Date());
  const reports = candidates
    .map((ym) => ({ ym, report: buildMonthlyReport(ym, ctx) }))
    .filter((r) => r.report !== null);

  return (
    <>
      <HeaderSection />
      <main className="ae-route-page ae-report-page">
        <section className="ae-route-hero">
          <div>
            <div className="ae-route-kicker">/reports</div>
            <h1>State of the Agent Economy</h1>
            <p>A monthly report on agent-protocol activity, measured from public chains. Free to cite with attribution.</p>
          </div>
          <Link href="/" className="ae-route-home-link">
            Back to home
            <ArrowRightIcon />
          </Link>
        </section>

        <section className="mt-20">
          {reports.map(({ ym, report }) => (
            <Link
              key={ym}
              href={`/reports/${ym}`}
              className="group flex flex-col md:flex-row md:items-baseline md:justify-between gap-3 border-t border-white/10 py-8 last:border-b"
            >
              <div>
                <h2 className="text-white font-medium text-[22px] tracking-tight group-hover:text-[#00FF88] transition">
                  {monthName(ym)}
                </h2>
                <p className="text-white/50 text-[14px] leading-relaxed mt-2 max-w-xl">
                  {report!.metrics[0]?.quotable} {report!.metrics[1]?.quotable}
                </p>
              </div>
              <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-white/35 flex-none">
                {report!.metrics.length} measured metrics →
              </span>
            </Link>
          ))}
        </section>

        <section className="mt-16 pb-4">
          <p className="text-white/45 text-[14px] leading-relaxed max-w-2xl">
            A new report appears automatically once a month closes and the pipeline has measured it end-to-end. Every figure
            is computed from the open dataset — recompute anything from{" "}
            <a href="/data.json" className="underline decoration-white/25 underline-offset-4 hover:text-white transition">
              data.json
            </a>
            .
          </p>
        </section>
      </main>
      <FooterSection />
    </>
  );
}
