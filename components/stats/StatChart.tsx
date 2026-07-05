// Server-rendered SVG chart for the /stats answer pages — no client JS, and the
// series is mirrored in an sr-only table so crawlers can read every point.

import type { ChartSpec } from "@/lib/stats-registry";

const W = 1180;
const H = 320;
const PAD_L = 56;
const PAD_R = 20;
const PAD_T = 24;
const PAD_B = 44;
const GREEN = "#00FF88";

function niceMax(n: number): number {
  if (n <= 0) return 1;
  const mag = Math.pow(10, Math.floor(Math.log10(n)));
  return Math.ceil(n / mag) * mag;
}

function compact(n: number): string {
  if (n >= 1e6) return `${Math.round((n / 1e6) * 10) / 10}M`;
  if (n >= 1e3) return `${Math.round((n / 1e3) * 10) / 10}K`;
  return `${Math.round(n * 100) / 100}`;
}

export function StatChart({ chart }: { chart: ChartSpec }) {
  const points = chart.points.filter((p) => Number.isFinite(p.value));
  if (points.length < 2) return null;

  const innerW = W - PAD_L - PAD_R;
  const innerH = H - PAD_T - PAD_B;
  const max = niceMax(Math.max(...points.map((p) => p.value)));

  const gridLines = [0, 0.25, 0.5, 0.75, 1].map((t) => ({
    y: PAD_T + innerH * (1 - t),
    label: compact(max * t),
  }));

  // Thin dense label sets so the x-axis stays readable.
  const labelEvery = Math.max(1, Math.ceil(points.length / 8));

  return (
    <figure className="mt-10">
      <figcaption className="font-mono text-[11px] uppercase tracking-[0.22em] text-white/45 mb-4">
        {chart.title} <span className="text-white/25">· {chart.unit}</span>
      </figcaption>
      <div className="rounded-2xl border border-white/10 bg-white/[0.015] overflow-hidden">
        <svg viewBox={`0 0 ${W} ${H}`} width="100%" className="block" role="img" aria-label={chart.title}>
          {gridLines.map((g) => (
            <g key={g.y}>
              <line x1={PAD_L} y1={g.y} x2={W - PAD_R} y2={g.y} stroke="rgba(255,255,255,0.06)" strokeDasharray="2 4" />
              <text x={PAD_L - 8} y={g.y + 4} textAnchor="end" fill="rgba(255,255,255,0.35)" fontSize="11" fontFamily="GeistMono, monospace">
                {g.label}
              </text>
            </g>
          ))}

          {chart.kind === "line" ? (
            <LineMarks points={points} innerW={innerW} innerH={innerH} max={max} />
          ) : (
            <BarMarks points={points} innerW={innerW} innerH={innerH} max={max} />
          )}

          {points.map((p, i) =>
            i % labelEvery === 0 || i === points.length - 1 ? (
              <text
                key={`${p.label}-${i}`}
                x={
                  chart.kind === "bars"
                    ? PAD_L + (innerW / points.length) * i + innerW / points.length / 2
                    : PAD_L + (points.length === 1 ? 0 : (i * innerW) / (points.length - 1))
                }
                y={H - PAD_B + 24}
                textAnchor={i === 0 ? "start" : i === points.length - 1 ? "end" : "middle"}
                fill="rgba(255,255,255,0.35)"
                fontSize="11"
                fontFamily="GeistMono, monospace"
              >
                {p.label}
              </text>
            ) : null,
          )}
        </svg>
      </div>

      <table className="sr-only">
        <caption>{chart.title}, in {chart.unit}</caption>
        <thead>
          <tr>
            <th scope="col">Period</th>
            <th scope="col">{chart.unit}</th>
          </tr>
        </thead>
        <tbody>
          {points.map((p, i) => (
            <tr key={`${p.label}-${i}`}>
              <td>{p.label}</td>
              <td>{p.value.toLocaleString("en-US")}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  );
}

function LineMarks({ points, innerW, innerH, max }: { points: ChartSpec["points"]; innerW: number; innerH: number; max: number }) {
  const coords = points.map((p, i) => ({
    x: PAD_L + (points.length === 1 ? 0 : (i * innerW) / (points.length - 1)),
    y: PAD_T + innerH - (p.value / max) * innerH,
  }));
  const line = coords.map((c, i) => `${i === 0 ? "M" : "L"} ${c.x},${c.y}`).join(" ");
  const area = `M ${coords[0].x},${PAD_T + innerH} ${coords.map((c) => `L ${c.x},${c.y}`).join(" ")} L ${coords[coords.length - 1].x},${PAD_T + innerH} Z`;
  const end = coords[coords.length - 1];
  return (
    <>
      <defs>
        <linearGradient id="stat-area" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={GREEN} stopOpacity="0.22" />
          <stop offset="100%" stopColor={GREEN} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill="url(#stat-area)" />
      <path d={line} stroke={GREEN} strokeWidth="2" fill="none" />
      <circle cx={end.x} cy={end.y} r="4.5" fill={GREEN} />
    </>
  );
}

function BarMarks({ points, innerW, innerH, max }: { points: ChartSpec["points"]; innerW: number; innerH: number; max: number }) {
  const slot = innerW / points.length;
  const barW = Math.min(64, slot * 0.6);
  return (
    <>
      {points.map((p, i) => {
        const h = (p.value / max) * innerH;
        return (
          <rect
            key={`${p.label}-${i}`}
            x={PAD_L + slot * i + (slot - barW) / 2}
            y={PAD_T + innerH - h}
            width={barW}
            height={Math.max(h, 1)}
            rx="3"
            fill={GREEN}
            opacity="0.75"
          />
        );
      })}
    </>
  );
}
