import { getProtocol, PROTOCOL_SLUGS } from "@/lib/protocol-data";

const BASE = "https://agenteconomy.to";

export function GET() {
  const protocols = PROTOCOL_SLUGS.map((slug) => {
    const protocol = getProtocol(slug);
    return protocol ? `- [${protocol.name}](${BASE}/${protocol.slug}): ${protocol.tagline}` : null;
  }).filter(Boolean);

  const body = [
    "# agent economy",
    "",
    "> A neutral, open data reference for on-chain agentic payments and autonomous agent commerce.",
    "",
    "## Protocols",
    "",
    ...protocols,
    "",
    "## Data API",
    "",
    "- [data.json](https://agenteconomy.to/data.json): Schema-stable JSON feed for tracked agent-payment activity.",
    "- Top-level keys: x402, olas, virtualsAcp, erc8004Registry, baseAgentic, tempoMpp, sources, updatedAt.",
    "- No API key or signup required. The feed is designed for agents, browsers, scripts, and spreadsheets.",
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
