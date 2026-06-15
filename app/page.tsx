import { FooterSection } from "@/components/landing/FooterSection";
import { HeaderSection } from "@/components/landing/HeaderSection";
import { HeroSection } from "@/components/landing/HeroSection";
import { HighlightSection } from "@/components/landing/HighlightSection";
import { OffChainSection } from "@/components/landing/OffChainSection";
import { PlatformSection } from "@/components/landing/PlatformSection";
import { ProductsSection } from "@/components/landing/ProductsSection";
import { TrustSection } from "@/components/landing/TrustSection";
import { getAgentData } from "@/lib/agent-data";
import { getPlatformData } from "@/lib/platform-data";
import { getProtocolIndex } from "@/lib/protocol-index";
import { getWebSources } from "@/lib/web-sources";

const SITE_URL = "https://agenteconomy.to";

export default async function Home() {
  const [data, platform, protocols, webSources] = await Promise.all([
    getAgentData(),
    getPlatformData(),
    getProtocolIndex(),
    getWebSources(),
  ]);

  const protocolItemList = {
    "@type": "ItemList",
    "@id": `${SITE_URL}/#protocols`,
    name: "Agent Economy protocol index",
    numberOfItems: protocols.rows.length,
    itemListElement: protocols.rows.map((protocol, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: `${SITE_URL}${protocol.href}`,
      name: protocol.name,
      description: protocol.desc,
    })),
  };

  const homepageJsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${SITE_URL}/#collection-page`,
        url: SITE_URL,
        name: "agent economy",
        description: "The data authority for the agent economy, covering tracked agent-payment and agent-infrastructure protocols.",
        isPartOf: { "@id": `${SITE_URL}/#website` },
        mainEntity: { "@id": `${SITE_URL}/#protocols` },
      },
      protocolItemList,
    ],
  };

  return (
    <>
      <HeaderSection />
      <HeroSection data={data} />
      <TrustSection />
      <ProductsSection data={protocols} />
      <OffChainSection data={webSources} />
      <HighlightSection data={data} />
      <PlatformSection data={platform} />
      <FooterSection />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(homepageJsonLd) }} />
    </>
  );
}
