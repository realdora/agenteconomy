import type { Metadata } from "next";

import { FooterSection } from "@/components/landing/FooterSection";
import { HeaderSection } from "@/components/landing/HeaderSection";
import { MockRoutePage } from "@/components/routes/MockRoutePage";
import { mockRoutes } from "@/lib/site-data";

type RoutePageProps = {
  params: Promise<{
    slug: string[];
  }>;
};

function titleFromPath(path: string) {
  return path
    .split("/")
    .filter(Boolean)
    .map((part) => part.replace(/-/g, " "))
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" / ");
}

function getRouteContent(path: string) {
  return (
    mockRoutes[path] ?? {
      title: titleFromPath(path),
      description: "A mocked route page used to prove navigation, routing, and layout structure.",
      metrics: ["Overview", "Data model", "Workflow"],
    }
  );
}

export async function generateMetadata({ params }: RoutePageProps): Promise<Metadata> {
  const { slug } = await params;
  const path = `/${slug.join("/")}`;
  const route = getRouteContent(path);

  return {
    title: `${route.title} | Token Terminal mock`,
    description: route.description,
  };
}

export function generateStaticParams() {
  return Object.keys(mockRoutes).map((path) => ({
    slug: path.split("/").filter(Boolean),
  }));
}

export default async function RoutePage({ params }: RoutePageProps) {
  const { slug } = await params;
  const path = `/${slug.join("/")}`;
  const route = getRouteContent(path);

  return (
    <>
      <HeaderSection />
      <MockRoutePage path={path} title={route.title} description={route.description} metrics={route.metrics} />
      <FooterSection />
    </>
  );
}
