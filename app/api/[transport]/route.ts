// AN-4 — MCP server for the agent economy. Lets any MCP-capable agent connect to
// https://agenteconomy.to/api/mcp and query the data directly (no scraping, no
// guessing units). Stateless, read-only; fetches the canonical source (the
// dashboard, where the pipeline keeps the feeds fresh) and returns self-described
// results (units + provenance + a pointer to /openapi.json).

import { createMcpHandler } from "mcp-handler";
import { z } from "zod";

const SRC = "https://dashboard.agenteconomy.to"; // canonical feed source (pipeline-fresh)
const OPENAPI = "https://agenteconomy.to/openapi.json";

async function getJson(file: string) {
  const r = await fetch(`${SRC}/${file}`, { next: { revalidate: 300 } });
  if (!r.ok) throw new Error(`${file} responded ${r.status}`);
  return r.json();
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ok = (obj: any) => ({ content: [{ type: "text" as const, text: JSON.stringify(obj, null, 2) }] });
const fail = (msg: string) => ({ content: [{ type: "text" as const, text: `error: ${msg}` }], isError: true });

// slug → data.json key + headline metric + unit
const PROTOCOLS: Record<string, { key: string; name: string; headline: string; unit: string; desc: string }> = {
  x402: { key: "x402", name: "x402", headline: "totalTxs", unit: "transactions", desc: "HTTP 402 payment standard for agents" },
  "erc-8004": { key: "erc8004Registry", name: "ERC-8004", headline: "totalAgents", unit: "agents", desc: "Trust layer / registry for AI agents" },
  "virtuals-acp": { key: "virtualsAcp", name: "Virtuals ACP", headline: "totalMemos", unit: "memos", desc: "Agent Commerce Protocol" },
  olas: { key: "olas", name: "Olas", headline: "totalTxs", unit: "transactions", desc: "Autonomous agent network" },
  "tempo-mpp": { key: "tempoMpp", name: "Tempo MPP", headline: "totalEvents", unit: "events", desc: "Machine Payments Protocol" },
};
const SLUGS = Object.keys(PROTOCOLS) as [string, ...string[]];

const OFF_CHAIN_LENSES = ["agentTokens", "x402Services", "agentSupply", "virtuals", "devAdoption", "masumi"] as const;

const handler = createMcpHandler(
  (server) => {
    server.registerTool(
      "list_protocols",
      {
        title: "List tracked protocols",
        description: "The agent-payment protocols agent economy tracks on-chain, each with its headline metric and unit.",
        inputSchema: {},
      },
      async () => {
        try {
          const d = await getJson("data.json");
          const protocols = Object.entries(PROTOCOLS).map(([slug, m]) => ({
            slug,
            name: m.name,
            description: m.desc,
            metric: d[m.key]?.[m.headline] ?? null,
            unit: m.unit,
            url: `https://agenteconomy.to/${slug}`,
          }));
          return ok({ updatedAt: d.updatedAt, protocols, schema: OPENAPI, note: "Values are cumulative; use get_protocol for time series." });
        } catch (e) {
          return fail(String(e));
        }
      },
    );

    server.registerTool(
      "get_protocol",
      {
        title: "Get one protocol's data",
        description: "Full on-chain data for a single protocol: cumulative totals + daily/weekly time series.",
        inputSchema: { slug: z.enum(SLUGS).describe("Protocol slug, e.g. x402, erc-8004, virtuals-acp, olas, tempo-mpp") },
      },
      async ({ slug }) => {
        try {
          const m = PROTOCOLS[slug];
          const d = await getJson("data.json");
          const data = d[m.key];
          if (!data) return fail(`no data for ${slug}`);
          return ok({ slug, name: m.name, headlineUnit: { field: m.headline, unit: m.unit }, updatedAt: d.updatedAt, data, schema: OPENAPI });
        } catch (e) {
          return fail(String(e));
        }
      },
    );

    server.registerTool(
      "get_off_chain",
      {
        title: "Get off-chain signal",
        description:
          "Web-sourced (not on-chain) agent-economy signal: token market, x402 service supply, agent/MCP supply, the Virtuals economy, developer adoption, Masumi. Each lens carries its own asOf + note.",
        inputSchema: {
          lens: z.enum(OFF_CHAIN_LENSES).optional().describe("Omit for all lenses, or pick one"),
        },
      },
      async ({ lens }) => {
        try {
          const w = await getJson("web-sources.json");
          const payload = lens ? { [lens]: w[lens] } : Object.fromEntries(OFF_CHAIN_LENSES.map((k) => [k, w[k]]));
          return ok({ updatedAt: w.updatedAt, schemaVersion: w.schema, provenance: "off-chain, sourced (not measured on-chain)", ...payload, schema: OPENAPI });
        } catch (e) {
          return fail(String(e));
        }
      },
    );

    server.registerTool(
      "get_data_freshness",
      {
        title: "Get data freshness",
        description: "When each feed and section was last updated — so an agent knows how current the numbers are.",
        inputSchema: {},
      },
      async () => {
        try {
          const [d, w] = await Promise.all([getJson("data.json"), getJson("web-sources.json")]);
          const offChainAsOf = Object.fromEntries(
            OFF_CHAIN_LENSES.map((k) => [k, w[k]?.asOf ?? null]),
          );
          return ok({ onChain: { updatedAt: d.updatedAt }, offChain: { updatedAt: w.updatedAt, perLensAsOf: offChainAsOf } });
        } catch (e) {
          return fail(String(e));
        }
      },
    );
  },
  {
    serverInfo: { name: "agent-economy", version: "1.0.0" },
    capabilities: { tools: {} },
  },
  {
    basePath: "/api", // route lives at app/api/[transport] → endpoint /api/mcp
    maxDuration: 60,
  },
);

export { handler as GET, handler as POST };
