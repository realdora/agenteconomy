# Dashboard v2 — warm institutional redesign

**Date:** 2026-07-07 · **Status:** approved direction, spec for implementation planning
**Target:** `dashboard.agenteconomy.to` (currently the legacy Vite app on `main`)
**Approved by:** Dora, after comparing three rendered directions (A editorial-dark / B light-SaaS / C terminal) and an interactive B-v2 prototype (`/tmp/dash-mockups/b2.html`). Verdict: B-v2 — "舒服且专业靠谱,动画柔和".

## 1. Goals / non-goals

**Goals**

- Replace the cluttered legacy dashboard with an institutional, clean, light-theme data product: the daily tool for VCs, researchers, and journalists (audience decision: professional daily use, density with order).
- Motion that makes the product feel alive without noise: count-ups, a live run-rate ticker, scroll reveals, chart grow-ins, hover feedback — and nothing else.
- A layout that scales to new data sources without redesign (new protocol = new row/page from data, not new design).
- Zero disturbance to the data pipeline. `scripts/fetch-data.js`, the GitHub Actions crons, and `public/data.json` on `main` remain the writer of record, untouched.

**Non-goals**

- No dark mode at launch (the apex site owns the dark editorial register; the dashboard is deliberately light).
- No terminal aesthetic anywhere (explicitly rejected).
- No new metrics/data work in this project — it consumes the existing feeds. (New sources landing from the data-source project appear automatically through the data-driven registry.)
- SEO is not this surface's job (apex owns answers/reports); dashboard still ships correct titles/canonicals, but no answer-page apparatus.

## 2. Architecture

**Pattern: the apex-v4 cutover playbook, repeated.**

- New Next.js (v16, App Router) application on branch **`dashboard-v2`** in this repo — sibling to `v4-nextjs-redesign`, same conventions (TypeScript, Tailwind, self-hosted fonts).
- New Vercel project (working name `agenteconomy-dash-v2`), deployed via `vercel --prod` from a linked checkout. **Never** reconnect git for the old `agenteconomy` project; never run `vercel --yes` in unlinked folders (see INCIDENTS).
- Acceptance on the preview URL → move `dashboard.agenteconomy.to` domain to the new project → legacy Vite app retires (repo `main` keeps serving as pipeline home; its Vercel project keeps auto-deploying but loses the domain, then gets archived once stable).
- Data access: fetch `https://agenteconomy.to/data.json` + `web-sources.json` server-side with `next: { revalidate: 3600 }` (same as apex), plus a light client-side refetch for the run-rate ticker baseline. Fallback snapshots baked in, labeled, never blank (apex `FALLBACK` pattern).

## 3. Design tokens

```css
--paper:  #faf8f4;  /* page background — warm, not gray */
--card:   #ffffff;  /* surfaces; shadow 0 1px 2px rgba(28,25,23,.04) */
--ink:    #1c1917;  /* ALL numbers and primary text */
--muted:  #78716c;  /* secondary text */
--faint:  #a8a29e;  /* axis labels, footnotes */
--line:   #e7e5e1;  /* hairlines */
--brand:  #0f766e;  /* deep teal-green: links, active nav, chart marks */
--live:   #059669;  /* live-only: ticker digits, pulse dot, positive deltas */
--down:   #b91c1c;  /* negative deltas only */
/* category pills (labels only, never on numerals): payments #0f766e/#ecfdf5,
   concentration #b45309/#fffbeb, identity #1d4ed8/#eff6ff, commerce #7c3aed/#f5f3ff */
```

- Type: **Geist** (UI + numerals, tabular-nums in tables/tickers, proportional for display figures), **GeistMono** (eyebrows, stamps, axis labels — uppercase, letter-spaced). Same woff2 files as apex.
- Radius 14px cards / 8px controls / 99px pills. Grid: 212px fixed sidebar + fluid main (max 1160px), 40px gutters.
- Iron rules: numbers wear ink, never color; one accent hue per job; hairlines over boxes where possible; charts share ONE grammar (rounded 3px bars / 2px lines, `--brand` marks with the latest period at full opacity, dashed `#efede8` gridlines, mono axis labels).

## 4. Motion spec ("动效在需要的地方")

| Moment | Motion | Parameters |
|---|---|---|
| Page load (once) | KPI/hero count-up | ease-out-expo, 1.6–2.0s, starts on visibility |
| Continuous (the ONLY perpetual motion) | Hero run-rate ticker + LIVE pulse dot | +rate/s where rate = latest closed-day x402 txs ÷ 86,400; last 3 digits in `--live`; 1s interval; mandatory disclaimer line ("run-rate from the latest measured day · resets at each pipeline refresh"); pulse 2s |
| Scroll into view (once per section) | Section fade-up; chart bars grow | 22px translateY, 650ms, cubic-bezier(.22,1,.36,1), threshold 0.18; bars scaleY from baseline, 12ms stagger |
| Hover | Card lift; row tint; nav tint | translateY(-3px) + shadow deepen, 200ms; `#faf9f6` row bg |
| Route change | Content fade-through | framer-motion, 150ms out / 250ms in, no layout shift |
| `prefers-reduced-motion` | Everything renders in final state instantly; ticker updates without animation | — |

Banned: parallax, scroll-jacking, looping decorative animation, skeleton shimmer longer than 400ms.

Implementation: framer-motion for reveals/route transitions; hand-rolled rAF for count-ups/ticker (they're 20 lines and framer overshoots for this).

## 5. Information architecture

**Sidebar** (sticky, groups in GeistMono eyebrows):

- Overview
- *Protocols* — one entry per family, **generated from the protocol registry** (x402, Olas, Virtuals ACP, ERC-8004, Tempo MPP, Base agentic today; future sources appear automatically)
- *Context* — Market, Agent supply, Standards adoption, Demand & developers
  - Absorbs the 2026-07-06 sources (commit 01f07fa): `solanaAgents` → Agent supply row; `standardsAdoption` (Cloudflare Radar weekly scan) → its own page (per-standard adoption bars + MoM deltas) and a STANDARDS brief-card category; `inferenceDemand` (OpenRouter tokens) → Demand & developers.
- *Reference* — Methodology, Data API

**Overview page rhythm** (story → trend → totals):

1. Page bar: title + LIVE stamp (dot, timestamp, `DATA.JSON`)
2. Hero: eyebrow → big ticking total-events number → run-rate disclaimer line
3. KPI hairline strip (5): USD settled, agents registered, protocol families, chains, latest daily x402
4. **The brief** ("What the agents did today.") — 4 story cards, category pills, one number + one sentence + `Open →`
5. **The daily pulse** — x402 daily bar chart card, range pills (7D/42D/90D/ALL functional)
6. **Protocol index** ("Six families, one grammar.") — table: protocol+role / events / USD / chains / 28-period sparkline; rows link to protocol pages
7. Footer principle line

**Protocol page template** (all families share it): header (name, role, category pill, as-of) → KPI strip (family-specific) → primary trend chart → secondary split (chains/facilitators/types as horizontal bars) → data notes (unit honesty, source, caveats) → prev/next protocol links.

**Context pages** reuse the same primitives (KPI strip + chart card + table).

## 6. Data honesty rules (enforced in code)

1. **Brief cards and "latest daily" KPIs use the latest FULLY CLOSED UTC day** — never a partial day (the prototype showed 02:00-UTC same-day rows; real build filters `day < todayUTC`).
2. Run-rate is derived, labeled, and resets on refresh — never presented as a live feed.
3. Numbers wear ink. Color carries category or direction, one hue per job.
4. Every section carries its own as-of stamp when its source differs from the page stamp. Weekly-cadence sources (Radar standards scan, Olas) stamp as "week of YYYY-MM-DD", never a day — the Stamp component supports both grains. Radar shares additionally carry the per-check-denominator footnote (never compare shares across standards without it).
5. Fallback data is labeled ("cached · as of …"), never silent.
6. No fabricated rows anywhere (hero streams, placeholder events — banned; the v4 lesson).

## 7. Component inventory

`Sidebar` · `PageBar` (title/stamp) · `HeroTicker` · `KpiStrip` · `BriefCard` · `ChartCard` (bar/line, range pills) · `Sparkline` · `ProtocolTable` · `SplitBars` (horizontal category bars) · `SectionHeader` (kick + h2) · `Reveal` (scroll wrapper) · `CountUp` · `Stamp` · `Pill`. All server components except `HeroTicker`, `CountUp`, `Reveal`, `ChartCard` interactions.

## 8. Verification

- Offline: component render tests optional; the load-bearing checks are visual.
- Headless Chrome pass per page: light theme correct, no color-on-numbers violations (grep computed styles), reveals fire, reduced-motion path renders final state.
- Live-data soak: point the preview at production data.json for 48h (two pipeline refreshes) before domain cutover; confirm closed-day logic across the UTC boundary.
- Cutover checklist mirrors the v4 one: domain move, old project keeps building main (pipeline!), verify data.json URL still resolves for apex rewrites (apex reads `dashboard.agenteconomy.to/data.json` — **the new project must serve /data.json + /web-sources.json or the apex rewrite must repoint**; decision: new app proxies both files from the GitHub raw main branch via route handlers with 5-min revalidate, so the contract survives the cutover unchanged).

## 9. Open questions (deliberately deferred)

- Range-pill data beyond 90D for protocols whose daily history is capped at 60–90 days in data.json (show what exists, label the window).
- Whether Context pages ship at cutover or one week later (Overview + 6 protocol pages are the launch gate).
- Old Vite app archive timing.

## 10. Rollout

1. Scaffold app on `dashboard-v2` (this branch), tokens + primitives first.
2. Overview page complete with motion → preview to Dora on localhost, then Vercel preview URL.
3. Protocol template ×6 → Context pages → Reference pages.
4. 48h data soak → domain cutover → retire legacy UI.
