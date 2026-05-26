import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Logo variants | Agent Economy v4",
};

const SIGNAL_GREEN = "#00FF88";

const baseStyle = {
  fontFamily: "var(--font-geist-sans), ui-sans-serif, system-ui, sans-serif",
  fontSize: 16,
  fontWeight: 500,
  letterSpacing: "-0.02em",
  whiteSpace: "nowrap" as const,
  display: "inline-block",
  lineHeight: 1,
};

const monoStyle = {
  fontFamily: "var(--font-geist-mono), ui-monospace, SFMono-Regular, monospace",
  fontSize: 15,
  fontWeight: 500,
  letterSpacing: "0",
  whiteSpace: "nowrap" as const,
  display: "inline-block",
  lineHeight: 1,
};

const variants = [
  {
    id: "0-baseline",
    name: "Baseline (TT 同形,绿下划线)",
    note: "Dora 嫌跟 TT 没区别 — 仅作 reference",
    render: () => (
      <span style={baseStyle}>
        agent economy
        <span style={{ color: SIGNAL_GREEN, marginLeft: 2 }}>_</span>
      </span>
    ),
  },
  {
    id: "1-domain",
    name: "方向 1 — 完整域名",
    note: ".to 用 Signal Green，FT-style 不缩写",
    render: () => (
      <span style={baseStyle}>
        agenteconomy<span style={{ color: SIGNAL_GREEN }}>.to</span>
      </span>
    ),
  },
  {
    id: "1b-domain-dotmid",
    name: "方向 1b — 中间点高亮",
    note: "agent + 绿点 + economy，节奏更紧凑",
    render: () => (
      <span style={baseStyle}>
        agent<span style={{ color: SIGNAL_GREEN }}>.</span>economy
      </span>
    ),
  },
  {
    id: "2-period",
    name: "方向 2 — 句号收尾",
    note: "declarative 终结感,跟 hero 句号节奏呼应",
    render: () => (
      <span style={baseStyle}>
        agent economy<span style={{ color: SIGNAL_GREEN }}>.</span>
      </span>
    ),
  },
  {
    id: "3-mixed-type",
    name: "方向 3 — 字体混搭(italic serif + sans)",
    note: "agent italic serif + economy sans;呼应 trust section typography",
    render: () => (
      <span style={{ ...baseStyle, fontSize: 17 }}>
        <span
          style={{
            fontFamily: '"Times New Roman", Times, Georgia, serif',
            fontStyle: "italic",
            fontWeight: 400,
            letterSpacing: 0,
          }}
        >
          agent
        </span>
        <span style={{ marginLeft: 4, fontWeight: 600 }}>economy</span>
      </span>
    ),
  },
  {
    id: "4-monospace-brackets",
    name: "方向 4 — Monospace 方括号",
    note: "[agenteconomy] terminal/ticker 气质,等宽字体",
    render: () => (
      <span style={monoStyle}>
        <span style={{ color: SIGNAL_GREEN }}>[</span>
        agenteconomy
        <span style={{ color: SIGNAL_GREEN }}>]</span>
      </span>
    ),
  },
  {
    id: "5-sigma",
    name: "方向 5 — Sigma 前缀(求和/统计感)",
    note: "∑ agent economy,数据/agentic 暗示",
    render: () => (
      <span style={baseStyle}>
        <span style={{ color: SIGNAL_GREEN, marginRight: 6, fontWeight: 400 }}>∑</span>
        agent economy
      </span>
    ),
  },
];

function MockHeader({ render }: { render: () => React.ReactNode }) {
  return (
    <div
      style={{
        background: "rgba(8, 8, 12, 0.95)",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
        padding: "16px 24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        backdropFilter: "blur(20px)",
      }}
    >
      <div style={{ color: "#fff", flex: 1 }}>{render()}</div>
      <nav
        style={{
          display: "flex",
          gap: 28,
          color: "rgba(255,255,255,0.55)",
          fontSize: 14,
          fontFamily: "var(--font-geist-sans), ui-sans-serif, system-ui, sans-serif",
        }}
      >
        <span>Products</span>
        <span>Get Listed</span>
        <span>Pricing</span>
        <span>Resources</span>
        <span>About</span>
      </nav>
      <div
        style={{
          marginLeft: 24,
          padding: "8px 14px",
          border: "1px solid rgba(0, 255, 136, 0.4)",
          borderRadius: 8,
          color: "#fff",
          fontSize: 14,
          fontFamily: "var(--font-geist-sans), ui-sans-serif, system-ui, sans-serif",
        }}
      >
        Go to Explorer
      </div>
    </div>
  );
}

export default function LogoPreviewPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#0a0a0e",
        color: "#fff",
        fontFamily: "var(--font-geist-sans), ui-sans-serif, system-ui, sans-serif",
      }}
    >
      <div
        style={{
          padding: "40px 24px 16px",
          fontSize: 12,
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          color: "rgba(255,255,255,0.45)",
          fontFamily: "var(--font-geist-mono), ui-monospace, monospace",
        }}
      >
        Logo variants · /logo-preview
      </div>

      {variants.map((v) => (
        <div key={v.id} style={{ padding: "12px 0", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
          <div
            style={{
              padding: "8px 24px 12px",
              display: "flex",
              alignItems: "baseline",
              gap: 16,
              flexWrap: "wrap",
            }}
          >
            <span
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: "rgba(255,255,255,0.85)",
              }}
            >
              {v.name}
            </span>
            <span
              style={{
                fontSize: 12,
                color: "rgba(255,255,255,0.45)",
                fontFamily: "var(--font-geist-mono), ui-monospace, monospace",
              }}
            >
              {v.note}
            </span>
          </div>
          <MockHeader render={v.render} />
        </div>
      ))}

      <div
        style={{
          padding: "40px 24px",
          fontSize: 12,
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          color: "rgba(255,255,255,0.35)",
          fontFamily: "var(--font-geist-mono), ui-monospace, monospace",
        }}
      >
        end preview · 选哪个告诉我
      </div>
    </main>
  );
}
