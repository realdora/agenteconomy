const DAILY_KEYS = new Set(['x402Cumulative', 'x402Daily', 'baseAgentic', 'virtualsAcp', 'x402TokenSplit', 'x402Chains'])

// A manual run late yesterday must not suppress today's scheduled refresh.
// Weekly sources and third-party read-only queries retain their own cadence.
export function calendarRefreshDue(query, executedAt, now = Date.now()) {
  if (query.readOnly || !DAILY_KEYS.has(query.key) || !Number.isFinite(Date.parse(executedAt))) return false
  return new Date(executedAt).toISOString().slice(0, 10) < new Date(now).toISOString().slice(0, 10)
}
