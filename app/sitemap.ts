import type { MetadataRoute } from "next";

import { PROTOCOL_SLUGS } from "@/lib/protocol-data";

const BASE = "https://agenteconomy.to";
const DATA_URL = `${BASE}/data.json`;

type AgentDataMetadata = {
  updatedAt?: string;
};

async function getLastModified() {
  try {
    const response = await fetch(DATA_URL, { next: { revalidate: 3600 } });
    if (!response.ok) return new Date();

    const data = (await response.json()) as AgentDataMetadata;
    const updatedAt = data.updatedAt ? new Date(data.updatedAt) : null;
    return updatedAt && !Number.isNaN(updatedAt.getTime()) ? updatedAt : new Date();
  } catch {
    return new Date();
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const lastModified = await getLastModified();
  const paths = ["", "/methodology", "/data", "/about", ...PROTOCOL_SLUGS.map((s) => `/${s}`)];
  return paths.map((path) => ({
    url: `${BASE}${path}`,
    lastModified,
    changeFrequency: "daily",
    priority: path === "" ? 1 : PROTOCOL_SLUGS.some((slug) => path === `/${slug}`) ? 0.8 : 0.6,
  }));
}
