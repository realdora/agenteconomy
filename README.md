# agenteconomy.to

Real-time dashboard tracking the **agentic economy** — on-chain AI agent payment activity across protocols and chains.

**[agenteconomy.to](https://agenteconomy.to)**

## What we track

The agent economy is the emerging ecosystem where AI agents autonomously transact, pay for services, and settle payments on-chain. We aggregate on-chain events from **5 protocols** across **11+ blockchains**:

| Protocol | What it does | Key players |
|---|---|---|
| **x402** | HTTP-native agent payments (HTTP 402) | Coinbase, Google, Visa, AWS, Anthropic, Vercel |
| **ERC-8004** | Agent identity and reputation registry (20+ chains) | Ethereum Foundation, MetaMask, Google, Coinbase |
| **ERC-8183** | Agent-to-agent commerce (Virtuals ACP) | Virtuals Protocol |
| **MPP** | Machine payment protocol on Tempo L1 | Stripe, Tempo, Paradigm |
| **Olas** | Autonomous agent transactions (prediction markets, DeFi) | Autonolas, Valory |

### Chains covered

Base, Solana, Gnosis, Polygon, Ethereum, BNB, Avalanche, Arbitrum, Optimism, SEI, Tempo

## Versions

### v2 — 2026-04-10

Added multi-chain ERC-8004 agent registry + Olas ecosystem data.

**New data:**
- **ERC-8004 multi-chain registry** (Dune query 6130922 by @hashed_official) — 171K+ registered agents across 22 EVM chains. Top chains: BNB (54K), Ethereum (39K), Base (39K), MegaETH (13K), Monad (8K)
- **Olas / Autonolas** (Dune query 3344834 by @adrian0x) — 15.7M cumulative agent transactions. Primary chain: Gnosis (97%). Agents trade prediction markets and execute DeFi strategies

**Updated metrics:**
- Hero event count: 151.9M → 167.6M (added Olas, zero overlap with existing protocols)
- New "agents registered" metric in hero (ERC-8004 registrations, not counted in event total)
- Protocols tracked: 4 → 5
- Chains tracked: 8 → 11

**Design improvements:**
- Section dividers for visual rhythm between protocol sections
- Skeleton shimmer loading states (replaces dashed border fallbacks)
- Larger typography for primary metric in each section
- Responsive 2x2 hero grid on tablet (769–1024px)
- Olas chain distribution: Gnosis breakout card + independent scale for remaining chains

### v1 — 2026-04-04

Initial release with 4 protocol standards.

**Data sources:**
- **x402** (Dune queries 6058135 + 6084845) — 139M+ payment settlement events across 7 chains
- **ERC-8004 Base Agentic** (Dune query 6731879 by @ax1research) — 744K agentic events on Base
- **Virtuals ACP / ERC-8183** (Dune query 6200422 by @hashed_official) — 11.8M job memos
- **Tempo MPP** (RPC indexer) — 19K micropayment channel events

**Features:**
- Live aggregated event counter across all standards
- USD volume settled via x402 protocol
- Chain distribution and facilitator market share breakdowns
- Daily and monthly time-series charts with 7-day moving averages
- Week-over-week delta indicators
- Light / dark theme with auto-detection
- Dynamic OG image with live metrics
- Data auto-refreshes every 6 hours

## Data sources

| Source | Dashboard | Query IDs |
|---|---|---|
| [@thechriscen](https://dune.com/thechriscen/x402-payment-analytics) | x402 Payment Analytics | 6058135 |
| [@hashed_official](https://dune.com/hashed_official/x402-analytics) | x402 + Virtuals ACP | 6084845, 6200422 |
| [@hashed_official](https://dune.com/hashed_official/erc8004) | ERC-8004 Registry | 6130922 |
| [@ax1research](https://dune.com/ax1research/base-agentic-ecosystem) | Base Agentic Ecosystem | 6731879 |
| [@adrian0x](https://dune.com/adrian0x/autonolas-ecosystem-activity) | Olas Ecosystem | 3344834 |
| Tempo RPC indexer | MPP channel events | — |

Raw data available at [`agenteconomy.to/data.json`](https://agenteconomy.to/data.json)

## Architecture

```
Dune API ──→ fetch-data.js ──→ public/data.json ──→ React (App.jsx)
                                      ↑
Tempo RPC ──→ tempo-summary.js ──→ tempo-data.json
                                      ↑
GitHub Actions (every 6h) ────────────┘
```

## Tech stack

- **Frontend**: React 18 + Vite 5
- **Charts**: Recharts
- **Hosting**: Vercel
- **OG image**: Dynamic generation via `@vercel/og`
- **Data pipeline**: GitHub Actions cron (every 6h) → Dune API → `data.json`

## Development

```bash
npm install
npm run dev
```

## Data refresh

```bash
DUNE_API_KEY=xxx npm run fetch-data   # Fetch latest from Dune API
npm run tempo-summary                  # Aggregate Tempo MPP data
```

Automated via GitHub Actions — runs at 00:00, 06:00, 12:00, 18:00 UTC daily.

## Methodology

- All data from verified on-chain smart contracts
- Each protocol tracks different contracts with zero overlap
- ERC-8004 agent registrations are a separate metric from event counts
- Raw counts include ecosystem testing, self-dealing, and infrastructure activity
- Genuine commerce is a subset of totals
- Off-chain payments (Google AP2, Visa TAP) not tracked

## Contributing

Found a data source we should track? [Submit it here](https://github.com/realdora/agenteconomy/issues/new?template=data-source.yml).

## License

MIT

---

Built by [@realdora_eth](https://x.com/realdora_eth)
