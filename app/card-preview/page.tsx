import type { Metadata } from "next";

export const metadata: Metadata = { title: "Hero card variants | Agent Economy v4" };

const GREEN = "#00FF88";

// protocol palette
const P = {
  x402: "#00FF88",
  erc: "#7ad7ff",
  acp: "#9e7bff",
  olas: "#ffb86c",
  tempo: "#ff6b9e",
};

// ─── shared helpers ───
function Sparkline({ data, color = GREEN, w = 120, h = 26 }: { data: number[]; color?: string; w?: number; h?: number }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const step = w / (data.length - 1);
  const pts = data.map((v, i) => `${i * step},${h - ((v - min) / range) * h}`).join(" ");
  const last = data[data.length - 1];
  return (
    <svg width={w} height={h} className="overflow-visible">
      <polyline points={pts} fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={(data.length - 1) * step} cy={h - ((last - min) / range) * h} r={2} fill={color} />
    </svg>
  );
}

function Donut({ segments, size = 132 }: { segments: { value: number; color: string }[]; size?: number }) {
  const total = segments.reduce((s, x) => s + x.value, 0);
  const r = size / 2 - 12;
  const c = 2 * Math.PI * r;
  let offset = 0;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <g transform={`rotate(-90 ${size / 2} ${size / 2})`}>
        {segments.map((seg, i) => {
          const frac = seg.value / total;
          const dash = frac * c;
          const node = (
            <circle
              key={i}
              cx={size / 2}
              cy={size / 2}
              r={r}
              fill="none"
              stroke={seg.color}
              strokeWidth={11}
              strokeDasharray={`${dash} ${c - dash}`}
              strokeDashoffset={-offset}
            />
          );
          offset += dash;
          return node;
        })}
      </g>
    </svg>
  );
}

// shared card shell
function Shell({ children, variant = "default" }: { children: React.ReactNode; variant?: "default" | "purple" | "terminal" }) {
  const bg =
    variant === "purple"
      ? "bg-gradient-to-br from-[#7650d6] to-[#5b3bb0]"
      : variant === "terminal"
        ? "bg-[#0a0a0e]"
        : "bg-white/[0.025]";
  return (
    <div className={`rounded-2xl border border-white/10 ${bg} p-6 h-[360px] overflow-hidden flex flex-col`}>{children}</div>
  );
}

const EVENTS = [
  { proto: "x402", count: 38244, spark: [22, 28, 31, 35, 30, 38, 44, 47, 54, 67], color: P.x402 },
  { proto: "ERC-8004", count: 12907, spark: [15, 18, 22, 24, 28, 31, 34, 37, 41, 48], color: P.erc },
  { proto: "Virtuals ACP", count: 7281, spark: [5, 8, 12, 18, 23, 28, 34, 41, 52, 64], color: P.acp },
  { proto: "Olas", count: 4153, spark: [50, 48, 52, 47, 45, 49, 46, 44, 43, 41], color: P.olas },
  { proto: "Tempo MPP", count: 1024, spark: [0, 0, 4, 12, 28, 47, 68, 78, 88, 95], color: P.tempo },
];

// ─── Card 01 — Live event feed (terminal stream) ───
function Card01() {
  const rows = [
    { t: "12:04:31", proto: "x402", chain: "base", amt: "$0.42", agent: "claude-sonnet", color: P.x402 },
    { t: "12:04:29", proto: "erc8004", chain: "eth", amt: "$18.50", agent: "gpt-5-mini", color: P.erc },
    { t: "12:04:27", proto: "acp", chain: "base", amt: "$320.00", agent: "perplexity", color: P.acp },
    { t: "12:04:24", proto: "olas", chain: "arb", amt: "$4.10", agent: "deepseek-r1", color: P.olas },
    { t: "12:04:21", proto: "tempo", chain: "opt", amt: "$77.30", agent: "browserless", color: P.tempo },
  ];
  return (
    <Shell variant="terminal">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#00FF88] animate-pulse" />
          <span className="text-white font-medium text-[15px]">Live agent events</span>
        </div>
        <span className="font-mono text-[11px] text-white/40">block 23,455,201</span>
      </div>
      <div className="font-mono text-[11px] uppercase tracking-[0.16em] text-white/35 mb-3">24h · from block tip</div>
      <div className="flex flex-col gap-2.5 font-mono text-[12px]">
        {rows.map((r) => (
          <div key={r.t} className="flex items-center gap-3">
            <span className="text-white/35 tabular-nums">{r.t}</span>
            <span style={{ color: r.color }} className="w-16">{r.proto}</span>
            <span className="text-white/45 w-9">{r.chain}</span>
            <span className="text-white tabular-nums w-16 text-right">{r.amt}</span>
            <span className="text-white/40 truncate">{r.agent}</span>
          </div>
        ))}
      </div>
    </Shell>
  );
}

// ─── Card 02 — Protocol sparkline list ───
function Card02() {
  return (
    <Shell>
      <div className="mb-1 text-white font-medium text-[17px]">Agent activity</div>
      <div className="font-mono text-[11px] uppercase tracking-[0.16em] text-white/40 mb-6">events · 24h</div>
      <div className="flex flex-col gap-4 flex-1 justify-center">
        {EVENTS.map((e) => (
          <div key={e.proto} className="flex items-center justify-between gap-4">
            <span className="text-white/80 text-[14px] w-28">{e.proto}</span>
            <span className="text-white tabular-nums text-[15px] font-medium w-16 text-right">{e.count.toLocaleString()}</span>
            <Sparkline data={e.spark} color={e.color} w={110} h={24} />
          </div>
        ))}
      </div>
    </Shell>
  );
}

// ─── Card 03 — Big volume + delta + stacked bar ───
function Card03() {
  const segs = [
    { label: "x402", value: 452, color: P.x402 },
    { label: "ACP", value: 321, color: P.acp },
    { label: "ERC", value: 264, color: P.erc },
    { label: "Olas", value: 142, color: P.olas },
    { label: "Tempo", value: 68, color: P.tempo },
  ];
  const total = segs.reduce((s, x) => s + x.value, 0);
  return (
    <Shell>
      <div className="font-mono text-[11px] uppercase tracking-[0.16em] text-white/40 mb-2">Agent payment volume · 24h</div>
      <div className="text-white font-medium text-[44px] leading-none tracking-tight tabular-nums mb-2">$1,247,398</div>
      <div className="text-[#00FF88] font-mono text-[13px] mb-8">+18.4% vs prior 24h</div>
      <div className="mt-auto">
        <div className="flex h-3 rounded-full overflow-hidden mb-4">
          {segs.map((s) => (
            <div key={s.label} style={{ width: `${(s.value / total) * 100}%`, background: s.color }} />
          ))}
        </div>
        <div className="flex flex-wrap gap-x-4 gap-y-2 font-mono text-[11px]">
          {segs.map((s) => (
            <span key={s.label} className="flex items-center gap-1.5 text-white/55">
              <span className="w-2 h-2 rounded-sm" style={{ background: s.color }} />
              {s.label}
            </span>
          ))}
        </div>
      </div>
    </Shell>
  );
}

// ─── Card 04 — JSON proof card ───
function Card04() {
  return (
    <Shell variant="terminal">
      <div className="text-white font-medium text-[16px] mb-1">Verified by chain</div>
      <div className="font-mono text-[11px] uppercase tracking-[0.16em] text-white/40 mb-5">schema · agenteconomy/v1</div>
      <pre className="font-mono text-[12.5px] leading-[1.8] flex-1">
{`{`}
{"\n"}{`  "block":    `}<span className="text-white">23455201</span>{`,`}
{"\n"}{`  "tx_hash":  `}<span className="text-white/55">{`"0x9af3b2c1…"`}</span>{`,`}
{"\n"}{`  "protocol": `}<span style={{ color: P.x402 }}>{`"x402"`}</span>{`,`}
{"\n"}{`  "chain":    `}<span style={{ color: P.erc }}>{`"base"`}</span>{`,`}
{"\n"}{`  "agent":    `}<span style={{ color: P.olas }}>{`"claude-sonnet"`}</span>{`,`}
{"\n"}{`  "amount":   `}<span className="text-white">0.42</span>
{"\n"}{`}`}
      </pre>
      <a className="font-mono text-[12px] text-[#00FF88] mt-4">↗ basescan.org/tx/0x9af3…</a>
    </Shell>
  );
}

// ─── Card 05 — Vertical bar chart (volume by protocol, grouped) ───
function Card05() {
  const data = [
    { label: "x402", value: 95, color: P.x402 },
    { label: "ERC", value: 62, color: P.erc },
    { label: "ACP", value: 78, color: P.acp },
    { label: "Olas", value: 38, color: P.olas },
    { label: "Tempo", value: 22, color: P.tempo },
  ];
  const max = Math.max(...data.map((d) => d.value));
  return (
    <Shell>
      <div className="text-white font-medium text-[17px] mb-1">Volume by protocol</div>
      <div className="font-mono text-[11px] uppercase tracking-[0.16em] text-white/40 mb-6">USD · 7d</div>
      <div className="flex items-end gap-4 flex-1">
        {data.map((d) => (
          <div key={d.label} className="flex-1 flex flex-col items-center justify-end gap-3 h-full">
            <div className="w-full flex flex-col justify-end h-full">
              <div className="w-full rounded-t-md" style={{ height: `${(d.value / max) * 100}%`, background: d.color, minHeight: 6 }} />
            </div>
            <span className="font-mono text-[10px] text-white/45">{d.label}</span>
          </div>
        ))}
      </div>
    </Shell>
  );
}

// ─── Card 06 — Donut ring (protocol share) ───
function Card06() {
  const segs = [
    { label: "x402", value: 452, color: P.x402 },
    { label: "ACP", value: 321, color: P.acp },
    { label: "ERC-8004", value: 264, color: P.erc },
    { label: "Olas", value: 142, color: P.olas },
    { label: "Tempo", value: 68, color: P.tempo },
  ];
  return (
    <Shell>
      <div className="text-white font-medium text-[17px] mb-1">Protocol share</div>
      <div className="font-mono text-[11px] uppercase tracking-[0.16em] text-white/40 mb-4">volume · 24h</div>
      <div className="flex items-center gap-6 flex-1">
        <div className="relative">
          <Donut segments={segs} size={132} />
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-white font-medium text-[20px] tabular-nums leading-none">$1.2M</span>
            <span className="font-mono text-[9px] uppercase tracking-[0.15em] text-white/40 mt-1">total</span>
          </div>
        </div>
        <div className="flex flex-col gap-2.5 font-mono text-[12px]">
          {segs.map((s) => (
            <span key={s.label} className="flex items-center gap-2 text-white/60">
              <span className="w-2.5 h-2.5 rounded-sm" style={{ background: s.color }} />
              {s.label}
            </span>
          ))}
        </div>
      </div>
    </Shell>
  );
}

// ─── Card 07 — Mini area chart (7-day events) ───
function Card07() {
  const data = [100, 106, 112, 118, 126, 134, 142, 151, 161, 173];
  const w = 380;
  const h = 130;
  const max = Math.max(...data);
  const step = w / (data.length - 1);
  const pts = data.map((v, i) => `${i * step},${h - (v / max) * h}`);
  const line = pts.map((p, i) => (i === 0 ? `M ${p}` : `L ${p}`)).join(" ");
  const area = `M 0,${h} ${pts.map((p) => `L ${p}`).join(" ")} L ${w},${h} Z`;
  return (
    <Shell>
      <div className="font-mono text-[11px] uppercase tracking-[0.16em] text-white/40 mb-2">Events · 7 days</div>
      <div className="flex items-baseline gap-3 mb-6">
        <span className="text-white font-medium text-[40px] leading-none tracking-tight tabular-nums">173M</span>
        <span className="text-[#00FF88] font-mono text-[13px]">+12.4%</span>
      </div>
      <div className="mt-auto">
        <svg viewBox={`0 0 ${w} ${h}`} width="100%" className="block">
          <defs>
            <linearGradient id="c7grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={GREEN} stopOpacity="0.3" />
              <stop offset="100%" stopColor={GREEN} stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d={area} fill="url(#c7grad)" />
          <path d={line} fill="none" stroke={GREEN} strokeWidth={2} />
          <circle cx={w} cy={h - (data[data.length - 1] / max) * h} r={4} fill={GREEN} />
        </svg>
      </div>
    </Shell>
  );
}

// ─── Card 08 — Leaderboard (top agents by spend) ───
function Card08() {
  const rows = [
    { rank: "01", agent: "claude-sonnet", spend: 48230, bar: 100, color: P.x402 },
    { rank: "02", agent: "gpt-5-mini", spend: 39105, bar: 81, color: P.erc },
    { rank: "03", agent: "perplexity-bot", spend: 27840, bar: 58, color: P.acp },
    { rank: "04", agent: "deepseek-r1", spend: 18420, bar: 38, color: P.olas },
    { rank: "05", agent: "browserless", spend: 9610, bar: 20, color: P.tempo },
  ];
  return (
    <Shell>
      <div className="text-white font-medium text-[17px] mb-1">Top agents</div>
      <div className="font-mono text-[11px] uppercase tracking-[0.16em] text-white/40 mb-5">USD spend · 24h</div>
      <div className="flex flex-col gap-3.5 flex-1 justify-center">
        {rows.map((r) => (
          <div key={r.rank} className="flex items-center gap-3">
            <span className="font-mono text-[12px] text-white/35">{r.rank}</span>
            <span className="text-white/85 text-[13px] w-28">{r.agent}</span>
            <div className="flex-1 h-1.5 rounded-full bg-white/5 overflow-hidden">
              <div className="h-full rounded-full" style={{ width: `${r.bar}%`, background: r.color }} />
            </div>
            <span className="text-white tabular-nums font-mono text-[12px] w-14 text-right">${(r.spend / 1000).toFixed(1)}K</span>
          </div>
        ))}
      </div>
    </Shell>
  );
}

// ─── Card 09 — Activity heatmap grid (GitHub-style) ───
function Card09() {
  const cells = Array.from({ length: 7 * 14 }, () => Math.random());
  const shade = (v: number) => {
    if (v < 0.25) return "rgba(255,255,255,0.05)";
    if (v < 0.5) return "rgba(0,255,136,0.25)";
    if (v < 0.75) return "rgba(0,255,136,0.5)";
    return "rgba(0,255,136,0.9)";
  };
  return (
    <Shell>
      <div className="text-white font-medium text-[17px] mb-1">Activity</div>
      <div className="font-mono text-[11px] uppercase tracking-[0.16em] text-white/40 mb-6">events per day · 14 weeks</div>
      <div className="grid grid-flow-col grid-rows-7 gap-1.5 flex-1 content-center">
        {cells.map((v, i) => (
          <div key={i} className="w-full aspect-square rounded-[3px]" style={{ background: shade(v) }} />
        ))}
      </div>
      <div className="flex items-center gap-2 mt-4 font-mono text-[10px] text-white/40">
        less
        <span className="w-2.5 h-2.5 rounded-[3px]" style={{ background: "rgba(255,255,255,0.05)" }} />
        <span className="w-2.5 h-2.5 rounded-[3px]" style={{ background: "rgba(0,255,136,0.25)" }} />
        <span className="w-2.5 h-2.5 rounded-[3px]" style={{ background: "rgba(0,255,136,0.5)" }} />
        <span className="w-2.5 h-2.5 rounded-[3px]" style={{ background: "rgba(0,255,136,0.9)" }} />
        more
      </div>
    </Shell>
  );
}

// ─── Card 10 — Metric tiles 2×2 ───
function Card10() {
  const tiles = [
    { label: "Events tracked", value: "173M", delta: "+12%", sub: "24h" },
    { label: "Payment volume", value: "$1.2M", delta: "+18%", sub: "24h" },
    { label: "Active agents", value: "8,432", delta: "+6%", sub: "24h" },
    { label: "Chains indexed", value: "11", delta: "live", sub: "" },
  ];
  return (
    <Shell>
      <div className="font-mono text-[11px] uppercase tracking-[0.16em] text-white/40 mb-5">Today on agenteconomy</div>
      <div className="grid grid-cols-2 gap-px bg-white/10 rounded-xl overflow-hidden flex-1">
        {tiles.map((t) => (
          <div key={t.label} className="bg-[#0c0c10] p-5 flex flex-col justify-center gap-1">
            <div className="font-mono text-[10px] uppercase tracking-[0.14em] text-white/40">{t.label}</div>
            <div className="text-white font-medium text-[32px] leading-none tracking-tight tabular-nums">{t.value}</div>
            <div className="text-[#00FF88] font-mono text-[11px]">{t.delta}{t.sub ? <span className="text-white/30"> · {t.sub}</span> : null}</div>
          </div>
        ))}
      </div>
    </Shell>
  );
}

const CARDS = [
  { id: "01", name: "Live event feed", note: "terminal stream · 5 recent tx", el: <Card01 /> },
  { id: "02", name: "Protocol sparklines", note: "5 protocols · count + trend", el: <Card02 /> },
  { id: "03", name: "Volume + stacked bar", note: "big USD + protocol split", el: <Card03 /> },
  { id: "04", name: "JSON proof", note: "single tx · explorer link", el: <Card04 /> },
  { id: "05", name: "Vertical bar chart", note: "volume by protocol", el: <Card05 /> },
  { id: "06", name: "Donut share", note: "protocol % ring + legend", el: <Card06 /> },
  { id: "07", name: "Mini area chart", note: "7-day events trend", el: <Card07 /> },
  { id: "08", name: "Leaderboard", note: "top agents by spend", el: <Card08 /> },
  { id: "09", name: "Activity heatmap", note: "GitHub-style intensity grid", el: <Card09 /> },
  { id: "10", name: "Metric tiles 2×2", note: "4 KPIs in a grid", el: <Card10 /> },
];

export default function CardPreviewPage() {
  return (
    <main className="min-h-screen bg-[#060607] text-white">
      <div className="px-6 py-10 max-w-[1240px] mx-auto">
        <div className="font-mono text-[12px] uppercase tracking-[0.22em] text-white/45">Hero card variants · /card-preview</div>
        <div className="mt-2 text-white/55 text-[13px] max-w-2xl">
          10 data card designs for the hero panel. Same data themes (agent payments / events / protocols), different
          visualizations. Pick the 3 you want (one per track / price / cite slide) or mix.
        </div>
      </div>
      <div className="max-w-[1240px] mx-auto px-6 pb-24 grid grid-cols-1 lg:grid-cols-2 gap-8">
        {CARDS.map((c) => (
          <div key={c.id} className="flex flex-col gap-3">
            <div className="flex items-baseline gap-3">
              <span className="font-mono text-[12px] text-[#00FF88]">CARD {c.id}</span>
              <span className="text-white font-medium text-[14px]">{c.name}</span>
              <span className="font-mono text-[11px] text-white/40">{c.note}</span>
            </div>
            {c.el}
          </div>
        ))}
      </div>
    </main>
  );
}
