import type { ProtocolDoc } from "../protocol-data";

export const masumiSeoDescription =
  "Masumi guide: escrow-settled agent payments on Cardano, counted from the mainnet payment contract via the public Koios API — transactions, weekly series, and the caveats that come with a non-EVM source.";

export const masumiContent: ProtocolDoc["content"] = [
  {
    eyebrow: "Current signal",
    heading: "Masumi is the one agent-payment rail this dataset measures outside the EVM and Solana worlds.",
    body: [
      "Every other protocol on this site settles on an EVM chain or on Solana. Masumi settles on Cardano, which is why it is counted through a different path: the public Koios API, reading the mainnet payment contract's own transaction history rather than a Dune query or an RPC log scan. The count in the table above is transactions against that escrow contract, cross-verified against Masumi's own explorer.",
      "That independence is the point. When a protocol publishes its own activity figure and an outside party recomputes it from the chain and lands in the same place, the number stops being a claim and becomes a measurement. Masumi is the case where this site's figure and the project's public explorer agree closely, with the gap explained by refresh timing rather than methodology.",
      "The weekly series is rebuilt from the contract's full on-chain history using block timestamps and Monday-start UTC weeks. The current week is withheld until it closes, for the same reason the rest of the site withholds partial periods: an incomplete week rendered beside complete ones reads as a collapse that has not happened.",
    ],
    callout:
      "The measured unit is transactions against the Masumi mainnet payment contract on Cardano — escrow activity, not audited end-user commerce.",
  },
  {
    eyebrow: "Protocol shape",
    heading: "Escrow is the mechanism, and it is what makes Masumi structurally different from the payment rails beside it.",
    body: [
      "x402 settles the moment a request is paid. Masumi holds the money first. One agent locks funds in a contract, the other performs the work, and the contract releases payment when the job is registered as done. The payment and the delivery are bound together in a single on-chain object rather than being two events that happen to follow each other.",
      "That difference matters for what the number means. An x402 settlement proves a payment happened. A Masumi transaction traces the lifecycle of a deal — funds locked, work delivered, payment released, or the escrow unwound. It is a smaller count attached to a heavier act, which is why the totals here are orders of magnitude below the HTTP-402 rails and should not be read as evidence that Masumi is proportionally less significant.",
      "Alongside payments, Masumi runs a decentralised identity layer and a public agent registry, so an agent hiring another agent can check who it is dealing with before locking funds. This site does not currently measure those two components — only the payment contract — and says so rather than implying broader coverage than it has.",
    ],
    bullets: [
      { label: "Escrow payments", body: "Funds lock on-chain and release when the job is delivered, rather than settling on request." },
      { label: "Verified identity", body: "Agents carry a decentralised identifier and a reputation record, so counterparties are checkable." },
      { label: "Public registry", body: "A searchable list of agents and their track records, callable through the API." },
    ],
  },
  {
    eyebrow: "What we track",
    heading: "One field, honestly scoped: transactions against the mainnet payment contract.",
    body: [
      "The dataset carries `masumi.totalTxs` as the cumulative count and `masumi.weekly` as the completed-week series, both in the off-chain feed at `web-sources.json` rather than in `data.json`. That placement is deliberate and worth explaining, because it is the kind of detail that gets lost when a figure is quoted downstream.",
      "The on-chain feed holds sources measured through this site's own indexing and Dune coverage. Masumi is read through a third-party public API — Koios — so it sits with the sourced signals instead. The distinction is about provenance, not confidence: the Koios path reads the same Cardano chain state anyone else would, and the figure is cross-checked against Masumi's explorer.",
      "What the count does not include: identity registrations, registry entries, and any activity on the Sokosumi marketplace built on top of Masumi. An agent could be registered, discoverable and reputable without ever appearing in this number, because this number only sees escrow transactions.",
    ],
  },
  {
    eyebrow: "Methodology",
    heading: "Counted from Cardano's chain state through a public API, then cross-verified.",
    body: [
      "Cardano's UTXO accounting does not map onto the EVM patterns the rest of this pipeline is built around, so Masumi gets its own path. The fetcher walks the payment contract's transaction history through Koios, a public Cardano API that requires no key, and rebuilds both the cumulative total and the weekly buckets from block timestamps.",
      "Because the walk starts from the contract's full history rather than from a stored baseline, the series is recomputed rather than accumulated. That is slower but harder to corrupt: a bad run produces a visibly wrong number rather than silently poisoning a running total that no later run can correct.",
      "The result is cross-verified against Masumi's public explorer. The two figures track closely, and where they differ it is by the amount you would expect from two systems refreshing at different moments — not by an amount that would suggest either is counting something different.",
    ],
  },
  {
    eyebrow: "How to compare",
    heading: "It shares a lineage with x402, and that lineage is now official.",
    body: [
      "Masumi has been merged into the x402 standard, which makes the relationship between the two more than thematic. They remain separately measured here because they settle on different chains through different mechanisms, and blending an escrow count on Cardano into an HTTP-402 settlement count across EVM chains and Solana would produce a total whose unit nobody could name.",
      "Read Masumi when the question is about escrowed agent-to-agent work, or about whether agent payments exist outside the EVM and Solana orbit at all. Read x402 when the question is about per-request payment volume. Read Virtuals ACP when it is about the commerce lifecycle between agents, which is closest to Masumi in intent but records memos rather than escrow settlements.",
      "The comparison worth making is directional, not proportional: whether escrow-based settlement is growing as a share of measured agent payment activity, and whether it stays confined to Cardano or the merged standard carries the pattern onto other chains.",
    ],
  },
  {
    eyebrow: "Bottom line",
    heading: "A small number with an unusually clean provenance.",
    body: [
      "Masumi contributes the smallest transaction count of any payment rail tracked here, and it is one of the best-evidenced. It is read from the chain through a public API anyone can call, rebuilt from full history rather than accumulated, cross-verified against the project's own explorer, and scoped explicitly to escrow transactions rather than dressed up as total protocol adoption.",
      "It also does something no other tracked protocol does for this dataset: it demonstrates that the measurement approach is not an artefact of EVM tooling. If agent payments were only measurable where Dune has coverage, the picture would be shaped by the tooling rather than by the economy. Masumi is the check on that.",
    ],
  },
];

export const masumiJsonLd: ProtocolDoc["jsonLd"] = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "TechArticle",
      "@id": "https://agenteconomy.to/masumi#article",
      headline: "Masumi Escrow Agent Payments on Cardano — Measurement Guide",
      description:
        "Masumi is tracked as escrow-settled agent payment activity on Cardano, counted from the mainnet payment contract through the public Koios API and cross-verified against the project's explorer.",
      mainEntityOfPage: "https://agenteconomy.to/masumi",
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
      about: { "@id": "https://agenteconomy.to/masumi#defined-term" },
      mentions: ["Cardano", "escrow payments", "agent identity", "Koios", "x402", "agent registry"],
    },
    {
      "@type": "DefinedTerm",
      "@id": "https://agenteconomy.to/masumi#defined-term",
      name: "Masumi",
      termCode: "masumi",
      description:
        "Masumi is an agent payment network on Cardano combining escrow settlement, decentralised agent identity and a public agent registry. Agent Economy measures the transactions recorded against its mainnet payment contract.",
      inDefinedTermSet: {
        "@type": "DefinedTermSet",
        name: "Agent Economy Protocols",
        url: "https://agenteconomy.to",
      },
    },
    {
      "@type": "BreadcrumbList",
      "@id": "https://agenteconomy.to/masumi#breadcrumb",
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
          name: "Masumi",
          item: "https://agenteconomy.to/masumi",
        },
      ],
    },
  ],
};
