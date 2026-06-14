import type { Metadata } from "next";
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
      <body className="theme-dark">{children}</body>
    </html>
  );
}
