import type { ReactNode } from "react";

type BrandStyle =
  | "sans-bold"
  | "sans-medium"
  | "sans-spaced"
  | "sans-lower"
  | "serif-italic"
  | "serif-italic-bold"
  | "serif-regular";

type Brand = {
  name: string;
  style: BrandStyle;
  prefix?: string;
  logo?: string; // path to logo file
  logoHeight?: number; // px, defaults to 26
  showLabel?: boolean; // when true and logo set, render logo as mark + name text after
  logoFilter?: string; // CSS filter override. If undefined, applies default white-silhouette. Pass "none" to preserve original color.
};

const STANDARDS: Brand[] = [
  { name: "Coinbase", style: "sans-bold" },
  { name: "ETHEREUM FOUNDATION", style: "sans-spaced" },
  { name: "Stripe", style: "serif-italic-bold" },
  { name: "TEMPO", style: "sans-spaced" },
  { name: "Virtuals", style: "serif-italic" },
  { name: "OLAS", style: "sans-spaced" },
];

const X402_PARTNERS: Brand[] = [
  { name: "Google", style: "sans-medium" },
  { name: "VISA", style: "serif-italic-bold" },
  { name: "aws", style: "sans-lower" },
  { name: "Circle", style: "sans-medium" },
  { name: "Anthropic", style: "sans-medium" },
  { name: "Vercel", style: "sans-medium", prefix: "▲" },
  { name: "Cloudflare", style: "sans-medium" },
];

const DATA_SOURCES: Brand[] = [
  { name: "Dune", style: "sans-medium", prefix: "◆" },
  {
    name: "base",
    style: "sans-medium",
    logo: "/logos/datasources/base.svg",
    logoHeight: 24,
    showLabel: true,
    logoFilter: "none",
  },
  {
    name: "Arbitrum",
    style: "sans-medium",
    logo: "/logos/datasources/arbitrum.svg",
    logoHeight: 24,
    showLabel: true,
    logoFilter: "none",
  },
  {
    name: "MetaMask",
    style: "sans-medium",
    logo: "/logos/datasources/metamask.svg",
    logoHeight: 24,
    showLabel: true,
    logoFilter: "none",
  },
  {
    name: "Tempo",
    style: "sans-medium",
    logo: "/logos/datasources/tempo.svg",
    logoHeight: 24,
    showLabel: true,
  },
];

function brandClass(style: BrandStyle): string {
  switch (style) {
    case "sans-bold":
      return "font-sans font-bold text-[22px] tracking-tight text-white";
    case "sans-medium":
      return "font-sans font-medium text-[22px] tracking-tight text-white/90";
    case "sans-spaced":
      return "font-sans font-medium text-[15px] uppercase tracking-[0.18em] text-white/80";
    case "sans-lower":
      return "font-sans font-medium text-[22px] lowercase tracking-tight text-white/90";
    case "serif-italic":
      return "font-display italic font-normal text-[24px] text-white/90";
    case "serif-italic-bold":
      return "font-display italic font-bold text-[24px] text-white";
    case "serif-regular":
      return "font-display text-[22px] text-white/90";
  }
}

function BrandWordmark({ brand }: { brand: Brand }) {
  if (brand.logo) {
    const filter =
      brand.logoFilter !== undefined
        ? brand.logoFilter === "none"
          ? undefined
          : brand.logoFilter
        : "brightness(0) invert(1) opacity(0.85)";
    const imgStyle = {
      height: brand.logoHeight ?? 26,
      width: "auto" as const,
      ...(filter ? { filter } : {}),
    };
    if (brand.showLabel) {
      return (
        <span className={`inline-flex items-center gap-2 ${brandClass(brand.style)}`} aria-label={brand.name}>
          <img src={brand.logo} alt="" style={imgStyle} />
          {brand.name}
        </span>
      );
    }
    return (
      <span className="inline-flex items-center" aria-label={brand.name}>
        <img src={brand.logo} alt={brand.name} style={imgStyle} />
      </span>
    );
  }
  return (
    <span className={`inline-flex items-baseline gap-2 ${brandClass(brand.style)}`}>
      {brand.prefix ? (
        <span className="font-sans text-[16px] leading-none translate-y-[-1px]">{brand.prefix}</span>
      ) : null}
      {brand.name}
    </span>
  );
}

function BrandRow({ label, brands }: { label: string; brands: Brand[] }) {
  return (
    <div className="ae-trust-row py-7 border-b border-white/10 last:border-b-0">
      <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-white/45">{label}</div>
      <div className="flex flex-wrap items-baseline gap-x-0">
        {brands.map((brand, i) => (
          <span key={brand.name} className="inline-flex items-baseline">
            {i > 0 ? <span className="ae-trust-sep text-white/15 text-[18px] font-light select-none">|</span> : null}
            <BrandWordmark brand={brand} />
          </span>
        ))}
      </div>
    </div>
  );
}

export function TrustSection() {
  return (
    <section className="py-20 md:py-28 lg:py-32">
      <div className="w-[1240px] max-w-full mx-auto px-5">
        <p className="font-display italic text-[22px] md:text-[28px] leading-snug text-white max-w-3xl text-balance mb-14 md:mb-20">
          Standards, partners, and data sources behind on-chain agent payments.
        </p>
        <div className="border-t border-white/10">
          <BrandRow label="STANDARDS BY" brands={STANDARDS} />
          <BrandRow label="X402 PARTNERS" brands={X402_PARTNERS} />
          <BrandRow label="DATA SOURCED FROM" brands={DATA_SOURCES} />
        </div>
      </div>
    </section>
  );
}
