-- ERC-8004 registrations BY SOURCE — RECENT-WINDOW. DRAFT, never executed.
--
-- Why: erc8004-registry-recent-window.sql counts every log with the Registered
-- topic0, on any contract, and reports one number per chain. That number moved
-- +1562% in October 2026; a manual sample of Base (18,355 registrations) found
-- 98% carried agent-card URLs on one domain. This query makes that visible
-- every day instead of by hand: who emits the event (contract_address) and
-- where the agent cards live (source).
--
-- It does NOT replace the registry query and does not change its output — the
-- headline count keeps its scope. This is a second, additive series.
--
-- Registered(uint256 indexed agentId, string tokenURI, address indexed owner)
--   topic1 = agentId, topic2 = owner; data = offset(32) | length(32) | bytes
--
-- source = host of an http(s) tokenURI, else the URI scheme bucket. Sources
-- with fewer than 3 registrations in a day/chain/contract are folded into
-- '(long tail)' so the result stays small.
--
-- PARAMETER: TEXT `window_start`. Complete UTC days only.
-- Output: (period, blockchain, contract_address, source, registered, unique_owners)

WITH reg AS (
  SELECT
    date_trunc('day', block_time) AS period,
    blockchain,
    contract_address,
    topic2 AS owner,
    TRY(from_utf8(bytearray_substring(
      data, 65, CAST(bytearray_to_uint256(bytearray_substring(data, 33, 32)) AS bigint)
    ))) AS uri
  FROM evms.logs
  WHERE block_time >= CAST('{{window_start}}' AS TIMESTAMP)
    AND block_time < date_trunc('day', now())
    AND topic0 = 0xca52e62c367d81bb2e328eb795f7c7ba24afb478408a26c0e201d155c449bc4a
),
tagged AS (
  SELECT
    period, blockchain, contract_address, owner,
    CASE
      WHEN uri IS NULL OR uri = '' THEN '(empty)'
      WHEN regexp_like(uri, '^https?://') THEN lower(regexp_extract(uri, '^https?://([^/?#]+)', 1))
      WHEN starts_with(uri, 'data:') THEN 'data:'
      WHEN starts_with(uri, 'ipfs') THEN 'ipfs'
      WHEN starts_with(uri, 'ar://') THEN 'arweave'
      ELSE '(other)'
    END AS source
  FROM reg
),
agg AS (
  SELECT period, blockchain, contract_address, source,
         count(*) AS registered, count(DISTINCT owner) AS unique_owners
  FROM tagged
  GROUP BY 1, 2, 3, 4
)
SELECT
  period, blockchain, contract_address,
  CASE WHEN registered < 3 THEN '(long tail)' ELSE source END AS source,
  sum(registered) AS registered,
  sum(unique_owners) AS unique_owners  -- upper bound inside '(long tail)'
FROM agg
GROUP BY 1, 2, 3, 4
ORDER BY 1 DESC, 5 DESC
