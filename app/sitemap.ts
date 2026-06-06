import type { MetadataRoute } from "next";

import { PROTOCOL_SLUGS } from "@/lib/protocol-data";

const BASE = "https://agenteconomy.to";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = ["", "/methodology", "/data", "/about", ...PROTOCOL_SLUGS.map((s) => `/${s}`)];
  return paths.map((path) => ({
    url: `${BASE}${path}`,
    changeFrequency: "daily",
    priority: path === "" ? 1 : 0.7,
  }));
}
