# Stage 3 Decisions

Date: 2026-05-20

## Domain Canonical Strategy

Choice: migrate all canonical, Open Graph, sitemap, robots, JSON-LD, API-copy, and static fallback URLs from `https://www.agenteconomy.to` to `https://agenteconomy.to`.

Reason: Stage 3 makes the bare domain the canonical surface. Code can update emitted URLs, but the production redirect still has to be changed in Vercel after merge. Current pre-change curl evidence shows `https://agenteconomy.to/api/og` redirects to `https://www.agenteconomy.to/api/og`, so Dora must switch the primary domain and configure `www` to bare before treating the migration as fully live.

## /api/og Fix

Initial choice: rename `api/og.jsx` to `api/og.js` and remove file-level JSX by using `react/jsx-runtime` element factories with `@vercel/og`'s `ImageResponse`.

Reason: the current Vercel deployment returns `404 NOT_FOUND` for `https://www.agenteconomy.to/api/og`, while the function exists locally as `.jsx`. For a Vite project using Vercel framework detection, a plain `.js` API file is the smallest function-loading change and keeps the existing Node runtime, `readFileSync(public/data.json)`, 1200x630 dimensions, dot-matrix/Signal Green styling, and live-number behavior intact.

Verification plan:

1. Deploy a Vercel preview after the rename and curl `/api/og`.
2. If it still returns 404, remove the no-op `/api/og` rewrite from `vercel.json` and redeploy.
3. If it still returns 404, switch to an Edge-compatible implementation that fetches `/data.json`.
4. If all three attempts fail, stop and use a static `/og-default.png` fallback with the decision captured in Stage 3 results.

## Sitemap Generation

Choice: generate `dist/sitemap.xml` in `scripts/prerender.js` after route prerendering.

Reason: Vercel rebuilds after the daily data commit, so using `public/data.json.updatedAt` at build time keeps `<lastmod>` fresh without editing the data pipeline or mutating source files during `npm run build`. The static `public/sitemap.xml` will remain only as a source fallback and will use bare-domain URLs, but production output is the generated `dist/sitemap.xml`.

The generated sitemap will include `/`, `/x402`, `/erc-8004`, `/virtuals-acp`, `/olas`, `/tempo-mpp`, `/methodology`, and `/data` with daily change frequency and route-specific priorities.

## Clean URL HTML Cleanup

Choice: gate Stage 2's extra flat clean URL files behind `BUILD_CLEAN_URLS=1`, default off.

Reason: production already serves the directory `route/index.html` files. Keeping the helper output opt-in preserves local debugging convenience without shipping duplicate `dist/x402.html` siblings by default.

## Internal Linking

Choice: add a route-level `relatedRoutes` array and render a dedicated related-protocol section from it.

Reason: the current generic related-routes footer links every route except the current page. Stage 3 needs an explicit matrix: protocol pages link to the other four protocols plus `/methodology` and `/data`; methodology links to all five protocols plus `/data`; data links to all five protocols plus `/methodology`.
