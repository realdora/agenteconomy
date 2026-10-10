// Reviewed 2026-10-08: owned Base query completed at 16.618970589 credits.
// Only that exact query gets 20; explicit stricter/default nonproduction limits
// remain authoritative. This does not increase daily or monthly allowances.
export function queryCreditCap(query, defaultCap = 15) {
  return query.key === 'baseAgentic' && query.id === 8748141 && defaultCap === 15 ? 20 : defaultCap
}
export const ISOLATED_QUERY_POLICY_DAY = '2026-10-07'
