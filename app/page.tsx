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

export default async function Home() {
  const [data, platform, protocols, webSources] = await Promise.all([
    getAgentData(),
    getPlatformData(),
    getProtocolIndex(),
    getWebSources(),
  ]);
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
    </>
  );
}
