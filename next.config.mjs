/** @type {import('next').NextConfig} */
const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()",
  },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  {
    // Enforced, not report-only. The report-only run flagged exactly one real
    // violation before this switch — GA4 loads a tracking pixel from
    // googletagmanager.com, which the old img-src did not list — so that origin
    // is added below. (The other report-only entry was the console notice that
    // 'upgrade-insecure-requests' is inert in report-only mode; enforcing is
    // what makes it take effect.)
    //
    // 'unsafe-inline' has to stay for now: the app ships ~30 inline scripts per
    // page (Next's hydration payload plus the JSON-LD blocks) and ~180 inline
    // style attributes, and nothing is nonce-tagged. Feed-derived strings that
    // reach a <script> go through safeJsonLd, so the inline surface is not
    // attacker-writable today; dropping 'unsafe-inline' needs nonce plumbing
    // through the layout and is a separate change.
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "base-uri 'self'",
      "object-src 'none'",
      "frame-ancestors 'self'",
      "form-action 'self'",
      "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob: https://www.googletagmanager.com https://www.google-analytics.com https://*.google-analytics.com",
      "font-src 'self'",
      "connect-src 'self' https://dashboard.agenteconomy.to https://www.googletagmanager.com https://www.google-analytics.com https://*.google-analytics.com https://*.analytics.google.com",
      "upgrade-insecure-requests",
    ].join("; "),
  },
];

const nextConfig = {
  reactStrictMode: true,
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
  // After the apex cutover (v4 becomes agenteconomy.to), keep the public data API
  // at apex (decision A) by proxying to the dashboard project, where the pipeline
  // keeps these files fresh. The advertised agenteconomy.to/data.json URL is
  // preserved and v4's own DATA_URL fetches keep resolving — no DATA_URL change.
  async rewrites() {
    return [
      { source: "/data.json", destination: "https://dashboard.agenteconomy.to/data.json" },
      { source: "/web-sources.json", destination: "https://dashboard.agenteconomy.to/web-sources.json" },
    ];
  },
};

export default nextConfig;
