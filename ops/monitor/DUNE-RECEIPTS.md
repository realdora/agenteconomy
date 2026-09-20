# Shared Dune execution receipts — September 20, 2026

The production GitHub collector records an intent in Cloudflare before each paid execute request, then persists its execution ID immediately. A rerun resumes the same ID. An intent with no ID blocks automatic execution, including after midnight; it never expires into permission to execute again. HTTP 429/5xx execute retries and the old retry-without-parameters branch are removed.

This is the first production integration of execution receipts. GitHub remains the only producer. Mini is not authorized to execute SQL, and this change does not provide a fenced Git publication service or automatic producer failover.

## Storage and access

The existing monitor Worker routes authenticated `/dune-receipts/*` requests to a separate Durable Object identity, `dune-execution-receipts-v1`, using the existing `MonitorState` class/binding. Receipt state is separate from daily monitor state and never sends mail. No migration, new account, new credential, or pricing-plan change is required. The production workflow reuses its repository's existing `DATA_MONITOR_TOKEN` secret and `DATA_MONITOR_URL` variable. This is the trusted admin token, not a new least-privilege token; keep it on GitHub/MacBook, never copy it to Mini. Mini's submit-only token and unauthenticated calls are rejected.

Cloudflare serializes the handler with `blockConcurrencyWhile`. The intent and budget reservation are persisted together by a multi-key storage put before an execute grant is returned. The storage contract is documented in [Cloudflare's SQLite-backed Durable Object API](https://developers.cloudflare.com/durable-objects/api/sqlite-storage-api/). A lost response to the grant is ambiguous even if the collector never actually called Dune.

Only eight approved query IDs are accepted. Each query's receipt history stores UTC day, expected source SQL/registry/baseline hashes, exact window parameters/performance setting, source commit, GitHub run/attempt, nonce, execution ID, terminal status and cost. It stores no Dune API key, SQL body or result rows. SQL hashes describe the checked-in expected source; they do not prove Dune's immutable historical execution SQL. Source code and result rows remain in Git/Mini/R2 archives.

The slot is query key plus server UTC day. The immutable fingerprint includes query ID, local SQL hash, registry hash, relevant baseline hash, parameters and engine. Source commit/run identity are provenance, not uniqueness keys; unrelated Git commits cannot trigger another execute. An unresolved prior-day receipt takes precedence over today's slot. Terminal histories are retained for 31 days when that query next runs; unresolved histories are retained indefinitely. Small per-day budget ledgers remain for audit.

## Budget behavior

The shared ledger reserves 15 credits for cumulative/daily/chains, 10 for Base, 5 for registry, 3 for token split, and 2 each for Virtuals/Olas. These conservative per-query scheduling allowances reflect the archived September 19 costs plus headroom. A new intent needs enough of a 45-credit daily reservation pool. Known terminal cost replaces its reservation once. Missing cost retains the reservation and halts new requests that day; an observed cost above its reservation also halts new starts pending review. Unknown executions keep their reservation.

This is **not a supplier-enforced hard spending cap**. Actual running costs may exceed a reservation between polls. Existing monthly usage checks, the 45-credit per-run check and 15-credit query cancellation remain. Receipts do not authorize any plan upgrade or paid verification. Conservative reservation holds may delay a query when activity rises; review actual costs before changing allowances.

## Failure and recovery

- Shared store/configuration unavailable: no new execute. The collector retains or reads the newest usable cached data. `receipt_hold=true` makes the workflow's post-publication gate fail, so the existing failure-event monitor can notify.
- Known ID: poll/read that same execution. If completed but a download/publication failed, the ID remains available; no new execute is necessary.
- Intent without ID: inspect the GitHub run's `execution receipt <ID>` log line and provider history. Match query, parameters and timing before attaching an ID. No automatic delete, reset or TTL release is provided.
- A verified ID whose save failed can be attached through POST `/dune-receipts/execution` using the original receipt's `queryKey`, `queryId`, `day`, `owner`, `nonce`, and verified `executionId`. Only an authenticated administrator may perform this evidence-based recovery. The endpoint cannot replace a different saved ID. Record the supporting run/provider evidence in the operations log first.
- If evidence cannot establish whether Dune started, leave the receipt blocked. Do not disable the guard or fabricate an execution ID to unblock it.
- Changed baseline/SQL/parameters for an existing slot: stop and reconcile. A definition edit does not silently permit another charge.
- Terminal failed/cancelled/partial executions are not re-executed on the same UTC day. A new day's work is possible only after the previous execution is known terminal.

The execution ledger does not make Git pushes atomic with receipts. Existing Actions concurrency and the current commit/push path remain responsible for publication. Do not enable a second producer until publication fencing, ownership transitions and recovery are separately implemented and tested.

## Validation and release

Tests cover concurrent claims, process restart, lost execute/grant/save responses, cross-day ambiguity, changed definitions, identity rejection, cost settlement and reservation holds. The full collector mock tests prove that a second collector process polls the stored ID with zero execute POSTs, and a 503 produces one POST only and leaves the subsequent run held. Valid cached data remains usable.

The real local Cloudflare SQLite runtime also granted one simulated execute, survived a server stop/restart, and resumed with zero additional simulated executes. Local Wrangler 4.120.0 only supports compatibility dates through August 8: this local test used a command-line `2026-08-08` override. Production remains at `2026-09-15`; deploy and live authenticated read/auth checks validate that environment separately. No real Dune execution or synthetic alert email is part of these checks.

Release order: deploy Worker; verify authenticated empty/existing ledger and rejection of unauthenticated/Mini/unapproved-query requests; then merge the workflow/client. Do not create fake production receipts. Observe the next scheduled Dune run to validate real execution receipt creation without buying an extra test execution.

Rollback: stop new paid executions first (set `DUNE_MAX_EXECUTIONS_PER_RUN=0` or pause the workflow), inspect all nonterminal receipts, and keep the receipt store. Revert producer integration only after reconciling in-flight queries. Do not simply unset `DUNE_RECEIPTS_REQUIRED` while an intent is ambiguous. The previous monitor Worker can be restored only while guarded producer execution is paused; never erase existing monitor or receipt state.
