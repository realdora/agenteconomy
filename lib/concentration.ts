// Concentration lens: for a series that can be split by source, how much comes
// from the largest single source and what is left without it. One mechanical
// rule, applied the same way to every series — it identifies the largest
// source by count and makes no judgement about that source.

import type { CoverageSummary } from "./coverage-feed";

export type Concentration = {
  from: string;
  to: string;
  days: number;
  total: number;
  largest: string;
  share: number; // 0..1
  exLargest: number;
  sources: number; // distinct named sources in the window
};

type Row = Record<string, unknown>;
const n = (v: unknown): number => (typeof v === "number" && Number.isFinite(v) ? v : 0);

// x402 by facilitator, over the complete days carried in data.json's
// recentFacilitators (a short rolling window, typically five days).
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function x402Concentration(data: any): Concentration | null {
  const rows: Row[] = Array.isArray(data?.x402?.recentFacilitators) ? data.x402.recentFacilitators : [];
  const days = [...new Set(rows.map((r) => String(r.day ?? "")))].filter((d) => /^\d{4}-\d{2}-\d{2}$/.test(d)).sort();
  if (days.length < 3) return null;
  const by = new Map<string, number>();
  for (const r of rows) by.set(String(r.project ?? ""), (by.get(String(r.project ?? "")) ?? 0) + n(r.txs));
  const total = [...by.values()].reduce((s, v) => s + v, 0);
  const top = [...by].sort((a, b) => b[1] - a[1])[0];
  if (!top || total <= 0) return null;
  return { from: days[0], to: days[days.length - 1], days: days.length, total, largest: top[0], share: top[1] / total, exLargest: total - top[1], sources: by.size };
}

export function erc8004Concentration(c: CoverageSummary | null): Concentration | null {
  const w = c?.erc?.last7;
  if (!w) return null;
  return { from: w.from, to: w.to, days: 7, total: w.total, largest: w.largestSource, share: w.largestShare, exLargest: w.exLargest, sources: 0 };
}

export const pct = (share: number): string => `${Math.round(share * 1000) / 10}%`;
