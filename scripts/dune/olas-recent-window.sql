-- Olas / Autonolas — RECENT-WINDOW variant.
--
-- Replaces upstream query 3344834 for maintenance. The upstream query scans
-- all historical transactions across multiple chains and cancelled above the
-- daily budget. This query scans transactions since {{window_start}} and the
-- pipeline merges rows with baselines.olas.
--
-- PARAMETER: TEXT `window_start`, default 2026-05-04 (the week after the
-- current frozen baseline's final 2026-04-27 week).
--
-- Output schema for recent-window mode:
-- (time, total_weekly_transactions_number, chain)

WITH weekly_tx_ethereum AS (
  SELECT
    date_trunc('week', block_time) AS time,
    count(*) AS total_weekly_transactions_number,
    'ethereum' AS chain
  FROM ethereum.transactions
  WHERE block_time >= CAST('{{window_start}}' AS TIMESTAMP)
    AND "to" IN (
      SELECT DISTINCT multisig
      FROM autonolas_ethereum.ServiceRegistry_evt_CreateMultisigWithAgents
    )
  GROUP BY 1
),
weekly_tx_polygon AS (
  SELECT
    date_trunc('week', block_time) AS time,
    count(*) AS total_weekly_transactions_number,
    'polygon' AS chain
  FROM polygon.transactions
  WHERE block_time >= CAST('{{window_start}}' AS TIMESTAMP)
    AND "to" IN (
      SELECT DISTINCT multisig
      FROM autonolas_polygon.ServiceRegistryL2_evt_CreateMultisigWithAgents
    )
  GROUP BY 1
),
weekly_tx_gnosis AS (
  SELECT
    date_trunc('week', block_time) AS time,
    count(*) AS total_weekly_transactions_number,
    'gnosis' AS chain
  FROM gnosis.transactions
  WHERE block_time >= CAST('{{window_start}}' AS TIMESTAMP)
    AND "to" IN (
      SELECT DISTINCT multisig
      FROM autonolas_gnosis.ServiceRegistryL2_evt_CreateMultisigWithAgents
    )
  GROUP BY 1
),
multisig_info_solana AS (
  SELECT DISTINCT multisig
  FROM autonolas_solana.ServiceRegistrySolana_call_deploy
),
weekly_tx_solana AS (
  SELECT
    date_trunc('week', call_block_time) AS time,
    count(*) AS total_weekly_transactions_number,
    'solana' AS chain
  FROM squads_multisig_solana.squads_mpl_call_executeTransaction
  WHERE call_block_time >= CAST('{{window_start}}' AS TIMESTAMP)
    AND account_multisig IN (SELECT multisig FROM multisig_info_solana)
  GROUP BY 1
),
weekly_tx_arbitrum AS (
  SELECT
    date_trunc('week', block_time) AS time,
    count(*) AS total_weekly_transactions_number,
    'arbitrum' AS chain
  FROM arbitrum.transactions
  WHERE block_time >= CAST('{{window_start}}' AS TIMESTAMP)
    AND "to" IN (
      SELECT DISTINCT multisig
      FROM autonolas_arbitrum.ServiceRegistryL2_evt_CreateMultisigWithAgents
    )
  GROUP BY 1
),
weekly_tx_optimism AS (
  SELECT
    date_trunc('week', block_time) AS time,
    count(*) AS total_weekly_transactions_number,
    'optimism' AS chain
  FROM optimism.transactions
  WHERE block_time >= CAST('{{window_start}}' AS TIMESTAMP)
    AND "to" IN (
      SELECT DISTINCT multisig
      FROM autonolas_optimism.ServiceRegistryL2_evt_CreateMultisigWithAgents
    )
  GROUP BY 1
),
weekly_tx_base AS (
  SELECT
    date_trunc('week', block_time) AS time,
    count(*) AS total_weekly_transactions_number,
    'base' AS chain
  FROM base.transactions
  WHERE block_time >= CAST('{{window_start}}' AS TIMESTAMP)
    AND "to" IN (
      SELECT DISTINCT multisig
      FROM autonolas_base.ServiceRegistryL2_evt_CreateMultisigWithAgents
    )
  GROUP BY 1
),
weekly_tx_celo AS (
  SELECT
    date_trunc('week', block_time) AS time,
    count(*) AS total_weekly_transactions_number,
    'celo' AS chain
  FROM celo.transactions
  WHERE block_time >= CAST('{{window_start}}' AS TIMESTAMP)
    AND "to" IN (
      SELECT DISTINCT multisig
      FROM autonolas_celo.ServiceRegistryL2_evt_CreateMultisigWithAgents
    )
  GROUP BY 1
),
weekly_total AS (
  SELECT * FROM weekly_tx_ethereum
  UNION ALL SELECT * FROM weekly_tx_polygon
  UNION ALL SELECT * FROM weekly_tx_gnosis
  UNION ALL SELECT * FROM weekly_tx_solana
  UNION ALL SELECT * FROM weekly_tx_arbitrum
  UNION ALL SELECT * FROM weekly_tx_optimism
  UNION ALL SELECT * FROM weekly_tx_base
  UNION ALL SELECT * FROM weekly_tx_celo
)

SELECT
  time,
  total_weekly_transactions_number,
  chain
FROM weekly_total
ORDER BY time DESC, total_weekly_transactions_number DESC
