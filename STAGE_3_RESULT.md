# Stage 3 Result

Date: 2026-05-20

Preview deployment: https://agenteconomy-i55wogfx8-doras-projects-221b12b2.vercel.app

## Changes Shipped

- Homepage SEO rewrite:
  - `<title>` is `AI Agent Payment Data Dashboard | x402, ERC-8004, ACP, Olas, MPP`.
  - Homepage H1 is `AI Agent Payment Data Dashboard`.
  - Meta description is 152 chars and front-loads `AI agent payment data`.
  - Homepage WebSite, WebApplication, Dataset, and Stage 2 CollectionPage JSON-LD names/descriptions now align with the new homepage title.
- Bare-domain canonical migration:
  - `SITE_URL` is now `https://agenteconomy.to`.
  - `/data` FAQ URLs now use the bare domain.
  - `index.html`, `public/sitemap.xml`, and `public/robots.txt` now use bare-domain URLs.
  - Built route canonicals and `og:url` fields all use `https://agenteconomy.to`.
- Sitemap:
  - `scripts/prerender.js` generates `dist/sitemap.xml` from `STAGE_1_ROUTES` and `public/data.json.updatedAt`.
  - Static `public/sitemap.xml` is kept as a bare-domain fallback; production output is generated during build.
- Robots and AI access:
  - Added explicit `Allow: /` sections for `GPTBot`, `ClaudeBot`, `PerplexityBot`, `Google-Extended`, `anthropic-ai`, `CCBot`, and `ChatGPT-User`.
  - Kept wildcard `User-agent: *`.
- `/llms.txt`:
  - Added `public/llms.txt` with H1, summary blockquote, site-purpose notes, H2 file-list sections, endpoints, sitemap, license, and contact.
  - Contact is `https://x.com/realdora_eth`.
- `/api/og`:
  - Replaced `api/og.jsx` with `api/og.js`.
  - Removed JSX syntax and uses `react/jsx-runtime` factories.
  - Removed the no-op `/api/og` rewrite from `vercel.json`.
  - Switched to Edge runtime and fetches `/data.json`, forwarding Vercel deployment-protection headers/cookies so protected previews still read live data.
- Internal linking:
  - Added explicit `relatedRoutes` arrays per route.
  - Protocol pages link to the other four protocols plus `/methodology` and `/data`.
  - `/methodology` links to all five protocols plus `/data`.
  - `/data` links to all five protocols plus `/methodology`.
- Clean URL cleanup:
  - Chose option A from the prompt.
  - `dist/<route>.html` helper output is gated behind `BUILD_CLEAN_URLS=1`; default production build emits only `dist/index.html` plus route directory `index.html` files.

## URL Migration Counts

Before code changes, `git grep -c "www\\.agenteconomy\\.to" HEAD -- src/App.jsx index.html public/sitemap.xml public/robots.txt` returned:

- `index.html`: 11
- `src/App.jsx`: 2
- `public/sitemap.xml`: 1
- `public/robots.txt`: 1
- Total: 15

After build:

- `grep -r "www.agenteconomy.to" dist/ public/ src/ index.html` returned no matches.

## Sitemap Entries

`dist/sitemap.xml` contains 8 entries, all with `<lastmod>2026-05-20T02:36:31.998Z</lastmod>`, `<changefreq>daily</changefreq>`, and bare-domain `<loc>` values:

- `https://agenteconomy.to/` priority `1.0`
- `https://agenteconomy.to/x402` priority `0.9`
- `https://agenteconomy.to/erc-8004` priority `0.9`
- `https://agenteconomy.to/virtuals-acp` priority `0.8`
- `https://agenteconomy.to/olas` priority `0.8`
- `https://agenteconomy.to/tempo-mpp` priority `0.7`
- `https://agenteconomy.to/methodology` priority `0.8`
- `https://agenteconomy.to/data` priority `0.8`

## Verification

- `npm run build`: passed.
- `node --check api/og.js`: passed.
- `grep -r "www.agenteconomy.to" dist/ public/ src/ index.html`: no matches.
- `rg -c "<url>" dist/sitemap.xml`: `8`.
- `find dist -maxdepth 1 -name '*.html' -print`: only `dist/index.html`.
- Related-link matrix check: all protocol, methodology, and data routes passed.
- Homepage comparison table links: `/x402`, `/erc-8004`, `/virtuals-acp`, `/tempo-mpp`, `/olas` all present.
- Data pipeline diff: empty for `public/data.json`, `public/tempo-data.json`, `scripts/fetch-data.js`, and `.github/workflows`.
- No new dependencies.
- `.gitignore` now ignores `.vercel` and `.env*.local`, added by the Vercel CLI during preview verification so local project-link and environment files are not committed.

Vercel preview verification:

- Direct unauthenticated preview curl returns `401` because deployment protection is enabled.
- Protected-preview curl via Vercel CLI succeeded:

```text
vercel curl /api/og --deployment https://agenteconomy-i55wogfx8-doras-projects-221b12b2.vercel.app -- --http1.1 -I --max-time 30
HTTP/1.1 200 OK
Content-Type: image/png
```

```text
vercel curl /api/og --deployment https://agenteconomy-i55wogfx8-doras-projects-221b12b2.vercel.app -- --http1.1 --max-time 60 -o /private/tmp/stage3-og-final-live.png -w 'status=%{http_code} content_type=%{content_type} size=%{size_download}\n'
status=200 content_type=image/png size=38295
```

The saved PNG is 1200x630 and shows the live dataset values from `data.json`.

## Dora Manual Steps

1. In Vercel Domains, set `agenteconomy.to` as the Primary domain.
2. Configure `www.agenteconomy.to/*` to 301 redirect to `https://agenteconomy.to/:path*`.
3. Confirm with curl after production deploy:
   - `curl -I https://www.agenteconomy.to/`
   - `curl -I https://www.agenteconomy.to/x402`
   - Both should return a permanent redirect to the matching bare-domain URL.
4. In Google Search Console, verify both `https://www.agenteconomy.to` and `https://agenteconomy.to` if not already verified.
5. Submit `https://agenteconomy.to/sitemap.xml` for the bare-domain property after the redirect is live.
6. Google currently documents that www-to-non-www moves should use redirects and canonical tags rather than the Change of Address tool. If Search Console still presents a usable Change of Address flow for this property, run it only after the 301 is live; otherwise rely on the 301, canonicals, and sitemap.
7. In Bing Webmaster Tools, add or verify the bare-domain property.
8. Submit `https://agenteconomy.to/sitemap.xml` in Bing Webmaster Tools after the redirect is live.
9. Use Bing URL Inspection / Submit URLs for `/`, `/x402`, `/erc-8004`, `/virtuals-acp`, `/olas`, `/tempo-mpp`, `/methodology`, and `/data`.
10. If Bing exposes a Site Move flow for the account, use it only after confirming the `www` to bare 301s are live.
