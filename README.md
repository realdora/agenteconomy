# agenteconomy.to

Real-time dashboard tracking the **agentic economy** — on-chain AI agent payment activity across protocols and chains.

**[agenteconomy.to](https://agenteconomy.to)**

## What we track

The agent economy is the emerging ecosystem where AI agents autonomously transact, pay for services, and settle payments on-chain. We aggregate on-chain events from **4 open standards** across **8 blockchains**:

| Standard | What it does | Key players |
|---|---|---|
| **x402** | HTTP-native agent payments (HTTP 402) | Coinbase, Google, Visa, AWS, Anthropic, Vercel |
| **ERC-8004** | Agent identity and reputation on Base | Ethereum Foundation, MetaMask, Google, Coinbase |
| **ERC-8183** | Agent-to-agent commerce (Virtuals ACP) | Virtuals Protocol |
| **MPP** | Machine payment protocol on Tempo L1 | Stripe, Tempo, Paradigm |

### Chains covered

Base, Solana, Polygon, BNB, Avalanche, Arbitrum, SEI, Tempo

## Features

- Live aggregated event counter across all 4 standards
- USD volume settled via x402 protocol
- Chain distribution and facilitator market share breakdowns
- Daily and monthly time-series charts with 7-day moving averages
- Week-over-week delta indicators
- Light / dark theme
- Dynamic OG image with live metrics
- Data auto-refreshes every 6 hours

## Data sources

| Source | Dashboard |
|---|---|
| [@thechriscen](https://dune.com/thechriscen/x402-payment-analytics) | x402 Payment Analytics |
| [@hashed_official](https://dune.com/hashed_official/x402-analytics) | x402 + Virtuals ACP |
| [@ax1research](https://dune.com/ax1research/base-agentic-ecosystem) | Base Agentic Ecosystem (ERC-8004) |
| Tempo RPC indexer | MPP channel events |

Raw data available at [`agenteconomy.to/data.json`](https://agenteconomy.to/data.json)

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
npm run fetch-data      # Fetch latest from Dune API
npm run tempo-summary   # Aggregate Tempo MPP data
```

Automated via GitHub Actions — runs at 00:00, 06:00, 12:00, 18:00 UTC daily.

## Methodology

- All data from verified on-chain smart contracts
- Each standard tracks different contracts with zero overlap
- Raw counts include ecosystem testing, self-dealing, and infrastructure activity
- Genuine commerce is a subset of totals
- Off-chain payments (Google UCP, Visa TAP) not tracked

## Contributing

Found a data source we should track? [Submit it here](https://github.com/realdora/agenteconomy/issues/new?template=data-source.yml).

## License

MIT

---

Built by [@realdora_eth](https://x.com/realdora_eth)
