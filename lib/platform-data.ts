// Data for the PlatformSection variants — the real agenteconomy.to/data.json,
// shaped two ways: a `snapshot` (the real aggregate document) and a `feed` (real
// recent daily entries). Server-fetched with hourly ISR + a baked-in fallback.

import { fetchFeed } from "./feed-fetch";

const DATA_URL = "https://agenteconomy.to/data.json";

export type FeedEntry = { day: string; protocol: string; value: number; unit: string };

export type Snapshot = {
  updatedAt: string;
  x402: { totalTxs: number; totalVolume: number; facilitators: number; chains: number };
  olas: { totalTxs: number };
  virtualsAcp: { totalMemos: number };
  erc8004Registry: { totalAgents: number; chains: number };
  tempoMpp: { totalEvents: number; uniquePayers: number; uniquePayees: number };
  baseAgentic: { totalTxs: number };
  sources: string[];
};

export type PlatformData = { updatedAt: string | null; snapshot: Snapshot; feed: FeedEntry[] };

const FALLBACK: PlatformData = {
  updatedAt: "2026-06-05T02:24:11.586Z",
  snapshot: {
    updatedAt: "2026-06-05T02:24:11.586Z",
    x402: { totalTxs: 150005139, totalVolume: 40677242, facilitators: 18, chains: 7 },
    olas: { totalTxs: 16449330 },
    virtualsAcp: { totalMemos: 12314057 },
    erc8004Registry: { totalAgents: 216746, chains: 24 },
    tempoMpp: { totalEvents: 26457, uniquePayers: 653, uniquePayees: 60 },
    baseAgentic: { totalTxs: 1124261 },
    sources: ["Dune · @thechriscen", "Dune · @hashed_official", "Dune · @ax1research", "Dune · @adrian0x"],
  },
  feed: [
    { day: "2026-06-05", protocol: "x402", value: 50524, unit: "txns" },
    { day: "2026-06-05", protocol: "erc8004", value: 303, unit: "agents" },
    { day: "2026-06-05", protocol: "baseAgentic", value: 6094, unit: "txns" },
    { day: "2026-06-04", protocol: "x402", value: 48201, unit: "txns" },
    { day: "2026-06-04", protocol: "tempoMpp", value: 118, unit: "events" },
    { day: "2026-06-04", protocol: "virtualsAcp", value: 43, unit: "memos" },
    { day: "2026-06-03", protocol: "x402", value: 52310, unit: "txns" },
    { day: "2026-06-03", protocol: "baseAgentic", value: 5870, unit: "txns" },
  ],
};

// A chronological feed (newest day first) of real daily aggregates. A clean,
// credible log-tail. x402 / baseAgentic dominate the recent window because they're
// the freshest-reporting (and largest) protocols — that's the honest reality.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function buildFeed(d: any): FeedEntry[] {
  const out: FeedEntry[] = [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const push = (arr: any, field: string, protocol: string, unit: string) => {
    if (Array.isArray(arr)) {
      arr.slice(-12).forEach((e) => {
        if (e && typeof e.day === "string") out.push({ day: e.day, protocol, value: Number(e[field] ?? 0), unit });
      });
    }
  };
  push(d.x402?.daily, "txs", "x402", "txns");
  push(d.baseAgentic?.daily, "total", "baseAgentic", "txns");
  push(d.virtualsAcp?.daily, "memos", "virtualsAcp", "memos");
  push(d.tempoMpp?.daily, "events", "tempoMpp", "events");
  push(d.erc8004Registry?.daily, "agents", "erc8004", "agents");
  out.sort((a, b) => (a.day < b.day ? 1 : a.day > b.day ? -1 : 0));
  return out.slice(0, 30);
}

export async function getPlatformData(): Promise<PlatformData> {
  try {
    const res = await fetchFeed(DATA_URL);
    if (!res.ok) throw new Error(`data.json responded ${res.status}`);
    const d = await res.json();
    const x = d.x402 ?? {};
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const authors: string[] = Array.from(
      new Set((Array.isArray(d.sources) ? d.sources : []).map((s: { author?: string }) => s.author).filter(Boolean)),
    );
    const feed = buildFeed(d);
    return {
      updatedAt: typeof d.updatedAt === "string" ? d.updatedAt : null,
      snapshot: {
        updatedAt: typeof d.updatedAt === "string" ? d.updatedAt : "",
        x402: {
          totalTxs: x.totalTxs ?? 0,
          totalVolume: x.totalVolume ?? 0,
          facilitators: x.facilitatorsTracked ?? 0,
          chains: x.chainsTracked ?? 0,
        },
        olas: { totalTxs: d.olas?.totalTxs ?? 0 },
        virtualsAcp: { totalMemos: d.virtualsAcp?.totalMemos ?? 0 },
        erc8004Registry: { totalAgents: d.erc8004Registry?.totalAgents ?? 0, chains: d.erc8004Registry?.chainsTracked ?? 0 },
        tempoMpp: {
          totalEvents: d.tempoMpp?.totalEvents ?? 0,
          uniquePayers: d.tempoMpp?.uniquePayers ?? 0,
          uniquePayees: d.tempoMpp?.uniquePayees ?? 0,
        },
        baseAgentic: { totalTxs: d.baseAgentic?.totalTxs ?? 0 },
        sources: authors.length ? authors.map((a) => `Dune · ${a}`) : FALLBACK.snapshot.sources,
      },
      feed: feed.length ? feed : FALLBACK.feed,
    };
  } catch {
    return FALLBACK;
  }
}
