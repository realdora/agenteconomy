// Live agenteconomy.to dataset, mapped to the shapes the homepage needs.
// Fetched server-side with hourly ISR (revalidate: 3600) so real numbers land in
// the HTML and refresh without a redeploy. Falls back to a baked-in snapshot if the
// source is unreachable at build/request time, so the page never renders empty.

const DATA_URL = "https://agenteconomy.to/data.json";

export type SharePart = { label: string; pct: number; color: string };

export type AgentData = {
  updatedAt: string | null;
  price: {
    volumeM: number; // USD volume in millions
    chains: number;
    facilitators: number;
    share: SharePart[];
  };
  totalEvents: number; // summed across all tracked protocols
  growth: number[]; // cumulative total events over time (all protocols, by month, in millions)
  highlight: {
    series: number[]; // cumulative x402 transactions, in millions
    totalM: number; // final cumulative value
    startLabel: string; // first month, e.g. "Oct 25"
    endLabel: string; // last month, e.g. "Jun 26"
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
  growth: [0.6, 1.7, 2.3, 3.1, 4.1, 9, 62.5, 117.9, 138, 142.9, 151.9, 157.8, 163.4, 164.2],
  highlight: {
    series: [4.1, 56.7, 110.9, 130.1, 134.2, 139.3, 143.9, 149.2, 149.4],
    totalM: 149.4,
    startLabel: "Oct 25",
    endLabel: "Jun 26",
  },
  isLive: false,
};

const round1 = (n: number) => Math.round(n * 10) / 10;

// Combined cumulative total events over time — every protocol's periodic series
// bucketed by month and summed, then accumulated. x402 uses its full-history
// monthly labels ("Oct 25"); the rest use ISO daily/weekly dates. The result is a
// real growth trajectory for the headline total (axis-less sparkline → the shape,
// not absolute values, is what's read).
const MONTH_IDX: Record<string, string> = {
  Jan: "01", Feb: "02", Mar: "03", Apr: "04", May: "05", Jun: "06",
  Jul: "07", Aug: "08", Sep: "09", Oct: "10", Nov: "11", Dec: "12",
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function buildGrowth(d: any): number[] {
  const buckets: Record<string, number> = {};
  const add = (m: string | null, n: unknown) => {
    if (!m) return;
    buckets[m] = (buckets[m] ?? 0) + (typeof n === "number" ? n : 0);
  };
  const normMonth = (lbl: unknown): string | null => {
    const m = String(lbl).match(/([A-Za-z]{3})\s*(\d{2})/);
    return m && MONTH_IDX[m[1]] ? `20${m[2]}-${MONTH_IDX[m[1]]}` : null;
  };
  const iso = (x: unknown): string => String(x ?? "").slice(0, 7);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const each = (arr: any, fn: (r: any) => void) => {
    if (Array.isArray(arr)) arr.forEach(fn);
  };
  each(d.x402?.monthly, (r) => add(normMonth(r.month), r.txs));
  each(d.olas?.weekly, (r) => add(iso(r.week), r.txs));
  each(d.virtualsAcp?.daily, (r) => add(iso(r.day), r.memos));
  each(d.erc8004Registry?.daily, (r) => add(iso(r.day), r.agents));
  each(d.tempoMpp?.daily, (r) => add(iso(r.day), r.events));
  each(d.baseAgentic?.daily, (r) => add(iso(r.day), r.total));
  const months = Object.keys(buckets).sort();
  let cum = 0;
  return months.map((m) => {
    cum += buckets[m];
    return round1(cum / 1e6);
  });
}

type RawProtocol = { name: string; share: number; color: string };

// Keep the top 4 named protocols by share; fold everything else (incl. the source's
// stray "Other"/tiny rows) into a single "Other" so the 5-segment bar stays clean.
function buildShare(protocols: RawProtocol[]): SharePart[] {
  const named = protocols
    .filter((p) => p.name && p.name.toLowerCase() !== "other")
    .sort((a, b) => b.share - a.share);
  const top = named.slice(0, 4);
  const topSum = top.reduce((s, p) => s + p.share, 0);
  const otherPct = Math.max(0, round1(100 - topSum));
  return [
    ...top.map((p) => ({ label: p.name, pct: round1(p.share), color: p.color })),
    { label: "Other", pct: otherPct, color: "#8a8f98" },
  ];
}

export async function getAgentData(): Promise<AgentData> {
  try {
    const res = await fetch(DATA_URL, { next: { revalidate: 3600 } });
    if (!res.ok) throw new Error(`data.json responded ${res.status}`);
    const d = await res.json();
    const x = d.x402 ?? {};

    const totalEvents =
      (d.x402?.totalTxs ?? 0) +
      (d.olas?.totalTxs ?? 0) +
      (d.virtualsAcp?.totalMemos ?? 0) +
      (d.erc8004Registry?.totalAgents ?? 0) +
      (d.baseAgentic?.totalTxs ?? 0) +
      (d.tempoMpp?.totalEvents ?? 0);

    // Cumulative x402 monthly transactions — a real, monotonically-rising curve
    // (the raw per-period series are too volatile to plot as "growth").
    const monthly: Array<{ month?: string; txs?: number }> = Array.isArray(x.monthly) ? x.monthly : [];
    let cum = 0;
    const series = monthly.map((m) => {
      cum += m.txs ?? 0;
      return round1(cum / 1e6);
    });
    const highlight = series.length
      ? {
          series,
          totalM: series[series.length - 1],
          startLabel: monthly[0]?.month ?? "",
          endLabel: monthly[monthly.length - 1]?.month ?? "",
        }
      : FALLBACK.highlight;

    const growth = buildGrowth(d);

    return {
      updatedAt: typeof d.updatedAt === "string" ? d.updatedAt : null,
      price: {
        volumeM: round1((x.totalVolume ?? 0) / 1e6) || FALLBACK.price.volumeM,
        chains: x.chainsTracked ?? FALLBACK.price.chains,
        facilitators: x.facilitatorsTracked ?? FALLBACK.price.facilitators,
        share: Array.isArray(x.protocols) && x.protocols.length ? buildShare(x.protocols) : FALLBACK.price.share,
      },
      totalEvents: totalEvents || FALLBACK.totalEvents,
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
