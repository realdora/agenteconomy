# agenteconomy.to

Daily updated dashboard tracking the **agentic economy** — on-chain AI agent payment activity across protocols and chains.

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

### v3.0 — 2026-05-20

Full SEO + AI engine discoverability buildout. Migrated from CSR React SPA to Vite + static site generation with per-route prerendered HTML, per-route metadata, bare-domain canonical, and AI-engine signals.

**Architecture:**
- Vite SSG via custom prerender script (`scripts/prerender.js` + `src/entry-server.jsx`) generating route-level HTML at build time for `/`, `/x402`, `/erc-8004`, `/virtuals-acp`, `/olas`, `/tempo-mpp`, `/methodology`, `/data`
- React Router with `BrowserRouter` (client) and `StaticRouter` (server) for isomorphic routing
- `public/data.json` embedded into prerendered HTML at build time via `window.__AE_DATA__`; the client refetches `/data.json` post-mount for live data

**SEO + discoverability:**
- Per-route `<title>`, `<meta description>`, `<link rel="canonical">`, OG/Twitter cards, and route-specific JSON-LD (TechArticle, Dataset, FAQPage, BreadcrumbList) — replaces the homepage template inheritance
- Bare-domain canonical migration: `agenteconomy.to` is now primary, `www.agenteconomy.to` 301s to bare across all routes
- Build-time sitemap generation with `lastmod` tied to `data.json` updatedAt
- robots.txt with explicit Allow for GPTBot, ClaudeBot, PerplexityBot, Google-Extended, anthropic-ai, CCBot, ChatGPT-User
- `/llms.txt` per llmstxt.org for AI engine context
- `/api/og` rewritten as Edge function (`api/og.js`) with Vercel deployment-protection bypass forwarding

**Performance:**
- Self-hosted Inter + JetBrains Mono variable fonts (Latin subset) under `public/fonts/`, eliminating Google Fonts DNS/TLS roundtrip
- Recharts lazy-loaded via `src/Charts.jsx` + `React.lazy` — chart bundle no longer in initial JS graph
- Lighthouse: Performance 78 → 91, LCP 3.3s → 2.7s, CLS 0.097 → 0.00006

**Security headers** (via `vercel.json`):
- X-Content-Type-Options, Referrer-Policy, Permissions-Policy, X-Frame-Options, Strict-Transport-Security

**Measurement:**
- Optional Google Analytics 4 integration via `VITE_GA_MEASUREMENT_ID` env var
- Auto-tracks page views, outbound link clicks, `data.json` / `tempo-data.json` downloads
- AI engine referrer detection (chat.openai.com, chatgpt.com, perplexity.ai, claude.ai, gemini.google.com, copilot.microsoft.com, bing.com/chat) via `ai_engine_source` custom parameter
- Snippet is a no-op when `VITE_GA_MEASUREMENT_ID` is unset

### v2.1.2 — 2026-05-20

Data pipeline hotfix.

- Q6731879 (Base Agentic Ecosystem) upstream dropped the `Cumulative Transactions` column; derive cumulative by summing daily transactions across the returned window
- Bumped Dune fetch row limit 1000 → 5000 so the derivation covers full Base agentic history

### v2.1.1 — 2026-05-03

Maintenance fix for Dune billing/datapoint quota exhaustion.

**Pipeline improvements:**
- Treat Dune billing/datapoint quota errors as source unavailability, not a broken workflow
- Reuse cached Dune latest results when fresh execution is blocked by quota/rate limits
- Keep the existing `public/data.json` unchanged and emit a GitHub warning when all required Dune queries are blocked by quota, preventing partial data writes and repeated failed scheduled runs
- Allow `DUNE_API_BASE` override for local mock verification of Dune failure modes

### v2.1 — 2026-04-27

UX, data transparency, and maintainability pass.

**Product improvements:**
- Added protocol comparison table for scanning events, volume, chains, and source links in one view
- Added visible raw data shortcuts for `data.json`, `tempo-data.json`, GitHub, and protocol comparison
- Added data freshness state (`Live`, `Cached`, `Stale`, `Fallback`) so failed or old data is no longer silent
- Replaced misleading loading skeletons for missing protocol data with explicit empty/indexing states
- Linked chart and section sources directly to Dune dashboards or raw data

**Design and mobile improvements:**
- Fixed mobile horizontal overflow in protocol cards and chart controls
- Improved first-screen hierarchy with a stronger dashboard hero and protocol comparison before deep charts
- Added reduced-motion support for animated counters and data-flow lines
- Tightened mobile navigation and section info controls

**Code improvements:**
- Split app constants, source metadata, formatting, totals, and CSS out of `App.jsx`
- Kept Open Graph totals aligned with the dashboard aggregate event calculation
- Split Recharts into a separate Vite chunk so the main app bundle remains small
- Reduced SEO keyword stuffing while keeping structured data and noscript fallback

### v2 — 2026-04-10

Added multi-chain ERC-8004 agent registry + Olas ecosystem data.

**New data:**
- **ERC-8004 multi-chain registry** (Dune query 6130922 by @hashed_official) — 171K+ registered agents across 22 EVM chains. Top chains: BNB (54K), Ethereum (39K), Base (39K), MegaETH (13K), Monad (8K)
- **Olas / Autonolas** (Dune query 3344834 by @adrian0x) — 16M+ cumulative agent transactions. Primary chain: Gnosis (97%). Agents trade prediction markets and execute DeFi strategies

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
- **x402** (Dune queries 6058135 + 6084845) — 144M+ payment settlement events across 7 chains
- **ERC-8004 Base Agentic** (Dune query 6731879 by @ax1research) — 744K agentic events on Base
- **Virtuals ACP / ERC-8183** (Dune query 6200422 by @hashed_official) — 12M+ job memos
- **Tempo MPP** (RPC indexer) — 19K micropayment channel events

**Features:**
- Live aggregated event counter across all standards
- USD volume settled via x402 protocol
- Chain distribution and facilitator market share breakdowns
- Daily and monthly time-series charts with 7-day moving averages
- Week-over-week delta indicators
- Light / dark theme with auto-detection
- Dynamic OG image with live metrics
- Data auto-refreshes daily

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
Dune API ──→ fetch-data.js ──→ public/data.json
                                      │
                                      ↓ (embedded at build time)
GitHub Actions (daily) ──→ commit ──→ Vercel build
                                          │
                                          ↓
                              vite build + prerender.js
                                          │
                                          ↓
                             dist/<route>/index.html × 8
                                          │
                                          ↓
                              Vercel CDN (bare-domain primary)
                                          │
              ┌───────────────────────────┼───────────────────────────┐
              ↓                           ↓                           ↓
         Crawlers /                Real browsers                 /api/og
        AI engines              (hydrate React app)         (edge function)
```

### Project structure

```
src/
  App.jsx          # Dashboard + per-route content components, lazy chart wrapper
  Charts.jsx       # Recharts re-exports (lazy-loaded by React.lazy)
  data.js          # Fallback dataset and external source metadata
  utils.js         # Formatting, moving averages, deltas, freshness, totals
  styles.css       # @font-face declarations, theme tokens, layout
  main.jsx         # Browser entry: BrowserRouter, hydrate, Vercel Analytics
  entry-server.jsx # SSR entry: StaticRouter, render, head metadata exports

api/
  og.js            # Dynamic Open Graph image (Vercel Edge runtime, @vercel/og)

scripts/
  fetch-data.js     # Dune aggregation pipeline → public/data.json
  prerender.js      # Builds dist/<route>/index.html + dist/sitemap.xml
  tempo-summary.js  # Tempo MPP aggregation helper

public/
  fonts/            # Self-hosted Inter + JetBrains Mono variable WOFF2
  data.json         # Daily-refreshed dataset (cron-managed, do not edit)
  tempo-data.json   # Tempo MPP daily-refreshed dataset
  sitemap.xml       # Source fallback (production sitemap is generated into dist/)
  robots.txt        # AI bot allow rules + sitemap reference
  llms.txt          # AI engine site context per llmstxt.org
```

## Tech stack

- **Frontend**: React 18 + Vite 5 with static site generation
- **Routing**: React Router (BrowserRouter on client, StaticRouter on server)
- **Charts**: Recharts (lazy-loaded post-mount)
- **Hosting**: Vercel (bare-domain primary, www 308 redirects to bare)
- **OG image**: Edge function via `@vercel/og`
- **Analytics**: Vercel Analytics + optional Google Analytics 4 (env-var gated)
- **Data pipeline**: GitHub Actions daily cron → Dune API → `data.json` → Vercel rebuild
- **Sitemap**: Generated at build time from `data.json.updatedAt`

## Environment variables

| Variable | Purpose | Required |
|---|---|---|
| `DUNE_API_KEY` | Authenticates the daily fetch-data pipeline | Yes (in GitHub Actions secrets) |
| `VITE_GA_MEASUREMENT_ID` | Google Analytics 4 measurement ID (format `G-XXXXXXXXXX`). When unset, GA4 snippet is not injected. | Optional (set in Vercel project env vars for Production) |
| `VERCEL_DEPLOY_HOOK_URL` | Optional secondary deploy trigger after cron commit | Optional (warning emitted when absent) |
| `BUILD_CLEAN_URLS` | Set to `1` to also emit `dist/<route>.html` flat files for local `vite preview` convenience | Optional |

## Development

```bash
npm install
npm run dev
```

## Data refresh

```bash
DUNE_API_KEY=xxx npm run fetch-data   # Fetch/refresh Dune data
npm run tempo-summary                  # Aggregate Tempo MPP data
```

Automated via GitHub Actions — runs once daily at 00:00 UTC.
The fetch script reads Dune's latest query results first, then triggers a fresh Dune
execution when the cached result is older than `DUNE_CACHE_MAX_AGE_HOURS` (default: 5).
To stay within Dune API plan limits, it executes at most `DUNE_MAX_EXECUTIONS_PER_RUN`
stale queries per run (default: 1) and otherwise uses Dune's latest cached rows. Use
`DUNE_REFRESH_MODE=always` or `DUNE_REFRESH_MODE=never` to override freshness checks.

When `public/data.json` changes, the commit to `main` is the primary production deploy
trigger through the Vercel Git integration. `VERCEL_DEPLOY_HOOK_URL` is optional backup
insurance; if it is absent or malformed, the workflow emits a warning and relies on
Vercel Git auto-deploy.

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
