// Add only the independently measured, disjoint address delta to frozen data.
// The recent window is deliberately excluded; its new SQL will include it once.
export function applyCoverageBackfill(input, rows, revision) {
  const out = structuredClone(input)
  const { version, backfillFrom, addresses } = revision
  if (out.x402.coverage?.registryVersion === version) throw Error('Revision already applied')
  const allowed = new Set(addresses.map(a => a.address))
  const seen = new Set()
  for (const r of rows) {
    const day = String(r.day).slice(0, 10), key = `${day}:${r.address}`
    if (!allowed.has(r.address) || day < backfillFrom || seen.has(key)) throw Error('Invalid/duplicate delta row')
    seen.add(key)
    for (const k of ['daily_txs', 'transfer_txs', 'usdc_txs']) if (!Number.isSafeInteger(r[k]) || r[k] < 0) throw Error('Invalid delta count')
    if (!Number.isFinite(r.volume) || r.volume < 0) throw Error('Invalid delta volume')
  }
  const monthly = new Map(out.x402.monthly.map(r => [r.month, r]))
  const daily = new Map(out.x402Daily.daily.map(r => [r.day, r]))
  const coinbase = out.x402.protocols.find(p => p.name === 'Coinbase')
  if (!coinbase) throw Error('Expected existing Coinbase baseline')
  let txs = 0, volume = 0, dailyTxs = 0, chainTxs = 0
  for (const r of rows) {
    const day = String(r.day).slice(0, 10)
    if (day < out.x402.cutoff) {
      const m = monthly.get(day.slice(0, 7)); if (!m) throw Error('Missing baseline month')
      m.txs += r.transfer_txs; m.vol += r.volume
      txs += r.transfer_txs; volume += r.volume
    }
    if (day < out.x402Daily.cutoff) {
      const d = daily.get(day); if (!d) throw Error('Missing baseline day')
      d.txs += r.daily_txs; dailyTxs += r.daily_txs
    }
    if (day < out.x402Chains.cutoff) chainTxs += r.transfer_txs
  }
  out.x402.totalTxs += txs; out.x402.totalVolume = Math.round(out.x402.totalVolume + volume)
  coinbase.txs += txs; coinbase.vol = Math.round((coinbase.vol || 0) + volume)
  for (const m of out.x402.monthly) m.vol = Math.round(m.vol)
  out.x402Chains.counts.base += chainTxs
  const coverage = { registryVersion: version, reviewedAt: revision.reviewedAt, expandedCoverageFrom: backfillFrom,
    coinbaseBaseAddresses: [...allowed], reference: revision.reference,
    note: `Coinbase Base coverage expanded and backfilled from ${backfillFrom}. Earlier frozen aggregates retain their historical scope; this is tracked-address activity, not an exhaustive payment census.` }
  for (const k of ['x402', 'x402Daily', 'x402Chains']) {
    out[k].coverage = coverage
    out[k].source += `; ${version} verified disjoint Coinbase Base delta from ${backfillFrom}`
  }
  out.x402Chains.registryVersion = version
  return { baselines: out, added: { cumulativeTxs: txs, cumulativeVolume: volume, dailyTxs, chainTxs } }
}
