-- x402 token split — TRAILING-30d WINDOW, single aggregated row.
--
-- Unlocks the gated usdc-share page: of all x402 payment VOLUME on Base over the
-- trailing 30 days, what share settles in USDC vs everything else.
--
-- Design: a self-contained trailing window (NOT a cumulative, baseline-folded
-- query like its x402 siblings), so there is deliberately NO {{window_start}}
-- parameter and NO self-folding — the window is always `now() - interval '30'
-- day`. It is a rolling ratio, not a running total; one aggregated row keeps it
-- credit-cheap (well under the 10-credit query cap).
--
-- Scope is the LIVE facilitator registry (query_6057445, ~96 EVM addresses),
-- NEVER a hardcoded address list. Hardcoded lists proved stale and yielded a
-- false 0% USDC, so the registry sub-query is mandatory here.
--
-- Table/column idioms mirror x402-recent-window.sql: tokens.transfers +
-- amount_usd + tx_from IN (registry). This query adds the per-token split on
-- contract_address, scoped to Base.
--
-- USDC (Base) contract: 0x833589fcd6edb6e08f4c7c32d4f71b54bda02913
--
-- Output (exactly one row): usdc_vol, total_vol, usdc_txs, total_txs

SELECT
    SUM(CASE WHEN contract_address = 0x833589fcd6edb6e08f4c7c32d4f71b54bda02913
             THEN amount_usd ELSE 0 END)                            AS usdc_vol,
    SUM(amount_usd)                                                 AS total_vol,
    COUNT(DISTINCT CASE WHEN contract_address = 0x833589fcd6edb6e08f4c7c32d4f71b54bda02913
             THEN tx_hash END)                                      AS usdc_txs,
    COUNT(DISTINCT tx_hash)                                         AS total_txs
FROM tokens.transfers
WHERE tx_from IN (SELECT address FROM query_6057445)
  AND blockchain = 'base'
  AND block_time >= now() - interval '30' day
