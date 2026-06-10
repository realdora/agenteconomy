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
