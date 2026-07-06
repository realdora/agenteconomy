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
    "The measured size of the on-chain agent economy today — total events across six protocol families and settled stablecoin volume — as distinct from market-size forecasts.",
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
        "Most published answers to “how big is the agent economy” are forecasts of future commerce — McKinsey's trillions by 2030, Juniper's multi-billion agentic-commerce curves — or enterprise-software market sizing that has nothing to do with on-chain activity. This page answers a narrower, checkable question: how much agent-protocol activity is observable on public blockchains right now. That means transaction and event counts across six protocol families (x402, ERC-8004, Virtuals ACP, Olas, Tempo MPP, and Base's agentic ecosystem), plus the stablecoin volume x402 settlement actually moved.",
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
      answer: `As of ${stamp}, the measured on-chain agent economy spans ${fmt(total)} cumulative events across six protocol families, including ${fmt(data.x402?.totalTxs)} x402 payment settlements that moved ${usd(data.x402?.totalVolume)} in stablecoins. This is observed on-chain activity — not a market forecast — and it refreshes hourly from the open dataset.`,
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
    "How many top web domains actually serve each AI-agent standard — x402, AP2, UCP, MCP server cards, A2A, ACP — measured by a weekly Cloudflare Radar agent-readiness scan, with raw counts, per-check shares, month-over-month change, and the caveats that make the shares non-comparable.",
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
    "A demand-side context metric for the agent economy: total LLM inference tokens processed across the public models ranked on OpenRouter over a trailing window, charted daily, with the tokenizer caveat that keeps the totals from being comparable across models.",
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
    "The live share of on-chain agent payments settled in USDC versus other tokens, measured from x402 settlement data and benchmarked against the Keyrock report — with the independence caveat that benchmark requires.",
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

export const STAT_DOCS: StatDoc[] = [
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
