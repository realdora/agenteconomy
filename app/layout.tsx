import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

import { GoogleAnalytics } from "@/components/GoogleAnalytics";
import { formatEvents, getAgentData } from "@/lib/agent-data";
import { safeJsonLd } from "@/lib/seo";
import "./globals.css";
import "./styles/navigation.css";
import "./styles/hero.css";
import "./styles/routes.css";
import "./styles/responsive.css";
import "./styles/agent.css";

const TITLE = "agent economy — on-chain & off-chain agent-payment data";
// Social-card title mirrors the OG image headline; the two-axis framing keeps the
// on-chain "measured" claim honest now that off-chain (sourced) signal is shown too.
const OG_TITLE = "The data authority for the agent economy";
const SITE_URL = "https://agenteconomy.to";

// The first on-chain month the pipeline covers; used as the Dataset's temporal
// lower bound so the coverage window is machine-readable rather than implied.
const COVERAGE_START = "2025-10-01";

// Built per-request so the Dataset can carry the feed's real dateModified —
// the freshness signal engines read machine-readably, rather than inferring it
// from the "as of" prose on the page.
function buildSiteJsonLd(updatedAt: string | null, totals: { events: number; volumeUsd: number; chains: number }) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${SITE_URL}/#organization`,
        name: "agent economy",
        url: SITE_URL,
        logo: `${SITE_URL}/og.png`,
        description: "Independent measurement of on-chain AI agent payment activity.",
        sameAs: ["https://x.com/realdora_eth", "https://github.com/realdora/agenteconomy"],
        founder: {
          "@type": "Person",
          "@id": `${SITE_URL}/#founder`,
          name: "realdora",
          url: "https://x.com/realdora_eth",
          sameAs: ["https://x.com/realdora_eth", "https://github.com/realdora"],
        },
        knowsAbout: [
          "AI agent payments",
          "x402",
          "ERC-8004",
          "Virtuals ACP",
          "Olas",
          "Tempo MPP",
          "stablecoin settlement",
          "on-chain analytics",
        ],
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        name: "agent economy",
        url: SITE_URL,
        description: "The data authority for the agent economy.",
        publisher: { "@id": `${SITE_URL}/#organization` },
        inLanguage: "en",
      },
      {
        "@type": "Dataset",
        "@id": `${SITE_URL}/#dataset`,
        name: "Agent economy data",
        description:
          "On-chain agent-payment activity (5 protocols, 11+ chains, measured) plus off-chain agent-economy signal (token market, service & agent supply, developer adoption, sourced).",
        url: `${SITE_URL}/data`,
        license: `${SITE_URL}/about`,
        isAccessibleForFree: true,
        creator: { "@id": `${SITE_URL}/#organization` },
        publisher: { "@id": `${SITE_URL}/#organization` },
        ...(updatedAt ? { dateModified: updatedAt } : {}),
        temporalCoverage: `${COVERAGE_START}/..`,
        measurementTechnique:
          "Aggregation of public on-chain settlement, registration and channel events by contract and facilitator address, refreshed daily",
        keywords: [
          "agent economy",
          "AI agent payments",
          "x402",
          "ERC-8004",
          "Virtuals ACP",
          "Olas",
          "Tempo MPP",
          "stablecoin settlement",
          "on-chain data",
        ],
        variableMeasured: [
          { "@type": "PropertyValue", name: "Total tracked agent-economy events", value: totals.events, unitText: "events" },
          { "@type": "PropertyValue", name: "x402 settled volume", value: totals.volumeUsd, unitText: "USD" },
          { "@type": "PropertyValue", name: "Chains covered", value: totals.chains, unitText: "chains" },
        ],
        distribution: [
          { "@type": "DataDownload", name: "On-chain feed", encodingFormat: "application/json", contentUrl: `${SITE_URL}/data.json` },
          { "@type": "DataDownload", name: "Off-chain feed", encodingFormat: "application/json", contentUrl: `${SITE_URL}/web-sources.json` },
        ],
      },
      {
        "@type": "WebAPI",
        "@id": `${SITE_URL}/#api`,
        name: "agent economy data API",
        description: "Key-less JSON feeds and an MCP server (/api/mcp) for agents. See /openapi.json for the contract and /llms.txt for the agent index.",
        documentation: `${SITE_URL}/openapi.json`,
        termsOfService: `${SITE_URL}/about`,
        provider: { "@id": `${SITE_URL}/#organization` },
      },
    ],
  };
}

// Description tracks the live event total so the SEO/social copy stays in sync with the page.
export async function generateMetadata(): Promise<Metadata> {
  const { totalEvents } = await getAgentData();
  const ev = `${formatEvents(totalEvents)}+`;
  const social = `On-chain flow measured across 5 protocols & 11+ chains (${ev} events); off-chain market, supply & developer signal sourced.`;
  return {
    metadataBase: new URL("https://agenteconomy.to"),
    title: TITLE,
    description: `The data authority for the agent economy. On-chain flow across 5 protocols and 11+ chains (${ev} events), measured — plus off-chain market, supply and developer signal.`,
    applicationName: "agent economy",
    openGraph: {
      type: "website",
      url: "https://agenteconomy.to",
      siteName: "agent economy",
      title: OG_TITLE,
      description: social,
      images: [{ url: "/og.png", width: 1200, height: 630, alt: OG_TITLE }],
    },
    twitter: {
      card: "summary_large_image",
      site: "@realdora_eth",
      creator: "@realdora_eth",
      title: OG_TITLE,
      description: social,
      images: ["/og.png"],
    },
  };
}

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const { updatedAt, totalEvents, price } = await getAgentData();
  const siteJsonLd = buildSiteJsonLd(updatedAt, {
    events: totalEvents,
    volumeUsd: Math.round(price.volumeM * 1e6),
    chains: price.chains,
  });

  return (
    <html lang="en">
      <head>
        {/* Self-hosted fonts are declared in CSS, so without preload the browser only
            discovers them after the stylesheet parses — this puts them first in line. */}
        <link
          rel="preload"
          href="/fonts/Geist_Variable-s.p.0-te~ja_gpvcf.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/Denton_Regular-s.p.07x_slr5ebkwx.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
      </head>
      <body className="theme-dark">
        {children}
        <GoogleAnalytics />
        {/* Imported from "@vercel/analytics/next", not "/react" — the Next entry
            is what reports App Router route patterns instead of raw URLs. Its
            script and beacon both live under /_vercel/insights, so the enforced
            CSP covers them with 'self' and needs no extra origin. */}
        <Analytics />
        {/* Real-user Core Web Vitals. Unlike Analytics, this one needs a CSP
            allowance: its beacon posts to /_vercel/speed-insights/vitals but
            falls back to https://vitals.vercel-insights.com/v2/vitals, which
            'self' would block — that origin is already in connect-src. */}
        <SpeedInsights />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(siteJsonLd) }} />
      </body>
    </html>
  );
}
