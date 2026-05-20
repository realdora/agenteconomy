# Stage 4a Result

Date: 2026-05-20

Scope: code-only items from Stage 4. Items 2/3/4 (GSC dashboard integration, Bing dashboard, AI referrer dashboard, MEASUREMENT_DASHBOARD.md) are deferred to Stage 4b once GSC + Bing have populated their data (typically 3-7 days after sitemap submission).

## Changes Shipped

### GA4 integration (conditional)

- Added Vite `transformIndexHtml` plugin in `vite.config.js` that reads `VITE_GA_MEASUREMENT_ID` at build time
- When env var is set: injects gtag.js snippet + custom event handlers + AI engine referrer detection
- When env var is unset: snippet is fully removed from production HTML (no gtag references)
- `@vercel/analytics` `inject()` call in `main.jsx` is untouched; both analytics run in parallel

Events emitted (when GA4 is configured):
- `page_view` on initial load with custom parameter `ai_engine_source` populated when `document.referrer` matches: `chat.openai.com`, `chatgpt.com`, `perplexity.ai`, `claude.ai`, `gemini.google.com`, `copilot.microsoft.com`, `bing.com/chat`
- `outbound_click` on clicks to external hosts (link_url, link_domain)
- `data_download` on clicks to `/data.json` or `/tempo-data.json` (file_name, link_url)

### Performance optimization

Primary lever — eliminate Google Fonts external dependency:
- Self-hosted Inter + JetBrains Mono variable WOFF2 files in `public/fonts/`
- `@font-face` declarations in `src/styles.css` use `font-weight: 400 800` and `font-weight: 500 700` ranges (single variable file per family covers all used weights)
- `<link rel="preload" as="font" type="font/woff2" crossorigin>` for both files in `index.html` `<head>`
- Removed Google Fonts `<link>` + preconnect tags from `index.html`

Secondary lever — lazy-load Recharts:
- `src/Charts.jsx` re-exports recharts components and exposes them via a `Charts` component using the render-prop pattern
- `src/App.jsx` replaces top-level `import { Bar, BarChart, ... } from 'recharts'` with `const LazyCharts = lazy(() => import('./Charts.jsx'))` + a `<ChartSurface>` wrapper that combines `ClientRendered` + `Suspense`
- Three chart-rendering sites (`X402Section`, `RegistrySection`, `SimpleProtocolSection`) restructured to use `<ChartSurface>{({ Bar, ... }) => <ResponsiveContainer>...</ResponsiveContainer>}</ChartSurface>`

### Security headers (vercel.json)

Added `headers` config applying to `/(.*)`:
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy: camera=(), microphone=(), geolocation=(), interest-cohort=()`
- `X-Frame-Options: DENY`
- `Strict-Transport-Security: max-age=31536000; includeSubDomains`

Content-Security-Policy intentionally omitted — needs separate testing with self-hosted fonts, Vercel Analytics, GA4. Deferred to Stage 4b or later.

### Documentation

- `README.md`: added v3.0 changelog entry, rewrote Architecture diagram for SSG flow, updated Project Structure with new files (Charts.jsx, prerender.js, entry-server.jsx, llms.txt, fonts/), expanded Tech stack, added Environment variables section
- Vault `Vibe Projects/agent.economy.to/ai/brief.md`: frontmatter version bump to v3.0, stack updated, Critical files refreshed, new Pitfalls (per-route metadata, bare-domain canonical layering, Edge runtime constraints, lazy Recharts pattern, font dupe cleanup follow-up), new Decisions for Stages 1-3 + 4a, prepended maintenance log entries

## Lighthouse Before / After

Baseline captured on origin/main (commit 2c9dac5 + reverts) before Stage 4a changes:

| Metric | Baseline | After Stage 4a | Delta |
|---|---:|---:|---|
| Performance | 78 | **91** | +13 |
| SEO | 100 | 100 | unchanged |
| LCP | 3300 ms | **2702 ms** | -598 ms |
| FCP | 2540 ms | **2102 ms** | -438 ms |
| CLS | 0.097 | **0.00006** | -0.097 (eliminated) |
| TBT | 120 ms | 210 ms | +90 ms |
| Speed Index | — | 2102 ms | — |

Performance score crossed the 90 threshold. LCP improved 598 ms but fell 202 ms short of the < 2500 ms target (font preload finish + variable font activation is the residual bottleneck). CLS effectively eliminated — the pre-Stage-4a layout shift was font-swap induced and goes to zero when fonts are self-hosted and preloaded.

TBT regressed slightly (120 → 210 ms). Suspect cause: React.lazy + Suspense scheduling overhead. Still within Lighthouse "Needs Improvement" band; acceptable trade-off for the LCP / CLS wins.

## Verification Evidence

```
$ npm run build
✓ 837 modules transformed.
dist/index.html                  24.99 kB │ gzip:   6.68 kB
dist/assets/index-CY0FoBIT.css   13.43 kB │ gzip:   3.55 kB
dist/assets/react-CQaaLGMD.js     0.03 kB │ gzip:   0.05 kB
dist/assets/Charts-CzWeijfW.js    0.43 kB │ gzip:   0.28 kB    <- lazy chart wrapper
dist/assets/index-Bv7EOlSg.js    94.19 kB │ gzip:  28.60 kB    <- main bundle
dist/assets/charts-Buc1uMZO.js  568.09 kB │ gzip: 158.73 kB    <- recharts (lazy-fetched)
```

```
$ grep "googleapis\|gstatic" dist/index.html
(zero matches)

$ grep -E '<link rel="preload"' dist/index.html
<link rel="preload" as="font" type="font/woff2" href="/fonts/inter-400.woff2" crossorigin />
<link rel="preload" as="font" type="font/woff2" href="/fonts/jetbrains-mono-500.woff2" crossorigin />

$ grep -c "googletagmanager" dist/index.html
0    # env var unset → no gtag snippet

$ VITE_GA_MEASUREMENT_ID=G-TEST123ABC npm run build && grep "G-TEST123ABC" dist/index.html | head -c 200
<script async src="https://www.googletagmanager.com/gtag/js?id=G-TEST123ABC"></script>
```

Data pipeline diff against main: empty for `scripts/fetch-data.js`, `.github/workflows/`, `public/data.json`, `public/tempo-data.json`.

Dependencies: no new package additions (GA4 is plain script tag, fonts are static files).

## Dora Manual Steps (After Merge)

1. Open https://analytics.google.com → Admin (gear icon, bottom-left) → Create Property
2. Property name: `agenteconomy.to`. Reporting time zone + currency: your preference. Continue.
3. Select industry + business size. Continue.
4. Business objectives: pick "Get baseline reports" (or any relevant). Create.
5. Choose data stream: Web. Enter `https://agenteconomy.to`. Stream name: `agenteconomy.to`. Create stream.
6. Copy the **Measurement ID** (starts with `G-`)
7. Open https://vercel.com/doras-projects-221b12b2/agenteconomy/settings/environment-variables
8. Add new variable: Key = `VITE_GA_MEASUREMENT_ID`, Value = `G-XXXXXXXXXX` (your measurement ID), Environment = Production (also Preview if you want to test). Save.
9. Trigger a redeploy: Vercel Deployments → ⋯ on latest production → Redeploy. (Or push any tiny commit.)
10. Verify: `curl -s https://agenteconomy.to/ | grep googletagmanager` returns the gtag script tag.

After ~24 hours of traffic, GA4 reports under Reports → Engagement → Events should show `page_view`, `outbound_click`, `data_download` events. The custom parameter `ai_engine_source` will appear in Explore reports once you add it as a custom dimension in Admin → Custom definitions (a one-time GA4 console setup).

## Known Follow-ups (Not Blocking)

- **Font file deduplication**: Codex (mid-implementation crash) downloaded the same Google Fonts variable WOFF2 URL multiple times under different weight-suffixed filenames. `public/fonts/inter-{400,500,600,700,800}.woff2` are byte-identical (SHA256 c940764...), and `public/fonts/jetbrains-mono-{500,700}.woff2` are byte-identical (SHA256 2c32b9b3...). The current `@font-face` declarations and `<link rel="preload">` tags reference only `inter-400.woff2` and `jetbrains-mono-500.woff2`, which are the canonical files. The other 5 files are dead bytes on disk + in the Vercel deployment (~223 KB total). Suggested cleanup PR: delete `inter-{500,600,700,800}.woff2` and `jetbrains-mono-700.woff2`. Not blocking because they are unreferenced.
- **LCP residual**: LCP at 2702 ms is 202 ms over the < 2500 ms target. Possible further levers (Stage 4b): `font-display: optional` (risk: occasional fallback-font flash), critical CSS inline in `<head>`, defer non-critical CSS.

## Not Done (Stage 4b Scope)

- GSC dashboard integration into the site or a local dashboard
- Bing Webmaster Tools dashboard integration (Bing's "AI Performance" beta dashboard is hosted at bing.com/webmasters and can be reviewed there directly without code integration)
- AI referrer tracking dashboard on `/data` route (separate from the GA4 custom-parameter tracking which IS shipped in 4a)
- `MEASUREMENT_DASHBOARD.md` (depends on having actual GSC/Bing impression data, which doesn't exist yet)
- Content-Security-Policy header (needs separate testing)
