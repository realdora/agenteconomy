"use client";

// PlatformSection — JSON stream (terminal-style) live demo of the data.json schema
// Animation: new event entries fade in at the top, block tip ticks up every ~2 seconds

import { useEffect, useState } from "react";

type Event = {
  protocol: string;
  chain: string;
  block: number;
  txHash: string;
  agent: string;
  amountUsd: number;
};

const PROTOCOLS = ["x402", "erc8004", "virtuals_acp", "olas", "tempo_mpp"] as const;
const CHAINS = ["base", "arbitrum", "ethereum", "optimism", "polygon"] as const;
const AGENTS = ["claude-sonnet", "gpt-5-mini", "deepseek-r1", "perplexity-bot", "browserless"] as const;

function rand<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}
function randHash() {
  return "0x" + Array.from({ length: 8 }, () => Math.floor(Math.random() * 16).toString(16)).join("") + "…";
}
function randEvent(seedBlock: number): Event {
  return {
    protocol: rand(PROTOCOLS),
    chain: rand(CHAINS),
    block: seedBlock + Math.floor(Math.random() * 3),
    txHash: randHash(),
    agent: rand(AGENTS),
    amountUsd: Math.round(Math.random() * 1200 * 100) / 100,
  };
}

const INITIAL: Event[] = [
  { protocol: "x402", chain: "base", block: 23455201, txHash: "0x9af3b2c1…", agent: "claude-sonnet", amountUsd: 0.42 },
  { protocol: "erc8004", chain: "ethereum", block: 23455198, txHash: "0x4d2e8a91…", agent: "gpt-5-mini", amountUsd: 18.5 },
  { protocol: "virtuals_acp", chain: "base", block: 23455197, txHash: "0xb71c0f44…", agent: "perplexity-bot", amountUsd: 320.0 },
];

export function PlatformSection() {
  const [events, setEvents] = useState<Event[]>(INITIAL);
  const [block, setBlock] = useState(23455201);

  useEffect(() => {
    const id = setInterval(() => {
      const next = block + Math.floor(Math.random() * 3) + 1;
      setBlock(next);
      setEvents((prev) => [randEvent(next), ...prev].slice(0, 6));
    }, 2200);
    return () => clearInterval(id);
  }, [block]);

  return (
    <section className="py-16 md:py-24 lg:py-32">
      <div className="w-[1240px] max-w-full mx-auto px-5">
        <div className="flex flex-col gap-12 md:gap-16">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div className="flex flex-col gap-4 max-w-3xl">
              <h2 className="font-medium text-fg-default tracking-tighter text-3xl md:text-4xl lg:text-5xl">
                What you get, as JSON
              </h2>
              <p className="text-fg-secondary text-base text-balance leading-relaxed">
                Schema-stable, MCP-native, version-pinned. Every event carries its transaction hash. Below is a
                sample of the agenteconomy.to/data.json stream — new entries are appearing in real time as blocks
                land.
              </p>
            </div>
            <a
              href="https://agenteconomy.to/data.json"
              className="text-fg-secondary hidden md:inline-flex items-center gap-3 px-5 py-3 rounded-lg text-sm font-medium border border-transparent hover:bg-white/5 transition"
            >
              See the schema
              <svg width="14" height="14" viewBox="0 0 256 256" fill="currentColor">
                <path d="M221.66,133.66l-72,72a8,8,0,0,1-11.32-11.32L196.69,136H40a8,8,0,0,1,0-16H196.69L138.34,61.66a8,8,0,0,1,11.32-11.32l72,72A8,8,0,0,1,221.66,133.66Z" />
              </svg>
            </a>
          </div>

          <div className="w-full rounded-2xl border border-white/10 bg-[#0a0a0e] overflow-hidden">
            <div className="flex items-center gap-2 px-5 py-3 border-b border-white/10">
              <span className="w-2.5 h-2.5 rounded-full bg-white/15" />
              <span className="w-2.5 h-2.5 rounded-full bg-white/15" />
              <span className="w-2.5 h-2.5 rounded-full bg-white/15" />
              <span className="tt-term-label ml-3 font-mono uppercase text-white/40">
                agenteconomy.to/data.json<span className="tt-term-stream"> — streaming</span>
              </span>
              <span className="tt-term-block ml-auto flex items-center gap-2 font-mono text-white/40 whitespace-nowrap">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00FF88] animate-pulse" />
                block {block.toLocaleString()}
              </span>
            </div>

            <pre className="tt-term-pre font-mono leading-[1.7] text-white/85 px-4 py-5 md:px-6 md:py-6 overflow-x-auto">
{`{
  "schema": "agenteconomy/v1",
  "block_tip": ${block},
  "events": [`}
{events.map((e, i) => (
  <span
    key={`${e.block}-${e.txHash}-${i}`}
    className={i === 0 ? "block animate-[fadeInRow_0.6s_ease-out]" : "block"}
  >
{`    {`}{"\n"}
{`      "protocol":   `}<span className="text-[#00FF88]">{`"${e.protocol}"`}</span>{`,`}{"\n"}
{`      "chain":      `}<span className="text-[#7ad7ff]">{`"${e.chain}"`}</span>{`,`}{"\n"}
{`      "block":      `}<span className="text-white">{e.block}</span>{`,`}{"\n"}
{`      "tx_hash":    `}<span className="text-white/60">{`"${e.txHash}"`}</span>{`,`}{"\n"}
{`      "agent":      `}<span className="text-[#ffb86c]">{`"${e.agent}"`}</span>{`,`}{"\n"}
{`      "amount_usd": `}<span className="text-white">{e.amountUsd.toFixed(2)}</span>{"\n"}
{`    }`}{i < events.length - 1 ? "," : ""}{"\n"}
  </span>
))}
{`  ]
}`}
            </pre>
            <style>{`@keyframes fadeInRow { 0% { background: rgba(0,255,136,0.10); opacity: 0; } 60% { opacity: 1; } 100% { background: transparent; opacity: 1; } }`}</style>
          </div>
        </div>
      </div>
    </section>
  );
}
