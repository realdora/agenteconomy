import type { ProtocolDoc } from "../protocol-data";

export const virtualsAcpSeoDescription =
  "A long-form guide to Virtuals ACP and ERC-8183 agent commerce, covering job lifecycle memos, Base activity, escrowed work, evaluator checks, and measurement caveats.";

export const virtualsAcpContent: ProtocolDoc["content"] = [
  {
    eyebrow: "Protocol role",
    heading: "Virtuals ACP turns agent work into a measurable commercial workflow.",
    body: [
      "Virtuals ACP, the Agent Commerce Protocol, is the agent-to-agent commerce surface tracked by agent economy for the Virtuals ecosystem. The live dashboard frames ACP as an ERC-8183 flow on Base, where autonomous agents create work requests, negotiate or accept terms, deliver work, have that work evaluated, and move toward settlement through an auditable lifecycle. That is a narrower and more useful claim than saying every on-chain event is a finished purchase. ACP is about the commercial process around agent work: the request, the agreement, the delivery trail, the evaluation, and the record that lets outside observers see that a commerce workflow occurred.",
      "That distinction matters because most agent systems can already send messages, call APIs, and hand off tasks. Commerce needs a stronger boundary. A buyer agent needs to express what it wants. A seller agent needs to know what will count as completion. A payment path needs to exist before work starts, not after a human reads the result. An evaluator or verification step needs to say whether the delivered output matches the agreement. Without that structure, agent-to-agent work collapses into informal chat, blind transfers, or platform-specific trust. ACP packages the workflow into a protocol-shaped object so agents can transact with less bespoke coordination.",
      "In the Agent Economy map, ACP sits between identity infrastructure and simple payment rails. ERC-8004-style identity helps agents become discoverable and accountable. x402-style payment rails let machines pay for individual web resources. Tempo MPP focuses on machine payment channels. Olas measures autonomous service activity. ACP is different: it is the job marketplace primitive. It is the route for one agent to hire another agent for a defined task, with lifecycle events that expose whether the marketplace is being used. That makes ACP especially important for measuring whether agents are merely registered and funded, or actually asking each other to do work.",
      "The site voice around ACP is intentionally factual. The page should not imply that every memo is agent GDP, that every memo represents a completed trade, or that the memo count alone proves organic economic demand. The live source treats ACP memos as lifecycle activity, and this guide keeps the same standard. ACP is a strong signal for agent commerce because a memo belongs to a work process, but it is not the same thing as a revenue line item.",
    ],
    callout:
      "ACP is best read as commerce-process activity: on-chain evidence that agent job workflows are being created, delivered, evaluated, or settled.",
  },
  {
    eyebrow: "Agent pattern",
    heading: "The core pattern is request, agreement, delivery, evaluation, and settlement.",
    body: [
      "The practical pattern is simple enough to describe, but hard to replace with an ordinary payment button. A buyer agent starts with a job: find information, produce content, execute a transaction, monitor an event, route a lead, enrich a dataset, or complete another bounded piece of work. A seller agent advertises or accepts the work. The two sides need shared terms before value moves. ACP gives that process a lifecycle, so later observers do not have to infer the deal from unrelated wallet transfers.",
      "The live Agent Economy brief summarizes this as job creation, delivery, evaluation, and settlement. The current v4 page summarizes the same idea as request, negotiation, transaction, and evaluation. Those descriptions are compatible. Both are trying to name the same commercial sequence: there is an initial ask, a commitment to terms, a work product or service delivery, a check against the agreement, and a payment path. In an autonomous market, this sequence is more important than the UI around it. Agents may operate through wallets, APIs, model calls, or contract invocations, but the job still needs a shared state machine.",
      "Escrow is the key trust device. If a buyer agent pays a seller agent before delivery, it takes performance risk. If a seller agent works before payment is committed, it takes payment risk. Escrow narrows both risks by holding value against a defined agreement until the workflow reaches the required state. The protocol can then separate willingness to pay from final release of funds. That separation is useful when agents are transacting faster than a human operator can approve each step.",
      "Evaluation is the second trust device. Many agent jobs are not binary token transfers; they are claims about work quality. Did the seller return the requested research? Did the output satisfy the schema? Did an action happen on the right chain, account, or endpoint? Did a data task meet the requested format? ACP's evaluator role makes that verification explicit instead of burying it in social trust. The evaluator may be another agent, a service, or a verification path defined by the workflow, but the commercial point is the same: payment release should depend on whether the delivered work matches the agreement.",
      "Proof of Agreement language is useful because agent markets need a durable reference for what was agreed. Humans can renegotiate expectations in a chat thread. Autonomous agents need structured terms that can be referenced by software. In ACP, the job record becomes part of the market memory. It helps a buyer agent understand what it ordered, a seller agent understand what it owes, and an evaluator understand what to check. It also gives analysts a public trail to count, audit, and compare with other protocol families.",
    ],
    bullets: [
      { label: "Request", body: "A buyer agent describes a bounded job or service it wants another agent to perform." },
      { label: "Agreement", body: "Terms, deliverables, and the payment path are captured before final payment release." },
      { label: "Evaluation", body: "The delivered result can be checked against the agreement before settlement completes." },
    ],
  },
  {
    eyebrow: "Measurement",
    heading: "The dataset tracks ACP lifecycle memos, not finished purchases.",
    body: [
      "agent economy tracks Virtuals ACP through the public memo trail surfaced by the live dashboard and the underlying Dune source referenced in the original project. The live route reports total ACP memos and daily memo rows, with source links to the @hashed_official Virtuals ACP dashboard and the raw Agent Economy dataset. The older Stage 2 route used the same framing: ACP data is sourced from the public Dune ACP dashboard, embedded into data.json, and exposed as virtualsAcp.totalMemos plus virtualsAcp.daily. The new long-form page should preserve that methodology instead of inventing a different unit.",
      "A memo count is a good activity metric because the memo is part of the job lifecycle. It records that something happened inside the ACP workflow. But it is not a perfect economic metric. A single job can create more than one memo. Some memos can represent creation, delivery, evaluation, or settlement-adjacent steps rather than a final paid purchase. Some activity may be infrastructure, testing, retries, or marketplace operations rather than end-user demand. For that reason, the page describes ACP memos as commerce-process activity, not as one-to-one completed purchases and not as a direct USD GDP field.",
      "This is the same conservative approach agent economy uses across the protocol map. x402 settlement transactions and USD volume are tracked as payment activity, but raw settlement flow can still include infrastructure traffic. ERC-8004 registrations are identity supply, not payments. Olas transactions represent autonomous service activity, not HTTP micropayments. Tempo MPP events are channel events, not the same unit as x402 payments. ACP memos belong in that taxonomy as job workflow events. Keeping the native unit visible makes the dataset more honest and more useful for researchers.",
      "The practical use of the guide is orientation. It gives readers enough protocol context to understand the memo metric before they compare ACP with payment protocols, identity registries, or autonomous service networks. The latest count should still be read from the dataset, because the prose is meant to explain the unit rather than freeze a market snapshot.",
      "The practical result is a page that can rank for protocol queries without overstating what the data says. A reader should leave knowing that Virtuals ACP is the commerce workflow for agent-to-agent jobs, that ERC-8183 is the standard label used by the current dashboard for this route, that Base is the primary chain context in the live page, and that the tracked unit is an ACP memo. That is enough to understand the market signal while preserving the caveats that make the data credible.",
    ],
  },
  {
    eyebrow: "Why it matters",
    heading: "ACP is evidence that agents are becoming counterparties, not just tools.",
    body: [
      "The broader agent economy is easy to overstate if every bot action is treated as commerce. ACP is interesting because it points to a more specific threshold: one autonomous agent can become a buyer, another can become a seller, and the protocol can record the work relationship between them. That is closer to a real market than a single agent paying an API bill. It creates the possibility of agent supply chains, where specialized agents sell research, execution, monitoring, data transformation, creative work, trading support, or operational services to other agents.",
      "For developers, ACP suggests a distribution model for agent capabilities. A useful agent does not have to be embedded inside every application or sold only through a SaaS subscription. It can expose a service that other agents can discover and hire. The agreement and evaluation flow then becomes the integration surface. Instead of negotiating a custom contract with every counterparty, software can rely on a common job lifecycle. That is the same reason payment standards and identity registries matter: shared rails reduce coordination costs.",
      "For analysts, ACP gives a public activity record for a category that would otherwise be mostly invisible. Agent-to-agent work can happen off-chain, in private APIs, or inside platform databases. The ACP memo trail is not a full view of the economy, but it is a consistent public signal. It lets researchers compare the cadence of job workflow activity over time, watch how many daily rows are being loaded, and separate ACP from other protocol families. The count should be interpreted with care, but it should not be ignored.",
      "For the site, the editorial stance is straightforward: explain the protocol, show the unit, link the source, and keep the caveat close to the claim. Virtuals ACP is the commerce layer for autonomous agents in the Virtuals ecosystem. agent economy tracks the memos because they are the measurable footprint of that commerce layer. The page should make that useful without turning a workflow metric into a promise about completed revenue.",
    ],
  },
];

export const virtualsAcpJsonLd: ProtocolDoc["jsonLd"] = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "TechArticle",
      "@id": "https://agenteconomy.to/virtuals-acp#article",
      headline: "Virtuals ACP Agent Commerce and ERC-8183 Data",
      description:
        "Virtuals ACP is the Agent Commerce Protocol route tracked by agent economy for ERC-8183-style agent-to-agent commerce workflow activity, lifecycle memos, escrowed work, and evaluator verification.",
      mainEntityOfPage: "https://agenteconomy.to/virtuals-acp",
      isPartOf: {
        "@type": "WebSite",
        name: "agent economy",
        url: "https://agenteconomy.to",
      },
      about: [
        { "@id": "https://agenteconomy.to/virtuals-acp#defined-term" },
        "agent-to-agent commerce",
        "ERC-8183",
        "Base",
        "on-chain lifecycle memos",
      ],
    },
    {
      "@type": "DefinedTerm",
      "@id": "https://agenteconomy.to/virtuals-acp#defined-term",
      name: "Virtuals ACP",
      alternateName: ["Agent Commerce Protocol", "ACP", "ERC-8183"],
      description:
        "Virtuals ACP is an agent-to-agent commerce workflow for job creation, delivery, evaluation, and settlement activity. agent economy tracks it through ACP lifecycle memos rather than treating every memo as a completed purchase.",
      inDefinedTermSet: "Agent Economy protocol map",
      url: "https://agenteconomy.to/virtuals-acp",
      termCode: "virtuals-acp",
    },
    {
      "@type": "BreadcrumbList",
      "@id": "https://agenteconomy.to/virtuals-acp#breadcrumb",
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
          name: "Virtuals ACP",
          item: "https://agenteconomy.to/virtuals-acp",
        },
      ],
    },
  ],
};
