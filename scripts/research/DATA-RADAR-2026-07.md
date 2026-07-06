# Data-source radar — 2026-07-05/06 research pass (three-round verified)

Goal: NEW public, countable sources to complete agenteconomy.to's
data-authority positioning. Provenance: deep-research harness, 3 runs
(wf_1aeaa586 quota-killed mid-verify → wf_9c94013a resumed 22 orphaned claims →
wf_a6fd0cee verified the remaining 28). **50 claims → 42 confirmed / 8 refuted
/ 0 unverified → 15 findings.** Every kept claim survived 3-vote adversarial
verification (≥2/3 refutes kill); ✓E = additionally endpoint-tested from this
machine on 2026-07-06.

## A. Ship list (approved by Dora 2026-07-06)

| # | Source | Metric | Endpoint | Cost | Cadence | Lands in |
|---|--------|--------|----------|------|---------|----------|
| 1 | Cloudflare Radar agent-standards scan ✓E | adoption of 19 agent standards across ~110k of top-200k domains (UCP 7.2% · MCP Server Card 0.2% · A2A 0.024% · ACP 0.0072% · x402 0.0018% · AP2 0%, wk of 2026-06-28) | `GET api.cloudflare.com/client/v4/radar/agent_readiness/summary/CHECK` (free CF token; `date` param → MoM backfill; confirmed in official OpenAPI schema — **no firecrawl**) | $0 | weekly (label as-of by DATA WEEK) | new answer page `/stats/which-agent-standards-are-actually-adopted` (+MoM col) · monthly report section · protocol-page FAQ rows |
| 2 | Bitquery x402 GraphQL | per-token settlement split (USDC vs rest; open universe: any ERC-20 via Permit2 + EIP-3009 USDC/EURC) | docs.bitquery.io x402 examples; USDC-on-Base `0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913` | free tier — **quota test gates enablement** | daily | resurrects `/stats/usdc-share-of-agent-payments` + x402 page row + monthly MoM. Discipline: split ONLY — never cite its totals (Dune overlap) |
| 3 | OpenRouter datasets API | daily token usage top-50 models + app rankings | `GET openrouter.ai/api/v1/datasets/rankings-daily` · `/app-rankings` (free key, 30 r/min, backfill≥2025-01; attribution required) | $0 | daily | new answer page (inference-demand context) + monthly context row. Footnote: provider tokenizers not comparable |
| 4 | Solana agent registries ✓E | on-chain registration counts: Metaplex `1DREG…B2p` = 1,421 · SATI/8004-solana `8oo4dC4J…QMbQ` = 1,488 (2026-07-06) | `getProgramAccounts` w/ dataSlice(0) on free public RPC — **no key, DAS isAgent unnecessary** | $0 | daily | census page BY-REGISTRY BREAKDOWN row + monthly watch. 2.9K vs ERC-8004 331K → NOT a standalone page until ~10K |

Fold-in (not a new source): Coinbase CDP facilitator officially spans
Base/Polygon/Arbitrum/World/Solana (CAIP-2 verified) → authoritative scope for
the planned chain-split page; Solana needs a non-EVM indexing path.

Benchmark rows (no pipeline, cite with caveats): **Keyrock 5/2026** — ONLY two
figures survived verification: 98.6%-USDC share and $73M/176M cumulative; ALWAYS
print "co-published with Coinbase/Tempo/Virtuals". **Chainalysis 6/2026** —
100M+ cumulative Base txs (PING-inflated, say so), $1+ share 49%→95%, wallet
cohorts; feeds the wash-adjusted methodology page.

Validators (not sources of record): x402scan (overlaps our facilitator page;
use its unique-buyers/sellers columns + Solana coverage to validate the Dune
extension; open-source github.com/Merit-Systems/x402scan) · agent402.tools
leaderboard (free JSON, verified live, but shares Base events + Bazaar catalog
with our stack — only partially independent).

## B. NEVER-CITE list (refuted 0-3 / 1-2 — verifier evidence on file)

1. x402scan "$0.09 mean payment" — mean≠median (84% of txs <$0.04), volatile
   24h snapshot, Amount field prices only a subset.
2. "No public pay-per-crawl measurement exists" — Radar bots API is public.
3. "Monetization Gateway = imminent measurable x402 stream" — waitlist,
   future-tense marketing; watch item only.
4. AlgoVoi "x402 settles on Base/Tempo/Solana/Algorand/VOI/Stellar/Hedera" —
   single-vendor self-attestation, zero on-chain proof, absent from x402 docs.
5. MERX TRON facilitator claims — same class (1-2).
6. Keyrock median "$0.01–0.10" — 10x-wide range, no methodology, co-published
   by measured rails; possibly x402+Tempo+Virtuals aggregate mislabelled.
7. Keyrock "104,000 agents across 15+ registries" — names zero registries,
   double-counts our own tracked sources, ERC-8004 inside not beyond.
8. Solana Foundation "9,000+ agents" — unreconciled with on-chain counts
   (2.9K across both programs); marketing figure.
9. Metaplex DAS `isAgent:true` "queryable on any DAS RPC" — field absent from
   official DAS docs/spec; only a secondary article claims it. (Moot: we count
   via getProgramAccounts.)
10. "MPL Core made Solana an x402 settlement surface" — Solana x402 predates
    it; attribution overreach from vendor marketing.
11. awesome-x402 headline stats ($815M mcap / 500K weekly tx / 10.5M AIsa) —
    self-dated x402 to Q1 2024; directory entries usable as leads only.

## C. Negative findings (verified — saves dead pipelines)

- **ACP/Instant Checkout**: card-rail settlement (spec: `payment_method_type`
  only `card`), no adoption telemetry; OpenAI retreated Mar 2026 with ~12-15
  Shopify merchants ever live. Countable remainder: spec repo (1,463★). =
  context row on rails page.
- **AP2**: only public metric = partner count; crypto path IS x402 (A2A
  extension) → folds into existing metrics, no new footprint.
- **Cloudflare pay-per-crawl / Monetization Gateway**: waitlist/beta; deferred
  scheme can settle off-chain via cards. If GA volume lands on-chain it
  surfaces in existing x402 pipelines automatically. Watch + re-check Q4 2026.
- **Circle Agent Stack** (launched 5/11): Nanopayments gas-free design may
  batch off-chain; Marketplace endpoint unprobed; zero published stats. Watch.
- **UCP**: off-chain; adoption via Radar (7.2%, loose-heuristic caveat) or a
  `/.well-known/ucp` seed-list probe (LOWER BOUND — manifest not mandatory,
  embedded/platform transports exist). Deferred until rails-comparison page.

## D. Methodology ammo

- PipRail-style facilitator-less x402 exists ⇒ facilitator-address methods
  undercount; state on methodology page.
- Cloudflare names "Open USD" + USDC ⇒ token-split page must not assume
  USDC-only rails (multi-chain token claims from vendor lists: refuted, see B).
- x402scan concentration (Coinbase ~84% of txs / ~30% of vol; Meridian 8 buyers
  = ~47% of 24h vol) + Chainalysis PING episode ⇒ wash-adjusted series justified.
- Radar cross-standard shares have different applicable denominators ⇒ never
  bare-compare; footnote template in stats-registry entry.

## E. Open questions (integration-time)

1. Bitquery free-tier points: does facilitator×token monthly groupby fit? Else
   Dune fallback.
2. Radar `summary/CHECK` response shape (raw counts vs shares) — inspect first
   real response, normalize in fetcher.
3. OpenRouter app-rankings `cli-agent` filter cleanliness for an agent-app cut.
4. Monetization Gateway GA: new facilitator address or existing CDP one?
5. Does the Foundation "9,000+" point at a third program? Resolve before the
   census breakdown ships its methodology note.

Pipeline changes shipped with this doc: `fetch-web-sources.js` sections
`solanaAgents` (live), `standardsAdoption` + `inferenceDemand` (await keys via
`~/setup-agenteconomy-keys.sh`); workflow env updated. Bitquery lands after
quota test. Prior radar: DATA-RADAR-2026-06.md.
