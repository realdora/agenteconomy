import type { MetadataRoute } from "next";

import { PROTOCOL_SLUGS } from "@/lib/protocol-data";
import { getStatsContext } from "@/lib/stats-data";
import { availableStatDocs } from "@/lib/stats-registry";
import { fetchFeed } from "@/lib/feed-fetch";
import { getReportCatalog, reportMonths, latestEdition } from "@/lib/report-catalog";

const BASE = "https://agenteconomy.to";
const DATA_URL = `${BASE}/data.json`;

type AgentDataMetadata = {
  updatedAt?: string;
};

async function getLastModified() {
  try {
    const response = await fetchFeed(DATA_URL);
    if (!response.ok) return undefined;

    const data = (await response.json()) as AgentDataMetadata;
    const updatedAt = data.updatedAt ? new Date(data.updatedAt) : null;
    return updatedAt && !Number.isNaN(updatedAt.getTime()) ? updatedAt : undefined;
  } catch {
    return undefined;
  }
}

// When the hand-written copy on the static pages last changed. Bump on edit —
// stamping them with data.json's updatedAt told crawlers "changed today" every day,
// which erodes trust in the freshness signal.
const STATIC_CONTENT_UPDATED = new Date("2026-07-05T00:00:00Z");

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const dataUpdated = await getLastModified();

  // Gated stat pages are omitted until their feed is present (same guard the
  // route and hub use), so the sitemap never lists a URL that 404s.
  const ctx = await getStatsContext();
  const statSlugs = availableStatDocs(ctx).map((d) => d.slug);

  // Home + /data + protocol pages surface live dataset figures (hourly ISR), so
  // the data stamp is their true lastmod. /about + /methodology only change when
  // their copy is edited.
  const catalog = await getReportCatalog();
  const months = reportMonths(catalog);

  const liveRoutes: MetadataRoute.Sitemap = [
    "",
    "/data",
    "/stats",
    ...PROTOCOL_SLUGS.map((s) => `/${s}`),
    ...statSlugs.map((s) => `/stats/${s}`),
  ].map((path) => ({
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

  const reportRoutes: MetadataRoute.Sitemap = months.map(month => ({url: `${BASE}/reports/${month}`, lastModified: latestEdition(catalog, month)!.publishedAt}));
  reportRoutes.push({url:`${BASE}/reports`, lastModified: catalog.updatedAt});
  return [...liveRoutes, ...reportRoutes, ...staticRoutes];
}
