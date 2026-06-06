// scripts/test/run-tests.mjs — offline test harness for fetch-data.js
//
// Spins an in-process mock of the Dune API and runs the pipeline against it
// under six scenarios (cold start, unchanged, stale refresh, failed refresh
// with fallback, SLA breach, monotonicity violation). No network, no credits.
//
// Run: node scripts/test/run-tests.mjs

import { createServer } from 'http'
import { spawn } from 'child_process'
import { mkdtempSync, readFileSync, writeFileSync, existsSync, copyFileSync } from 'fs'
import { tmpdir } from 'os'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const SCRIPT = join(__dirname, '..', 'fetch-data.js')

const hoursAgo = h => new Date(Date.now() - h * 36e5).toISOString()

// ── Fixtures (shapes mirror the real Dune result schemas) ────
function fixtureRows(id, { totalTxs = 150_000_000, totalVol = 40_000_000 } = {}) {
  switch (id) {
    case 6058135: { // x402 cumulative: month × facilitator
      const rows = []
      const months = ['2025-10', '2025-11', '2025-12', '2026-01', '2026-02', '2026-03', '2026-04', '2026-05', '2026-06']
      for (const m of months) {
        for (const fac of ['Coinbase', 'PayAI', 'Dexter']) {
          rows.push({
            cumulative_txn: totalTxs, cumulative_volume: totalVol,
            total_txn: 1_000_000, total_vol: 300_000,
            facilitator: fac, date_time: `${m}-01 00:00`,
          })
        }
      }
      return rows
    }
    case 6084845: // x402 daily
      return Array.from({ length: 90 }, (_, i) => ({
        period: new Date(Date.now() - (89 - i) * 864e5).toISOString().slice(0, 10),
        txs: 50_000 + i,
      }))
    case 6731879: // ERC-8004 Base agentic
      return Array.from({ length: 30 }, (_, i) => ({
        day: new Date(Date.now() - (29 - i) * 864e5).toISOString().slice(0, 10),
        category: i % 2 ? 'consumer' : 'infrastructure',
        'Daily Transactions': 1000 + i,
      }))
    case 6200422: // Virtuals ACP
      return Array.from({ length: 30 }, (_, i) => ({
        period: new Date(Date.now() - (29 - i) * 864e5).toISOString().slice(0, 10),
        num_of_memo: 200 + i, unique_sender: 40, total_memo: 90_000 + i * 100,
      }))
    case 6130922: // ERC-8004 registry
      return ['base', 'ethereum', 'bnb'].flatMap(chain =>
        Array.from({ length: 20 }, (_, i) => ({
          blockchain: chain,
          block_date: new Date(Date.now() - (19 - i) * 864e5).toISOString().slice(0, 10),
          registered: 10 + i,
        })))
    case 3344834: // Olas weekly
      return ['gnosis', 'base'].flatMap(chain =>
        Array.from({ length: 12 }, (_, i) => ({
          time: new Date(Date.now() - (11 - i) * 7 * 864e5).toISOString().slice(0, 10),
          chain,
          total_weekly_transactions_number: 5000 + i,
          global_cumulative_transactions_number: 2_000_000 + i * 1000,
        })))
    default: throw new Error(`no fixture for query ${id}`)
  }
}

const ALL_IDS = [6058135, 6084845, 6731879, 6200422, 6130922, 3344834]

function defaultScenario() {
  const queries = {}
  for (const id of ALL_IDS) {
    queries[id] = {
      latest: { execution_id: `exec-${id}-v1`, endedHoursAgo: 1, rows: fixtureRows(id) },
      execute: { behavior: 'succeed', execution_id: `exec-${id}-v2`, rows: fixtureRows(id) },
    }
  }
  return { queries }
}

// ── Mock Dune API ────────────────────────────────────────────
function startMock(scenario, log) {
  const executions = {} // execution_id → query id
  const server = createServer((req, res) => {
    const url = new URL(req.url, 'http://localhost')
    log.push(`${req.method} ${url.pathname}${url.search}`)
    const send = (code, body) => { res.writeHead(code, { 'content-type': 'application/json' }); res.end(JSON.stringify(body)) }

    let m
    if ((m = url.pathname.match(/^\/query\/(\d+)\/results$/))) {
      const q = scenario.queries[m[1]]
      if (!q) return send(404, { error: { message: 'not found' } })
      if (q.latest.error) return send(200, { error: { message: q.latest.error } })
      if (q.latest.httpError) return send(q.latest.httpError.code, { error: { message: q.latest.httpError.message } })
      const limit = Number(url.searchParams.get('limit') || 1000)
      return send(200, {
        execution_id: q.latest.execution_id,
        execution_ended_at: hoursAgo(q.latest.endedHoursAgo),
        result: { rows: q.latest.rows.slice(0, limit) },
      })
    }
    if ((m = url.pathname.match(/^\/query\/(\d+)\/execute$/))) {
      const q = scenario.queries[m[1]]
      if (!q) return send(404, { error: { message: 'not found' } })
      const eid = q.execute.execution_id || `exec-${m[1]}-fresh`
      executions[eid] = m[1]
      return send(200, { execution_id: eid })
    }
    if ((m = url.pathname.match(/^\/execution\/([^/]+)\/status$/))) {
      const q = scenario.queries[executions[m[1]]]
      if (!q) return send(404, { error: { message: 'unknown execution' } })
      if (q.execute.behavior === 'fail') return send(200, { state: 'QUERY_STATE_FAILED', error: { message: q.execute.errorMessage || 'Query execution has exceeded the user defined maximum amount of resources' } })
      return send(200, { state: 'QUERY_STATE_COMPLETED' })
    }
    if ((m = url.pathname.match(/^\/execution\/([^/]+)\/results$/))) {
      const qid = executions[m[1]]
      const q = scenario.queries[qid]
      if (!q) return send(404, { error: { message: 'unknown execution' } })
      const limit = Number(url.searchParams.get('limit') || 1000)
      return send(200, {
        execution_id: m[1],
        execution_ended_at: hoursAgo(0),
        result: { rows: q.execute.rows.slice(0, limit) },
      })
    }
    send(404, { error: { message: `unhandled ${url.pathname}` } })
  })
  return new Promise(resolve => server.listen(0, '127.0.0.1', () => resolve({ server, port: server.address().port })))
}

// ── Runner ───────────────────────────────────────────────────
let failures = 0
function check(name, cond, detail = '') {
  if (cond) { console.log(`  ✓ ${name}`) }
  else { failures += 1; console.error(`  ✗ ${name} ${detail}`) }
}

async function runPipeline(scenario, { seedDataJson } = {}) {
  const log = []
  const { server, port } = await startMock(scenario, log)
  const outDir = mkdtempSync(join(tmpdir(), 'dune-test-'))
  if (seedDataJson) writeFileSync(join(outDir, 'data.json'), seedDataJson)
  const ghOutput = join(outDir, 'gh_output')
  writeFileSync(ghOutput, '')
  const proc = await new Promise(resolve => {
    const child = spawn('node', [SCRIPT], {
      env: {
      ...process.env,
      DUNE_API_KEY: 'test-key',
      DUNE_API_BASE: `http://127.0.0.1:${port}`,
      DATA_OUT_DIR: outDir,
      DUNE_POLL_INTERVAL_MS: '20',
      DUNE_RETRY_DELAY_MS: '50',
      DUNE_EXECUTION_TIMEOUT_MS: '3000',
        GITHUB_OUTPUT: ghOutput,
      },
    })
    let stdout = '', stderr = ''
    child.stdout.on('data', d => { stdout += d })
    child.stderr.on('data', d => { stderr += d })
    child.on('close', status => resolve({ status, stdout, stderr }))
  })
  server.close()
  const dataPath = join(outDir, 'data.json')
  return {
    log,
    outDir,
    status: proc.status,
    stdout: proc.stdout + proc.stderr,
    data: existsSync(dataPath) ? readFileSync(dataPath, 'utf8') : null,
    ghOutput: readFileSync(ghOutput, 'utf8'),
  }
}

const countLog = (log, pattern) => log.filter(l => l.includes(pattern)).length

// S1 — cold start: no previous data.json, all caches fresh.
console.log('\nS1 cold start (fresh caches, no executions expected)')
const s1 = await runPipeline(defaultScenario())
check('exit 0', s1.status === 0, `status=${s1.status}\n${s1.stdout}`)
check('no executions', countLog(s1.log, '/execute') === 0)
check('6 probes', countLog(s1.log, 'limit=1&') === 6, JSON.stringify(s1.log))
check('6 full downloads', s1.log.filter(l => /limit=(1000|5000)/.test(l)).length === 6)
check('data.json written with meta', !!s1.data && JSON.parse(s1.data).meta?.queries?.x402Cumulative?.executionId === 'exec-6058135-v1')
check('asOf stamps present', !!JSON.parse(s1.data).x402.asOf && !!JSON.parse(s1.data).olas.asOf)
const SEED = s1.data // canonical previous build for later scenarios

// S2 — unchanged: same execution ids as the seed → probes only, no write.
console.log('\nS2 unchanged (probe-only, zero downloads, no write)')
const s2 = await runPipeline(defaultScenario(), { seedDataJson: SEED })
check('exit 0', s2.status === 0, `status=${s2.status}\n${s2.stdout}`)
check('6 probes', countLog(s2.log, 'limit=1&') === 6)
check('zero full downloads', s2.log.filter(l => /limit=(1000|5000)/.test(l)).length === 0, JSON.stringify(s2.log))
check('no write reported', s2.stdout.includes('no data changes'))
check('file byte-identical', s2.data === SEED)

// S3 — stale headline: 30h-old cache + successful refresh with higher totals.
console.log('\nS3 stale headline refresh (one execution, monotonic increase)')
const s3scenario = defaultScenario()
s3scenario.queries[6058135].latest.endedHoursAgo = 30
s3scenario.queries[6058135].execute.rows = fixtureRows(6058135, { totalTxs: 151_000_000, totalVol: 40_500_000 })
const s3 = await runPipeline(s3scenario, { seedDataJson: SEED })
check('exit 0', s3.status === 0, `status=${s3.status}\n${s3.stdout}`)
check('exactly 1 execution', countLog(s3.log, '/execute') === 1, JSON.stringify(s3.log.filter(l => l.includes('execute'))))
check('headline executed', countLog(s3.log, '/query/6058135/execute') === 1)
check('totals updated', JSON.parse(s3.data).x402.totalTxs === 151_000_000)
check('other sections reused', countLog(s3.log, '/query/3344834/results?limit=5000') === 0)
check('changed=true in GITHUB_OUTPUT', s3.ghOutput.includes('changed=true'))

// S4 — failed refresh, healthy fallback: execution fails, latest cache (30h) is
// within SLA → warning + fallback, run stays green.
console.log('\nS4 failed refresh with in-SLA fallback (green run, warning)')
const s4scenario = defaultScenario()
s4scenario.queries[6058135].latest = { execution_id: 'exec-6058135-v9', endedHoursAgo: 30, rows: fixtureRows(6058135) }
s4scenario.queries[6058135].execute.behavior = 'fail'
const s4 = await runPipeline(s4scenario, { seedDataJson: SEED })
check('exit 0', s4.status === 0, `status=${s4.status}\n${s4.stdout}`)
check('fallback warning emitted', s4.stdout.includes('falling back to newest available data'))
check('fell back to latest download', countLog(s4.log, '/query/6058135/results?limit=5000') === 1)
check('sla_breach=false', s4.ghOutput.includes('sla_breach=false'), s4.ghOutput)

// S5 — failed refresh, stale fallback: cache is 80h old (> 54h SLA) → data still
// publishes but the SLA flag trips so the workflow gate fails the run.
console.log('\nS5 SLA breach (publish + red flag)')
const s5scenario = defaultScenario()
s5scenario.queries[6058135].latest = { execution_id: 'exec-6058135-v9', endedHoursAgo: 80, rows: fixtureRows(6058135) }
s5scenario.queries[6058135].execute.behavior = 'fail'
const s5 = await runPipeline(s5scenario, { seedDataJson: SEED })
check('exit 0 (gate fails in workflow, not script)', s5.status === 0, `status=${s5.status}\n${s5.stdout}`)
check('sla_breach=true', s5.ghOutput.includes('sla_breach=true'), s5.ghOutput)
check('breach detail in log', s5.stdout.includes('SLA'), s5.stdout)

// S6 — monotonicity violation: fresh execution reports 50% fewer cumulative
// txs than the previous build → refuse to write, exit 1.
console.log('\nS6 monotonicity violation (refuse write, exit 1)')
const s6scenario = defaultScenario()
s6scenario.queries[6058135].latest.endedHoursAgo = 30
s6scenario.queries[6058135].execute.rows = fixtureRows(6058135, { totalTxs: 75_000_000 })
const s6 = await runPipeline(s6scenario, { seedDataJson: SEED })
check('exit 1', s6.status === 1, `status=${s6.status}\n${s6.stdout}`)
check('violation named', s6.stdout.includes('Monotonicity violation'))
check('data.json untouched', s6.data === SEED)

// S7 — daily-grain fork: x402 query returns per-(day, facilitator) rows; parser
// must roll up to monthly + sum totals identically to the legacy monthly grain.
console.log('\nS7 daily-grain x402 fork (parser rolls up, totals match)')
const DAYS = 130
const dailyFork = []
const facs = ['Coinbase', 'PayAI', 'Dexter']
for (let d = 0; d < DAYS; d++) {
  const day = new Date(Date.UTC(2026, 1, 1) + d * 864e5).toISOString().slice(0, 10)
  for (const facilitator of facs) dailyFork.push({ day, facilitator, total_txn: 1000, total_vol: 250 })
}
const s7scenario = defaultScenario()
s7scenario.queries[6058135].latest = { execution_id: 'exec-6058135-daily', endedHoursAgo: 1, rows: dailyFork }
const s7 = await runPipeline(s7scenario)
const s7data = s7.data ? JSON.parse(s7.data) : null
check('exit 0', s7.status === 0, `status=${s7.status}\n${s7.stdout}`)
check('totals summed from daily', s7data?.x402.totalTxs === DAYS * 3 * 1000, `got ${s7data?.x402.totalTxs}`)
check('volume summed from daily', s7data?.x402.totalVolume === DAYS * 3 * 250, `got ${s7data?.x402.totalVolume}`)
check('rolled up to multiple months', s7data?.x402.monthly.length >= 4, JSON.stringify(s7data?.x402.monthly))
check('facilitator shares present', s7data?.x402.protocols.length === 3)

console.log(failures === 0 ? '\nALL TESTS PASSED' : `\n${failures} CHECK(S) FAILED`)
process.exit(failures === 0 ? 0 : 1)
