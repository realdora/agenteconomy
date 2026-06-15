import type { ProtocolDoc } from "../protocol-data";

export const x402SeoDescription =
  "x402 guide for HTTP 402 agent payments, stablecoin API settlement, facilitator infrastructure, live transaction volume, and measurement caveats.";

export const x402Content: ProtocolDoc["content"] = [
  {
    eyebrow: "Why it matters",
    heading: "x402 makes payment part of the request itself.",
    body: [
      "x402 is an HTTP-native payment standard for machine-readable resource access. It revives the long-dormant 402 Payment Required status code and gives it a practical flow for APIs, files, inference calls, data feeds, and other resources that can be priced at request time. A client asks for a resource. The server responds with payment requirements. The client signs a stablecoin payment and retries the request with proof of payment. A facilitator verifies the payment and settles it on-chain, while the server can stay focused on the resource it is selling.",
      "The useful change is not just that checkout gets shorter. The useful change is that a web server can quote a price in the same protocol channel where the resource is requested. That matters for agents because an agent cannot reliably use a human checkout page, remember a password, complete a credit-card form, or wait for a sales process before making a small call. It can, however, parse a machine-readable payment requirement, decide whether the terms are acceptable, sign a payment with a wallet it controls, and continue the HTTP flow.",
      "This turns paid access into something composable. A service can expose a specialized endpoint without first building accounts, billing plans, card rails, or a subscription funnel. A client can pay only when it needs the resource. The pattern is especially relevant for small API calls and metered work: one data lookup, one model response, one crawl result, one enriched record, or one gated file. The server prices the resource close to the endpoint; the client evaluates the price close to the task.",
    ],
    callout:
      "The protocol is small by design: request, payment requirement, signed payment, facilitator verification, settlement.",
  },
  {
    eyebrow: "Payment flow",
    heading: "The 402 response becomes a machine-readable price quote.",
    body: [
      "In a typical x402 interaction, the first request does not assume the client has an account. The server can answer with HTTP 402 and attach the payment terms needed to unlock the resource. Those terms describe what must be paid, where it should settle, and how the client should present proof. The client then decides whether to proceed. If the price and network are acceptable, it signs the payment and sends a second request carrying the payment proof.",
      "A facilitator sits between the web application and the chain-specific details. Its job is to verify the payment payload, handle the settlement path, and give the server a simpler integration surface. That facilitator role is why the live dashboard tracks facilitator share separately from total transactions and chain distribution. The adoption question is not only how many x402 payments exist; it is also how concentrated the verifying and settling infrastructure is.",
      "The design is useful because it avoids forcing every paid API provider to become a wallet, node, indexing, and settlement operator. Servers can implement payment-gated routes while outsourcing the chain-heavy work. Clients still get a direct payment primitive over HTTP, and facilitators compete on reliability, chain coverage, developer ergonomics, and settlement support.",
    ],
    bullets: [
      {
        label: "First request",
        body: "The client asks for a protected resource and receives HTTP 402 payment requirements instead of a checkout page.",
      },
      {
        label: "Second request",
        body: "The client retries with a signed stablecoin payment or proof that satisfies the quoted terms.",
      },
      {
        label: "Settlement",
        body: "A facilitator verifies the payload and settles on-chain so the resource server does not need full blockchain infrastructure.",
      },
    ],
  },
  {
    eyebrow: "Agent pattern",
    heading: "Agents can pay for work without a prior billing relationship.",
    body: [
      "The agent economy needs payment surfaces that do not assume a human buyer is watching every transaction. An agent may need to call a weather API, buy a fresh dataset row, query a specialized search service, pay for a model inference, or retrieve a protected document while completing a larger task. In the old web pattern, each of those services would often require account creation, card entry, a billing portal, or a subscription plan. That is a bad fit for autonomous software.",
      "x402 changes the integration shape. The agent can discover a paid resource, request it, inspect the returned terms, and either pay or decline. The service does not need to know the agent in advance. The agent does not need to negotiate an enterprise contract before a one-off call. This makes per-use pricing viable for narrow services that are valuable in the moment but not important enough to justify a full customer relationship.",
      "The same property also helps human-facing applications that call other services behind the scenes. A product can let agents or automated workflows pay for upstream data as needed, then expose the result to the user. That does not make every settlement an organic end-user purchase, and it does not remove the need for fraud, quota, compliance, or policy controls. It does make the payment instruction legible to software, which is the important primitive.",
    ],
    callout:
      "A useful agent payment protocol does not ask every seller to run a billing company or every buyer to pre-register everywhere.",
  },
  {
    eyebrow: "What Agent Economy tracks",
    heading: "The live metric follows visible on-chain settlement activity.",
    body: [
      "Agent Economy tracks x402 through public on-chain settlement activity reflected in the project dataset. The live dashboard currently reports 150,005,139 total x402 transactions, $40,677,242 of USD settlement volume, 18 facilitators tracked, and 7 chains tracked. It also breaks out chain concentration and facilitator share; in the live source used for this page, Base is the largest chain row with 72,058,130 transactions, and Coinbase is the largest facilitator row at 29.2% share.",
      "Those numbers are useful because x402 activity leaves a measurable trail. Instead of relying only on announcements or private API logs, the dataset can observe settlement events, aggregate them into `data.json`, and separate totals by transaction count, USD volume, facilitator rows, chain rows, daily trends, and monthly trends. The old dashboard route and this apex page use the same underlying x402 fields: `x402.totalTxs`, `x402.totalVolume`, `x402.protocols`, `x402.chains`, and the trend arrays used for time-series views.",
      "The source trail matters. The x402 rows are pulled from public Dune dashboards, including @thechriscen / x402 Payment Analytics and @hashed_official / x402 Analytics, then embedded into the Agent Economy raw dataset by the daily pipeline. This page is not claiming a private measurement feed or an audited revenue number. It is presenting the visible protocol footprint that can be tracked from the available public data.",
    ],
    bullets: [
      {
        label: "Scale",
        body: "Total transactions and USD settlement volume show the visible size of x402 settlement activity.",
      },
      {
        label: "Distribution",
        body: "Chain rows and facilitator share show where usage and infrastructure are concentrated.",
      },
      {
        label: "Source",
        body: "The route is grounded in public Dune sources and the same Agent Economy `data.json` fields used by the dashboard.",
      },
    ],
  },
  {
    eyebrow: "Caveats",
    heading: "Settlement activity is a market signal, not audited commerce.",
    body: [
      "The honest interpretation is narrower than the headline number. Raw on-chain settlement events can include tests, infrastructure traffic, repeated service calls, self-directed usage, and other activity that is real at the protocol layer but not the same thing as verified organic end-user commerce. A high transaction count shows that the payment path is being exercised. It does not, by itself, prove that every transaction is a distinct paying customer buying a useful service.",
      "That is why Agent Economy keeps x402 as its own protocol row instead of mixing it into a single undifferentiated agent revenue claim. x402 reports settlement transactions and USD volume. ERC-8004 reports registered agent identities. Virtuals ACP reports commerce lifecycle memos. Tempo MPP reports indexed channel and settlement events. Olas reports autonomous agent transactions. These are related signals, but they are not interchangeable units.",
      "The conservative read is also the most useful one for builders. x402 shows that HTTP-native stablecoin payments have an observable deployment footprint across multiple chains and facilitators. The next questions are about composition: which endpoints use it, which clients can pay automatically, whether facilitator share decentralizes over time, how much activity maps to durable API demand, and whether the pattern becomes boring enough that developers treat paid access as another normal HTTP capability.",
    ],
    callout:
      "Read x402 totals as visible protocol activity. Genuine commerce is a subset that requires more context than settlement logs alone can provide.",
  },
  {
    eyebrow: "Positioning",
    heading: "x402 is one payment primitive in a broader agent stack.",
    body: [
      "x402 is not the whole agent economy. It is the HTTP payment layer for resource access: a way for clients and servers to exchange payment requirements and proofs around a single resource request. Other protocols solve different problems. ERC-8004 focuses on agent identity, reputation, and validation. Virtuals ACP focuses on agent-to-agent commerce workflows with agreements, deliverables, evaluation, and settlement. Tempo MPP is tracked separately because it points toward a machine payment and channel pattern rather than the same cross-chain x402 measurement surface. Olas is tracked as autonomous service activity.",
      "That separation is important because it prevents category inflation. A registry event is not a payment. A job memo is not necessarily an API call. A channel event is not the same unit as a 402-gated resource. The agent economy will likely use many primitives at once: identity to know who is acting, reputation to decide whether to trust them, payment rails to compensate services, and validation systems to prove work was completed. x402 owns the narrow but powerful slice where a web resource can demand payment directly through HTTP.",
      "For developers, the practical question is whether a resource should be sold per request. If the resource is small, high-frequency, globally accessible, and useful to software, x402 is a natural fit. If the relationship requires long-lived negotiation, escrowed deliverables, complex refunds, or reputation-weighted counterparties, it may need a higher-level commerce protocol around it. The point of tracking x402 separately is to see whether the simple HTTP payment primitive becomes a standard substrate that other agent systems can call when money needs to move.",
    ],
  },
];

export const x402JsonLd: ProtocolDoc["jsonLd"] = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "TechArticle",
      "@id": "https://agenteconomy.to/x402#techarticle",
      headline: "x402: HTTP 402 Agent Payments and Settlement Activity",
      description:
        "A factual guide to x402, the HTTP 402 payment standard for machine-readable resource access, stablecoin settlement, facilitator infrastructure, and Agent Economy measurement caveats.",
      mainEntityOfPage: "https://agenteconomy.to/x402",
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
        { "@id": "https://agenteconomy.to/x402#definedterm" },
        "HTTP 402",
        "agent payments",
        "stablecoin settlement",
        "API monetization",
      ],
      mentions: [
        "Coinbase facilitator",
        "Dune x402 Payment Analytics",
        "Agent Economy data.json",
      ],
    },
    {
      "@type": "DefinedTerm",
      "@id": "https://agenteconomy.to/x402#definedterm",
      name: "x402",
      termCode: "x402",
      description:
        "An HTTP-native payment standard that uses HTTP 402 payment requirements so clients and agents can pay for machine-readable resources with signed stablecoin payments.",
      inDefinedTermSet: {
        "@type": "DefinedTermSet",
        name: "Agent Economy Protocols",
        url: "https://agenteconomy.to",
      },
    },
    {
      "@type": "BreadcrumbList",
      "@id": "https://agenteconomy.to/x402#breadcrumb",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "agent economy",
          item: "https://agenteconomy.to/",
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "x402",
          item: "https://agenteconomy.to/x402",
        },
      ],
    },
  ],
};
