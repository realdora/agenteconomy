# Daily data monitor (pilot)

Status on 2026-09-15: **daily checks and Resend email are enabled**. One labelled test email was accepted at 21:42 UTC and Resend reported Delivered (recipient mail server accepted it; inbox placement is not independently confirmed). GitHub relay activation is tracked below. No paid plan or DNS migration was used.

## User decision

- One scheduled data check per day, not hourly.
- No healthy daily email. Alert on a new problem, remind after 24 hours if unresolved, and notify once on recovery.
- Immediate failure callbacks from existing workflows. Healthy completion callbacks do not trigger another data check. Recovery callbacks re-check active issues.
- Recipient is held in secrets, never committed to this public repository.
- No automatic Dune executions, paid upgrades, data replacements or DNS migration.

## Schedule and scope

The Worker checks at **07:17 UTC daily** (09:17 mainland Spain summer / 08:17 winter). This leaves several hours after the daily Dune job. GitHub checks the Worker's heartbeat at **08:47 UTC daily**; this is a small status request, not a second full data scan. If today’s 07:17 check is still missing after 08:17 UTC, or mail delivery has an error, GitHub uses the mail provider directly to alert independently of Cloudflare.

The Worker compares repository data, apex data and dashboard data, allowing an hour for deployment propagation. All eight Dune sources are monitored, including formerly optional/read-only sources. Query-age thresholds are 54h for daily sources, 120h for registry, 360h for Olas. x402 daily and chain coverage must reach yesterday at check time. Web section age is 54h except Radar/standardsAdoption at 192h (its collector intentionally caches for six days). Tempo is 30h. Last seven x402 days are checked for gaps, duplicates and invalid counts. Cumulative decreases over 2% are reported, not silently accepted as a new baseline.

This is an initial policy, not a claim that every source reports complete data daily. Zero activity vs missing data, approved restatements and new coverage need human review. Mini health, archive freshness, reported R2 coverage, disk space and planned expiry dates are now included in the daily check (see September 19 below). R2 object existence is not independently polled by this monitor; restore drills remain separate. Neither monitor nor fallback email can guarantee notification if both mail provider and execution platforms are unavailable.

## Storage and mail

One SQLite-backed Durable Object serializes state changes. It stores last check, observations, active issues, notification IDs and pending mail. It does not store full source histories or provider credentials.

Secrets in Cloudflare: `MONITOR_TOKEN`, `RESEND_API_KEY`, `ALERT_TO`, `ALERT_FROM`. Matching GitHub secrets: `DATA_MONITOR_TOKEN`, `DATA_MONITOR_RESEND_KEY`, `DATA_MONITOR_ALERT_TO`, `DATA_MONITOR_ALERT_FROM`. GitHub variable `DATA_MONITOR_URL` enables the relay. Workflow code always comes from main, never an untrusted workflow-run branch.

The provider is Resend (free account); its testing sender only permits the account's own email. Such an initial single-recipient pilot must be labelled as a pilot. A verified sender domain is the next step if delivery is poor or recipients expand; do not silently change DNS. A sending-only API key is stored in platform secrets; the local recovery copy is outside the repository with mode 0600.

Mail payload and idempotency key are saved before delivery. A failed request does not mark the alert as sent. An ambiguous request is retried with identical key/body within 24h. Older ambiguous attempts stop automatic delivery pending provider-log review. API acceptance is recorded as `provider-accepted`, **not confirmed inbox delivery**.

## Validation

`node --test ops/monitor/core.test.mjs`

`node ops/monitor/check-local.mjs` (checks checkout snapshots; not a live production fetch)

`wrangler deploy --dry-run --config ops/monitor/wrangler.jsonc`

Confirmed: stale coverage despite fresh timestamps, missing optional source, missing day, cumulative regression, quiet healthy state, new alerts, 24h reminders, one recovery notification, missed workflow and recovered workflow. Local production snapshots pass after correcting Radar's weekly cadence. Worker bundle builds successfully. Cloudflare runtime is verified: unauthorized `/status` returns 401; authenticated real-data check returns 200 with zero issues (2026-09-15 21:24 UTC). The first live check exposed a non-public Tempo URL; it was corrected to the repository’s canonical feed and rechecked. Actual sending and Resend Delivered status are verified for test message `c0c3439f-eeb1-436b-9e55-1b46eaf202a6`. Public health returns 200 with email enabled. Inbox placement and real incident delivery are not yet independently verified. Relay and independent heartbeat were both verified on September 15.

## Activation checklist

1. Restore Wrangler authorization for the intended existing Cloudflare account; no plan upgrade.
2. Finish approved email-provider onboarding and store a sending-only key privately. Confirm recipient and sender restrictions.
3. Deploy with sending disabled; inspect authenticated `/status`, unauthorized access rejection and `/health` (503 until first daily check and mail enabled).
4. Configure secrets, enable sending and POST `/test` with authorization. Check provider delivery status and recipient receipt. Test messages must clearly say they are tests.
5. POST `/daily` once and inspect the real report. Exercise simulated failure/recovery in an isolated test environment, never by corrupting production data.
6. Enable the repository URL and verify a callback plus the independent heartbeat. Record activation, provider, verified delivery and rollback in Obsidian.

## Tuning and pause

Thresholds and source rules live in `core.mjs`; schedules in `wrangler.jsonc` and `.github/workflows/data-monitor.yml`. To pause emails, set `EMAIL_ENABLED=false` and clear the repository URL so the fallback does not interpret an intentional pause as a failure. Keep source collection unchanged. To stop all monitor work, remove its cron and disable the relay workflow. Preserve incident records for review.

## Deployment evidence

Worker: `https://agenteconomy-data-monitor.facto-sync-worker.workers.dev`; version `7b8cb2c8-38f9-4147-ad11-ab48178ca4ba`. Cron `17 7 * * *` is installed. Sending is enabled; health returns 200. GitHub relay and the repository URL are enabled. PR: https://github.com/realdora/agenteconomy/pull/40.

## September 16 incident correction

The first scheduled alert correctly found x402 chains covered only September 14. A manual repair the previous evening was still younger than the collector's 20h cache threshold, so the September 16 run skipped the new complete UTC day. Owned chain refresh now considers UTC-day coverage in addition to execution age; same-day complete caches remain reusable. Existing credit guards and previous-data fallback remain active.

The same alert included HTTP 403 reading GitHub's anonymous Actions API. Later checks succeeded; the original response body/headers were not retained, so its precise cause is unproven. The Worker now checks its authenticated completion-event ledger instead of polling that API. The relay supplies the actual completion timestamp so a late callback cannot make an old run look current. Existing event records migrate using their receipt timestamp. Missing completion evidence after 30h still alerts, explicitly identifying either a missed job or failed callback delivery. New deployments need initial completion records for all four workflows.

Validation: 8 monitor tests, full offline collector suite including fresh-cache/stale-coverage regression and same-day no-extra-execution, Worker bundle and syntax checks. Daily cron frequency is unchanged.

## September 19: Mini and backup monitoring

The existing Mini R2 CLI now calls `ops/mini-reporter.mjs` after success, skip, expiry or failure. It submits one small status summary per UTC day after 06:00, using existing six-hour task wakeups. A changed failure/recovery or newly completed coverage can submit an updated summary; at most three attempts/day. Ordinary successful timestamps and minor disk changes do not cause extra submissions. No new polling job or Dune query is added. Reporting failure never changes backup success. Abrupt termination may leave a local reporter lock; the cloud detects the resulting missing heartbeat, and recovery requires checking the PID before removing that lock.

The Worker still checks once at 07:17 UTC. The preceding day's archive and upload must be present, and the uploaded bundle must report including that archive. Mini heartbeat tolerance is 36 hours; previous-day reports must show Tempo through the day before that. Low disk threshold is 40 GiB. Depending on outage timing, detection can take until the next daily check after the 36-hour allowance (up to about 60 hours); this is a daily pilot, not immediate outage detection. The existing website monitor remains separate.

Expiry reminders use server-owned dates and survive Mini going offline: Dune archive reads stop September 24 (three-day advance warning), Mini/R2 pilot ends September 29 (three-day warning), and R2 credential expiry is October 15 (seven-day warning). Alerts continue after expiry until an explicit configuration change resolves them. Updating these dates requires a real renewal/extension decision, never an automatic paid upgrade.

Authentication: `MINI_MONITOR_TOKEN` accepts POST `/mini` only. Its private Mini file is `~/.config/agenteconomy-data-pilot/mini-monitor.json` mode 0600. It cannot access state, trigger mail, or submit GitHub events. The admin token is not copied to Mini. Strict schema, 4 KiB body limit, timestamp checks and older-report rejection protect ingestion. No raw errors, credentials, SQL, business rows, or filesystem paths are transmitted.

Heartbeat ingestion never sends mail or fetches website data. GitHub callbacks preserve existing Mini issues without rechecking them. The daily check computes Mini issues and uses the existing new-issue/24h-reminder/recovery policy and recipient. Authenticated admin GET `/mini-check` provides a read-only diagnostic preview without changing incident state or sending mail. `MINI_MONITOR_ENABLED=true` activates the daily evaluator; preview does not prove cron ran.

Source of truth for delivery on Mini: `mini-monitor-health.json` (`externalAlertsConfigured`, lastSentAt, status). Older collector/backup files retain legacy `externalAlertsConfigured:false` placeholders; those fields are not consulted by this integration. R2 reports reflect successful upload receipts, not an independent cloud-side object read. A deleted remote object needs a restore drill or future independent R2 check. The restore-only R2 credential is still a separate pending task.

Tests: `node --test ops/monitor/core.test.mjs ops/monitor/mini.test.mjs ops/monitor/worker.test.mjs`. Fault injection is isolated from production and never sends synthetic incident email. Rollback: disable MINI_MONITOR_ENABLED, remove its existing `mini.*` incident state through a reviewed migration if needed, and restore Mini's saved pre-hook r2-daily.mjs/backup.mjs. Do not erase whole monitor state or rotate unrelated tokens.
