import type { ProtocolDoc } from "../protocol-data";

const canonicalUrl = "https://agenteconomy.to/olas";

export const olasSeoDescription =
  "Olas Autonolas guide with autonomous-agent transaction context, Gnosis-dominant activity, methodology notes, and source links.";

export const olasContent: ProtocolDoc["content"] = [
  {
    eyebrow: "Why it matters",
    heading: "Olas measures a different kind of agent activity than payment rails or registries.",
    body: [
      "Olas, also known as Autonolas in earlier ecosystem material, is a decentralized network for co-owned autonomous AI agent services. Agent Economy treats it as its own category because the Olas footprint is not the same thing as x402 HTTP payment settlement, ERC-8004 identity registration, Virtuals ACP job memos, or Tempo MPP channel events. The Olas row is about autonomous services that keep operating after deployment and produce their own transaction trail.",
      "That distinction matters for anyone trying to read agent economy data honestly. A payment standard tells you that a machine paid for a resource. A registry tells you that an agent identity was created. Olas activity points at services that can coordinate work, make decisions, and execute on-chain actions over time. The tracked unit is therefore not revenue, not registered agents, and not a count of API calls. It is autonomous agent transaction activity sourced from the Olas ecosystem dataset.",
      "The live legacy route currently reports 16,449,330 total Olas transactions across 8 chains. It also shows a strongly Gnosis-dominant chain distribution: 15,972,029 transactions on Gnosis, or 97.1% of the tracked total. That concentration should be read as a property of the current source data, not as a claim that all Olas-related work happens on one chain. It says where this measured transaction family is visible today.",
    ],
    callout:
      "For Agent Economy, Olas is the autonomous-service activity lane: related to agent payments, but deliberately kept separate from payment, identity, and commerce-protocol counts.",
  },
  {
    eyebrow: "Protocol shape",
    heading: "The Olas pattern is continuous service operation, not a one-off prompt response.",
    body: [
      "The simplest way to understand Olas is to start from the service rather than the chat interface. Olas services are built from agent components and are meant to run continuously. They can monitor external state, coordinate between multiple participants, decide when a condition has been met, and submit transactions when the service logic calls for it. This is closer to autonomous operations than to a user asking a model a single question.",
      "The Open Autonomy framework is the core developer pattern behind that model. It gives builders a way to package multi-agent systems with shared state, consensus, and execution logic. Much of the computation and coordination can happen off-chain, while the outputs that matter for ownership, incentives, settlement, or auditability can be written on-chain. That split is important: the data Agent Economy tracks is the visible on-chain trail, not the full private or off-chain reasoning path of every agent service.",
      "The earlier Agent Economy brief described Olas agents as participating in domains such as prediction markets and DeFi strategies. Those examples are useful because they show why a continuously operating service produces a different data signature than a checkout flow. A prediction-market agent or DeFi automation service may transact repeatedly as conditions change. Its measurable activity is the aggregate footprint of those operations, not a single signed agreement or one facilitator settlement.",
    ],
    bullets: [
      {
        label: "Service first",
        body: "Olas is organized around autonomous services that keep running after deployment.",
      },
      {
        label: "Multi-agent",
        body: "Open Autonomy lets builders compose agents into systems with shared state and execution logic.",
      },
      {
        label: "On-chain trail",
        body: "Agent Economy tracks the transaction footprint that becomes visible on supported chains.",
      },
    ],
  },
  {
    eyebrow: "What the numbers say",
    heading: "The current dataset is large, multi-chain, and overwhelmingly concentrated on Gnosis.",
    body: [
      "The guaranteed-current legacy page and its embedded data report 16,449,330 cumulative Olas transactions. The same page lists 8 tracked chains, with Gnosis as the largest chain at 15,972,029 transactions. The remaining chains in the embedded dataset are Optimism, Polygon, Base, Ethereum, Celo, Solana, and Arbitrum, with much smaller counts. The point is not that every chain plays the same role; the point is that the source preserves the chain-level distribution instead of flattening it into a single headline number.",
      "Gnosis dominance is the most important interpretation note. At 97.1% of the tracked Olas total, Gnosis drives the aggregate shape of the Olas chart. When the total moves, readers should expect the Gnosis series to explain most of that movement unless the chain mix changes materially. The legacy route exposes that context directly through its largest-chain and Gnosis-share metrics, and this guide keeps that same caveat visible.",
      "The live route also reports 52 weekly rows loaded. Weekly history is useful because autonomous-service activity can be lumpy. Services may run continuously, but their transaction counts can still rise and fall with market conditions, automation schedules, user participation, or changes in the underlying service set. A weekly series avoids pretending that one cumulative total explains the whole protocol. It gives analysts a way to see whether activity is persistent, seasonal, or driven by a small number of recent bursts.",
    ],
  },
  {
    eyebrow: "Methodology",
    heading: "Olas data comes from the public Olas ecosystem source and stays in its native unit.",
    body: [
      "The source of record used by Agent Economy is the public Dune dashboard labeled @adrian0x / Olas Ecosystem. The daily pipeline stores Olas values under the `olas` key in `data.json`: `olas.totalTxs` for the cumulative total, `olas.chains[]` for the chain distribution, and `olas.weekly[]` for the weekly transaction series. The live route presents those fields with source links rather than reclassifying them into a different protocol metric.",
      "The methodological rule is conservative: Olas activity remains Olas activity. It is not counted as x402 payment volume, not added to ERC-8004 agent registrations, not converted into Virtuals ACP GDP, and not treated as Tempo channel events. This keeps protocol roles separate. The aggregate Agent Economy dashboard can sum event families for a broad market pulse, but the protocol page should still tell readers what each family actually measures.",
      "There are also limits to the source. The tracked transaction count is an on-chain activity signal from the Olas ecosystem dataset. It does not prove the business value of each action, the number of unique end users, the profitability of any strategy, or the exact off-chain reasoning used by services. Those would require different datasets. The honest reading is narrower and still useful: Olas has a large, visible transaction footprint for autonomous services, concentrated today on Gnosis, and refreshed through the same public data pipeline as the rest of Agent Economy.",
    ],
    bullets: [
      { label: "Source", body: "@adrian0x / Olas Ecosystem on Dune is the cited upstream source." },
      { label: "Fields", body: "`olas.totalTxs`, `olas.chains[]`, and `olas.weekly[]` are the tracked data fields." },
      { label: "Caveat", body: "The metric is transaction activity, not payment volume, agent count, or revenue." },
    ],
  },
  {
    eyebrow: "How to compare it",
    heading: "Olas belongs beside other agent protocols, but it should not be collapsed into them.",
    body: [
      "Olas is easiest to compare with the rest of Agent Economy by asking what role each protocol plays. x402 is about paying for web resources over HTTP. ERC-8004 is about agent identity, reputation, and validation. Virtuals ACP is about agent-to-agent commerce workflows and their lifecycle memos. Tempo MPP is about machine-payment channels. Olas is about autonomous services and the transactions those services create as they operate.",
      "That role separation explains why the same raw number can mean very different things across protocol pages. A million registry events, a million job memos, a million channel events, and a million autonomous-service transactions are not interchangeable units. They can all indicate machine activity, but they describe different layers of the stack. Olas sits closer to the operating layer: agents or services doing work, coordinating, and interacting with contracts over time.",
      "For researchers, that makes Olas useful as a complement to payment and identity data. If x402 shows agents buying resources and ERC-8004 shows agents establishing trust surfaces, Olas shows a family of services already acting on-chain. The best comparison is therefore not a single leaderboard. It is a map of protocol functions: identity, payments, commerce, channels, and autonomous operations. Olas is the operations lane in that map.",
    ],
  },
  {
    eyebrow: "Reading the page",
    heading: "Use the Olas page as a protocol guide first and a doorway into the dataset second.",
    body: [
      "This new route is intentionally written as a protocol guide. It explains what Olas is, why Agent Economy tracks it separately, how the live source measures it, and what the main caveats are. The live numbers continue to live in the public dataset and dashboard surfaces. That separation avoids implying that the prose page is itself a real-time analytics terminal while still giving search engines, researchers, and AI systems enough context to understand the metric.",
      "That separation also keeps the interpretation stable. The guide can explain why Olas belongs in an agent-economy map, while the machine-readable dataset carries the latest totals, chain distribution, weekly series, and source trail. Researchers can cite the page for context and the public data files for exact numbers.",
      "A good reading of the page is therefore practical rather than promotional. Olas has a significant measured footprint, but the metric is specific. It should be cited as Olas autonomous-agent transaction activity from the Agent Economy dataset, with chain distribution and weekly history available for context. That phrasing is less flashy than a generic agent-economy headline, but it is the version that stays useful when someone audits the underlying data.",
    ],
  },
];

export const olasJsonLd: ProtocolDoc["jsonLd"] = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "TechArticle",
      "@id": `${canonicalUrl}#article`,
      headline: "Olas Autonolas Data and Autonomous Agent Transactions",
      description: olasSeoDescription,
      url: canonicalUrl,
      mainEntityOfPage: canonicalUrl,
      author: {
        "@type": "Person",
        name: "realdora",
        url: "https://x.com/realdora_eth",
      },
      publisher: {
        "@type": "Organization",
        name: "agent economy",
        url: "https://agenteconomy.to",
      },
      about: [
        { "@id": `${canonicalUrl}#defined-term` },
        "autonomous agent transactions",
        "Olas ecosystem data",
        "Gnosis Chain",
      ],
      mentions: [
        "Open Autonomy",
        "Autonolas",
        "multi-agent systems",
        "on-chain agent activity",
      ],
    },
    {
      "@type": "DefinedTerm",
      "@id": `${canonicalUrl}#defined-term`,
      name: "Olas",
      alternateName: "Autonolas",
      description:
        "Olas is a decentralized network for co-owned autonomous agent services. Agent Economy tracks Olas through autonomous-agent transaction activity, chain distribution, and weekly history in the public dataset.",
      inDefinedTermSet: {
        "@type": "DefinedTermSet",
        name: "Agent Economy Protocols",
        url: "https://agenteconomy.to",
      },
      termCode: "olas",
    },
    {
      "@type": "BreadcrumbList",
      "@id": `${canonicalUrl}#breadcrumb`,
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Agent Economy",
          item: "https://agenteconomy.to/",
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Olas",
          item: canonicalUrl,
        },
      ],
    },
  ],
};
