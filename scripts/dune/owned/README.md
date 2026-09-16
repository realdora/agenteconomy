# Owned production queries and registries

The September 16 takeover removes live third-party `query_ID` dependencies from x402 cumulative, daily and token split, and replaces AX1's Base query with our own copy. Dune continues to supply indexed tables and SQL execution. Existing authors remain attributed; Agent Economy maintains these query definitions and frozen registries.

| Metric | Production query | Previous query | Runtime window |
| --- | --- | --- | --- |
| x402 cumulative | 8748138 | 7895747 | `window_start` from x402 baseline |
| x402 daily | 8748139 | 7881006 | `window_start` from daily baseline |
| x402 token split | 8748140 | 7931767 | original rolling 30 days |
| Base agentic | 8748141 | 6731879 | original January 1, 2026 onward; completed output days |

Chain query 8734676 is already self-owned and unchanged. ACP 7881007, ERC-8004 7881124 and Olas 7881008 were already self-owned. Olas still relies on Dune decoded models; ownership does not remove platform/table dependencies or establish complete protocol coverage.

## Maintenance

`manifest.json` records origins, versions, hashes, query IDs and parameters. The four `registries/*.sql` files preserve Chris EVM v34 / Solana v9 and Hashed EVM v37 / Solana v7, verified unchanged on September 16. `templates/` retains the prior SQL and its attribution; `generated/` is the deployable inlined SQL. Run `node scripts/dune/owned/build.mjs --check` to verify generated files. Generation round-trips the substitution to prove filters, grouping and time logic were preserved. Never execute a template's unresolved upstream references as the new production query.

Maintain registry edits as a separate version: retain network, address role, evidence, effective dates and review decision; compare a fixed complete-day window before changing public counts. PayAI's newly observed signers remain pending classification and are not silently inserted here. Preserve old membership for historical computation; disappearance from a current interface is not proof an address was historically invalid. Existing public PayAI discovery on the mini is only partial discovery coverage, not automated maintenance of every facilitator.

SQL edits require updating the owned Dune query and verifying its saved definition. Do not assume the eventual lower-cost Dune plan supports query-management APIs; daily execute/results access and parameter advancement are sufficient for the existing runner.

## September 16 validation

Four private production queries are owned by `realdoraa`; saved definitions and parameter values were checked. Actual executions cost 10.858, 5.292, 1.627 and 7.609 credits (25.385 total). The production parser ingested all four cached results in an isolated replay with executions disabled; other four sources and chain history remained unchanged.

Base's 516 rows match the former cached result exactly. x402 complete days match except PayAI on September 15: both cumulative and daily gained 8,340 transactions compared with the early-morning cache. A fresh execution of the unchanged legacy daily query (4.535 credits) reproduced all 29 complete-day rows of the owned daily query, confirming this is a cached-data revision rather than a membership substitution effect. Cumulative PayAI USD also changed; current partial-day values and the rolling 30-day ratio are not an identical-time comparison. The previous fixed-window independent/control comparisons and the current reverse-substitution check provide the separate semantic evidence.

Total execution cost including the diagnostic control: **29.920 credits**, within a 60-credit trial validation budget. Poll/cancel limits are not billing hard ceilings. No plan upgrade. Evidence and raw results: `agenteconomy-data-pilot/research/owned-production-20260916/` on the operator's machine; archived separately, without credentials.

Daily source refresh also checks the UTC calendar date, so today's manual warm-up cannot skip tomorrow's run under the 20-hour age threshold. Weekly and read-only sources keep their cadence. Frozen history, incremental folding, credit guards and fallback remain intact.

## Rollout and rollback

The workflow pins these four IDs together with this package. Original query definitions are not edited or deleted. After merge, run the existing collector once; the four warmed caches should be downloaded with zero executions. Validate data publication and monitor health. GitHub Actions remains the only production scheduler; the mini has not taken over Dune execution.

Rollback the four workflow IDs to the Previous query column (token split environment variable: `DUNE_QID_X402TOKENSPLIT`). Preserve newer public data and baselines; do not reset historical files. Inspect the rollback run's provenance and coverage, as old cached query results may be behind. Do not roll back the independent monitor or the calendar refresh correction.
