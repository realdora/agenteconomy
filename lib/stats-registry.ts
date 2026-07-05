// The /stats answer layer — one page per high-intent question that has no
// authoritative answer elsewhere. Format discipline (per the GEO evidence:
// statistics, quotations, and cited sources are what AI engines actually lift):
//   1. The QUESTION is the h1 and the title.
//   2. The first paragraph IS the answer — number first, with an as-of stamp.
//   3. A key-stats table and a chart with its series also in text.
//   4. Methodology and honest caveats, with named external sources.
// Numbers are computed at render time from the live feeds (hourly ISR) — never
// hardcoded in prose. New pages = one new entry here.

import { asOfLabel, fmt, usd, type StatsContext } from "./stats-data";

export type ChartSpec = {
  kind: "line" | "bars";
  title: string;
  unit: string;
  points: { label: string; value: number }[];
};

export type StatComputed = {
  answer: string; // the quotable, number-first paragraph
  asOf: string | null;
  rows: { label: string; value: string; note?: string }[];
  chart?: ChartSpec;
  extraFaq?: { q: string; a: string }[];
};

export type StatDoc = {
  slug: string;
  question: string; // h1 + <title>
  shortTitle: string; // cards, nav, related links
  seoDescription: string;
  protocolSlug?: string; // related protocol guide
  related: string[]; // sibling stat slugs
  sources: { label: string; url: string }[];
  sections: { heading: string; body: string[] }[];
  build: (ctx: StatsContext) => StatComputed | null;
};

type Row = Record<string, unknown>;
const arr = (v: unknown): Row[] => (Array.isArray(v) ? (v as Row[]) : []);
const num = (v: unknown): number => (Number.isFinite(Number(v)) ? Number(v) : 0);

// ─── x402 transaction count ─────────────────────────────────────────────────
const x402Transactions: StatDoc = {
  slug: "x402-transactions",
  question: "How many x402 transactions have been processed?",
  shortTitle: "x402 transaction count",
  seoDescription:
    "The live cumulative x402 transaction count and settled USD volume, measured from public on-chain settlement activity, with methodology and caveats.",
  protocolSlug: "x402",
  related: ["average-x402-transaction-size", "how-many-ai-agents-are-onchain", "erc-8004-agents"],
  sources: [
    { label: "agent economy data.json (live feed)", url: "https://agenteconomy.to/data.json" },
    { label: "Dune · x402 Payment Analytics (@thechriscen)", url: "https://dune.com/thechriscen/x402" },
    { label: "Dune · x402 Analytics (@hashed_official)", url: "https://dune.com/hashed_official/x402-analytics" },
    {
      label: "Crypto Briefing — x402 surpasses 100M transactions (Q1 2026)",
      url: "https://cryptobriefing.com/coinbase-x402-protocol-100m-transactions-base/",
    },
  ],
  sections: [
    {
      heading: "Why published x402 counts disagree",
      body: [
        "News coverage quotes x402 milestones as point-in-time snapshots — 100 million cumulative transactions in Q1 2026, various 30-day windows since — and those snapshots age immediately. Different trackers also count different things: some count only Base, some include Solana and the other settlement chains, some count facilitator-routed settlements only. The figure on this page is cumulative across every chain and facilitator the agent economy pipeline can observe, and it refreshes from the live dataset on an hourly cycle, so it does not freeze the way a news number does.",
        "The count is built from public on-chain settlement activity: transfers initiated by known facilitator addresses across EVM chains and Solana, aggregated by day and by month. The facilitator registry is community-maintained upstream, so new facilitators flow into the measurement as they appear.",
      ],
    },
    {
      heading: "How to read the number honestly",
      body: [
        "Raw settlement counts include tests, infrastructure traffic, repeated service calls, and self-directed usage — activity that is real at the protocol layer but not the same thing as verified organic end-user commerce. A high transaction count proves the payment path is being exercised at scale; it does not prove that every transaction is a distinct paying customer. That caveat is part of the measurement, and it is why this page reports settlement transactions and settled volume as separate, clearly-labeled units.",
        "For growth analysis, the monthly series below is more informative than the headline: it shows when activity accelerated and how concentrated it is in recent months.",
      ],
    },
  ],
  build: ({ data }) => {
    const x = data?.x402;
    if (!x) return null;
    const monthly = arr(x.monthly);
    let cum = 0;
    const points = monthly.map((m) => ({ label: String(m.month ?? ""), value: Math.round((cum += num(m.txs)) / 1e6) }));
    const daily = arr(x.daily).at(-1) ?? {};
    const stamp = asOfLabel(x.asOf ?? data?.updatedAt) ?? "the latest pipeline run";
    return {
      answer: `As of ${stamp}, ${fmt(x.totalTxs)} cumulative x402 transactions have settled on-chain, moving ${usd(x.totalVolume)} in stablecoin volume across ${fmt(x.chainsTracked)} chains and ${fmt(x.facilitatorsTracked)} tracked facilitators. The count is measured from public on-chain settlement activity and refreshes hourly.`,
      asOf: x.asOf ?? data?.updatedAt ?? null,
      rows: [
        { label: "Cumulative transactions", value: fmt(x.totalTxs) },
        { label: "Settled USD volume", value: usd(x.totalVolume) },
        { label: "Latest daily transactions", value: fmt((daily as Row).txs), note: String((daily as Row).day ?? "") },
        { label: "Chains tracked", value: fmt(x.chainsTracked) },
        { label: "Facilitators tracked", value: fmt(x.facilitatorsTracked) },
      ],
      chart: { kind: "line", title: "Cumulative x402 transactions by month", unit: "M txs", points },
      extraFaq: [
        {
          q: "When did x402 pass 100 million transactions?",
          a: "x402 crossed 100 million cumulative transactions in Q1 2026, as reported by Crypto Briefing. The live cumulative count on this page shows how far past that milestone the protocol has moved since.",
        },
      ],
    };
  },
};

// ─── average x402 transaction size ──────────────────────────────────────────
const avgX402Size: StatDoc = {
  slug: "average-x402-transaction-size",
  question: "What is the average x402 transaction size?",
  shortTitle: "Average x402 transaction size",
  seoDescription:
    "The average x402 payment size in USD, computed from cumulative settled volume over cumulative transactions, with the monthly trend and measurement caveats.",
  protocolSlug: "x402",
  related: ["x402-transactions", "how-many-ai-agents-are-onchain"],
  sources: [
    { label: "agent economy data.json (live feed)", url: "https://agenteconomy.to/data.json" },
    {
      label: "CoinDesk — micropayment demand skepticism (Mar 2026)",
      url: "https://www.coindesk.com/markets/2026/03/11/coinbase-backed-ai-payments-protocol-wants-to-fix-micropayment-but-demand-is-just-not-there-yet",
    },
  ],
  sections: [
    {
      heading: "Why quoted averages range from $0.20 to $0.48",
      body: [
        "Published figures for x402 payment size disagree because they are computed over different windows and different chain subsets — a 24-hour average on one chain is not the same statistic as an all-time average across every chain. The figure on this page is the simplest and most reproducible version: cumulative settled USD volume divided by cumulative transaction count, both from the same live dataset, both cited on this page. Anyone can recompute it from data.json.",
        "The monthly series below shows how the average has moved over time. A falling average is consistent with the micropayment thesis (more, smaller machine-to-machine calls); a rising average suggests larger settlements are entering the mix.",
      ],
    },
    {
      heading: "What a sub-dollar average means — and doesn't",
      body: [
        "A sub-dollar average transaction is the clearest structural evidence that x402 traffic is machine-scale payment, not human checkout: card networks cannot economically clear payments this small, which is the gap the protocol exists to fill. It does not by itself prove organic demand — repeated infrastructure calls and tests also produce small settlements, a caveat the broader x402 measurement carries too.",
      ],
    },
  ],
  build: ({ data }) => {
    const x = data?.x402;
    if (!x || !num(x.totalTxs)) return null;
    const avg = num(x.totalVolume) / num(x.totalTxs);
    const monthly = arr(x.monthly);
    const points = monthly
      .filter((m) => num(m.txs) > 0)
      .map((m) => ({ label: String(m.month ?? ""), value: Math.round((num(m.vol) / num(m.txs)) * 100) / 100 }));
    const stamp = asOfLabel(x.asOf ?? data?.updatedAt) ?? "the latest pipeline run";
    return {
      answer: `As of ${stamp}, the average x402 transaction is ${usd(Math.round(avg * 100) / 100)} — ${fmt(x.totalTxs)} cumulative transactions have settled ${usd(x.totalVolume)} of stablecoin volume, an all-time average across every tracked chain. The figure is recomputed hourly from the live dataset.`,
      asOf: x.asOf ?? data?.updatedAt ?? null,
      rows: [
        { label: "Average transaction size (all-time)", value: usd(Math.round(avg * 100) / 100) },
        { label: "Cumulative settled volume", value: usd(x.totalVolume) },
        { label: "Cumulative transactions", value: fmt(x.totalTxs) },
      ],
      chart: { kind: "bars", title: "Average x402 transaction size by month", unit: "USD", points },
    };
  },
};

// ─── on-chain agent census ───────────────────────────────────────────────────
const agentCensus: StatDoc = {
  slug: "how-many-ai-agents-are-onchain",
  question: "How many AI agents are on-chain?",
  shortTitle: "On-chain AI agent census",
  seoDescription:
    "An honest census of on-chain AI agents: what can actually be counted (ERC-8004 registrations, Virtuals agents), what cannot, and why no single total exists.",
  protocolSlug: "erc-8004",
  related: ["erc-8004-agents", "x402-transactions"],
  sources: [
    { label: "agent economy data.json (live feed)", url: "https://agenteconomy.to/data.json" },
    { label: "agent economy web-sources.json (live feed)", url: "https://agenteconomy.to/web-sources.json" },
    { label: "ERC-8004 · Trustless Agents standard", url: "https://eips.ethereum.org/EIPS/eip-8004" },
    { label: "Virtuals Protocol API (launched agents)", url: "https://api.virtuals.io/" },
  ],
  sections: [
    {
      heading: "Why nobody can give you one number",
      body: [
        "“How many AI agents exist” has no single honest answer, because an agent only becomes countable when it does something observable. An agent that never registers an identity and never transacts is invisible to every methodology. What CAN be counted, precisely, is registered on-chain agent identities: registrations in ERC-8004 identity registries, and agents created on platforms like Virtuals that record creation on-chain. That is what this census counts, and it labels everything it cannot count.",
        "The registry total and the platform total are kept separate rather than blended, because they measure different acts: an ERC-8004 registration is an agent claiming a portable, cross-platform identity; a Virtuals launch is an agent created inside one platform's economy. Some agents appear in both. Address-level caveats apply everywhere: one operator can register many agents, and one agent can act from many addresses.",
      ],
    },
    {
      heading: "What is explicitly not in this census",
      body: [
        "Not counted: agents with wallets but no registered identity (most trading bots), off-chain agents that never touch a chain (the overwhelming majority of deployed AI agents), MCP servers and other agent-facing services (supply-side infrastructure, not agents), and active-buyer address counts published by trackers like x402scan (a usage metric, not an identity count — useful, but a different unit). Any headline that claims a total count of AI agents without these distinctions is blending units.",
      ],
    },
  ],
  build: ({ data, web }) => {
    const r = data?.erc8004Registry;
    if (!r) return null;
    const erc = num(r.totalAgents);
    const launched = num(web?.virtuals?.launchedAgents);
    const acp = num(web?.virtuals?.acpRegisteredAgents);
    const total = erc + launched;
    const stamp = asOfLabel(r.asOf ?? data?.updatedAt) ?? "the latest pipeline run";
    return {
      answer: `As of ${stamp}, at least ${fmt(total)} AI agent identities are registered on-chain across the registries agent economy measures directly: ${fmt(erc)} agents in ERC-8004 identity registries across ${fmt(r.chainsTracked)} chains, plus ${fmt(launched)} agents launched on Virtuals Protocol (${fmt(acp)} of them registered for ACP commerce). This is a floor, not a total — agents without on-chain identity are not countable by any methodology.`,
      asOf: r.asOf ?? data?.updatedAt ?? null,
      rows: [
        { label: "Countable on-chain agent identities", value: fmt(total), note: "floor, not total" },
        { label: "ERC-8004 registered agents", value: fmt(erc), note: `${fmt(r.chainsTracked)} chains` },
        { label: "Virtuals launched agents", value: fmt(launched), note: "Base" },
        { label: "Virtuals ACP commerce agents", value: fmt(acp), note: "subset of launched" },
      ],
      chart: {
        kind: "bars",
        title: "Countable on-chain agent identities by registry family",
        unit: "agents",
        points: [
          { label: "ERC-8004", value: erc },
          { label: "Virtuals launched", value: launched },
          { label: "Virtuals ACP", value: acp },
        ],
      },
      extraFaq: [
        {
          q: "Is this the total number of AI agents in the world?",
          a: "No — it is the number of agent identities registered on-chain, which is the only precisely countable subset. Most deployed AI agents never touch a blockchain and cannot be counted by any public methodology.",
        },
      ],
    };
  },
};

// ─── ERC-8004 registrations ──────────────────────────────────────────────────
const erc8004Agents: StatDoc = {
  slug: "erc-8004-agents",
  question: "How many ERC-8004 agents are registered?",
  shortTitle: "ERC-8004 agent registrations",
  seoDescription:
    "The live count of agents registered in ERC-8004 identity registries, broken down by chain, measured from on-chain Registered events with testnets excluded.",
  protocolSlug: "erc-8004",
  related: ["how-many-ai-agents-are-onchain", "x402-transactions"],
  sources: [
    { label: "agent economy data.json (live feed)", url: "https://agenteconomy.to/data.json" },
    { label: "ERC-8004 · Trustless Agents standard", url: "https://eips.ethereum.org/EIPS/eip-8004" },
  ],
  sections: [
    {
      heading: "What a registration is",
      body: [
        "ERC-8004 (“Trustless Agents”) gives an agent a portable on-chain identity: an ERC-721 token pointing to the agent's card — name, capabilities, endpoints, payment address. The count on this page is the number of Registered events emitted by ERC-8004 identity registries across the EVM chains the pipeline scans, with testnets excluded. It is an identity count, not an activity count: registering is one transaction, and a registered agent may be highly active, dormant, or abandoned.",
        "Chain distribution matters more than the headline here. Registration is cheap, so a single campaign or platform integration on one chain can move the total quickly — the per-chain breakdown below shows where the registrations actually live, and the daily series shows whether growth is steady or event-driven.",
      ],
    },
  ],
  build: ({ data }) => {
    const r = data?.erc8004Registry;
    if (!r) return null;
    const daily = arr(r.daily).slice(-60);
    const points = daily.map((d) => ({ label: String(d.day ?? "").slice(5), value: num(d.agents) }));
    const chains = arr(r.chains).slice(0, 8);
    const stamp = asOfLabel(r.asOf ?? data?.updatedAt) ?? "the latest pipeline run";
    const top = chains[0] ?? {};
    return {
      answer: `As of ${stamp}, ${fmt(r.totalAgents)} agents are registered in ERC-8004 identity registries across ${fmt(r.chainsTracked)} chains, counted from on-chain Registered events with testnets excluded. ${String(top.name ?? "The largest chain")} leads with ${fmt(top.agents)} registrations.`,
      asOf: r.asOf ?? data?.updatedAt ?? null,
      rows: [
        { label: "Registered agents (total)", value: fmt(r.totalAgents) },
        { label: "Chains tracked", value: fmt(r.chainsTracked) },
        ...chains.slice(0, 5).map((c) => ({ label: `— ${String(c.name)}`, value: fmt(c.agents) })),
      ],
      chart: { kind: "line", title: "Daily ERC-8004 registrations (last 60 days)", unit: "agents/day", points },
    };
  },
};

export const STAT_DOCS: StatDoc[] = [x402Transactions, avgX402Size, agentCensus, erc8004Agents];
export const STAT_SLUGS = STAT_DOCS.map((d) => d.slug);
export const getStatDoc = (slug: string): StatDoc | null => STAT_DOCS.find((d) => d.slug === slug) ?? null;
