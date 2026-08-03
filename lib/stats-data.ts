// Shared data plumbing for the /stats answer pages. Both feeds fetched with
// hourly ISR — a stats page must never show a number older than the pipeline.

import { FALLBACK as WEB_FALLBACK, type WebSourcesData } from "./web-sources";
import { fetchFeed } from "./feed-fetch";

const DATA_URL = "https://agenteconomy.to/data.json";
const WEB_URL = "https://agenteconomy.to/web-sources.json";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type RawAgentData = any;

export type StatsContext = {
  data: RawAgentData | null;
  web: WebSourcesData;
};

export async function getStatsContext(): Promise<StatsContext> {
  const [data, web] = await Promise.all([
    fetchFeed(DATA_URL)
      .then((r) => (r.ok ? r.json() : null))
      .catch(() => null),
    fetchFeed(WEB_URL)
      .then((r) => (r.ok ? r.json() : WEB_FALLBACK))
      .catch(() => WEB_FALLBACK),
  ]);
  return { data, web };
}

export const fmt = (v: unknown): string => {
  const n = Number(v);
  return Number.isFinite(n) ? n.toLocaleString("en-US") : "—";
};

export const usd = (v: unknown): string => {
  const n = Number(v);
  return Number.isFinite(n) ? `$${n.toLocaleString("en-US")}` : "—";
};

export function asOfLabel(iso: string | null | undefined): string | null {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" });
}
