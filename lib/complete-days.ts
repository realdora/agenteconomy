// A cached partial day never becomes complete just because the clock advances.
// Use this metric's execution time, not the last refresh of another feed.
export function completeDays<T extends { day?: unknown }>(
  rows: T[], executedAt: unknown, now = new Date(),
): T[] {
  const observed = typeof executedAt === "string" ? Date.parse(executedAt) : NaN;
  if (!Number.isFinite(observed)) return [];
  const cutoff = new Date(Math.min(observed, now.getTime())).toISOString().slice(0, 10);
  return rows.filter(r => typeof r.day === "string" && /^\d{4}-\d{2}-\d{2}$/.test(r.day) && r.day < cutoff)
    .sort((a, b) => String(a.day).localeCompare(String(b.day)));
}

export function x402DailyExecution(data: { meta?: { queries?: { x402Daily?: { executedAt?: unknown } } }; x402?: { asOf?: unknown } } | null | undefined): unknown {
  return data?.meta?.queries?.x402Daily?.executedAt ?? data?.x402?.asOf;
}
