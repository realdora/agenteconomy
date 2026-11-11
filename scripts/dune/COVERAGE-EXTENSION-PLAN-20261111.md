# Coverage extension plan — 2026-11-11 (drafts only; nothing executed, no credits spent)

Two new window queries, both additive. Existing queries, their output shapes and the published
headline numbers are untouched until each step below is approved.

| Draft | What it adds | Closest existing cost reference |
| --- | --- | --- |
| `acp-v2-jobs-window.sql` | ACP v2 jobs per day and chain (Base / Robinhood / Arc), unique clients and providers | legacy ACP on `base.logs`: 0.17 credits per run; registry topic scan on `evms.logs`: 0.78 |
| `erc8004-sources-window.sql` | Registrations per day by chain, emitting contract and agent-card host | registry topic scan on `evms.logs`: 0.78 per run (same scan, plus the `data` column) |

## Cost estimate (by analogy, to be replaced by a measured trial)

- Current pipeline: 28.05 credits on the 2026-11-10 run, about 840 a month; plan allowance 4,000; local cap 2,000.
- ACP v2: 0.2–0.8 per run. Address-filtered, tiny result, but `evms.logs` spans every chain.
- ERC-8004 sources: 0.8–2.0 per run. Same topic scan as the registry query; reading and decoding `data` adds cost.
- Together: roughly +1 to +3 per run, +30 to +90 a month — 4–11% on top of current use.

## Trial (needs approval)

1. Create both as private queries under `realdoraa`, parameter `window_start` = 2026-11-04.
2. Execute each once on the small engine with a 10-credit per-query cancel limit.
3. Checks: ACP v2 Base rows on 2026-11-09/10 should be in the tens of jobs a day (RPC probe: 21 jobs in ~17h);
   ERC sources summed per day and chain must equal `erc8004Registry.daily` for the same days, and Base must show
   centralcity.ai dominant (manual sample: 98.2% of 18,355).
4. Record measured credits here; only then wire into `fetch-data.js` behind the existing credit governor.

## Known limits to disclose

- ACP v2 on Solana is not covered. Chain names for Robinhood Chain and Arc in `evms.logs` are unverified until the trial.
- v2 counts jobs, legacy counts memos: separate series, never summed, no cross-scope month-over-month.
- `unique_owners` is an upper bound inside the '(long tail)' bucket.
- A registry-address filter on the headline count is deliberately not applied yet: the trial output shows which
  contracts emit the event per chain, and that evidence should decide the allowlist.

## Trial result — 2026-11-11 (approved by owner; 2.43 credits spent)

Creating private queries failed: `POST /query` → HTTP 402 "Max number of private queries reached". Both drafts
were run once through the ad-hoc endpoint `POST /sql/execute` (medium engine, `window_start` = 2026-11-04,
10-credit cancel limit). No query was created or changed on Dune.

| Draft | Execution | Credits (7-day window) | Rows |
| --- | --- | ---: | ---: |
| `acp-v2-jobs-window.sql` | 01M747ZV8FN91XX2SSWY468DGQ | 0.454 | 8 |
| `erc8004-sources-window.sql` | 01M7481DCEYSRCE6Y9N7SMH6CZ | 1.972 | 217 |

Checks:
- ACP v2: Base 25–45 jobs created a day (11/04–11/10), 3–5 clients, 4–6 providers; Robinhood 3 jobs on 11/09;
  Arc none. Chain names in `evms.logs` are `base`, `robinhood`, `arc`.
- ERC sources: per-day totals equal published `erc8004Registry.daily` exactly for 11/04–11/08
  (102,922 / 59,344 / 50,111 / 6,730 / 6,248). 11/09 was a partial day when published (1,282 vs 7,039 complete).
- 99.9% of events come from the official registry address 0x8004a169…a432 on every chain, so an address
  allowlist would change almost nothing. Concentration is by application: centralcity.ai = 213,770 of 237,379
  (90.1%) in the window, 199,224 of them on Arc, one distinct owner per registration. Excluding it: 23,609.
- Base in this window: centralcity.ai 14,546 of 25,224 (57.7%); a second bulk source (termix S3 bucket) 10,215.

Cost note: the sources scan costs about 0.28 credits per window-day, so a window that grows from the monthly
cutoff would reach ~8 credits by month end. Use a fixed short window (3 days, rows merged by day in the
pipeline) to hold it near 0.9 per run. Production path must be either `/sql/execute` or public queries, since
the private-query quota is full.
