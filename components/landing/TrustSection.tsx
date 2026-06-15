type Brand = {
  name: string;
  src: string;
  label?: string; // display name beside the mark; defaults to `name`
  height?: number; // optical icon height in px, defaults to 20
  keepMono?: boolean; // dark raster marks: stay a white silhouette on hover (no color reveal)
};

// Each brand is a mark + name lockup. Heights tuned per glyph so marks read at a
// consistent OPTICAL size next to the 15px name (tight glyphs bigger, bold/wide smaller).
const STANDARDS: Brand[] = [
  { name: "Coinbase", src: "/logos/wall/coinbase.svg", height: 26 },
  { name: "Ethereum Foundation", src: "/logos/wall/ethereum.svg", label: "Ethereum", height: 28 },
  { name: "Stripe", src: "/logos/wall/stripe.svg", height: 26 },
  { name: "Tempo", src: "/logos/wall/tempo.svg", height: 26 },
  { name: "Virtuals", src: "/logos/wall/virtuals.png", height: 27 },
  { name: "Olas", src: "/logos/wall/olas.png", height: 26, keepMono: true },
];

const X402_PARTNERS: Brand[] = [
  { name: "Google", src: "/logos/wall/google.svg", height: 26 },
  { name: "Visa", src: "/logos/wall/visa.svg", height: 20 },
  { name: "AWS", src: "/logos/wall/aws.svg", height: 24 },
  { name: "Circle", src: "/logos/wall/circle.svg", height: 27 },
  { name: "Anthropic", src: "/logos/wall/anthropic.svg", height: 25 },
  { name: "Vercel", src: "/logos/wall/vercel.svg", height: 24 },
  { name: "Cloudflare", src: "/logos/wall/cloudflare.svg", height: 25 },
];

const ONCHAIN_SOURCES: Brand[] = [
  { name: "Dune", src: "/logos/wall/dune.svg", height: 28 },
  { name: "Base", src: "/logos/wall/base.svg", height: 25 },
  { name: "Arbitrum", src: "/logos/wall/arbitrum.svg", height: 27 },
  { name: "MetaMask", src: "/logos/wall/metamask.svg", height: 26 },
  { name: "Tempo", src: "/logos/wall/tempo.svg", height: 26 },
];

const OFFCHAIN_SOURCES: Brand[] = [
  { name: "CoinGecko", src: "/logos/wall/coingecko.png", height: 27 },
  { name: "x402 Bazaar", src: "/logos/wall/x402.png", height: 25 },
  { name: "npm", src: "/logos/wall/npm.svg", height: 22 },
  { name: "PyPI", src: "/logos/wall/pypi.svg", height: 26 },
  { name: "Virtuals API", src: "/logos/wall/virtuals.png", height: 27 },
];

function BrandLockup({ brand }: { brand: Brand }) {
  // Mark + name. Rest: white-silhouette mark + muted name (neutral citation).
  // Hover (on the whole lockup): mark shows real brand color, name brightens.
  return (
    <span className="ae-wall-item group inline-flex items-center gap-2.5">
      <img
        className={`ae-wall-logo${brand.keepMono ? " ae-wall-logo--mono" : ""}`}
        src={brand.src}
        alt=""
        aria-hidden="true"
        style={{ height: brand.height ?? 20, width: "auto" }}
        loading="lazy"
      />
      <span className="ae-wall-name font-sans font-medium text-[18px] tracking-tight whitespace-nowrap">
        {brand.label ?? brand.name}
      </span>
    </span>
  );
}

function BrandRow({ label, brands }: { label: string; brands: Brand[] }) {
  return (
    <div className="ae-trust-row py-8 border-b border-white/10 last:border-b-0">
      <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-white/45">{label}</div>
      <div className="flex flex-wrap items-center gap-x-9 gap-y-6">
        {brands.map((brand) => (
          <BrandLockup key={`${label}-${brand.name}`} brand={brand} />
        ))}
      </div>
    </div>
  );
}

export function TrustSection() {
  return (
    <section className="py-16 md:py-24 lg:py-24">
      <div className="w-[1240px] max-w-full mx-auto px-5">
        <p className="font-display italic text-[22px] md:text-[28px] leading-snug text-white max-w-3xl text-balance mb-14 md:mb-20">
          Standards, partners, and data sources behind on-chain and off-chain agent payments.
        </p>
        <div className="border-t border-white/10">
          <BrandRow label="STANDARDS BY" brands={STANDARDS} />
          <BrandRow label="X402 PARTNERS" brands={X402_PARTNERS} />
          <BrandRow label="ON-CHAIN SOURCES" brands={ONCHAIN_SOURCES} />
          <BrandRow label="OFF-CHAIN SOURCES" brands={OFFCHAIN_SOURCES} />
        </div>
      </div>
    </section>
  );
}
