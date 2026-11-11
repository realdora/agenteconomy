// The coverage-extensions feed: two series collected by their own daily
// workflow (see scripts/fetch-coverage-extensions.mjs in the data repo).
//   erc8004Sources — ERC-8004 registrations per day, grouped by agent-card host
//   acpV2          — jobs per day on Virtuals' current ACP contract (EVM only)
// Everything here is derived at render time. If the feed is unreachable the
// summary is null and callers fall back to their dated static notes.

import { fetchFeed } from "./feed-fetch";

// Read from the dashboard origin directly: the apex path is a rewrite to it.
const COVERAGE_URL = "https://dashboard.agenteconomy.to/coverage-extensions.json";

type SourceDay = { day: string; total: number; exLargestSource: number; topSources: { source: string; registered: number }[] };
type AcpDay = { day: string; chain: string; created: number; completed: number; clients: number; providers: number };

export type SourceWindow = { from: string; to: string; total: number; largestSource: string; largestShare: number; exLargest: number };

export type CoverageSummary = {
  erc: {
    asOf: string;
    last7: SourceWindow;
    // Every day the series holds. It starts when the registry went live, so this
    // is the lifetime split; `from` states the first day either way.
    allTime: SourceWindow;
    month: (ym: string) => SourceWindow | null;
    exLargestDaily: { day: string; value: number }[];
  } | null;
  acp: {
    asOf: string;
    since: string;
    chains: string[];
    last7: { from: string; to: string; created: number; completed: number };
    total: number;
    perDay: number;
    latest: { day: string; created: number; clients: number; providers: number };
    daily: { day: string; value: number }[];
  } | null;
};

const n = (v: unknown): number => (typeof v === "number" && Number.isFinite(v) ? v : 0);
const isDay = (v: unknown): v is string => typeof v === "string" && /^\d{4}-\d{2}-\d{2}$/.test(v);

function windowOf(days: SourceDay[]): SourceWindow | null {
  if (!days.length) return null;
  const total = days.reduce((s, d) => s + d.total, 0);
  const by = new Map<string, number>();
  for (const d of days) for (const s of d.topSources) by.set(s.source, (by.get(s.source) ?? 0) + s.registered);
  const top = [...by].sort((a, b) => b[1] - a[1])[0];
  if (!top || total <= 0) return null;
  return { from: days[0].day, to: days[days.length - 1].day, total, largestSource: top[0], largestShare: top[1] / total, exLargest: total - top[1] };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function summarizeCoverage(raw: any): CoverageSummary {
  let erc: CoverageSummary["erc"] = null;
  const sourceDays: SourceDay[] = (Array.isArray(raw?.erc8004Sources?.daily) ? raw.erc8004Sources.daily : [])
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .filter((d: any) => isDay(d?.day) && Array.isArray(d?.topSources))
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .map((d: any) => ({
      day: d.day,
      total: n(d.total),
      exLargestSource: n(d.exLargestSource),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      topSources: d.topSources.map((s: any) => ({ source: String(s?.source ?? ""), registered: n(s?.registered) })),
    }));
  const last7 = windowOf(sourceDays.slice(-7));
  const allTime = windowOf(sourceDays);
  if (last7 && allTime && sourceDays.length >= 7) {
    erc = {
      asOf: last7.to,
      last7,
      allTime,
      // Only a month the series covers from its first to its last day.
      month: (ym) => {
        const days = sourceDays.filter((d) => d.day.startsWith(ym));
        const length = new Date(Date.UTC(Number(ym.slice(0, 4)), Number(ym.slice(5, 7)), 0)).getUTCDate();
        return days.length === length ? windowOf(days) : null;
      },
      exLargestDaily: sourceDays.slice(-60).map((d) => ({ day: d.day, value: d.exLargestSource })),
    };
  }

  let acp: CoverageSummary["acp"] = null;
  const rows: AcpDay[] = (Array.isArray(raw?.acpV2?.daily) ? raw.acpV2.daily : [])
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .filter((d: any) => isDay(d?.day))
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .map((d: any) => ({ day: d.day, chain: String(d.chain ?? ""), created: n(d.created), completed: n(d.completed), clients: n(d.clients), providers: n(d.providers) }));
  const asOf = raw?.acpV2?.asOf;
  if (rows.length && isDay(asOf)) {
    const since = rows[0].day;
    const byDay = new Map<string, number>();
    for (const r of rows) byDay.set(r.day, (byDay.get(r.day) ?? 0) + r.created);
    const from = new Date(Date.parse(`${asOf}T00:00:00Z`) - 6 * 86400000).toISOString().slice(0, 10);
    const recent = rows.filter((r) => r.day >= from && r.day <= asOf);
    const total = rows.reduce((s, r) => s + r.created, 0);
    const span = Math.round((Date.parse(`${asOf}T00:00:00Z`) - Date.parse(`${since}T00:00:00Z`)) / 86400000) + 1;
    const latestDay = rows[rows.length - 1].day;
    const latestRows = rows.filter((r) => r.day === latestDay);
    // Clients/providers are distinct per chain; report the busiest chain's
    // figures rather than a cross-chain sum that could double count.
    const lead = [...latestRows].sort((a, b) => b.created - a.created)[0];
    acp = {
      asOf,
      since,
      chains: [...new Set(rows.map((r) => r.chain))],
      last7: { from, to: asOf, created: recent.reduce((s, r) => s + r.created, 0), completed: recent.reduce((s, r) => s + r.completed, 0) },
      total,
      perDay: span > 0 ? Math.round(total / span) : 0,
      latest: { day: latestDay, created: latestRows.reduce((s, r) => s + r.created, 0), clients: lead.clients, providers: lead.providers },
      daily: [...byDay].slice(-60).map(([day, value]) => ({ day, value })),
    };
  }
  return { erc, acp };
}

export async function getCoverage(): Promise<CoverageSummary> {
  try {
    const res = await fetchFeed(COVERAGE_URL);
    if (!res.ok) throw new Error(`feed responded ${res.status}`);
    return summarizeCoverage(await res.json());
  } catch {
    return { erc: null, acp: null };
  }
}
