// scripts/dune/build-baseline.mjs — rebuild baselines.json EXACTLY from Dune
// stored results. READ-only against Dune (no executions, a few credits of
// datapoint reads, one-off).
//
// When to run: once after 2026-06-29 (renewed original account), before
// re-enabling the cron. Replaces the approximate protocol split that the
// current baselines.json derives from rounded display shares.
//
//   DUNE_API_KEY=... node scripts/dune/build-baseline.mjs
//
// Options:
//   --cutoff 2026-05-01         boundary: baseline keeps < cutoff, window scans >= cutoff
//   --x402-qid 6058135          legacy upstream (per-month×facilitator, full history)
//   --registry-qid 6130922      upstream registry (per-day×chain, full history)
//   --x402-file f.json          offline fixture ({rows:[...], executedAt}) instead of API
//   --registry-file f.json      offline fixture instead of API
//   --skip-registry             only rebuild the x402 baseline
//   --dry-run                   print, don't write

import { readFileSync, writeFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { buildX402Baseline, buildRegistryBaseline } from './baseline-lib.mjs'
import { getLatestResult } from './dune-api.mjs'

const __dirname = dirname(fileURLToPath(import.meta.url))
const OUT = process.env.DUNE_BASELINES_PATH || join(__dirname, 'baselines.json')

const args = process.argv.slice(2)
const opt = (name, dflt) => { const i = args.indexOf(`--${name}`); return i >= 0 ? args[i + 1] : dflt }
const flag = name => args.includes(`--${name}`)

const CUTOFF = opt('cutoff', '2026-05-01')
const X402_QID = Number(opt('x402-qid', 6058135))
const REG_QID = Number(opt('registry-qid', 6130922))

if (!/^\d{4}-\d{2}-01$/.test(CUTOFF)) {
  console.error(`cutoff ${CUTOFF} is not a first-of-month date — the x402 window query has month grain, so the boundary must be a month boundary`)
  process.exit(1)
}

async function source(fileOpt, qid, label) {
  const file = opt(fileOpt, null)
  if (file) {
    const fixture = JSON.parse(readFileSync(file, 'utf8'))
    return { rows: fixture.rows || fixture, executedAt: fixture.executedAt || null }
  }
  console.log(`reading latest stored result of ${label} (query ${qid}) — READ, no execution`)
  return getLatestResult(qid)
}

function assertCoverage(executedAt, label) {
  // The stored result must have been produced on/after the cutoff, otherwise
  // the "frozen" months aren't fully covered by it.
  if (!executedAt) { console.warn(`${label}: no execution timestamp on the result — verify coverage manually`); return }
  if (executedAt.slice(0, 10) < CUTOFF) {
    throw new Error(`${label}: stored result executed ${executedAt} — BEFORE cutoff ${CUTOFF}; it cannot cover the frozen period. Aborting.`)
  }
}

const current = (() => { try { return JSON.parse(readFileSync(OUT, 'utf8')) } catch { return {} } })()
const out = { schema: 1, generatedAt: new Date().toISOString(), x402: current.x402 || null, erc8004Registry: current.erc8004Registry || null }

// x402 — exact per-facilitator baseline from the legacy full-history result.
{
  const { rows, executedAt } = await source('x402-file', X402_QID, 'x402 legacy upstream')
  assertCoverage(executedAt, 'x402')
  const built = buildX402Baseline(rows, CUTOFF)
  if (current.x402?.totalTxs) {
    const drift = Math.abs(built.totalTxs - current.x402.totalTxs) / current.x402.totalTxs
    const msg = `x402 totals: rebuilt ${built.totalTxs.toLocaleString()} vs current baseline ${current.x402.totalTxs.toLocaleString()} (drift ${(drift * 100).toFixed(3)}%)`
    if (drift > 0.005) throw new Error(`${msg} — exceeds 0.5%; investigate before overwriting`)
    console.log(msg)
  }
  out.x402 = built
  console.log(`x402 baseline: ${built.monthly.length} months, ${built.protocols.length} facilitators (exact), ${built.totalTxs.toLocaleString()} txs / $${built.totalVolume.toLocaleString()}`)
}

// Registry — exact per-chain baseline from the upstream full-history result.
if (!flag('skip-registry')) {
  const { rows, executedAt } = await source('registry-file', REG_QID, 'registry upstream')
  assertCoverage(executedAt, 'registry')
  const built = buildRegistryBaseline(rows, CUTOFF)
  out.erc8004Registry = built
  console.log(`registry baseline: ${built.chains.length} chains, ${built.totalAgents.toLocaleString()} agents < ${CUTOFF}`)
}

if (flag('dry-run')) {
  console.log(JSON.stringify(out, null, 2))
} else {
  writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n')
  console.log(`✓ wrote ${OUT} — commit it, then run the offline tests (node scripts/test/run-tests.mjs)`)
}
