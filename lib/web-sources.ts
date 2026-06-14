// The off-chain axis of the agent economy — six web-sourced lenses that sit
// alongside the on-chain protocol index: token market, service supply, agent
// supply, the Virtuals economy, developer adoption, and Masumi (Cardano).
// Server-fetched from agenteconomy.to/web-sources.json with hourly ISR and a
// baked-in fallback (real values captured from the 2026-06-10 snapshot).

const DATA_URL = "https://agenteconomy.to/web-sources.json";

export type TokenRow = {
  label: string;
  symbol: string;
  note: string;
  mcap: number;
  change24h: number;
};

export type TokenCategory = { name: string; mcap: number; vol24h: number };

export type DevComponent = { registry: string; pkg: string; weeklyAvg4w: number };

export type WebSourcesData = {
  updatedAt: string | null;
  agentTokens: {
    basketMcap: number;
    basketVol24h: number;
    basket: TokenRow[];
    categories: TokenCategory[];
  };
  x402Services: { uniqueProviders: number; totalListings: number; top2SharePct: number };
  agentSupply: { officialMcpServers: number; smitheryMcpServers: number };
  virtuals: {
    launchedAgents: number;
    acpRegisteredAgents: number;
    grossAgenticUsd: number;
    totalJobs: number;
    successfulJobs: number;
  };
  devAdoption: { totalWeeklyAvg4w: number; components: DevComponent[] };
  masumi: { totalTxs: number };
};

const round1 = (n: number) => Math.round(n * 10) / 10;

// Compact money: $1.2B / $156M / $4.3K. Used by the section for headline figures.
export function formatUsd(n: number): string {
  if (n >= 1e9) return `$${round1(n / 1e9)}B`;
  if (n >= 1e6) return `$${round1(n / 1e6)}M`;
  if (n >= 1e3) return `$${round1(n / 1e3)}K`;
  return `$${Math.round(n)}`;
}

// Compact count: 46.5K / 2.6M. No currency sign.
export function formatCount(n: number): string {
  if (n >= 1e6) return `${round1(n / 1e6)}M`;
  if (n >= 1e3) return `${round1(n / 1e3)}K`;
  return `${n}`;
}

// Real values from the 2026-06-10 web-sources.json snapshot.
export const FALLBACK: WebSourcesData = {
  updatedAt: "2026-06-10T16:26:51.327Z",
  agentTokens: {
    basketMcap: 1227429119,
    basketVol24h: 155691984,
    basket: [
      { label: "Fetch (ASI)", symbol: "FET", note: "agent infrastructure", mcap: 440618136, change24h: -2.29238 },
      { label: "Kite", symbol: "KITE", note: "x402 facilitator", mcap: 409096625, change24h: -5.95375 },
      { label: "Virtuals", symbol: "VIRTUAL", note: "ACP / agent commerce", mcap: 371531170, change24h: 0.70209 },
      { label: "Olas", symbol: "OLAS", note: "autonomous agents", mcap: 6183188, change24h: -0.20764 },
    ],
    categories: [
      { name: "AI Agents", mcap: 3029682012, vol24h: 376694931 },
      { name: "AI Agent Launchpad", mcap: 1193836371, vol24h: 197176073 },
    ],
  },
  x402Services: { uniqueProviders: 904, totalListings: 23868, top2SharePct: 78 },
  agentSupply: { officialMcpServers: 11644, smitheryMcpServers: 6035 },
  virtuals: {
    launchedAgents: 46540,
    acpRegisteredAgents: 42169,
    grossAgenticUsd: 429976414,
    totalJobs: 2574483,
    successfulJobs: 2383761,
  },
  devAdoption: {
    totalWeeklyAvg4w: 418549,
    components: [
      { registry: "npm", pkg: "x402", weeklyAvg4w: 241354 },
      { registry: "npm", pkg: "@x402/core", weeklyAvg4w: 96612 },
      { registry: "npm", pkg: "@coinbase/x402", weeklyAvg4w: 32289 },
      { registry: "pypi", pkg: "x402", weeklyAvg4w: 27443 },
      { registry: "pypi", pkg: "cdp-sdk", weeklyAvg4w: 12957 },
    ],
  },
  masumi: { totalTxs: 31044 },
};

export async function getWebSources(): Promise<WebSourcesData> {
  try {
    const res = await fetch(DATA_URL, { next: { revalidate: 3600 } });
    if (!res.ok) throw new Error(`web-sources.json responded ${res.status}`);
    const d = await res.json();
    const num = (v: unknown) => (typeof v === "number" ? v : 0);

    const at = d.agentTokens ?? {};
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const basket: TokenRow[] = Array.isArray(at.basket)
      ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
        at.basket.map((t: any) => ({
          label: String(t?.label ?? ""),
          symbol: String(t?.symbol ?? ""),
          note: String(t?.note ?? ""),
          mcap: num(t?.mcap),
          change24h: num(t?.change24h),
        }))
      : [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const categories: TokenCategory[] = Array.isArray(at.categories)
      ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
        at.categories.map((c: any) => ({ name: String(c?.name ?? ""), mcap: num(c?.mcap), vol24h: num(c?.vol24h) }))
      : [];

    const dev = d.devAdoption ?? {};
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const components: DevComponent[] = Array.isArray(dev.components)
      ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
        dev.components.map((c: any) => ({
          registry: String(c?.registry ?? ""),
          pkg: String(c?.pkg ?? ""),
          weeklyAvg4w: num(c?.weeklyAvg4w),
        }))
      : [];

    const vAgg = d.virtuals?.aggregates ?? {};

    const out: WebSourcesData = {
      updatedAt: typeof d.updatedAt === "string" ? d.updatedAt : null,
      agentTokens: {
        basketMcap: num(at.basketMcap),
        basketVol24h: num(at.basketVol24h),
        basket,
        categories,
      },
      x402Services: {
        uniqueProviders: num(d.x402Services?.uniqueProviders),
        totalListings: num(d.x402Services?.totalListings),
        top2SharePct: num(d.x402Services?.top2ListingSharePct),
      },
      agentSupply: {
        officialMcpServers: num(d.agentSupply?.officialMcpServers),
        smitheryMcpServers: num(d.agentSupply?.smitheryMcpServers),
      },
      virtuals: {
        launchedAgents: num(d.virtuals?.launchedAgents),
        acpRegisteredAgents: num(d.virtuals?.acpRegisteredAgents),
        grossAgenticUsd: num(vAgg.grossAgenticUsd),
        totalJobs: num(vAgg.totalJobs),
        successfulJobs: num(vAgg.successfulJobs),
      },
      devAdoption: { totalWeeklyAvg4w: num(dev.totalWeeklyAvg4w), components },
      masumi: { totalTxs: num(d.masumi?.totalTxs) },
    };

    // If the core headline numbers came back empty the schema moved under us —
    // fall back whole rather than render a section full of zeros.
    if (!out.agentTokens.basketMcap || !out.agentSupply.officialMcpServers || !out.virtuals.launchedAgents) {
      return FALLBACK;
    }
    return out;
  } catch {
    return FALLBACK;
  }
}
