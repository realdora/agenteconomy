// Live per-protocol headline stats pulled from data.json with hourly ISR.
// Rendered server-side as a plain-text stats table on each protocol page so the
// CURRENT figures — with an explicit "as of" stamp — are in the HTML for search
// and AI crawlers. This replaces the old pattern of hardcoding figures in the
// long-form prose, which froze June numbers into pages that looked current.

import { fetchFeed } from "./feed-fetch";

const DATA_URL = "https://agenteconomy.to/data.json";
// Masumi is read through a third-party public API (Koios) rather than this
// site's own indexing, so it lives in the off-chain feed. It is the only
// protocol page whose figures come from there.
const WEB_URL = "https://agenteconomy.to/web-sources.json";

export type StatRow = { label: string; value: string; note?: string };

export type ProtocolStats = {
  asOf: string | null; // ISO stamp of the section's own execution time
  // The one figure worth putting in the <title>. Search results for these pages
  // used to read "x402 | agent economy", which promises nothing a SERP snippet
  // doesn't already show — and measured out at 0.2–0.4% CTR against 9% on the
  // question-titled stat pages. The live count is the thing only this site has.
  headline: { value: string; noun: string };
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
        headline: { value: fmt(x.totalTxs), noun: "payments settled" },
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
        headline: { value: fmt(r.totalAgents), noun: "agents registered" },
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
        headline: { value: fmt(v.totalMemos), noun: "commerce memos" },
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
        headline: { value: fmt(o.totalTxs), noun: "agent transactions" },
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
        headline: { value: fmt(t.totalEvents), noun: "channel events" },
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
    case "masumi": {
      const m = (d.masumi ?? {}) as Record<string, unknown>;
      const total = num(m.totalTxs);
      if (!total) return null;
      // The feed ships the running week too, so it has to be dropped here: a
      // week that is four days old reads as a ~40% collapse against complete
      // ones. A week beginning W is complete once W+7d has passed at the feed's
      // own as-of date — the same test the dashboard build applies.
      const asOfDay = String((m.asOf as string) ?? (d.updatedAt as string) ?? "").slice(0, 10);
      const weekly = arr(m.weekly).filter((r) => {
        const start = Date.parse(String(r.week ?? ""));
        if (Number.isNaN(start) || !asOfDay) return false;
        return new Date(start + 7 * 86400000).toISOString().slice(0, 10) <= asOfDay;
      });
      const lastWeek = weekly.at(-1) ?? {};
      const asOfLabel = formatAsOf((m.asOf as string) ?? (d.updatedAt as string)) ?? "the latest refresh";
      return {
        asOf: (m.asOf as string) ?? (d.updatedAt as string) ?? null,
        headline: { value: fmt(total), noun: "escrow payments" },
        rows: [
          { label: "Escrow transactions", value: fmt(total), note: "mainnet payment contract" },
          { label: "Chain", value: "Cardano", note: "the only non-EVM rail tracked" },
          ...(weekly.length
            ? [
                { label: `Latest complete week`, value: fmt(lastWeek.txs), note: String(lastWeek.week ?? "") },
                { label: "Weeks of history", value: fmt(weekly.length), note: "rebuilt from full contract history" },
              ]
            : []),
          { label: "Source", value: "Koios public API", note: "cross-verified against Masumi's explorer" },
        ],
        faq: [
          {
            q: "How many Masumi transactions are there?",
            a: `As of ${asOfLabel}, agent economy counts ${fmt(total)} transactions against the Masumi mainnet payment contract on Cardano, read from the chain through the public Koios API and cross-verified against Masumi's own explorer. The unit is escrow settlement activity, not audited end-user commerce.`,
          },
          {
            q: "Why is Masumi counted differently from the other protocols?",
            a: "It settles on Cardano rather than an EVM chain or Solana, so it cannot be read by the same Dune queries or RPC log scans. It is walked through Koios, a public Cardano API, and its figures live in web-sources.json with the other externally-sourced signals — a statement about provenance, not about confidence.",
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
    const res = await fetchFeed(slug === "masumi" ? WEB_URL : DATA_URL);
    if (!res.ok) throw new Error(`feed responded ${res.status}`);
    const d = await res.json();
    return buildStats(slug, d);
  } catch {
    // No fallback figures here on purpose: stale numbers presented as live is the
    // exact failure mode this module exists to remove. The page renders the prose
    // and points at /data instead.
    return null;
  }
}
