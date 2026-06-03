// import { AnnouncementSection } from "@/components/landing/AnnouncementSection"; // re-enable when needed
import { FooterSection } from "@/components/landing/FooterSection";
import { HeaderSection } from "@/components/landing/HeaderSection";
import { HeroSection } from "@/components/landing/HeroSection";
import { HighlightSection } from "@/components/landing/HighlightSection";
import { PlatformSection } from "@/components/landing/PlatformSection";
import { TrustSection } from "@/components/landing/TrustSection";
import { getAgentData } from "@/lib/agent-data";

export default async function Home() {
  const data = await getAgentData();
  return (
    <>
      <HeaderSection />
      {/* <AnnouncementSection /> */}
      <HeroSection data={data} />
      <TrustSection />
      <HighlightSection />
      <PlatformSection />
      <FooterSection />
    </>
  );
}
