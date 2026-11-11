// Pure helpers for the coverage-extension collector (no network, no clock).
// Kept separate from fetch-coverage-extensions.mjs so they can be unit-tested.

const DAY_MS = 86400000
export const dayOf = value => String(value).slice(0, 10)
export const addDays = (day, n) => new Date(Date.parse(`${day}T00:00:00Z`) + n * DAY_MS).toISOString().slice(0, 10)
const isDay = value => /^\d{4}-\d{2}-\d{2}$/.test(value || '') && !Number.isNaN(Date.parse(`${value}T00:00:00Z`))

// Which complete UTC days to scan. Normal runs rescan the last `minDays`
// complete days; after an outage the window stretches back to the day after
// the last stored one, but never beyond `maxDays` (cost grows per window-day).
// `override` is the explicit backfill start and is the only way past maxDays.
export function chooseWindow({ today, lastStoredDay = null, minDays = 3, maxDays = 10, override = null }) {
  if (!isDay(today)) throw new Error(`invalid today: ${today}`)
  const end = addDays(today, -1) // last complete day
  if (override) {
    if (!isDay(override) || override > end) throw new Error(`invalid window override: ${override}`)
    return { start: override, end }
  }
  let start = addDays(end, -(minDays - 1))
  if (isDay(lastStoredDay) && addDays(lastStoredDay, 1) < start) start = addDays(lastStoredDay, 1)
  const floor = addDays(end, -(maxDays - 1))
  if (start < floor) start = floor
  return { start, end }
}

// Replace every stored row inside [start, end] with the fresh rows; keep
// everything outside. A day with no fresh rows inside the window is dropped,
// which is correct: the window was scanned and found nothing.
export function mergeByDay(stored, fresh, { start, end }) {
  const outside = (stored || []).filter(r => r.day < start || r.day > end)
  const inside = fresh.filter(r => r.day >= start && r.day <= end)
  return [...outside, ...inside].sort((a, b) => (a.day < b.day ? -1 : a.day > b.day ? 1 : 0))
}

const int = value => {
  const n = Number(value)
  if (!Number.isFinite(n) || n < 0) throw new Error(`non-numeric count: ${value}`)
  return Math.round(n)
}

export function parseAcpRows(rows) {
  return rows.map(r => ({
    day: dayOf(r.period),
    chain: String(r.blockchain),
    created: int(r.jobs_created),
    funded: int(r.jobs_funded),
    submitted: int(r.jobs_submitted),
    completed: int(r.jobs_completed),
    rejected: int(r.jobs_rejected),
    clients: int(r.unique_clients),
    providers: int(r.unique_providers),
  }))
}

export function parseSourceRows(rows, testnets = new Set()) {
  return rows
    .filter(r => !testnets.has(String(r.blockchain)))
    .map(r => ({
      day: dayOf(r.period),
      chain: String(r.blockchain),
      contract: String(r.contract_address).toLowerCase(),
      source: String(r.source),
      registered: int(r.registered),
      owners: int(r.unique_owners),
    }))
}

// Permanent per-day rollup of the source rows: total, the top named sources,
// and how much came from the canonical registry address.
const UNNAMED = new Set(['(long tail)', '(empty)', '(other)', 'data:', 'ipfs', 'arweave'])
export function rollupSources(rows, { registry, top = 5 }) {
  const days = new Map()
  for (const r of rows) {
    const d = days.get(r.day) || { day: r.day, total: 0, canonical: 0, bySource: new Map() }
    d.total += r.registered
    if (r.contract === registry) d.canonical += r.registered
    d.bySource.set(r.source, (d.bySource.get(r.source) || 0) + r.registered)
    days.set(r.day, d)
  }
  return [...days.values()].sort((a, b) => (a.day < b.day ? -1 : 1)).map(d => {
    const named = [...d.bySource].filter(([s]) => !UNNAMED.has(s)).sort((a, b) => b[1] - a[1] || (a[0] < b[0] ? -1 : 1))
    const topSources = named.slice(0, top).map(([source, registered]) => ({ source, registered }))
    const largest = topSources[0]?.registered || 0
    return { day: d.day, total: d.total, canonicalRegistry: d.canonical, exLargestSource: d.total - largest, topSources }
  })
}

// Headline for the trailing `days` complete days of the rollup.
export function summarizeSources(rollup, days = 7) {
  const recent = rollup.slice(-days)
  if (!recent.length) return null
  const total = recent.reduce((s, d) => s + d.total, 0)
  const bySource = new Map()
  for (const d of recent) for (const s of d.topSources) bySource.set(s.source, (bySource.get(s.source) || 0) + s.registered)
  const [largestSource, largestRegistered] = [...bySource].sort((a, b) => b[1] - a[1])[0] || [null, 0]
  return {
    from: recent[0].day,
    to: recent[recent.length - 1].day,
    days: recent.length,
    total,
    largestSource,
    largestRegistered,
    largestShare: total ? Math.round((largestRegistered / total) * 1000) / 1000 : 0,
    exLargest: total - largestRegistered,
  }
}

// The fresh ERC rows must reproduce the registry series already published in
// data.json for the same complete days. Days where the published value is
// lower are tolerated only for the published series' final day (it is written
// mid-day and therefore partial).
export function reconcileWithRegistry(rollup, publishedDaily) {
  const published = new Map((publishedDaily || []).map(d => [d.day, d.agents]))
  const lastPublished = [...published.keys()].sort().pop()
  const mismatches = []
  let compared = 0
  for (const d of rollup) {
    if (!published.has(d.day) || d.day === lastPublished) continue
    compared++
    if (published.get(d.day) !== d.total) mismatches.push({ day: d.day, published: published.get(d.day), sources: d.total })
  }
  return { compared, mismatches }
}
