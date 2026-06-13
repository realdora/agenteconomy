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
  highlight: {
    series: [4.1, 56.7, 110.9, 130.1, 134.2, 139.3, 143.9, 149.2, 149.4],
    totalM: 149.4,
    startLabel: "Oct 25",
    endLabel: "Jun 26",
  },
  isLive: false,
};

const round1 = (n: number) => Math.round(n * 10) / 10;

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

    return {
      updatedAt: typeof d.updatedAt === "string" ? d.updatedAt : null,
      price: {
        volumeM: round1((x.totalVolume ?? 0) / 1e6) || FALLBACK.price.volumeM,
        chains: x.chainsTracked ?? FALLBACK.price.chains,
        facilitators: x.facilitatorsTracked ?? FALLBACK.price.facilitators,
        share: Array.isArray(x.protocols) && x.protocols.length ? buildShare(x.protocols) : FALLBACK.price.share,
      },
      totalEvents: totalEvents || FALLBACK.totalEvents,
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
