import { FooterSection } from "@/components/landing/FooterSection";
import { HeaderSection } from "@/components/landing/HeaderSection";
import { HeroSection } from "@/components/landing/HeroSection";
import { HighlightSection } from "@/components/landing/HighlightSection";
import { PlatformSection } from "@/components/landing/PlatformSection";
import { TrustSection } from "@/components/landing/TrustSection";
import { getAgentData } from "@/lib/agent-data";
import { getPlatformData } from "@/lib/platform-data";

export default async function Home() {
  const [data, platform] = await Promise.all([getAgentData(), getPlatformData()]);
  return (
    <>
      <HeaderSection />
      <HeroSection data={data} />
      <TrustSection />
      <HighlightSection data={data} />
      <PlatformSection data={platform} />
      <FooterSection />
    </>
  );
}
