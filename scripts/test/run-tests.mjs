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
      execute: { behavior: 'succeed', execution_id: `exec-${id}-v2`, rows: fixtureRows(id), costCredits: 10 },
    }
  }
  return { queries, usage: { creditsUsed: 0, creditsIncluded: 2500 } }
}

// ── Mock Dune API ────────────────────────────────────────────
function startMock(scenario, log) {
  const executions = {} // execution_id → query id
  let usageCalls = 0
  const server = createServer((req, res) => {
    const url = new URL(req.url, 'http://localhost')
    log.push(`${req.method} ${url.pathname}${url.search}`)
    const send = (code, body) => { res.writeHead(code, { 'content-type': 'application/json' }); res.end(JSON.stringify(body)) }

    let m
    if (req.method === 'POST' && url.pathname === '/usage') {
      const usageConfig = Array.isArray(scenario.usage)
        ? scenario.usage[Math.min(usageCalls, scenario.usage.length - 1)]
        : scenario.usage
      usageCalls += 1
      if (usageConfig?.httpError) return send(usageConfig.httpError.code, { error: { message: usageConfig.httpError.message } })
      if (usageConfig?.malformed) return send(200, { billingPeriods: [{}] })
      return send(200, {
        billingPeriods: [{
          credits_used: usageConfig?.creditsUsed ?? 0,
          credits_included: usageConfig?.creditsIncluded ?? 2500,
        }],
      })
    }
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
      if (q.execute.behavior === 'fail') {
        return send(200, {
          state: 'QUERY_STATE_FAILED',
          execution_cost_credits: q.execute.costCredits ?? 0,
          error: { message: q.execute.errorMessage || 'Query execution has exceeded the user defined maximum amount of resources' },
        })
      }
      return send(200, { state: 'QUERY_STATE_COMPLETED', execution_cost_credits: q.execute.costCredits ?? 10 })
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

async function runPipeline(scenario, { seedDataJson, baselines, allowUnsafeQueryIds = true, extraEnv = {} } = {}) {
  const log = []
  const { server, port } = await startMock(scenario, log)
  const outDir = mkdtempSync(join(tmpdir(), 'dune-test-'))
  if (seedDataJson) writeFileSync(join(outDir, 'data.json'), seedDataJson)
  // Hermetic baselines: tests never read the repo's real baselines.json.
  const baselinesPath = join(outDir, 'baselines.json')
  if (baselines) writeFileSync(baselinesPath, JSON.stringify(baselines))
  const ghOutput = join(outDir, 'gh_output')
  writeFileSync(ghOutput, '')
  const proc = await new Promise(resolve => {
    const child = spawn('node', [SCRIPT], {
      env: {
      ...process.env,
      DUNE_API_KEY: 'test-key',
      DUNE_API_BASE: `http://127.0.0.1:${port}`,
      // Pin query ids to the fixture ids (script defaults now point at the forks).
      DUNE_QID_X402_CUMULATIVE: '6058135',
      DUNE_QID_REGISTRY: '6130922',
      DUNE_BASELINES_PATH: baselinesPath,
      DUNE_ALLOW_UNSAFE_QUERY_IDS: allowUnsafeQueryIds ? '1' : '0',
      DATA_OUT_DIR: outDir,
      DUNE_POLL_INTERVAL_MS: '20',
      DUNE_RETRY_DELAY_MS: '50',
      DUNE_EXECUTION_TIMEOUT_MS: '3000',
      GITHUB_OUTPUT: ghOutput,
      ...extraEnv,
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

// S2b — legacy public/data.json has no meta. The first recovery run should
// write schema-3 metadata and exit without touching any Dune endpoint.
console.log('\nS2b legacy schema bootstrap (zero Dune calls)')
const oldSchema = JSON.parse(SEED)
delete oldSchema.meta
const s2b = await runPipeline(defaultScenario(), { seedDataJson: JSON.stringify(oldSchema, null, 2) })
const s2bdata = s2b.data ? JSON.parse(s2b.data) : null
check('exit 0', s2b.status === 0, `status=${s2b.status}\n${s2b.stdout}`)
check('zero Dune API calls', s2b.log.length === 0, JSON.stringify(s2b.log))
check('schema 3 meta written', s2bdata?.meta?.schema === 3 && s2bdata?.meta?.queries?.x402Cumulative?.bootstrap === true)
check('bootstrap execution id is null', s2bdata?.meta?.queries?.x402Cumulative?.executionId === null)
check('changed=true in GITHUB_OUTPUT', s2b.ghOutput.includes('changed=true'), s2b.ghOutput)

// S2c — monthly cap reached. The run should only read /usage, skip result
// exports/executions, and reuse the previous build.
console.log('\nS2c budget hold (usage cap, no Dune result reads)')
const s2cscenario = defaultScenario()
s2cscenario.usage = { creditsUsed: 2000, creditsIncluded: 2500 }
s2cscenario.queries[6058135].latest.endedHoursAgo = 30
const s2c = await runPipeline(s2cscenario, { seedDataJson: SEED })
check('exit 0', s2c.status === 0, `status=${s2c.status}\n${s2c.stdout}`)
check('usage preflight only', countLog(s2c.log, '/usage') === 1 && countLog(s2c.log, '/query/') === 0, JSON.stringify(s2c.log))
check('no executions', countLog(s2c.log, '/execute') === 0)
check('budget_hold=true', s2c.ghOutput.includes('budget_hold=true'), s2c.ghOutput)
check('file byte-identical', s2c.data === SEED)

// S2d — malformed usage response fails closed.
console.log('\nS2d malformed usage response (fail closed)')
const s2dscenario = defaultScenario()
s2dscenario.usage = { malformed: true }
const s2d = await runPipeline(s2dscenario, { seedDataJson: SEED })
check('exit 0', s2d.status === 0, `status=${s2d.status}\n${s2d.stdout}`)
check('usage preflight only', countLog(s2d.log, '/usage') === 1 && countLog(s2d.log, '/query/') === 0, JSON.stringify(s2d.log))
check('budget_hold=true', s2d.ghOutput.includes('budget_hold=true'), s2d.ghOutput)
check('file byte-identical', s2d.data === SEED)

// S2e — production default blocks full-history query ids from fresh execution.
console.log('\nS2e blocked full-history query id (no fresh execution)')
const s2escenario = defaultScenario()
s2escenario.queries[6058135].latest.endedHoursAgo = 30
const s2e = await runPipeline(s2escenario, { seedDataJson: SEED, allowUnsafeQueryIds: false })
check('exit 0', s2e.status === 0, `status=${s2e.status}\n${s2e.stdout}`)
check('no blocked fresh execution', countLog(s2e.log, '/query/6058135/execute') === 0, JSON.stringify(s2e.log.filter(l => l.includes('6058135'))))
check('no full download for blocked id', countLog(s2e.log, '/query/6058135/results?limit=10000') === 0, JSON.stringify(s2e.log.filter(l => l.includes('6058135'))))
check('blocked warning emitted', s2e.stdout.includes('blocked for fresh execution'), s2e.stdout)
check('file byte-identical', s2e.data === SEED)

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

// S3b — refresh allowlist: very stale non-x402 sources must not spend the one
// daily execution slot when the cron is scoped to x402 only.
console.log('\nS3b refresh allowlist (x402 only)')
const s3bscenario = defaultScenario()
s3bscenario.queries[6058135].latest.endedHoursAgo = 30
s3bscenario.queries[6058135].execute.rows = fixtureRows(6058135, { totalTxs: 152_000_000, totalVol: 40_750_000 })
s3bscenario.queries[6084845].latest.endedHoursAgo = 90
s3bscenario.queries[6731879].latest.endedHoursAgo = 80
s3bscenario.queries[6200422].latest.endedHoursAgo = 100
s3bscenario.queries[6130922].latest.endedHoursAgo = 200
s3bscenario.queries[3344834].latest.endedHoursAgo = 400
const s3b = await runPipeline(s3bscenario, { seedDataJson: SEED, extraEnv: { DUNE_REFRESH_KEYS: 'x402Cumulative' } })
check('exit 0', s3b.status === 0, `status=${s3b.status}\n${s3b.stdout}`)
check('exactly 1 execution', countLog(s3b.log, '/execute') === 1, JSON.stringify(s3b.log.filter(l => l.includes('execute'))))
check('only x402 executed', countLog(s3b.log, '/query/6058135/execute') === 1)
check('stale non-x402 skipped by allowlist', s3b.stdout.includes('not selected by DUNE_REFRESH_KEYS'), s3b.stdout)
check('allowlisted totals updated', JSON.parse(s3b.data).x402.totalTxs === 152_000_000)

// S4 — failed refresh, healthy fallback: execution fails, latest cache (30h) is
// within SLA → warning + fallback, run stays green.
console.log('\nS4 failed refresh with in-SLA fallback (green run, warning)')
const s4scenario = defaultScenario()
s4scenario.queries[6058135].latest = { execution_id: 'exec-6058135-v9', endedHoursAgo: 30, rows: fixtureRows(6058135) }
s4scenario.queries[6058135].execute.behavior = 'fail'
const s4 = await runPipeline(s4scenario, { seedDataJson: SEED })
check('exit 0', s4.status === 0, `status=${s4.status}\n${s4.stdout}`)
check('fallback warning emitted', s4.stdout.includes('falling back to newest available data'))
// (limit must track the QUERIES config — it was 5000 before the fork bumped it to 10000)
check('fell back to latest download', countLog(s4.log, '/query/6058135/results?limit=10000') === 1, JSON.stringify(s4.log.filter(l => l.includes('6058135'))))
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

// S8 — recent-window x402 + frozen baseline: window rows (month grain, no
// cumulative_* columns) combine with baselines.json; pre-cutoff rows dropped.
console.log('\nS8 x402 recent window + frozen baseline (combine, boundary guard)')
const X402_BASELINE = {
  x402: {
    cutoff: '2026-05-01',
    totalTxs: 1_000_000, totalVolume: 500_000, facilitatorsTracked: 5,
    monthly: [
      { month: '2026-03', txs: 400_000, vol: 200_000 },
      { month: '2026-04', txs: 600_000, vol: 300_000 },
    ],
    protocols: [{ name: 'Coinbase', txs: 700_000, vol: 0 }, { name: 'PayAI', txs: 300_000, vol: 0 }],
  },
  erc8004Registry: null,
}
const windowRows = [
  { date_time: '2026-04-01 00:00', facilitator: 'Coinbase', total_txn: 999_999, total_vol: 999_999 }, // pre-cutoff: must be DROPPED
  { date_time: '2026-05-01 00:00', facilitator: 'Coinbase', total_txn: 1000, total_vol: 250 },
  { date_time: '2026-05-01 00:00', facilitator: 'Dexter', total_txn: 500, total_vol: 100 },
  { date_time: '2026-06-01 00:00', facilitator: 'Coinbase', total_txn: 200, total_vol: 50 },
]
const s8scenario = defaultScenario()
s8scenario.queries[6058135].latest = { execution_id: 'exec-x402-window', endedHoursAgo: 1, rows: windowRows }
const s8 = await runPipeline(s8scenario, { baselines: X402_BASELINE })
const s8data = s8.data ? JSON.parse(s8.data) : null
check('exit 0', s8.status === 0, `status=${s8.status}\n${s8.stdout}`)
check('totals = baseline + window', s8data?.x402.totalTxs === 1_000_000 + 1700, `got ${s8data?.x402.totalTxs}`)
check('volume = baseline + window', s8data?.x402.totalVolume === 500_000 + 400, `got ${s8data?.x402.totalVolume}`)
check('pre-cutoff row dropped (no 999999 leak)', s8data?.x402.totalTxs < 1_900_000)
check('drop warning emitted', s8.stdout.includes('pre-cutoff'))
check('monthly = frozen + window months', s8data?.x402.monthly.length === 4, JSON.stringify(s8data?.x402.monthly))
check('frozen month untouched', s8data?.x402.monthly[1].txs === 600_000, JSON.stringify(s8data?.x402.monthly[1]))
check('May = window only', s8data?.x402.monthly[2].txs === 1500, JSON.stringify(s8data?.x402.monthly[2]))
check('protocols merged (Dexter appears)', s8data?.x402.protocols.some(p => p.name === 'Dexter'), JSON.stringify(s8data?.x402.protocols))
check('facilitatorsTracked keeps frozen count', s8data?.x402.facilitatorsTracked === 5, `got ${s8data?.x402.facilitatorsTracked}`)
const s8shareSum = s8data?.x402.protocols.reduce((s, p) => s + p.share, 0)
check('shares sum ≈ 100', Math.abs(s8shareSum - 100) < 1, `got ${s8shareSum}`)

// S8b — window rows but NO baseline: refuse to publish window-only totals.
console.log('\nS8b x402 window rows without baseline (hard refusal)')
const s8b = await runPipeline(s8scenario)
check('exit 1', s8b.status === 1, `status=${s8b.status}`)
check('names the missing baseline', s8b.stdout.includes('baseline'), s8b.stdout.slice(0, 400))

// S9 — registry recent window + frozen baseline.
console.log('\nS9 registry recent window + frozen baseline')
const REG_BASELINE = {
  x402: X402_BASELINE.x402,
  erc8004Registry: {
    cutoff: '2026-05-01',
    totalAgents: 5000,
    chains: [{ name: 'Base', agents: 3000 }, { name: 'BNB', agents: 2000 }],
    daily: [{ day: '2026-04-28', agents: 10 }, { day: '2026-04-29', agents: 12 }],
  },
}
const regWindowRows = [
  { blockchain: 'base', block_date: '2026-04-30', registered: 999 }, // pre-cutoff: DROPPED
  { blockchain: 'base', block_date: '2026-05-02', registered: 7 },
  { blockchain: 'bnb', block_date: '2026-05-03', registered: 5 },
  { blockchain: 'ethereum', block_date: '2026-05-04', registered: 3 },
  { blockchain: 'sepolia', block_date: '2026-05-04', registered: 50 }, // testnet: filtered
]
const s9scenario = defaultScenario()
s9scenario.queries[6058135].latest = { execution_id: 'exec-x402-window', endedHoursAgo: 1, rows: windowRows }
s9scenario.queries[6130922].latest = { execution_id: 'exec-reg-window', endedHoursAgo: 1, rows: regWindowRows }
const s9 = await runPipeline(s9scenario, { baselines: REG_BASELINE })
const s9data = s9.data ? JSON.parse(s9.data) : null
check('exit 0', s9.status === 0, `status=${s9.status}\n${s9.stdout}`)
check('totalAgents = baseline + window', s9data?.erc8004Registry.totalAgents === 5015, `got ${s9data?.erc8004Registry.totalAgents}`)
check('Base merged', s9data?.erc8004Registry.chains.find(c => c.name === 'Base')?.agents === 3007, JSON.stringify(s9data?.erc8004Registry.chains))
check('new chain appears', s9data?.erc8004Registry.chains.some(c => c.name === 'Ethereum'))
check('testnet filtered + boundary dropped', !s9data?.erc8004Registry.chains.some(c => c.name === 'Sepolia') && s9data?.erc8004Registry.totalAgents === 5015)
check('daily concatenated', s9data?.erc8004Registry.daily.length === 5, JSON.stringify(s9data?.erc8004Registry.daily))

// S9b — recent-window baselines for non-maintenance sources that were too
// expensive as full-history queries: x402Daily, Virtuals ACP, and Olas.
console.log('\nS9b non-maintenance recent windows (x402Daily + Virtuals + Olas)')
const EXTRA_BASELINE = {
  ...REG_BASELINE,
  x402Daily: {
    cutoff: '2026-06-05',
    daily: [{ day: '2026-06-03', txs: 100 }, { day: '2026-06-04', txs: 200 }],
  },
  virtualsAcp: {
    cutoff: '2026-05-31',
    totalMemos: 1000,
    daily: [{ day: '2026-05-29', memos: 50, senders: 5 }, { day: '2026-05-30', memos: 25, senders: 4 }],
  },
  olas: {
    cutoff: '2026-05-04',
    totalTxs: 10_000,
    chains: [{ name: 'Gnosis', txs: 9000 }, { name: 'Base', txs: 1000 }],
    weekly: [{ week: '2026-04-20', txs: 300 }, { week: '2026-04-27', txs: 400 }],
  },
}
const s9bscenario = defaultScenario()
s9bscenario.queries[6058135].latest = { execution_id: 'exec-x402-window', endedHoursAgo: 1, rows: windowRows }
s9bscenario.queries[6084845].latest = {
  execution_id: 'exec-x402-daily-window',
  endedHoursAgo: 1,
  rows: [
    { period: '2026-06-04 00:00', project: 'Coinbase', txs: 999 }, // pre-cutoff: dropped
    { period: '2026-06-05 00:00', project: 'Coinbase', txs: 5 },
    { period: '2026-06-06 00:00', project: 'PayAI', txs: 7 },
  ],
}
s9bscenario.queries[6200422].latest = {
  execution_id: 'exec-virtuals-window',
  endedHoursAgo: 1,
  rows: [
    { period: '2026-05-30 00:00', version: 'v2', num_of_memo: 999, unique_sender: 9 }, // pre-cutoff: dropped
    { period: '2026-05-31 00:00', version: 'v2', num_of_memo: 10, unique_sender: 3 },
    { period: '2026-06-01 00:00', version: 'v1', num_of_memo: 4, unique_sender: 2 },
  ],
}
s9bscenario.queries[3344834].latest = {
  execution_id: 'exec-olas-window',
  endedHoursAgo: 1,
  rows: [
    { time: '2026-04-27 00:00', chain: 'gnosis', total_weekly_transactions_number: 999 }, // pre-cutoff: dropped
    { time: '2026-05-04 00:00', chain: 'gnosis', total_weekly_transactions_number: 30 },
    { time: '2026-05-04 00:00', chain: 'base', total_weekly_transactions_number: 5 },
  ],
}
const s9b = await runPipeline(s9bscenario, { baselines: EXTRA_BASELINE })
const s9bdata = s9b.data ? JSON.parse(s9b.data) : null
check('exit 0', s9b.status === 0, `status=${s9b.status}\n${s9b.stdout}`)
check('x402 daily = baseline + window', s9bdata?.x402.daily.at(-1)?.txs === 7 && s9bdata?.x402.daily.some(d => d.day === '2026-06-05' && d.txs === 5), JSON.stringify(s9bdata?.x402.daily))
check('x402 daily pre-cutoff dropped', !s9bdata?.x402.daily.some(d => d.day === '2026-06-04' && d.txs === 1199), JSON.stringify(s9bdata?.x402.daily))
check('Virtuals total = baseline + window', s9bdata?.virtualsAcp.totalMemos === 1014, `got ${s9bdata?.virtualsAcp.totalMemos}`)
check('Virtuals daily merged', s9bdata?.virtualsAcp.daily.some(d => d.day === '2026-06-01' && d.memos === 4), JSON.stringify(s9bdata?.virtualsAcp.daily))
check('Olas total = baseline + window', s9bdata?.olas.totalTxs === 10035, `got ${s9bdata?.olas.totalTxs}`)
check('Olas chain + weekly merged', s9bdata?.olas.chains.find(c => c.name === 'Gnosis')?.txs === 9030 && s9bdata?.olas.weekly.some(w => w.week === '2026-05-04' && w.txs === 35), JSON.stringify({ chains: s9bdata?.olas.chains, weekly: s9bdata?.olas.weekly }))
check('pre-cutoff warnings emitted', s9b.stdout.includes('x402 daily recent window') && s9b.stdout.includes('Virtuals ACP recent window') && s9b.stdout.includes('Olas recent window'), s9b.stdout)

// S10 — baseline-lib unit tests (build + monthly freeze fold).
console.log('\nS10 baseline-lib: build + freeze-month fold')
const { buildX402Baseline, foldX402Window, foldRegistryWindow } = await import('../dune/baseline-lib.mjs')
const legacyRows = []
for (const m of ['2026-03', '2026-04', '2026-05']) {
  for (const fac of ['Coinbase', 'PayAI']) legacyRows.push({ date_time: `${m}-01 00:00`, facilitator: fac, total_txn: 100, total_vol: 10, cumulative_txn: 600, cumulative_volume: 60 })
}
const built = buildX402Baseline(legacyRows, '2026-05-01')
check('build keeps only pre-cutoff months', built.monthly.length === 2 && built.totalTxs === 400, JSON.stringify(built.monthly))
check('build is exact per facilitator', built.protocols.find(p => p.name === 'Coinbase')?.txs === 200)
check('build flags exact', built.protocolsApprox === false)

const folded = foldX402Window(X402_BASELINE.x402, windowRows.slice(1), '2026-06-01')
check('fold advances cutoff', folded.cutoff === '2026-06-01')
check('fold adds May only', folded.totalTxs === 1_000_000 + 1500 && folded.monthly.length === 3, `got ${folded.totalTxs}, ${folded.monthly.length} months`)
check('fold merges protocols', folded.protocols.find(p => p.name === 'Dexter')?.txs === 500)
check('June stays in window territory', !folded.monthly.some(m => m.month === '2026-06'))
let foldErr = null
try { foldX402Window(X402_BASELINE.x402, [{ date_time: '2026-07-01 00:00', facilitator: 'X', total_txn: 1, total_vol: 1 }], '2026-06-01') } catch (e) { foldErr = e }
check('fold refuses uncovered month', !!foldErr && foldErr.message.includes('refusing'), foldErr?.message)
const regFolded = foldRegistryWindow(REG_BASELINE.erc8004Registry, regWindowRows, '2026-06-01')
check('registry fold: totals + boundary + testnet', regFolded.totalAgents === 5015 && regFolded.cutoff === '2026-06-01', `got ${regFolded.totalAgents}`)

console.log(failures === 0 ? '\nALL TESTS PASSED' : `\n${failures} CHECK(S) FAILED`)
process.exit(failures === 0 ? 0 : 1)
