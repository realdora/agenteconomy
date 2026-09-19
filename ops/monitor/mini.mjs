const DAY = 86400000
const date = ms => new Date(ms).toISOString().slice(0, 10)
const validDate = v => typeof v === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(v) && Number.isFinite(Date.parse(v)) && date(Date.parse(v)) === v
const validStamp = v => typeof v === 'string' && v.length <= 40 && Number.isFinite(Date.parse(v))
const statuses = ['healthy', 'error', 'running', 'catching-up', 'expired', 'disabled', 'missing']
function shape(value, fields) {
  if (!value || typeof value !== 'object' || Array.isArray(value) || Object.keys(value).some(k => !fields.includes(k))) throw Error('Invalid Mini fields')
}
export function validateMini(payload, now = Date.now()) {
  shape(payload, ['version', 'sentAt', 'diskFreeGiB', 'tempo', 'archive', 'backup'])
  if (payload.version !== 1 || !validStamp(payload.sentAt) || Date.parse(payload.sentAt) > now + 60000 || now - Date.parse(payload.sentAt) > 6 * 3600000) throw Error('Invalid Mini timestamp')
  if (payload.diskFreeGiB !== null && (!Number.isFinite(payload.diskFreeGiB) || payload.diskFreeGiB < 0 || payload.diskFreeGiB > 1000000)) throw Error('Invalid disk value')
  const schema = { tempo: ['status', 'lastSuccessAt', 'through'], archive: ['status', 'lastSuccessDate'], backup: ['status', 'lastUploadDate', 'archiveThrough', 'lastRestoredAt'] }
  for (const [name, fields] of Object.entries(schema)) {
    shape(payload[name], fields)
    if (!statuses.includes(payload[name].status)) throw Error('Invalid Mini status')
    for (const field of fields.filter(f => f !== 'status')) {
      const value = payload[name][field]
      if (value === null) continue
      if (field.endsWith('At') ? !validStamp(value) || Date.parse(value) > now + 60000 : !validDate(value) || value > date(now)) throw Error('Invalid Mini coverage')
    }
  }
  return payload
}
export async function readMini(request, now) {
  if (Number(request.headers.get('Content-Length')) > 4096 || !request.body) throw Error('Invalid Mini body size')
  const reader = request.body.getReader(), chunks = []; let length = 0
  try {
    for (;;) { const {done, value} = await reader.read(); if (done) break; length += value.length; if (length > 4096) throw Error('Mini body too large'); chunks.push(value) }
  } finally { await reader.cancel() }
  const bytes = new Uint8Array(length); let offset = 0
  for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.length }
  return validateMini(JSON.parse(new TextDecoder().decode(bytes)), now)
}
export function inspectMini(record, now = Date.now()) {
  const issues = [], add = (id, detail) => issues.push({id:'mini.' + id, detail})
  const due = date(now - DAY)
  const p = record?.payload
  if (!p || !validStamp(record.receivedAt) || now - Date.parse(record.receivedAt) > 36 * 3600000 || now - Date.parse(p.sentAt) > 36 * 3600000) {
    add('heartbeat', `Mini 超过36小时没有有效健康摘要（最后收到：${record?.receivedAt || '从未收到'}）。请检查家里网络、电源、Tailscale及备份任务；网站可能仍正常更新。`)
  }
  if (p) {
    for (const [name, label] of [['tempo', 'Tempo影子采集'], ['archive', '每日生产归档'], ['backup', 'R2备份']]) {
      if (p[name].status !== 'healthy') add('status.' + name, `${label}最近状态为 ${p[name].status}，请检查 Mini 上对应任务记录。`)
    }
    if (!p.archive.lastSuccessDate || p.archive.lastSuccessDate < due) add('archive', `Mini生产归档应至少完成 ${due}；最近成功日期：${p.archive.lastSuccessDate || '缺失'}。`)
    if (!p.backup.lastUploadDate || p.backup.lastUploadDate < due) add('backup', `R2备份应至少完成 ${due}；最近成功上传日期：${p.backup.lastUploadDate || '缺失'}。`)
    if (!p.backup.archiveThrough || p.backup.archiveThrough < due) add('backupCoverage', `R2已封存备份应包含至少 ${due} 的生产归档；实际仅至 ${p.backup.archiveThrough || '缺失'}。上传成功不代表最新归档已包含。`)
    // Morning monitor observes the previous day's Mini report. That report
    // needs complete Tempo coverage through its own previous UTC day.
    const tempoDue = date(now - 2 * DAY)
    if (!p.tempo.through || p.tempo.through < tempoDue || !validStamp(p.tempo.lastSuccessAt) || now - Date.parse(p.tempo.lastSuccessAt) > 42 * 3600000) add('tempo', `Mini Tempo影子数据应至少覆盖 ${tempoDue}；当前至 ${p.tempo.through || '缺失'}，最近成功 ${p.tempo.lastSuccessAt || '缺失'}。`)
    if (!Number.isFinite(p.diskFreeGiB) || p.diskFreeGiB < 40) add('disk', `Mini可用磁盘 ${p.diskFreeGiB ?? '未知'} GiB，归档/备份要求至少40 GiB。`)
  }
  // Server-owned deadlines still alert if Mini is offline or its jobs expire.
  for (const [id, label, end, lead] of [
    ['archive', 'Dune归档试用读取', '2026-09-24T00:00:00Z', 3],
    ['pilot', 'Mini/R2备份试点', '2026-09-29T00:00:00Z', 3],
    ['credential', 'R2上传凭证', '2026-10-15T00:00:00Z', 7],
  ]) {
    const remaining = Date.parse(end) - now
    if (remaining <= lead * DAY) add('expiry.' + id, `${label}${remaining <= 0 ? '已到期' : '即将到期'}：${end.slice(0,10)}。需人工确认后续配置；监控不会自动续费、延长试用或替换凭证。`)
  }
  return issues
}
