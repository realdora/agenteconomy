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
  { name: "DUNE", style: "sans-spaced", prefix: "◆" },
  { name: "Base", style: "sans-medium" },
  { name: "Arbitrum", style: "sans-medium" },
  { name: "METAMASK", style: "sans-spaced" },
  { name: "TEMPO RPC", style: "sans-spaced" },
];

function brandClass(style: BrandStyle): string {
  switch (style) {
    case "sans-bold":
      return "font-sans font-bold text-[22px] tracking-tight text-stone-900";
    case "sans-medium":
      return "font-sans font-medium text-[22px] tracking-tight text-stone-800";
    case "sans-spaced":
      return "font-sans font-medium text-[15px] uppercase tracking-[0.18em] text-stone-700";
    case "sans-lower":
      return "font-sans font-medium text-[22px] lowercase tracking-tight text-stone-800";
    case "serif-italic":
      return "font-display italic font-normal text-[24px] text-stone-800";
    case "serif-italic-bold":
      return "font-display italic font-bold text-[24px] text-stone-900";
    case "serif-regular":
      return "font-display text-[22px] text-stone-800";
  }
}

function BrandWordmark({ brand }: { brand: Brand }) {
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
    <div className="grid grid-cols-[180px_1fr] items-center gap-6 py-7 border-b border-stone-400/30 last:border-b-0">
      <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-stone-500">{label}</div>
      <div className="flex flex-wrap items-baseline gap-x-0">
        {brands.map((brand, i) => (
          <span key={brand.name} className="inline-flex items-baseline">
            {i > 0 ? <span className="text-stone-300 mx-7 text-[18px] font-light select-none">|</span> : null}
            <BrandWordmark brand={brand} />
          </span>
        ))}
      </div>
    </div>
  );
}

export function TrustSection() {
  return (
    <section className="bg-[#ece6d8] py-20 md:py-28 lg:py-32">
      <div className="w-[1240px] max-w-full mx-auto px-5">
        <div className="grid grid-cols-1 md:grid-cols-[260px_1fr] gap-8 md:gap-16 mb-14 md:mb-20">
          <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-stone-500 leading-[1.8]">
            //&nbsp;&nbsp;TRUST&nbsp;·&nbsp;SOURCES
            <br />
            ·&nbsp;STANDARDS
          </div>
          <p className="font-display italic text-[22px] md:text-[28px] leading-snug text-stone-900 max-w-3xl text-balance">
            Every number traces back to a public smart contract. The protocols we track are co-authored by:
          </p>
        </div>
        <div className="border-t border-stone-400/30">
          <BrandRow label="STANDARDS BY" brands={STANDARDS} />
          <BrandRow label="X402 PARTNERS" brands={X402_PARTNERS} />
          <BrandRow label="DATA SOURCED FROM" brands={DATA_SOURCES} />
        </div>
      </div>
    </section>
  );
}
