-- Virtuals ACP — RECENT-WINDOW variant.
--
-- Replaces upstream query 6200422 for maintenance. The upstream query depends
-- on full base.logs decodes and cancelled above the daily budget. This query
-- decodes only logs since {{window_start}}; the pipeline adds the result to
-- baselines.virtualsAcp.totalMemos and merges daily rows.
--
-- PARAMETER: TEXT `window_start`, default 2026-05-31.
--
-- Output schema for recent-window mode:
-- (period, version, num_of_memo, unique_sender)

WITH v2 AS (
  SELECT block_time, 'v2' AS version, tx_from
  FROM TABLE (
    decode_evm_event (
      abi => '{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"memoId","type":"uint256"},{"indexed":true,"internalType":"uint256","name":"jobId","type":"uint256"},{"indexed":true,"internalType":"address","name":"sender","type":"address"},{"indexed":false,"internalType":"enum ACPTypes.MemoType","name":"memoType","type":"uint8"},{"indexed":false,"internalType":"enum ACPTypes.JobPhase","name":"nextPhase","type":"uint8"},{"indexed":false,"internalType":"string","name":"content","type":"string"}],"name":"NewMemo","type":"event"}',
      input => TABLE (
        SELECT *
        FROM base.logs
        WHERE block_time >= CAST('{{window_start}}' AS TIMESTAMP)
          AND contract_address = 0x9c6C5A7125934CC6A711A7Bf44f3cDcCcf91F30c
          AND topic0 = 0xbb0268ad77b327d705a64b3c848fabb951ad3ae3485bbb4c0a1aac688669a15a
      )
    )
  )
),
v1 AS (
  SELECT block_time, 'v1' AS version, tx_from
  FROM TABLE (
    decode_evm_event (
      abi => '{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"jobId","type":"uint256"},{"indexed":true,"internalType":"address","name":"sender","type":"address"},{"indexed":false,"internalType":"uint256","name":"memoId","type":"uint256"},{"indexed":false,"internalType":"string","name":"content","type":"string"}],"name":"NewMemo","type":"event"}',
      input => TABLE (
        SELECT *
        FROM base.logs
        WHERE block_time >= CAST('{{window_start}}' AS TIMESTAMP)
          AND contract_address = 0x6a1fe26d54ab0d3e1e3168f2e0c0cda5cc0a0a4a
          AND topic0 = 0x5553ae6de5e649a2a625f8a533bac9a4741bcab2259929e05d7877233bb51d60
      )
    )
  )
),
raw_data AS (
  SELECT * FROM v2
  UNION ALL
  SELECT * FROM v1
)

SELECT
  date_trunc('day', block_time) AS period,
  version,
  count(*) AS num_of_memo,
  count(DISTINCT tx_from) AS unique_sender
FROM raw_data
GROUP BY 1, 2
ORDER BY 1 DESC, 2
