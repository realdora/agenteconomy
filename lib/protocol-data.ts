// Per-protocol views for the protocol pages, mapped from the live data.json.
// Fetched server-side with hourly ISR (the fetch is deduped/cached with the rest
// of the site). Each protocol exposes only what it actually has on-chain.

const DATA_URL = "https://agenteconomy.to/data.json";
const GREEN = "#00FF88";
const OTHER = "#8a8f98";

const round1 = (n: number) => Math.round(n * 10) / 10;
function fmtCount(n: number): string {
  if (n >= 1e9) return `${round1(n / 1e9)}B`;
  if (n >= 1e6) return `${round1(n / 1e6)}M`;
  if (n >= 1e3) return `${round1(n / 1e3)}K`;
  return `${Math.round(n)}`;
}
const fmtUsdM = (n: number) => `$${round1(n / 1e6)}M`;

export type Stat = { value: string; label: string };
export type Bar = { label: string; value: string; pct: number; color: string };
export type Breakdown = { title: string; bars: Bar[]; moreCount: number };
export type ProtocolView = {
  slug: string;
  name: string;
  tagline: string;
  dataKey: string;
  stats: Stat[];
  breakdown: Breakdown | null;
  updatedAt: string | null;
  isLive: boolean;
};

export const PROTOCOL_SLUGS = ["x402", "erc-8004", "virtuals-acp", "olas", "tempo-mpp"] as const;

const META: Record<string, { name: string; tagline: string; dataKey: string }> = {
  x402: { name: "x402", tagline: "The HTTP 402 payment standard for autonomous agents.", dataKey: "x402" },
  "erc-8004": { name: "ERC-8004", tagline: "On-chain registry for agent-to-agent transactions.", dataKey: "erc8004Registry" },
  "virtuals-acp": { name: "Virtuals ACP", tagline: "The Agent Commerce Protocol.", dataKey: "virtualsAcp" },
  olas: { name: "Olas", tagline: "Autonomous agent network.", dataKey: "olas" },
  "tempo-mpp": { name: "Tempo MPP", tagline: "Multi-Party Payment channels.", dataKey: "tempoMpp" },
};

// Build ranked bars: width is relative to the largest value, label/value as given.
function makeBars(
  title: string,
  items: { label: string; raw: number; color?: string }[],
  format: (n: number) => string,
  topN = 8,
): Breakdown {
  const sorted = [...items].sort((a, b) => b.raw - a.raw);
  const max = sorted[0]?.raw || 1;
  const top = sorted.slice(0, topN);
  return {
    title,
    bars: top.map((it) => ({
      label: it.label,
      value: format(it.raw),
      pct: Math.max(3, (it.raw / max) * 100),
      color: it.color ?? GREEN,
    })),
    moreCount: Math.max(0, sorted.length - top.length),
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function buildView(slug: string, d: any): ProtocolView {
  const meta = META[slug];
  const updatedAt = typeof d?.updatedAt === "string" ? d.updatedAt : null;
  let stats: Stat[] = [];
  let breakdown: Breakdown | null = null;

  if (slug === "x402") {
    const x = d.x402 ?? {};
    stats = [
      { value: fmtUsdM(x.totalVolume ?? 0), label: "settled volume" },
      { value: fmtCount(x.totalTxs ?? 0), label: "transactions" },
      { value: `${x.facilitatorsTracked ?? "—"}`, label: "facilitators" },
      { value: `${x.chainsTracked ?? "—"}`, label: "chains" },
    ];
    const protos: { name: string; share: number; color: string }[] = Array.isArray(x.protocols) ? x.protocols : [];
    const named = protos.filter((p) => p.name && p.name.toLowerCase() !== "other").sort((a, b) => b.share - a.share);
    const top = named.slice(0, 4);
    const otherPct = Math.max(0, round1(100 - top.reduce((s, p) => s + p.share, 0)));
    breakdown = makeBars(
      "Market share by facilitator",
      [...top.map((p) => ({ label: p.name, raw: round1(p.share), color: p.color })), { label: "Other", raw: otherPct, color: OTHER }],
      (n) => `${n}%`,
      6,
    );
  } else if (slug === "olas") {
    const o = d.olas ?? {};
    stats = [
      { value: fmtCount(o.totalTxs ?? 0), label: "transactions" },
      { value: `${Array.isArray(o.chains) ? o.chains.length : "—"}`, label: "chains" },
    ];
    if (Array.isArray(o.chains)) {
      breakdown = makeBars("Transactions by chain", o.chains.map((c: { name: string; txs: number }) => ({ label: c.name, raw: c.txs })), fmtCount);
    }
  } else if (slug === "erc-8004") {
    const e = d.erc8004Registry ?? {};
    stats = [
      { value: fmtCount(e.totalAgents ?? 0), label: "agents registered" },
      { value: `${e.chainsTracked ?? "—"}`, label: "chains" },
    ];
    if (Array.isArray(e.chains)) {
      breakdown = makeBars("Agents by chain", e.chains.map((c: { name: string; agents: number }) => ({ label: c.name, raw: c.agents })), fmtCount);
    }
  } else if (slug === "virtuals-acp") {
    const v = d.virtualsAcp ?? {};
    const days = Array.isArray(v.daily) ? v.daily.length : 0;
    stats = [
      { value: fmtCount(v.totalMemos ?? 0), label: "memos" },
      ...(days ? [{ value: `${days}`, label: "days of history" }] : []),
    ];
  } else if (slug === "tempo-mpp") {
    const t = d.tempoMpp ?? {};
    stats = [
      { value: fmtCount(t.totalEvents ?? 0), label: "channel events" },
      { value: `${t.uniquePayers ?? "—"}`, label: "payers" },
      { value: `${t.uniquePayees ?? "—"}`, label: "payees" },
    ];
    if (t.byType && typeof t.byType === "object") {
      breakdown = makeBars(
        "Events by type",
        Object.entries(t.byType).map(([label, raw]) => ({ label, raw: Number(raw) })),
        fmtCount,
      );
    }
  }

  return { slug, name: meta.name, tagline: meta.tagline, dataKey: meta.dataKey, stats, breakdown, updatedAt, isLive: true };
}

export async function getProtocolView(slug: string): Promise<ProtocolView | null> {
  const meta = META[slug];
  if (!meta) return null;
  try {
    const res = await fetch(DATA_URL, { next: { revalidate: 3600 } });
    if (!res.ok) throw new Error(`data.json responded ${res.status}`);
    return buildView(slug, await res.json());
  } catch {
    return { slug, name: meta.name, tagline: meta.tagline, dataKey: meta.dataKey, stats: [], breakdown: null, updatedAt: null, isLive: false };
  }
}
