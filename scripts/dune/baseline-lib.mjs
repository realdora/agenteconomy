// scripts/dune/baseline-lib.mjs — pure functions for the frozen-baseline +
// recent-window design. No network, no fs: build-baseline.mjs and
// freeze-month.mjs wire these to the Dune API; run-tests.mjs unit-tests them.
//
// Boundary rule (hard-won): a baseline with cutoff C contains data STRICTLY
// BEFORE C; the window query scans block_time >= C. Folding a month moves rows
// in [oldCutoff, newCutoff) from window territory into the baseline.

const TESTNETS = new Set(['sepolia', 'goerli', 'mumbai', 'amoy', 'holesky'])
const chainName = n => ({ bnb: 'BNB', opbnb: 'opBNB', megaeth: 'MegaETH', avalanche_c: 'Avalanche' }[n] || n.charAt(0).toUpperCase() + n.slice(1))
const safeNum = v => { const n = parseFloat(v); return isNaN(n) ? 0 : n }

// Month keys ('2026-05') in [startMonth, endMonthExclusive)
function monthsBetween(startMonth, endMonthExclusive) {
  const out = []
  let [y, m] = startMonth.split('-').map(Number)
  while (`${y}-${String(m).padStart(2, '0')}` < endMonthExclusive) {
    out.push(`${y}-${String(m).padStart(2, '0')}`)
    m += 1
    if (m > 12) { m = 1; y += 1 }
  }
  return out
}

// EXACT x402 baseline from legacy upstream Q6058135 rows
// (per-(month, facilitator): date_time, facilitator, total_txn, total_vol).
export function buildX402Baseline(rows, cutoff) {
  const cutoffMonth = cutoff.slice(0, 7)
  const kept = rows.filter(r => (r.date_time || '').slice(0, 7) < cutoffMonth)
  if (kept.length === 0) throw new Error(`buildX402Baseline: no rows before cutoff ${cutoff}`)
  const monthlyMap = {}, protocolMap = {}
  let totalTxs = 0, totalVolume = 0
  for (const r of kept) {
    const month = (r.date_time || '').slice(0, 7)
    const name = r.facilitator || 'Other'
    const txs = safeNum(r.total_txn), vol = safeNum(r.total_vol)
    if (!monthlyMap[month]) monthlyMap[month] = { txs: 0, vol: 0 }
    monthlyMap[month].txs += txs; monthlyMap[month].vol += vol
    if (!protocolMap[name]) protocolMap[name] = { txs: 0, vol: 0 }
    protocolMap[name].txs += txs; protocolMap[name].vol += vol
    totalTxs += txs; totalVolume += vol
  }
  return {
    cutoff,
    source: `exact, built from upstream per-(month, facilitator) rows (${kept.length} rows < ${cutoff})`,
    protocolsApprox: false,
    totalTxs: Math.round(totalTxs),
    totalVolume: Math.round(totalVolume),
    facilitatorsTracked: Object.keys(protocolMap).length,
    monthly: Object.entries(monthlyMap).sort(([a], [b]) => a.localeCompare(b))
      .map(([month, v]) => ({ month, txs: Math.round(v.txs), vol: Math.round(v.vol) })),
    protocols: Object.entries(protocolMap).sort(([, a], [, b]) => b.txs - a.txs)
      .map(([name, v]) => ({ name, txs: Math.round(v.txs), vol: Math.round(v.vol) })),
  }
}

// EXACT registry baseline from upstream Q6130922 rows
// (per-(day, chain): block_date, blockchain, registered).
export function buildRegistryBaseline(rows, cutoff) {
  const cutoffDay = cutoff.slice(0, 10)
  const chains = {}, dailyMap = {}
  let totalAgents = 0, kept = 0
  for (const r of rows) {
    const chain = r.blockchain || ''
    if (TESTNETS.has(chain)) continue
    const day = (r.block_date || '').slice(0, 10)
    if (!day || day >= cutoffDay) continue
    const reg = safeNum(r.registered)
    if (reg === 0) continue
    kept += 1
    const name = chainName(chain)
    chains[name] = (chains[name] || 0) + reg
    dailyMap[day] = (dailyMap[day] || 0) + reg
    totalAgents += reg
  }
  if (kept === 0) throw new Error(`buildRegistryBaseline: no rows before cutoff ${cutoff}`)
  return {
    cutoff,
    source: `exact, built from upstream per-(day, chain) rows (${kept} non-zero rows < ${cutoff})`,
    totalAgents,
    chains: Object.entries(chains).sort(([, a], [, b]) => b - a).map(([name, agents]) => ({ name, agents })),
    daily: Object.entries(dailyMap).sort(([a], [b]) => a.localeCompare(b)).map(([day, agents]) => ({ day, agents })),
  }
}

// Fold closed months [baseline.cutoff, newCutoff) from window rows into the
// x402 baseline. Refuses to fold a month the window result doesn't cover.
export function foldX402Window(baseline, windowRows, newCutoff) {
  if (!(newCutoff > baseline.cutoff)) throw new Error(`foldX402Window: newCutoff ${newCutoff} must be after current cutoff ${baseline.cutoff}`)
  const foldMonths = monthsBetween(baseline.cutoff.slice(0, 7), newCutoff.slice(0, 7))
  if (foldMonths.length === 0) throw new Error('foldX402Window: nothing to fold')
  const inRange = windowRows.filter(r => foldMonths.includes((r.date_time || '').slice(0, 7)))
  for (const m of foldMonths) {
    if (!inRange.some(r => (r.date_time || '').slice(0, 7) === m)) {
      throw new Error(`foldX402Window: window result has no rows for ${m} — refusing to freeze an uncovered month`)
    }
  }
  const monthlyMap = Object.fromEntries(baseline.monthly.map(m => [m.month, { txs: m.txs, vol: m.vol }]))
  const protocolMap = Object.fromEntries(baseline.protocols.map(p => [p.name, { txs: p.txs, vol: p.vol || 0 }]))
  let totalTxs = baseline.totalTxs, totalVolume = baseline.totalVolume
  for (const r of inRange) {
    const month = (r.date_time || '').slice(0, 7)
    const name = r.facilitator || 'Other'
    const txs = safeNum(r.total_txn), vol = safeNum(r.total_vol)
    if (!monthlyMap[month]) monthlyMap[month] = { txs: 0, vol: 0 }
    monthlyMap[month].txs += txs; monthlyMap[month].vol += vol
    if (!protocolMap[name]) protocolMap[name] = { txs: 0, vol: 0 }
    protocolMap[name].txs += txs; protocolMap[name].vol += vol
    totalTxs += txs; totalVolume += vol
  }
  return {
    ...baseline,
    cutoff: newCutoff,
    source: `${baseline.source} + folded ${foldMonths.join(', ')} on cutoff advance to ${newCutoff}`,
    totalTxs: Math.round(totalTxs),
    totalVolume: Math.round(totalVolume),
    facilitatorsTracked: Math.max(safeNum(baseline.facilitatorsTracked), Object.keys(protocolMap).length),
    monthly: Object.entries(monthlyMap).sort(([a], [b]) => a.localeCompare(b))
      .map(([month, v]) => ({ month, txs: Math.round(v.txs), vol: Math.round(v.vol) })),
    protocols: Object.entries(protocolMap).sort(([, a], [, b]) => b.txs - a.txs)
      .map(([name, v]) => ({ name, txs: Math.round(v.txs), vol: Math.round(v.vol) })),
  }
}

// Day keys ('2026-07-01') in [startDay, endDayExclusive)
function daysBetween(startDay, endDayExclusive) {
  const out = []
  let t = Date.parse(`${startDay}T00:00:00Z`)
  const end = Date.parse(`${endDayExclusive}T00:00:00Z`)
  while (t < end) {
    out.push(new Date(t).toISOString().slice(0, 10))
    t += 864e5
  }
  return out
}

// Fold day-grain x402 window rows (day, facilitator, total_txn, total_vol) in
// [baseline.cutoff, newCutoff) into the x402 baseline's monthly/protocol maps.
// x402 settles tens of thousands of txs per day, so a day with NO rows in a
// complete result signals an upstream problem — refuse to freeze it.
export function foldX402DayGrainWindow(baseline, windowRows, newCutoff) {
  if (!(newCutoff > baseline.cutoff)) throw new Error(`foldX402DayGrainWindow: newCutoff ${newCutoff} must be after current cutoff ${baseline.cutoff}`)
  const lo = baseline.cutoff.slice(0, 10), hi = newCutoff.slice(0, 10)
  const inRange = windowRows.filter(r => {
    const day = (r.day || '').slice(0, 10)
    return day && day >= lo && day < hi
  })
  const covered = new Set(inRange.map(r => (r.day || '').slice(0, 10)))
  for (const day of daysBetween(lo, hi)) {
    if (!covered.has(day)) throw new Error(`foldX402DayGrainWindow: window result has no rows for ${day} — refusing to freeze an uncovered day`)
  }
  const monthlyMap = Object.fromEntries(baseline.monthly.map(m => [m.month, { txs: m.txs, vol: m.vol }]))
  const protocolMap = Object.fromEntries(baseline.protocols.map(p => [p.name, { txs: p.txs, vol: p.vol || 0 }]))
  let totalTxs = baseline.totalTxs, totalVolume = baseline.totalVolume
  for (const r of inRange) {
    const month = (r.day || '').slice(0, 7)
    const name = r.facilitator || 'Other'
    const txs = safeNum(r.total_txn), vol = safeNum(r.total_vol)
    if (!monthlyMap[month]) monthlyMap[month] = { txs: 0, vol: 0 }
    monthlyMap[month].txs += txs; monthlyMap[month].vol += vol
    if (!protocolMap[name]) protocolMap[name] = { txs: 0, vol: 0 }
    protocolMap[name].txs += txs; protocolMap[name].vol += vol
    totalTxs += txs; totalVolume += vol
  }
  return {
    ...baseline,
    cutoff: newCutoff,
    source: `${baseline.source} + folded days [${lo}, ${hi})`,
    totalTxs: Math.round(totalTxs),
    totalVolume: Math.round(totalVolume),
    facilitatorsTracked: Math.max(safeNum(baseline.facilitatorsTracked), Object.keys(protocolMap).length),
    monthly: Object.entries(monthlyMap).sort(([a], [b]) => a.localeCompare(b))
      .map(([month, v]) => ({ month, txs: Math.round(v.txs), vol: Math.round(v.vol) })),
    protocols: Object.entries(protocolMap).sort(([, a], [, b]) => b.txs - a.txs)
      .map(([name, v]) => ({ name, txs: Math.round(v.txs), vol: Math.round(v.vol) })),
  }
}

// Fold x402 DAILY-series window rows (period, txs — per day per project) in
// [baseline.cutoff, newCutoff) into baselines.x402Daily.daily. Same density
// argument as above: every day must be covered.
export function foldX402DailySeries(baseline, windowRows, newCutoff) {
  if (!(newCutoff > baseline.cutoff)) throw new Error(`foldX402DailySeries: newCutoff ${newCutoff} must be after current cutoff ${baseline.cutoff}`)
  const lo = baseline.cutoff.slice(0, 10), hi = newCutoff.slice(0, 10)
  const inRange = windowRows.filter(r => {
    const day = (r.period || '').slice(0, 10)
    return day && day >= lo && day < hi
  })
  const covered = new Set(inRange.map(r => (r.period || '').slice(0, 10)))
  for (const day of daysBetween(lo, hi)) {
    if (!covered.has(day)) throw new Error(`foldX402DailySeries: window result has no rows for ${day} — refusing to freeze an uncovered day`)
  }
  const dailyMap = Object.fromEntries((baseline.daily || []).map(d => [d.day, d.txs]))
  for (const r of inRange) {
    const day = (r.period || '').slice(0, 10)
    dailyMap[day] = (dailyMap[day] || 0) + safeNum(r.txs)
  }
  return {
    ...baseline,
    cutoff: newCutoff,
    source: `${baseline.source} + folded days [${lo}, ${hi})`,
    daily: Object.entries(dailyMap).sort(([a], [b]) => a.localeCompare(b)).map(([day, txs]) => ({ day, txs: Math.round(txs) })),
  }
}

// Fold Virtuals ACP window rows (period, num_of_memo, unique_sender — per day
// per protocol version) in [baseline.cutoff, newCutoff). ACP volume is low
// enough that a legitimately memo-less day is possible, so coverage only
// requires SOME rows in range (the pipeline separately guarantees the result
// was complete and untruncated before folding).
export function foldVirtualsWindow(baseline, windowRows, newCutoff) {
  if (!(newCutoff > baseline.cutoff)) throw new Error(`foldVirtualsWindow: newCutoff ${newCutoff} must be after current cutoff ${baseline.cutoff}`)
  const lo = baseline.cutoff.slice(0, 10), hi = newCutoff.slice(0, 10)
  const inRange = windowRows.filter(r => {
    const day = (r.period || '').slice(0, 10)
    return day && day >= lo && day < hi
  })
  if (inRange.length === 0) throw new Error(`foldVirtualsWindow: window result has no rows in [${lo}, ${hi}) — refusing to freeze an uncovered span`)
  const dailyMap = Object.fromEntries((baseline.daily || []).map(d => [d.day, { memos: d.memos, senders: d.senders }]))
  let totalMemos = safeNum(baseline.totalMemos)
  for (const r of inRange) {
    const day = (r.period || '').slice(0, 10)
    if (!dailyMap[day]) dailyMap[day] = { memos: 0, senders: 0 }
    const memos = safeNum(r.num_of_memo)
    dailyMap[day].memos += memos
    dailyMap[day].senders = Math.max(dailyMap[day].senders, safeNum(r.unique_sender))
    totalMemos += memos
  }
  return {
    ...baseline,
    cutoff: newCutoff,
    source: `${baseline.source} + folded days [${lo}, ${hi})`,
    totalMemos: Math.round(totalMemos),
    daily: Object.entries(dailyMap).sort(([a], [b]) => a.localeCompare(b))
      .map(([day, v]) => ({ day, memos: Math.round(v.memos), senders: Math.round(v.senders) })),
  }
}

// Fold Olas weekly rows (time, chain, total_weekly_transactions_number) into
// the olas baseline. Only CLOSED weeks fold: a week starting w is closed when
// w + 7d <= targetCutoff, and the returned cutoff snaps to the last folded
// week's end so a week is never split between baseline and window.
export function foldOlasWindow(baseline, windowRows, targetCutoff) {
  const lo = baseline.cutoff.slice(0, 10)
  const target = targetCutoff.slice(0, 10)
  const weekEnd = w => new Date(Date.parse(`${w}T00:00:00Z`) + 7 * 864e5).toISOString().slice(0, 10)
  const foldable = windowRows.filter(r => {
    const week = (r.time || '').slice(0, 10)
    return week && week >= lo && weekEnd(week) <= target
  })
  if (foldable.length === 0) throw new Error(`foldOlasWindow: no closed weeks in [${lo}, ${target}) — nothing to fold`)
  const newCutoff = weekEnd(foldable.map(r => (r.time || '').slice(0, 10)).sort().at(-1))
  const chains = Object.fromEntries((baseline.chains || []).map(c => [c.name, c.txs]))
  const weekMap = Object.fromEntries((baseline.weekly || []).map(w => [w.week, w.txs]))
  let totalTxs = safeNum(baseline.totalTxs)
  for (const r of foldable) {
    const week = (r.time || '').slice(0, 10)
    const txs = safeNum(r.total_weekly_transactions_number)
    const name = chainName(r.chain || '')
    chains[name] = (chains[name] || 0) + txs
    weekMap[week] = (weekMap[week] || 0) + txs
    totalTxs += txs
  }
  return {
    ...baseline,
    cutoff: newCutoff,
    source: `${baseline.source} + folded weeks [${lo}, ${newCutoff})`,
    totalTxs: Math.round(totalTxs),
    chains: Object.entries(chains).sort(([, a], [, b]) => b - a).map(([name, txs]) => ({ name, txs: Math.round(txs) })),
    weekly: Object.entries(weekMap).sort(([a], [b]) => a.localeCompare(b)).map(([week, txs]) => ({ week, txs: Math.round(txs) })),
  }
}

// Fold window days [baseline.cutoff, newCutoff) into the registry baseline.
export function foldRegistryWindow(baseline, windowRows, newCutoff) {
  if (!(newCutoff > baseline.cutoff)) throw new Error(`foldRegistryWindow: newCutoff ${newCutoff} must be after current cutoff ${baseline.cutoff}`)
  const lo = baseline.cutoff.slice(0, 10), hi = newCutoff.slice(0, 10)
  const inRange = windowRows.filter(r => {
    const day = (r.block_date || '').slice(0, 10)
    return day && day >= lo && day < hi && !TESTNETS.has(r.blockchain || '')
  })
  if (inRange.length === 0) throw new Error(`foldRegistryWindow: window result has no rows in [${lo}, ${hi}) — refusing to freeze an uncovered span`)
  const chains = Object.fromEntries(baseline.chains.map(c => [c.name, c.agents]))
  const dailyMap = Object.fromEntries(baseline.daily.map(d => [d.day, d.agents]))
  let totalAgents = baseline.totalAgents
  for (const r of inRange) {
    const reg = safeNum(r.registered)
    const name = chainName(r.blockchain)
    const day = (r.block_date || '').slice(0, 10)
    chains[name] = (chains[name] || 0) + reg
    dailyMap[day] = (dailyMap[day] || 0) + reg
    totalAgents += reg
  }
  return {
    ...baseline,
    cutoff: newCutoff,
    source: `${baseline.source} + folded [${lo}, ${hi})`,
    totalAgents,
    chains: Object.entries(chains).sort(([, a], [, b]) => b - a).map(([name, agents]) => ({ name, agents })),
    daily: Object.entries(dailyMap).sort(([a], [b]) => a.localeCompare(b)).map(([day, agents]) => ({ day, agents })),
  }
}
