// Editorial intro content for each protocol page. These pages *introduce* the
// protocol — the live numbers live in the dataset (/data) and future dashboards,
// not here, so visitors aren't confused into thinking data is shown per-protocol.

import { erc8004Content, erc8004JsonLd, erc8004SeoDescription } from "./protocol-content/erc-8004";
import { olasContent, olasJsonLd, olasSeoDescription } from "./protocol-content/olas";
import { tempoMppContent, tempoMppJsonLd, tempoMppSeoDescription } from "./protocol-content/tempo-mpp";
import {
  virtualsAcpContent,
  virtualsAcpJsonLd,
  virtualsAcpSeoDescription,
} from "./protocol-content/virtuals-acp";
import { x402Content, x402JsonLd, x402SeoDescription } from "./protocol-content/x402";

export type ProtocolDoc = {
  slug: string;
  name: string;
  tagline: string;
  seoDescription: string;
  overview: string;
  points: { label: string; body: string }[];
  content: {
    eyebrow: string;
    heading: string;
    body: string[];
    callout?: string;
    bullets?: { label: string; body: string }[];
  }[];
  jsonLd: Record<string, unknown>;
  dataKey: string; // its key in agenteconomy.to/data.json
};

export const PROTOCOL_SLUGS = ["x402", "erc-8004", "virtuals-acp", "olas", "tempo-mpp"] as const;

const PROTOCOLS: Record<string, ProtocolDoc> = {
  x402: {
    slug: "x402",
    name: "x402",
    tagline: "An open standard for paying over HTTP — built for agents.",
    seoDescription: x402SeoDescription,
    overview:
      "x402 is an open payment standard from Coinbase that revives the dormant HTTP 402 “Payment Required” status code. It lets any client — a person or an AI agent — pay for an API call or a piece of content with stablecoins directly over HTTP, with no account, session, or sign-up.",
    points: [
      { label: "402 Payment Required", body: "The server answers a request with the payment terms attached in a header." },
      { label: "Pay over HTTP", body: "The client returns a signed stablecoin payment in the next request — no account or login." },
      { label: "Facilitators settle", body: "A facilitator verifies and settles on-chain, so the server needs no blockchain infrastructure. Works across EVM chains and Solana." },
    ],
    content: x402Content,
    jsonLd: x402JsonLd,
    dataKey: "x402",
  },
  "erc-8004": {
    slug: "erc-8004",
    name: "ERC-8004",
    tagline: "A trust layer for agents — identity, reputation, validation on Ethereum.",
    seoDescription: erc8004SeoDescription,
    overview:
      "ERC-8004, “Trustless Agents,” is an Ethereum standard (live on mainnet since early 2026) that lets autonomous agents trust one another without a central authority. It extends agent-to-agent protocols into a trustless setting through three lightweight on-chain registries.",
    points: [
      { label: "Identity", body: "Each agent is an ERC-721 token pointing to an on-chain “agent card” — its name, capabilities, endpoints, and payment address." },
      { label: "Reputation", body: "An on-chain audit trail of client-authorized feedback, without putting every interaction on-chain." },
      { label: "Validation", body: "Work is verified through crypto-economic staking or cryptographic proofs (TEEs, zero-knowledge)." },
    ],
    content: erc8004Content,
    jsonLd: erc8004JsonLd,
    dataKey: "erc8004Registry",
  },
  "virtuals-acp": {
    slug: "virtuals-acp",
    name: "Virtuals ACP",
    tagline: "The commerce layer for autonomous agents.",
    seoDescription: virtualsAcpSeoDescription,
    overview:
      "The Agent Commerce Protocol (ACP) is the commerce layer of Virtuals Protocol — an open standard for verifiable commerce between autonomous agents. It gives agent-to-agent transactions a trust substrate so agents can discover, hire, and pay one another at scale.",
    points: [
      { label: "Four phases", body: "Every deal moves through request, negotiation, transaction, and evaluation." },
      { label: "Escrow + Proof of Agreement", body: "Payment and deliverables are held in escrow until an evaluator verifies the work against a signed agreement." },
      { label: "On-chain record", body: "Each agreement is recorded on-chain for auditability — the “memos” the dataset tracks." },
    ],
    content: virtualsAcpContent,
    jsonLd: virtualsAcpJsonLd,
    dataKey: "virtualsAcp",
  },
  olas: {
    slug: "olas",
    name: "Olas",
    tagline: "A network for co-owned autonomous agents.",
    seoDescription: olasSeoDescription,
    overview:
      "Olas (formerly Autonolas) is a decentralized network for autonomous services. Built on its Open Autonomy framework, it lets developers compose multi-agent systems — agents that run continuously, act on their own, and bridge on-chain and off-chain work.",
    points: [
      { label: "Open Autonomy", body: "A framework for building agent services as multi-agent systems that mostly run off-chain while settling on-chain." },
      { label: "Always on", body: "Services run continuously and take autonomous action — from DeFi to prediction markets to DAO governance." },
      { label: "Multi-chain", body: "Deployed across eight chains, with permissionless participation." },
    ],
    content: olasContent,
    jsonLd: olasJsonLd,
    dataKey: "olas",
  },
  "tempo-mpp": {
    slug: "tempo-mpp",
    name: "Tempo MPP",
    tagline: "The Machine Payments Protocol — HTTP 402 payments on Tempo.",
    seoDescription: tempoMppSeoDescription,
    overview:
      "MPP, the Machine Payments Protocol, is an open standard co-designed by Stripe and Tempo that — like x402 — revives the HTTP 402 status code for machine-to-machine payments. It settles on Tempo, a payments-focused chain with roughly half-second finality and sub-cent fees.",
    points: [
      { label: "402 over HTTP", body: "Machines pay each other directly over the web, the same pattern x402 popularized." },
      { label: "Built for payments", body: "Tempo settles in ~500ms with sub-cent fees, and servers can sponsor gas for clients." },
      { label: "Charges, sessions, subscriptions", body: "One-off charges, pay-as-you-go payment channels, or recurring access — the channel events the dataset tracks." },
    ],
    content: tempoMppContent,
    jsonLd: tempoMppJsonLd,
    dataKey: "tempoMpp",
  },
};

export function getProtocol(slug: string): ProtocolDoc | null {
  return PROTOCOLS[slug] ?? null;
}
