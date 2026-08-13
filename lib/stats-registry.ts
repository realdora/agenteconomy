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
  // A gated entry: the page (and its sitemap / llms.txt / hub listing) only
  // exists when the underlying feed has arrived. Omit for always-on pages.
  available?: (ctx: StatsContext) => boolean;
  build: (ctx: StatsContext) => StatComputed | null;
};

type Row = Record<string, unknown>;
const arr = (v: unknown): Row[] => (Array.isArray(v) ? (v as Row[]) : []);
const num = (v: unknown): number => (Number.isFinite(Number(v)) ? Number(v) : 0);

// Compact token count for the inference page: "194.85 trillion tokens".
const tokensT = (v: unknown): string => {
  const n = Number(v);
  if (!Number.isFinite(n)) return "—";
  if (n >= 1e12) return `${(n / 1e12).toFixed(2)} trillion tokens`;
  if (n >= 1e9) return `${(n / 1e9).toFixed(2)} billion tokens`;
  if (n >= 1e6) return `${(n / 1e6).toFixed(2)} million tokens`;
  return `${n.toLocaleString("en-US")} tokens`;
};

// Truncate a Solana program id for display: "1DREGFgysW…w2B2p".
const shortId = (s: string): string => (s.length > 14 ? `${s.slice(0, 10)}…${s.slice(-5)}` : s);

// The agent-relevant subset of the Cloudflare agent-readiness checks, in the
// order the adoption page lists them (broadest → narrowest, payments last).
const AGENT_STANDARDS: { key: string; label: string }[] = [
  { key: "ucp", label: "UCP" },
  { key: "mcpServerCard", label: "MCP server card" },
  { key: "webBotAuth", label: "web-bot-auth" },
  { key: "a2aAgentCard", label: "A2A agent card" },
  { key: "acp", label: "ACP" },
  { key: "mpp", label: "MPP" },
  { key: "x402", label: "x402" },
  { key: "ap2", label: "AP2" },
  { key: "webMcp", label: "WebMCP" },
];

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
    { label: "Solana getProgramAccounts (agent registries · public RPC)", url: "https://solana.com/docs/rpc/http/getprogramaccounts" },
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
    {
      heading: "Counting the Solana agent registries",
      body: [
        "Solana runs its own agent-identity registries — Metaplex's MPL Agent Identity program and SATI, an ERC-8004-style port — and agent economy counts them directly via getProgramAccounts on public RPC. Those account counts are upper bounds: getProgramAccounts returns every account each program owns, including any initialized-but-unused or duplicated entries, so the number of distinct live agents is at or below the figure shown. Read as registered agents by chain, this is roughly the ERC-8004 total on EVM against ~2.9K combined on Solana.",
        "One figure this census deliberately does not use is the Solana Foundation's marketed “9,000+ agents” headline: the on-chain account counts contradict it, with the two registries together holding roughly 2.9K accounts. This page cites what the programs actually own, not the marketing number.",
      ],
    },
  ],
  build: ({ data, web }) => {
    const r = data?.erc8004Registry;
    if (!r) return null;
    const erc = num(r.totalAgents);
    const launched = num(web?.virtuals?.launchedAgents);
    const acp = num(web?.virtuals?.acpRegisteredAgents);
    const solRegs = arr(web?.solanaAgents?.registries);
    const solTotal = num(web?.solanaAgents?.totalAccounts) || solRegs.reduce((s, x) => s + num(x.accounts), 0);
    // Floor = only lower-bound-on-distinct-identity counts: ERC-8004 registrations
    // + Virtuals launches. Solana getProgramAccounts counts are UPPER bounds (they
    // include initialized-but-unused / duplicated entries), so they are reported
    // separately and never folded into the "at least" floor claim.
    const floor = erc + launched;
    const stamp = asOfLabel(r.asOf ?? data?.updatedAt) ?? "the latest pipeline run";
    const solK = Math.round(solTotal / 100) / 10;
    const solSentence = solTotal
      ? ` Separately, up to ~${solK}K more are registered on two Solana agent registries (Metaplex MPL Agent Identity and SATI) — an upper bound from getProgramAccounts, held outside the floor.`
      : "";
    return {
      answer: `As of ${stamp}, at least ${fmt(floor)} AI agent identities are registered on-chain across the registries agent economy measures directly: ${fmt(erc)} agents in ERC-8004 identity registries across ${fmt(r.chainsTracked)} chains, plus ${fmt(launched)} agents launched on Virtuals Protocol (${fmt(acp)} of them registered for ACP commerce). This is a floor, not a total — agents without on-chain identity are not countable by any methodology.${solSentence}`,
      asOf: r.asOf ?? data?.updatedAt ?? null,
      rows: [
        { label: "Countable on-chain agent identities", value: fmt(floor), note: "floor, not total" },
        { label: "ERC-8004 registered agents", value: fmt(erc), note: `${fmt(r.chainsTracked)} chains` },
        { label: "Virtuals launched agents", value: fmt(launched), note: "Base" },
        { label: "Virtuals ACP commerce agents", value: fmt(acp), note: "subset of launched" },
        ...(solTotal
          ? [
              { label: "Solana registry agents", value: fmt(solTotal), note: "upper bound · outside floor" },
              ...solRegs.map((x) => ({
                label: `— ${String(x.label ?? x.key ?? "")}`,
                value: fmt(x.accounts),
                note: shortId(String(x.program ?? "")),
              })),
            ]
          : []),
      ],
      chart: {
        kind: "bars",
        title: "Registered agent identities by registry family (Solana = upper bound, not in floor)",
        unit: "agents",
        points: [
          { label: "ERC-8004", value: erc },
          { label: "Virtuals launched", value: launched },
          { label: "Virtuals ACP", value: acp },
          ...(solTotal ? [{ label: "Solana (upper bound)", value: solTotal }] : []),
        ],
      },
      extraFaq: [
        {
          q: "Is this the total number of AI agents in the world?",
          a: "No — it is the number of agent identities registered on-chain, which is the only precisely countable subset. Most deployed AI agents never touch a blockchain and cannot be counted by any public methodology.",
        },
        {
          q: "Are there 9,000+ agents on Solana?",
          a: "No. That is a Solana Foundation marketing figure the on-chain counts do not support — the two Solana agent registries this census reads via getProgramAccounts hold roughly 2.9K accounts combined, and even those are upper bounds.",
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

// ─── on-chain agent economy size ─────────────────────────────────────────────
const agentEconomySize: StatDoc = {
  slug: "how-big-is-the-agent-economy",
  question: "How big is the on-chain agent economy?",
  shortTitle: "On-chain agent economy size",
  seoDescription:
    "The measured size of the on-chain agent economy: total events across seven protocol families plus settled stablecoin volume — observed data, not a forecast.",
  related: ["x402-transactions", "how-many-ai-agents-are-onchain", "virtuals-acp-activity"],
  sources: [
    { label: "agent economy data.json (live feed)", url: "https://agenteconomy.to/data.json" },
    {
      label: "McKinsey — the agentic commerce opportunity (forecast, for contrast)",
      url: "https://www.mckinsey.com/capabilities/quantumblack/our-insights/the-agentic-commerce-opportunity-how-ai-agents-are-ushering-in-a-new-era-for-consumers-and-merchants",
    },
    {
      label: "CoinDesk — Keyrock: crypto rails becoming default AI-agent payment layer (May 2026)",
      url: "https://www.coindesk.com/business/2026/05/21/crypto-rails-are-becoming-the-default-payment-layer-for-ai-agents-report-says",
    },
  ],
  sections: [
    {
      heading: "Measured size vs forecast size",
      body: [
        "Most published answers to “how big is the agent economy” are forecasts of future commerce — McKinsey's trillions by 2030, Juniper's multi-billion agentic-commerce curves — or enterprise-software market sizing that has nothing to do with on-chain activity. This page answers a narrower, checkable question: how much agent-protocol activity is observable on public blockchains right now. That means transaction and event counts across seven protocol families (x402, ERC-8004, Virtuals ACP, Olas, Tempo MPP, Masumi, and Base's agentic ecosystem), plus the stablecoin volume x402 settlement actually moved.",
        "The two kinds of numbers answer different questions and should not be blended. A forecast prices the opportunity; a measurement prices the present. When a report says agents will transact trillions, and the measured settled volume is in the tens of millions, both can be true — the gap is the distance between thesis and adoption, and tracking that gap over time is precisely what this dataset is for.",
      ],
    },
    {
      heading: "What counts as 'the agent economy' here",
      body: [
        "Inclusion is protocol-level, not vibe-level: an event counts if it is emitted by one of the tracked agent-protocol families on a public chain. Events are not dollars — a registry registration, a commerce memo, and a payment settlement are different units, which is why the table below keeps them as separate rows and only x402 carries a USD volume figure. Double counting is possible where protocols overlap (an ACP job can settle via a payment rail), so the total is best read as an activity index, not a census of unique economic acts.",
      ],
    },
  ],
  build: ({ data }) => {
    if (!data) return null;
    const num2 = (v: unknown) => (Number.isFinite(Number(v)) ? Number(v) : 0);
    const parts = [
      { label: "x402 settlements", value: num2(data.x402?.totalTxs) },
      { label: "Olas agent transactions", value: num2(data.olas?.totalTxs) },
      { label: "Virtuals ACP memos", value: num2(data.virtualsAcp?.totalMemos) },
      { label: "ERC-8004 registrations", value: num2(data.erc8004Registry?.totalAgents) },
      { label: "Base agentic transactions", value: num2(data.baseAgentic?.totalTxs) },
      { label: "Tempo MPP events", value: num2(data.tempoMpp?.totalEvents) },
    ];
    const total = parts.reduce((s, p) => s + p.value, 0);
    if (!total) return null;
    const stamp = asOfLabel(data.updatedAt) ?? "the latest pipeline run";
    return {
      answer: `As of ${stamp}, the measured on-chain agent economy spans ${fmt(total)} cumulative events across seven protocol families, including ${fmt(data.x402?.totalTxs)} x402 payment settlements that moved ${usd(data.x402?.totalVolume)} in stablecoins. This is observed on-chain activity — not a market forecast — and it refreshes hourly from the open dataset.`,
      asOf: data.updatedAt ?? null,
      rows: [
        { label: "Total tracked events (all protocols)", value: fmt(total), note: "activity index" },
        { label: "x402 settled volume", value: usd(data.x402?.totalVolume) },
        ...parts.map((p) => ({ label: `— ${p.label}`, value: fmt(p.value) })),
      ],
      chart: {
        kind: "bars",
        title: "Cumulative events by protocol family",
        unit: "events",
        points: parts.map((p) => ({ label: p.label.split(" ")[0], value: p.value })),
      },
      extraFaq: [
        {
          q: "Is the agent economy really worth trillions?",
          a: "Trillion-dollar figures are forecasts of future agentic commerce (McKinsey projects $3–5T by 2030), not measurements. The measured on-chain footprint today — the number on this page — is many orders of magnitude smaller. Both numbers are useful; confusing them is not.",
        },
      ],
    };
  },
};

// ─── x402 daily transactions ─────────────────────────────────────────────────
const x402Daily: StatDoc = {
  slug: "x402-daily-transactions",
  question: "How many x402 transactions happen per day?",
  shortTitle: "x402 daily transactions",
  seoDescription:
    "The current daily x402 transaction rate with a 60-day trend, measured from public on-chain settlement activity and refreshed hourly.",
  protocolSlug: "x402",
  related: ["x402-transactions", "average-x402-transaction-size"],
  sources: [
    { label: "agent economy data.json (live feed)", url: "https://agenteconomy.to/data.json" },
    {
      label: "CoinDesk — micropayment demand skepticism (Mar 2026)",
      url: "https://www.coindesk.com/markets/2026/03/11/coinbase-backed-ai-payments-protocol-wants-to-fix-micropayment-but-demand-is-just-not-there-yet",
    },
  ],
  sections: [
    {
      heading: "The daily rate is the honest growth signal",
      body: [
        "Cumulative totals only ever go up, which makes them flattering and mostly useless for judging momentum. The daily series is where the real story lives: whether agent payments are accelerating, plateauing, or decaying after each hype cycle. This page publishes the last 60 days of daily x402 settlements exactly as measured, without smoothing.",
        "Daily figures are volatile by nature — a single high-frequency service coming online or going quiet can move the day count materially. Read the trend across weeks, not single days, and read it alongside the average-transaction-size series to tell whether volume is broadening or concentrating.",
      ],
    },
  ],
  build: ({ data }) => {
    const x = data?.x402;
    const daily = arr(x?.daily);
    if (!daily.length) return null;
    const latest = daily.at(-1) ?? {};
    const points = daily.slice(-60).map((d) => ({ label: String(d.day ?? "").slice(5), value: num(d.txs) }));
    const last7 = daily.slice(-7).reduce((s, d) => s + num(d.txs), 0);
    const stamp = asOfLabel(x?.asOf ?? data?.updatedAt) ?? "the latest pipeline run";
    return {
      answer: `As of ${stamp}, x402 processed ${fmt(latest.txs)} transactions on ${String(latest.day ?? "the latest measured day")}, and ${fmt(last7)} over the trailing seven days. The daily series below is measured from public on-chain settlement activity, unsmoothed.`,
      asOf: x?.asOf ?? data?.updatedAt ?? null,
      rows: [
        { label: "Latest daily transactions", value: fmt(latest.txs), note: String(latest.day ?? "") },
        { label: "Trailing 7-day transactions", value: fmt(last7) },
        { label: "Cumulative transactions", value: fmt(x?.totalTxs) },
      ],
      chart: { kind: "line", title: "Daily x402 transactions (last 60 days)", unit: "txs/day", points },
    };
  },
};

// ─── x402 facilitators ───────────────────────────────────────────────────────
const x402Facilitators: StatDoc = {
  slug: "x402-facilitators",
  question: "How many x402 facilitators are there — and who is the largest?",
  shortTitle: "x402 facilitator landscape",
  seoDescription:
    "How many x402 facilitators operate today, which one settles the most volume, and how concentrated the facilitator layer is — measured on-chain.",
  protocolSlug: "x402",
  related: ["x402-transactions", "x402-daily-transactions"],
  sources: [
    { label: "agent economy data.json (live feed)", url: "https://agenteconomy.to/data.json" },
    { label: "Dune · x402 facilitator registry (community-maintained)", url: "https://dune.com/queries/6054244" },
  ],
  sections: [
    {
      heading: "Why facilitator concentration matters",
      body: [
        "A facilitator verifies x402 payment payloads and settles them on-chain, so resource servers don't have to run blockchain infrastructure. That convenience creates a structural question: if most settlements route through one or two facilitators, the 'open' payment standard has a de-facto gatekeeper layer. The share table on this page is the live answer, measured from which facilitator addresses actually initiate settlements.",
        "Facilitator identity comes from a community-maintained on-chain registry, so new entrants appear in the measurement as they start settling. Share is computed over transaction counts; a facilitator specializing in fewer, larger payments will rank lower here than by volume.",
      ],
    },
  ],
  build: ({ data }) => {
    const x = data?.x402;
    const protos = arr(x?.protocols);
    if (!protos.length) return null;
    const stamp = asOfLabel(x?.asOf ?? data?.updatedAt) ?? "the latest pipeline run";
    const top = protos[0] ?? {};
    const top2 = num(top.share) + num((protos[1] ?? {}).share);
    return {
      answer: `As of ${stamp}, agent economy tracks ${fmt(x?.facilitatorsTracked)} x402 facilitators. ${String(top.name ?? "The leader")} is the largest at ${num(top.share)}% of settled transactions, and the top two facilitators together hold ${Math.round(top2 * 10) / 10}% — a concentration figure worth watching for an open standard.`,
      asOf: x?.asOf ?? data?.updatedAt ?? null,
      rows: [
        { label: "Facilitators tracked", value: fmt(x?.facilitatorsTracked) },
        ...protos.slice(0, 6).map((p) => ({ label: `— ${String(p.name)}`, value: `${num(p.share)}%`, note: "share of txs" })),
      ],
      chart: {
        kind: "bars",
        title: "Facilitator share of x402 transactions",
        unit: "% share",
        points: protos.slice(0, 6).map((p) => ({ label: String(p.name ?? ""), value: num(p.share) })),
      },
    };
  },
};

// ─── Virtuals ACP activity ───────────────────────────────────────────────────
const virtualsActivity: StatDoc = {
  slug: "virtuals-acp-activity",
  question: "How much agent-to-agent commerce happens on Virtuals ACP?",
  shortTitle: "Virtuals ACP activity",
  seoDescription:
    "Live Virtuals ACP activity: cumulative on-chain commerce memos, daily trend, and how to read agent-to-agent commerce honestly — independently measured.",
  protocolSlug: "virtuals-acp",
  related: ["how-many-ai-agents-are-onchain", "how-big-is-the-agent-economy"],
  sources: [
    { label: "agent economy data.json (live feed)", url: "https://agenteconomy.to/data.json" },
    { label: "Virtuals Protocol — ACP whitepaper", url: "https://whitepaper.virtuals.io/about-virtuals/agent-commerce-protocol-acp" },
  ],
  sections: [
    {
      heading: "The only independent ACP tracker",
      body: [
        "Virtuals publishes its own ACP figures, but self-reported platform metrics deserve an outside check. This page decodes ACP's NewMemo events directly from Base logs — every memo is an on-chain record in an agent-to-agent commerce lifecycle (request, negotiation, transaction, evaluation). The count here is what the chain shows, independent of what any platform dashboard claims.",
        "A memo is a lifecycle step, not a completed sale: one job produces multiple memos as it moves through phases. Memo counts therefore overstate completed commerce and are best read as workflow activity. For jobs and gross-value figures, Virtuals' own aGDP reporting is the (self-reported) source; the honest comparison is trend against trend.",
      ],
    },
  ],
  build: ({ data }) => {
    const v = data?.virtualsAcp;
    const daily = arr(v?.daily);
    if (!v || !daily.length) return null;
    const latest = daily.at(-1) ?? {};
    const points = daily.slice(-60).map((d) => ({ label: String(d.day ?? "").slice(5), value: num(d.memos) }));
    const stamp = asOfLabel(v.asOf ?? data?.updatedAt) ?? "the latest pipeline run";
    return {
      answer: `As of ${stamp}, ${fmt(v.totalMemos)} cumulative Virtuals ACP commerce memos have been recorded on Base — each one an on-chain step in an agent-to-agent job lifecycle, decoded independently from public logs rather than taken from platform reporting.`,
      asOf: v.asOf ?? data?.updatedAt ?? null,
      rows: [
        { label: "Cumulative commerce memos", value: fmt(v.totalMemos) },
        { label: "Latest daily memos", value: fmt(latest.memos), note: String(latest.day ?? "") },
        { label: "Latest daily unique senders", value: fmt(latest.senders), note: String(latest.day ?? "") },
      ],
      chart: { kind: "line", title: "Daily ACP memos (last 60 days)", unit: "memos/day", points },
    };
  },
};

// ─── Olas transactions ───────────────────────────────────────────────────────
const olasTransactions: StatDoc = {
  slug: "olas-transactions",
  question: "How many transactions have Olas agents made?",
  shortTitle: "Olas transaction count",
  seoDescription:
    "The live cumulative Olas autonomous-agent transaction count, weekly trend, and chain distribution — with the Gnosis-concentration caveat made explicit.",
  protocolSlug: "olas",
  related: ["how-big-is-the-agent-economy", "how-many-ai-agents-are-onchain"],
  sources: [
    { label: "agent economy data.json (live feed)", url: "https://agenteconomy.to/data.json" },
    { label: "Dune · Olas ecosystem activity (@adrian0x)", url: "https://dune.com/adrian0x/autonolas-activity" },
  ],
  sections: [
    {
      heading: "Autonomous services leave a different trail",
      body: [
        "Olas agents are continuously-running autonomous services — prediction-market traders, DeFi automations, governance agents — so their transaction trail reflects ongoing operation rather than one-off payments. The weekly series is the right grain for this: service activity is lumpy across days but legible across weeks.",
        "One caveat dominates interpretation: the large majority of measured Olas activity settles on Gnosis, so the aggregate curve mostly tracks Gnosis-based services. The per-chain rows below keep that visible rather than flattening it into one number.",
      ],
    },
  ],
  build: ({ data }) => {
    const o = data?.olas;
    const weekly = arr(o?.weekly);
    if (!o || !weekly.length) return null;
    const latest = weekly.at(-1) ?? {};
    const points = weekly.slice(-26).map((w) => ({ label: String(w.week ?? "").slice(5), value: num(w.txs) }));
    const chains = arr(o.chains);
    const top = chains[0] ?? {};
    const share = num(o.totalTxs) > 0 ? Math.round((num(top.txs) / num(o.totalTxs)) * 1000) / 10 : 0;
    const stamp = asOfLabel(o.asOf ?? data?.updatedAt) ?? "the latest pipeline run";
    return {
      answer: `As of ${stamp}, Olas autonomous agents have made ${fmt(o.totalTxs)} cumulative on-chain transactions across ${fmt(chains.length)} chains. ${String(top.name ?? "Gnosis")} dominates with ${fmt(top.txs)} transactions — ${share}% of the tracked total — so the aggregate trend largely reflects Gnosis-based services.`,
      asOf: o.asOf ?? data?.updatedAt ?? null,
      rows: [
        { label: "Cumulative transactions", value: fmt(o.totalTxs) },
        { label: "Latest weekly transactions", value: fmt(latest.txs), note: `week of ${String(latest.week ?? "")}` },
        { label: "Largest chain", value: String(top.name ?? "—"), note: `${share}% of total` },
        { label: "Chains tracked", value: fmt(chains.length) },
      ],
      chart: { kind: "line", title: "Weekly Olas transactions (last 26 weeks)", unit: "txs/week", points },
    };
  },
};

// ─── Tempo MPP stats ─────────────────────────────────────────────────────────
const tempoStats: StatDoc = {
  slug: "tempo-mpp-stats",
  question: "How much activity does Tempo's Machine Payments Protocol have?",
  shortTitle: "Tempo MPP activity",
  seoDescription:
    "Live Tempo MPP statistics — indexed channel events, unique payers and payees, and the daily trend — from a direct Tempo RPC indexer, honestly scoped.",
  protocolSlug: "tempo-mpp",
  related: ["x402-transactions", "how-big-is-the-agent-economy"],
  sources: [
    { label: "agent economy data.json (live feed)", url: "https://agenteconomy.to/data.json" },
    { label: "Fortune — Stripe, Tempo, Paradigm launch MPP (Mar 2026)", url: "https://fortune.com/2026/03/18/stripe-tempo-paradigm-mpp-ai-payments-protocol/" },
  ],
  sections: [
    {
      heading: "Early infrastructure, measured directly",
      body: [
        "Tempo MPP is the youngest protocol family in the dataset — a Stripe-and-Tempo-designed machine-payments standard whose mainnet history began in 2026. agent economy indexes it directly from Tempo RPC rather than through a third-party dashboard, which means narrow but first-hand coverage: channel lifecycle events (opens, closes, settlements, top-ups), unique payer and payee addresses, and a daily series.",
        "These are early-adoption numbers and should be read that way. Address counts are not customer counts, channel events are not payments one-to-one, and a young protocol's growth curve says more about integration announcements than steady-state demand. What makes the series valuable is that it starts at the beginning — the full history of a payment standard, measured from block one of its adoption.",
      ],
    },
  ],
  build: ({ data }) => {
    const t = data?.tempoMpp;
    const daily = arr(t?.daily);
    if (!t || !num(t.totalEvents)) return null;
    const latest = daily.at(-1) ?? {};
    const points = daily.slice(-60).map((d) => ({ label: String(d.day ?? "").slice(5), value: num(d.events) }));
    const stamp = asOfLabel(data?.updatedAt) ?? "the latest pipeline run";
    return {
      answer: `As of ${stamp}, agent economy has indexed ${fmt(t.totalEvents)} Tempo MPP channel events from ${fmt(t.uniquePayers)} unique payer addresses and ${fmt(t.uniquePayees)} unique payees, measured directly from Tempo RPC since the protocol's mainnet debut.`,
      asOf: data?.updatedAt ?? null,
      rows: [
        { label: "Total MPP events", value: fmt(t.totalEvents) },
        { label: "Unique payers", value: fmt(t.uniquePayers) },
        { label: "Unique payees", value: fmt(t.uniquePayees) },
        { label: "Latest daily events", value: fmt(latest.events), note: String(latest.day ?? "") },
      ],
      chart: points.length >= 2 ? { kind: "line", title: "Daily Tempo MPP events (last 60 days)", unit: "events/day", points } : undefined,
    };
  },
};

// ─── Base agentic ecosystem ──────────────────────────────────────────────────
const baseAgentic: StatDoc = {
  slug: "base-agentic-activity",
  question: "How active is Base's agentic ecosystem?",
  shortTitle: "Base agentic activity",
  seoDescription:
    "Live Base agentic-ecosystem activity: daily consumer and infrastructure transactions from agent-related contracts, measured on-chain.",
  related: ["x402-transactions", "virtuals-acp-activity", "how-big-is-the-agent-economy"],
  sources: [
    { label: "agent economy data.json (live feed)", url: "https://agenteconomy.to/data.json" },
    { label: "Dune · BASE agentic ecosystem (@ax1research)", url: "https://dune.com/ax1research" },
  ],
  sections: [
    {
      heading: "The chain where agent activity clusters",
      body: [
        "Base is where the agent economy's protocol families overlap most: it is the largest x402 settlement chain, the home of Virtuals ACP, and the deployment target for a long tail of agent-related contracts. This series tracks that broader ecosystem — transactions touching agent-related contracts on Base, split into consumer and infrastructure categories — as context around the protocol-specific counts.",
        "Ecosystem counts are the loosest unit in the dataset: contract categorization is curated upstream and evolves, and 'agent-related' is a judgment call at the margins. That is why this series is presented as ecosystem context rather than folded into any protocol's headline number.",
      ],
    },
  ],
  build: ({ data }) => {
    const b = data?.baseAgentic;
    const daily = arr(b?.daily);
    if (!b || !daily.length) return null;
    const latest = daily.at(-1) ?? {};
    const points = daily.slice(-60).map((d) => ({ label: String(d.day ?? "").slice(5), value: num(d.total) }));
    const stamp = asOfLabel(b.asOf ?? data?.updatedAt) ?? "the latest pipeline run";
    return {
      answer: `As of ${stamp}, Base's agentic ecosystem has produced ${fmt(b.totalTxs)} transactions across the tracked window, with ${fmt(latest.total)} on ${String(latest.day ?? "the latest measured day")} (${fmt(latest.consumer)} consumer, ${fmt(latest.infrastructure)} infrastructure).`,
      asOf: b.asOf ?? data?.updatedAt ?? null,
      rows: [
        { label: "Tracked-window transactions", value: fmt(b.totalTxs) },
        { label: "Latest daily total", value: fmt(latest.total), note: String(latest.day ?? "") },
        { label: "— consumer", value: fmt(latest.consumer) },
        { label: "— infrastructure", value: fmt(latest.infrastructure) },
      ],
      chart: { kind: "line", title: "Daily Base agentic transactions (last 60 days)", unit: "txs/day", points },
    };
  },
};

// ─── MCP server count ────────────────────────────────────────────────────────
const mcpServers: StatDoc = {
  slug: "how-many-mcp-servers-are-there",
  question: "How many MCP servers are there?",
  shortTitle: "MCP server count",
  seoDescription:
    "The current count of MCP (Model Context Protocol) servers in the official registry and on Smithery, tracked as the supply side of the agent economy.",
  related: ["how-many-ai-agents-are-onchain", "how-big-is-the-agent-economy"],
  sources: [
    { label: "agent economy web-sources.json (live feed)", url: "https://agenteconomy.to/web-sources.json" },
    { label: "Official MCP registry", url: "https://registry.modelcontextprotocol.io/" },
    { label: "Smithery", url: "https://smithery.ai/" },
  ],
  sections: [
    {
      heading: "Why a server count belongs in an agent-economy dataset",
      body: [
        "MCP servers are the supply side of the agent economy: each one is a capability an agent can call — and increasingly, pay for. Counting them tracks how much machine-callable surface area exists, the same way counting storefronts tracks a retail economy. agent economy counts the official MCP registry by walking its full API (no sampling), with Smithery's directory as a second, partially-overlapping measure.",
        "Registry counts are supply, not demand: a listed server may be popular, abandoned, or duplicated across directories, and the two directories overlap in unknown proportion — which is why they are reported side by side rather than summed. Directionally, the growth of these registries is one of the cleanest adoption signals the agent ecosystem has.",
      ],
    },
  ],
  build: ({ web }) => {
    const official = Number(web?.agentSupply?.officialMcpServers) || 0;
    const smithery = Number(web?.agentSupply?.smitheryMcpServers) || 0;
    if (!official) return null;
    const stamp = asOfLabel(web?.updatedAt) ?? "the latest crawl";
    return {
      answer: `As of ${stamp}, the official MCP registry lists ${fmt(official)} servers, and Smithery's directory lists ${fmt(smithery)} — two partially-overlapping measures of how many machine-callable services agents can reach. Counts come from full registry walks, not samples, and refresh with the web-sources pipeline.`,
      asOf: web?.updatedAt ?? null,
      rows: [
        { label: "Official MCP registry servers", value: fmt(official) },
        { label: "Smithery directory servers", value: fmt(smithery), note: "overlaps official registry" },
      ],
      chart: {
        kind: "bars",
        title: "MCP servers by directory",
        unit: "servers",
        points: [
          { label: "Official registry", value: official },
          { label: "Smithery", value: smithery },
        ],
      },
      extraFaq: [
        {
          q: "Can these two counts be added together?",
          a: "No — the directories overlap in unknown proportion, so summing them double-counts. Report them side by side, or pick the official registry as the conservative single figure.",
        },
      ],
    };
  },
};

// ─── which agent standards are actually adopted ──────────────────────────────
const standardsAdoption: StatDoc = {
  slug: "which-agent-standards-are-actually-adopted",
  question: "Which AI agent standards are actually adopted on the web?",
  shortTitle: "Agent-standard web adoption",
  seoDescription:
    "How many top web domains serve each AI-agent standard — x402, AP2, UCP, MCP, A2A, ACP — from Cloudflare Radar's weekly scan, with counts and MoM change.",
  related: ["how-many-mcp-servers-are-there", "how-many-ai-agents-are-onchain", "x402-transactions"],
  sources: [
    { label: "agent economy web-sources.json (live feed)", url: "https://agenteconomy.to/web-sources.json" },
    { label: "Cloudflare Radar — AI Insights (agent readiness)", url: "https://radar.cloudflare.com/ai-insights" },
    { label: "Is It Agent Ready?", url: "https://isitagentready.com" },
  ],
  sections: [
    {
      heading: "Adoption here is a weekly scan, not a live counter",
      body: [
        "These figures come from a weekly agent-readiness scan of the top web domains, so the as-of stamp on this page is a data week, not a single day. A value that ticks up between Monday and Thursday is the same weekly measurement re-read; treating it as a daily series over-reads noise that is not there. Month-over-month change compares this week's scan against the scan from roughly a month earlier — the honest grain for a signal that moves slowly.",
      ],
    },
    {
      heading: "Why these shares cannot be compared to each other",
      body: [
        "Each check has a different meaningful denominator, so ranking standards by their bare share across all domains is a category error. x402 is a payment header for paid content and APIs — it only belongs on the small slice of sites that actually sell access — so its share against every crawled domain understates its penetration of the sites where it would ever appear. AP2, MPP and ACP are similarly niche. A crawl-control file that belongs on every website and a payment endpoint meant for a few thousand commerce sites are not on the same axis. The counts below are raw domain matches; the shares are shown for scale, never for cross-standard ranking.",
      ],
    },
    {
      heading: "The UCP number to distrust",
      body: [
        "UCP's count sits an order of magnitude above every other agent standard, and that gap is most likely a detection artifact rather than real adoption. The scan's UCP check reads as a loose heuristic that over-matches domains which do not actually implement the Universal Commerce Protocol. Treat the UCP row as a suspected over-count, and weight the smaller, stricter checks — MCP server cards, A2A agent cards, x402 — more heavily when reading genuine adoption.",
      ],
    },
  ],
  build: ({ web }) => {
    const s = web?.standardsAdoption;
    if (!s || !Array.isArray(s.rows)) return null;
    const denom = num(s.meta?.successfulDomains);
    if (!denom) return null;
    const cur = new Map(s.rows.map((r): [string, number] => [String(r.check), num(r.value)]));
    const prev = s.prevMonth && Array.isArray(s.prevMonth.rows)
      ? new Map(s.prevMonth.rows.map((r): [string, number] => [String(r.check), num(r.value)]))
      : null;

    const pct = (share: number): string => {
      const p = share * 100;
      if (p === 0) return "0%";
      if (p >= 1) return `${p.toFixed(2)}%`;
      if (p >= 0.01) return `${p.toFixed(3)}%`;
      return `${p.toFixed(4)}%`;
    };
    const momStr = (key: string): string => {
      // A key missing from the prior-month scan is not zero — coercing it to 0
      // fabricates growth. Render "—" (not measurable) instead.
      if (!prev || !prev.has(key)) return "—";
      const d = num(cur.get(key)) - num(prev.get(key));
      if (d === 0) return "±0";
      return `${d > 0 ? "+" : "-"}${fmt(Math.abs(d))}`;
    };

    const stdRows = AGENT_STANDARDS.map(({ key, label }) => {
      const count = num(cur.get(key));
      return { label, value: fmt(count), note: `${pct(count / denom)} of domains · MoM ${momStr(key)}` };
    });

    const x402c = num(cur.get("x402"));
    const ap2c = num(cur.get("ap2"));
    const ucpc = num(cur.get("ucp"));
    const mcpc = num(cur.get("mcpServerCard"));
    const a2ac = num(cur.get("a2aAgentCard"));
    const week = asOfLabel(s.meta?.date) ?? asOfLabel(s.asOf) ?? "the latest scan";

    return {
      answer: `In the week of ${week}, of the ${fmt(denom)} top web domains a Cloudflare Radar agent-readiness scan successfully crawled, only ${fmt(x402c)} serve x402 payments and exactly ${fmt(ap2c)} advertises an AP2 agent-payment endpoint — the two most-hyped agent-commerce standards are, in raw web adoption, effectively at zero. The broadest signal, UCP, matches ${fmt(ucpc)} domains (a suspected over-detection), while ${fmt(mcpc)} publish an MCP server card and ${fmt(a2ac)} an A2A agent card.`,
      asOf: s.asOf ?? null,
      rows: [
        { label: "Top domains scanned", value: fmt(denom), note: `of ${fmt(num(s.meta?.totalDomains))} crawled · data week ${String(s.meta?.date ?? "")}` },
        ...stdRows,
      ],
      chart: {
        kind: "bars",
        // Zero-count checks (e.g. WebMCP) stay in the table above as honest data,
        // but a zero-height bar just adds noise — drop them from the chart.
        title: "Domains serving each agent standard (raw counts — shares not comparable)",
        unit: "domains",
        points: AGENT_STANDARDS.map(({ key, label }) => ({ label, value: num(cur.get(key)) })).filter((p) => p.value > 0),
      },
      extraFaq: [
        {
          q: "Does a low x402 domain count mean x402 is failing?",
          a: "No — x402 is a payment standard for paid content and APIs, so it only belongs on the small subset of sites that sell access. Its share across all crawled domains understates its penetration of the sites where it would ever appear, and on-chain x402 settlement counts (millions of transactions) tell a very different story from web-domain presence.",
        },
        {
          q: "Why is the UCP number so much higher than the others?",
          a: "It is almost certainly a detection artifact. The scan's UCP check reads as a loose heuristic that over-matches domains, so the UCP row should be treated as a suspected over-count rather than real adoption of the Universal Commerce Protocol.",
        },
      ],
    };
  },
};

// ─── AI inference demand (off-chain context) ─────────────────────────────────
const inferenceDemand: StatDoc = {
  slug: "how-much-ai-inference-demand-is-there",
  question: "How much AI inference demand is there?",
  shortTitle: "AI inference demand",
  seoDescription:
    "How much LLM inference the agent era is buying: daily token volume across OpenRouter's public models over a trailing window — a demand-side context signal.",
  related: ["how-many-mcp-servers-are-there", "how-big-is-the-agent-economy", "which-agent-standards-are-actually-adopted"],
  sources: [
    { label: "agent economy web-sources.json (live feed)", url: "https://agenteconomy.to/web-sources.json" },
    { label: "OpenRouter — model rankings", url: "https://openrouter.ai/rankings" },
  ],
  sections: [
    {
      heading: "Demand-side context, not on-chain data",
      body: [
        "Every other number on this site is measured on-chain. This one is not: it is a demand-side context metric — how much large-language-model inference the public models ranked on OpenRouter are serving — included because agent activity is downstream of inference. When token throughput grows, the population of running agents that could eventually transact on-chain grows with it. It is context for the on-chain series, not a substitute for them.",
        "The figure sums daily token usage across the top-50 public models on OpenRouter plus an aggregated “other” row, over a trailing default window. It captures only traffic routed through OpenRouter — a large, public, but partial slice of all inference — so read it as a directional demand indicator, not a census of every AI token served.",
      ],
    },
    {
      heading: "Why the token totals are not comparable across models",
      body: [
        "Different model families use different tokenizers, so one provider's token is not the same unit of text as another's. Summing tokens across models therefore mixes units — the total is a useful trend line for aggregate demand, but it is not a precise, apples-to-apples count, and per-model comparisons drawn from it would mislead. The daily series below is most valuable read as a shape over time, not as an exact quantity.",
      ],
    },
  ],
  build: ({ web }) => {
    const i = web?.inferenceDemand;
    const days = arr(i?.days);
    if (!i || !num(i.totalTokens) || days.length < 2) return null;
    const totalTokens = num(i.totalTokens);
    const win = num(i.windowDays) || days.length;
    const avg = totalTokens / win;
    const last = days.at(-1) ?? {};
    const attribution = String(i.attribution ?? "Source: OpenRouter (openrouter.ai/rankings)");
    const points = days.map((d) => ({
      label: String(d.date ?? "").slice(5),
      value: Math.round(num(d.tokens) / 1e10) / 100, // trillions, 2 dp
    }));
    const stamp = asOfLabel(i.asOf ?? web?.updatedAt) ?? "the latest crawl";
    return {
      answer: `Over the ${fmt(win)} days ending ${stamp}, the public models ranked on OpenRouter processed about ${tokensT(totalTokens)} of inference — roughly ${tokensT(avg)} per day. This is a demand-side context metric for the agent economy (off-chain), not on-chain activity: agent transactions are downstream of the inference that powers them. ${attribution}.`,
      asOf: i.asOf ?? web?.updatedAt ?? null,
      rows: [
        { label: `Total inference (${fmt(win)}-day window)`, value: tokensT(totalTokens), note: "demand-side context" },
        { label: "Daily average", value: tokensT(avg), note: "per day" },
        { label: "Latest measured day", value: tokensT(num(last.tokens)), note: String(last.date ?? "") },
        { label: "Attribution", value: attribution },
      ],
      chart: { kind: "line", title: "Daily AI inference demand (trailing window)", unit: "T tokens/day", points },
      extraFaq: [
        {
          q: "Is this the total amount of AI inference in the world?",
          a: "No. It counts only inference routed through OpenRouter across the public models it ranks — a large but partial slice. It also mixes model-specific tokenizers, so the total is a directional demand indicator, not an exact, universal token count.",
        },
      ],
    };
  },
};

// Labeled external benchmark — Keyrock's May 2026 report, co-published with
// Coinbase, Tempo and Virtuals (the issuer + rails with the most to gain), so it
// is NOT an independent source and is cited only with that caveat. Per the
// never-cite / caveat rules in scripts/research/DATA-RADAR-2026-07.md in the
// dashboard repo. This is the single sanctioned hardcoded stat on the page.
const KEYROCK_BENCHMARK_2026_05 = { sharePct: 98.6, payments: "176M" } as const;

// ─── USDC share of agent payments (gated on x402 token-split data) ────────────
const usdcShare: StatDoc = {
  slug: "usdc-share-of-agent-payments",
  question: "What share of agent payments are settled in USDC?",
  shortTitle: "USDC share of agent payments",
  seoDescription:
    "The live USDC share of on-chain agent payments, measured from x402 settlement data and checked against the Keyrock report's non-independent 98.6% headline.",
  protocolSlug: "x402",
  related: ["x402-transactions", "average-x402-transaction-size", "how-big-is-the-agent-economy"],
  // Gated: this page only exists once the x402 token-split feed has landed with a
  // finite USDC-share percent.
  available: ({ web }) => Number.isFinite(web?.x402TokenSplit?.usdcSharePct),
  sources: [
    { label: "agent economy web-sources.json (live feed)", url: "https://agenteconomy.to/web-sources.json" },
    {
      label: "CoinDesk — Keyrock: crypto rails becoming default AI-agent payment layer (May 2026)",
      url: "https://www.coindesk.com/business/2026/05/21/crypto-rails-are-becoming-the-default-payment-layer-for-ai-agents-report-says",
    },
  ],
  sections: [
    {
      heading: "Why token concentration is the number to watch",
      body: [
        "If agent payments settle overwhelmingly in one stablecoin, that token becomes critical infrastructure for the whole agent economy — an outage, a de-peg, or a compliance freeze would propagate straight into agent commerce. Concentration is a systemic fact worth measuring directly rather than assuming. This page reports the live token split of the x402 settlements agent economy observes on-chain, recomputed from the settlement data rather than taken from any issuer's reporting.",
      ],
    },
    {
      heading: "Reading the benchmark honestly",
      body: [
        "The most-cited external figure comes from Keyrock's May 2026 report, which found USDC settling the large majority of the agent payments it studied. That report was co-published with Coinbase, Tempo and Virtuals — the issuer and rails with the most to gain from a “crypto is the default” narrative — so it is not an independent source, and its 98.6% headline should be read with that conflict in mind. The on-chain figure on this page is measured independently; where it agrees or disagrees with the benchmark is exactly the useful comparison.",
      ],
    },
  ],
  build: ({ web }) => {
    const x = web?.x402TokenSplit;
    if (!x || !Number.isFinite(x.usdcSharePct)) return null;
    // usdcSharePct arrives as a percent (0–100); use it directly, one decimal.
    const pct = Math.round(x.usdcSharePct * 10) / 10;
    const stamp = asOfLabel(x.asOf ?? web?.updatedAt) ?? "the latest crawl";

    const rows: { label: string; value: string; note?: string }[] = [
      { label: "USDC share of agent payments", value: `${pct}%`, note: "measured on-chain" },
    ];
    if (num(x.totalPayments)) {
      rows.push({ label: "Payments measured", value: fmt(x.totalPayments), note: x.windowDays ? `${fmt(x.windowDays)}-day window` : undefined });
    }
    rows.push({
      label: "Keyrock benchmark (May 2026)",
      value: `${KEYROCK_BENCHMARK_2026_05.sharePct}%`,
      note: `${KEYROCK_BENCHMARK_2026_05.payments} payments · not independent`,
    });

    const chart: ChartSpec = {
      kind: "bars",
      title: "USDC share of agent payments — measured vs Keyrock benchmark",
      unit: "% share",
      points: [
        { label: "Measured (on-chain)", value: pct },
        { label: "Keyrock (not independent)", value: KEYROCK_BENCHMARK_2026_05.sharePct },
      ],
    };

    return {
      answer: `As of ${stamp}, ${pct}% of the on-chain agent payments agent economy measures are settled in USDC, computed directly from x402 settlement data. For comparison, Keyrock's May 2026 report — co-published with Coinbase, Tempo and Virtuals, and therefore not an independent source — put USDC at ${KEYROCK_BENCHMARK_2026_05.sharePct}% of ${KEYROCK_BENCHMARK_2026_05.payments} payments.`,
      asOf: x.asOf ?? web?.updatedAt ?? null,
      rows,
      chart,
      extraFaq: [
        {
          q: `Is USDC really ${KEYROCK_BENCHMARK_2026_05.sharePct}% of agent payments?`,
          a: "That figure is from Keyrock's May 2026 report, which was co-published with Coinbase, Tempo and Virtuals and is not independent. The independently-measured on-chain share on this page is the check on that headline.",
        },
      ],
    };
  },
};

// ─── what is the agent economy (definitional) ────────────────────────────────
// The top-of-funnel question an assistant is asked before any number question.
// It lived only as prose on /about, so the site had no citable definition —
// which is the one answer worth owning, since it frames every figure below it.
const whatIsAgentEconomy: StatDoc = {
  slug: "what-is-the-agent-economy",
  question: "What is the agent economy?",
  shortTitle: "What the agent economy is",
  seoDescription:
    "What the agent economy is, defined by measurement: autonomous agents paying, registering and transacting on public blockchains — with its current observed size.",
  related: ["how-big-is-the-agent-economy", "how-many-ai-agents-are-onchain", "x402-transactions"],
  sources: [
    { label: "agent economy data.json (live feed)", url: "https://agenteconomy.to/data.json" },
    { label: "x402 — HTTP 402 payment standard", url: "https://www.x402.org/" },
    { label: "ERC-8004 — trustless agents registry", url: "https://eips.ethereum.org/EIPS/eip-8004" },
  ],
  sections: [
    {
      heading: "A definition you can check",
      body: [
        "The agent economy is the set of economic actions that autonomous software agents perform on their own account — paying for a resource, registering an identity, hiring another agent, settling a job — rather than a human clicking through a checkout. The phrase is used loosely enough to mean almost anything, so this site pins it to something falsifiable: activity emitted by agent-specific protocols onto public blockchains, where anyone can recount it from the raw chain data.",
        "That definition deliberately excludes a great deal. It excludes agents that merely read or summarise, because reading leaves no economic trace. It excludes agentic checkout flows that settle on private card rails, because those are not publicly measurable. And it excludes forecasts of what agents will spend, because a projection is a thesis, not an observation. What remains is narrower than the headlines and has the advantage of being verifiable.",
      ],
    },
    {
      heading: "The four things agents actually do on-chain",
      body: [
        "Measured activity falls into four kinds, and blending them produces nonsense. Payment: an agent pays per request over HTTP, which is what the x402 standard encodes and where stablecoin volume is observable. Identity: an agent registers itself in a public registry such as ERC-8004, which is a one-time act, not ongoing usage. Commerce: agents negotiate and settle jobs with each other, which Virtuals ACP records as lifecycle memos. Autonomous operation: agent services transact continuously on their own, which is most of what Olas activity represents.",
        "Each kind has its own unit — settlements, registrations, memos, transactions — and this site keeps them separate for that reason. A registry with a large agent count is not a busy economy, and a busy payment rail is not proof of end-user demand. Reading the four together, and watching which one grows, is more informative than any single headline number.",
      ],
    },
    {
      heading: "Why the measured number is smaller than the ones you have read",
      body: [
        "Published agent-economy figures are usually market forecasts running to trillions by 2030. The number on this page is orders of magnitude smaller because it counts what has already happened on public chains. Both are legitimate; they answer different questions. The gap between them is the distance between thesis and adoption, and that gap — tracked month over month — is the actual signal.",
      ],
    },
  ],
  build: ({ data }) => {
    if (!data) return null;
    const n = (v: unknown) => (Number.isFinite(Number(v)) ? Number(v) : 0);
    const events =
      n(data.x402?.totalTxs) +
      n(data.olas?.totalTxs) +
      n(data.virtualsAcp?.totalMemos) +
      n(data.erc8004Registry?.totalAgents) +
      n(data.baseAgentic?.totalTxs) +
      n(data.tempoMpp?.totalEvents);
    if (!events) return null;
    const stamp = asOfLabel(data.updatedAt) ?? "the latest pipeline run";
    return {
      answer: `The agent economy is economic activity carried out by autonomous software agents on their own account — paying for resources, registering identities, and settling jobs with each other — rather than by a human at a checkout. Measured on public blockchains as of ${stamp}, it amounts to ${fmt(events)} cumulative events across seven protocol families, including ${fmt(data.x402?.totalTxs)} agent payment settlements that moved ${usd(data.x402?.totalVolume)} in stablecoins. That is observed activity, not a market forecast.`,
      asOf: data.updatedAt ?? null,
      rows: [
        { label: "Payment — x402 settlements", value: fmt(data.x402?.totalTxs), note: "agents paying per request" },
        { label: "Payment — stablecoin volume settled", value: usd(data.x402?.totalVolume) },
        { label: "Identity — ERC-8004 registrations", value: fmt(data.erc8004Registry?.totalAgents), note: "sign-ups, not activity" },
        { label: "Commerce — Virtuals ACP memos", value: fmt(data.virtualsAcp?.totalMemos), note: "job lifecycle steps" },
        { label: "Autonomous operation — Olas transactions", value: fmt(data.olas?.totalTxs) },
        { label: "Total tracked events", value: fmt(events), note: "activity index, mixed units" },
      ],
      extraFaq: [
        {
          q: "Is the agent economy the same as agentic commerce?",
          a: "Not quite. Agentic commerce usually describes an agent buying on a human's behalf, often settling on conventional card rails. The agent economy as measured here is broader and stricter at once: it includes agent-to-agent activity that has no human buyer, and it counts only what settles on public chains where the figure can be independently recomputed.",
        },
        {
          q: "Who measures the agent economy?",
          a: "This site does, from public sources: open Dune queries over facilitator and registry contracts, a first-hand indexer for Tempo MPP, and public APIs for the off-chain context. Every figure is recomputable from the open feed at agenteconomy.to/data.json, and the method is documented at agenteconomy.to/methodology.",
        },
      ],
    };
  },
};

// ─── x402 vs Virtuals ACP (comparison) ───────────────────────────────────────
// The site's first comparison page. "X vs Y" is among the most-cited answer
// formats, and these two are the pair most often conflated: both are called
// "agent payments" while measuring different acts in different units.
const x402VsAcp: StatDoc = {
  slug: "x402-vs-virtuals-acp",
  question: "What is the difference between x402 and Virtuals ACP?",
  shortTitle: "x402 vs Virtuals ACP",
  seoDescription:
    "x402 vs Virtuals ACP: per-request settlement versus job lifecycle memos — why the counts aren't comparable, with current measured figures for each.",
  related: ["x402-transactions", "virtuals-acp-activity", "how-big-is-the-agent-economy"],
  sources: [
    { label: "agent economy data.json (live feed)", url: "https://agenteconomy.to/data.json" },
    { label: "x402 — HTTP 402 payment standard", url: "https://www.x402.org/" },
    { label: "Virtuals Protocol — Agent Commerce Protocol", url: "https://whitepaper.virtuals.io/" },
  ],
  sections: [
    {
      heading: "They answer different questions",
      body: [
        "x402 is a payment standard. It revives the dormant HTTP 402 status code so a server can demand payment for a single request and an agent can settle it in stablecoins without an account, a subscription, or a human. Its unit is a settlement, and because settlement happens in stablecoins, it carries a dollar figure that can be summed.",
        "Virtuals ACP is a commerce protocol. It structures a deal between two agents into recorded lifecycle steps — request, negotiation, transaction, evaluation — so that agent-to-agent work has an auditable trail. Its unit is a memo, and a memo is a step in a deal, not a completed sale. Counting memos as transactions overstates completed commerce, which is why this site never blends the two totals.",
      ],
    },
    {
      heading: "What the comparison does and does not tell you",
      body: [
        "Because the units differ, the larger number is not the more successful protocol. A single ACP job can produce several memos, and a single x402 settlement can be a test call or infrastructure traffic rather than end-user demand. The useful reading is directional: which one is accelerating, and whether payment volume is growing faster than the count of payments, which would indicate larger individual transactions rather than merely more of them.",
        "They are also not competitors in any strict sense. A job negotiated through ACP still has to be paid for, and x402 is one of the rails that could settle it. Treat them as adjacent layers — commerce coordination above, per-request payment below — rather than as rivals for the same slot.",
      ],
    },
  ],
  build: ({ data }) => {
    if (!data) return null;
    const n = (v: unknown) => (Number.isFinite(Number(v)) ? Number(v) : 0);
    const x = n(data.x402?.totalTxs);
    const memos = n(data.virtualsAcp?.totalMemos);
    if (!x || !memos) return null;
    const stamp = asOfLabel(data.updatedAt) ?? "the latest pipeline run";
    const ratio = memos ? (x / memos).toFixed(1) : "—";
    return {
      answer: `x402 is a payment standard and Virtuals ACP is a commerce protocol, so they measure different acts: x402 counts per-request stablecoin settlements, while ACP counts lifecycle memos inside agent-to-agent deals. As of ${stamp}, x402 has recorded ${fmt(x)} settlements moving ${usd(data.x402?.totalVolume)} across ${fmt(data.x402?.chainsTracked)} chains, and Virtuals ACP has recorded ${fmt(memos)} memos. The counts are not comparable one-to-one — a memo is a step in a deal, not a completed sale.`,
      asOf: data.updatedAt ?? null,
      rows: [
        { label: "x402 — what it counts", value: "Per-request settlements", note: "a payment standard" },
        { label: "Virtuals ACP — what it counts", value: "Job lifecycle memos", note: "a commerce protocol" },
        { label: "x402 cumulative settlements", value: fmt(x) },
        { label: "x402 settled volume", value: usd(data.x402?.totalVolume), note: "ACP has no equivalent USD figure" },
        { label: "Virtuals ACP cumulative memos", value: fmt(memos) },
        { label: "Ratio (x402 settlements per ACP memo)", value: `${ratio}×`, note: "different units — directional only" },
      ],
      chart: {
        kind: "bars",
        title: "Cumulative activity — note the units differ",
        unit: "events",
        points: [
          { label: "x402", value: x },
          { label: "ACP", value: memos },
        ],
      },
      extraFaq: [
        {
          q: "Does Virtuals ACP use x402?",
          a: "They are adjacent layers rather than substitutes: ACP coordinates the deal between agents, and the payment still has to settle on some rail, of which x402 is one. This site measures each independently and does not assume any settlement path between them.",
        },
        {
          q: "Which one is bigger?",
          a: `By raw count x402 is larger — ${fmt(x)} settlements against ${fmt(memos)} memos — but the units are not equivalent, so the comparison is directional, not a ranking. x402 is also the only one of the two with a measurable stablecoin volume, at ${usd(data.x402?.totalVolume)}.`,
        },
      ],
    };
  },
};

// ─── is x402 growing (trend) ─────────────────────────────────────────────────
// The growth question is asked constantly and answered nowhere honestly: the
// cumulative counter only ever rises, so citing it implies growth that the
// monthly series does not support. This page reports what the series actually
// says, including the part that is unflattering.
const isX402Growing: StatDoc = {
  slug: "is-x402-growing",
  question: "Is x402 growing?",
  shortTitle: "x402 growth trend",
  seoDescription:
    "Is x402 growing? The full monthly series: transaction counts, settled volume and average payment size — where each peaked and where it stands now.",
  protocolSlug: "x402",
  related: ["x402-transactions", "x402-daily-transactions", "average-x402-transaction-size"],
  sources: [{ label: "agent economy data.json (live feed)", url: "https://agenteconomy.to/data.json" }],
  sections: [
    {
      heading: "Why the cumulative number cannot answer this",
      body: [
        "A cumulative counter rises by construction. Quoting one to argue growth is like citing an odometer to argue a car is accelerating — it can only go up, including while the thing slows down. The honest test is the monthly series: how much activity happened in each month, independently of everything before it.",
        "This matters because the cumulative x402 figure is the number most often quoted, this site included. It is a legitimate measure of cumulative adoption. It is not evidence of momentum, and this page exists so the two do not get conflated.",
      ],
    },
    {
      heading: "Two series that disagree",
      body: [
        "Transaction counts and settled dollars tell different stories, and reading either alone gives the wrong answer. Counts collapsed from their late-2025 peak, then stabilised, and have been grinding upward off that floor. Settled volume fell far harder and has not recovered — which means the average payment has shrunk dramatically.",
        "The most defensible reading is that x402 traffic is real, steady and mildly growing in count, while the economic weight behind each call has fallen to fractions of a cent. That pattern fits machine-to-machine micropayments and infrastructure traffic far better than it fits commerce. Anyone citing x402 as evidence of a booming agent economy should look at the volume line before doing so.",
      ],
    },
  ],
  build: ({ data }) => {
    const x = data?.x402 as Record<string, unknown> | undefined;
    const monthly = arr(x?.monthly);
    if (!x || monthly.length < 3) return null;
    // The trailing month is still accruing; comparing a partial month against
    // complete ones would manufacture a decline that has not happened.
    const complete = monthly.slice(0, -1);
    if (complete.length < 3) return null;
    const last = complete[complete.length - 1];
    const prev = complete[complete.length - 2];
    const peak = complete.reduce((a, b) => (num(b.txs) > num(a.txs) ? b : a), complete[0]);
    const peakVol = complete.reduce((a, b) => (num(b.vol) > num(a.vol) ? b : a), complete[0]);
    const mom = num(prev.txs) ? ((num(last.txs) - num(prev.txs)) / num(prev.txs)) * 100 : 0;
    const offPeak = num(peak.txs) ? (1 - num(last.txs) / num(peak.txs)) * 100 : 0;
    const size = (r: Record<string, unknown>) => (num(r.txs) ? num(r.vol) / num(r.txs) : 0);
    const stamp = asOfLabel(x.asOf ?? data?.updatedAt) ?? "the latest pipeline run";
    const dir = mom >= 0 ? "up" : "down";
    return {
      answer: `In counts, modestly — and only off a low base. ${last.month} recorded ${fmt(last.txs)} x402 transactions, ${dir} ${Math.abs(mom).toFixed(0)}% on ${prev.month} but still ${offPeak.toFixed(0)}% below the ${peak.month} peak of ${fmt(peak.txs)}. Settled volume tells a harsher story: ${usd(last.vol)} in ${last.month} against ${usd(peakVol.vol)} at the ${peakVol.month} peak, so the average payment has fallen from about $${size(peakVol).toFixed(2)} to about $${size(last).toFixed(3)}. Measured as of ${stamp}; the current month is excluded because it is incomplete.`,
      asOf: (x.asOf as string) ?? data?.updatedAt ?? null,
      rows: [
        { label: `Latest complete month (${last.month})`, value: fmt(last.txs), note: "transactions" },
        { label: "Month over month", value: `${mom >= 0 ? "+" : ""}${mom.toFixed(1)}%`, note: `vs ${prev.month}` },
        { label: `Peak month (${peak.month})`, value: fmt(peak.txs), note: `now ${offPeak.toFixed(0)}% below it` },
        { label: `Volume, latest month`, value: usd(last.vol) },
        { label: `Volume, peak (${peakVol.month})`, value: usd(peakVol.vol) },
        { label: "Average payment now", value: `$${size(last).toFixed(4)}`, note: `was $${size(peakVol).toFixed(2)} at peak` },
      ],
      chart: {
        kind: "bars",
        title: "x402 transactions per month (complete months only)",
        unit: "transactions",
        points: complete.map((r) => ({ label: String(r.month ?? ""), value: num(r.txs) })),
      },
      extraFaq: [
        {
          q: "Why does the cumulative x402 count keep rising if activity fell?",
          a: "Because a cumulative total can only rise. It adds every month's activity to the running sum, so it climbs even during a decline — just more slowly. Momentum questions have to be answered from the monthly series, which is what this page charts.",
        },
        {
          q: "Did x402 usage peak?",
          a: `On monthly transaction count, the peak so far was ${peak.month} at ${fmt(peak.txs)}; the latest complete month is ${offPeak.toFixed(0)}% below it. On settled volume the gap is far wider. Whether that peak stands is an open question — the count has been recovering off its floor.`,
        },
      ],
    };
  },
};

// ─── how much money do agents move ───────────────────────────────────────────
const moneyMoved: StatDoc = {
  slug: "how-much-money-do-ai-agents-move",
  question: "How much money do AI agents actually move?",
  shortTitle: "Money moved by agents",
  seoDescription:
    "How much money AI agents actually move: x402 stablecoin settlement plus Virtuals ACP gross agentic value — two measured figures that must not be summed.",
  related: ["how-big-is-the-agent-economy", "x402-transactions", "virtuals-acp-activity"],
  sources: [
    { label: "agent economy data.json (live feed)", url: "https://agenteconomy.to/data.json" },
    { label: "agent economy web-sources.json (off-chain feed)", url: "https://agenteconomy.to/web-sources.json" },
  ],
  sections: [
    {
      heading: "Two different dollars",
      body: [
        "There are two defensible dollar figures in the agent economy and they are not additive. The first is settlement: stablecoin actually moved on-chain to pay for a request, which x402 records and which can be summed from public transfers. The second is gross agentic value: the total value recorded against agent jobs in Virtuals ACP, computed here by summing every registered agent's own public record rather than by trusting a platform dashboard.",
        "Settlement is the tighter number — the money provably changed hands on a public chain. Gross agentic value is broader: it captures the value attached to work agents did, whether or not it settled through a tracked rail. Adding them would double-count anything that appears in both, so this page keeps them apart.",
      ],
    },
    {
      heading: "What these numbers do not mean",
      body: [
        "Neither figure is revenue, and neither is proof of end-user demand. Settlement includes test traffic, infrastructure calls and repeated service invocations. Gross agentic value counts value recorded against jobs, including jobs between agents run by the same operator. Both are best read as measures of protocol activity — the size of the machine, not the profit it makes.",
      ],
    },
  ],
  build: ({ data, web }) => {
    if (!data) return null;
    const vol = num((data.x402 as Record<string, unknown>)?.totalVolume);
    const gross = num((web?.virtuals as Record<string, unknown>)?.aggregates && ((web!.virtuals as Record<string, unknown>).aggregates as Record<string, unknown>).grossAgenticUsd);
    const jobs = num((web?.virtuals as Record<string, unknown>)?.aggregates && ((web!.virtuals as Record<string, unknown>).aggregates as Record<string, unknown>).totalJobs);
    if (!vol) return null;
    const stamp = asOfLabel(data.updatedAt) ?? "the latest pipeline run";
    const perJob = jobs ? gross / jobs : 0;
    return {
      answer: `Two figures, measured differently and not additive. As of ${stamp}, x402 has settled ${usd(vol)} of stablecoin on-chain — money that provably changed hands to pay for agent requests.${gross ? ` Separately, Virtuals ACP records ${usd(gross)} of gross agentic value across ${fmt(jobs)} agent jobs, summed independently from every registered agent's public record rather than taken from a platform statistics page.` : ""} Neither number is revenue, and both include test and infrastructure activity.`,
      asOf: data.updatedAt ?? null,
      rows: [
        { label: "x402 settled volume", value: usd(vol), note: "stablecoin, on-chain, measured" },
        ...(gross ? [{ label: "Virtuals ACP gross agentic value", value: usd(gross), note: "summed per-agent, off-chain source" }] : []),
        ...(jobs ? [{ label: "ACP jobs recorded", value: fmt(jobs) }] : []),
        ...(perJob ? [{ label: "Average value per ACP job", value: `$${perJob.toFixed(2)}` }] : []),
      ],
      extraFaq: [
        {
          q: "Can I add these two numbers together?",
          a: "No. They measure different things from different sources and overlap in unknown proportion — an ACP job can settle through a payment rail that x402 also counts. Summing them would double-count that intersection and produce a figure with no defensible meaning.",
        },
      ],
    };
  },
};

// ─── which chain has the most agents ─────────────────────────────────────────
const chainLeaderboard: StatDoc = {
  slug: "which-chain-has-the-most-ai-agents",
  question: "Which blockchain has the most AI agents?",
  shortTitle: "Agents by chain",
  seoDescription:
    "Which blockchain has the most AI agents? Registered identities and payment settlements produce different winners — both rankings, measured on-chain.",
  related: ["how-many-ai-agents-are-onchain", "erc-8004-agents", "x402-transactions"],
  sources: [{ label: "agent economy data.json (live feed)", url: "https://agenteconomy.to/data.json" }],
  sections: [
    {
      heading: "The answer depends on what you count",
      body: [
        "“Most AI agents” has two reasonable readings and they produce different winners. If you count registered identities — agents that signed up to an on-chain registry — one chain leads. If you count payment activity — agents actually settling for resources — another does. Publishing a single ranking without saying which is being counted is how misleading league tables get made.",
        "Registration is also cheap and one-off, which makes it easy to move a leaderboard with a single campaign. Settlement is recurring and costs money each time, so it is harder to inflate. When the two rankings disagree, the settlement ranking is usually the better proxy for real usage.",
      ],
    },
    {
      heading: "Why some rows carry no percentage",
      body: [
        "A per-chain breakdown can refresh on a different cadence than the protocol total it belongs to, which leaves the parts summing to less than the whole. Where that happens, this page ranks by absolute count and states the coverage rather than quoting a share — dividing by an incomplete breakdown would inflate every chain's percentage and produce a table that contradicts the headline figures elsewhere on this site.",
      ],
    },
  ],
  build: ({ data }) => {
    if (!data) return null;
    const reg = arr((data.erc8004Registry as Record<string, unknown>)?.chains)
      .map((c) => ({ name: String(c.name ?? ""), v: num(c.agents) }))
      .filter((c) => c.name && c.v)
      .sort((a, b) => b.v - a.v);
    const pay = arr((data.x402 as Record<string, unknown>)?.chains)
      .map((c) => ({ name: String(c.name ?? ""), v: num(c.txs) }))
      .filter((c) => c.name && c.v)
      .sort((a, b) => b.v - a.v);
    if (!reg.length || !pay.length) return null;

    // A per-chain breakdown can lag its own protocol total — the x402 split is
    // currently a partial snapshot summing to well under the headline count.
    // Quoting a share against the breakdown's own sum would silently inflate
    // every chain's percentage, so shares are only stated where the breakdown
    // actually covers the protocol; otherwise the page says so and ranks by
    // absolute count instead.
    const regSum = reg.reduce((s, c) => s + c.v, 0);
    const paySum = pay.reduce((s, c) => s + c.v, 0);
    const regTotal = num((data.erc8004Registry as Record<string, unknown>)?.totalAgents) || regSum;
    const payTotal = num((data.x402 as Record<string, unknown>)?.totalTxs) || paySum;
    const COVERED = 0.95;
    const regCovers = regTotal ? regSum / regTotal >= COVERED : false;
    const payCovers = payTotal ? paySum / payTotal >= COVERED : false;
    const stamp = asOfLabel(data.updatedAt) ?? "the latest pipeline run";
    const pct = (v: number, t: number) => (t ? ((v / t) * 100).toFixed(0) : "0");
    const payCoverPct = payTotal ? ((paySum / payTotal) * 100).toFixed(0) : "0";

    const regClause = regCovers
      ? `${reg[0].name} leads with ${fmt(reg[0].v)} of ${fmt(regTotal)} ERC-8004 registrations (${pct(reg[0].v, regTotal)}%), ahead of ${reg[1]?.name} at ${fmt(reg[1]?.v)}`
      : `${reg[0].name} leads with ${fmt(reg[0].v)} ERC-8004 registrations, ahead of ${reg[1]?.name} at ${fmt(reg[1]?.v)}`;
    const payClause = payCovers
      ? `${pay[0].name} leads with ${fmt(pay[0].v)} of ${fmt(payTotal)} x402 settlements (${pct(pay[0].v, payTotal)}%), ahead of ${pay[1]?.name} at ${fmt(pay[1]?.v)}`
      : `${pay[0].name} leads with ${fmt(pay[0].v)} x402 settlements, ahead of ${pay[1]?.name} at ${fmt(pay[1]?.v)} — no share is quoted because the per-chain x402 split currently covers only ${payCoverPct}% of the ${fmt(payTotal)} settlements counted in total`;

    return {
      answer: `It depends which question you are asking. By registered agent identities, ${regClause}. By agent payment activity, ${payClause}. Registration is a one-time act and cheap to bulk-create; settlement recurs and costs money each time. Measured as of ${stamp}.`,
      asOf: data.updatedAt ?? null,
      rows: [
        { label: "Most registered agents", value: reg[0].name, note: `${fmt(reg[0].v)} registrations` },
        { label: "Most payment activity", value: pay[0].name, note: `${fmt(pay[0].v)} settlements` },
        ...reg.slice(0, 5).map((c) => ({
          label: `Registrations — ${c.name}`,
          value: fmt(c.v),
          ...(regCovers ? { note: `${pct(c.v, regTotal)}% of total` } : {}),
        })),
        ...pay.slice(0, 5).map((c) => ({ label: `x402 settlements — ${c.name}`, value: fmt(c.v) })),
        ...(payCovers
          ? []
          : [
              {
                label: "Coverage caveat — x402 per-chain split",
                value: `${payCoverPct}% of total`,
                note: `breakdown sums to ${fmt(paySum)} against ${fmt(payTotal)} counted`,
              },
            ]),
      ],
      chart: {
        kind: "bars",
        title: "ERC-8004 registered agents by chain",
        unit: "agents",
        points: reg.slice(0, 8).map((c) => ({ label: c.name, value: c.v })),
      },
      extraFaq: [
        {
          q: "Does the leading chain by registrations have the most active agents?",
          a: `Not necessarily. ${reg[0].name} leads registrations, while ${pay[0].name} leads x402 payment settlements. A registry entry proves an agent signed up once; it says nothing about whether it has done anything since.`,
        },
      ],
    };
  },
};

// ─── agent token market cap ──────────────────────────────────────────────────
const tokenMarketCap: StatDoc = {
  slug: "ai-agent-token-market-cap",
  question: "What is the market cap of AI agent tokens?",
  shortTitle: "Agent token market cap",
  seoDescription:
    "The market capitalisation of AI agent tokens from a deliberately curated basket, and why the broad exchange category figure is not a usable answer.",
  related: ["how-big-is-the-agent-economy", "how-much-money-do-ai-agents-move", "olas-transactions"],
  sources: [
    { label: "agent economy web-sources.json (off-chain feed)", url: "https://agenteconomy.to/web-sources.json" },
    { label: "CoinGecko (source for token market data)", url: "https://www.coingecko.com/" },
  ],
  sections: [
    {
      heading: "Why a curated basket, not the category",
      body: [
        "Exchange listings carry a broad “AI agent” category whose market cap runs far higher than the figure on this page. That number is not usable: the category is heavily contaminated by memecoins that reference agents in their branding and have no agent infrastructure behind them. Quoting it would measure narrative, not the sector.",
        "The basket here is deliberately small and named, covering tokens attached to protocols this site independently measures on-chain. It will understate any broad definition of the sector, and that is the trade being made: a smaller number you can audit beats a bigger one you cannot.",
      ],
    },
    {
      heading: "Market cap is not the agent economy",
      body: [
        "Token market cap prices expectations about a sector's future. The on-chain figures elsewhere on this site measure what agents have already done. They move independently and frequently in opposite directions, which is precisely why this site keeps the off-chain market lens separate from the measured on-chain activity rather than blending them into one headline.",
      ],
    },
  ],
  available: ({ web }) => num((web?.agentTokens as Record<string, unknown>)?.basketMcap) > 0,
  build: ({ web }) => {
    const t = web?.agentTokens as Record<string, unknown> | undefined;
    const mcap = num(t?.basketMcap);
    if (!mcap) return null;
    const basket = arr(t?.basket);
    const vol = num(t?.basketVol24h);
    const cats = arr(t?.categories);
    const broad = num(cats[0]?.mcap);
    const stamp = asOfLabel((t?.asOf as string) ?? (web as Record<string, unknown>)?.updatedAt as string) ?? "the latest refresh";
    const top = basket.map((b) => ({ s: String(b.symbol ?? ""), m: num(b.mcap) })).sort((a, b) => b.m - a.m);
    return {
      answer: `As of ${stamp}, a curated basket of ${fmt(basket.length)} agent-protocol tokens (${basket.map((b) => String(b.symbol ?? "")).join(", ")}) carries a combined market capitalisation of ${usd(mcap)} on ${usd(vol)} of 24-hour trading volume.${broad ? ` The broad exchange “AI agent” category is far larger at ${usd(broad)}, but it is memecoin-contaminated and is shown only as contrast.` : ""} Market data is off-chain context and is kept separate from the measured on-chain activity elsewhere on this site.`,
      asOf: (t?.asOf as string) ?? null,
      rows: [
        { label: "Curated basket market cap", value: usd(mcap), note: `${fmt(basket.length)} tokens` },
        { label: "Basket 24h volume", value: usd(vol) },
        ...(broad ? [{ label: "Broad exchange category (contrast)", value: usd(broad), note: "memecoin-contaminated" }] : []),
        ...top.map((b) => ({ label: `— ${b.s}`, value: usd(b.m) })),
      ],
      chart: {
        kind: "bars",
        title: "Market cap by basket token",
        unit: "USD",
        points: top.map((b) => ({ label: b.s, value: b.m })),
      },
      extraFaq: [
        {
          q: "Why is your agent token market cap lower than the one I saw elsewhere?",
          a: "Most published figures use an exchange's broad AI-agent category, which sweeps in tokens whose only connection to agents is the name. This page uses a named basket of tokens attached to protocols measured on-chain here, so it is smaller and checkable rather than larger and vague.",
        },
      ],
    };
  },
};

// ─── how many services accept x402 ───────────────────────────────────────────
const x402Services: StatDoc = {
  slug: "how-many-services-accept-x402",
  question: "How many services accept x402 payments?",
  shortTitle: "x402 service supply",
  seoDescription:
    "How many services accept x402: unique provider domains an agent can actually pay, versus raw catalog listings — and why the smaller number is the honest one.",
  protocolSlug: "x402",
  related: ["x402-transactions", "x402-facilitators", "how-many-mcp-servers-are-there"],
  sources: [
    { label: "agent economy web-sources.json (off-chain feed)", url: "https://agenteconomy.to/web-sources.json" },
  ],
  sections: [
    {
      heading: "Providers, not listings",
      body: [
        "A public catalog of x402-payable resources exists, and its raw listing count is the number usually quoted. It is the wrong unit: a single provider can publish hundreds of endpoints, so listings measure how prolific the largest publishers are rather than how many independent services accept the standard. Listings also churn heavily as providers add and retire endpoints.",
        "The defensible headline is unique provider domains — how many distinct operators an agent could actually pay. It is a much smaller number and a far more stable one, and it is what this page leads with.",
      ],
    },
    {
      heading: "The supply side of the payment rail",
      body: [
        "Transaction counts measure demand: agents paying. Provider counts measure supply: things worth paying for. A payment standard needs both, and the ratio between them is informative — a rail with heavy traffic across few providers is concentrated infrastructure, while one with many providers and thin traffic is early and unproven.",
      ],
    },
  ],
  available: ({ web }) => num((web?.x402Services as Record<string, unknown>)?.uniqueProviders) > 0,
  build: ({ web }) => {
    const s = web?.x402Services as Record<string, unknown> | undefined;
    const providers = num(s?.uniqueProviders);
    if (!providers) return null;
    const listings = num(s?.totalListings);
    const top2 = num(s?.top2SharePct);
    const stamp = asOfLabel((s?.asOf as string) ?? ((web as Record<string, unknown>)?.updatedAt as string)) ?? "the latest refresh";
    return {
      answer: `As of ${stamp}, ${fmt(providers)} unique provider domains publish resources payable over x402.${listings ? ` The underlying catalog carries ${fmt(listings)} raw listings, but listings are the wrong unit — one provider can publish hundreds of endpoints${top2 ? `, and the two largest hosts alone account for roughly ${top2}% of them` : ""}.` : ""} Provider domains are the stable measure of how many independent services an agent can actually pay.`,
      asOf: (s?.asOf as string) ?? null,
      rows: [
        { label: "Unique provider domains", value: fmt(providers), note: "the defensible headline" },
        ...(listings ? [{ label: "Raw catalog listings", value: fmt(listings), note: "churns; not a service count" }] : []),
        ...(top2 ? [{ label: "Top-2 host share of listings", value: `${top2}%`, note: "concentration check" }] : []),
        ...(listings && providers ? [{ label: "Listings per provider", value: (listings / providers).toFixed(1) }] : []),
      ],
      extraFaq: [
        {
          q: "Why is this number smaller than the x402 directory count I saw?",
          a: "Directory counts are listings, not services. A single provider publishing hundreds of endpoints adds hundreds of listings but one provider. This page counts unique provider domains because that is what actually answers how many services an agent can pay.",
        },
      ],
    };
  },
};

// ─── agents on Solana ────────────────────────────────────────────────────────
const solanaAgents: StatDoc = {
  slug: "how-many-ai-agents-are-on-solana",
  question: "How many AI agents are on Solana?",
  shortTitle: "Agents on Solana",
  seoDescription:
    "How many AI agents are on Solana: registry accounts read directly from the on-chain programs — an upper bound on registrations, not active agents.",
  related: ["how-many-ai-agents-are-onchain", "which-chain-has-the-most-ai-agents", "erc-8004-agents"],
  sources: [{ label: "agent economy web-sources.json (off-chain feed)", url: "https://agenteconomy.to/web-sources.json" }],
  sections: [
    {
      heading: "Read from the registry programs, not a dashboard",
      body: [
        "Solana's agent identity landscape is not one registry but several, run by different teams with different schemas. This count comes from reading the registry programs' own accounts directly, which is why it can be recomputed by anyone with an RPC endpoint and does not depend on any project's self-reported figure.",
        "Because the registries are independent, an agent registered in two of them counts twice. The total is therefore an upper bound on distinct agents, and the per-registry breakdown below is the more honest view.",
      ],
    },
    {
      heading: "Registrations are not activity",
      body: [
        "A registry account proves someone paid the rent to create it. It does not prove the agent has ever transacted, and registration is cheap enough that a single campaign can move the total sharply. Read this as the size of the identity layer on Solana, then read the payment figures elsewhere on this site for whether that identity layer is being used.",
      ],
    },
  ],
  available: ({ web }) => num((web?.solanaAgents as Record<string, unknown>)?.totalAccounts) > 0,
  build: ({ web }) => {
    const s = web?.solanaAgents as Record<string, unknown> | undefined;
    const total = num(s?.totalAccounts);
    if (!total) return null;
    const regs = arr(s?.registries)
      .map((r) => ({ name: String(r.label ?? ""), v: num(r.accounts) }))
      .filter((r) => r.name && r.v)
      .sort((a, b) => b.v - a.v);
    const stamp = asOfLabel((s?.asOf as string) ?? ((web as Record<string, unknown>)?.updatedAt as string)) ?? "the latest refresh";
    return {
      answer: `As of ${stamp}, Solana's on-chain agent registries hold ${fmt(total)} registered agent accounts across ${fmt(regs.length)} independent registries${regs.length ? `, led by ${regs[0].name} with ${fmt(regs[0].v)}` : ""}. The figure is read directly from the registry programs, so it is independently recomputable — but because the registries do not deduplicate against each other, treat it as an upper bound on distinct agents rather than a census.`,
      asOf: (s?.asOf as string) ?? null,
      rows: [
        { label: "Total registered accounts", value: fmt(total), note: "upper bound — registries overlap" },
        ...regs.map((r) => ({ label: `— ${r.name}`, value: fmt(r.v) })),
      ],
      ...(regs.length > 1
        ? {
            chart: {
              kind: "bars" as const,
              title: "Registered agent accounts by Solana registry",
              unit: "accounts",
              points: regs.map((r) => ({ label: r.name.split(" ")[0], value: r.v })),
            },
          }
        : {}),
      extraFaq: [
        {
          q: "Is this every AI agent on Solana?",
          a: "No. It counts accounts in the on-chain agent registries this site tracks. An agent operating on Solana without registering in one of them is invisible to this measure, and an agent registered in two is counted twice.",
        },
      ],
    };
  },
};

// ─── developers building agents ──────────────────────────────────────────────
const devAdoption: StatDoc = {
  slug: "how-many-developers-are-building-ai-agents",
  question: "How many developers are building AI agents?",
  shortTitle: "Developer adoption",
  seoDescription:
    "Developer adoption of agent payment tooling, measured as weekly package downloads across a named SDK basket — a supply-side leading indicator, not a headcount.",
  related: ["how-many-mcp-servers-are-there", "how-many-services-accept-x402", "which-agent-standards-are-actually-adopted"],
  sources: [{ label: "agent economy web-sources.json (off-chain feed)", url: "https://agenteconomy.to/web-sources.json" }],
  sections: [
    {
      heading: "Downloads are not developers",
      body: [
        "Nobody can count developers building agents, and any published headcount is a guess. What is countable is how often the tooling is installed: weekly download volume across a named basket of agent-payment SDKs. CI pipelines, mirrors and container rebuilds all inflate downloads, so this is a directional indicator of momentum rather than a population estimate.",
        "It is still the most useful leading signal available. Tooling installs move before on-chain activity does — someone integrates the SDK weeks before their agent settles its first payment — so a sustained rise here tends to precede a rise in the measured figures elsewhere on this site.",
      ],
    },
    {
      heading: "Why the basket is named and small",
      body: [
        "The basket is listed explicitly so the figure can be recomputed and so its limits are visible. Packages that depend on one another are not summed into a single headline where that would double-count an install, and the per-package table below is the honest view. A broader basket would produce a larger number and a less meaningful one.",
      ],
    },
  ],
  available: ({ web }) => num((web?.devAdoption as Record<string, unknown>)?.totalWeeklyAvg4w) > 0,
  build: ({ web }) => {
    const d = web?.devAdoption as Record<string, unknown> | undefined;
    const total = num(d?.totalWeeklyAvg4w);
    if (!total) return null;
    const comps = arr(d?.components)
      .map((c) => ({ pkg: String(c.pkg ?? ""), reg: String(c.registry ?? ""), v: num(c.weeklyAvg4w) }))
      .filter((c) => c.pkg)
      .sort((a, b) => b.v - a.v);
    const stamp = asOfLabel((d?.asOf as string) ?? ((web as Record<string, unknown>)?.updatedAt as string)) ?? "the latest refresh";
    return {
      answer: `There is no honest headcount, but the tooling can be counted: as of ${stamp}, a named basket of ${fmt(comps.length)} agent-payment SDKs averages ${fmt(total)} downloads per week over a trailing four-week window${comps.length ? `, led by ${comps[0].pkg} at ${fmt(comps[0].v)}` : ""}. Downloads include CI and mirror traffic, so read this as a directional adoption signal for agent-payment tooling, not as a number of people.`,
      asOf: (d?.asOf as string) ?? null,
      rows: [
        { label: "Weekly downloads (4-week average)", value: fmt(total), note: `${fmt(comps.length)}-package basket` },
        ...comps.map((c) => ({ label: `— ${c.pkg}`, value: fmt(c.v), note: c.reg })),
      ],
      extraFaq: [
        {
          q: "Can you tell me how many developers are building AI agents?",
          a: "Not credibly, and neither can anyone else — package registries do not expose unique installers. This page reports what is measurable, weekly download volume across a named SDK basket, and is explicit that CI and mirror traffic inflate it.",
        },
      ],
    };
  },
};

// ─── x402 vs Tempo MPP (comparison) ──────────────────────────────────────────
const x402VsTempo: StatDoc = {
  slug: "x402-vs-tempo-mpp",
  question: "What is the difference between x402 and Tempo MPP?",
  shortTitle: "x402 vs Tempo MPP",
  seoDescription:
    "x402 vs Tempo MPP: both build on HTTP 402, but one settles per request and the other opens payment channels — with current measured figures for each.",
  related: ["x402-transactions", "tempo-mpp-stats", "x402-vs-virtuals-acp"],
  sources: [{ label: "agent economy data.json (live feed)", url: "https://agenteconomy.to/data.json" }],
  sections: [
    {
      heading: "Per-request settlement versus payment channels",
      body: [
        "Both protocols answer the same question — how does a machine pay another machine for a resource — and both take HTTP 402 as their starting point, which is why they get lumped together. The mechanism differs. x402 settles each request on its own: a payment per call, independently visible on-chain. Tempo MPP opens a channel between a payer and a payee, through which many payments can flow before the channel closes.",
        "That difference makes the raw counts incomparable. An x402 transaction is one payment. An MPP event is a channel lifecycle step, and a single channel can carry a great deal of value across many interactions while emitting few events. A protocol with fewer events is not necessarily smaller.",
      ],
    },
    {
      heading: "Maturity, and why the smaller number is not the weaker one",
      body: [
        "x402 has a longer public history and far more measured activity. Tempo MPP is early: the figures here are measured first-hand from the chain since mainnet debut, which is narrow but complete — this site runs its own indexer for it rather than relying on a third-party dataset. Its unique payer and payee counts are the more informative early signal, because they show whether usage is spreading or concentrated in a handful of parties.",
      ],
    },
  ],
  build: ({ data }) => {
    if (!data) return null;
    const x = data.x402 as Record<string, unknown> | undefined;
    const t = data.tempoMpp as Record<string, unknown> | undefined;
    const xt = num(x?.totalTxs);
    const te = num(t?.totalEvents);
    if (!xt || !te) return null;
    const payers = num(t?.uniquePayers);
    const payees = num(t?.uniquePayees);
    const stamp = asOfLabel(data.updatedAt) ?? "the latest pipeline run";
    return {
      answer: `Both are machine payment protocols built on HTTP 402, but x402 settles one payment per request while Tempo MPP opens payment channels through which many payments flow. As of ${stamp}, x402 has recorded ${fmt(xt)} settlements moving ${usd(x?.totalVolume)}, and Tempo MPP has recorded ${fmt(te)} channel events across ${fmt(payers)} unique payers and ${fmt(payees)} payees. The counts are not comparable one-to-one — a channel event is not a payment, and one channel can carry many.`,
      asOf: data.updatedAt ?? null,
      rows: [
        { label: "x402 — mechanism", value: "Per-request settlement", note: "one payment, one on-chain record" },
        { label: "Tempo MPP — mechanism", value: "Payment channels", note: "many payments per channel" },
        { label: "x402 cumulative settlements", value: fmt(xt) },
        { label: "x402 settled volume", value: usd(x?.totalVolume) },
        { label: "Tempo MPP channel events", value: fmt(te) },
        { label: "Tempo MPP unique payers", value: fmt(payers), note: `${fmt(payees)} payees` },
      ],
      extraFaq: [
        {
          q: "Is Tempo MPP smaller than x402?",
          a: `By raw count, far smaller — ${fmt(te)} channel events against ${fmt(xt)} x402 settlements — but the units differ and MPP is much younger. A channel event is not a payment, so the ratio overstates the gap in economic activity by an unknown factor.`,
        },
        {
          q: "Do x402 and Tempo MPP compete?",
          a: "They overlap in intent and differ in shape. Per-request settlement suits one-off calls to arbitrary services; channels suit sustained relationships between two parties where opening a channel amortises over many interactions. Which is better depends on the traffic pattern, not on which has the larger counter.",
        },
      ],
    };
  },
};

export const STAT_DOCS: StatDoc[] = [
  whatIsAgentEconomy,
  x402VsAcp,
  x402VsTempo,
  isX402Growing,
  moneyMoved,
  chainLeaderboard,
  tokenMarketCap,
  x402Services,
  solanaAgents,
  devAdoption,
  x402Transactions,
  x402Daily,
  avgX402Size,
  x402Facilitators,
  agentCensus,
  erc8004Agents,
  agentEconomySize,
  virtualsActivity,
  olasTransactions,
  tempoStats,
  baseAgentic,
  mcpServers,
  standardsAdoption,
  inferenceDemand,
  usdcShare,
];
export const STAT_SLUGS = STAT_DOCS.map((d) => d.slug);
export const getStatDoc = (slug: string): StatDoc | null => STAT_DOCS.find((d) => d.slug === slug) ?? null;

// A doc's page (and its sitemap / llms.txt / hub listing) exists only if it is
// not gated, or its gate passes for the current feed state.
export const isStatDocAvailable = (doc: StatDoc, ctx: StatsContext): boolean => !doc.available || doc.available(ctx);
export const availableStatDocs = (ctx: StatsContext): StatDoc[] => STAT_DOCS.filter((d) => isStatDocAvailable(d, ctx));
