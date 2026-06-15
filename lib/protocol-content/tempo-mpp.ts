import type { ProtocolDoc } from "../protocol-data";

export const tempoMppSeoDescription =
  "Tempo MPP guide for Machine Payment Protocol channel events, HTTP 402 payment patterns, Tempo settlement, unique payers, payees, and data caveats.";

export const tempoMppContent: ProtocolDoc["content"] = [
  {
    eyebrow: "Current signal",
    heading: "Tempo MPP is early, visible machine-payment infrastructure on Tempo.",
    body: [
      "Tempo MPP is the Machine Payments Protocol route in the agent economy map. The live Agent Economy dashboard frames it as a Tempo-specific payment standard associated with Stripe and Tempo infrastructure, and it tracks it separately from x402 because the two patterns expose different kinds of machine-payment behavior. x402 is presented as HTTP 402 per-resource payment activity. MPP is presented as a machine payment and channel-style approach for stablecoin micropayments on Tempo.",
      "The current public page reports 26,457 total MPP events, 653 unique payers, 60 unique payees, six event types, and 39 daily rows from the Tempo RPC indexer. Those numbers are useful because they are concrete on-chain signals, but they should not be read as a complete market map. The live route is explicit that Tempo MPP coverage is narrower than the Dune-backed x402 coverage and should be interpreted as early Tempo-specific visible activity.",
      "That distinction matters for researchers. MPP is not shown as broad cross-chain payment volume, and Agent Economy does not collapse it into the x402 series. It appears as a separate protocol family with its own unit: RPC-indexed channel events.",
    ],
    callout:
      "The measured unit is MPP channel activity on Tempo, not audited organic commerce and not total machine-payment market share.",
  },
  {
    eyebrow: "Protocol shape",
    heading: "MPP extends the HTTP 402 idea into longer-lived payment relationships.",
    body: [
      "Machine payments are not always one request and one response. Some software only needs a single paid call, but many agent workflows run for minutes, hours, or longer. A research agent may need to keep polling a dataset while it writes a report. A trading agent may need market data during a bounded strategy window. A monitoring agent may need recurring access to an endpoint that changes every few seconds. MPP gives those relationships a payment vocabulary that remains machine-readable.",
      "The current Agent Economy brief describes this as the difference between per-resource HTTP 402 payment and a channel-style model. A server can expose payment terms, and a machine client can satisfy those terms programmatically, but the relationship does not have to end after one call. Charges, sessions, and subscriptions give builders a way to price discrete actions, ongoing access, and recurring service dependencies without forcing every agent into a human checkout flow.",
      "That broader surface is why Tempo MPP is tracked separately even though it shares the HTTP 402 lineage. In the dashboard language, x402 popularizes paying for resources over HTTP. MPP points toward channels and stablecoin micropayments on Tempo. Both belong in the machine-payment stack, but the events they produce should not be blended unless the analysis clearly labels the unit being counted.",
    ],
    bullets: [
      { label: "Charges", body: "Direct payment for a discrete resource, action, or API call." },
      { label: "Sessions", body: "A bounded payment relationship for ongoing usage during a task." },
      { label: "Subscriptions", body: "Recurring access for services an agent depends on repeatedly." },
    ],
  },
  {
    eyebrow: "What we track",
    heading: "The dataset follows channel lifecycle events, payers, payees, and daily rows.",
    body: [
      "Agent Economy tracks Tempo MPP through the fields exposed in `data.json` and the Tempo-specific `tempo-data.json` summary. The route-level metric table uses `tempoMpp.totalEvents`, `tempoMpp.uniquePayers`, `tempoMpp.uniquePayees`, `tempoMpp.byType`, and `tempoMpp.daily`. The live page shows 26,457 total events, 653 unique payer addresses, 60 unique payee addresses, six event types, and 39 loaded daily rows.",
      "The event-type breakdown is especially important because a channel protocol produces lifecycle events rather than a single universal transaction category. The live dataset identifies ChannelOpened, CloseRequested, ChannelExpired, ChannelClosed, Settled, and TopUp as the current types. ChannelOpened and ChannelClosed dominate the visible count, while Settled and TopUp are much smaller.",
      "Unique payers and payees are address counts extracted by the Tempo summary script. They are useful for understanding whether activity is concentrated or broadening, but they are not the same as verified companies, end users, agents, or customers. An address can be infrastructure, a test account, a service account, or a real economic participant. The honest reading is narrower: these are distinct on-chain addresses observed in the indexed MPP event set.",
    ],
  },
  {
    eyebrow: "Methodology",
    heading: "The route is built from a Tempo RPC summary, then merged into the public dataset.",
    body: [
      "The live dashboard says Tempo MPP data is produced by a local RPC indexer summary, exposed through `tempo-data.json`, and then merged into `data.json` for the broader dashboard. That is different from the x402 route, which is described as Dune-backed coverage across multiple public sources. For MPP, the current source is narrower by design: it is a Tempo RPC-indexed view of the relevant event stream.",
      "This methodology gives the page a clean audit trail. Consumers can inspect the Tempo-specific JSON when they want the MPP source, or use the combined `data.json` file when they want all tracked protocol families in one payload. Keeping both endpoints visible also makes the caveat easier to preserve downstream. If a chart, article, or model cites the MPP count, it should label the value as Tempo RPC-indexed MPP events rather than generic agent payment transactions.",
      "The guide and the data file serve different jobs. The guide explains the protocol and its caveats; the data endpoint remains the place to read the latest machine-readable numbers.",
    ],
  },
  {
    eyebrow: "How to compare",
    heading: "MPP belongs beside x402, ACP, ERC-8004, and Olas, but it should not be normalized into one metric.",
    body: [
      "Agent Economy tracks several protocol families because the agent economy is not one homogeneous event stream. x402 reports settlement transactions and USD volume for HTTP-native payments. ERC-8004 reports agent identity and registry activity. Virtuals ACP reports job lifecycle memos for agent-to-agent commerce. Olas reports autonomous agent transactions. Tempo MPP reports channel events, payers, payees, event types, and daily rows.",
      "Those units answer different questions. MPP can help answer whether visible Tempo channel activity exists, how many addresses appear in the payer and payee roles, and what kinds of lifecycle events are being emitted. It does not answer how much USD value settled, how many human users paid, or how much of the count represents organic production use. The dashboard keeps this distinction front and center by showing the data fields and source links directly on the route.",
      "The practical comparison is therefore field-specific. Use MPP for Tempo machine-payment channels, x402 for tracked HTTP 402 settlement volume, ERC-8004 for identity supply, and ACP or Olas for agent commerce or autonomous service execution. Protocol-level analysis should preserve each protocol's native unit.",
    ],
  },
  {
    eyebrow: "Agent pattern",
    heading: "The useful design target is bounded autonomy, not invisible spending.",
    body: [
      "MPP is relevant to agents because autonomous software needs payment flows that can be constrained without becoming manual. A useful agent should be able to discover a service, evaluate its price, open or use a payment relationship, and stop when the task or budget is exhausted. That is different from asking a human to create an account, approve a subscription, and manage invoices for every machine-to-machine interaction.",
      "Channels and sessions fit this problem because they can make repeated access explicit. Instead of signing a separate high-friction payment for every small step, an agent can operate inside a defined payment relationship. The service still has a protocol-level way to meter usage, and the client still has a bounded surface for authorization. That is the pattern the MPP route is trying to make legible: not just that machines can pay, but that machines can maintain payment relationships without turning every request into a bespoke integration.",
      "This is also why the caveats matter. Early channel events can include testing, infrastructure, and repeated service behavior. Those are still important signals for protocol adoption, but they should not be confused with finished end-user commerce.",
    ],
  },
  {
    eyebrow: "Reading the chart",
    heading: "Daily rows show activity timing, but event mix explains what actually happened.",
    body: [
      "The current MPP daily series begins in March 2026 and runs through 39 loaded days in the live payload. A daily row contains events, payer counts, and payee counts for that date. This helps reveal whether activity arrives as isolated spikes or as repeated usage over time.",
      "A daily event total is only the first layer. Because MPP emits channel lifecycle events, two days with similar totals may represent different behavior. One day might be mostly channel openings, another might contain more closes, expirations, settlements, or top-ups. Analysts should therefore pair the time series with the `byType` breakdown before drawing adoption conclusions.",
      "This is the same conservative logic used across the site. Raw counts are valuable because they are observable, reproducible, and easy to inspect. Interpretation is harder. The page keeps the numbers close to their field names so downstream users can make careful claims: MPP events, unique payers, unique payees, event types, and daily rows, all from the Tempo RPC-indexed source.",
    ],
  },
  {
    eyebrow: "Bottom line",
    heading: "Tempo MPP is a distinct machine-payment signal, not a substitute for broader payment data.",
    body: [
      "The right way to read Tempo MPP is as a focused view into one emerging payment pattern. It shows that the Agent Economy dataset can see MPP channel activity on Tempo, and it provides enough structure to separate total events, participants by address role, event-type mix, and day-by-day activity. That is already useful for builders and researchers watching how machine payments evolve beyond single-call API monetization.",
      "The wrong way to read it is as a complete scoreboard for all machine commerce. The live source does not claim that. It says the route reports Tempo RPC-indexed events and that coverage is narrower than x402. It also keeps the raw endpoints visible so anyone can inspect the same fields instead of relying on a narrative summary.",
      "As the agent economy develops, the difference between payment protocols will matter more, not less. Tempo MPP's slice is machine payment channels on a payments-focused chain. Agent Economy tracks it because that slice is measurable, distinct, and relevant.",
    ],
  },
];

export const tempoMppJsonLd: ProtocolDoc["jsonLd"] = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "TechArticle",
      "@id": "https://agenteconomy.to/tempo-mpp#article",
      headline: "Tempo MPP Machine Payment Protocol Guide",
      description:
        "Tempo MPP is tracked as a Tempo RPC-indexed Machine Payments Protocol signal covering channel events, unique payers, unique payees, event types, and daily rows.",
      mainEntityOfPage: "https://agenteconomy.to/tempo-mpp",
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
      about: { "@id": "https://agenteconomy.to/tempo-mpp#defined-term" },
      mentions: ["HTTP 402", "machine payments", "payment channels", "stablecoin micropayments", "Tempo"],
    },
    {
      "@type": "DefinedTerm",
      "@id": "https://agenteconomy.to/tempo-mpp#defined-term",
      name: "Tempo MPP",
      termCode: "tempo-mpp",
      description:
        "Tempo MPP is the Machine Payments Protocol signal Agent Economy tracks through Tempo RPC-indexed channel events, payer addresses, payee addresses, event types, and daily rows.",
      inDefinedTermSet: {
        "@type": "DefinedTermSet",
        name: "Agent Economy Protocols",
        url: "https://agenteconomy.to",
      },
    },
    {
      "@type": "BreadcrumbList",
      "@id": "https://agenteconomy.to/tempo-mpp#breadcrumb",
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
          name: "Tempo MPP",
          item: "https://agenteconomy.to/tempo-mpp",
        },
      ],
    },
  ],
};
