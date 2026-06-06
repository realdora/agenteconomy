-- x402 cumulative + monthly, INCREMENTAL fork of dune.com/queries/6058135
-- (original by @thechriscen; abandoned upstream ~Dec 2025).
--
-- Why: the upstream query rescans tokens.transfers + tokens_solana.transfers
-- from genesis (Oct 2025) on every run — 5-15 min on the medium engine and the
-- single biggest credit burner of this project. Closed days never change, so we
-- persist daily facilitator aggregates via Dune Incremental Queries and only
-- scan a bounded window of new transfers per run.
--
-- Backfill: each run advances at most {{backfill_days}} (default 45) past the
-- checkpoint, so no single execution exceeds free-tier resources. Run it
-- repeatedly on day one to walk Oct 2025 → today, then daily runs scan ~2 days.
--
-- Output schema is IDENTICAL to upstream so scripts/fetch-data.js needs no
-- parser change: (cumulative_txn, cumulative_volume, total_txn, total_vol,
-- facilitator, date_time) at month × facilitator grain.
--
-- ── STATUS: TEMPLATE ─────────────────────────────────────────
-- The facilitator classification comes from upstream's registry sub-queries
-- (query_6057445 = EVM, query_6148921 = Solana), which stay upstream-maintained.
-- Fill the marked TODO below from the upstream SQL body after forking
-- (read it via GET /api/v1/query/6058135 once the fork is in our account).

WITH prev AS (
    -- Previous run's persisted daily aggregates (empty on first run)
    SELECT * FROM TABLE(previous.query.result(
        schema => DESCRIPTOR(
            day TIMESTAMP(3),
            facilitator VARCHAR,
            txs BIGINT,
            vol DOUBLE
        )
    ))
),

checkpoint AS (
    -- Where we left off, with a 1-day lookback so late-indexed rows are
    -- re-counted (their day is recomputed, not duplicated: see final UNION).
    SELECT COALESCE(MAX(day), TIMESTAMP '2025-09-30') - INTERVAL '1' DAY AS cutoff
    FROM prev
),

window_end AS (
    -- Bounded advance: never scan more than {{backfill_days}} per execution.
    SELECT LEAST(
        (SELECT cutoff FROM checkpoint) + INTERVAL '45' DAY,
        CURRENT_TIMESTAMP
    ) AS scan_until
),

-- ─────────────────────────────────────────────────────────────
-- TODO(fork): paste upstream's evm_transfers + solana_transfers CTEs here,
-- adding to EACH transfer scan:
--     AND block_time >  (SELECT cutoff FROM checkpoint)
--     AND block_time <= (SELECT scan_until FROM window_end)
-- Keep the facilitator CASE / registry joins (query_6057445, query_6148921)
-- exactly as upstream defines them.
-- ─────────────────────────────────────────────────────────────
new_transfers AS (
    SELECT block_time, facilitator, amount_usd
    FROM (SELECT 1) placeholder -- replaced at fork time
),

new_daily AS (
    SELECT
        date_trunc('day', block_time) AS day,
        facilitator,
        COUNT(*) AS txs,
        SUM(COALESCE(amount_usd, 0)) AS vol
    FROM new_transfers
    GROUP BY 1, 2
),

merged_daily AS (
    -- Keep settled history; recompute only the lookback window from raw data.
    SELECT day, facilitator, txs, vol FROM prev
    WHERE day <= (SELECT cutoff FROM checkpoint)
    UNION ALL
    SELECT day, facilitator, txs, vol FROM new_daily
    WHERE day > (SELECT cutoff FROM checkpoint)
)

-- Final shape: month × facilitator, upstream-compatible columns.
SELECT
    SUM(SUM(txs)) OVER ()                      AS cumulative_txn,
    SUM(SUM(vol)) OVER ()                      AS cumulative_volume,
    SUM(txs)                                   AS total_txn,
    SUM(vol)                                   AS total_vol,
    facilitator,
    date_trunc('month', day)                   AS date_time
FROM merged_daily
GROUP BY facilitator, date_trunc('month', day)
ORDER BY date_time DESC, total_txn DESC
