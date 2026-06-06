// scripts/dune/backfill.mjs — drive an incremental query's bounded backfill.
//
// Repeatedly executes a query on the small engine; each run advances the
// query's internal checkpoint by its window. Stops when the latest stored date
// reaches within `--target-gap` days of today (caught up), or bails on the
// first execution timeout so the window can be lowered.
//
// Usage: node scripts/dune/backfill.mjs <queryId> <dateField> [--max-runs=12] [--target-gap=2]
//   dateField: the result column holding the row date ("day" or "block_date")
//
// Reads DUNE_API_KEY from env.

const API_KEY = process.env.DUNE_API_KEY
const BASE = process.env.DUNE_API_BASE || 'https://api.dune.com/api/v1'
if (!API_KEY) { console.error('Missing DUNE_API_KEY'); process.exit(1) }

const [queryId, dateField] = process.argv.slice(2)
const opts = Object.fromEntries(process.argv.slice(4).map(a => a.replace(/^--/, '').split('=')))
const MAX_RUNS = Number(opts['max-runs'] || 12)
const TARGET_GAP_DAYS = Number(opts['target-gap'] || 2)
if (!queryId || !dateField) { console.error('Usage: backfill.mjs <queryId> <dateField>'); process.exit(1) }

const headers = { 'x-dune-api-key': API_KEY, 'Content-Type': 'application/json' }
const sleep = ms => new Promise(r => setTimeout(r, ms))
const api = async (path, init) => {
  const res = await fetch(`${BASE}${path}`, { headers, ...init })
  const t = await res.text()
  let j = {}; try { j = JSON.parse(t) } catch { j = { raw: t } }
  if (!res.ok) throw new Error(j?.error?.message || j?.message || `HTTP ${res.status}`)
  return j
}

function maxDate(rows, field) {
  let max = null
  for (const r of rows) {
    const v = (r[field] || '').slice(0, 10)
    if (v && v > '1971' && (!max || v > max)) max = v
  }
  return max
}

const todayStr = new Date().toISOString().slice(0, 10)
const daysBetween = (a, b) => Math.round((Date.parse(b) - Date.parse(a)) / 864e5)

async function runOnce(n) {
  const t0 = Date.now()
  const { execution_id } = await api(`/query/${queryId}/execute`, { method: 'POST', body: JSON.stringify({ performance: 'small' }) })
  process.stdout.write(`  run ${n}: ${execution_id} `)
  for (;;) {
    await sleep(5000)
    const st = await api(`/execution/${execution_id}/status`)
    if (st.state === 'QUERY_STATE_COMPLETED' || st.state === 'QUERY_STATE_COMPLETED_PARTIAL') break
    if (st.state.startsWith('QUERY_STATE_FAIL') || st.state === 'QUERY_STATE_EXPIRED' || st.state === 'QUERY_STATE_CANCELED') {
      const detail = st?.error?.message || st.state
      throw Object.assign(new Error(detail), { timeout: /timed out/i.test(detail) })
    }
    process.stdout.write('.')
  }
  const res = await api(`/execution/${execution_id}/results?limit=20000&allow_partial_results=true`)
  const rows = res.result?.rows || []
  const md = maxDate(rows, dateField)
  const elapsed = Math.round((Date.now() - t0) / 1000)
  const gap = md ? daysBetween(md, todayStr) : Infinity
  console.log(`✓ ${elapsed}s · ${rows.length} rows · latest ${dateField}=${md || 'none'} (gap ${gap}d)`)
  return { rows, md, gap }
}

console.log(`Backfill query ${queryId} (date field "${dateField}") → catch up to within ${TARGET_GAP_DAYS}d of ${todayStr}`)
let last, prevMd = '__init__'
for (let n = 1; n <= MAX_RUNS; n++) {
  // The shared small-engine cluster is variable — the same window can time out
  // once and finish on retry. A timeout stores nothing, so re-executing just
  // re-attempts the same window. Retry a few times before giving up.
  let attempt = 0
  for (;;) {
    try { last = await runOnce(n); break }
    catch (e) {
      if (e.timeout && ++attempt < 3) { console.log(`    timeout, retry ${attempt}/2 (cluster variance)`); continue }
      if (e.timeout) { console.log(`\n  ✗ run ${n} TIMED OUT 3× — lower the window in the .sql, then restart the rebuild (PATCH resets incremental state).`); process.exit(2) }
      console.log(`\n  ✗ run ${n} failed: ${e.message}`); process.exit(1)
    }
  }
  // Stall guard: checkpoint advances off MAX(stored date); if a window yields no
  // new data the date can't move and every later run repeats the same empty span.
  if (last.md === prevMd) { console.log(`\n  ✗ STALL: latest date stuck at ${last.md || 'none'} — floor starts before any data or an empty span was hit.`); process.exit(4) }
  prevMd = last.md
  if (last.gap <= TARGET_GAP_DAYS) { console.log(`\nCaught up (gap ${last.gap}d ≤ ${TARGET_GAP_DAYS}d) in ${n} run(s).`); process.exit(0) }
}
console.log(`\nReached max-runs=${MAX_RUNS}; latest gap ${last?.gap}d. Re-run to continue.`)
