import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { FooterSection } from "@/components/landing/FooterSection";
import { HeaderSection } from "@/components/landing/HeaderSection";
import { RoutePlaceholder } from "@/components/routes/RoutePlaceholder";
import { siteRoutes } from "@/lib/site-data";

type RoutePageProps = {
  params: Promise<{ slug: string[] }>;
};

// Only the known nav routes exist; anything else 404s.
export const dynamicParams = false;

export async function generateMetadata({ params }: RoutePageProps): Promise<Metadata> {
  const { slug } = await params;
  const route = siteRoutes[`/${slug.join("/")}`];
  if (!route) return {};
  return {
    title: `${route.title} | agent economy`,
    description: route.description,
  };
}

export function generateStaticParams() {
  return Object.keys(siteRoutes).map((path) => ({
    slug: path.split("/").filter(Boolean),
  }));
}

export default async function RoutePage({ params }: RoutePageProps) {
  const { slug } = await params;
  const path = `/${slug.join("/")}`;
  const route = siteRoutes[path];
  if (!route) notFound();

  return (
    <>
      <HeaderSection />
      <RoutePlaceholder path={path} title={route.title} description={route.description} />
      <FooterSection />
    </>
  );
}
