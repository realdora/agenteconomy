export type NavPanelItem = {
  title: string;
  description: string;
  href: string;
  accent?: string;
};

export type NavPanel = {
  title: string;
  subtitle: string;
  items: NavPanelItem[];
};

export type NavMenu = {
  label: string;
  href?: string;
  panel?: NavPanel;
};

export type HeroMetric = {
  label: string;
  values: string[];
};

export type HeroSlide = {
  id: string;
  word: string;
  cta: string;
  href: string;
  palette: {
    base: string;
    glow: string;
  };
  images: {
    primary: string;
    secondary: string;
    strip: string;
  };
  // Panel design is self-contained per kind in HeroPanels.tsx (real data.json values hardcoded).
  panel: { kind: "track" } | { kind: "price" } | { kind: "cite" };
};

export const navMenus: NavMenu[] = [
  {
    label: "Protocols",
    panel: {
      title: "Protocols",
      subtitle: "The 5 standards powering on-chain agent payments.",
      items: [
        { title: "x402", description: "HTTP 402 payment standard for agents", href: "/x402", accent: "from-emerald-400/30" },
        { title: "ERC-8004", description: "Ethereum agent-to-agent transactions", href: "/erc-8004", accent: "from-sky-400/25" },
        { title: "Virtuals ACP", description: "Agent Commerce Protocol", href: "/virtuals-acp", accent: "from-violet-400/25" },
        { title: "Olas", description: "Autonomous agent network", href: "/olas", accent: "from-amber-400/25" },
        { title: "Tempo MPP", description: "Multi-Party Payment Protocol", href: "/tempo-mpp", accent: "from-cyan-400/25" },
      ],
    },
  },
  { label: "Methodology", href: "/methodology" },
  { label: "Data", href: "/data" },
  { label: "About", href: "/about" },
];

export const heroSlides: HeroSlide[] = [
  {
    id: "understand",
    word: "track",
    cta: "Open agenteconomy.to",
    href: "https://agenteconomy.to",
    palette: {
      base: "#0a2e22",
      glow: "rgba(0, 255, 136, 0.16)",
    },
    images: {
      primary: "/images/hero-illustration-bank.webp",
      secondary: "/images/hero-illustration-construction.webp",
      strip: "/images/hero-illustration-bank.webp",
    },
    panel: { kind: "track" },
  },
  {
    id: "explore",
    word: "price",
    cta: "Open agenteconomy.to",
    href: "https://agenteconomy.to",
    palette: {
      base: "#2b2110",
      glow: "rgba(245, 166, 35, 0.15)",
    },
    images: {
      primary: "/images/hero-illustration-mountains.webp",
      secondary: "/images/hero-illustration-warehouse.webp",
      strip: "/images/hero-illustration-mountains.webp",
    },
    panel: { kind: "price" },
  },
  {
    id: "trust",
    word: "cite",
    cta: "Open agenteconomy.to",
    href: "https://agenteconomy.to",
    palette: {
      base: "#221a40",
      glow: "rgba(158, 123, 255, 0.16)",
    },
    images: {
      primary: "/images/hero-illustration-warehouse.webp",
      secondary: "/images/hero-illustration-construction.webp",
      strip: "/images/hero-illustration-warehouse.webp",
    },
    panel: { kind: "cite" },
  },
];

export const mockRoutes: Record<string, { title: string; description: string; metrics: string[] }> = {
  "/products/explorer": {
    title: "Explorer",
    description: "A mock route for browsing standardized protocol and chain fundamentals.",
    metrics: ["1,200+ applications", "100+ chains", "Daily updates"],
  },
  "/products/studio": {
    title: "Studio",
    description: "A mock route for building saved analysis views and investor workflows.",
    metrics: ["Custom dashboards", "Watchlists", "Shared workspaces"],
  },
  "/products/mcp": {
    title: "MCP",
    description: "A mock route for connecting AI agents to Token Terminal-style data.",
    metrics: ["Tool calls", "Context packs", "Auditable outputs"],
  },
  "/products/sheets": {
    title: "Sheets",
    description: "A mock route for analysts pulling fundamentals into spreadsheet models.",
    metrics: ["Formula imports", "Refresh controls", "Templates"],
  },
  "/pricing": {
    title: "Pricing",
    description: "Mock pricing tiers for teams, funds, and protocol operators.",
    metrics: ["Starter", "Professional", "Enterprise"],
  },
  "/resources": {
    title: "Resources",
    description: "Mock research notes, engineering posts, and market explainers.",
    metrics: ["Research", "Engineering", "Newsletter"],
  },
  "/about": {
    title: "About",
    description: "Mock company page for the structured routing layer.",
    metrics: ["Mission", "Customers", "Careers"],
  },
  "/explorer": {
    title: "Explorer",
    description: "Mock explorer entry point for navigating market fundamentals.",
    metrics: ["Chains", "Assets", "Applications"],
  },
  "/explorer/listings/apps": {
    title: "Get Listed: Apps",
    description: "Mock application listing workflow for protocol operators.",
    metrics: ["Schema review", "Metric mapping", "Launch QA"],
  },
  "/explorer/listings/chains": {
    title: "Get Listed: Chains",
    description: "Mock chain listing workflow for ecosystem teams.",
    metrics: ["Indexer setup", "Coverage audit", "Public launch"],
  },
};
