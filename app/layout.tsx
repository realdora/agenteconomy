import type { Metadata } from "next";
import "./globals.css";
import "./styles/navigation.css";
import "./styles/hero.css";
import "./styles/routes.css";
import "./styles/responsive.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://agenteconomy.to"),
  title: "agent economy — the data authority for on-chain agentic payments",
  description:
    "The data authority for on-chain agentic payments. 5 protocols, 11+ chains, 173M+ events tracked daily — every number traces back to a public smart contract.",
  applicationName: "agent economy",
  openGraph: {
    type: "website",
    url: "https://agenteconomy.to",
    siteName: "agent economy",
    title: "agent economy — the data authority for on-chain agentic payments",
    description:
      "5 protocols, 11+ chains, 173M+ on-chain agent-payment events tracked daily — every number traces back to a public smart contract.",
  },
  twitter: {
    card: "summary",
    site: "@realdora_eth",
    creator: "@realdora_eth",
    title: "agent economy — the data authority for on-chain agentic payments",
    description:
      "5 protocols, 11+ chains, 173M+ on-chain agent-payment events tracked daily.",
  },
};

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
