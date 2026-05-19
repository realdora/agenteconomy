# Stage 2 Decisions

Date: 2026-05-19

## Hydration Fix

Choice: A, wrap the theme toggle SVG in `ClientRendered`.

Reason: the server-rendered HTML currently chooses the icon from `getInitialDark()`, which can differ from the client's pre-mount theme script because it depends on local time and `localStorage`. Rendering the icon only after mount keeps the server and initial client tree identical while preserving the existing theme button and theme behavior.

I did not choose option B because reading `document.documentElement.dataset.theme` on the client would make the client state match the inline script, but the server-rendered icon could still be based on build-time/server time. Option A removes the mismatch source completely.

## Per-Route Head Strategy

Stage 2 will keep the custom Stage 1 prerender pipeline and add route-aware head replacement inside `scripts/prerender.js`.

For non-homepage routes, prerender will replace:

- `<title>`
- `<meta name="description">`
- `<link rel="canonical">`
- `og:url`, `og:title`, `og:description`
- `twitter:title`, `twitter:description`
- all homepage JSON-LD blocks
- the homepage `<noscript>` fallback

The homepage keeps its existing title, H1, meta description, canonical, OG, and Twitter fields for Stage 3. Stage 2 only adds the required homepage `CollectionPage` JSON-LD with an `ItemList` for the seven route pages.

## Content Boundary

Protocol page copy will be concise and data-backed. Source material comes from:

- `Vibe Projects/agent.economy.to/ai/brief.md`
- `Vibe Projects/agent.economy.to/ai/geoflow-pilot.md`
- `Vibe Projects/agent.economy.to/ai/content-briefs/*.md`
- `Vibe Projects/agent.economy.to/CONTEXT_HANDOFF.md`
- `Facto/X运营/Articles/Article 1 - Earn Until the Very Second You Spend.md`
- `Facto/X运营/Articles/Article 2 - Crypto Won Payments by Becoming Invisible.md`
- `Facto/X运营/Articles/Article 3 - Fifty Years Late.md`
- existing repo source metadata in `README.md`, `src/data.js`, and existing dashboard copy in `src/App.jsx`

I will not add unsupported protocol claims or generic SEO filler. If a metric is only available in `public/data.json`, the page will present it as live dashboard data and keep interpretation conservative.

## File Scope

Implementation should stay within the Stage 2 boundary:

- `src/App.jsx` route content/components and hydration fix
- `src/entry-server.jsx` route metadata exports
- `scripts/prerender.js` head and noscript replacement
- `STAGE_2_RESULT.md`

No data pipeline files, cron workflow, generated JSON data files, sitemap, robots, `llms.txt`, canonical domain migration, or OG image endpoint changes are part of this stage.
