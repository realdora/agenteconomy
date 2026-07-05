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

// When the hand-written copy on the static pages last changed. Bump on edit —
// stamping them with data.json's updatedAt told crawlers "changed today" every day,
// which erodes trust in the freshness signal.
const STATIC_CONTENT_UPDATED = new Date("2026-07-05T00:00:00Z");

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const dataUpdated = await getLastModified();

  // Home + /data + protocol pages surface live dataset figures (hourly ISR), so
  // the data stamp is their true lastmod. /about + /methodology only change when
  // their copy is edited.
  const liveRoutes: MetadataRoute.Sitemap = ["", "/data", ...PROTOCOL_SLUGS.map((s) => `/${s}`)].map((path) => ({
    url: `${BASE}${path}`,
    lastModified: dataUpdated,
    changeFrequency: "daily",
    priority: path === "" ? 1 : path === "/data" ? 0.6 : 0.8,
  }));

  const staticRoutes: MetadataRoute.Sitemap = ["/methodology", "/about"].map((path) => ({
    url: `${BASE}${path}`,
    lastModified: STATIC_CONTENT_UPDATED,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...liveRoutes, ...staticRoutes];
}
