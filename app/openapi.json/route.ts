// AN-2 — machine-readable data contract for the agent-economy feeds.
// Served at https://agenteconomy.to/openapi.json so agents can discover the exact
// shape (fields, units, examples) of /data.json and /web-sources.json, validate
// responses, and codegen clients. CORS-open; linked from llms.txt + JSON-LD.

const SITE = "https://agenteconomy.to";

// A money/count integer with an explicit unit for agent consumers (OpenAPI has no
// native unit, so units live in `description` + the `x-unit` extension).
const num = (description: string, unit: string, example?: number) => ({
  type: "integer",
  description,
  "x-unit": unit,
  ...(example !== undefined ? { example } : {}),
});

const openapi = {
  openapi: "3.1.0",
  info: {
    title: "agent economy — data API",
    version: "1.0.0",
    summary: "Open, key-less JSON feeds for on-chain agent-payment activity and off-chain agent-economy signal.",
    description:
      "Two schema-stable JSON documents describing the agent economy. `/data.json` = on-chain, measured " +
      "(5 protocols, 11+ chains). `/web-sources.json` = off-chain, sourced (token market, service & agent " +
      "supply, the Virtuals economy, developer adoption, Masumi). No API key or signup. CORS-open. " +
      "Both carry `updatedAt`; per-section `asOf`/`note` describe provenance on the off-chain feed. " +
      "Agents can also call the MCP server at /api/mcp.",
    license: { name: "Open data — free to use and cite", url: `${SITE}/about` },
    contact: { name: "agent economy", url: SITE },
  },
  servers: [{ url: SITE }],
  paths: {
    "/data.json": {
      get: {
        operationId: "getOnChainData",
        summary: "On-chain agent-payment activity (measured).",
        description: "Cumulative + time-series metrics per tracked protocol, built from public on-chain data.",
        responses: {
          "200": {
            description: "The on-chain feed.",
            content: { "application/json": { schema: { $ref: "#/components/schemas/OnChainFeed" } } },
          },
        },
      },
    },
    "/web-sources.json": {
      get: {
        operationId: "getOffChainSignal",
        summary: "Off-chain agent-economy signal (sourced).",
        description: "Market, supply and developer-adoption lenses the on-chain feed can't show. Web-sourced.",
        responses: {
          "200": {
            description: "The off-chain feed.",
            content: { "application/json": { schema: { $ref: "#/components/schemas/OffChainFeed" } } },
          },
        },
      },
    },
  },
  components: {
    schemas: {
      Source: {
        type: "object",
        description: "Provenance for an on-chain metric.",
        properties: {
          name: { type: "string", example: "x402 Payment Analytics" },
          author: { type: "string", example: "@thechriscen" },
          queryId: { type: "integer", description: "Dune query id", example: 6058135 },
        },
      },
      DailyPoint: {
        type: "object",
        properties: { day: { type: "string", format: "date", example: "2026-04-06" }, txs: num("Transactions that day", "transactions") },
      },
      OnChainFeed: {
        type: "object",
        required: ["updatedAt", "x402"],
        properties: {
          updatedAt: { type: "string", format: "date-time", description: "When the feed was last regenerated." },
          sources: { type: "array", items: { $ref: "#/components/schemas/Source" } },
          x402: {
            type: "object",
            description: "HTTP 402 payment standard for agents.",
            properties: {
              totalTxs: num("Cumulative x402 transactions", "transactions", 150005139),
              totalVolume: num("Cumulative settled volume", "USD", 40700000),
              facilitatorsTracked: num("Distinct facilitators tracked", "count"),
              chainsTracked: num("Chains tracked", "count"),
              monthly: { type: "array", items: { type: "object", properties: { month: { type: "string" }, txs: num("Monthly transactions", "transactions"), vol: num("Monthly volume", "USD") } } },
              daily: { type: "array", items: { $ref: "#/components/schemas/DailyPoint" } },
              protocols: { type: "array", description: "Per-facilitator share.", items: { type: "object", properties: { name: { type: "string" }, share: { type: "number", description: "Share of activity", "x-unit": "fraction" }, color: { type: "string" } } } },
              chains: { type: "array", items: { type: "object", properties: { name: { type: "string" }, txs: num("Transactions on chain", "transactions"), color: { type: "string" } } } },
            },
          },
          baseAgentic: { type: "object", description: "Base agentic-ecosystem activity (context, not a standard).", properties: { totalTxs: num("Cumulative transactions", "transactions"), daily: { type: "array", items: { $ref: "#/components/schemas/DailyPoint" } } } },
          virtualsAcp: { type: "object", description: "Virtuals Agent Commerce Protocol.", properties: { totalMemos: num("Cumulative ACP memos", "memos"), daily: { type: "array", items: { type: "object", properties: { day: { type: "string", format: "date" }, memos: num("Memos that day", "memos") } } } } },
          tempoMpp: { type: "object", description: "Tempo Machine Payments Protocol.", properties: { totalEvents: num("Cumulative events", "events"), uniquePayers: num("Distinct payers", "count"), uniquePayees: num("Distinct payees", "count") } },
          erc8004Registry: { type: "object", description: "ERC-8004 agent trust registry.", properties: { totalAgents: num("Cumulative agents registered", "agents"), chainsTracked: num("Chains tracked", "count"), chains: { type: "array", items: { type: "object", properties: { name: { type: "string" }, agents: num("Agents on chain", "agents") } } }, daily: { type: "array", items: { type: "object", properties: { day: { type: "string", format: "date" }, agents: num("Agents that day", "agents") } } } } },
          olas: { type: "object", description: "Olas autonomous-agent network.", properties: { totalTxs: num("Cumulative transactions", "transactions"), chains: { type: "array", items: { type: "object", properties: { name: { type: "string" }, txs: num("Transactions on chain", "transactions") } } }, weekly: { type: "array", items: { type: "object", properties: { week: { type: "string" }, txs: num("Weekly transactions", "transactions") } } } } },
        },
      },
      OffChainFeed: {
        type: "object",
        required: ["updatedAt", "schema"],
        properties: {
          updatedAt: { type: "string", format: "date-time" },
          schema: { type: "integer", description: "Schema version of this feed.", example: 2 },
          agentTokens: {
            type: "object",
            description: "Agent-token market (CoinGecko). Basket is hand-curated; category totals include some memecoins.",
            properties: {
              asOf: { type: "string", format: "date-time" },
              basketMcap: num("Curated agent-token basket market cap", "USD", 1227429119),
              basketVol24h: num("Basket 24h trading volume", "USD"),
              basket: { type: "array", items: { type: "object", properties: { label: { type: "string" }, symbol: { type: "string" }, note: { type: "string" }, mcap: num("Market cap", "USD"), price: { type: "number", "x-unit": "USD" }, change24h: { type: "number", "x-unit": "percent" } } } },
              categories: { type: "array", items: { type: "object", properties: { name: { type: "string" }, mcap: num("Category market cap", "USD"), vol24h: num("Category 24h volume", "USD") } } },
              note: { type: "string" },
            },
          },
          x402Services: { type: "object", description: "x402 Bazaar service supply.", properties: { asOf: { type: "string", format: "date-time" }, uniqueProviders: num("Unique provider domains", "providers", 904), totalListings: num("Raw listings (concentration-skewed)", "listings"), top2ListingSharePct: num("Top-2 domains' share of listings", "percent"), note: { type: "string" } } },
          agentSupply: { type: "object", description: "Agents/tools agents can call.", properties: { asOf: { type: "string", format: "date-time" }, officialMcpServers: num("Servers in the official MCP Registry", "servers", 11644), smitheryMcpServers: num("Servers in Smithery (corroboration)", "servers"), note: { type: "string" } } },
          virtuals: { type: "object", description: "Virtuals Protocol launchpad + ACP economy.", properties: { asOf: { type: "string", format: "date-time" }, launchedAgents: num("Agents launched", "agents", 46540), acpRegisteredAgents: num("ACP-registered agents", "agents"), aggregates: { type: "object", properties: { grossAgenticUsd: num("Gross agentic value transacted", "USD", 429976414), totalJobs: num("Total ACP jobs", "jobs"), successfulJobs: num("Successful ACP jobs", "jobs") } } } },
          devAdoption: { type: "object", description: "Agent-payment SDK downloads (npm + PyPI), 4-week trailing avg; includes CI/mirror traffic.", properties: { asOf: { type: "string", format: "date-time" }, totalWeeklyAvg4w: num("Weekly downloads across the SDK basket", "downloads/week", 418549), components: { type: "array", items: { type: "object", properties: { registry: { type: "string", enum: ["npm", "pypi"] }, pkg: { type: "string" }, weeklyAvg4w: num("Weekly downloads", "downloads/week") } } }, note: { type: "string" } } },
          masumi: { type: "object", description: "Masumi mainnet escrow payments (Cardano).", properties: { asOf: { type: "string", format: "date-time" }, totalTxs: num("Escrow-contract transactions", "transactions", 31044), note: { type: "string" } } },
          solanaAgents: { type: "object", description: "Solana agent-identity registries via getProgramAccounts (public RPC). Account counts are upper bounds.", properties: { asOf: { type: "string", format: "date-time" }, totalAccounts: num("Total accounts across Solana agent registries", "accounts", 2900), registries: { type: "array", items: { type: "object", properties: { key: { type: "string" }, label: { type: "string" }, program: { type: "string", description: "Program id" }, accounts: num("Accounts owned by the program", "accounts") } } }, note: { type: "string" } } },
          standardsAdoption: { type: "object", description: "Weekly Cloudflare Radar agent-readiness scan. Values are raw domain counts; share = value / meta.successfulDomains.", properties: { asOf: { type: "string", format: "date-time" }, rows: { type: "array", items: { type: "object", properties: { check: { type: "string" }, value: num("Domains serving this standard", "domains") } } }, meta: { type: "object", properties: { date: { type: "string", format: "date" }, totalDomains: num("Domains crawled", "domains"), successfulDomains: num("Domains successfully crawled (share denominator)", "domains"), normalization: { type: "string" }, lastUpdated: { type: "string", format: "date-time" } } }, prevMonth: { type: "object", description: "Prior monthly scan for MoM, or null if not yet available.", properties: { date: { type: "string", format: "date" }, rows: { type: "array", items: { type: "object", properties: { check: { type: "string" }, value: num("Domains serving this standard", "domains") } } } } }, note: { type: "string" } } },
          inferenceDemand: { type: "object", description: "Demand-side inference context (OpenRouter). Tokenizer-specific — totals not comparable across models.", properties: { asOf: { type: "string", format: "date-time" }, windowDays: num("Trailing window length", "days"), totalTokens: num("Total inference tokens over the window", "tokens"), attribution: { type: "string" }, days: { type: "array", items: { type: "object", properties: { date: { type: "string", format: "date" }, tokens: num("Tokens that day", "tokens") } } }, note: { type: "string" } } },
          x402TokenSplit: { type: "object", description: "x402 settlement token split. Present once the token-split feed lands.", properties: { asOf: { type: "string", format: "date-time" }, windowDays: num("Trailing window length", "days"), usdcSharePct: { type: "number", description: "USDC share of settled agent payments (0–100)", "x-unit": "percent" }, totalPayments: num("Payments measured in the window", "payments"), note: { type: "string" } } },
        },
      },
    },
  },
};

export function GET() {
  return new Response(JSON.stringify(openapi, null, 2), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
