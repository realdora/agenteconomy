// scripts/fetch-coverage-extensions.mjs
//
// Two additive series that the main Dune pipeline does not collect:
//   acpV2          — Virtuals ACP v2 jobs per day and chain (EVM only)
//   erc8004Sources — ERC-8004 registrations per day by agent-card source
// Output: public/coverage-extensions.json. Nothing in public/data.json,
// baselines.json or scripts/fetch-data.js is read for writing or changed.
//
// Runs as its own workflow so a failure here can never hold back the main
// pipeline. Spending rules:
//   - one ad-hoc execution per series per UTC day (the private-query quota is
//     full, so the SQL in scripts/dune/*.sql is sent to POST /sql/execute);
//   - each execution is cancelled above COVERAGE_QUERY_CREDIT_CAP;
//   - nothing executes if the billing meter is within reach of the same
//     monthly cap the main pipeline uses.
// Measured 2026-11-11: ACP v2 0.45 and sources 1.97 credits for a 7-day window.
//
// Run: DUNE_API_KEY=xxx node scripts/fetch-coverage-extensions.mjs

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { chooseWindow, mergeByDay, parseAcpRows, parseSourceRows, rollupSources, summarizeSources, reconcileWithRegistry } from './coverage/lib.mjs'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const OUT = path.join(ROOT, 'public/coverage-extensions.json')
const DATA = path.join(ROOT, 'public/data.json')
const BASE = process.env.DUNE_API_BASE || 'https://api.dune.com/api/v1'
const KEY = process.env.DUNE_API_KEY
const QUERY_CAP = Number(process.env.COVERAGE_QUERY_CREDIT_CAP || 5)
const MONTHLY_CAP = Number(process.env.DUNE_MONTHLY_CREDIT_CAP || 2000)
const OVERRIDE = process.env.COVERAGE_WINDOW_START || null
const FORCE = process.env.COVERAGE_FORCE === '1'
// Optional comma-separated subset (acpV2, erc8004Sources) — used to backfill one series only.
const ONLY = (process.env.COVERAGE_SERIES || '').split(',').map(s => s.trim()).filter(Boolean)
const RECENT_ROW_DAYS = 35
const REGISTRY = '0x8004a169fb4a3325136eb29fa0ceb6d2e539a432'
const ACP_V2 = '0x238E541BfefD82238730D00a2208E5497F1832E0'
const TESTNETS = new Set(['sepolia', 'goerli', 'mumbai', 'amoy', 'holesky'])
const sleep = ms => new Promise(r => setTimeout(r, ms))

const SERIES = [
  { key: 'acpV2', sql: 'scripts/dune/acp-v2-jobs-window.sql' },
  { key: 'erc8004Sources', sql: 'scripts/dune/erc8004-sources-window.sql' },
]

async function dune(route, options = {}) {
  const res = await fetch(BASE + route, {
    ...options,
    headers: { 'x-dune-api-key': KEY, ...(options.body ? { 'Content-Type': 'application/json' } : {}) },
    signal: AbortSignal.timeout(30000),
  })
  const text = await res.text()
  let json
  try { json = JSON.parse(text) } catch { json = {} }
  if (!res.ok) throw new Error(`Dune HTTP ${res.status} ${route}: ${String(json?.error?.message || json?.error || text).slice(0, 200)}`)
  return json
}

async function creditsUsed() {
  const payload = await dune('/usage', { method: 'POST', body: '{}' })
  const now = new Date().toISOString().slice(0, 10)
  const periods = payload.billing_periods || payload.billingPeriods || []
  const active = periods.filter(p => p.start_date <= now && now < p.end_date)
  if (active.length !== 1) throw new Error('usage preflight: no unique active billing period')
  const used = Number(active[0].credits_used)
  if (!Number.isFinite(used)) throw new Error('usage preflight: credits_used missing')
  return used
}

// One execution, polled; cancelled above the cap. Returns rows + measured cost.
async function executeSql(sql, cap) {
  const started = await dune('/sql/execute', { method: 'POST', body: JSON.stringify({ sql }) })
  const id = started.execution_id
  if (!id) throw new Error('execute response missing execution_id')
  console.log(`  execution ${id}`)
  const t0 = Date.now()
  for (;;) {
    await sleep(5000)
    const status = await dune(`/execution/${id}/status`)
    const cost = Number(status.execution_cost_credits ?? 0)
    if (status.state === 'QUERY_STATE_COMPLETED') {
      const payload = await dune(`/execution/${id}/results?limit=50000`)
      return { rows: payload?.result?.rows || [], cost, executionId: id }
    }
    if (/FAILED|CANCEL|EXPIRED/.test(status.state)) throw Object.assign(new Error(`execution ${id} ${status?.error?.message || status.state}`), { cost })
    if (cost > cap || Date.now() - t0 > 10 * 60 * 1000) {
      await dune(`/execution/${id}/cancel`, { method: 'POST' }).catch(() => {})
      throw Object.assign(new Error(`execution ${id} cancelled at ${cost.toFixed(2)} credits (cap ${cap})`), { cost })
    }
  }
}

function readJson(file, fallback) {
  try { return JSON.parse(fs.readFileSync(file, 'utf8')) } catch { return fallback }
}

function setOutput(name, value) {
  if (process.env.GITHUB_OUTPUT) fs.appendFileSync(process.env.GITHUB_OUTPUT, `${name}=${value}\n`)
}

async function main() {
  if (!KEY) { console.error('Missing DUNE_API_KEY'); process.exit(1) }
  const today = new Date().toISOString().slice(0, 10)
  const previous = readJson(OUT, {})
  const out = {
    updatedAt: previous.updatedAt || null,
    acpV2: previous.acpV2 || null,
    erc8004Sources: previous.erc8004Sources || null,
    runs: previous.runs || {},
  }

  const used = await creditsUsed()
  console.log(`Dune usage before: ${used.toFixed(2)} (monthly cap ${MONTHLY_CAP}, per-query cap ${QUERY_CAP})`)
  if (used + QUERY_CAP * (ONLY.length || SERIES.length) > MONTHLY_CAP) {
    console.warn('Monthly cap within reach — nothing executed, previous values kept.')
    setOutput('failed', 'true')
    return
  }

  let failed = false
  let executed = 0
  if (ONLY.some(k => !SERIES.some(s => s.key === k))) throw new Error(`unknown COVERAGE_SERIES: ${ONLY.join(',')}`)
  for (const series of SERIES) {
    if (ONLY.length && !ONLY.includes(series.key)) continue
    const last = out.runs[series.key]
    if (!FORCE && !OVERRIDE && last?.collectedDay === today && last?.ok) {
      console.log(`${series.key}: already collected today, skipped`)
      continue
    }
    const stored = out[series.key]
    const window = chooseWindow({ today, lastStoredDay: stored?.asOf || null, override: OVERRIDE })
    console.log(`${series.key}: window ${window.start} → ${window.end}`)
    const sql = fs.readFileSync(path.join(ROOT, series.sql), 'utf8').replaceAll('{{window_start}}', window.start)
    executed++
    try {
      const { rows, cost, executionId } = await executeSql(sql, QUERY_CAP)
      console.log(`${series.key}: ${rows.length} rows, ${cost.toFixed(3)} credits`)
      if (series.key === 'acpV2') {
        const daily = mergeByDay(stored?.daily, parseAcpRows(rows), window)
        out.acpV2 = {
          asOf: window.end,
          unit: 'jobs',
          contract: ACP_V2,
          covers: 'EVM deployments of the ACP v2 contract indexed by Dune (Base, Robinhood Chain, Arc)',
          excludes: 'ACP on Solana; the legacy Base contracts (counted in memos in data.json)',
          since: daily[0]?.day || stored?.since || window.start,
          daily,
        }
      } else {
        const fresh = parseSourceRows(rows, TESTNETS)
        const freshRollup = rollupSources(fresh, { registry: REGISTRY })
        const check = reconcileWithRegistry(freshRollup, readJson(DATA, {})?.erc8004Registry?.daily)
        // A mismatch is stored, not hidden: the scan is still a direct chain
        // read, but readers of this file must be able to see the disagreement.
        if (check.mismatches.length) {
          failed = true
          console.error(`${series.key}: does not reconcile with published registry: ${JSON.stringify(check.mismatches.slice(0, 5))}`)
        }
        const daily = mergeByDay(stored?.daily, freshRollup, window)
        const recentFloor = daily.length > RECENT_ROW_DAYS ? daily[daily.length - RECENT_ROW_DAYS].day : '0000-00-00'
        const recentRows = mergeByDay(stored?.recentRows, fresh, window).filter(r => r.day >= recentFloor)
        out.erc8004Sources = {
          asOf: window.end,
          registry: REGISTRY,
          method: 'Registered events on every Dune-indexed EVM chain, grouped by the host of the agent-card URI; testnets excluded',
          since: daily[0]?.day || window.start,
          last7: summarizeSources(daily, 7),
          reconcile: { comparedDays: check.compared, mismatches: check.mismatches },
          daily,
          recentRows,
        }
      }
      out.runs[series.key] = { ok: true, collectedDay: today, window, executionId, credits: Math.round(cost * 1000) / 1000 }
    } catch (error) {
      failed = true
      console.error(`${series.key}: FAILED — ${error.message}; previous values kept`)
      out.runs[series.key] = { ...(last || {}), ok: false, lastError: String(error.message).slice(0, 300), lastErrorDay: today, lastErrorCredits: error.cost ?? null }
    }
  }

  if (!executed) { console.log('nothing to do'); setOutput('failed', 'false'); return }
  out.updatedAt = new Date().toISOString()
  fs.writeFileSync(OUT, JSON.stringify(out, null, 1) + '\n')
  console.log(`wrote ${path.relative(ROOT, OUT)}`)
  setOutput('failed', String(failed))
}

main().catch(error => { console.error(error.message); setOutput('failed', 'true'); process.exit(1) })
