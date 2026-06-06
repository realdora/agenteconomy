-- ERC-8004 registry — INCREMENTAL fork of dune.com/queries/6130922
-- Fork: dune.com/queries/7666083 (agenteconomy-owned)
--
-- WHY (revised 2026-06-06 after a real run): the upstream full scan of
-- evms.logs by topic0 since 2025-08-13 times out at 2 min on the free `small`
-- engine — evms.logs is an all-EVM-chains table and even a selective topic0
-- filter scans too much in one shot. So this is incremental, like the x402
-- fork: persist per-(day, chain) registration counts and only scan a bounded
-- window of new logs per run.
--
-- Output schema unchanged: (block_date, blockchain, registered). We persist the
-- full non-zero daily series (no date x chain zero-fill, so ~hundreds of rows
-- vs upstream's ~4,725). scripts/fetch-data.js sums `registered` per chain for
-- lifetime totals and slices the last 90 days for the chart.
--
-- BACKFILL: each run advances at most 30 days past the checkpoint to stay under
-- the shared small-engine's variable 2-min cap (60d occasionally timed out).
-- Walks 2025-09-30 -> today in ~18 runs; steady state re-scans only the last ~2
-- days. If a run times out, lower the '30'.

WITH prev AS (
  SELECT * FROM TABLE(previous.query.result(
    schema => DESCRIPTOR(
      block_date TIMESTAMP,
      blockchain VARCHAR,
      registered BIGINT
    )
  ))
),

checkpoint AS (
  SELECT COALESCE(MAX(block_date), TIMESTAMP '2025-09-30') - INTERVAL '2' DAY AS cutoff FROM prev
),

window_end AS (
  SELECT LEAST((SELECT cutoff FROM checkpoint) + INTERVAL '12' DAY, CURRENT_TIMESTAMP) AS scan_until
),

new_logs AS (
  SELECT
    block_date,
    blockchain,
    count(*) AS registered
  FROM (
    SELECT block_date, blockchain, block_hash
    FROM evms.logs
    WHERE block_time >= TRY_CAST('2025-09-29' AS TIMESTAMP)
      AND block_time >= (SELECT cutoff FROM checkpoint)
      AND block_time <  (SELECT scan_until FROM window_end) + INTERVAL '1' DAY
      AND topic0 = 0xca52e62c367d81bb2e328eb795f7c7ba24afb478408a26c0e201d155c449bc4a
      -- event Registered(uint256 indexed agentId, string tokenURI, address indexed owner)
    UNION ALL
    SELECT block_date, 'sepolia' AS blockchain, block_hash
    FROM sepolia.logs
    WHERE block_time >= TRY_CAST('2025-09-29' AS TIMESTAMP)
      AND block_time >= (SELECT cutoff FROM checkpoint)
      AND block_time <  (SELECT scan_until FROM window_end) + INTERVAL '1' DAY
      AND topic0 = 0xca52e62c367d81bb2e328eb795f7c7ba24afb478408a26c0e201d155c449bc4a
  )
  GROUP BY 1, 2
)

SELECT CAST(block_date AS TIMESTAMP) AS block_date, blockchain, registered
FROM prev
WHERE block_date < (SELECT cutoff FROM checkpoint)
UNION ALL
SELECT CAST(block_date AS TIMESTAMP) AS block_date, blockchain, registered
FROM new_logs
ORDER BY block_date DESC, registered DESC
