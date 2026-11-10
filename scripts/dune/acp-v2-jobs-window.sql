-- Virtuals ACP v2 — RECENT-WINDOW job lifecycle counts. DRAFT, never executed.
--
-- Why: virtuals-acp-recent-window.sql decodes NewMemo on two legacy Base
-- contracts that went quiet in early November 2026. Virtuals' current SDK
-- (@virtuals-protocol/acp-node-v2@0.1.15, dist/core/constants.js) points at one
-- contract address, identical on Base, Robinhood Chain and Arc:
--   0x238E541BfefD82238730D00a2208E5497F1832E0
-- Its Solana program (GFASZMVakVEBYo8vDJvhc7zfQ21T6mrPeWe4JNC7z9YP) is NOT
-- covered here and must be disclosed as a gap wherever this series is shown.
--
-- Event signatures (topic0 = keccak256 of the signature; all five were seen
-- on Base on 2026-11-10 via eth_getLogs, 21 of each in ~17h):
--   JobCreated(uint256,address,address,address,uint256,address)  0xb0f0239b…79b9
--     indexed: jobId (topic1), client (topic2), provider (topic3)
--   JobFunded(uint256,address,uint256)                            0xe3fbcc1e…96b3
--   JobSubmitted(uint256,address,bytes32)                         0x80c17db7…538e
--   JobCompleted(uint256,address,bytes32)                         0x0fd54bd3…1444
--   JobRejected(uint256,address,bytes32)                          0xae7362b1…b275
--
-- The unit changes: legacy ACP counted memos (several per job); v2 counts jobs.
-- The two series must not be summed or compared month over month.
--
-- PARAMETER: TEXT `window_start` (pipeline passes the baseline cutoff).
-- Output: (period, blockchain, jobs_created, jobs_funded, jobs_submitted,
--          jobs_completed, jobs_rejected, unique_clients, unique_providers)
-- Complete UTC days only — the collection day is excluded.

SELECT
  date_trunc('day', block_time) AS period,
  blockchain,
  count_if(topic0 = 0xb0f0239bfdd96453e24733e18bfc24b70d8fadf123dd977473518dd577ee79b9) AS jobs_created,
  count_if(topic0 = 0xe3fbcc1ea1bdc559ec7f0347efde7655e58b5f45a30b0e4470a583c3ef5496b3) AS jobs_funded,
  count_if(topic0 = 0x80c17db79857f338a6a6df68a6883ecc0ce78e2202fe61ed979733573f40538e) AS jobs_submitted,
  count_if(topic0 = 0x0fd54bd364fa9e67f17b091aefe930932c09fe7651cf5ad02c71a418f3341444) AS jobs_completed,
  count_if(topic0 = 0xae7362b1af91f4492868987b9c73990d780060811551b58728fbe96fd1bab275) AS jobs_rejected,
  count(DISTINCT CASE WHEN topic0 = 0xb0f0239bfdd96453e24733e18bfc24b70d8fadf123dd977473518dd577ee79b9 THEN topic2 END) AS unique_clients,
  count(DISTINCT CASE WHEN topic0 = 0xb0f0239bfdd96453e24733e18bfc24b70d8fadf123dd977473518dd577ee79b9 THEN topic3 END) AS unique_providers
FROM evms.logs
WHERE block_time >= CAST('{{window_start}}' AS TIMESTAMP)
  AND block_time < date_trunc('day', now())
  AND contract_address = 0x238E541BfefD82238730D00a2208E5497F1832E0
  AND topic0 IN (
    0xb0f0239bfdd96453e24733e18bfc24b70d8fadf123dd977473518dd577ee79b9,
    0xe3fbcc1ea1bdc559ec7f0347efde7655e58b5f45a30b0e4470a583c3ef5496b3,
    0x80c17db79857f338a6a6df68a6883ecc0ce78e2202fe61ed979733573f40538e,
    0x0fd54bd364fa9e67f17b091aefe930932c09fe7651cf5ad02c71a418f3341444,
    0xae7362b1af91f4492868987b9c73990d780060811551b58728fbe96fd1bab275
  )
GROUP BY 1, 2
ORDER BY 1 DESC, 2
