# agent economy

The data authority for the agent economy. On-chain payment flow and off-chain market signal across the agent-payment protocols, measured from public data and published as open, agent-readable feeds.

Live at **[agenteconomy.to](https://agenteconomy.to)**.

## What this is

agent economy tracks the protocols agents use to pay and transact on-chain, plus the off-chain signal around them (token market, service supply, developer adoption). Every on-chain number traces to public chain activity. Every off-chain number is sourced and labeled. The same data the site shows to people is published as key-less JSON and exposed to AI agents over the Model Context Protocol.

### Tracked protocols

| Protocol | What it is | Headline metric |
| --- | --- | --- |
| x402 | HTTP 402 payment standard for agents | transactions |
| ERC-8004 | Trust layer / registry for AI agents | agents registered |
| Virtuals ACP | Agent Commerce Protocol | memos |
| Olas | Autonomous agent network | transactions |
| Tempo MPP | Machine Payments Protocol | events |

## Data API (no key, no signup)

Two schema-stable JSON documents, CORS-open, refreshed hourly. Both carry `updatedAt`.

- **`/data.json`** on-chain feed (measured). Keys: `x402`, `olas`, `virtualsAcp`, `erc8004Registry`, `baseAgentic`, `tempoMpp`, `sources`, `updatedAt`.
- **`/web-sources.json`** off-chain feed (sourced). Keys: `agentTokens`, `x402Services`, `agentSupply`, `virtuals`, `devAdoption`, `masumi`.

```bash
curl https://agenteconomy.to/data.json
curl https://agenteconomy.to/web-sources.json
```

## Agent-native access

The site is built to be read by machines as much as by people.

- **`/openapi.json`** OpenAPI 3.1 contract for both feeds. Every field, unit (via the `x-unit` extension), and example. Validate and codegen against it.
- **`/llms.txt`** the agent index. Start here.
- **`/api/mcp`** Model Context Protocol server. Streamable HTTP, read-only, stateless, no auth. Point an MCP client at it.
  - Tools: `list_protocols`, `get_protocol(slug)`, `get_off_chain(lens?)`, `get_data_freshness`. Each returns self-described JSON (units and provenance included).
- **JSON-LD** `Dataset` and `WebAPI` structured data in every page head.

```
MCP endpoint  https://agenteconomy.to/api/mcp
```

## Methodology

On-chain metrics are built from public chain activity: pull public data, decode and normalize events, aggregate comparable metrics, publish `data.json`. Source metadata is exposed in the feed. The project rule is simple: every headline number traces to a feed, and nothing is fabricated. See [agenteconomy.to/methodology](https://agenteconomy.to/methodology).

## Stack

Next.js 16 (App Router, React Server Components) with React 19 and Tailwind. Static generation with hourly ISR, self-hosted fonts, a dark editorial theme. The page fetches the published JSON feeds with a baked-in fallback, so a stale upstream degrades to last-known values rather than breaking the build.

## Development

```bash
npm install
npm run build
npm run start        # http://127.0.0.1:5174
# or, for a dev server:
npm run dev
```

## Links

- Site: https://agenteconomy.to
- Dashboard: https://dashboard.agenteconomy.to
- Methodology: https://agenteconomy.to/methodology
- Data (human-readable schema): https://agenteconomy.to/data

See [CHANGELOG.md](./CHANGELOG.md) for recent updates.
