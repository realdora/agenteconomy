// Live agenteconomy.to dataset, mapped to the shapes the homepage needs.
// Fetched server-side with hourly ISR (revalidate: 3600) so real numbers land in
// the HTML and refresh without a redeploy. Falls back to a baked-in snapshot if the
// source is unreachable at build/request time, so the page never renders empty.

import { fetchFeed } from "./feed-fetch";
import { completeDays, x402DailyExecution } from "./complete-days";

const DATA_URL = "https://agenteconomy.to/data.json";
const WEB_URL = "https://agenteconomy.to/web-sources.json";

export type SharePart = { label: string; pct: number; color: string };

// One REAL row per protocol for the hero "tracking" card: the latest daily (or
// weekly) figure from data.json. Replaces the old fabricated event stream — every
// value shown is measured, with its own date.
export type StreamRow = { k: string; c: string; metric: string; value: number; day: string };

export type MonthPoint = { month: string; txs: number; vol: number };

export type AgentData = {
  updatedAt: string | null;
  price: {
    volumeM: number; // USD volume in millions
    chains: number;
    facilitators: number;
    share: SharePart[];
  };
  totalEvents: number; // summed across all tracked protocols
  stream: StreamRow[]; // latest real per-protocol activity rows
  growth: number[]; // recent on-chain activity, cumulative over the last 90 days (all protocols, in millions)
  // x402 month by month. The homepage used to plot the CUMULATIVE count, which
  // rises by construction and hid that monthly activity sits far below its
  // late-2025 peak. Bars are complete months only — the trailing month is still
  // accruing and would read as a false drop.
  highlight: {
    totalM: number; // cumulative x402 transactions, in millions
    bars: { month: string; txsM: number }[]; // complete months, e.g. "Oct 25"
    last: MonthPoint; // latest complete month
    peak: MonthPoint; // busiest complete month by transactions
  };
  isLive: boolean; // false when the fallback snapshot was used
};

// Last-known snapshot — also the exact values the panels shipped with, so a failed
// fetch degrades to "looks like before" rather than blank.
export const FALLBACK: AgentData = {
  updatedAt: null,
  price: {
    volumeM: 40.6,
    chains: 7,
    facilitators: 18,
    share: [
      { label: "Coinbase", pct: 29.4, color: "#0052FF" },
      { label: "Dexter", pct: 22.2, color: "#6366F1" },
      { label: "PayAI", pct: 20.4, color: "#10B981" },
      { label: "DayDreams", pct: 8, color: "#F59E0B" },
      { label: "Other", pct: 20, color: "#8a8f98" },
    ],
  },
  totalEvents: 179_000_000,
  stream: [
    { k: "x402", c: "#00FF88", metric: "daily txs", value: 54980, day: "2026-07-04" },
    { k: "Olas", c: "#c0c4cc", metric: "weekly txs", value: 119935, day: "2026-06-29" },
    { k: "ERC-8004", c: "#7ad7ff", metric: "daily registrations", value: 1203, day: "2026-07-04" },
    { k: "ACP", c: "#9E7BFF", metric: "daily memos", value: 66, day: "2026-07-04" },
    { k: "Tempo", c: "#ff7ab6", metric: "daily events", value: 10, day: "2026-07-04" },
  ],
  growth: [0.2, 0.8, 1.4, 1.9, 2.3, 2.5, 2.8, 3.1, 3.7, 4.6, 5.5, 6.3, 7, 7.8, 8.6, 9.3, 10, 10.7, 11.4, 12.1, 12.6, 13.4, 14.2, 14.8],
  highlight: {
    totalM: 149.4,
    bars: [
      { month: "Oct 25", txsM: 4.1 },
      { month: "Nov 25", txsM: 52.6 },
      { month: "Dec 25", txsM: 54.2 },
      { month: "Jan 26", txsM: 19.2 },
      { month: "Feb 26", txsM: 4.1 },
      { month: "Mar 26", txsM: 5.1 },
      { month: "Apr 26", txsM: 4.6 },
      { month: "May 26", txsM: 5.3 },
    ],
    last: { month: "May 26", txs: 5_339_396, vol: 179_793 },
    peak: { month: "Dec 25", txs: 54_248_231, vol: 9_412_930 },
  },
  isLive: false,
};

const round1 = (n: number) => Math.round(n * 10) / 10;

// Recent activity curve: every protocol's per-day events over the last 90 days,
// summed and accumulated, then downsampled to ~24 points. Uses the DAILY series
// (steady, smooth) rather than the all-history monthly cumulative — the latter is
// dominated by two explosive x402 months, so it renders as a flat line that cliffs
// up "out of nowhere". This recent window is a clean, honest growth trajectory.
// Olas only reports weekly, so its week total is spread evenly across its 7 days.
const DAY = 86_400_000;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function buildGrowth(d: any): number[] {
  const byDay: Record<string, number> = {};
  const add = (day: unknown, n: unknown) => {
    const k = String(day ?? "").slice(0, 10);
    if (!k) return;
    byDay[k] = (byDay[k] ?? 0) + (typeof n === "number" ? n : 0);
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const each = (arr: any, fn: (r: any) => void) => {
    if (Array.isArray(arr)) arr.forEach(fn);
  };
  each(completeDays(d.x402?.daily ?? [], x402DailyExecution(d)), (r) => add(r.day, r.txs));
  each(d.baseAgentic?.daily, (r) => add(r.day, r.total));
  each(d.virtualsAcp?.daily, (r) => add(r.day, r.memos));
  each(d.erc8004Registry?.daily, (r) => add(r.day, r.agents));
  each(d.tempoMpp?.daily, (r) => add(r.day, r.events));
  each(d.olas?.weekly, (r) => {
    const t = Date.parse(`${r.week}T00:00:00Z`);
    if (Number.isNaN(t)) return;
    for (let i = 0; i < 7; i++) add(new Date(t + i * DAY).toISOString().slice(0, 10), (r.txs ?? 0) / 7);
  });
  const days = Object.keys(byDay).sort();
  if (days.length < 8) return [];
  const window = days.slice(-90);
  let cum = 0;
  const series = window.map((k) => (cum += byDay[k]));
  // downsample to a clean 24-point sparkline
  const N = 24;
  const out: number[] = [];
  for (let i = 0; i < N; i++) out.push(round1(series[Math.round((i * (series.length - 1)) / (N - 1))] / 1e6));
  return out;
}

type RawProtocol = { name: string; share: number };

// Color comes from a local palette by rank, NOT from upstream — data.json's protocol
// rows are not guaranteed to carry a `color`, and a missing one rendered transparent bars.
const SHARE_COLORS = ["#0052FF", "#6366F1", "#10B981", "#F59E0B"];

// Keep the top 4 named protocols by share; fold everything else (incl. the source's
// stray "Other"/tiny rows) into a single "Other" so the 5-segment bar stays clean.
function buildShare(protocols: RawProtocol[]): SharePart[] {
  const named = protocols
    .filter((p) => p && p.name && p.name.toLowerCase() !== "other" && Number.isFinite(Number(p.share)))
    .map((p) => ({ name: p.name, share: Number(p.share) }))
    .sort((a, b) => b.share - a.share);
  const top = named.slice(0, 4);
  const topSum = top.reduce((s, p) => s + p.share, 0);
  const otherPct = Math.max(0, round1(100 - topSum));
  const built: SharePart[] = [
    ...top.map((p, i) => ({ label: p.name, pct: round1(p.share), color: SHARE_COLORS[i] ?? "#8a8f98" })),
    { label: "Other", pct: otherPct, color: "#8a8f98" },
  ];
  // Honesty guard: bad upstream shares (NaN, fractions instead of %, or top>100) must
  // not render a bar that misrepresents the split. If it doesn't sum to ~100, fall back.
  const sum = built.reduce((s, p) => s + p.pct, 0);
  if (top.length === 0 || sum < 95 || sum > 105) return FALLBACK.price.share;
  return built;
}

// Masumi settles on Cardano and is read through a public third-party API, so it
// lives in the off-chain feed rather than data.json. It still belongs in the
// headline event total: the copy says the flow is measured across six
// protocols, and quietly summing only five of them would make that sentence
// false. Fetched separately and degraded to zero on failure, so an outage in
// the smaller feed can never blank the headline number.
async function masumiEvents(): Promise<number> {
  try {
    const res = await fetchFeed(WEB_URL);
    if (!res.ok) return 0;
    const w = await res.json();
    const n = Number(w?.masumi?.totalTxs);
    return Number.isFinite(n) && n > 0 ? n : 0;
  } catch {
    return 0;
  }
}

export async function getAgentData(): Promise<AgentData> {
  try {
    const res = await fetchFeed(DATA_URL);
    if (!res.ok) throw new Error(`data.json responded ${res.status}`);
    const d = await res.json();
    const x = d.x402 ?? {};

    const totalEvents =
      (d.x402?.totalTxs ?? 0) +
      (d.olas?.totalTxs ?? 0) +
      (d.virtualsAcp?.totalMemos ?? 0) +
      (d.erc8004Registry?.totalAgents ?? 0) +
      (d.baseAgentic?.totalTxs ?? 0) +
      (d.tempoMpp?.totalEvents ?? 0) +
      (await masumiEvents());

    // x402 by month. The trailing entry is the month still in progress, so it is
    // left out of the bars and of the "latest month" figures (same rule as
    // /stats/is-x402-growing); it still counts toward the cumulative total.
    const monthly: Array<{ month?: string; txs?: number; vol?: number }> = Array.isArray(x.monthly) ? x.monthly : [];
    const point = (m: { month?: string; txs?: number; vol?: number }): MonthPoint => ({
      month: m.month ?? "",
      txs: m.txs ?? 0,
      vol: m.vol ?? 0,
    });
    const complete = monthly.slice(0, -1).map(point);
    const highlight =
      complete.length >= 3
        ? {
            totalM: round1(monthly.reduce((s, m) => s + (m.txs ?? 0), 0) / 1e6),
            bars: complete.map((m) => ({ month: m.month, txsM: round1(m.txs / 1e6) })),
            last: complete[complete.length - 1],
            peak: complete.reduce((a, b) => (b.txs > a.txs ? b : a), complete[0]),
          }
        : FALLBACK.highlight;

    const growth = buildGrowth(d);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const lastRow = (a: any): any => (Array.isArray(a) && a.length ? a[a.length - 1] : {});
    const xLast = lastRow(completeDays(d.x402?.daily ?? [], x402DailyExecution(d)));
    const oLast = lastRow(d.olas?.weekly);
    const rLast = lastRow(d.erc8004Registry?.daily);
    const vLast = lastRow(d.virtualsAcp?.daily);
    const tLast = lastRow(d.tempoMpp?.daily);
    const stream: StreamRow[] = [
      { k: "x402", c: "#00FF88", metric: "daily txs", value: xLast.txs ?? 0, day: String(xLast.day ?? "") },
      { k: "Olas", c: "#c0c4cc", metric: "weekly txs", value: oLast.txs ?? 0, day: String(oLast.week ?? "") },
      { k: "ERC-8004", c: "#7ad7ff", metric: "daily registrations", value: rLast.agents ?? 0, day: String(rLast.day ?? "") },
      { k: "ACP", c: "#9E7BFF", metric: "daily memos · legacy", value: vLast.memos ?? 0, day: String(vLast.day ?? "") },
      { k: "Tempo", c: "#ff7ab6", metric: "daily events", value: tLast.events ?? 0, day: String(tLast.day ?? "") },
    ].filter((r) => r.value > 0 && r.day);

    return {
      updatedAt: typeof d.updatedAt === "string" ? d.updatedAt : null,
      price: {
        volumeM: round1((x.totalVolume ?? 0) / 1e6) || FALLBACK.price.volumeM,
        chains: x.chainsTracked ?? FALLBACK.price.chains,
        facilitators: x.facilitatorsTracked ?? FALLBACK.price.facilitators,
        share: Array.isArray(x.protocols) && x.protocols.length ? buildShare(x.protocols) : FALLBACK.price.share,
      },
      totalEvents: totalEvents || FALLBACK.totalEvents,
      stream: stream.length >= 3 ? stream : FALLBACK.stream,
      growth: growth.length >= 2 ? growth : FALLBACK.growth,
      highlight,
      isLive: true,
    };
  } catch {
    return FALLBACK;
  }
}

// "179M+", "1.1B+" etc. for the hero copy.
export function formatEvents(n: number): string {
  if (n >= 1e9) return `${round1(n / 1e9)}B`;
  if (n >= 1e6) return `${Math.round(n / 1e6)}M`;
  if (n >= 1e3) return `${Math.round(n / 1e3)}K`;
  return `${n}`;
}
