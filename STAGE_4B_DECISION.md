# Stage 4b-1 Decision

## Dispatch Strategy

- Use subagent delegation with three parallel work streams after this decision commit.
- Subagent A owns Phase 1, then Phase 3 sequentially, because both phases can touch `public/fonts/`, `src/styles.css`, and `index.html`.
- Subagent B owns Phase 2 and only touches `vercel.json` plus an optional CSP report endpoint if needed.
- Subagent C owns Phase 4 and only touches `MEASUREMENT_DASHBOARD.md`.
- Each subagent must commit its phase separately, run the phase verification, `git pull --rebase origin stage-4b1-cleanup-perf` before pushing, and avoid reverting unrelated changes.

## Scope Boundaries

- Base branch: latest `origin/main` at branch creation, which is later than Stage 4a merge `bb1ab98`; intervening commits only update `public/data.json`.
- Stage 4b-1 is data-independent: no AI referrer site dashboard and no real GA4/GSC/Bing baseline table updates beyond documented launch ranges.
- Do not modify `scripts/fetch-data.js`, GitHub Actions cron files, `public/data.json`, or `public/tempo-data.json`.
- Keep Stage 3 and Stage 4a invariants intact: bare-domain canonical behavior, existing security headers, conditional GA4 injection, per-route metadata, sitemap, robots, llms, and `/api/og`.

## Implementation Judgement Calls

- Remove only duplicate WOFF2 files that are not referenced by CSS or preloads.
- Prefer minimal LCP tuning first: keep the typography contract, avoid risky dashboard refactors, and stop if Lighthouse performance regresses below the Stage 4a baseline.
- Use CSP report-only mode, not enforcing CSP, so production resources are observed without blocking.
- Keep `MEASUREMENT_DASHBOARD.md` concise and operational, with ranges for early launch baselines until Stage 4b-2 has enough accumulated analytics data.
