# Stage 1 Result: Vite + SSG Architecture Migration

Date: 2026-05-19

## What Was Built

Stage 1 migrated the Vite + React app from a single CSR-oriented static shell to a Vite build with route-level static prerendering.

Implemented:

- Added React Router via `react-router-dom`.
- Added a server render entry at `src/entry-server.jsx`.
- Added a custom prerender script at `scripts/prerender.js`.
- Updated `npm run build` to:
  1. run the normal Vite client build,
  2. build the SSR entry,
  3. prerender the fixed Stage 1 route list.
- Kept the existing dashboard as the homepage route.
- Added Stage 1 stub routes for:
  - `/x402`
  - `/erc-8004`
  - `/virtuals-acp`
  - `/olas`
  - `/tempo-mpp`
  - `/methodology`
  - `/data`
- Embedded `public/data.json` into prerendered HTML at build time via `window.__AE_DATA__`.
- Rendered build-time metric values into each route's raw HTML.
- Deferred Recharts rendering until client mount so the SSG HTML contains metric values without forcing large chart SVGs into the initial HTML/hydration path.
- Added `dist-ssr/` to `.gitignore`.

## Data Pipeline Preservation

No direct changes were made to:

- `scripts/fetch-data.js`
- `.github/workflows/update-data.yml`
- `public/data.json`
- `public/tempo-data.json`

The prerender step only reads `public/data.json` during `npm run build`. The GitHub Actions cron remains the writer of record for `public/data.json`, and Vercel can continue building static output from the committed data file after cron commits or deploy hooks.

## Build Output Verification

`npm run build` generated separate route HTML files:

```txt
dist/index.html
dist/x402/index.html
dist/erc-8004/index.html
dist/virtuals-acp/index.html
dist/olas/index.html
dist/tempo-mpp/index.html
dist/methodology/index.html
dist/data/index.html
```

Each route contains server-rendered app markup and embedded build-time data:

```txt
index hasData=true hasApp=true
x402 hasData=true hasApp=true
erc-8004 hasData=true hasApp=true
virtuals-acp hasData=true hasApp=true
olas hasData=true hasApp=true
tempo-mpp hasData=true hasApp=true
methodology hasData=true hasApp=true
data hasData=true hasApp=true
```

Metric values verified in raw HTML:

```txt
dist/index.html ok
dist/x402/index.html ok
dist/erc-8004/index.html ok
dist/virtuals-acp/index.html ok
dist/olas/index.html ok
dist/tempo-mpp/index.html ok
dist/methodology/index.html ok
dist/data/index.html ok
```

Examples of build-time values embedded from `public/data.json`:

- Combined events: `173,491,414`
- x402 total transactions: `144.0M`
- x402 volume: `40.5M`
- ERC-8004 registered agents: `210.2K`
- Virtuals ACP memos: `12.3M`
- Olas transactions: `16.4M`
- Tempo MPP events: `26.5K`
- Data timestamp: `2026-05-19T02:09:21.100Z`

## Lighthouse Before / After

Baseline from `AUDIT.md`:

| Metric | Before |
| --- | ---: |
| Lighthouse SEO | 100 |
| Lighthouse Performance | 82 |
| FCP | 3.3s |
| LCP | 3.3s |
| CLS | 0 |
| TBT | 70ms |
| Speed Index | 5.1s |

After Stage 1, run against local Vite preview at `http://127.0.0.1:4173/`:

| Metric | After |
| --- | ---: |
| Lighthouse SEO | 100 |
| Lighthouse Performance | 84 |
| FCP | 3.2s |
| LCP | 3.3s |
| CLS | 0.005 |
| TBT | 40ms |
| Speed Index | 4.7s |

Command used:

```sh
npx --yes lighthouse http://127.0.0.1:4173/ --only-categories=seo,performance --chrome-flags='--headless --no-sandbox' --output=json --output-path=stdout --quiet
```

## Deviations From Spec

No Stage 2/3/4 work was started.

Intentional Stage 1 decisions:

- Chose a custom Vite prerender script instead of `vite-ssg`, because the canonical `vite-ssg` package is Vue-oriented.
- Did not add protocol page content. The new route pages are explicit Stage 1 stubs with build-time metric cards only.
- Did not change homepage title/meta/canonical, sitemap, robots.txt, `/llms.txt`, `/api/og`, or brand/design.
- Did not add 301 redirects or canonical migration. That is Stage 3.

## Vercel Notes

No Vercel config change was needed for the Stage 1 static routes. Vercel's static output directory remains `dist`, and the generated `dist/<route>/index.html` files should be served by Vercel's static file routing.

The existing `/api/og` rewrite remains unchanged because fixing `/api/og` is Stage 3.

PR #3 Vercel checks passed:

- `Vercel`: pass, deployment completed.
- `Vercel Preview Comments`: pass.

The preview URL is protected by Vercel SSO and returns 401 to unauthenticated `curl` requests, including `/`, `/x402`, `/data`, and `/data.json`. That prevented public route-body verification on the preview deployment from this environment, but the Vercel deployment itself completed successfully and local `dist/` + `vite preview` route verification passed.

## Acceptance Checklist

- [x] `STAGE_1_DECISION.md` was committed before implementation changes.
- [x] Separate HTML generated for `/`, `/x402`, `/erc-8004`, `/virtuals-acp`, `/olas`, `/tempo-mpp`, `/methodology`, `/data`.
- [x] Each HTML file contains relevant metric values in raw HTML.
- [x] `public/data.json` is read at build time and embedded into prerendered HTML.
- [x] Existing daily data pipeline files were not modified.
- [x] Lighthouse Performance did not regress: 84 after vs 82 before.
- [x] Lighthouse SEO remains 100.
- [x] Stage 2 protocol content was not created.
