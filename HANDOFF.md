# agenteconomy.to — session handoff (2026-06-10)

Read this top-to-bottom before doing anything. Two parallel workstreams below:
**(A) the Dune data pipeline crisis** and **(B) a data-source expansion**. B is
done and safe; A is blocked on an external account situation.

---

## 0. TL;DR / current state

- **The site (agenteconomy.to)** is a dashboard of the on-chain "agent economy"
  (autonomous AI agents paying on-chain). React + Vite, prerendered, deployed on
  Vercel from GitHub repo **`realdora/agenteconomy`** (default branch `main`).
- **All work this session lives on local branch `feat/dune-pipeline-v3`** in
  **`~/Code/agenteconomy-fix`** (a duplicate clone is in `/tmp/agenteconomy-fix`).
  **Nothing is pushed to GitHub yet.** Head commit `3788d35`. Working tree clean.
- **The site is currently FROZEN** on data from 2026-06-05. The daily Dune cron
  ("Update Dune Data" workflow) is **DISABLED** on GitHub. It does not error or
  burn anything; it just doesn't update.
- **Dune is blocked** (see §A). **Items 1–2 of the data expansion are DONE and
  work with zero Dune dependency** (see §B) but are not pushed/live yet.
- **Do not push, merge, or deploy without explicit user approval** (their
  standing rule: show user-facing artifacts before writing to durable/prod
  destinations).

---

## A. Dune pipeline crisis

### A1. The original problem (why this all started)
The daily cron runs `scripts/fetch-data.js`, which pulls 6 Dune queries. One —
**Q6058135** (x402 monthly aggregates) — rescans the FULL transfer history
(`tokens.transfers` + `tokens_solana.transfers` since Oct 2025) every run. It is
**99% of the credit burn** and on the free tier it both (a) blows the 2,500
monthly credit cap and (b) can't even finish inside the free engine's 2-min
timeout. That's the root cause; everything below is the attempt to fix it.

### A2. Account situation (CRITICAL — read carefully)
- **ORIGINAL account** = legitimate, months old, its key is the GitHub secret
  `DUNE_API_KEY` on `realdora/agenteconomy`. **Out of credits this cycle
  (2,503/2,500). Renews 2026-06-29.** Free tier. NOT suspended.
- **SECOND account `dodorara0854`** = was created to get more free quota →
  **SUSPENDED for ToS violation** (multi-accounting + bot-like burst of ~40 API
  executions on a day-old account). Its API key is what's saved locally at
  **`~/.config/dune/agenteconomy.env` — this key is now DEAD (suspended).**
  The "Deprecated query engine" 400 error we saw = the suspended-account block.
- **The two incremental forks `7666075` (x402) + `7666083` (registry) are owned
  by the suspended account → DEAD/unusable.**
- **Paid Analyst = $65/mo for only 4,000 credits** → user judged poor value and
  declined.
- **Do NOT create or use another new free Dune account.** It's ban-evasion
  (same device/IP/network fingerprint as the suspended one); "going slow" does
  not fix the fingerprint linkage. The user explored this; the honest stance is
  to refuse to engineer evasion. Legit paths only: wait for 2026-06-29 renewal on
  the ORIGINAL account, or pay.

### A3. The current recommended design (supersedes the incremental forks)
The incremental-fork approach (commits 9ea7df3…dee4f05) proved fragile on free
tier: `previous.query.result()` is **query-version-scoped** (every SQL PATCH
wipes the incremental state), the small engine has a hard variable 2-min timeout,
and the backfill volume is exactly what got the account banned. **Abandon it.**

**Use the stateless recent-window design instead** (commit 455bc9c):
- Freeze CLOSED months as a code constant. Baseline = Oct'25–Apr'26:
  **cumulative 143,886,846 txs / $40,458,908 vol** (computed from the 2026-06-05
  `public/data.json`).
- `scripts/dune/x402-recent-window.sql` scans only transfers **since 2026-05-01**
  (~6 weeks) → recomputes May+Jun monthly + protocol mix. No state, no backfill,
  ~1 cheap exec/day, fits the free 2-min cap.
- Pipeline computes: `total = frozen_baseline + recent_window_sum`. **This merge
  logic in `fetch-data.js` is NOT written yet — it's the main TODO when Dune is
  back.** The daily chart is unaffected (separate community query 6084845, read).

### A4. What's ready vs TODO on the Dune side
- READY: `x402-recent-window.sql` (the query), `erc8004-reputation.sql`
  (item 4a, event sig verified vs EIP-8004, topic0 derived on-Dune via keccak256).
- TODO when a working account exists (post-2026-06-29 on original, or paid):
  1. Re-create the recent-window query + ERC-8004 reputation query under the
     WORKING account (forking/creating is not an "execution", cheap).
  2. Write the frozen-baseline + recent-window merge in `fetch-data.js`.
  3. Run a few cheap executions (human pace — the original account is legit but
     don't hammer it), reconcile against the 06-05 baseline, verify.
  4. Re-enable cron: `gh workflow enable "Update Dune Data" -R realdora/agenteconomy`.
- Other prepared-but-unbuilt: `scripts/dune/RESUME-RUNBOOK.md` (older incremental
  runbook — now mostly superseded by the recent-window design), `ITEM4-NOTES.md`
  (TRON/Stellar x402 research + TODOs; both need Dune table verification, Stellar
  likely needs Horizon API not Dune).
- `scripts/test/run-tests.mjs` — offline mock-Dune test harness for fetch-data.js
  (31 checks, was green for the incremental version; will need updating for the
  recent-window merge).

### A5. Pipeline v3 improvements worth keeping (already in fetch-data.js on branch)
probe-before-download (skip unchanged), per-source freshness SLA (publish stale
but flag red), monotonicity guard, per-section `asOf` stamps rendered in the UI,
sanity gates. These are good regardless of the x402 query approach.

---

## B. Data-source expansion (DONE, Dune-independent)

Goal the user set: diversify beyond Dune/on-chain. A 4-agent Firecrawl research
pass produced this. Four items:

### B1. Items 1 & 2 — DONE & verified in headless Chrome
- `scripts/fetch-web-sources.js` → `public/web-sources.json`. **Free, no auth, no
  Dune.** Produces:
  - **Agent-token mcap**: curated on-thesis basket FET/KITE/VIRTUAL/OLAS
    (~$1.29B) + CoinGecko "AI Agents" category total (~$3.2B, context only —
    contains memecoins, do not use as the clean number).
  - **x402 service catalog size**: Coinbase x402 Bazaar discovery (~29,638).
- Frontend: new `MarketSupplySection` in `src/App.jsx` + **hero expanded 4→6
  cells** ("agent token mcap" + "x402 services" as DISTINCT cells, NOT folded
  into the events/USD aggregates — different units). Client-fetched, shows "—"
  until loaded (no hydration mismatch). CSS `.hero-row` is now `repeat(6, …)`.
- Auto-update: `.github/workflows/update-web-sources.yml` (6-hourly, no required
  secrets; optional `COINGECKO_API_KEY` repo secret — a free CoinGecko Demo key —
  improves reliability from CI shared IPs).
- Verified: `npm run build` + headless Chrome render (6 hero cells, `$1.29B`,
  `29,638`, basket all on the DOM).

### B2. Item 3 — DefiLlama x402: REJECTED (don't use)
DefiLlama has a free x402 endpoint BUT its adapter `module` is literally
`dummy.js` and its number is ~5x off our on-chain count. Not reliable; not
integrated. (This was a real "verify-before-trusting" save.)

### B3. Item 4 — new on-chain coverage: PREPPED, needs Dune
- 4a ERC-8004 Reputation (`NewFeedback` events) — SQL ready (`erc8004-reputation.sql`).
- 4b TRON x402 (MERX facilitator) + 4c Stellar x402 — documented in
  `scripts/dune/ITEM4-NOTES.md`; need Dune-table verification / Horizon API.
- No free aggregator covers these → all await Dune.

### B4. Research notes worth keeping (for future source decisions)
- Best paid options if ever wanted: Token Terminal ($350/mo, asset-level agentic
  data) and **Artemis** (does wash-trade filtering = most credible x402 number;
  free 100k/mo via Google Sheets `=ART()`).
- Free future adds: MCP server registry API (agent-capability axis), Olas
  subgraphs (GraphQL). 
- AVOID: Flipside (shutting down 2026-06-17), Transpose (defunct), raw CoinGecko
  category (memecoins), inflated figures ("100M payments", "250k daily agents"),
  x402 GitHub stars (repo was reset).
- Multiple sources (Bitquery/Artemis/x402scan/Dune) are all Base-on-chain-derived
  → adding them is corroboration, not coverage. Spend new slots on orthogonal
  axes (capital, supply catalog, off-chain GMV), which is what items 1–2 do.

---

## C. Pending decisions (need the user — do not assume)

1. **Go live?** Everything is on local branch `feat/dune-pipeline-v3`, unpushed.
   Going live = push + merge to `main` + enable the web-sources workflow + Vercel
   deploys. Items 1–2 can ship independently of the Dune mess. **Needs approval.**
2. **Hero "agent token mcap": $1.29B (curated basket, current) vs $3.2B
   (CoinGecko category, memecoin-contaminated).** Currently the defensible
   $1.29B. User saw "$3.2B" when choosing; flagged the difference; awaiting their
   call.
3. **Dune path:** wait for 2026-06-29 original-account renewal (recommended,
   $0, zero risk) vs pay. (New free account = off the table, ban evasion.)

---

## D. Environment / commands cheat-sheet

- Repo: `~/Code/agenteconomy-fix`, branch `feat/dune-pipeline-v3`. Prod repo
  `realdora/agenteconomy` (gh CLI authed as `realdora`).
- Build + verify UI: `npm run build`; serve `dist/` on a port and render with
  headless Chrome (`/Applications/Google Chrome.app/.../Google Chrome --headless
  --virtual-time-budget=6000 --dump-dom`) — the team rule is dogfood real renders,
  not line counts.
- Web sources (works now, no Dune): `node scripts/fetch-web-sources.js`.
- Dune cron control: `gh workflow {disable,enable} "Update Dune Data" -R realdora/agenteconomy`.
- The local `~/.config/dune/agenteconomy.env` key is the SUSPENDED account's —
  do not rely on it. A working account's key would come via the user (secure
  osascript dialog; the user will NOT paste keys into chat).

## E. Hard-won gotchas (don't relearn these the hard way)
- Free Dune = `small` engine ONLY (medium/large → "Invalid performance tier"),
  hard 2-min timeout, variable on the shared community cluster.
- `previous.query.result()` is query-VERSION-scoped → any SQL PATCH wipes
  incremental state. Backfill windows must be fixed for a whole run.
- Incremental merge boundary must be `keep day < cutoff` + `scan >= cutoff`
  (using `<=`/`>` double-counts the cutoff day).
- Multi-account on the same fingerprint = ban. This already happened once.
- DefiLlama x402 = dummy adapter, untrustworthy.
- `evms.logs` topic0 scans are heavy; `tokens.transfers` filtered by a small
  facilitator address set is light.

---

Memory file `project_agenteconomy_dune_pipeline.md` (in the user's auto-memory)
has the running history if you need more depth. When in doubt, ask the user
before any outward/irreversible action.

---

## ADDENDUM 2026-06-10 (Phase 0 executed)

Everything below is LOCAL commits on `feat/dune-pipeline-v3`, still unpushed.

- **Verification (triple cross-check) results:** token prices agree 3-way
  (CG/Coinpaprika/Binance <0.5%); mcaps diverge per-coin up to ±30% on
  circulating-supply estimates but the basket TOTAL is robust (~3%) → display
  precision dropped to $1.2B. Bazaar full enumeration (26,971 listings, zero
  dup URLs): only ~900 unique provider domains, top-2 hosts = 81% of listings,
  catalog shrank 9% in one day → headline metric switched to PROVIDERS;
  listings demoted to context.
- **web-sources v2:** full-catalog enumeration (~270 pages, abort-on-page-fail
  → falls back to previous values), `uniqueProviders`/`totalListings`/
  `top2ListingSharePct`; category matched by slug not display name.
- **UI:** hero cell 6 = "x402 providers"; mcap at 1-decimal; Market & Supply
  card shows providers with listings as sub; concentration caveat in the
  section explanation.
- **Dune Phase 0 (all offline, zero Dune calls):** frozen-baseline merge is
  WRITTEN and TESTED (no longer a TODO): `scripts/dune/baselines.json` (x402
  exact totals/monthly; protocols approx from rounded shares — exact rebuild
  via `build-baseline.mjs` on 6/29), window-grain support + boundary guards in
  fetch-data.js for BOTH x402 and registry, `{{window_start}}` as a Dune query
  parameter (never PATCH SQL), `freeze-month.mjs` monthly cutoff advance
  (without it the window grows unbounded → 2-min timeout), registry
  recent-window SQL, workflow pre-wired to repo vars `DUNE_QID_*`. Tests
  31→60 checks green (S4 assertion was stale at HEAD; fixed).
- **Runbook:** `scripts/dune/RUNBOOK-2026-06-29.md` (RESUME-RUNBOOK superseded).
- Decisions taken by Dora 2026-06-10: hero = providers metric ✓, mcap $1.2B ✓,
  proceed with local build ✓. STILL PENDING: push/merge/go-live approval.
