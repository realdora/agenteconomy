// Baseline contains counts strictly before cutoff; recent rows replace the
// entire open interval. Never add a refreshed window to yesterday's totals.
export function validateChainWindow(base, rows) {
  if (!base?.cutoff || !base.counts || !rows.length) throw Error('x402 chains: missing baseline/window')
  const start = rows[0].window_start, end = rows[0].window_end
  if (!/^\d{4}-\d{2}-\d{2}$/.test(start) || !/^\d{4}-\d{2}-\d{2}$/.test(end) || start > base.cutoff || end <= base.cutoff) {
    throw Error('x402 chains: window does not cover baseline cutoff')
  }
  const seen = new Set(), days = new Set()
  for (const r of rows) {
    const day = String(r.day).slice(0, 10), key = `${day}/${r.blockchain}`
    if (r.window_start !== start || r.window_end !== end || day < start || day >= end ||
        !/^[a-z][a-z0-9_]*$/.test(r.blockchain) || !Number.isSafeInteger(r.total_txn) || r.total_txn < 0 || seen.has(key)) {
      throw Error('x402 chains: invalid, duplicate or out-of-window row')
    }
    seen.add(key); days.add(day)
  }
  for (let t = Date.parse(base.cutoff); t < Date.parse(end); t += 864e5) {
    if (!days.has(new Date(t).toISOString().slice(0, 10))) throw Error('x402 chains: missing complete UTC day')
  }
  return { start, end }
}

export function chainWindowTotals(base, rows) {
  const { end } = validateChainWindow(base, rows)
  const counts = { ...base.counts }
  for (const r of rows) if (r.day.slice(0, 10) >= base.cutoff) counts[r.blockchain] = (counts[r.blockchain] || 0) + r.total_txn
  if (Object.values(counts).some(n => !Number.isSafeInteger(n) || n < 0)) throw Error('x402 chains: invalid totals')
  return { counts, coveredThrough: new Date(Date.parse(end) - 1).toISOString() }
}

export function foldChainWindow(base, rows, cutoff) {
  const { end } = validateChainWindow(base, rows)
  if (cutoff <= base.cutoff || cutoff > end) throw Error('x402 chains: unsafe fold boundary')
  const counts = { ...base.counts }
  for (const r of rows) if (r.day.slice(0, 10) >= base.cutoff && r.day.slice(0, 10) < cutoff) counts[r.blockchain] = (counts[r.blockchain] || 0) + r.total_txn
  return { ...base, cutoff, counts }
}

export function selectUsagePeriod(payload, today = new Date().toISOString().slice(0, 10)) {
  const periods = payload.billingPeriods || payload.billing_periods || []
  if (!periods.length) return payload
  const valid = periods.filter(p => {
    const start = p.start_date || p.startDate, end = p.end_date || p.endDate
    return start && end && start <= today && end > today && end > start
  })
  if (valid.length !== 1) throw Error('usage response has no unique active billing period')
  return valid[0]
}
