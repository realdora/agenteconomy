# Item 4 — new on-chain coverage (needs Dune to execute)

Status as of 2026-06-09. All three sub-items have NO free aggregator (DefiLlama's
x402 covers only 10 chains, none of them TRON/Stellar; nobody publishes ERC-8004
reputation). So they require executing SQL on Dune — blocked until the account
situation resolves (old account renews June 29). Prep done below; execute then.

## 4a. ERC-8004 Reputation — READY
- File: `erc8004-reputation.sql`. Event signature verified against EIP-8004.
  topic0 derived on-Dune via keccak256 (self-correcting).
- On execute: confirm non-zero rows; if zero, re-derive sig from the live
  ReputationRegistry ABI (the deployed contract may differ from the draft EIP).
- Adds: daily feedback count, unique raters, unique rated agents → a "agents are
  actually used & rated" signal the Identity registry can't give.
- Also available if wanted: `FeedbackRevoked`, `ValidationRequest`/`ValidationResponse`
  events (Validation registry) — same pattern, different signatures (in the EIP).

## 4b. x402 on TRON (MERX facilitator) — NEEDS VERIFICATION
- Lead: MERX is described as the first TRON x402 facilitator, USDT/USDC/USDD,
  site x402.merx.exchange. NOT yet confirmed: the facilitator's on-chain
  address(es) on TRON.
- Dune support check needed: does Dune have `tron.*` transfer/transaction tables
  with usable columns? (Dune added TRON; confirm table names + that token
  transfers are decoded.) If TRON tables are thin, this may need TronGrid/another
  source instead of Dune.
- Why it matters: USDT-on-TRON is huge; if x402 volume there is real, it could
  materially change the chain mix. Worth confirming before building.
- TODO before SQL: (1) get MERX facilitator address(es) from their docs/explorer;
  (2) confirm Dune TRON transfer table + schema; (3) mirror the x402 facilitator
  pattern (filter transfers by facilitator address, bucket by day).

## 4c. x402 on Stellar (Coinbase CDP facilitator) — LOW CONFIDENCE on Dune
- Coinbase CDP lists Stellar as a free x402 facilitator network; the Bazaar
  catalog shows `stellar:pubnet` entries (so supply exists).
- Dune support check needed: Dune's Stellar coverage is limited/absent for
  contract-level payment flows. Likely NOT queryable on Dune today.
- Alternative source: Stellar has its own Horizon API (free) — payments endpoint
  could be filtered by the facilitator account. This may be a better path than
  Dune for Stellar specifically. TODO: identify the CDP Stellar facilitator
  account, test Horizon `/payments` filtering.

## Recommended order when unblocked
1. ERC-8004 Reputation (ready, high signal, Base mainnet has live writers).
2. TRON x402 (verify Dune table + MERX address first; potentially high volume).
3. Stellar x402 (probably via Horizon API, not Dune — separate small fetcher).
