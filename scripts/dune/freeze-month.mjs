// scripts/dune/freeze-month.mjs — monthly cutoff advance ("封账").
//
// WHY THIS EXISTS: the recent-window queries scan [cutoff, now). Without a
// monthly advance the window grows ~4 weeks/month and eventually blows the
// free small engine's 2-min timeout. This tool folds the just-closed month(s)
// into the frozen baseline and moves the cutoff to the current month's 1st,
// keeping the scanned window ≤ ~6 weeks forever.
//
// When to run: a few days into each month (e.g. the 3rd), once the daily cron
// has produced a window result that covers the closed month end-to-end.
//
//   DUNE_API_KEY=... DUNE_QID_X402_CUMULATIVE=<id> [DUNE_QID_REGISTRY=<id>] \
//     node scripts/dune/freeze-month.mjs
//
// Options:
//   --new-cutoff 2026-07-01   default: 1st of the current UTC month
//   --execute                 allow ONE fresh execution per query if the stored
//                             result predates the new cutoff (otherwise abort)
//   --dry-run                 print the fold, don't write
//
// Coverage rule: a stored result can only prove the closed month if it was
// EXECUTED on/after the new cutoff. Folding from an older result would freeze
// a truncated month into the baseline permanently — that's why this aborts
// rather than guessing.

import { readFileSync, writeFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { foldX402Window, foldRegistryWindow } from './baseline-lib.mjs'
import { getLatestResult, executeOnce } from './dune-api.mjs'

const __dirname = dirname(fileURLToPath(import.meta.url))
const PATH = process.env.DUNE_BASELINES_PATH || join(__dirname, 'baselines.json')

const args = process.argv.slice(2)
const opt = (name, dflt) => { const i = args.indexOf(`--${name}`); return i >= 0 ? args[i + 1] : dflt }
const flag = name => args.includes(`--${name}`)

const now = new Date()
const defaultCutoff = `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, '0')}-01`
const NEW_CUTOFF = opt('new-cutoff', defaultCutoff)
if (!/^\d{4}-\d{2}-01$/.test(NEW_CUTOFF)) {
  console.error(`new cutoff ${NEW_CUTOFF} must be the 1st of a month (month-grain boundary)`)
  process.exit(1)
}

const baselines = JSON.parse(readFileSync(PATH, 'utf8'))

async function coveredRows(qid, label, oldCutoff) {
  let res = await getLatestResult(qid)
  if (!res.executedAt || res.executedAt.slice(0, 10) < NEW_CUTOFF) {
    const when = res.executedAt || 'unknown'
    if (!flag('execute')) {
      throw new Error(`${label}: latest stored result executed ${when} — before new cutoff ${NEW_CUTOFF}, so it can't prove the closed month. Re-run with --execute to spend ONE execution, or wait for the daily cron.`)
    }
    console.log(`${label}: stored result (${when}) predates ${NEW_CUTOFF}; running ONE fresh execution (window_start=${oldCutoff})`)
    res = await executeOnce(qid, { windowStart: oldCutoff })
  }
  console.log(`${label}: using result executed ${res.executedAt} (${res.rows.length} rows)`)
  return res.rows
}

let touched = 0

if (baselines.x402?.cutoff) {
  if (baselines.x402.cutoff >= NEW_CUTOFF) {
    console.log(`x402: cutoff ${baselines.x402.cutoff} already >= ${NEW_CUTOFF}; nothing to fold`)
  } else {
    const qid = Number(process.env.DUNE_QID_X402_CUMULATIVE || 0)
    if (!qid) throw new Error('DUNE_QID_X402_CUMULATIVE not set (the recent-window query id)')
    const rows = await coveredRows(qid, 'x402 window', baselines.x402.cutoff)
    const before = baselines.x402.totalTxs
    baselines.x402 = foldX402Window(baselines.x402, rows, NEW_CUTOFF)
    console.log(`x402: cutoff → ${NEW_CUTOFF}; totals ${before.toLocaleString()} → ${baselines.x402.totalTxs.toLocaleString()} txs`)
    touched += 1
  }
}

if (baselines.erc8004Registry?.cutoff) {
  if (baselines.erc8004Registry.cutoff >= NEW_CUTOFF) {
    console.log(`registry: cutoff ${baselines.erc8004Registry.cutoff} already >= ${NEW_CUTOFF}; nothing to fold`)
  } else {
    const qid = Number(process.env.DUNE_QID_REGISTRY || 0)
    if (!qid) throw new Error('DUNE_QID_REGISTRY not set (the registry recent-window query id)')
    const rows = await coveredRows(qid, 'registry window', baselines.erc8004Registry.cutoff)
    const before = baselines.erc8004Registry.totalAgents
    baselines.erc8004Registry = foldRegistryWindow(baselines.erc8004Registry, rows, NEW_CUTOFF)
    console.log(`registry: cutoff → ${NEW_CUTOFF}; agents ${before.toLocaleString()} → ${baselines.erc8004Registry.totalAgents.toLocaleString()}`)
    touched += 1
  }
}

if (touched === 0) {
  console.log('nothing folded')
} else if (flag('dry-run')) {
  console.log(JSON.stringify(baselines, null, 2))
} else {
  baselines.generatedAt = new Date().toISOString()
  writeFileSync(PATH, JSON.stringify(baselines, null, 2) + '\n')
  console.log(`✓ wrote ${PATH} — commit it so the next cron run uses the new cutoff`)
}
