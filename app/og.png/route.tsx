// The share card, rendered live. /og.png used to be a static PNG whose baked
// figures (180M events, 5 protocols, a $1.2B token market) drifted further from
// the site's own headline every day — the one surface where this project's
// data-honesty rule was structurally impossible to keep. Now every crawler
// fetch renders the card from the same feeds the pages use, so a card shared
// next month carries next month's numbers with no deploy and nothing to
// remember. Platform caches still apply (X holds a card image for up to about
// a week), so "live" means "current at every re-scrape", not retroactive.
//
// Design: the "paper ledger" direction (approved 2026-08-18) — cream paper,
// the measured event count as the hero in ink-black, hairline rules, mono
// small-caps labels, one deep-teal accent. Deliberately inverts the dark-neon
// crypto-card cliché. Satori cannot use the site's variable woff2 fonts, so
// the co-located TTFs are static instances cut from them (fonttools).

import { readFile } from "fs/promises";
import { fileURLToPath } from "url";

import { ImageResponse } from "next/og";
import { fetchFeed } from "@/lib/feed-fetch";

export const revalidate = 3600;

const INK = "#161310";
const PAPER = "#FAF6EF";
const TEAL = "#0E6E5C";
const MUTED = "#8a8378";

// Same floor values the site's own fallbacks use: a feed outage degrades the
// card to last-known-good figures instead of an error or an empty frame.
const FLOOR = { events: 196_792_099, volume: 41_327_679, agents: 460_671 };

const num = (v: unknown): number => (typeof v === "number" && Number.isFinite(v) ? v : 0);
const fmt = (v: number): string => v.toLocaleString("en-US");

async function loadNumbers() {
  try {
    const [dRes, wRes] = await Promise.all([
      fetchFeed("https://agenteconomy.to/data.json"),
      fetchFeed("https://agenteconomy.to/web-sources.json"),
    ]);
    if (!dRes.ok) throw new Error(`data.json ${dRes.status}`);
    const d = await dRes.json();
    const w = wRes.ok ? await wRes.json() : {};
    const events =
      num(d.x402?.totalTxs) +
      num(d.olas?.totalTxs) +
      num(d.virtualsAcp?.totalMemos) +
      num(d.erc8004Registry?.totalAgents) +
      num(d.baseAgentic?.totalTxs) +
      num(d.tempoMpp?.totalEvents) +
      num(w.masumi?.totalTxs);
    if (!events) throw new Error("empty totals");
    const stamp = typeof d.updatedAt === "string" ? new Date(d.updatedAt) : new Date();
    return {
      events,
      volume: num(d.x402?.totalVolume) || FLOOR.volume,
      agents: num(d.erc8004Registry?.totalAgents) || FLOOR.agents,
      month: stamp.toLocaleDateString("en-US", { month: "short", year: "numeric", timeZone: "UTC" }).toUpperCase(),
    };
  } catch {
    return { ...FLOOR, month: "LIVE DATA" };
  }
}

// fs 而非 fetch:Node 运行时的 fetch 不支持 file:// URL(edge 运行时才支持)。
// 每个 new URL 必须是静态字符串字面量 —— webpack 的资源识别不展开模板变量,
// 动态写法会让全部五个引用解析到同一个产物(实测五个字体全变成了 Denton)。
const FONT_URLS = {
  geist640: new URL("./Geist-640.ttf", import.meta.url),
  geist600: new URL("./Geist-600.ttf", import.meta.url),
  mono560: new URL("./GeistMono-560.ttf", import.meta.url),
  mono430: new URL("./GeistMono-430.ttf", import.meta.url),
  denton: new URL("./Denton-Regular.ttf", import.meta.url),
} as const;
const font = (u: URL) => readFile(fileURLToPath(u));

export async function GET() {
  const [n, geist640, geist600, mono560, mono430, denton] = await Promise.all([
    loadNumbers(),
    font(FONT_URLS.geist640),
    font(FONT_URLS.geist600),
    font(FONT_URLS.mono560),
    font(FONT_URLS.mono430),
    font(FONT_URLS.denton),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: PAPER,
          color: INK,
          padding: "58px 72px 52px",
          fontFamily: "Geist",
        }}
      >
        {/* 顶栏:品牌 + 时间戳 */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div
              style={{
                width: 46,
                height: 46,
                background: INK,
                borderRadius: 10,
                color: PAPER,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "GeistMono",
                fontSize: 27,
                paddingBottom: 4,
              }}
            >
              a
            </div>
            <div style={{ display: "flex", fontFamily: "GeistMono", fontSize: 21 }}>
              <span>agenteconomy</span>
              <span style={{ color: TEAL }}>.to</span>
            </div>
          </div>
          <div style={{ fontFamily: "GeistMono", fontSize: 12.5, letterSpacing: "0.22em", color: MUTED, fontWeight: 400 }}>
            {`MEASURED ON-CHAIN · ${n.month}`}
          </div>
        </div>
        <div style={{ height: 1, background: INK, opacity: 0.16, marginTop: 26 }} />

        {/* 主体:数字即主角 */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", paddingTop: 6 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, fontFamily: "GeistMono", fontSize: 14, letterSpacing: "0.24em", color: "#5e574c", fontWeight: 400 }}>
            <div style={{ width: 9, height: 9, background: TEAL }} />
            <span>CUMULATIVE AGENT-ECONOMY EVENTS</span>
          </div>
          <div style={{ display: "flex", fontSize: 158, lineHeight: 1, letterSpacing: "-0.035em", margin: "16px 0 18px -6px", fontFamily: "GeistHeavy" }}>
            {fmt(n.events)}
          </div>
          <div style={{ display: "flex", fontFamily: "Denton", fontSize: 31, color: "#3d382f" }}>
            <span>The data authority for the&nbsp;</span>
            <span style={{ color: TEAL }}>agent economy.</span>
          </div>
        </div>

        {/* 底栏:三格数据 */}
        <div style={{ display: "flex", borderTop: `1px solid rgba(22,19,16,0.16)`, paddingTop: 26 }}>
          {[
            { v: `$${fmt(n.volume)}`, l: "SETTLED IN STABLECOINS", border: false },
            { v: "6 · 12+", l: "PROTOCOLS · CHAINS", border: true },
            { v: fmt(n.agents), l: "AGENTS REGISTERED", border: false },
          ].map((c) => (
            <div
              key={c.l}
              style={{
                display: "flex",
                flexDirection: "column",
                flex: 1,
                paddingLeft: c.border ? 40 : 0,
                paddingRight: c.border ? 40 : 0,
                borderLeft: c.border ? "1px solid rgba(22,19,16,0.14)" : "none",
                borderRight: c.border ? "1px solid rgba(22,19,16,0.14)" : "none",
                marginLeft: c.border ? 40 : 0,
                marginRight: c.border ? 40 : 0,
              }}
            >
              <div style={{ fontSize: 29, letterSpacing: "-0.015em", fontFamily: "Geist" }}>{c.v}</div>
              <div style={{ fontFamily: "GeistMono", fontSize: 12, letterSpacing: "0.18em", color: MUTED, marginTop: 9, fontWeight: 400 }}>{c.l}</div>
            </div>
          ))}
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        { name: "Geist", data: geist600, weight: 600 },
        { name: "GeistHeavy", data: geist640, weight: 700 },
        { name: "GeistMono", data: mono560, weight: 500 },
        { name: "GeistMono", data: mono430, weight: 400 },
        { name: "Denton", data: denton, weight: 400 },
      ],
      headers: {
        // 平台抓取端的缓存窗口;数据侧由 fetchFeed 的 revalidate 控制
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
        "Content-Type": "image/png",
      },
    },
  );
}
