import { AnnouncementSection } from "@/components/landing/AnnouncementSection";
import { ContactSection } from "@/components/landing/ContactSection";
import { FooterSection } from "@/components/landing/FooterSection";
import { HeaderSection } from "@/components/landing/HeaderSection";
import { HeroSection } from "@/components/landing/HeroSection";
import { LogoCloudSection } from "@/components/landing/LogoCloudSection";
import { PlatformSection } from "@/components/landing/PlatformSection";
import { ProductsSection } from "@/components/landing/ProductsSection";
import { SolutionsSection } from "@/components/landing/SolutionsSection";
import { TestimonialsSection } from "@/components/landing/TestimonialsSection";
import { TrustSection } from "@/components/landing/TrustSection";

export default function Home() {
  return (
    <>
      <HeaderSection />
      {/* TODO: re-enable AnnouncementSection when there's something to announce */}
      {/* <AnnouncementSection /> */}
      <HeroSection />
      {/* Replaced TT LogoCloudSection — see <TrustSection /> below */}
      {/* <LogoCloudSection /> */}
      <TrustSection />
      <PlatformSection />
      <ProductsSection />
      {/* Replaced by TrustSection above; no real testimonials yet */}
      {/* <TestimonialsSection /> */}
      <SolutionsSection />
      <ContactSection />
      <FooterSection />
    </>
  );
}
