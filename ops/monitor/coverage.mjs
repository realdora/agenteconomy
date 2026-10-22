import { x402ContractIssues, validDay, validCount } from '../../scripts/dune/x402-contract.mjs'
const DAY = 86400000
export function currentCoinbaseBaseAddresses(source) {
  const section = source?.split('[Network.BASE]: [')[1]?.split('[Network.SOLANA]')[0]
  if (!section) throw Error('Reference registry layout changed')
  const addresses = [...section.matchAll(/\{\s*address:\s*['"](0x[a-fA-F0-9]{40})['"]\s*,([\s\S]*?)\}/g)]
    .filter(m => !m[2].includes('deprecated: true')).map(m => m[1].toLowerCase())
  if (!addresses.length) throw Error('Reference registry returned no active addresses')
  return [...new Set(addresses)]
}
export function completeX402Days(data, now) {
  const stamp = Date.parse(data?.meta?.queries?.x402Daily?.executedAt)
  if (!Number.isFinite(stamp) || !Array.isArray(data?.x402?.daily)) return []
  const cutoff = new Date(Math.min(now,stamp)).toISOString().slice(0,10)
  return data.x402.daily.filter(r=>r && validDay(r.day) && validCount(r.txs) && r.day < cutoff).sort((a,b)=>a.day.localeCompare(b.day))
}
export function inspectX402Coverage(data, reference, previous = {}, now = Date.now()) {
  const issues = x402ContractIssues(data), observations = {}, coverage = data?.x402?.coverage
  if (validDay(coverage?.reviewedAt) && now-Date.parse(coverage.reviewedAt)>30*DAY) issues.push({id:'registry.reviewDue',detail:'x402 覆盖名单超过30天未复核。自动地址对照目前只覆盖 Coinbase Base；请复核其他 facilitator、链与官方入口，不能把任务成功当成市场覆盖完整。'})
  try {
    if (reference?.error || !reference?.source) throw Error(reference?.error || 'Reference unavailable')
    const known = new Set((Array.isArray(coverage?.coinbaseBaseAddresses) ? coverage.coinbaseBaseAddresses : []).filter(a=>typeof a==='string').map(a=>a.toLowerCase()))
    const missing = currentCoinbaseBaseAddresses(reference.source).filter(a => !known.has(a))
    if (missing.length) issues.push({ id: 'registry.coinbaseBase', detail: `Coinbase Base 参考名单出现 ${missing.length} 个未覆盖地址，需核验后更新；不会自动加入统计或执行付费查询。` })
  } catch (e) { issues.push({ id: 'registry.reference', detail: `无法核对 Coinbase Base 地址覆盖：${e.message}。` }) }
  const daily = completeX402Days(data,now), tail = daily.slice(-9), latest = daily.at(-1)?.day
  // Freeze the pre-incident baseline. A prolonged outage must not become the
  // new normal simply because low days rolled into the moving average.
  let drop = previous['x402.activityDrop'] || null
  if (!drop && tail.length===9 && tail.every((r,i)=>!i || Date.parse(r.day)-Date.parse(tail[i-1].day)===DAY)) {
    const baseline = tail.slice(0,7).reduce((s,r)=>s+r.txs,0)/7
    if (baseline>=1000 && tail.slice(-2).every(r=>r.txs<baseline*.2)) drop={baseline, since:tail.at(-2).day}
  }
  if (drop && daily.length>=2 && !issues.some(i=>i.id.startsWith('contract.'))) {
    const last = daily.slice(-2)
    if (Date.parse(last[1].day)-Date.parse(last[0].day)===DAY && last[0].day>drop.since && last.every(r=>r.txs>=drop.baseline*.5)) drop=null
  }
  if (drop) issues.push({id:'activity.x402Drop',detail:`x402 自 ${drop.since} 起骤降，事发前7日均值 ${Math.round(drop.baseline)} 笔；尚未连续两个完整日恢复到该基准的50%。需区分真实活动变化与覆盖缺口。`})
  observations['x402.activityDrop']=drop
  const groups = (Array.isArray(data?.x402?.recentFacilitators) ? data.x402.recentFacilitators : []).filter(r=>r && r.day===latest && typeof r.project==='string' && validCount(r.txs))
  const alerts = { ...(previous['x402.facilitatorAlerts']||{}) }
  if (latest && !issues.some(i=>i.id.startsWith('contract.'))) {
    const counts = Object.fromEntries(groups.map(r=>[r.project,r.txs]))
    const old = previous['x402.facilitatorDay']
    const comparison = old?.day===latest ? old.previous : old
    if (comparison && comparison.day<latest && Date.parse(latest)-Date.parse(comparison.day)<=3*DAY) {
      for(const [name,n] of Object.entries(comparison.counts)) if(n>=1000 && (counts[name]||0)<n*.1 && !alerts[name]) alerts[name]={day:comparison.day,count:n}
    }
    for(const [name,alert] of Object.entries(alerts)) if((counts[name]||0)>=alert.count*.5) delete alerts[name]
    observations['x402.facilitatorDay']={day:latest,counts,previous:comparison ? {day:comparison.day,counts:comparison.counts}:null}
  }
  for(const [name,alert] of Object.entries(alerts)) issues.push({id:`activity.facilitator.${name}`,detail:`${name} 相比 ${alert.day} 的 ${alert.count} 笔骤降后尚未恢复；请核实活动或地址变化，不能仅因低值持续数日就视为恢复。`})
  observations['x402.facilitatorAlerts']=alerts
  return {issues,observations}
}

// Inspect what visitors actually see, independently of the JSON endpoint.
// Allow two hours for the hourly ISR and edge caches after a source refresh.
export function inspectX402Page(data, page, now=Date.now()) {
  const stamp=Date.parse(data?.meta?.queries?.x402Daily?.executedAt)
  if(!Number.isFinite(stamp) || now-stamp<2*3600000) return []
  const latest=completeX402Days(data,now).at(-1)
  if(!latest) return []
  if(page?.error || typeof page?.source!=='string') return [{id:'page.x402',detail:`无法检查实际 x402 日指标页面：${page?.error||'响应缺失'}。JSON 更新成功不能证明页面已更新。`}]
  const text=page.source.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi,'').replace(/<[^>]+>/g,' ').replace(/\s+/g,' ')
  const match=text.match(/recorded ([\d,]+) transactions on (\d{4}-\d{2}-\d{2}), the latest complete UTC day/)
  if(!match) return [{id:'page.x402',detail:'x402 页面完整日摘要无法识别；请检查展示或页面结构，不能默认为正常。'}]
  if(match[2]!==latest.day || Number(match[1].replaceAll(',',''))!==latest.txs) return [{id:'page.x402',detail:`x402 页面显示 ${match[2]} 的 ${match[1]} 笔，应为 ${latest.day} 的 ${latest.txs} 笔；已超过两小时缓存宽限。`}]
  return []
}
