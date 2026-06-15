"use client";

// AgentNativeSection — the closing beat: the data.json terminal above shows humans the
// raw file; this shows machines the protocol. The site is agent-native — an MCP server,
// an OpenAPI contract, an agent index. The MCP endpoint is the hero; the response
// terminal cycles the 4 real tools and streams each tool's real-data reply.

import type { ReactNode } from "react";
import { useEffect, useState } from "react";

export type AgentExamples = {
  x402: { totalTxs: number; totalVolume: number; chains: number; updatedAt: string };
  offChain: { mcap: number; providers: number; downloads: number };
  freshness: { onchain: string; offchain: string };
};

const MCP_URL = "https://agenteconomy.to/api/mcp";
const TOOLS = ["get_protocol", "list_protocols", "get_off_chain", "get_data_freshness"] as const;
type Tool = (typeof TOOLS)[number];
const CALL: Record<Tool, string> = {
  get_protocol: 'get_protocol("x402")',
  list_protocols: "list_protocols()",
  get_off_chain: "get_off_chain()",
  get_data_freshness: "get_data_freshness()",
};

// JSON token helpers (same palette as the data.json terminal above)
const K = (c: ReactNode) => <span className="ae-an-k">{c}</span>;
const S = (c: ReactNode) => <span className="ae-an-s">{c}</span>;
const N = (c: ReactNode) => <span className="ae-an-n">{c}</span>;
const P = (c: ReactNode) => <span className="ae-an-p">{c}</span>;

function responseLines(tool: Tool, ex: AgentExamples): ReactNode[] {
  switch (tool) {
    case "get_protocol":
      return [
        P("{"),
        <>{"  "}{K('"slug"')}{P(": ")}{S('"x402"')}{P(",")}</>,
        <>{"  "}{K('"headlineUnit"')}{P(": { ")}{K('"field"')}{P(": ")}{S('"totalTxs"')}{P(", ")}{K('"unit"')}{P(": ")}{S('"transactions"')}{P(" },")}</>,
        <>{"  "}{K('"data"')}{P(": { ")}{K('"totalTxs"')}{P(": ")}{N(ex.x402.totalTxs)}{P(", ")}{K('"totalVolume"')}{P(": ")}{N(ex.x402.totalVolume)}{P(", ")}{K('"chains"')}{P(": ")}{N(ex.x402.chains)}{P(" },")}</>,
        <>{"  "}{K('"updatedAt"')}{P(": ")}{S(`"${ex.x402.updatedAt}"`)}</>,
        P("}"),
      ];
    case "list_protocols":
      return [
        P("{"),
        <>{"  "}{K('"protocols"')}{P(": [")}</>,
        <>{"    "}{P("{ ")}{K('"slug"')}{P(": ")}{S('"x402"')}{P(", ")}{K('"unit"')}{P(": ")}{S('"transactions"')}{P(" },")}</>,
        <>{"    "}{P("{ ")}{K('"slug"')}{P(": ")}{S('"olas"')}{P(", ")}{K('"unit"')}{P(": ")}{S('"transactions"')}{P(" },")}</>,
        P("    … 5 total ]"),
        P("}"),
      ];
    case "get_off_chain":
      return [
        P("{"),
        <>{"  "}{K('"market"')}{P(": { ")}{K('"agentTokenMcap"')}{P(": ")}{N(ex.offChain.mcap)}{P(", ")}{K('"unit"')}{P(": ")}{S('"usd"')}{P(" },")}</>,
        <>{"  "}{K('"supply"')}{P(": { ")}{K('"x402Providers"')}{P(": ")}{N(ex.offChain.providers)}{P(" },")}</>,
        <>{"  "}{K('"developers"')}{P(": { ")}{K('"weeklySdkDownloads"')}{P(": ")}{N(ex.offChain.downloads)}{P(" }")}</>,
        P("}"),
      ];
    case "get_data_freshness":
      return [
        P("{"),
        <>{"  "}{K('"data.json"')}{P(": ")}{S(`"${ex.freshness.onchain}"`)}{P(",")}</>,
        <>{"  "}{K('"web-sources.json"')}{P(": ")}{S(`"${ex.freshness.offchain}"`)}</>,
        P("}"),
      ];
  }
}

export function AgentNativeSection({ examples }: { examples: AgentExamples }) {
  const [tool, setTool] = useState<Tool>("get_protocol");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    let i = 0;
    const id = window.setInterval(() => {
      i = (i + 1) % TOOLS.length;
      setTool(TOOLS[i]);
    }, 3000);
    return () => window.clearInterval(id);
  }, []);

  const copy = () => {
    navigator.clipboard?.writeText(MCP_URL).catch(() => {});
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  };

  return (
    <section id="agents" className="py-16 md:py-24 lg:py-24 border-t border-white/10">
      <div className="w-[1240px] max-w-full mx-auto px-5">
        <h2 className="font-display italic text-white text-[26px] md:text-4xl leading-snug tracking-tight text-balance max-w-3xl mb-4">
          Point your agent at it.
        </h2>
        <p className="text-white/55 text-[15px] md:text-[16px] leading-relaxed max-w-2xl mb-10 md:mb-12">
          An MCP server, an OpenAPI contract, and an agent index. Key-less, read-only, CORS-open. Your agent connects in one line.
        </p>

        <div className="ae-an-grid">
          {/* connect card */}
          <div className="ae-an-card ae-an-connect">
            <div>
              <div className="ae-an-label">MCP endpoint</div>
              <div className="ae-an-endpoint">
                <span className="ae-an-url">{MCP_URL}</span>
                <button type="button" onClick={copy} className="ae-an-copy" aria-live="polite">
                  {copied ? "copied" : "copy"}
                </button>
              </div>
            </div>
            <div className="ae-an-meta">streamable HTTP, read-only, stateless, no auth</div>
            <div>
              <div className="ae-an-label" style={{ marginBottom: 10 }}>4 tools</div>
              <div className="ae-an-tools">
                {TOOLS.map((t) => (
                  <span key={t} className={`ae-an-tool${t === tool ? " is-active" : ""}`}>
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* response terminal */}
          <div className="ae-an-card">
            <div className="ae-an-rc-head">
              <span className="ae-an-dot" />
              <span>{`▸ ${CALL[tool]}`}</span>
            </div>
            <pre className="ae-an-json">
              <div key={tool} className="ae-an-lines">
                {responseLines(tool, examples).map((line, i) => (
                  <div key={i} className="ae-an-ln" style={{ animationDelay: `${0.06 + i * 0.07}s` }}>
                    {line}
                  </div>
                ))}
              </div>
            </pre>
          </div>
        </div>

        {/* the other machine-readable surfaces */}
        <div className="ae-an-surfaces">
          <span className="ae-an-also">Also machine-readable</span>
          <span className="ae-an-sf"><b>openapi.json</b><span className="ae-an-u">3.1 contract</span></span>
          <span className="ae-an-sf"><b>llms.txt</b><span className="ae-an-u">agent index</span></span>
          <span className="ae-an-sf"><b>JSON-LD</b><span className="ae-an-u">Dataset + WebAPI</span></span>
        </div>
      </div>
    </section>
  );
}
