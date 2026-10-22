export function currentCoinbaseBaseAddresses(source) {
  const section = source?.split('[Network.BASE]: [')[1]?.split('[Network.SOLANA]')[0]
  if (!section) throw Error('Reference registry layout changed')
  const addresses = [...section.matchAll(/\{\s*address: '(0x[a-fA-F0-9]{40})',([\s\S]*?)\}/g)]
    .filter(m => !m[2].includes('deprecated: true')).map(m => m[1].toLowerCase())
  if (!addresses.length) throw Error('Reference registry returned no active addresses')
  return [...new Set(addresses)]
}
export function inspectX402Coverage(data, reference, previous = {}, now = Date.now()) {
  const issues = [], observations = {}, coverage = data?.x402?.coverage
  if (coverage) {
    try {
      if (reference?.error || !reference?.source) throw Error(reference?.error || 'Reference unavailable')
      const known = new Set(coverage.coinbaseBaseAddresses || [])
      const missing = currentCoinbaseBaseAddresses(reference.source).filter(a => !known.has(a))
      if (missing.length) issues.push({ id: 'registry.coinbaseBase', detail: `Coinbase Base 参考名单出现 ${missing.length} 个未覆盖地址，需核验后更新；不会自动加入统计或执行付费查询。` })
    } catch (e) { issues.push({ id: 'registry.reference', detail: `无法核对 Coinbase Base 地址覆盖：${e.message}。` }) }
  }
  const stamp = Date.parse(data?.meta?.queries?.x402Daily?.executedAt)
  if (!Number.isFinite(stamp)) return { issues, observations }
  const cutoff = new Date(Math.min(now, stamp)).toISOString().slice(0,10)
  const daily = (data.x402?.daily || []).filter(r => r.day < cutoff).sort((a,b) => a.day.localeCompare(b.day))
  const tail = daily.slice(-9)
  if (tail.length === 9 && tail.every((r,i) => !i || Date.parse(r.day)-Date.parse(tail[i-1].day)===86400000)) {
    const average = tail.slice(0,7).reduce((s,r) => s+r.txs,0)/7
    if (average >= 1000 && tail.slice(-2).every(r => r.txs < average*.2)) issues.push({ id: 'activity.x402Drop', detail: 'x402 连续两个完整日交易数低于此前7日均值的20%；可能是真实活动下降或覆盖缺口，需要核查。' })
  }
  const latest = daily.at(-1)?.day
  const groups = (data.x402?.recentFacilitators || []).filter(r => r.day === latest)
  if (groups.length) {
    const counts = Object.fromEntries(groups.map(r => [r.project,r.txs]))
    const old = previous['x402.facilitatorDay']
    const comparison = old?.day === latest ? old.previous : old
    if (comparison && comparison.day < latest && Date.parse(latest)-Date.parse(comparison.day)<=3*86400000) {
      for (const [name,n] of Object.entries(comparison.counts)) if (n>=1000 && (counts[name]||0)<n*.1) issues.push({ id: `activity.facilitator.${name}`, detail: `${name} 从 ${comparison.day} 的 ${n} 笔降到 ${latest} 的 ${counts[name]||0} 笔；请核实活动或地址变化。` })
    }
    observations['x402.facilitatorDay'] = { day: latest, counts, previous: comparison ? { day: comparison.day, counts: comparison.counts } : null }
  }
  return { issues, observations }
}
