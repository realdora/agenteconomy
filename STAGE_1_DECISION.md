# Stage 1 SSG Architecture Decision

Date: 2026-05-19

## Decision

Use a custom Vite prerender pipeline built on:

- Vite's SSR build support
- `react-dom/server`
- React Router via `react-router-dom`
- A small repo-local `scripts/prerender.js`

This keeps the app on Vite + React, generates static HTML per route, and preserves the existing `public/data.json` data pipeline.

## Options Evaluated

### 1. `vite-ssg`

Rejected for this codebase.

The canonical `vite-ssg` package is designed around Vue and Vue Router. Its current package metadata declares Vue and Vue Router peer dependencies, and its examples/docs are Vue-oriented. Using it directly would either pull the app toward Vue-specific conventions or require choosing a separate React wrapper package that is less aligned with the project's current dependency surface.

That does not meet Stage 1's goal of keeping the existing Vite + React codebase with minimal conceptual change.

Reference:

- https://github.com/antfu-collective/vite-ssg
- https://www.npmjs.com/package/vite-ssg

### 2. Vike / `vite-plugin-ssr`

Rejected for Stage 1, but still viable for a future larger migration.

Vike is a full SSR/SSG framework for Vite and supports pre-rendering. It is a stronger long-term framework choice than ad hoc prerendering when an app needs data loaders, file-based routing, per-page metadata, server hooks, or partial SSR.

For this repo, Stage 1 is narrower: produce static HTML for a small fixed route list without changing the visual system or page content. Moving to Vike would require adopting Vike's routing/rendering conventions and likely splitting the app into framework-specific page files. That is more architecture churn than needed for this stage and risks crossing the stop condition around rewriting more than 30% of existing components.

Reference:

- https://vike.dev/pre-rendering
- https://vike.dev/add
- https://vike.dev/render-modes

### 3. Custom prerender script

Selected.

The current app has a small fixed route list:

- `/`
- `/x402`
- `/erc-8004`
- `/virtuals-acp`
- `/olas`
- `/tempo-mpp`
- `/methodology`
- `/data`

A custom prerender script can:

- Read `public/data.json` during the build.
- Render each route with `react-dom/server`.
- Inject the rendered HTML and serialized data into `dist/index.html`.
- Write route-specific `dist/<route>/index.html` files.
- Leave `scripts/fetch-data.js`, the GitHub Actions cron, and Vercel's static deployment model intact.

This is the smallest Stage 1 migration that satisfies the acceptance criteria while keeping Stage 2/3 SEO content and metadata work out of scope.

Reference:

- https://vite.dev/guide/ssr
- https://reactrouter.com/docs/en/v6/guides/ssr

## Dependency Decision

Add `react-router-dom` as the only new runtime dependency.

Rationale:

- Stage 1 explicitly asks for React Router or an SSG-compatible equivalent.
- React Router gives the client app normal browser routing and gives the prerender entry a server-side router via `react-router-dom/server`.
- The app does not need a larger SSG framework dependency for the fixed route set in this stage.

## Data Pipeline Impact

No direct writes to `public/data.json` or `public/tempo-data.json`.

The prerender step will only read `public/data.json` at build time. The existing cron remains the writer of record:

- `.github/workflows/update-data.yml`
- `scripts/fetch-data.js`
- Vercel auto-deploy / deploy hook

Because Vercel builds after Git commits or deploy hooks, the generated route HTML should reflect whatever `public/data.json` exists at build time.

## Out of Scope for Stage 1

- Protocol page copy/content creation.
- SEO title/meta/canonical changes.
- `/llms.txt`.
- `/api/og` fix.
- Bare-domain canonical migration.
- Sitemap expansion beyond what is required to verify generated HTML files locally.
