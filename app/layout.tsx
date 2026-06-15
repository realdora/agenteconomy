import type { Metadata } from "next";
import { GoogleAnalytics } from "@/components/GoogleAnalytics";
import { formatEvents, getAgentData } from "@/lib/agent-data";
import "./globals.css";
import "./styles/navigation.css";
import "./styles/hero.css";
import "./styles/routes.css";
import "./styles/responsive.css";

const TITLE = "agent economy — on-chain & off-chain agent-payment data";
// Social-card title mirrors the OG image headline; the two-axis framing keeps the
// on-chain "measured" claim honest now that off-chain (sourced) signal is shown too.
const OG_TITLE = "The data authority for the agent economy";
const SITE_URL = "https://agenteconomy.to";

const siteJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: "agent economy",
      url: SITE_URL,
      logo: `${SITE_URL}/og.png`,
      sameAs: ["https://x.com/realdora_eth"],
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

// Description tracks the live event total so the SEO/social copy stays in sync with the page.
export async function generateMetadata(): Promise<Metadata> {
  const { totalEvents } = await getAgentData();
  const ev = `${formatEvents(totalEvents)}+`;
  const social = `On-chain flow measured across 5 protocols & 11+ chains (${ev} events daily); off-chain market, supply & developer signal sourced.`;
  return {
    metadataBase: new URL("https://agenteconomy.to"),
    title: TITLE,
    description: `The data authority for the agent economy. On-chain flow across 5 protocols and 11+ chains (${ev} events daily), measured — plus off-chain market, supply and developer signal.`,
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

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="theme-dark">
        {children}
        <GoogleAnalytics />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd) }} />
      </body>
    </html>
  );
}
