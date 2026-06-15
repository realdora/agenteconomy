import type { ProtocolDoc } from "../protocol-data";

export const erc8004SeoDescription =
  "ERC-8004 guide to agent identity, reputation, validation, registry data, chain coverage, and why registered agents are tracked separately from payments.";

export const erc8004Content: ProtocolDoc["content"] = [
  {
    eyebrow: "Why it matters",
    heading: "ERC-8004 gives autonomous agents a public trust surface.",
    body: [
      "Agent-to-agent systems do not break only because payments are hard. They also break because counterparties are hard to recognize. A software client can receive a message, quote, API response, or task result from another agent, but it still needs to ask basic questions before it relies on that work. Who is this agent? Where is its public metadata? What capabilities does it claim? How has it behaved before? ERC-8004, commonly described as Trustless Agents, is aimed at that layer of the stack.",
      "The standard gives agents an on-chain registry surface without requiring every private interaction to become an on-chain transaction. That distinction matters. An economy of useful agents needs public identifiers and public coordination points, but most negotiation, inference, delivery, and verification work will still happen off-chain or inside application-specific systems. ERC-8004 keeps the shared part narrow: identity, reputation, and validation registries that other protocols and applications can reference.",
      "In the Agent Economy protocol map, ERC-8004 is therefore not treated as a payment rail. It is the trust and identity layer around payment rails. x402 and Tempo MPP focus on machine payments over HTTP. Virtuals ACP focuses on agent commerce workflows. Olas measures autonomous service activity. ERC-8004 answers a different question: how can an agent be addressed, inspected, and evaluated before or after it participates in those workflows?",
    ],
    callout:
      "The core idea is simple: trust should be something software can query, not something every marketplace has to rebuild from scratch.",
  },
  {
    eyebrow: "Identity",
    heading: "The identity registry turns an agent into a durable on-chain object.",
    body: [
      "The first registry is about identity. The existing Agent Economy brief describes each agent as an ERC-721 token that points to an agent card. The card is the place where the agent can publish practical metadata: name, capabilities, endpoints, and payment details. The point is not that an NFT makes an agent trustworthy by itself. The point is that the agent can have a durable, composable handle that other software can resolve before it decides what to do next.",
      "That handle is useful because agent interactions are expected to cross products, chains, and protocols. If every application creates a private account table for every agent, reputation and operational context are trapped inside each marketplace. A shared identity registry lets a client carry a consistent reference from discovery to payment to evaluation.",
      "The live dashboard currently frames this as registered-agent supply. It shows the total number of registered agents, the number of registry chains tracked, and the largest chain in the embedded distribution. Those numbers should be read as identity infrastructure adoption, not as revenue, payment volume, or completed work. A registered identity is the start of addressability. It is not proof that the agent has performed a paid task.",
    ],
    bullets: [
      { label: "Agent card", body: "A public pointer for metadata, capabilities, endpoints, and payment details." },
      { label: "ERC-721 identity", body: "A durable tokenized handle that applications can reference across workflows." },
      { label: "Shared namespace", body: "A way for agents to be discovered without each marketplace owning the whole identity layer." },
    ],
  },
  {
    eyebrow: "Reputation",
    heading: "Reputation is kept as an audit trail, not a universal score.",
    body: [
      "The second registry is reputation. In practice, reputation for autonomous agents is difficult to reduce to one global number. A research agent, a trading agent, an infrastructure bot, and a customer-support agent can all be good or bad in different ways. The useful primitive is not a single score that claims to settle every context. The useful primitive is an auditable record of feedback that clients and marketplaces can interpret according to their own rules.",
      "ERC-8004 is designed around client-authorized feedback rather than a free-for-all comment wall. That keeps the reputation surface closer to actual interactions. A client that hired, queried, or evaluated an agent can authorize feedback about that interaction. Other applications can decide whether to read that history, filter it, weight it, or ignore it.",
      "This is especially important for agent commerce. If agents are going to hire other agents, buy API calls, deliver work, and route tasks automatically, they need some memory of counterparties. But that memory has to be composable enough to move across systems. A public reputation registry gives the ecosystem a common reference point while still allowing application-level judgment.",
    ],
  },
  {
    eyebrow: "Validation",
    heading: "Validation tells a client how work can be checked.",
    body: [
      "The third registry is validation. Identity says which agent is being addressed. Reputation records what has been said about past interactions. Validation is about the current task: what method can decide whether the output is acceptable? The original brief describes validation through crypto-economic staking or cryptographic proof systems, including trusted execution environments and zero-knowledge proofs.",
      "That does not mean every agent task needs the same proof. Some tasks may be checked by an evaluator. Some may require a staked validator set. Some may rely on cryptographic evidence that code ran in a particular environment. Some may stay entirely application-specific. ERC-8004's role is to make the validation route visible enough for software to reason about it. A client can inspect the agent, see the expected validation path, and decide whether the assurance level matches the risk of the task.",
      "This is where ERC-8004 connects naturally to payment standards without becoming one. A payment protocol can move value at request time, but payment alone does not establish whether the purchased work is valid. A validation registry gives agents and applications a place to advertise the verification surface that sits around the paid interaction.",
    ],
    bullets: [
      { label: "Crypto-economic", body: "Validation can involve staking or economic accountability where that fits the task." },
      { label: "Cryptographic", body: "Proof-based approaches can include TEEs or zero-knowledge systems." },
      { label: "Discoverable", body: "Clients can inspect the validation route before accepting the work." },
    ],
  },
  {
    eyebrow: "Agent pattern",
    heading: "A client can move from discovery to trust checks before it pays.",
    body: [
      "A practical ERC-8004 flow starts before a transaction. A client discovers an agent, resolves its registered identity, reads the agent card, and checks whether the declared capabilities match the job. If the task has risk, the client can inspect reputation and the validation route. Only then does it move into negotiation, payment, or execution.",
      "That pattern is intentionally modular. ERC-8004 does not need to own the payment step. It can sit beside x402, ACP, MPP, custom escrow contracts, or ordinary API flows. The registry layer provides a shared answer to the trust questions that appear around those interactions. The payment or commerce layer can then focus on price, terms, settlement, and delivery.",
      "This is also why the same registered agent can matter across multiple applications. A useful agent should not have to start from zero reputation every time it appears in a new market. At the same time, no application should be forced to trust an agent merely because it is registered. Registration creates a public reference. Reputation and validation provide evidence. The application still decides how much that evidence is worth.",
    ],
  },
  {
    eyebrow: "What we track",
    heading: "The dataset follows registered agents and keeps units separate.",
    body: [
      "Agent Economy tracks ERC-8004 through the registry fields exposed in the live dataset. The current route source uses `erc8004Registry.totalAgents` for registered agents, `erc8004Registry.chainsTracked` for chain coverage, `erc8004Registry.chains` for the chain distribution, and `erc8004Registry.daily` for recent registration activity when available. The live dashboard also shows Base Agentic events on this page, but it labels them separately because they come from a related activity source and measure events rather than registered identities.",
      "That separation is deliberate. It would be misleading to add registered agents to payment transactions, job memos, or autonomous service transactions and call the sum economic activity. Each protocol has its own native unit. ERC-8004's native unit in this dataset is agent identity supply. A registered agent can later transact, but the registration itself is not counted as a payment.",
      "The old dashboard page makes the same boundary explicit in its FAQ and methodology copy: identity registrations are not payment transactions, and Base Agentic activity is displayed as a separate signal. The new long-form page keeps that conservative framing. The registry can be a leading indicator for agent infrastructure adoption, but it should not be overstated as proof of paid demand.",
    ],
  },
  {
    eyebrow: "How to read it",
    heading: "Chain distribution is a map of registry deployment, not a ranking of agent quality.",
    body: [
      "The chain table on the live route shows where registered identities are appearing. A large chain count says the registry footprint is multi-chain. A large top-chain count says one network currently has the biggest share of registered agents in the embedded distribution. Neither fact says that agents on one chain are better, more profitable, or more useful than agents on another chain. It says where registrations have happened in the tracked source.",
      "This matters because agent infrastructure is early and uneven. Some chains may attract experiments, campaigns, infrastructure providers, or application launches that create many registrations quickly. Others may have fewer registrations but more payment activity through separate protocols. The useful comparison is role by role: identity supply for ERC-8004, settlement activity for x402, memo activity for ACP, channel events for MPP, and autonomous service transactions for Olas.",
      "For researchers, the ERC-8004 page is best read as a registry lens. It helps answer how many agent identities are visible in the tracked source, how broad the chain coverage is, and how registration activity is distributed. It should then be paired with methodology notes and raw data when making broader claims about the agent economy.",
    ],
  },
  {
    eyebrow: "Caveats",
    heading: "Registration is necessary infrastructure, but it is not the whole market.",
    body: [
      "A registered agent is a useful primitive, not a complete business. The registry does not prove that the agent is active, profitable, safe, or high quality. It does not prove that every listed endpoint is still online. It does not prove that every capability claim should be trusted without validation. Those questions belong to reputation, validation, application monitoring, and protocol-specific activity data.",
      "The honest reading is narrower and more useful. ERC-8004 gives the ecosystem a way to make agents addressable and to attach trust evidence to those identities. Agent Economy tracks that surface because identity is one of the prerequisites for agent-to-agent commerce. Without addressable agents, payment and workflow protocols have less to coordinate around. With addressable agents, software can begin to combine identity, reputation, validation, and payment into workflows that are inspectable by other software.",
      "That is why ERC-8004 belongs beside the payment and commerce protocols on this site. It is not the same metric, and it should not be collapsed into the same count. It is the public trust layer that helps the rest of the agent economy become legible.",
    ],
  },
];

export const erc8004JsonLd: ProtocolDoc["jsonLd"] = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "TechArticle",
      "@id": "https://agenteconomy.to/erc-8004#techarticle",
      headline: "ERC-8004 Agent Registry Data Across Chains",
      description:
        "ERC-8004 is an Ethereum standard for autonomous agent identity, reputation, and validation. Agent Economy tracks registered agents, registry chain coverage, and related activity without counting identity registrations as payment events.",
      mainEntityOfPage: "https://agenteconomy.to/erc-8004",
      url: "https://agenteconomy.to/erc-8004",
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
        { "@id": "https://agenteconomy.to/erc-8004#definedterm" },
        "autonomous agents",
        "agent identity",
        "agent reputation",
        "agent validation",
        "Ethereum",
      ],
    },
    {
      "@type": "DefinedTerm",
      "@id": "https://agenteconomy.to/erc-8004#definedterm",
      name: "ERC-8004",
      termCode: "ERC-8004",
      description:
        "A trust layer for autonomous agents using registries for identity, reputation, and validation.",
      inDefinedTermSet: {
        "@type": "DefinedTermSet",
        name: "Agent Economy Protocols",
        url: "https://agenteconomy.to",
      },
    },
    {
      "@type": "BreadcrumbList",
      "@id": "https://agenteconomy.to/erc-8004#breadcrumb",
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
          name: "ERC-8004",
          item: "https://agenteconomy.to/erc-8004",
        },
      ],
    },
  ],
};
