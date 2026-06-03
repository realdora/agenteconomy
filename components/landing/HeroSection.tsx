import { HeroCarousel } from "@/components/landing/hero/HeroCarousel";
import type { AgentData } from "@/lib/agent-data";

export function HeroSection({ data }: { data: AgentData }) {
  return <HeroCarousel data={data} />;
}
