// scripts/dune/reset-and-backfill.mjs — clean rebuild of an incremental fork.
//
// 1. PATCH the query with an empty-result SQL and execute it once, so
//    previous.query.result() starts from 0 rows (purges any prior corruption).
// 2. PATCH the real incremental SQL back.
// 3. Drive the bounded backfill to convergence (reusing the same loop as
//    backfill.mjs), then assert there are no duplicate (key...) rows — a
//    duplicate would mean the merge boundary double-counts.
//
// Usage:
//   node scripts/dune/reset-and-backfill.mjs <queryId> <sqlFile> <dateField> <dupKeyCols> [--window-runs=12]
//   dupKeyCols: comma-separated columns whose combination must be unique
//
// Reads DUNE_API_KEY from env.

import { readFileSync } from 'fs'

const API_KEY = process.env.DUNE_API_KEY
const BASE = process.env.DUNE_API_BASE || 'https://api.dune.com/api/v1'
if (!API_KEY) { console.error('Missing DUNE_API_KEY'); process.exit(1) }

const [queryId, sqlFile, dateField, dupKeyCols] = process.argv.slice(2)
const opts = Object.fromEntries(process.argv.slice(6).map(a => a.replace(/^--/, '').split('=')))
const MAX_RUNS = Number(opts['window-runs'] || 12)
if (!queryId || !sqlFile || !dateField || !dupKeyCols) {
  console.error('Usage: reset-and-backfill.mjs <queryId> <sqlFile> <dateField> <dupKeyCols>')
  process.exit(1)
}
const keyCols = dupKeyCols.split(',')

const headers = { 'x-dune-api-key': API_KEY, 'Content-Type': 'application/json' }
const sleep = ms => new Promise(r => setTimeout(r, ms))
const api = async (path, init) => {
  const res = await fetch(`${BASE}${path}`, { headers, ...init })
  const t = await res.text()
  let j = {}; try { j = JSON.parse(t) } catch { j = { raw: t } }
  if (!res.ok) throw new Error(j?.error?.message || j?.message || `HTTP ${res.status}`)
  return j
}

// Build an empty-result SELECT matching the descriptor implied by the file's
// previous.query.result schema, so the stored result resets to 0 rows.
const EMPTY_SQL = {
  // x402 fork
  7666075: "SELECT CAST(NULL AS DATE) AS day, CAST(NULL AS VARCHAR) AS facilitator, CAST(NULL AS BIGINT) AS total_txn, CAST(NULL AS DOUBLE) AS total_vol WHERE 1=0",
  // registry fork
  7666083: "SELECT CAST(NULL AS TIMESTAMP) AS block_date, CAST(NULL AS VARCHAR) AS blockchain, CAST(NULL AS BIGINT) AS registered WHERE 1=0",
}[queryId]
if (!EMPTY_SQL) { console.error(`No empty-SQL template for query ${queryId}`); process.exit(1) }

const todayStr = new Date().toISOString().slice(0, 10)
const daysBetween = (a, b) => Math.round((Date.parse(b) - Date.parse(a)) / 864e5)
const maxDate = (rows, f) => rows.reduce((m, r) => { const v = (r[f] || '').slice(0, 10); return (v > '1971' && (!m || v > m)) ? v : m }, null)

async function patch(sql) {
  await api(`/query/${queryId}`, { method: 'PATCH', body: JSON.stringify({ query_sql: sql }) })
}

async function execOnce(label) {
  const t0 = Date.now()
  const { execution_id } = await api(`/query/${queryId}/execute`, { method: 'POST', body: JSON.stringify({ performance: 'small' }) })
  process.stdout.write(`  ${label}: ${execution_id} `)
  for (;;) {
    await sleep(5000)
    const st = await api(`/execution/${execution_id}/status`)
    if (st.state === 'QUERY_STATE_COMPLETED' || st.state === 'QUERY_STATE_COMPLETED_PARTIAL') break
    if (st.state.startsWith('QUERY_STATE_FAIL') || st.state === 'QUERY_STATE_EXPIRED' || st.state === 'QUERY_STATE_CANCELED') {
      const d = st?.error?.message || st.state
      throw Object.assign(new Error(d), { timeout: /timed out/i.test(d) })
    }
    process.stdout.write('.')
  }
  const res = await api(`/execution/${execution_id}/results?limit=30000&allow_partial_results=true`)
  const rows = res.result?.rows || []
  const md = maxDate(rows, dateField)
  console.log(`✓ ${Math.round((Date.now() - t0) / 1000)}s · ${rows.length} rows · latest ${md || 'none'}`)
  return { rows, md }
}

console.log(`Reset+rebuild query ${queryId} from ${sqlFile}`)
console.log('Step 1: reset stored result to empty')
await patch(EMPTY_SQL)
await execOnce('reset')

console.log('Step 2: install incremental SQL')
await patch(readFileSync(sqlFile, 'utf8'))

console.log('Step 3: backfill to convergence')
let last
for (let n = 1; n <= MAX_RUNS; n++) {
  try { last = await execOnce(`run ${n}`) }
  catch (e) {
    if (e.timeout) { console.log(`  ✗ TIMEOUT on run ${n} — lower the backfill window and rerun.`); process.exit(2) }
    console.log(`  ✗ run ${n} failed: ${e.message}`); process.exit(1)
  }
  const gap = last.md ? daysBetween(last.md, todayStr) : Infinity
  if (gap <= 2) { console.log(`  caught up (gap ${gap}d) in ${n} run(s)`); break }
  if (n === MAX_RUNS) { console.log(`  reached max-runs; gap ${gap}d`); }
}

// Correctness assertion: no duplicate key rows (would prove a merge double-count).
const seen = new Map()
let dups = 0
for (const r of last.rows) {
  const k = keyCols.map(c => `${r[c]}`).join('|')
  seen.set(k, (seen.get(k) || 0) + 1)
}
for (const [k, c] of seen) if (c > 1) { dups++; if (dups <= 5) console.log(`  DUP x${c}: ${k}`) }
if (dups > 0) { console.log(`\n✗ ${dups} duplicate ${dupKeyCols} keys — merge boundary still double-counts.`); process.exit(3) }
console.log(`\n✓ rebuild clean: ${last.rows.length} rows, 0 duplicate (${dupKeyCols}) keys.`)
