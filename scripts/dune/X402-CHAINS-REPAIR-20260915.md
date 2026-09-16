# x402 chain refresh repair — 2026-09-15

The chain split stopped at August 19 because query 6166650 was cache-only. The replacement is owned query **8734676**, with a `window_start` parameter and inline lists (Chris EVM v34 / Solana v9). Legacy sender-address membership is preserved; matching transactions are not independently verified x402 payments.

## History and validation

- Preserve complete months before August 1 from archived query 6166650, execution `01M0CRJPC8YNVG97M8Q8N0DGXQ`.
- Replace the partial August with August 1–September 14 day counts: 399 rows, execution `01M2KC5ZD4P5M7EESDQ3Q8NKA1`, **95.817884616 credits**.
- September 7–14 totals match all 13 groups in the previously validated monthly query. Daily transaction hashes aggregate to the same monthly counts in this overlap.
- Freeze counts strictly before September 11 in `baselines.json`. Daily refresh replaces the open interval and folds with a four-day lag; current partial UTC day is excluded.
- Production-sized September 11–14 execution `01M2KCB6QK8J3A49WGJ2BD7PX9`: 30 rows, **8.679423077 credits**.
- Keep all 20 historical chain groups internally and preserve the existing top-12 presentation. This does not establish 20 verified protocol deployments. The chain split and facilitator-grouped headline have different counting scopes.

## Operation

The workflow pins the owned ID with this code and adds x402Chains to the existing daily refresh. No mini migration. Monthly local cap remains 2,000 credits; per-run gate increases from 25 to 45 for the additional query; per-query cap stays 15. Polling is not a hard billing ceiling. No paid upgrade.

The billing selector now requires one valid active period instead of reading the malformed trailing 0/0 period. Owned downloads reject partial/truncated data, duplicate rows, missing days, invalid counts and window gaps. On failure, retain the prior split and coverage date. `chainsAsOf` is the end of the last complete UTC day, distinct from execution time.

Tests: `node --test scripts/test/x402-chains.test.mjs`; `node scripts/test/run-tests.mjs`. Coverage includes merge/fold boundaries, invalid windows, billing periods, actual refresh scheduling and previous-result fallback. A real production replay with executions disabled consumed the new cache and reused all seven other sources unchanged. Dashboard build checks the updated source/date caption.

Raw results, definition, SQL, costs and comparison are archived at `/Users/dora/projects/agenteconomy-data-pilot/research/x402-chain-repair-20260915/`. Pre-August history remains a frozen snapshot, not a new full-history audit.

To pause only this source, remove x402Chains from the refresh allowlist. Do not connect the daily baseline parser to the old monthly query. Full rollback must restore code, workflow, baseline and chain data together while preserving unrelated newer data updates.

## September 16 refresh scheduling correction

The first next-day run skipped chains because the previous evening's manual repair was less than 20h old. This left coverage on September 14 while daily totals reached September 15. Refresh selection now also marks the owned complete-day chain query due when its cache was executed before today's UTC date, or the same ingested execution still lacks yesterday's coverage. A newer unseen current-day execution can be downloaded without another paid execution. Existing caps, scope allowlist, baseline checks and fallback remain unchanged.
