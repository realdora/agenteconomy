# Stage 5 Decision

## Crash mitigation

- Strategy: use fresh subagent delegation for each implementation phase.
- Keep the phase order strict: Phase 1, verify, commit, push; Phase 2, verify, commit, push; Phase 3, verify, commit, push, PR.
- Base Stage 5 on latest `origin/main` at branch creation. The first commits after Stage 4a merge `bb1ab98` only updated `public/data.json`, so they do not conflict with the landing route change.

## Design judgement calls

- Treat `landing-spec.html` as the production layout source for structure, brand tokens, typography roles, and CTA placement.
- Keep landing styles isolated in `src/landing.css` under the `.landing` wrapper so the dashboard and protocol pages keep their current styles.
- Keep the five first-pass visual tiles as decorative, self-contained placeholder SVGs in `public/landing/` until the designer asset handoff.
- Use only the existing `public/data.json` schema for the live product card and sparkline. Do not modify the fetch pipeline to fill landing metrics.
- Omit month growth when the shipped monthly series cannot support a real month-over-month value.
