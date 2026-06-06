-- ERC-8004 registry, PRE-AGGREGATED fork of dune.com/queries/6130922
-- (original by @hashed_official).
--
-- Why: upstream returns ~4,700 raw rows (chain × day since genesis) and we
-- download them on refresh while the site only renders per-chain totals plus
-- the last 90 days. Aggregating upstream cuts the read to ~120 rows.
--
-- Output schema matches what scripts/fetch-data.js already parses:
-- (blockchain, block_date, registered). Rows:
--   - per-chain LIFETIME totals exposed with block_date = NULL? No — the parser
--     sums per-chain across all rows, so we emit:
--       1) one row per chain per day for the last 90 days, AND
--       2) one "backlog" row per chain dated 1970-01-01 carrying all
--          registrations BEFORE that 90-day window.
--     Chain totals stay exact; the daily chart only renders the last 90 days.
--
-- ── STATUS: TEMPLATE ─────────────────────────────────────────
-- TODO(fork): replace `upstream_rows` with upstream's SQL body after forking.

WITH upstream_rows AS (
    SELECT blockchain, block_date, registered
    FROM (SELECT 1) placeholder -- replaced at fork time with upstream body
),

recent AS (
    SELECT blockchain, block_date, registered
    FROM upstream_rows
    WHERE block_date >= CURRENT_DATE - INTERVAL '90' DAY
),

backlog AS (
    SELECT
        blockchain,
        DATE '1970-01-01' AS block_date,
        SUM(registered) AS registered
    FROM upstream_rows
    WHERE block_date < CURRENT_DATE - INTERVAL '90' DAY
    GROUP BY blockchain
)

SELECT * FROM backlog
UNION ALL
SELECT * FROM recent
ORDER BY block_date, blockchain
