"use client";

// PlatformSection — the real agenteconomy.to/data.json. Running totals reveal line by
// line up top (valid JSON, real integers); a live daily-activity ticker scrolls along
// the bottom (real daily aggregates). No fabricated event stream / tx hashes.

import type { PlatformData } from "@/lib/platform-data";

import { JsonDoc, LivePulse, TerminalFrame, formatUpdated, protoColor, useInViewReplay } from "./PlatformTerminal";

export function PlatformSection({ data }: { data: PlatformData }) {
  const { ref, playKey } = useInViewReplay<HTMLDivElement>();
  const updated = data.updatedAt ? formatUpdated(data.updatedAt) : "";
  const ticker = data.feed.slice(0, 12);
  const loop = [...ticker, ...ticker]; // doubled for a seamless loop

  return (
    <section className="py-16 md:py-24 lg:py-32">
      <div className="w-[1240px] max-w-full mx-auto px-5">
        <div className="flex flex-col gap-12 md:gap-16">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div className="flex flex-col gap-4 max-w-3xl">
              <h2 className="font-medium text-fg-default tracking-tighter text-3xl md:text-4xl lg:text-5xl">
                Everything we track, in one file.
              </h2>
              <p className="text-fg-secondary text-base text-balance leading-relaxed">
                The real <span className="font-mono text-white/80">agenteconomy.to/data.json</span> — running totals up
                top, the last few days of on-chain activity scrolling below. All of it built from public data, all of it
                yours to pull.
              </p>
            </div>
            <a
              href="https://agenteconomy.to/data.json"
              className="text-fg-secondary hidden md:inline-flex items-center gap-3 px-5 py-3 rounded-lg text-sm font-medium border border-transparent hover:bg-white/5 transition"
            >
              Open the file
              <svg width="14" height="14" viewBox="0 0 256 256" fill="currentColor">
                <path d="M221.66,133.66l-72,72a8,8,0,0,1-11.32-11.32L196.69,136H40a8,8,0,0,1,0-16H196.69L138.34,61.66a8,8,0,0,1,11.32-11.32l72,72A8,8,0,0,1,221.66,133.66Z" />
              </svg>
            </a>
          </div>

          <div ref={ref}>
            <TerminalFrame
              label="agenteconomy.to/data.json"
              right={<LivePulse>{updated ? `live · updated ${updated}` : "live"}</LivePulse>}
            >
              <JsonDoc key={playKey} snapshot={data.snapshot} compact />

              {/* live daily-activity ticker */}
              <div className="border-t border-white/10 bg-white/[0.015]">
                <div className="flex items-center gap-3 px-5 py-3 overflow-hidden">
                  <span className="ae-term-block font-mono uppercase tracking-[0.14em] text-white/30 shrink-0 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00FF88] animate-pulse" />
                    daily
                  </span>
                  <div className="relative flex-1 overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_6%,#000_94%,transparent)]">
                    <div className="flex w-max gap-7" style={{ animation: "pv-marquee 38s linear infinite" }}>
                      {loop.map((r, i) => (
                        <span key={`${r.day}-${r.protocol}-${i}`} className="ae-term-pre font-mono flex items-center gap-2 whitespace-nowrap">
                          <span className="w-1.5 h-1.5 rounded-full" style={{ background: protoColor(r.protocol) }} />
                          <span style={{ color: protoColor(r.protocol) }}>{r.protocol}</span>
                          <span className="text-white tabular-nums">{r.value.toLocaleString("en-US")}</span>
                          <span className="text-white/40">{r.unit}</span>
                          <span className="text-white/20">·</span>
                          <span className="text-white/30 tabular-nums">{r.day}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </TerminalFrame>
          </div>
        </div>
      </div>
    </section>
  );
}
