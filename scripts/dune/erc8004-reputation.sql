-- ERC-8004 Reputation signal — NewFeedback events from the ReputationRegistry.
-- (Item 4 of the 2026-06-09 data-source expansion. NEEDS DUNE to execute —
--  no free aggregator exposes ERC-8004 reputation.)
--
-- We currently track only the Identity registry (agent registrations). The
-- higher-signal "agents are actually being used and rated" data lives in the
-- Reputation registry's NewFeedback event (EIP-8004). This query surfaces daily
-- feedback counts, unique raters, and unique rated agents — a usage/trust proxy.
--
-- topic0 is DERIVED on Dune from the canonical signature via keccak256 (no
-- hardcoded hash to get wrong). Canonical signature (types only):
--   NewFeedback(uint256,address,uint64,int128,uint8,string,string,string,string,string,bytes32)
-- Indexed params (in topics): agentId (topic1), clientAddress (topic2),
-- indexedTag1 (topic3). Source: eips.ethereum.org/EIPS/eip-8004.
--
-- VERIFY ON FIRST RUN: confirm row counts are non-zero across chains; if zero,
-- the registry may use a slightly different deployed signature — re-derive from
-- the live ReputationRegistry ABI. Optionally constrain to the known registry
-- address once verified (vanity 0x8004A1... per awesome-erc8004) for efficiency.

WITH feedback AS (
  SELECT
    block_date,
    blockchain,
    contract_address                              AS registry,
    bytearray_to_uint256(topic1)                  AS agent_id,
    bytearray_substring(topic2, 13, 20)           AS client_address  -- address from 32-byte topic
  FROM evms.logs
  WHERE block_time >= TRY_CAST('2025-10-01' AS TIMESTAMP)
    AND topic0 = keccak256(
      to_utf8('NewFeedback(uint256,address,uint64,int128,uint8,string,string,string,string,string,bytes32)')
    )
)

SELECT
  block_date,
  blockchain,
  COUNT(*)                          AS feedback_count,
  COUNT(DISTINCT client_address)    AS unique_raters,
  COUNT(DISTINCT agent_id)          AS unique_rated_agents
FROM feedback
GROUP BY 1, 2
ORDER BY block_date DESC, feedback_count DESC
