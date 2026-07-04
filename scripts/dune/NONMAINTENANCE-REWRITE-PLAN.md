# Non-maintenance Dune sources — rewrite plan

Date: 2026-07-04

These sources are explicitly **not** maintenance-ready as upstream/full-history
queries. Keep `Update Dune Data` scoped away from them until their recent-window
query ids are created and individually cost-tested.

## Cost findings

| Key | Current query | Test result | Decision |
| --- | ---: | --- | --- |
| `x402Daily` | 6084845 | Cancelled; billing moved about +27.9 credits | Rewrite |
| `virtualsAcp` | 6200422 | Cancelled; status jumped to 11.9 credits, later billing moved materially | Rewrite |
| `olas` | 3344834 | Cancelled twice; 0.5-credit and 3-credit caps both exceeded before completion | Rewrite |

`baseAgentic` is separate: query 6731879 completed at about 2.18 credits and is
a maintenance candidate with a 5-credit cap.

`erc8004Registry` is separate: the live id 7666083 is an inert/dead fork. It
needs the existing registry recent-window query recreated before it can be
tested.

## Replacement approach

All three should use frozen-baseline + recent-window, not full-history refresh:

| Key | New SQL file | Baseline key | Window start |
| --- | --- | --- | --- |
| `x402Daily` | `x402-daily-recent-window.sql` | `baselines.x402Daily` | `2026-06-05` |
| `virtualsAcp` | `virtuals-acp-recent-window.sql` | `baselines.virtualsAcp` | `2026-05-31` |
| `olas` | `olas-recent-window.sql` | `baselines.olas` | `2026-05-04` |

The pipeline now passes `{{window_start}}` to these queries and merges returned
rows onto the frozen baseline. Pre-cutoff rows are dropped by the parser as a
boundary guard.

## Created query ids and first validation

Created on 2026-07-04 under the working Dune account:

| Key | New query id | First validation |
| --- | ---: | --- |
| `x402Daily` | 7881006 | Completed; 338 rows; 11.727 credits for the initial 2026-06-05 → 2026-07-04 catch-up |
| `virtualsAcp` | 7881007 | Completed; 36 rows; 0.941 credits |
| `olas` | 7881008 | Completed; 36 rows; 1.217 credits |

`x402Daily` is acceptable as a one-time catch-up, but do not add it to daily
maintenance until its baseline is folded forward; otherwise the scan starts on
2026-06-05 every day. `virtualsAcp` and `olas` are maintenance candidates once
their query ids are wired as repo variables and the workflow scope is expanded.

## Catch-up publish

Completed after the first validation:

| Key | Published through | Baseline action |
| --- | --- | --- |
| `x402Daily` | 2026-07-04 | `baselines.x402Daily.cutoff` advanced to 2026-07-05 |
| `virtualsAcp` | 2026-07-04 | `baselines.virtualsAcp.cutoff` advanced to 2026-07-05 |
| `olas` | week of 2026-06-29 | baseline kept at 2026-05-04 because the 2026-06-29 week is still open on 2026-07-04 |

After this catch-up, `x402Daily`, `virtualsAcp`, and `olas` no longer need to
scan from their old stale public-data dates. `Olas` can be frozen forward after
the 2026-06-29 week closes.

## Validation sequence

Create the three saved queries under the working Dune account, each with a TEXT
parameter named `window_start` using the default above. Saving the query should
not execute it.

Then validate one at a time:

```bash
set -a; source ~/.config/dune/agenteconomy.env; set +a

# Replace <id> with the saved query id for the source under test.
DATA_OUT_DIR=/tmp/agenteconomy-cost-x402-daily \
DUNE_QID_X402_DAILY=<id> \
DUNE_REFRESH_KEYS=x402Daily \
DUNE_MAX_EXECUTIONS_PER_RUN=1 \
DUNE_RUN_CREDIT_CAP=10 \
DUNE_QUERY_CREDIT_CAP=10 \
DUNE_POLL_INTERVAL_MS=1000 \
node scripts/fetch-data.js
```

Use the matching env var and refresh key for the other two:

| Key | Env var |
| --- | --- |
| `virtualsAcp` | `DUNE_QID_VIRTUALS_ACP=<id>` |
| `olas` | `DUNE_QID_OLAS=<id>` |

Promotion rule: only add a key to `DUNE_REFRESH_KEYS` in the workflow after a
fresh execution completes under 5 credits twice, or after a deliberate cap is
set for that source.
