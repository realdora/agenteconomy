import type { MetadataRoute } from "next";

const ALLOWED_BOTS = [
  "GPTBot",
  "ClaudeBot",
  "PerplexityBot",
  "Google-Extended",
  "anthropic-ai",
  "CCBot",
  "ChatGPT-User",
  "Bingbot",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/" },
      ...ALLOWED_BOTS.map((userAgent) => ({ userAgent, allow: "/" })),
    ],
    sitemap: "https://agenteconomy.to/sitemap.xml",
  };
}
