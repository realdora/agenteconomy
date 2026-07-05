import { getProtocol, PROTOCOL_SLUGS } from "@/lib/protocol-data";
import { STAT_DOCS } from "@/lib/stats-registry";

const BASE = "https://agenteconomy.to";

export function GET() {
  const protocols = PROTOCOL_SLUGS.map((slug) => {
    const protocol = getProtocol(slug);
    return protocol ? `- [${protocol.name}](${BASE}/${protocol.slug}): ${protocol.tagline}` : null;
  }).filter(Boolean);

  const stats = STAT_DOCS.map((doc) => `- [${doc.question}](${BASE}/stats/${doc.slug}): ${doc.seoDescription}`);

  const body = [
    "# agent economy",
    "",
    "> A neutral, open data reference for on-chain agentic payments and autonomous agent commerce.",
    "",
    "## Protocols",
    "",
    ...protocols,
    "",
    "## Stats (live, dated answers)",
    "",
    ...stats,
    "",
    "## Monthly reports",
    "",
    `- [State of the Agent Economy](${BASE}/reports): monthly on-chain-measured report — x402 payments, agent registrations, agent-to-agent commerce, machine-payment activity. Free to cite with attribution.`,
    "",
    "## Data API (agent-ready)",
    "",
    "- [data.json](https://agenteconomy.to/data.json): on-chain feed (measured). Keys: x402, olas, virtualsAcp, erc8004Registry, baseAgentic, tempoMpp, sources, updatedAt.",
    "- [web-sources.json](https://agenteconomy.to/web-sources.json): off-chain feed (sourced). Keys: agentTokens, x402Services, agentSupply, virtuals, devAdoption, masumi.",
    "- [openapi.json](https://agenteconomy.to/openapi.json): OpenAPI 3.1 contract — every field, unit, and example. Validate and codegen against this.",
    "- No API key or signup. CORS-open (Access-Control-Allow-Origin: *). Both feeds carry updatedAt; off-chain sections carry asOf + a methodology note.",
    "",
    "## MCP server (call the data directly)",
    "",
    "- Endpoint: https://agenteconomy.to/api/mcp — Model Context Protocol, streamable HTTP, read-only, stateless, no auth.",
    "- Tools: list_protocols, get_protocol(slug), get_off_chain(lens?), get_data_freshness. Each returns self-described JSON (units + provenance).",
    "",
    "## Methodology",
    "",
    "- [Methodology](https://agenteconomy.to/methodology): How metrics are built from public on-chain activity.",
    "- Pipeline: pull public chain data, decode and normalize events, aggregate comparable metrics, publish data.json.",
    "- Sources include public Dune queries and direct indexing; source metadata is exposed in data.json.",
    "",
    "## Site",
    "",
    "- [Home](https://agenteconomy.to/): Overview of the agent economy dataset.",
    "- [Data](https://agenteconomy.to/data): Human-readable schema and access notes.",
    "- [About](https://agenteconomy.to/about): Project principles and ownership.",
    "",
  ].join("\n");

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}
