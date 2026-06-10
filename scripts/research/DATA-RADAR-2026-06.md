# Data-source radar — 2026-06-10/11 research pass

Goal: make agenteconomy.to the most authoritative agent-economy data hub from
publicly available information. Four research agents swept orthogonal axes; all
key numbers below were independently re-verified by the main session on
2026-06-11 (marked ✓v). Endpoints were live-tested, not quoted from docs.

## A. Authority gaps vs competitors (most damaging first)

| # | Gap | Who has it | Close path | Effort |
|---|-----|-----------|-----------|--------|
| 1 | Wash-adjusted volume (Artemis: ~48% of txns / ~81% of volume "gamed" — cited everywhere) | Artemis only | Dune query layer flagging self-pay, A↔B round-trips <24h, single-funder clusters; publish raw + adjusted side by side + methodology note | M (needs Dune) |
| 2 | Buyers / sellers / active agents (x402scan 154.5K buyers; Artemis 751K cumulative buyers; Token Terminal 126,341 monthly active agents — THE institutional metric) | x402scan, Artemis, TT | `COUNT(DISTINCT sender/recipient)` daily + 7d/30d rolling + cumulative, added to existing Dune queries; add avg AND median payment size (median: nobody publishes — cheap differentiation) | S (needs Dune) |
| 3 | Chain undercount (TT shows Polygon 12.4M agentic transfers in 90d > Base by count, via thirdweb/PayAI on polygon/arbitrum/sei/avalanche/peaq) | TT, Dune community | Merge 96-address facilitator seed list from dune.com/queries/6054244 (hashed_official) into our facilitator dimension | S–M (needs Dune) |

Unique-to-us today: deduplicated Bazaar provider count (900 domains / 27k
listings) and the cross-protocol combination (x402+ACP+Tempo+Olas+ERC-8004 —
nobody else combines). Future unique: median payment size, revenue-ranked
provider leaderboard (Bazaar payTo × Dune recipient volume), wash-adjusted
comparison.

## B. New sources — verified, free, server-side fetchable

### Tier 1 — integrable NOW (no Dune, no paid keys)

| Source | Metric | Endpoint | Tested | Effort |
|--------|--------|----------|--------|--------|
| Virtuals app API | launched agents total | `GET https://api.virtuals.io/api/virtuals?pagination[pageSize]=1` → `meta.pagination.total` | 46,532 ✓v (live-growing) | S |
| Virtuals ACP API | ACP registered agents | `GET https://acpx.virtuals.io/api/agents?pagination[pageSize]=1` | 42,169 ✓v | S |
| Virtuals ACP stats (app.virtuals.io/acp, public, hourly) | aGDP $481.43M · revenue $4.16M · jobs 2.38M · active wallets 31.38K · per-agent success rate | JSON behind the page (endpoint to pin down during build) | scraped by agent, endpoint TBD | S–M |
| Official MCP Registry | MCP servers (canonical) | `GET https://registry.modelcontextprotocol.io/v0/servers?limit=100&version=latest` cursor walk (~117 pages, no total field) | 11,644 | M |
| Smithery | MCP servers (corroborating) + per-server useCount | `GET https://registry.smithery.ai/servers?pageSize=1` → `pagination.totalCount` (anonymous works, undocumented) | 6,035 ✓v | S |
| npm downloads API | weekly downloads, agent-payment SDK basket | `api.npmjs.org/downloads/range/...` (compute own week; point/last-week lags ~8d; bulk rejects scoped pkgs) | x402 256,195/wk ✓v · @x402/core 105,767/wk ✓v · @coinbase/x402 34,214 | S |
| pypistats.org | PyPI last_week | `pypistats.org/api/packages/<pkg>/recent` (HARD rate limit: sleep 30s between calls) | x402 33,458 · cdp-sdk 11,801 | S |
| GitHub API | contributors/stars on protocol repos | with Actions' built-in GITHUB_TOKEN (1k req/hr) | coinbase/x402: 241 contributors, stars UNRELIABLE (repo reset 2026-04-02: 90 stars vs 108 forks); a2aproject/A2A 24,226 stars OK | S |
| Masumi Network (Cardano) | agent escrow txs (168 agents, $98.9K all-time vol) | `POST https://api.koios.rest/api/v1/address_txs` + `Prefer: count=exact`, contract `addr1wx7j4kmg2cs7yf92uat3ed4a3u97kr7axxr4avaz0lhwdsq87ujx7` | 31,022 ✓v (matches their explorer) | S (count) / M (USD vol needs UTxO parsing or their Dune dash) |

Developer-adoption index design (if built): fixed published basket, 4-week
trailing average (raw weekly swings ±40%, CI-driven), never sum @x402/core with
its leaf packages (transitive double-count). Basket: npm x402, @x402/core,
@coinbase/x402, agent0-sdk (ERC-8004), @virtuals-protocol/acp-node(+v2); PyPI
x402, cdp-sdk, virtuals-acp. Current sum ≈ 430k/wk. Show MCP/A2A SDK downloads
(35M–59M/wk) as separate context only — they'd swamp the payment signal 100:1.

### Tier 2 — needs Dune (post-2026-06-29, see RUNBOOK)

1. Buyers/sellers/active-agents + avg/median payment (gap #2) — extend window queries.
2. Chain expansion via 96-address facilitator list (gap #3).
3. Wash-adjusted volume layer (gap #1) — biggest credibility win, M effort.
4. Provider revenue leaderboard: Bazaar payTo addresses × recipient volume — converts our deduped catalog into the only revenue-ranked provider list.
5. ERC-8004 Reputation (`erc8004-reputation.sql`, ready).
Watch the credit budget: build on recent-window queries, never full rescans.

### Tier 3 — watchlist (real infra, ~zero usage today; 1 free call/week each)

| What | State | Recipe |
|------|-------|--------|
| x402 TRON (MERX) | facilitator live, ~4 lifetime payments (2 are tests). Direct-transfer scheme ⇒ only MERX's own payTo `TMjNmsTzdqEofvoiMg7ZWa9nG2SAVHQd8M` countable | TronGrid `/v1/accounts/<payTo>/transactions/trc20?only_to=true`, free no key |
| x402 Stellar | CDP facilitator TESTNET ONLY (signers `GC6CSX…YN3K` tx-source, `GC5OLU…NRET` fee-bump; mainnet 404). Live settlements observed same hour as test. Mainnet = OpenZeppelin Channels, API-key gated, no public address | horizon-testnet `/accounts/<G…>/transactions` — label as pipeline signal, never economy volume |
| x402 Algorand/Aptos | in facilitator /supported; mainnet feePayers unfunded/unused | account endpoints on algonode/aptoslabs |
| New x402 schemes | `upto`, `batch-settlement` on Base Sepolia (metering-style coming) | qualitative note |
| PulseMCP | total 17,766 MCP servers BUT v0beta API sunsetting (50% random failures now, dead Sept 2026); successor partner-gated | optional: email hello@pulsemcp.com for partner key |

### Dead ends (verified — do not revisit)

- Stripe ACP / Google AP2 (now FIDO Alliance) / UCP: zero public transaction data; card-rail pilots all private. Only GitHub spec-cadence trackable.
- L402/Lightning: off-chain+private by design, no honest number exists. ("Cloudflare 1B daily 402s" = HTTP status codes generally — inflated-PR trap.)
- Skyfire/Payman/Nevermined/Coral/h402: alive but no public primary-source numbers (h402 facilitator endpoint unreachable).
- Artemis programmatic: API = Enterprise-only (tested: CF redirects without key). Free tier = Google-Sheets-only `=ART()` 100k calls/mo; a Sheets→Apps-Script→JSON bridge is possible but fragile — skip. Their public x402 page remains the benchmark to cite qualitatively.
- NANDA (MIT): no queryable registry exists (all hosts dead/HTML).
- Glama / mcp.so: no totals exposed.
- Agentverse (Fetch.ai): search API caps at Elasticsearch 10k — only usable as "10,000+" floor; many indexed agents expired.
- x402scan: no public API, but Apache-2.0 open source (`Merit-Systems/x402scan`) — self-hosting their indexer is a future option.

## C. Presentation rules for any new number (from 2026-06-10 UX feedback)

One number per concept; measured-on-chain vs market-context separation; compact
at overview level, exact at detail level. New sections sketch: "Agent Supply"
(MCP registry + Smithery + Bazaar providers + Virtuals agents), "Developer
Adoption" (download index sparkline), Masumi joins the protocol sections.
