#!/usr/bin/env node
// Submit every URL in the live sitemap to IndexNow.
//
// Why this exists: the sitemap was submitted to Bing once, by hand, in May, and
// nothing re-submitted it. By August, Bing still believed the site had 8 URLs
// while the sitemap listed 27 — every answer page shipped in the July overhaul
// was invisible to it. Bing is the index behind ChatGPT search and Copilot, so
// that gap was a GEO outage, not just an SEO one. Pinging has to be automatic.
//
//   node scripts/indexnow.mjs            # submit the live sitemap's URLs
//   node scripts/indexnow.mjs --dry-run  # print what would be submitted
//
// The IndexNow key is public by design (it is served at the site root so the
// engine can verify ownership), so this needs no secret and can run anywhere.

const SITE = process.env.INDEXNOW_SITE ?? "https://agenteconomy.to";
const KEY = process.env.INDEXNOW_KEY ?? "4a11b76f92d04bafbf28f9331b62d0ce";
const HOST = new URL(SITE).host;
const DRY = process.argv.includes("--dry-run");

const res = await fetch(`${SITE}/sitemap.xml`, { headers: { "user-agent": "agenteconomy-indexnow" } });
if (!res.ok) {
  console.error(`sitemap fetch failed: HTTP ${res.status}`);
  process.exit(1);
}
const xml = await res.text();
const urlList = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim()).filter(Boolean);

if (!urlList.length) {
  console.error("sitemap contained no <loc> entries — refusing to submit an empty list");
  process.exit(1);
}

// A sitemap that suddenly collapses is a symptom of a broken build, and blasting
// a near-empty list at the engines would advertise that breakage. Bail instead.
if (urlList.length < 10) {
  console.error(`sitemap only had ${urlList.length} URLs, which is implausibly few — refusing to submit`);
  process.exit(1);
}

console.log(`sitemap: ${urlList.length} URLs`);
if (DRY) {
  urlList.forEach((u) => console.log("  " + u));
  process.exit(0);
}

const submit = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify({
    host: HOST,
    key: KEY,
    keyLocation: `${SITE}/${KEY}.txt`,
    urlList,
  }),
});

// 200 and 202 both mean accepted; IndexNow returns 202 when it has queued the
// batch without validating the key yet.
if (submit.status === 200 || submit.status === 202) {
  console.log(`IndexNow accepted ${urlList.length} URLs (HTTP ${submit.status})`);
} else {
  console.error(`IndexNow rejected the batch: HTTP ${submit.status} ${(await submit.text()).slice(0, 300)}`);
  process.exit(1);
}
