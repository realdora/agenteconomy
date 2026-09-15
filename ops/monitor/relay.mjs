// Run only in our trusted workflow; never check out workflow_run head code.
const base = process.env.DATA_MONITOR_URL
if (!base || !/^https:\/\/[a-z0-9.-]+\.workers\.dev\/?$/.test(base)) throw Error('Invalid monitor URL')
const root = base.replace(/\/$/, '')
const mode = process.env.MONITOR_MODE
if (mode === 'heartbeat') {
  let healthy = false
  try { const r = await fetch(root + '/health', { signal: AbortSignal.timeout(20000) }); healthy = r.ok && (await r.json()).ok === true } catch {}
  if (healthy) { console.log('Independent monitor heartbeat healthy'); process.exit(0) }
  if (!process.env.RESEND_API_KEY || !process.env.ALERT_TO || !process.env.ALERT_FROM) throw Error('Monitor heartbeat failed; fallback mail is not configured')
  const date = new Date().toISOString().slice(0, 10)
  const r = await fetch('https://api.resend.com/emails', {
    method: 'POST', signal: AbortSignal.timeout(20000),
    headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json', 'Idempotency-Key': `ae-monitor-heartbeat-${date}` },
    body: JSON.stringify({ from: process.env.ALERT_FROM, to: [process.env.ALERT_TO], subject: '[Agent Economy] 监控服务需要检查', text: `每日监控超过允许时间未成功检查，或邮件发送出现错误。\n请检查 Cloudflare Worker 和发信配置。\n这不等于网站数据已经丢失。\n检查日期：${date}\nhttps://github.com/realdora/agenteconomy/actions` }),
  })
  if (!r.ok || !(await r.json()).id) throw Error('Monitor heartbeat failed; fallback email not accepted')
  throw Error('Monitor heartbeat failed; fallback email accepted by provider')
}
if (!process.env.MONITOR_TOKEN) throw Error('Monitor token missing')
const event = JSON.parse(process.env.RUN_EVENT || '{}')
const payload = { name: event.name, id: event.id, conclusion: event.conclusion }
const r = await fetch(root + '/event', {
  method: 'POST', signal: AbortSignal.timeout(35000),
  headers: { Authorization: `Bearer ${process.env.MONITOR_TOKEN}`, 'Content-Type': 'application/json' },
  body: JSON.stringify(payload),
})
if (!r.ok) throw Error(`Monitor event relay failed: HTTP ${r.status}`)
console.log('Workflow completion relayed to monitor')
