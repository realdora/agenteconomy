-- ERC-8004 registry — RECENT-WINDOW (stateless) variant.
--
-- Same design as x402-recent-window.sql: the pipeline carries a frozen
-- per-chain/daily baseline (baselines.json → erc8004Registry, built by
-- build-baseline.mjs from a READ of upstream query 6130922's stored result),
-- and this query only scans logs since the cutoff. No previous.query.result()
-- state, no backfill, survives SQL edits.
--
-- PARAMETER: declare a TEXT parameter `window_start` on the Dune query with
-- default '2026-05-01'. The pipeline passes baselines.erc8004Registry.cutoff;
-- freeze-month.mjs advances it monthly. Never PATCH dates into this SQL.
--
-- Output schema matches upstream/fork: (block_date, blockchain, registered).
-- scripts/fetch-data.js drops rows < cutoff (boundary guard), filters
-- testnets, and adds the rest on top of the frozen baseline.
--
-- NOTE on cost: evms.logs topic0 scans are heavy (the full-history upstream
-- 6130922 cannot finish on the free small engine). A ~6-week window fit in
-- earlier tests, but if this times out at 2 min, see RUNBOOK-2026-06-29.md
-- §registry-fallback.

SELECT CAST(block_date AS TIMESTAMP) AS block_date, blockchain, registered
FROM (
  SELECT
    block_date,
    blockchain,
    count(*) AS registered
  FROM (
    SELECT block_date, blockchain, block_hash
    FROM evms.logs
    WHERE block_time >= CAST('{{window_start}}' AS TIMESTAMP)
      AND topic0 = 0xca52e62c367d81bb2e328eb795f7c7ba24afb478408a26c0e201d155c449bc4a
      -- event Registered(uint256 indexed agentId, string tokenURI, address indexed owner)
    UNION ALL
    SELECT block_date, 'sepolia' AS blockchain, block_hash
    FROM sepolia.logs
    WHERE block_time >= CAST('{{window_start}}' AS TIMESTAMP)
      AND topic0 = 0xca52e62c367d81bb2e328eb795f7c7ba24afb478408a26c0e201d155c449bc4a
  )
  GROUP BY 1, 2
)
ORDER BY block_date DESC, registered DESC
