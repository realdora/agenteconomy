import type { Metadata } from "next";
import { formatEvents, getAgentData } from "@/lib/agent-data";
import "./globals.css";
import "./styles/navigation.css";
import "./styles/hero.css";
import "./styles/routes.css";
import "./styles/responsive.css";

const TITLE = "agent economy — the data authority for on-chain agentic payments";

// Description tracks the live event total so the SEO/social copy stays in sync with the page.
export async function generateMetadata(): Promise<Metadata> {
  const { totalEvents } = await getAgentData();
  const ev = `${formatEvents(totalEvents)}+`;
  const social = `5 protocols, 11+ chains, ${ev} on-chain agent-payment events tracked daily — every number traces back to a public smart contract.`;
  return {
    metadataBase: new URL("https://agenteconomy.to"),
    title: TITLE,
    description: `The data authority for on-chain agentic payments. 5 protocols, 11+ chains, ${ev} events tracked daily — every number traces back to a public smart contract.`,
    applicationName: "agent economy",
    openGraph: {
      type: "website",
      url: "https://agenteconomy.to",
      siteName: "agent economy",
      title: TITLE,
      description: social,
    },
    twitter: {
      card: "summary",
      site: "@realdora_eth",
      creator: "@realdora_eth",
      title: TITLE,
      description: `5 protocols, 11+ chains, ${ev} on-chain agent-payment events tracked daily.`,
    },
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="/css/18bo3xybony97.css" />
        <link rel="stylesheet" href="/css/0z-8tf3sp3ovs.css" />
      </head>
      <body className="theme-dark geistsans_d5a4f12f-module__UWyvRW__variable geistmono_157ca88a-module__DG41QG__variable">
        {children}
      </body>
    </html>
  );
}
