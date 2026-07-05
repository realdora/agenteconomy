// Live per-protocol headline stats pulled from data.json with hourly ISR.
// Rendered server-side as a plain-text stats table on each protocol page so the
// CURRENT figures — with an explicit "as of" stamp — are in the HTML for search
// and AI crawlers. This replaces the old pattern of hardcoding figures in the
// long-form prose, which froze June numbers into pages that looked current.

const DATA_URL = "https://agenteconomy.to/data.json";

export type StatRow = { label: string; value: string; note?: string };

export type ProtocolStats = {
  asOf: string | null; // ISO stamp of the section's own execution time
  rows: StatRow[];
  faq: { q: string; a: string }[];
  isLive: boolean;
};

const num = (v: unknown): number => (typeof v === "number" && Number.isFinite(v) ? v : 0);
const fmt = (v: unknown): string => num(v).toLocaleString("en-US");
const usd = (v: unknown): string => `$${num(v).toLocaleString("en-US")}`;

export function formatAsOf(iso: string | null): string | null {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" });
}

type Row = Record<string, unknown>;
const arr = (v: unknown): Row[] => (Array.isArray(v) ? (v as Row[]) : []);
const last = (v: unknown): Row => arr(v).at(-1) ?? {};
const first = (v: unknown): Row => arr(v)[0] ?? {};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function buildStats(slug: string, d: any): ProtocolStats | null {
  switch (slug) {
    case "x402": {
      const x = d.x402 ?? {};
      const daily = last(x.daily);
      const topChain = first(x.chains);
      const topFac = first(x.protocols);
      const asOfLabel = formatAsOf(x.asOf ?? d.updatedAt) ?? "the latest pipeline run";
      return {
        asOf: x.asOf ?? d.updatedAt ?? null,
        rows: [
          { label: "Cumulative transactions", value: fmt(x.totalTxs) },
          { label: "USD settlement volume", value: usd(x.totalVolume) },
          { label: "Latest daily transactions", value: fmt(daily.txs), note: String(daily.day ?? "") },
          { label: "Facilitators tracked", value: fmt(x.facilitatorsTracked) },
          { label: "Chains tracked", value: fmt(x.chainsTracked) },
          { label: "Largest chain", value: String(topChain.name ?? "—"), note: `${fmt(topChain.txs)} txs` },
          { label: "Largest facilitator", value: String(topFac.name ?? "—"), note: `${num(topFac.share)}% share` },
        ],
        faq: [
          {
            q: "How many x402 transactions have been processed?",
            a: `As of ${asOfLabel}, agent economy tracks ${fmt(x.totalTxs)} cumulative x402 transactions and ${usd(x.totalVolume)} of settled USD volume across ${fmt(x.chainsTracked)} chains, measured from public on-chain settlement activity.`,
          },
          {
            q: "Which chain has the most x402 activity?",
            a: `${String(topChain.name ?? "Base")} is currently the largest chain by x402 transactions, with ${fmt(topChain.txs)} recorded settlements. ${String(topFac.name ?? "Coinbase")} is the largest facilitator at ${num(topFac.share)}% share.`,
          },
        ],
        isLive: true,
      };
    }
    case "erc-8004": {
      const r = d.erc8004Registry ?? {};
      const daily = last(r.daily);
      const topChain = first(r.chains);
      const asOfLabel = formatAsOf(r.asOf ?? d.updatedAt) ?? "the latest pipeline run";
      return {
        asOf: r.asOf ?? d.updatedAt ?? null,
        rows: [
          { label: "Registered agents", value: fmt(r.totalAgents) },
          { label: "Chains tracked", value: fmt(r.chainsTracked) },
          { label: "Largest chain", value: String(topChain.name ?? "—"), note: `${fmt(topChain.agents)} agents` },
          { label: "Latest daily registrations", value: fmt(daily.agents), note: String(daily.day ?? "") },
        ],
        faq: [
          {
            q: "How many ERC-8004 agents are registered?",
            a: `As of ${asOfLabel}, ${fmt(r.totalAgents)} agents are registered in ERC-8004 identity registries across ${fmt(r.chainsTracked)} chains, counted from on-chain Registered events (testnets excluded).`,
          },
        ],
        isLive: true,
      };
    }
    case "virtuals-acp": {
      const v = d.virtualsAcp ?? {};
      const daily = last(v.daily);
      const asOfLabel = formatAsOf(v.asOf ?? d.updatedAt) ?? "the latest pipeline run";
      return {
        asOf: v.asOf ?? d.updatedAt ?? null,
        rows: [
          { label: "Total commerce memos", value: fmt(v.totalMemos) },
          { label: "Latest daily memos", value: fmt(daily.memos), note: String(daily.day ?? "") },
          { label: "Latest daily unique senders", value: fmt(daily.senders), note: String(daily.day ?? "") },
        ],
        faq: [
          {
            q: "How much Virtuals ACP activity is there on-chain?",
            a: `As of ${asOfLabel}, agent economy has indexed ${fmt(v.totalMemos)} cumulative Virtuals ACP commerce memos on Base, decoded from the protocol's on-chain NewMemo events.`,
          },
        ],
        isLive: true,
      };
    }
    case "olas": {
      const o = d.olas ?? {};
      const weekly = last(o.weekly);
      const topChain = first(o.chains);
      const chainCount = arr(o.chains).length;
      const share = num(o.totalTxs) > 0 ? Math.round((num(topChain.txs) / num(o.totalTxs)) * 1000) / 10 : 0;
      const asOfLabel = formatAsOf(o.asOf ?? d.updatedAt) ?? "the latest pipeline run";
      return {
        asOf: o.asOf ?? d.updatedAt ?? null,
        rows: [
          { label: "Cumulative transactions", value: fmt(o.totalTxs) },
          { label: "Chains tracked", value: fmt(chainCount) },
          { label: "Largest chain", value: String(topChain.name ?? "—"), note: `${fmt(topChain.txs)} txs · ${share}%` },
          { label: "Latest weekly transactions", value: fmt(weekly.txs), note: `week of ${String(weekly.week ?? "")}` },
        ],
        faq: [
          {
            q: "How many Olas transactions have there been?",
            a: `As of ${asOfLabel}, agent economy tracks ${fmt(o.totalTxs)} cumulative Olas agent transactions across ${fmt(chainCount)} chains. ${String(topChain.name ?? "Gnosis")} is the largest chain with ${fmt(topChain.txs)} transactions (${share}% of the tracked total).`,
          },
        ],
        isLive: true,
      };
    }
    case "tempo-mpp": {
      const t = d.tempoMpp ?? {};
      const daily = last(t.daily);
      const asOfLabel = formatAsOf(d.updatedAt) ?? "the latest pipeline run";
      return {
        asOf: d.updatedAt ?? null,
        rows: [
          { label: "Total MPP events", value: fmt(t.totalEvents) },
          { label: "Unique payers", value: fmt(t.uniquePayers) },
          { label: "Unique payees", value: fmt(t.uniquePayees) },
          { label: "Latest daily events", value: fmt(daily.events), note: String(daily.day ?? "") },
        ],
        faq: [
          {
            q: "How much Tempo MPP activity is there?",
            a: `As of ${asOfLabel}, agent economy has indexed ${fmt(t.totalEvents)} Tempo MPP events from ${fmt(t.uniquePayers)} unique payer addresses and ${fmt(t.uniquePayees)} unique payees, via a direct Tempo RPC indexer.`,
          },
        ],
        isLive: true,
      };
    }
    default:
      return null;
  }
}

export async function getProtocolStats(slug: string): Promise<ProtocolStats | null> {
  try {
    const res = await fetch(DATA_URL, { next: { revalidate: 3600 } });
    if (!res.ok) throw new Error(`data.json responded ${res.status}`);
    const d = await res.json();
    return buildStats(slug, d);
  } catch {
    // No fallback figures here on purpose: stale numbers presented as live is the
    // exact failure mode this module exists to remove. The page renders the prose
    // and points at /data instead.
    return null;
  }
}
