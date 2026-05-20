# Stage 4a Decisions

Date: 2026-05-20

## Scope Split

Stage 4a is code-only and covers GA4 integration, performance work, security headers, and documentation updates. Google Search Console dashboards, Bing dashboards, AI referrer dashboards, and `MEASUREMENT_DASHBOARD.md` stay in Stage 4b after those systems have data.

## GA4 Integration

Choice: inject the GA4 script at build time through a Vite `transformIndexHtml` plugin that reads `VITE_GA_MEASUREMENT_ID`.

Reason: this keeps the production HTML completely free of `gtag` when the env var is unset, while Vercel can inject the measurement ID at build time without a runtime dependency. The existing `@vercel/analytics` `inject()` call in `src/main.jsx` remains unchanged.

The snippet will:

- load `gtag.js` only when `VITE_GA_MEASUREMENT_ID` is non-empty;
- send the initial `page_view` manually with `ai_engine_source`;
- attach delegated click handlers for `outbound_click` and `data_download`.

## Font Self-Hosting

Choice: self-host the Google Fonts Latin WOFF2 assets used by the current design:

- Inter weights 400, 500, 600, 700, 800;
- JetBrains Mono weights 500, 700.

Reason: the current LCP path pays for Google Fonts DNS, TLS, CSS, and font fetches. The site is English-only, so the Latin WOFF2 subset covers the visible product surface while preserving the existing Inter / JetBrains Mono visual identity. The files will live under `public/fonts/`, with `@font-face` declarations in `src/styles.css` and LCP-critical preloads in `index.html`.

## Recharts Lazy Loading

Choice: create `src/Charts.jsx` that re-exports the existing Recharts components and exposes them through a lazy render-prop wrapper. Replace only the existing chart-rendering subtrees inside `X402Section`, `RegistrySection`, and `SimpleProtocolSection`.

Reason: charts are already suppressed from SSR with `ClientRendered`, but the top-level import still makes Recharts part of the initial client graph. A lazy wrapper keeps route markup and non-chart dashboard content stable, loads Recharts after mount, and stays within the prompt's touch boundary.

## Security Headers

Choice: add the requested global Vercel headers in `vercel.json` and avoid Content-Security-Policy.

Reason: the requested headers are low-risk for this app. CSP needs separate testing with Vercel Analytics, GA4, and self-hosted fonts, so it remains out of scope for Stage 4a.
