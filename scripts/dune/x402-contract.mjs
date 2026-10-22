const DAY = 86400000
export const validDay = day => typeof day === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(day) && Number.isFinite(Date.parse(day)) && new Date(day).toISOString().slice(0,10) === day
export const validCount = n => Number.isSafeInteger(n) && n >= 0

// Structural failures block publication; genuine changes in activity do not.
// Shared by the publisher and the independent daily monitor. No network/SQL.
export function x402ContractIssues(data, { expectedVersion } = {}) {
  const issues = [], x = data?.x402, c = x?.coverage
  const add = (id, detail) => issues.push({ id, detail })
  if (!c?.registryVersion || !validDay(c?.reviewedAt) || !validDay(c?.expandedCoverageFrom) ||
      !Array.isArray(c?.coinbaseBaseAddresses) || !c.coinbaseBaseAddresses.length ||
      c.coinbaseBaseAddresses.some(a => typeof a !== 'string' || !/^0x[0-9a-fA-F]{40}$/.test(a)) ||
      new Set(c.coinbaseBaseAddresses.map(a=>a.toLowerCase())).size !== c.coinbaseBaseAddresses.length) {
    add('contract.x402Coverage', 'x402 覆盖版本、审查日期或地址名单缺失/无效；不能确认统计口径。')
  } else if (expectedVersion && c.registryVersion !== expectedVersion) {
    add('contract.x402Version', `x402 覆盖版本 ${c.registryVersion} 与已审核版本 ${expectedVersion} 不一致。`)
  }
  const stamp = Date.parse(data?.meta?.queries?.x402Daily?.executedAt)
  if (!Number.isFinite(stamp)) add('contract.x402Execution', 'x402 日频执行时间缺失，不能判断完整 UTC 日。')
  const cutoff = Number.isFinite(stamp) ? new Date(stamp).toISOString().slice(0,10) : null
  const daily = x?.daily
  if (!Array.isArray(daily) || !daily.length || daily.some(r => !r || !validDay(r.day) || !validCount(r.txs)) || new Set(daily.map(r=>r?.day)).size !== daily.length) {
    add('contract.x402Daily', 'x402 日频缺失、日期重复/无效或计数无效。')
    return issues
  }
  if (cutoff && daily.some(r=>r.day >= cutoff)) add('contract.x402PartialDay', 'x402 完整日序列包含执行当日或未来日期；拒绝将部分日当成全天。')
  const sorted = [...daily].sort((a,b)=>a.day.localeCompare(b.day))
  if (cutoff && sorted.at(-1).day !== new Date(Date.parse(cutoff)-DAY).toISOString().slice(0,10)) add('contract.x402LatestDay', 'x402 最新完整日未覆盖至执行日前一天；不能用新执行时间掩盖少了一天的数据。')
  const recent = sorted.slice(-7)
  if (recent.length < 7 || recent.some((r,i)=>i && Date.parse(r.day)-Date.parse(recent[i-1].day)!==DAY)) add('contract.x402Gap', 'x402 最近七个已采集日不连续；缺失不能当成零。')
  const groups = x?.recentFacilitators
  if (!Array.isArray(groups) || groups.some(r=>!r || !validDay(r.day) || !validCount(r.txs) || typeof r.project !== 'string' || !r.project.trim()) || new Set(groups.map(r=>`${r?.day}/${r?.project}`)).size !== groups.length) {
    add('contract.x402Facilitators', 'x402 贡献者明细缺失、重复或无效；无法检查头部来源是否消失。')
  } else {
    const totals = new Map()
    for (const r of groups) totals.set(r.day,(totals.get(r.day)||0)+r.txs)
    const byDay = new Map(daily.map(r=>[r.day,r.txs]))
    if ([...totals].some(([day,n])=>byDay.get(day)!==n) || (totals.get(sorted.at(-1).day)||0)!==sorted.at(-1).txs) add('contract.x402Reconcile', 'x402 贡献者明细合计与日总量不一致或最新日明细缺失。')
  }
  return issues
}

export function assertX402Contract(data, options) {
  const issues = x402ContractIssues(data, options)
  if (issues.length) throw Error(`x402 quality gate: refusing to publish\n${issues.map(i=>`${i.id}: ${i.detail}`).join('\n')}`)
}
