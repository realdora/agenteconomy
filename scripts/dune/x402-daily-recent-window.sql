-- x402 daily — RECENT-WINDOW variant.
--
-- Replaces upstream query 6084845 for maintenance. The upstream query scans
-- from 2025-10-01 every run; that cancelled at ~28 credits on the free plan.
-- This query only scans from {{window_start}} and the pipeline merges rows on
-- top of baselines.x402Daily.daily.
--
-- PARAMETER: TEXT `window_start`, default to the day after the frozen daily
-- baseline's last day. Current intended default: 2026-06-05.
--
-- Output schema remains compatible with scripts/fetch-data.js:
-- (period, project, txs). The parser only needs period + txs.

WITH x402f_evm AS (
  SELECT address, project, blockchain FROM query_6054244
),
x402f_solana AS (
  SELECT address, project, blockchain FROM query_6084776
),
raw_stats AS (
  SELECT
    date_trunc('day', et.block_time) AS period,
    xf.project,
    count(*) AS txs
  FROM evms.transactions et
  INNER JOIN x402f_evm xf
    ON xf.address = et."from"
   AND xf.blockchain = et.blockchain
  WHERE et.success
    AND et.block_time >= CAST('{{window_start}}' AS TIMESTAMP)
  GROUP BY 1, 2

  UNION ALL

  SELECT
    date_trunc('day', st.block_time) AS period,
    xf.project,
    count(*) AS txs
  FROM tokens_solana.transfers st
  INNER JOIN x402f_solana xf
    ON st.tx_signer = CAST(xf.address AS varchar)
  WHERE st.block_time >= CAST('{{window_start}}' AS TIMESTAMP)
  GROUP BY 1, 2
)

SELECT
  period,
  project,
  sum(txs) AS txs
FROM raw_stats
GROUP BY 1, 2
ORDER BY 1 DESC, 3 DESC
