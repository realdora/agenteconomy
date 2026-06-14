export type NavPanelItem = {
  title: string;
  description: string;
  href: string;
  accent?: string;
  logo?: string; // path to an icon logo; falls back to a typographic mark when absent
  mark?: string; // monogram fallback (defaults to the first character of title)
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
        { title: "x402", description: "HTTP 402 payment standard for agents", href: "/x402", logo: "/logos/protocols/x402.png" },
        { title: "ERC-8004", description: "Trust layer for AI agents", href: "/erc-8004" },
        { title: "Virtuals ACP", description: "Agent Commerce Protocol", href: "/virtuals-acp", logo: "/logos/protocols/virtuals.png" },
        { title: "Olas", description: "Autonomous agent network", href: "/olas", logo: "/logos/protocols/olas.png" },
        { title: "Tempo MPP", description: "Machine Payments Protocol", href: "/tempo-mpp", logo: "/logos/protocols/tempo.svg" },
      ],
    },
  },
  { label: "Methodology", href: "/methodology" },
  { label: "Data", href: "/data" },
  { label: "About", href: "/about" },
];

// Single source of truth for "go to the dashboard" links. The dashboard (the
// live Vite data app) moves to this subdomain at cutover; until DNS resolves it
// 404s, which is expected. One flip here repoints every CTA.
export const DASHBOARD_URL = "https://dashboard.agenteconomy.to";

export const heroSlides: HeroSlide[] = [
  {
    id: "understand",
    word: "track",
    cta: "Open the dashboard",
    href: DASHBOARD_URL,
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
    cta: "Open the dashboard",
    href: DASHBOARD_URL,
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
    cta: "Open the dashboard",
    href: DASHBOARD_URL,
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
