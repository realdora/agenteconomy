export const WORKFLOWS = ['Update Dune Data', 'Update Tempo Data', 'Update Web Sources', 'Update Dashboard']
const HOUR = 3600000
const age = (date, now) => (now - Date.parse(date)) / HOUR
const get = (object, path) => path.split('.').reduce((v, k) => v?.[k], object)
const queryHours = { x402Cumulative: 54, x402Daily: 54, x402Chains: 54, x402TokenSplit: 54, baseAgentic: 54, virtualsAcp: 54, erc8004Registry: 120, olas: 360 }

export function monitorHealthy(state, now, emailEnabled) {
  const today = new Date(now).toISOString().slice(0, 10)
  // By 08:17 UTC today's 07:17 check must have completed. The external
  // 08:47 watchdog must catch a missed run today, not only tomorrow.
  const todayRequired = now >= Date.parse(`${today}T08:17:00Z`)
  return emailEnabled && !state.deliveryError && age(state.lastDailyAt, now) < 30 &&
    (!todayRequired || String(state.lastDailyAt).slice(0, 10) === today)
}

export function inspectFeeds(feeds, previous = {}, now = Date.now()) {
  const issues = [], observations = {}
  const add = (id, detail) => issues.push({ id, detail })
  function freshness(id, stamp, hours) {
    const h = age(stamp, now)
    if (!Number.isFinite(h) || h < -1 || h > hours) add(id, `最后有效时间 ${stamp || '缺失'}；允许延迟 ${hours} 小时。`)
  }
  for (const name of ['canonical', 'apex', 'dashboard', 'tempo', 'web']) {
    if (!feeds[name] || feeds[name].error) add(`fetch.${name}`, `无法检查 ${name}：${feeds[name]?.error || '响应缺失'}`)
  }
  const data = feeds.canonical
  if (data && !data.error) {
    for (const [key, hours] of Object.entries(queryHours)) {
      freshness(`source.${key}`, data.meta?.queries?.[key]?.executedAt, hours)
    }
    // Coverage is independent of a recent successful query or overall updatedAt.
    const yesterday = new Date(now - 86400000).toISOString().slice(0, 10)
    for (const [key, stamp] of [
      ['x402Chains', data.x402?.chainsAsOf],
      ['x402Daily', [...(data.x402?.daily || [])].map(r => r.day).filter(Boolean).sort().at(-1)],
    ]) {
      if (!stamp || String(stamp).slice(0, 10) < yesterday) add(`coverage.${key}`, `${key === 'x402Chains' ? 'x402 分链' : 'x402 日频'}应覆盖至 ${yesterday}；当前仅覆盖至 ${stamp || '未知'}。请检查是否漏跑或上游未推进。`)
    }
    for (const field of ['x402.totalTxs', 'x402.totalVolume', 'baseAgentic.totalTxs', 'virtualsAcp.totalMemos', 'erc8004Registry.totalAgents', 'olas.totalTxs']) {
      const value = get(data, field)
      if (typeof value !== 'number' || !Number.isFinite(value) || value < 0) add(`value.${field}`, `${field} 缺失或不是有效非负数。`)
      else {
        const prior = previous[field]
        if (prior > 0 && value < prior * .98) add(`drop.${field}`, `${field} 从 ${prior} 降到 ${value}，超过 2% 回退门槛。需核对口径或数据完整性。`)
        else observations[field] = value
      }
    }
    const daily = data.x402?.daily || [], seen = new Set()
    for (const row of daily) {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(row.day) || seen.has(row.day) || !Number.isSafeInteger(row.txs) || row.txs < 0) add('shape.x402Daily', '日频出现无效日期、重复日期或无效计数。')
      seen.add(row.day)
    }
    for (let n = 1; n <= 7; n++) {
      const day = new Date(now - n * 86400000).toISOString().slice(0, 10)
      if (!seen.has(day)) add('gap.x402Daily', `最近 7 个完整日中缺少 ${day}；不自动当成零交易。`)
    }
    if (!Array.isArray(data.x402?.chains) || !data.x402.chains.length || data.x402.chains.some(c => !Number.isSafeInteger(c.txs) || c.txs < 0)) add('shape.x402Chains', '分链数据缺失或计数无效。')
    // Compare only settled versions; allow one hour for a new deployment/cache.
    for (const name of ['apex', 'dashboard']) {
      if (!feeds[name] || feeds[name].error) continue
      for (const key of Object.keys(queryHours)) {
        const current = data.meta?.queries?.[key], served = feeds[name].meta?.queries?.[key]
        if (current?.executionId && age(current.executedAt, now) > 1 && current.executionId !== served?.executionId) add(`publish.${name}.${key}`, `${name} 仍未展示 ${key} 的最新执行结果。`)
      }
      if (age(data.meta?.queries?.x402Chains?.executedAt, now) > 1 && JSON.stringify(data.x402?.chains) !== JSON.stringify(feeds[name].x402?.chains)) add(`publish.${name}.chainValues`, `${name} 分链数值与仓库已发布快照不一致。`)
    }
  }
  if (feeds.tempo && !feeds.tempo.error) freshness('source.tempo', feeds.tempo.updatedAt, 30)
  if (feeds.web && !feeds.web.error) {
    for (const key of ['agentTokens', 'x402Services', 'agentSupply', 'virtuals', 'devAdoption', 'masumi', 'solanaAgents', 'standardsAdoption', 'inferenceDemand', 'x402TokenSplit']) freshness(`web.${key}`, feeds.web[key]?.asOf, key === 'standardsAdoption' ? 192 : 54)
  }
  return { issues: [...new Map(issues.map(i => [i.id, i])).values()], observations: { ...previous, ...observations } }
}

export function inspectRuns(runs, now = Date.now()) {
  const issues = []
  for (const name of WORKFLOWS) {
    const all = runs.filter(r => r.name === name && r.head_branch === 'main').sort((a, b) => b.id - a.id)
    const completed = all.find(r => r.status === 'completed')
    if (!completed || age(completed.updated_at, now) > 30) issues.push({ id: `task.missing.${name}`, detail: `${name} 超过 30 小时没有完成记录。` })
    if (completed && completed.conclusion !== 'success') issues.push({ id: `task.failed.${name}`, detail: `${name} 状态：${completed.conclusion}。${completed.html_url}` })
  }
  return issues
}

// Trusted completion callbacks already arrive from GitHub Actions. Use them
// for the daily watchdog instead of an anonymous, IP-rate-limited API read.
export function inspectEvents(events = {}, now = Date.now()) {
  return inspectRuns(Object.entries(events).map(([name, event]) => ({
    name, id: event.id, head_branch: 'main', status: 'completed',
    conclusion: event.conclusion, updated_at: event.completedAt || event.at,
    html_url: `https://github.com/realdora/agenteconomy/actions/runs/${event.id}`,
  })), now).map(issue => issue.id.startsWith('task.missing.') ? {
    ...issue, detail: `${issue.id.slice('task.missing.'.length)} 超过 30 小时没有有效完成回调；请检查任务是否漏跑或回调投递失败。`,
  } : issue)
}

export function notificationPlan(state, issues, now, { test = false } = {}) {
  if (test) return { kind: 'test', ids: [], subject: '[Agent Economy] 监控测试邮件', text: '这是一封测试邮件，不代表生产故障。\n每日巡检一次；正常时不发邮件。异常首次通知，持续异常每天最多提醒一次，恢复后通知一次。' }
  const ids = [...new Set(issues.map(i => i.id))].sort()
  const notified = state.notifiedIds || []
  if (!ids.length && !notified.length) return null
  const newIssue = ids.some(id => !notified.includes(id))
  const recovery = !ids.length && notified.length > 0
  const reminder = ids.length && age(state.lastSentAt, now) >= 24
  if (!newIssue && !recovery && !reminder) return null
  const kind = recovery ? 'recovery' : newIssue ? 'alert' : 'reminder'
  return {
    kind, ids,
    subject: `[Agent Economy] ${recovery ? '监控异常已恢复' : newIssue ? '数据监控发现异常' : '数据异常仍未恢复'}`,
    text: recovery ? '此前通知的异常已通过本次检查。\nhttps://dashboard.agenteconomy.to/' :
      issues.map(i => `• ${i.detail}`).join('\n\n') + '\n\n影响：部分数据可能延迟或不完整，请以各指标真实截至时间为准。\n监控只读，不会补零、修改生产数据或自动执行收费查询。\n运行记录：https://github.com/realdora/agenteconomy/actions\n分链页面：https://dashboard.agenteconomy.to/x402.html',
  }
}
