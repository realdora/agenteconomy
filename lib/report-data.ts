// Monthly "State of the Agent Economy" report — computed entirely from the live
// feeds at render time. /reports/[month] is a DYNAMIC ISR route: when a new
// month closes and the pipeline has its data, the report exists — no deploy.

import { asOfLabel, fmt, usd, type StatsContext } from "./stats-data";

type Row = Record<string, unknown>;
const arr = (v: unknown): Row[] => (Array.isArray(v) ? (v as Row[]) : []);
const num = (v: unknown): number => (Number.isFinite(Number(v)) ? Number(v) : 0);

export type ReportMetric = {
  label: string;
  value: string;
  momPct: number | null; // month-over-month change, null when prior month not measurable
  note?: string;
  quotable: string; // one-sentence, citation-ready form
};

export type MonthlyReport = {
  ym: string; // "2026-06"
  monthName: string; // "June 2026"
  asOf: string | null;
  publishedAt: string; // instant the month closed — stable, see closedAt()
  metrics: ReportMetric[];
  coverageNotes: string[];
};

// A month report's publication date is the instant its month closed, not the
// instant the page happened to re-render. Feeding the live feed timestamp into
// datePublished made a June report claim it was published today, and re-claim it
// tomorrow — a moving publication date on content that is immutable by design
// (see the note in buildMonthlyReport).
function closedAt(ym: string): string {
  const [y, m] = ym.split("-").map(Number);
  return new Date(Date.UTC(y, m, 1)).toISOString(); // month index m == the following month
}

export function isValidYm(ym: string): boolean {
  return /^\d{4}-(0[1-9]|1[0-2])$/.test(ym);
}

export function monthName(ym: string): string {
  const [y, m] = ym.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, 1)).toLocaleString("en-US", { month: "long", year: "numeric", timeZone: "UTC" });
}

function shortLabel(ym: string): string {
  const [y, m] = ym.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, 1)).toLocaleString("en-US", { month: "short", year: "2-digit", timeZone: "UTC" });
}

function prevYm(ym: string): string {
  const [y, m] = ym.split("-").map(Number);
  const d = new Date(Date.UTC(y, m - 2, 1));
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`;
}

// A month is reportable once it has fully closed (UTC).
export function isClosedMonth(ym: string, now: Date): boolean {
  const currentYm = `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, "0")}`;
  return ym < currentYm;
}

const sumDaily = (rows: Row[], ym: string, field: string): number =>
  rows.filter((r) => String(r.day ?? "").startsWith(ym)).reduce((s, r) => s + num(r[field]), 0);

const mom = (cur: number, prev: number): number | null =>
  prev > 0 ? Math.round(((cur - prev) / prev) * 1000) / 10 : null;

export function buildMonthlyReport(ym: string, ctx: StatsContext): MonthlyReport | null {
  const d = ctx.data;
  if (!d) return null;

  const label = shortLabel(ym);
  const prevLabel = shortLabel(prevYm(ym));
  const name = monthName(ym);
  const metrics: ReportMetric[] = [];
  const coverageNotes: string[] = [];

  // x402 — monthly series carries full history (txs + vol).
  const xm = arr(d.x402?.monthly);
  const xCur = xm.find((m) => m.month === label);
  const xPrev = xm.find((m) => m.month === prevLabel);
  if (xCur && num(xCur.txs) > 0) {
    metrics.push({
      label: "x402 transactions",
      value: fmt(xCur.txs),
      momPct: mom(num(xCur.txs), num(xPrev?.txs)),
      quotable: `x402 settled ${fmt(xCur.txs)} transactions in ${name}.`,
    });
    metrics.push({
      label: "x402 settled volume",
      value: usd(xCur.vol),
      momPct: mom(num(xCur.vol), num(xPrev?.vol)),
      quotable: `x402 moved ${usd(xCur.vol)} of stablecoin volume in ${name}.`,
    });
  }

  // Daily-grain sources — sums over the month, when the retained window covers it.
  const ercRows = arr(d.erc8004Registry?.daily);
  const ercMonth = sumDaily(ercRows, ym, "agents");
  const ercPrev = sumDaily(ercRows, prevYm(ym), "agents");
  if (ercMonth > 0) {
    metrics.push({
      label: "New ERC-8004 registrations",
      value: fmt(ercMonth),
      momPct: ercPrev > 0 ? mom(ercMonth, ercPrev) : null,
      quotable: `${fmt(ercMonth)} new agents registered in ERC-8004 identity registries in ${name}.`,
    });
  } else {
    coverageNotes.push("ERC-8004 daily history does not fully cover this month; registrations omitted.");
  }

  const acpRows = arr(d.virtualsAcp?.daily);
  const acpMonth = sumDaily(acpRows, ym, "memos");
  const acpPrev = sumDaily(acpRows, prevYm(ym), "memos");
  if (acpMonth > 0) {
    metrics.push({
      label: "Virtuals ACP memos",
      value: fmt(acpMonth),
      momPct: acpPrev > 0 ? mom(acpMonth, acpPrev) : null,
      quotable: `Virtuals ACP recorded ${fmt(acpMonth)} on-chain commerce memos in ${name}.`,
    });
  } else {
    coverageNotes.push("Virtuals ACP daily history does not fully cover this month; memos omitted.");
  }

  const olasRows = arr(d.olas?.weekly);
  const olasMonth = olasRows.filter((w) => String(w.week ?? "").startsWith(ym)).reduce((s, w) => s + num(w.txs), 0);
  if (olasMonth > 0) {
    metrics.push({
      label: "Olas transactions (weeks starting in month)",
      value: fmt(olasMonth),
      momPct: null,
      note: "weekly grain",
      quotable: `Olas autonomous agents made ${fmt(olasMonth)} transactions across the weeks starting in ${name}.`,
    });
  }

  const tempoRows = arr(d.tempoMpp?.daily);
  const tempoMonth = sumDaily(tempoRows, ym, "events");
  const tempoPrev = sumDaily(tempoRows, prevYm(ym), "events");
  if (tempoMonth > 0) {
    metrics.push({
      label: "Tempo MPP events",
      value: fmt(tempoMonth),
      momPct: tempoPrev > 0 ? mom(tempoMonth, tempoPrev) : null,
      quotable: `Tempo's Machine Payments Protocol produced ${fmt(tempoMonth)} channel events in ${name}.`,
    });
  }

  const baseRows = arr(d.baseAgentic?.daily);
  const baseMonth = sumDaily(baseRows, ym, "total");
  const basePrev = sumDaily(baseRows, prevYm(ym), "total");
  if (baseMonth > 0) {
    metrics.push({
      label: "Base agentic-ecosystem transactions",
      value: fmt(baseMonth),
      momPct: basePrev > 0 ? mom(baseMonth, basePrev) : null,
      quotable: `Base's broader agentic ecosystem produced ${fmt(baseMonth)} transactions in ${name}.`,
    });
  }

  // A report needs at least the x402 core plus two other families to be worth
  // publishing under this banner.
  if (metrics.length < 3) return null;

  // NOTE: off-chain context sections (agent-standard web adoption, AI inference
  // demand) are deliberately NOT added here. Month-labeled reports must be
  // immutable — a "June 2026" report cannot change after June. But the off-chain
  // snapshot feeds (weekly Cloudflare scan, trailing OpenRouter token window) are
  // not month-bounded: they carry a single latest snapshot, so folding them into
  // a month report would silently mutate it every crawl. Reports gain these
  // sections only once the pipeline archives month-end snapshots. Until then the
  // /stats pages (which are explicitly live, not month-bounded) carry these datasets.

  return {
    ym,
    monthName: name,
    asOf: (d.updatedAt as string) ?? null,
    publishedAt: closedAt(ym),
    metrics,
    coverageNotes,
  };
}

export { asOfLabel };
