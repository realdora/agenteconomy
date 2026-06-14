/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
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
