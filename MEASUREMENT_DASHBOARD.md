# Measurement Dashboard

This is the weekly operating checklist for `agenteconomy.to` after the Stage 4 SEO launch. Stage 4b-2 will add the AI referrer site dashboard and replace launch ranges with real baselines after more GA4, GSC, and Bing data accumulates.

## What We Measure

- Vercel Analytics: page views, route-level traffic, Core Web Vitals, and deployment-linked performance changes.
- GA4: `page_view`, `outbound_click`, `data_download`, and the `ai_engine_source` custom parameter.
- Google Search Console: organic search impressions, clicks, indexed pages, sitemap state, crawl errors, and top queries/pages.
- Bing Webmaster Tools: Bing search impressions/clicks, sitemap state, crawl diagnostics, and the AI Performance dashboard.
- Vercel deployment logs: build health, production deploy timing, analytics script availability, and runtime errors.

## Where To Look

- GA4: https://analytics.google.com -> property `agenteconomy.to` -> Reports.
- GSC: https://search.google.com/search-console -> property `agenteconomy.to`.
- Bing: https://www.bing.com/webmasters -> property `agenteconomy.to`, including AI Performance.
- Vercel Analytics: Vercel dashboard -> `agenteconomy` -> Analytics.
- Vercel Deployments: Vercel dashboard -> `agenteconomy` -> Deployments.

## Launch Baselines

- Week 1: expect GSC impressions around `50-500`, GA4 users under `50`, and Bing data still loading or sparse.
- Week 2-4: expect GSC impressions to trend up, top pages to stabilize, and first AI referrer hits to become possible.
- Month 2+: expect meaningful AI referrer distribution to be visible if external discovery is working.

These are launch ranges, not success targets. Replace them with real medians in Stage 4b-2.

## Weekly 5-Minute Routine

1. GSC -> Performance: record total impressions, clicks, CTR, top queries, and top pages for the last 7 days.
2. GSC -> Indexing -> Pages and Sitemaps: confirm sitemap fetch succeeds and no important route is dropped.
3. GA4 -> Reports -> Engagement -> Events: check `page_view`, `outbound_click`, and `data_download`.
4. GA4 -> Explore or Events detail: filter/group by `ai_engine_source`; confirm engines are mapped instead of collapsing into `(other)`.
5. Bing Webmaster -> Search Performance: check impressions, clicks, indexed URLs, and sitemap state.
6. Bing Webmaster -> AI Performance: check mentions, cited pages, and query themes.
7. Vercel -> Deployments: confirm the latest production deploy matches the expected commit and has no build/runtime errors.

## Red Flags

- GSC indexing drops: sitemap fetch failed, route disappeared, or crawl errors increased.
- Bing shows 0 impressions after 2+ weeks: sitemap may not be picked up or the property may not be processing.
- GA4 events drop to 0: `VITE_GA_MEASUREMENT_ID` may be unset, gtag may be blocked, or the deploy may have regressed analytics injection.
- AI engine referrers all show as `(other)`: custom parameter mapping or event logic may be broken.
- Vercel Web Vitals regress sharply after a deploy: compare the current production commit with the last good deploy.

## Red-Flag Playbook

Follow the terse recovery pattern used by `INCIDENTS.md`: state symptom, scope, likely cause, verification commands, fix, and follow-up owner/date.

### GSC Indexing Drop

Verify public crawl surfaces:

```bash
curl -I https://agenteconomy.to/
curl -I https://www.agenteconomy.to/
curl -sS https://agenteconomy.to/robots.txt
curl -sS https://agenteconomy.to/sitemap.xml
curl -sS https://agenteconomy.to/llms.txt
```

Confirm sitemap status through the GSC UI. If using the Search Console API:

```bash
curl -H "Authorization: Bearer $GOOGLE_OAUTH_TOKEN" \
  "https://searchconsole.googleapis.com/webmasters/v3/sites/sc-domain:agenteconomy.to/sitemaps/https%3A%2F%2Fagenteconomy.to%2Fsitemap.xml"
```

If routes are missing, run a local build and inspect generated files:

```bash
npm run build
find dist -maxdepth 2 -type f | sort
```

### Bing 0 Impressions After 2+ Weeks

Check that Bing has the bare-domain property and sitemap. Then verify public files:

```bash
curl -I https://agenteconomy.to/sitemap.xml
curl -sS https://agenteconomy.to/sitemap.xml | head -40
curl -I https://agenteconomy.to/robots.txt
```

If the public files are healthy, resubmit the sitemap in Bing Webmaster Tools and note the resubmission date in the weekly log.

### GA4 Events Drop To 0

Check production env and deployed HTML:

```bash
vercel env ls production
curl -sS https://agenteconomy.to/ | grep -n "googletagmanager"
curl -sS https://agenteconomy.to/ | grep -n "G-S6D2WTWRGZ"
```

Check recent deploys and logs:

```bash
vercel ls agenteconomy
vercel logs https://agenteconomy.to
```

If the measurement ID is absent from HTML, verify `VITE_GA_MEASUREMENT_ID` is set in Vercel Production and redeploy the latest good commit.

### AI Referrers Collapse To `(other)`

Confirm event names still exist in the built client:

```bash
rg "ai_engine_source|outbound_click|data_download" src
npm run build
rg "ai_engine_source|outbound_click|data_download" dist
```

Then use GA4 DebugView or Realtime to inspect one known referral session. If events fire but the custom parameter is missing, audit the client-side analytics mapping before changing any dashboard assumptions.

### Vercel Deploy Or Web Vitals Regression

Compare the active production deploy with the last good commit:

```bash
git log --oneline -10
vercel ls agenteconomy
vercel logs https://agenteconomy.to
npm run build
```

If a regression maps to one deploy, revert or patch that commit, then record the symptom, command output, and recovery commit in `INCIDENTS.md`.
