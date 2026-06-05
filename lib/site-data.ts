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
      primary: "/images/hero-track.jpg",
      secondary: "/images/hero-track.jpg",
      strip: "/images/hero-track.jpg",
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
      primary: "/images/hero-price.jpg",
      secondary: "/images/hero-price.jpg",
      strip: "/images/hero-price.jpg",
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
      primary: "/images/hero-cite.jpg",
      secondary: "/images/hero-cite.jpg",
      strip: "/images/hero-cite.jpg",
    },
    panel: { kind: "cite" },
  },
];

// Real nav destinations. Each renders an on-brand placeholder for now (RoutePlaceholder);
// real content gets built out page by page. Paths match the nav hrefs in navMenus.
// NOTE: routes with a dedicated page (e.g. app/methodology/page.tsx) are intentionally
// omitted here so the catch-all doesn't shadow them. Remaining entries render the placeholder.
export const siteRoutes: Record<string, { title: string; description: string }> = {
  "/about": {
    title: "About",
    description: "agent economy is the data authority for on-chain agentic payments.",
  },
  "/x402": {
    title: "x402",
    description: "The HTTP 402 payment standard for autonomous agents.",
  },
  "/erc-8004": {
    title: "ERC-8004",
    description: "Ethereum agent-to-agent transactions.",
  },
  "/virtuals-acp": {
    title: "Virtuals ACP",
    description: "The Agent Commerce Protocol.",
  },
  "/olas": {
    title: "Olas",
    description: "Autonomous agent network.",
  },
  "/tempo-mpp": {
    title: "Tempo MPP",
    description: "Multi-Party Payment Protocol.",
  },
};
