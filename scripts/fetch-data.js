// scripts/fetch-data.js — Dune data pipeline v3
//
// Design (2026-06-06 rework after free-tier credit exhaustion):
//   1. Probe before download: a limit=1 request tells us the latest execution_id.
//      If it matches what data.json already embeds, we reuse the existing section
//      and download nothing (API reads bill by the MB).
//   2. Sequential executions: free plan allows 1 concurrent SQL query, so fresh
//      executions run one at a time, prioritized by how overdue each query is.
//   3. Per-source freshness SLA: a transient failure falls back to the newest
//      usable data with a warning; the run only goes red (via the workflow SLA
//      gate) when a source breaches its SLA — i.e. when a human needs to act.
//   4. Monotonicity: cumulative metrics must not shrink vs the previous build;
//      a >2% drop means the upstream query changed and needs human review.
//
// Run: DUNE_API_KEY=xxx node scripts/fetch-data.js

import { readFileSync, writeFileSync, appendFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

import {
  foldX402DayGrainWindow,
  foldX402DailySeries,
  foldVirtualsWindow,
  foldOlasWindow,
  foldRegistryWindow,
} from './dune/baseline-lib.mjs'

const __dirname = dirname(fileURLToPath(import.meta.url))
const OUT_DIR = process.env.DATA_OUT_DIR || join(__dirname, '..', 'public')
const API_KEY = process.env.DUNE_API_KEY

if (!API_KEY) {
  console.error('Missing DUNE_API_KEY')
  process.exit(1)
}

const DUNE_API_BASE = process.env.DUNE_API_BASE || 'https://api.dune.com/api/v1'
// Frozen-baseline file for the stateless recent-window design (2026-06-09):
// closed months never change, so they live here as constants and the Dune
// queries only scan a short recent window. See scripts/dune/baselines.json,
// build-baseline.mjs (exact rebuild) and freeze-month.mjs (monthly advance).
const BASELINES_PATH = process.env.DUNE_BASELINES_PATH || join(__dirname, 'dune', 'baselines.json')
const EXECUTION_TIMEOUT_MS = Number(process.env.DUNE_EXECUTION_TIMEOUT_MS || 15 * 60 * 1000)
const POLL_INTERVAL_MS = Number(process.env.DUNE_POLL_INTERVAL_MS || 5000)
const RETRY_DELAY_MS = Number(process.env.DUNE_RETRY_DELAY_MS || 15000)
// Let Dune choose the account's default execution tier unless explicitly
// overridden. Some free accounts reject `small` while accepting the default
// tier, so sending a hard-coded tier can block otherwise valid executions.
const PERFORMANCE = process.env.DUNE_PERFORMANCE || ''
const MAX_EXECUTIONS = Number(process.env.DUNE_MAX_EXECUTIONS_PER_RUN || 1)
const MONTHLY_CREDIT_CAP = Number(process.env.DUNE_MONTHLY_CREDIT_CAP || 2000)
const RUN_CREDIT_CAP = Number(process.env.DUNE_RUN_CREDIT_CAP || 50)
const QUERY_CREDIT_CAP = Number(process.env.DUNE_QUERY_CREDIT_CAP || 35)
const ALLOW_UNSAFE_QUERY_IDS = process.env.DUNE_ALLOW_UNSAFE_QUERY_IDS === '1'
const REFRESH_KEYS = parseKeySet(process.env.DUNE_REFRESH_KEYS)
// Self-folding (自动封账): keep every recent-window scan bounded by folding
// closed data into the frozen baseline automatically. Trigger once a cutoff is
// older than FOLD_TRIGGER_DAYS; fold everything before (today − FOLD_LAG_DAYS)
// so late-arriving on-chain data has a week to settle. DUNE_SELF_FOLD=0 turns
// the whole mechanism off.
//
// Trigger MUST stay below the window length at which the priciest query hits
// DUNE_QUERY_CREDIT_CAP, or the pipeline deadlocks: an over-cap execution gets
// cancelled, folding needs a successful execution, and the window only keeps
// growing. x402 costs ~0.9 credits per window-day (measured 2026-07-06), so a
// 7-day trigger caps its window at ~8 days ≈ 7.2 credits — safely under the
// 10-credit query cap. In steady state the cutoff advances daily by one day.
const SELF_FOLD = process.env.DUNE_SELF_FOLD !== '0'
const FOLD_TRIGGER_DAYS = Number(process.env.DUNE_FOLD_TRIGGER_DAYS || 7)
const FOLD_LAG_DAYS = Number(process.env.DUNE_FOLD_LAG_DAYS || 7)
const BLOCKED_FRESH_QUERY_IDS = new Set([
  6058135, // x402 full-history rescan; original quota burner.
  6130922, // ERC-8004 registry full evms.logs rescan.
  7666075, // dead suspended-account x402 fork.
  7666083, // dead suspended-account registry fork.
])

const headers = { 'x-dune-api-key': API_KEY }
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

function parseKeySet(value) {
  const keys = String(value || '')
    .split(',')
    .map(s => s.trim())
    .filter(Boolean)
  return keys.length ? new Set(keys) : null
}

function executionRequestBody(extra = {}) {
  return JSON.stringify({
    ...(PERFORMANCE ? { performance: PERFORMANCE } : {}),
    ...extra,
  })
}

// ── Query registry ───────────────────────────────────────────
// maxAgeHours: refresh when older than this (cadence follows the data's own
//   granularity — Olas is weekly data, the registry moves slowly).
// slaHours: red line. Falling back to cached/previous data is fine until the
//   effective data age crosses this; then the workflow SLA gate fails the run.
// Query ids are env-overridable so swapping in our incremental forks is a
//   config change, not a code change.
const QUERIES = [
  {
    key: 'x402Cumulative',
    // 7666075 = the DEAD incremental fork (suspended account) — a safe inert
    // default: probes/executes against it fail and the pipeline falls back to
    // the previous build. Once the recent-window query is recreated under the
    // working account (RUNBOOK-2026-06-29.md), set DUNE_QID_X402_CUMULATIVE to
    // its id. Do NOT point this at upstream 6058135 on a cron: its full-history
    // rescan is what burned the original account's monthly credits.
    id: Number(process.env.DUNE_QID_X402_CUMULATIVE || 7666075),
    limit: 10000,
    baselineKey: 'x402', // recent-window query takes {{window_start}} = baselines.x402.cutoff
    maxAgeHours: 20,
    slaHours: 54,
    label: 'x402 cumulative',
  },
  {
    key: 'x402Daily',
    id: Number(process.env.DUNE_QID_X402_DAILY || 6084845),
    limit: 5000,
    baselineKey: 'x402Daily',
    maxAgeHours: 20,
    slaHours: 54,
    label: 'x402 daily',
  },
  {
    key: 'baseAgentic',
    id: Number(process.env.DUNE_QID_BASE_AGENTIC || 6731879),
    limit: 5000,
    maxAgeHours: 20,
    slaHours: 54,
    label: 'ERC-8004 Base agentic',
  },
  {
    key: 'virtualsAcp',
    id: Number(process.env.DUNE_QID_VIRTUALS_ACP || 6200422),
    limit: 1000,
    baselineKey: 'virtualsAcp',
    maxAgeHours: 20,
    slaHours: 54,
    label: 'Virtuals ACP',
  },
  {
    key: 'erc8004Registry',
    // 7666083 = the DEAD incremental fork (suspended account); same inert-default
    // rationale as x402Cumulative. Switch to the registry recent-window query id
    // (erc8004-registry-recent-window.sql) once recreated; upstream 6130922 is a
    // full evms.logs rescan that can't finish on the free small engine.
    id: Number(process.env.DUNE_QID_REGISTRY || 7666083),
    limit: 5000,
    baselineKey: 'erc8004Registry',
    maxAgeHours: 40,
    slaHours: 120,
    label: 'ERC-8004 registry',
  },
  {
    key: 'olas',
    id: Number(process.env.DUNE_QID_OLAS || 3344834),
    limit: 5000,
    baselineKey: 'olas',
    maxAgeHours: 156,
    slaHours: 360,
    label: 'Olas (weekly data)',
  },
  {
    key: 'x402TokenSplit',
    // Trailing-30d USDC-vs-total volume split on Base, scoped by the LIVE
    // facilitator registry (query_6057445). Self-contained rolling window: NO
    // baseline, NO self-folding, NO window_start parameter (the SQL hardcodes
    // `now() - interval '30' day`), so it deliberately has no baselineKey.
    // Single aggregated row — ~0.8 credits measured 2026-07-10, safely under
    // the query cap. optional=true: a failure here must never block the rest of
    // the build (it only feeds the secondary gated usdc-share page).
    id: Number(process.env.DUNE_QID_X402TOKENSPLIT || 7931767),
    limit: 10,
    maxAgeHours: 20,
    slaHours: 54,
    optional: true,
    label: 'x402 token split',
  },
  {
    key: 'x402Chains',
    // Cumulative x402 transactions by chain — @thechriscen's public query (the
    // "Transactions by Chains" chart on dune.com/thechriscen/x402-payment-analytics,
    // the same author already credited for the cumulative source). READ-ONLY by
    // design: this key is deliberately NOT in DUNE_REFRESH_KEYS, so the pipeline
    // only ever downloads his latest cached execution and never spends execution
    // credits — the split refreshes whenever he refreshes his own dashboard.
    // Replaces the frozen June-2026 hardcoded snapshot that used to live in the
    // assembly below (kept there as the last-resort fallback).
    id: Number(process.env.DUNE_QID_X402_CHAINS || 6166650),
    limit: 1000,
    readOnly: true,
    maxAgeHours: 168,
    // Generous SLA: a third party controls the refresh cadence. Three weeks
    // stale = time for a human to find a replacement source, which is exactly
    // what the red run is for.
    slaHours: 504,
    optional: true,
    label: 'x402 chains',
  },
]

// ── HTTP ─────────────────────────────────────────────────────
async function duneRequest(path, options = {}) {
  const url = path.startsWith('http') ? path : `${DUNE_API_BASE}${path}`
  for (let attempt = 1; ; attempt++) {
    const res = await fetch(url, {
      ...options,
      headers: {
        ...headers,
        ...(options.body ? { 'Content-Type': 'application/json' } : {}),
        ...(options.headers || {}),
      },
    })
    const text = await res.text()
    let json = {}
    if (text) {
      try { json = JSON.parse(text) }
      catch { json = { raw: text } }
    }
    if (res.ok) return json
    const message = json?.error?.message || json?.message || text || `HTTP ${res.status}`
    const retryable = res.status === 429 || res.status >= 500
    if (retryable && attempt < 3) {
      console.warn(`Dune API ${res.status} on ${path}; retrying in ${RETRY_DELAY_MS / 1000}s (attempt ${attempt}/2)`)
      await sleep(RETRY_DELAY_MS)
      continue
    }
    const error = new Error(message)
    error.status = res.status
    throw error
  }
}

function isQuotaError(error) {
  return /datapoint limit|billing cycle|subscription settings|configured datapoint|monthly limit|quota|credit/i.test(error?.message || '')
}

// ── Helpers ──────────────────────────────────────────────────
function creditNumber(value) {
  const n = Number(value)
  return Number.isFinite(n) ? n : 0
}

function optionalCreditNumber(value) {
  const n = Number(value)
  return Number.isFinite(n) ? n : null
}

async function readUsage() {
  const payload = await duneRequest('/usage', { method: 'POST', body: JSON.stringify({}) })
  const periods = payload.billingPeriods || payload.billing_periods || []
  const current = periods[periods.length - 1] || payload
  const creditsUsed = optionalCreditNumber(current.credits_used ?? current.creditsUsed ?? payload.credits_used ?? payload.creditsUsed)
  if (creditsUsed === null) {
    throw new Error('usage response missing credits_used')
  }
  return {
    creditsUsed,
    creditsIncluded: creditNumber(current.credits_included ?? current.creditsIncluded ?? payload.credits_included ?? payload.creditsIncluded),
    raw: payload,
  }
}

function getExecutionEndedAt(payload) {
  return payload?.execution_ended_at || payload?.submitted_at || null
}

function ageHours(isoString) {
  if (!isoString) return Infinity
  const time = Date.parse(isoString)
  if (!Number.isFinite(time)) return Infinity
  return (Date.now() - time) / 36e5
}

function resultRows(payload, context) {
  if (payload?.error) {
    throw new Error(`${context}: ${payload.error.message || JSON.stringify(payload.error)}`)
  }
  const rows = payload?.result?.rows || []
  if (rows.length === 0) throw new Error(`${context}: returned 0 rows`)
  return rows
}

function assertRowShape(rows, requiredKeys, label) {
  if (!rows || rows.length === 0) return
  const first = rows[0]
  const missing = requiredKeys.filter(k => !(k in first))
  if (missing.length > 0) {
    throw new Error(
      `${label}: row schema changed — missing keys [${missing.join(', ')}]. ` +
      `Got: [${Object.keys(first).join(', ')}]`
    )
  }
}

function readExistingData() {
  try {
    return JSON.parse(readFileSync(join(OUT_DIR, 'data.json'), 'utf8'))
  } catch {
    return null
  }
}

function readBaselines() {
  try {
    return JSON.parse(readFileSync(BASELINES_PATH, 'utf8'))
  } catch {
    return {}
  }
}

const PROTOCOL_COLORS = {
  'Coinbase': '#0052FF', 'Dexter': '#6366F1', 'PayAI': '#10B981', 'Other': '#6B7280',
  'DayDreams': '#F59E0B', 'Daydreams': '#F59E0B', 'thirdweb': '#A855F7',
  'ThirdWeb': '#A855F7', 'OpenX402': '#14B8A6', 'Open X402': '#14B8A6',
  'Pieverse': '#EC4899', 'pieverse': '#EC4899', 'Mogami': '#F97316',
  'Corbits': '#84CC16', 'X402rs': '#64748B', 'AurraCloud': '#06B6D4',
  'Questflow': '#8B5CF6', 'Polygon': '#8247E5', 'Virtuals Protocol': '#22C55E',
}
const FALLBACK_COLORS = ['#6366F1', '#10B981', '#F59E0B', '#A855F7', '#14B8A6', '#EC4899', '#F97316', '#64748B']
const getColor = (name, idx) => PROTOCOL_COLORS[name] || FALLBACK_COLORS[idx % FALLBACK_COLORS.length]
const safeNum = v => { const n = parseFloat(v); return isNaN(n) ? 0 : n }
const chainName = n => ({ bnb: 'BNB', opbnb: 'opBNB', megaeth: 'MegaETH', avalanche_c: 'Avalanche' }[n] || n.charAt(0).toUpperCase() + n.slice(1))
const TESTNETS = new Set(['sepolia', 'goerli', 'mumbai', 'amoy', 'holesky'])

// ── Per-query parsers: raw rows → fragment ───────────────────
const PARSERS = {
  x402Cumulative(rows, baselines) {
    // Supported grains:
    //   - DAY-GRAIN recent window (query 7895747, current design): per-(day,
    //     facilitator) WITHOUT cumulative_* columns. With a frozen baseline
    //     present it is a window on top of baselines.x402 (day-grain boundary
    //     guard, foldable weekly by self-folding); without a baseline it is
    //     treated as a full history (the dead incremental fork 7666075's
    //     shape — kept for the offline tests and DUNE_QID_* revert).
    //   - month-grain recent window (query 7873181): per-(month, facilitator)
    //     WITHOUT cumulative_* columns; requires the frozen baseline. Cannot
    //     be folded mid-month — superseded by the day-grain query.
    //   - legacy upstream (query 6058135): per-(month, facilitator) with
    //     precomputed cumulative_* columns. NEVER cron this one — its
    //     full-history rescan is what burned the original account's credits.
    const first = rows[0] || {}
    const isDayGrain = 'day' in first
    const isLegacy = !isDayGrain && 'cumulative_txn' in first
    const base = baselines?.x402
    // Window semantics whenever a baseline exists (day grain) or the rows are
    // month-grain without cumulative columns (month-grain windows are useless
    // without a baseline, hence the refusal below).
    const isWindow = !isLegacy && (!isDayGrain || Boolean(base?.cutoff))
    if (isDayGrain) {
      assertRowShape(rows, ['day', 'facilitator', 'total_txn', 'total_vol'], 'Q x402Cumulative (day grain)')
    } else if (isWindow) {
      assertRowShape(rows, ['date_time', 'facilitator', 'total_txn', 'total_vol'], 'Q x402Cumulative (recent window)')
      if (!base?.cutoff) throw new Error('x402 recent-window rows received but scripts/dune/baselines.json has no x402 baseline — refusing to publish window-only totals')
    } else {
      assertRowShape(rows, ['cumulative_txn', 'cumulative_volume', 'total_txn', 'total_vol', 'facilitator', 'date_time'], 'Q x402Cumulative')
    }
    const protocolMap = {}, monthlyMap = {}
    let totalTxs = 0, totalVolume = 0
    if (isLegacy) {
      totalTxs = safeNum(rows[0].cumulative_txn)
      totalVolume = safeNum(rows[0].cumulative_volume)
    }
    if (isWindow) {
      // Seed everything from the frozen baseline, then add the window on top.
      totalTxs = safeNum(base.totalTxs)
      totalVolume = safeNum(base.totalVolume)
      for (const m of base.monthly || []) monthlyMap[m.month] = { txs: safeNum(m.txs), vol: safeNum(m.vol) }
      for (const p of base.protocols || []) protocolMap[p.name] = { txs: safeNum(p.txs), vol: safeNum(p.vol) }
    }
    // Boundary guard grain follows the row grain: day-grain windows compare
    // whole days (mid-month cutoffs work), month-grain windows compare months.
    const cutoffMonth = isWindow && !isDayGrain ? base.cutoff.slice(0, 7) : null
    const cutoffDay = isWindow && isDayGrain ? base.cutoff.slice(0, 10) : null
    let droppedPreCutoff = 0
    rows.forEach(row => {
      const day = isDayGrain ? (row.day || '').slice(0, 10) : null
      const month = (isDayGrain ? row.day : row.date_time || '').slice(0, 7)
      // Frozen spans stay frozen: anything the window query returns before the
      // cutoff would double-count the baseline.
      if (cutoffMonth && month && month < cutoffMonth) { droppedPreCutoff += 1; return }
      if (cutoffDay && day && day < cutoffDay) { droppedPreCutoff += 1; return }
      const name = row.facilitator || 'Other'
      if (!protocolMap[name]) protocolMap[name] = { txs: 0, vol: 0 }
      const txn = safeNum(row.total_txn)
      const vol = safeNum(row.total_vol)
      protocolMap[name].txs += txn
      protocolMap[name].vol += vol
      if (isDayGrain || isWindow) { totalTxs += txn; totalVolume += vol }
      if (month) {
        if (!monthlyMap[month]) monthlyMap[month] = { txs: 0, vol: 0 }
        monthlyMap[month].txs += txn
        monthlyMap[month].vol += vol
      }
    })
    if (droppedPreCutoff > 0) {
      console.warn(`x402 recent window: dropped ${droppedPreCutoff} pre-cutoff rows (< ${base.cutoff}) to protect the frozen baseline`)
    }
    const monthly = Object.entries(monthlyMap)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, v]) => {
        const [year, month] = key.split('-')
        const label = new Date(parseInt(year), parseInt(month) - 1).toLocaleString('en-US', { month: 'short', year: '2-digit' })
        return { month: label, txs: Math.round(v.txs), vol: Math.round(v.vol) }
      })
    const protocolEntries = Object.entries(protocolMap).sort(([, a], [, b]) => b.txs - a.txs)
    const totalProtoTxs = protocolEntries.reduce((s, [, v]) => s + v.txs, 0) || totalTxs
    const displayEntries = protocolEntries.slice(0, 6).map(([name, v]) => [name, { ...v }])
    const tailEntries = protocolEntries.slice(6)
    const otherTxs = tailEntries.reduce((s, [, v]) => s + v.txs, 0)
    const otherVol = tailEntries.reduce((s, [, v]) => s + v.vol, 0)
    if (otherTxs > 0) {
      const existingOther = displayEntries.find(([name]) => name === 'Other')
      if (existingOther) {
        existingOther[1].txs += otherTxs
        existingOther[1].vol += otherVol
      } else {
        displayEntries.push(['Other', { txs: otherTxs, vol: otherVol }])
      }
    }
    const protocols = displayEntries.map(([name, v], i) => ({
      name,
      share: parseFloat(((v.txs / totalProtoTxs) * 100).toFixed(1)),
      color: getColor(name, i),
    }))
    return {
      totalTxs: Math.round(totalTxs),
      totalVolume: Math.round(totalVolume),
      // The baseline only carries the top displayed facilitators by name, so in
      // window mode the map undercounts the long tail — keep the frozen count.
      facilitatorsTracked: isWindow
        ? Math.max(safeNum(base.facilitatorsTracked), Object.keys(protocolMap).length)
        : Object.keys(protocolMap).length,
      monthly,
      protocols,
    }
  },

  x402Daily(rows, baselines) {
    assertRowShape(rows, ['period', 'txs'], 'Q x402Daily')
    const base = baselines?.x402Daily
    const cutoffDay = base?.cutoff ? base.cutoff.slice(0, 10) : null
    const dailyMap = {}
    if (base) {
      for (const d of base.daily || []) dailyMap[d.day] = { txs: safeNum(d.txs) }
    }
    let droppedPreCutoff = 0
    rows.forEach(row => {
      const day = (row.period || '').slice(0, 10)
      if (!day) return
      if (cutoffDay && day < cutoffDay) { droppedPreCutoff += 1; return }
      if (!dailyMap[day]) dailyMap[day] = { txs: 0 }
      dailyMap[day].txs += safeNum(row.txs)
    })
    if (droppedPreCutoff > 0) {
      console.warn(`x402 daily recent window: dropped ${droppedPreCutoff} pre-cutoff rows (< ${base.cutoff}) to protect the frozen baseline`)
    }
    const daily = Object.entries(dailyMap)
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-60)
      .map(([day, v]) => ({ day, txs: Math.round(v.txs) }))
    return { daily }
  },

  baseAgentic(rows) {
    // Schema changed 2026-05-20: upstream dropped 'Cumulative Transactions'.
    // Derive cumulative by summing Daily Transactions across the returned window.
    assertRowShape(rows, ['day', 'category', 'Daily Transactions'], 'Q baseAgentic')
    const agMap = {}
    rows.forEach(row => {
      const day = row.day || ''
      if (!day) return
      if (!agMap[day]) agMap[day] = { consumer: 0, infrastructure: 0 }
      const cat = (row.category || '').toLowerCase()
      const txs = safeNum(row['Daily Transactions'])
      if (cat === 'consumer') agMap[day].consumer += txs
      else agMap[day].infrastructure += txs
    })
    const daily = Object.entries(agMap)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([day, v]) => ({ day, consumer: v.consumer, infrastructure: v.infrastructure, total: v.consumer + v.infrastructure }))
    return { totalTxs: daily.reduce((sum, d) => sum + d.total, 0), daily }
  },

  virtualsAcp(rows, baselines) {
    const base = baselines?.virtualsAcp
    assertRowShape(rows, base ? ['period', 'num_of_memo', 'unique_sender'] : ['period', 'num_of_memo', 'unique_sender', 'total_memo'], 'Q virtualsAcp')
    // Rows are per-day per-version (v1, v2). Merge by day. Legacy rows carry
    // total_memo; recent-window rows are added to the frozen baseline total.
    const acpMap = {}
    const cutoffDay = base?.cutoff ? base.cutoff.slice(0, 10) : null
    let maxTotalMemo = safeNum(base?.totalMemos)
    let windowMemos = 0
    if (base) {
      for (const d of base.daily || []) acpMap[d.day] = { memos: safeNum(d.memos), senders: safeNum(d.senders) }
    }
    let droppedPreCutoff = 0
    rows.forEach(row => {
      const day = (row.period || '').slice(0, 10)
      if (!day) return
      if (cutoffDay && day < cutoffDay) { droppedPreCutoff += 1; return }
      if (!acpMap[day]) acpMap[day] = { memos: 0, senders: 0 }
      const memos = safeNum(row.num_of_memo)
      acpMap[day].memos += memos
      acpMap[day].senders = Math.max(acpMap[day].senders, safeNum(row.unique_sender))
      windowMemos += memos
      const tm = safeNum(row.total_memo)
      if (tm > maxTotalMemo) maxTotalMemo = tm
    })
    if (base && maxTotalMemo === safeNum(base.totalMemos)) {
      maxTotalMemo = safeNum(base.totalMemos) + windowMemos
    }
    if (droppedPreCutoff > 0) {
      console.warn(`Virtuals ACP recent window: dropped ${droppedPreCutoff} pre-cutoff rows (< ${base.cutoff}) to protect the frozen baseline`)
    }
    const daily = Object.entries(acpMap)
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-90)
      .map(([day, v]) => ({ day, memos: v.memos, senders: v.senders }))
    return { totalMemos: maxTotalMemo, daily }
  },

  erc8004Registry(rows, baselines) {
    // Same row shape for both modes. When baselines.erc8004Registry exists the
    // rows are treated as a recent window (>= cutoff) on top of the frozen
    // per-chain/daily baseline; when it is null (current state) the rows are a
    // full history and parse exactly as before.
    assertRowShape(rows, ['blockchain', 'block_date', 'registered'], 'Q erc8004Registry')
    const base = baselines?.erc8004Registry
    const cutoffDay = base?.cutoff ? base.cutoff.slice(0, 10) : null
    const chains = {}, dailyMap = {}
    if (base) {
      for (const c of base.chains || []) chains[c.name] = safeNum(c.agents)
      for (const d of base.daily || []) dailyMap[d.day] = safeNum(d.agents)
    }
    let totalAgents = safeNum(base?.totalAgents)
    let droppedPreCutoff = 0
    rows.forEach(row => {
      const chain = row.blockchain || ''
      if (TESTNETS.has(chain)) return
      const day = (row.block_date || '').slice(0, 10)
      if (cutoffDay && day && day < cutoffDay) { droppedPreCutoff += 1; return }
      const reg = safeNum(row.registered)
      totalAgents += reg
      const name = chainName(chain)
      if (!chains[name]) chains[name] = 0
      chains[name] += reg
      if (day) {
        if (!dailyMap[day]) dailyMap[day] = 0
        dailyMap[day] += reg
      }
    })
    if (droppedPreCutoff > 0) {
      console.warn(`registry recent window: dropped ${droppedPreCutoff} pre-cutoff rows (< ${base.cutoff}) to protect the frozen baseline`)
    }
    return {
      totalAgents: base ? totalAgents : Object.values(chains).reduce((s, v) => s + v, 0),
      chainsTracked: Math.max(Object.keys(chains).length, safeNum(base?.chainsTracked)),
      chains: Object.entries(chains)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 12)
        .map(([name, agents]) => ({ name, agents })),
      daily: Object.entries(dailyMap)
        .sort(([a], [b]) => a.localeCompare(b))
        .slice(-90)
        .map(([day, agents]) => ({ day, agents })),
    }
  },

  x402TokenSplit(rows) {
    // One aggregated row: usdc_vol, total_vol, usdc_txs, total_txs. The apex
    // page wants a volume-weighted share, so usdcSharePct = usdc_vol/total_vol.
    assertRowShape(rows, ['usdc_vol', 'total_vol', 'usdc_txs', 'total_txs'], 'Q x402TokenSplit')
    const r = rows[0] || {}
    const usdcVol = safeNum(r.usdc_vol)
    const totalVol = safeNum(r.total_vol)
    const totalTxs = safeNum(r.total_txs)
    const usdcTxs = safeNum(r.usdc_txs)
    // A zero total means the registry scope resolved to nothing (the exact
    // stale-address failure mode that once produced a false 0% USDC) — refuse
    // to publish rather than emit a misleading 0% share.
    if (totalVol <= 0) throw new Error('x402TokenSplit: total_vol is 0 — registry scope likely broken; refusing to publish a false 0% split')
    const usdcSharePct = parseFloat(((usdcVol / totalVol) * 100).toFixed(2))
    return {
      usdcSharePct,
      totalPayments: Math.round(totalTxs),
      usdcTxs: Math.round(usdcTxs),
      usdcVol: Math.round(usdcVol),
      totalVol: Math.round(totalVol),
    }
  },

  x402Chains(rows) {
    // Third-party query whose exact column names we do not control, so this
    // parser is deliberately defensive: find the chain column and the count
    // column by name from known variants, and when nothing matches, log the
    // observed columns and refuse — the assembly then falls back to the
    // previous build's split rather than publishing garbage.
    if (!rows.length) throw new Error('x402Chains: empty result')
    const cols = Object.keys(rows[0])
    const pick = (cands) => cands.find(c => cols.includes(c))
    const chainCol = pick(['blockchain', 'chain', 'chain_name', 'network'])
    const txCandidates = ['cumulative_txn', 'cumulative_transactions', 'total_txn', 'total_transactions', 'txn_count', 'tx_count', 'transactions', 'txns', 'txs', 'count']
    const txCol = pick(txCandidates)
    if (!chainCol || !txCol) {
      throw new Error(`x402Chains: unrecognized columns [${cols.join(', ')}] — expected a chain column and a transaction-count column`)
    }
    // A cumulative column repeats per period → take MAX per chain; a periodic
    // count column → SUM per chain. Detect by name.
    const cumulative = txCol.startsWith('cumulative')
    const byChain = {}
    for (const row of rows) {
      const raw = String(row[chainCol] ?? '').trim().toLowerCase()
      if (!raw || TESTNETS.has(raw)) continue
      const n = safeNum(row[txCol])
      if (cumulative) byChain[raw] = Math.max(byChain[raw] ?? 0, n)
      else byChain[raw] = (byChain[raw] ?? 0) + n
    }
    const CHAIN_COLORS = { Base: '#0052FF', Solana: '#9945FF', Polygon: '#8247E5', BNB: '#F0B90B', Avalanche: '#E84142', Arbitrum: '#12AAFF', SEI: '#9D4EDD' }
    const chains = Object.entries(byChain)
      .map(([raw, txs], i) => {
        const name = chainName(raw)
        return { name, txs: Math.round(txs), color: CHAIN_COLORS[name] || getColor(name, i) }
      })
      .filter(c => c.txs > 0)
      .sort((a, b) => b.txs - a.txs)
      .slice(0, 12)
    // Plausibility: the split must at least resemble x402 scale. The June-2026
    // snapshot summed ~127M; anything under 1M means we parsed the wrong thing.
    const total = chains.reduce((s2, c) => s2 + c.txs, 0)
    if (chains.length < 2 || total < 1_000_000) {
      throw new Error(`x402Chains: implausible parse (${chains.length} chains, ${total} total) from columns [${cols.join(', ')}]`)
    }
    return { chains }
  },

  olas(rows, baselines) {
    const base = baselines?.olas
    assertRowShape(rows, base ? ['time', 'chain', 'total_weekly_transactions_number'] : ['time', 'chain', 'total_weekly_transactions_number', 'global_cumulative_transactions_number'], 'Q olas')
    const latest = rows.reduce((best, r) => (r.time || '') > (best.time || '') ? r : best, {})
    const chains = {}, weekMap = {}
    const cutoffWeek = base?.cutoff ? base.cutoff.slice(0, 10) : null
    let totalTxs = safeNum(base?.totalTxs)
    if (base) {
      for (const c of base.chains || []) chains[c.name] = safeNum(c.txs)
      for (const w of base.weekly || []) weekMap[w.week] = { txs: safeNum(w.txs) }
    }
    let droppedPreCutoff = 0
    rows.forEach(row => {
      const week = (row.time || '').slice(0, 10)
      const chain = row.chain || ''
      if (cutoffWeek && week && week < cutoffWeek) { droppedPreCutoff += 1; return }
      const txs = safeNum(row.total_weekly_transactions_number)
      const name = chainName(chain)
      if (!chains[name]) chains[name] = 0
      chains[name] += txs
      if (base) totalTxs += txs
      if (week) {
        if (!weekMap[week]) weekMap[week] = { txs: 0 }
        weekMap[week].txs += txs
      }
    })
    if (droppedPreCutoff > 0) {
      console.warn(`Olas recent window: dropped ${droppedPreCutoff} pre-cutoff rows (< ${base.cutoff}) to protect the frozen baseline`)
    }
    return {
      totalTxs: base ? totalTxs : safeNum(latest.global_cumulative_transactions_number),
      chains: Object.entries(chains)
        .sort(([, a], [, b]) => b - a)
        .map(([name, txs]) => ({ name, txs })),
      weekly: Object.entries(weekMap)
        .sort(([a], [b]) => a.localeCompare(b))
        .slice(-52)
        .map(([week, v]) => ({ week, txs: v.txs })),
    }
  },
}

// Rebuild a fragment from the previous data.json (used when the upstream
// execution is unchanged, or as a fallback after a failed refresh).
const REUSERS = {
  x402Cumulative: d => d?.x402 && {
    totalTxs: d.x402.totalTxs,
    totalVolume: d.x402.totalVolume,
    facilitatorsTracked: d.x402.facilitatorsTracked,
    monthly: d.x402.monthly,
    protocols: d.x402.protocols,
  },
  x402Daily: d => (d?.x402?.daily ? { daily: d.x402.daily } : null),
  baseAgentic: d => d?.baseAgentic || null,
  virtualsAcp: d => d?.virtualsAcp || null,
  erc8004Registry: d => d?.erc8004Registry || null,
  olas: d => d?.olas || null,
  x402TokenSplit: d => (d?.x402?.tokenSplit ? {
    usdcSharePct: d.x402.tokenSplit.usdcSharePct,
    totalPayments: d.x402.tokenSplit.totalPayments,
  } : null),
  x402Chains: d => (Array.isArray(d?.x402?.chains) && d.x402.chains.length ? { chains: d.x402.chains } : null),
}

function existingAsOf(existing, key) {
  switch (key) {
    case 'x402Cumulative':
    case 'x402Daily':
      return existing?.x402?.asOf || existing?.updatedAt || null
    case 'baseAgentic':
      return existing?.baseAgentic?.asOf || existing?.updatedAt || null
    case 'virtualsAcp':
      return existing?.virtualsAcp?.asOf || existing?.updatedAt || null
    case 'erc8004Registry':
      return existing?.erc8004Registry?.asOf || existing?.updatedAt || null
    case 'olas':
      return existing?.olas?.asOf || existing?.updatedAt || null
    case 'x402TokenSplit':
      return existing?.x402?.tokenSplit?.asOf || existing?.x402?.asOf || existing?.updatedAt || null
    default:
      return existing?.updatedAt || null
  }
}

function syntheticPreviousMeta(existing) {
  if (!existing) return {}
  if (existing?.meta?.queries) return existing.meta.queries
  const meta = {}
  for (const query of QUERIES) {
    if (!REUSERS[query.key](existing)) continue
    meta[query.key] = {
      queryId: query.id,
      executionId: null,
      executedAt: existingAsOf(existing, query.key),
      bootstrap: true,
    }
  }
  return meta
}

function legacyBootstrapData(existing) {
  if (!existing || existing?.meta?.queries) return null
  const queries = syntheticPreviousMeta(existing)
  if (Object.keys(queries).length !== QUERIES.length) return null
  return {
    ...existing,
    meta: {
      ...(existing.meta || {}),
      schema: 3,
      queries,
    },
  }
}

function freshnessBreaches(meta) {
  const breaches = []
  for (const query of QUERIES) {
    // Optional sources that have never been materialized don't count against
    // the SLA — a missing secondary metric must not turn the whole run red.
    if (query.optional && !meta?.[query.key]) continue
    // Read-only sources refresh on a third party's cadence, which no red run
    // can accelerate: the first live ingest of the by-chain query arrived
    // 1,524h old and would have failed this gate every day forever. Their
    // consumers render the as-of date, so staleness is disclosed where it
    // matters — on the page — rather than as a daily alarm nobody can act on.
    if (query.readOnly) continue
    const effectiveAge = ageHours(meta?.[query.key]?.executedAt)
    if (effectiveAge > query.slaHours) {
      breaches.push(`${query.label}: data is ${effectiveAge.toFixed(1)}h old (SLA ${query.slaHours}h)`)
    }
  }
  return breaches
}

// Cumulative metrics that must never shrink: fragment field → label.
const MONOTONIC = {
  x402Cumulative: [['totalTxs', 'x402 total txs'], ['totalVolume', 'x402 total volume']],
  virtualsAcp: [['totalMemos', 'ACP total memos']],
  olas: [['totalTxs', 'Olas total txs']],
}

// ── Execution (sequential: free plan = 1 concurrent query) ───
async function executeAndWait(query, baselines) {
  // Recent-window queries declare a {{window_start}} text parameter; we drive
  // it from the frozen-baseline cutoff. Advancing the window = editing
  // baselines.json — never PATCH the SQL (a PATCH bumps the query version and
  // wipes Dune-side state; that bit us hard in the incremental era).
  const windowStart = query.baselineKey ? baselines?.[query.baselineKey]?.cutoff : null
  let started
  try {
    started = await duneRequest(`/query/${query.id}/execute`, {
      method: 'POST',
      body: executionRequestBody(windowStart ? { query_parameters: { window_start: windowStart } } : {}),
    })
  } catch (error) {
    // Legacy/fork queries don't declare the parameter — retry once without it.
    if (windowStart && error.status === 400 && /param/i.test(error.message || '')) {
      console.warn(`${query.label}: query rejected window_start parameter; retrying without it`)
      started = await duneRequest(`/query/${query.id}/execute`, {
        method: 'POST',
        body: executionRequestBody(),
      })
    } else {
      throw error
    }
  }
  const executionId = started.execution_id
  if (!executionId) throw new Error(`Dune ${query.id}: execute response missing execution_id`)
  const startedAt = Date.now()
  while (Date.now() - startedAt < EXECUTION_TIMEOUT_MS) {
    const status = await duneRequest(`/execution/${executionId}/status`)
    const statusCost = creditNumber(status.execution_cost_credits)
    if (status.state === 'QUERY_STATE_COMPLETED' || status.state === 'QUERY_STATE_COMPLETED_PARTIAL') {
      const result = await duneRequest(`/execution/${executionId}/results?limit=${query.limit}&allow_partial_results=true`)
      result._executionCostCredits = statusCost
      result._executionStatus = status
      return result
    }
    if (statusCost >= QUERY_CREDIT_CAP) {
      await duneRequest(`/execution/${executionId}/cancel`, { method: 'POST' }).catch(error => {
        console.warn(`${query.label}: failed to cancel execution ${executionId} at ${statusCost.toFixed(2)} credits (${error.message})`)
      })
      const error = new Error(`Dune ${query.id}: execution ${executionId} cancelled by query cap ${QUERY_CREDIT_CAP} after ${statusCost.toFixed(2)} credits`)
      error.executionCostCredits = statusCost
      throw error
    }
    if (status.state === 'QUERY_STATE_FAILED' || status.state === 'QUERY_STATE_CANCELED' || status.state === 'QUERY_STATE_CANCELLED' || status.state === 'QUERY_STATE_EXPIRED') {
      const detail = status?.error?.message || status.state
      const error = new Error(`Dune ${query.id}: execution ${executionId} ${detail}`)
      error.executionCostCredits = statusCost
      throw error
    }
    await sleep(POLL_INTERVAL_MS)
  }
  throw new Error(`Dune ${query.id}: execution timed out after ${Math.round(EXECUTION_TIMEOUT_MS / 1000)}s`)
}

function unsafeQueryReason(query) {
  if (ALLOW_UNSAFE_QUERY_IDS) return null
  if (BLOCKED_FRESH_QUERY_IDS.has(query.id)) {
    return `query id ${query.id} is blocked for fresh execution`
  }
  return null
}

function freshExecutionBlockReason(state, budget, prev, baselines) {
  // Unconditional, env-independent: a readOnly source may never execute. The
  // DUNE_REFRESH_KEYS gate below only exists when the workflow sets that env,
  // so on a bare local/test run it is wide open — which is exactly how a
  // read-only third-party full-history query would end up executing and
  // burning the credits this flag exists to protect.
  if (state.query.readOnly) {
    return `query ${state.query.key} is readOnly: latest cached results only, never executed`
  }
  if (REFRESH_KEYS && !REFRESH_KEYS.has(state.query.key)) {
    return `query key ${state.query.key} is not selected by DUNE_REFRESH_KEYS`
  }
  const unsafe = unsafeQueryReason(state.query)
  if (unsafe) return unsafe
  if (budget.holdReason) return budget.holdReason
  if (budget.runCredits >= RUN_CREDIT_CAP) {
    return `run credit cap reached (${budget.runCredits.toFixed(2)}/${RUN_CREDIT_CAP})`
  }
  if (budget.usageBefore && budget.usageBefore.creditsUsed + budget.runCredits + QUERY_CREDIT_CAP > MONTHLY_CREDIT_CAP) {
    return `monthly cap guard would be exceeded (${budget.usageBefore.creditsUsed.toFixed(2)} used, cap ${MONTHLY_CREDIT_CAP})`
  }
  const previousCost = creditNumber(prev?.lastCostCredits)
  if (previousCost > QUERY_CREDIT_CAP) {
    // An over-cap record only describes the window it was executed against.
    // Once the current window is strictly SMALLER than that one, the old cost
    // no longer predicts the next attempt — allow a fresh (still cap-protected)
    // try. Preferred evidence: the recorded lastWindowStart vs the current
    // cutoff. Legacy records (no lastWindowStart) fall back to comparing the
    // execution date, which is coarser but only ever lifts later, never sooner.
    const cutoff = state.query.baselineKey ? baselines?.[state.query.baselineKey]?.cutoff : null
    const cutoffDay = cutoff ? String(cutoff).slice(0, 10) : null
    const prevWindow = String(prev?.lastWindowStart || '').slice(0, 10)
    const prevDay = String(prev?.executedAt || '').slice(0, 10)
    const windowShrankSince = Boolean(
      cutoffDay && (prevWindow ? cutoffDay > prevWindow : prevDay && prevDay < cutoffDay),
    )
    if (!windowShrankSince) {
      return `previous execution cost ${previousCost.toFixed(2)} exceeded query cap ${QUERY_CREDIT_CAP}`
    }
    console.log(`${state.query.label}: previous over-cap cost ${previousCost.toFixed(2)} was for a larger window (start ${prevWindow || 'unknown'}) — cutoff now ${cutoffDay}, allowing a fresh attempt`)
  }
  return null
}

// ── Main ─────────────────────────────────────────────────────
async function main() {
  if (REFRESH_KEYS) {
    const known = new Set(QUERIES.map(q => q.key))
    const unknown = [...REFRESH_KEYS].filter(k => !known.has(k))
    if (unknown.length > 0) {
      throw new Error(`DUNE_REFRESH_KEYS contains unknown query key(s): ${unknown.join(', ')}`)
    }
  }

  console.log('Dune pipeline v3')
  console.log(`execution budget ${MAX_EXECUTIONS}/run; engine ${PERFORMANCE || 'account default'}; caps ${MONTHLY_CREDIT_CAP}/month, ${RUN_CREDIT_CAP}/run, ${QUERY_CREDIT_CAP}/query\n`)
  if (REFRESH_KEYS) {
    console.log(`fresh execution scope: ${[...REFRESH_KEYS].join(', ')}\n`)
  }

  const existing = readExistingData()
  const baselines = readBaselines()
  if (baselines?.x402?.cutoff) {
    console.log(`frozen baseline: x402 through < ${baselines.x402.cutoff}${baselines.erc8004Registry?.cutoff ? `, registry through < ${baselines.erc8004Registry.cutoff}` : ''}${baselines.x402.protocolsApprox ? ' (protocols approx — run build-baseline.mjs for exact)' : ''}`)
  }
  const bootstrapData = legacyBootstrapData(existing)
  if (bootstrapData) {
    const serialized = JSON.stringify(bootstrapData, null, 2)
    const previousSerialized = JSON.stringify(existing, null, 2)
    const changed = serialized !== previousSerialized
    if (changed) {
      writeFileSync(join(OUT_DIR, 'data.json'), serialized)
      console.log('bootstrap: migrated legacy data.json to schema 3 without calling Dune')
    } else {
      console.log('bootstrap: legacy metadata already matches; no Dune calls')
    }
    const bootstrapBreaches = freshnessBreaches(bootstrapData.meta.queries)
    if (process.env.GITHUB_OUTPUT) {
      appendFileSync(process.env.GITHUB_OUTPUT, `changed=${changed}\nsla_breach=${bootstrapBreaches.length > 0}\nbudget_hold=false\n`)
    }
    if (bootstrapBreaches.length > 0) {
      console.error(`::error::Freshness SLA breached after bootstrap (data published, but needs attention):\n- ${bootstrapBreaches.join('\n- ')}`)
    }
    return
  }

  const prevMeta = syntheticPreviousMeta(existing)
  const warnings = []
  const hardFailures = []
  const budget = {
    usageBefore: null,
    usageAfter: null,
    holdReason: null,
    runCredits: 0,
    executionCosts: [],
  }

  try {
    budget.usageBefore = await readUsage()
    const remaining = MONTHLY_CREDIT_CAP - budget.usageBefore.creditsUsed
    console.log(`Dune usage before: ${budget.usageBefore.creditsUsed.toFixed(2)} credits used${budget.usageBefore.creditsIncluded ? ` of ${budget.usageBefore.creditsIncluded}` : ''}; ${remaining.toFixed(2)} until cap ${MONTHLY_CREDIT_CAP}`)
    if (remaining <= 0) {
      budget.holdReason = `monthly credit cap reached (${budget.usageBefore.creditsUsed.toFixed(2)}/${MONTHLY_CREDIT_CAP})`
    } else if (remaining < QUERY_CREDIT_CAP) {
      budget.holdReason = `monthly remaining credits (${remaining.toFixed(2)}) are below query cap ${QUERY_CREDIT_CAP}`
    }
  } catch (error) {
    budget.holdReason = `usage preflight failed (${error.message})`
  }
  if (budget.holdReason) {
    warnings.push(`Dune budget hold: ${budget.holdReason}; reusing previous-build data and skipping Dune result reads`)
    console.warn(warnings[warnings.length - 1])
  }

  // Phase 1 — probe every query (limit=1, KB-scale read).
  const states = []
  for (const query of QUERIES) {
    const state = { query, probe: null, probeError: null }
    const prev = prevMeta[query.key]
    if (budget.holdReason) {
      state.probeError = new Error(`budget hold: ${budget.holdReason}`)
      state.latestAge = ageHours(prev?.executedAt)
    } else {
      try {
        state.probe = await duneRequest(`/query/${query.id}/results?limit=1&allow_partial_results=true`)
        if (state.probe?.error) {
          state.probeError = new Error(`latest execution failed: ${state.probe.error.message || JSON.stringify(state.probe.error)}`)
          state.probe = null
        }
      } catch (error) {
        state.probeError = error
      }
      if (state.probe) {
        state.latestId = state.probe.execution_id || null
        state.latestEndedAt = getExecutionEndedAt(state.probe)
        state.latestAge = prev?.bootstrap ? ageHours(prev.executedAt) : ageHours(state.latestEndedAt)
      } else {
        state.latestAge = ageHours(prev?.executedAt)
        console.warn(`probe ${query.label}: ${state.probeError.message}`)
      }
    }
    states.push(state)
  }

  // Phase 2 — decide refreshes, most-overdue first, strictly sequential.
  const dueStates = states
    .filter(s => s.latestAge > s.query.maxAgeHours)
    .sort((a, b) => (b.latestAge / b.query.maxAgeHours) - (a.latestAge / a.query.maxAgeHours))
  let executionsUsed = 0
  for (const state of dueStates) {
    const prev = prevMeta[state.query.key]
    if (executionsUsed >= MAX_EXECUTIONS) {
      state.preferPreviousReason = `execution budget (${MAX_EXECUTIONS}) is spent`
      console.warn(`${state.query.label}: due for refresh but ${state.preferPreviousReason}; using previous-build data when available`)
      continue
    }
    const blocked = freshExecutionBlockReason(state, budget, prev, baselines)
    if (blocked) {
      state.preferPreviousReason = blocked
      warnings.push(`${state.query.label}: fresh execution blocked (${blocked}); using previous-build data when available`)
      console.warn(warnings[warnings.length - 1])
      continue
    }
    const ageLabel = Number.isFinite(state.latestAge) ? `${state.latestAge.toFixed(1)}h old` : 'unavailable'
    console.log(`${state.query.label}: latest result ${ageLabel}; executing fresh (engine ${PERFORMANCE})`)
    executionsUsed += 1
    try {
      // Recorded so an over-cap cost can later be judged against the window it
      // actually scanned (freshExecutionBlockReason's shrink rule).
      state.windowStartUsed = state.query.baselineKey ? baselines?.[state.query.baselineKey]?.cutoff ?? null : null
      state.execResult = await executeAndWait(state.query, baselines)
      state.execId = state.execResult.execution_id || null
      state.execEndedAt = getExecutionEndedAt(state.execResult) || new Date().toISOString()
      state.executionCostCredits = creditNumber(state.execResult._executionCostCredits)
      budget.runCredits += state.executionCostCredits
      budget.executionCosts.push({ key: state.query.key, queryId: state.query.id, executionId: state.execId, credits: state.executionCostCredits })
      console.log(`${state.query.label}: execution cost ${state.executionCostCredits.toFixed(2)} credits`)
      if (state.executionCostCredits > QUERY_CREDIT_CAP) {
        warnings.push(`${state.query.label}: execution cost ${state.executionCostCredits.toFixed(2)} exceeds query cap ${QUERY_CREDIT_CAP}; future automatic executions will be blocked until reviewed`)
        console.warn(warnings[warnings.length - 1])
      }
    } catch (error) {
      state.execError = error
      state.executionCostCredits = creditNumber(error.executionCostCredits)
      if (state.executionCostCredits > 0) {
        budget.runCredits += state.executionCostCredits
        budget.executionCosts.push({ key: state.query.key, queryId: state.query.id, executionId: state.execId || null, credits: state.executionCostCredits, failed: true })
      }
      const kind = isQuotaError(error) ? 'quota' : 'execution'
      warnings.push(`${state.query.label}: fresh ${kind} failure (${error.message}); falling back to newest available data`)
      console.warn(warnings[warnings.length - 1])
    }
  }

  // Phase 3 — materialize fragments, downloading only what changed.
  const fragments = {}
  const metaOut = {}
  const fragmentSources = {}
  for (const state of states) {
    const { query } = state
    const prev = prevMeta[query.key]
    let rows = null
    let source = null
    let executionId = null
    let executedAt = null

    try {
      if (state.execResult) {
        rows = resultRows(state.execResult, `${query.label} fresh execution`)
        source = 'execution'
        executionId = state.execId
        executedAt = state.execEndedAt
        // Retained for the self-folding phase: folding may only freeze data
        // from a FULLY completed, untruncated fresh execution.
        state.freshRows = rows
        state.freshComplete =
          state.execResult._executionStatus?.state === 'QUERY_STATE_COMPLETED' && rows.length < query.limit
      } else if (state.probe && prev && state.latestId && prev.executionId === state.latestId) {
        const fragment = REUSERS[query.key](existing)
        if (fragment) {
          fragments[query.key] = fragment
          metaOut[query.key] = { queryId: query.id, executionId: prev.executionId, executedAt: prev.executedAt, lastCostCredits: prev.lastCostCredits, lastWindowStart: prev.lastWindowStart }
          fragmentSources[query.key] = 'unchanged'
          console.log(`${query.label}: unchanged (execution ${state.latestId}); skipping download`)
          continue
        }
        // data.json lacked the section (e.g. schema evolution) — fall through to a full fetch.
      }

      if (!rows && (state.preferPreviousReason || prev?.bootstrap)) {
        const fragment = REUSERS[query.key](existing)
        if (fragment && prev) {
          fragments[query.key] = fragment
          metaOut[query.key] = {
            queryId: query.id,
            executionId: prev.executionId || null,
            executedAt: prev.executedAt,
            bootstrap: prev.bootstrap || undefined,
            lastCostCredits: prev.lastCostCredits,
            lastWindowStart: prev.lastWindowStart,
          }
          fragmentSources[query.key] = state.preferPreviousReason ? 'previous-build' : 'bootstrap'
          const reason = state.preferPreviousReason || 'bootstrap metadata has no trusted execution id yet'
          console.log(`${query.label}: ${reason}; reusing previous build`)
          continue
        }
        if (state.preferPreviousReason && unsafeQueryReason(query)) {
          throw new Error(`${query.label}: ${state.preferPreviousReason}; no previous build available`)
        }
      }

      if (!rows && state.probe) {
        const full = await duneRequest(`/query/${query.id}/results?limit=${query.limit}&allow_partial_results=true`)
        rows = resultRows(full, `${query.label} latest result`)
        source = 'latest'
        executionId = full.execution_id || state.latestId
        executedAt = getExecutionEndedAt(full) || state.latestEndedAt
      }

      if (rows) {
        if (rows.length >= query.limit) {
          warnings.push(`${query.label}: returned exactly limit=${query.limit} rows — possible truncation, verify upstream ordering`)
          console.warn(warnings[warnings.length - 1])
        }
        fragments[query.key] = PARSERS[query.key](rows, baselines)
        // A cost record describes ONE execution. When the ingested execution id
        // moves on, a stale over-cap record must not keep blocking retries
        // forever — carry cost/window only while the execution is the same.
        const sameExecution = Boolean(executionId && prev?.executionId === executionId)
        metaOut[query.key] = {
          queryId: query.id,
          executionId,
          executedAt,
          lastCostCredits: state.executionCostCredits ?? (sameExecution ? prev?.lastCostCredits : undefined),
          lastWindowStart: state.windowStartUsed ?? (sameExecution ? prev?.lastWindowStart : undefined),
        }
        fragmentSources[query.key] = source
        console.log(`${query.label}: ${rows.length} rows (${source})`)
        continue
      }

      // No fresh data and no readable latest result — reuse the previous build.
      const fragment = REUSERS[query.key](existing)
      if (fragment && prev) {
        fragments[query.key] = fragment
        metaOut[query.key] = { queryId: query.id, executionId: prev.executionId, executedAt: prev.executedAt, bootstrap: prev.bootstrap || undefined, lastCostCredits: prev.lastCostCredits, lastWindowStart: prev.lastWindowStart }
        fragmentSources[query.key] = 'previous-build'
        warnings.push(`${query.label}: Dune unreachable (${state.probeError?.message || 'no data'}); reusing previous build`)
        console.warn(warnings[warnings.length - 1])
        continue
      }
      throw state.probeError || new Error(`${query.label}: no data available from any source`)
    } catch (error) {
      if (query.optional) {
        warnings.push(`${query.label}: ${error.message} (optional source — skipped, not blocking build)`)
        console.warn(warnings[warnings.length - 1])
      } else {
        hardFailures.push(`${query.label}: ${error.message}`)
        console.error(`${query.label} FAILED: ${error.message}`)
      }
    }
  }

  if (hardFailures.length > 0) {
    throw new Error(`No usable data for required queries:\n- ${hardFailures.join('\n- ')}`)
  }

  // Phase 4 — monotonicity: cumulative metrics must not shrink.
  for (const [key, checks] of Object.entries(MONOTONIC)) {
    if (fragmentSources[key] !== 'execution' && fragmentSources[key] !== 'latest') continue
    const prevFragment = REUSERS[key](existing)
    if (!prevFragment) continue
    for (const [field, label] of checks) {
      const oldV = safeNum(prevFragment[field])
      const newV = safeNum(fragments[key][field])
      if (oldV > 0 && newV < oldV) {
        const dropPct = ((oldV - newV) / oldV) * 100
        const msg = `${label} shrank ${dropPct.toFixed(2)}% (${oldV.toLocaleString()} → ${newV.toLocaleString()})`
        if (dropPct > 2) throw new Error(`Monotonicity violation (refusing to write): ${msg} — upstream query likely changed, needs review`)
        warnings.push(`${msg} — within 2% tolerance, accepting (likely upstream restatement)`)
        console.warn(warnings[warnings.length - 1])
      }
    }
  }

  // Phase 4.5 — self-folding (自动封账). Folding only happens from a fragment
  // that (a) came from a fresh, fully-completed, untruncated execution this
  // run AND (b) already passed the monotonicity gate above. A fold failure is
  // a warning, never a publish blocker — the window just stays open until a
  // later run can fold it. Git history keeps every baselines.json revision.
  const FOLDERS = {
    x402Cumulative: {
      baselineKey: 'x402',
      fold: (base, rows, cut) => {
        // Only the day-grain query can fold mid-month; the month-grain window
        // (query 7873181) stays as-is until DUNE_QID_X402_CUMULATIVE points at
        // the day-grain fork (7895747).
        if (!('day' in (rows[0] || {}))) return null
        return foldX402DayGrainWindow(base, rows, cut)
      },
    },
    x402Daily: { baselineKey: 'x402Daily', fold: foldX402DailySeries },
    virtualsAcp: { baselineKey: 'virtualsAcp', fold: foldVirtualsWindow },
    erc8004Registry: { baselineKey: 'erc8004Registry', fold: foldRegistryWindow },
    olas: { baselineKey: 'olas', fold: foldOlasWindow },
  }
  let foldedCount = 0
  if (SELF_FOLD) {
    const todayUtc = new Date().toISOString().slice(0, 10)
    const isoDaysAgo = n => new Date(Date.parse(`${todayUtc}T00:00:00Z`) - n * 864e5).toISOString().slice(0, 10)
    const newCutoffTarget = isoDaysAgo(FOLD_LAG_DAYS)
    for (const state of states) {
      const key = state.query.key
      const folder = FOLDERS[key]
      if (!folder) continue
      if (fragmentSources[key] !== 'execution' || !state.freshComplete || !state.freshRows) continue
      const base = baselines?.[folder.baselineKey]
      if (!base?.cutoff) continue
      const cutoffAgeDays = (Date.parse(`${todayUtc}T00:00:00Z`) - Date.parse(`${base.cutoff.slice(0, 10)}T00:00:00Z`)) / 864e5
      if (!(cutoffAgeDays > FOLD_TRIGGER_DAYS)) continue
      if (!(newCutoffTarget > base.cutoff.slice(0, 10))) continue
      try {
        const folded = folder.fold(base, state.freshRows, newCutoffTarget)
        if (!folded) {
          console.log(`${state.query.label}: self-fold skipped (month-grain rows cannot fold mid-month)`)
          continue
        }
        baselines[folder.baselineKey] = folded
        foldedCount += 1
        console.log(`${state.query.label}: self-folded baseline cutoff ${base.cutoff} → ${folded.cutoff}`)
      } catch (error) {
        warnings.push(`${state.query.label}: self-fold failed (${error.message}); window stays open until a later run can fold it`)
        console.warn(warnings[warnings.length - 1])
      }
    }
    if (foldedCount > 0) {
      baselines.generatedAt = new Date().toISOString()
      writeFileSync(BASELINES_PATH, JSON.stringify(baselines, null, 2) + '\n')
      console.log(`✓ baselines.json updated (${foldedCount} source${foldedCount > 1 ? 's' : ''} folded) — commit it so the next run scans the shorter window`)
    }
  }

  // Phase 5 — Tempo/MPP from local file (pushed by the Tempo indexer).
  let tempoMpp = existing?.tempoMpp || { totalEvents: 0, uniquePayers: 0, uniquePayees: 0, byType: {}, daily: [] }
  try {
    const td = JSON.parse(readFileSync(join(OUT_DIR, 'tempo-data.json'), 'utf8'))
    tempoMpp = {
      totalEvents: td.totalEvents || 0,
      uniquePayers: td.uniquePayers || 0,
      uniquePayees: td.uniquePayees || 0,
      byType: td.byType || {},
      daily: (td.daily || []).slice(-90),
    }
  } catch { console.log('Tempo data: public/tempo-data.json not found, keeping previous values') }

  if (budget.usageBefore && !budget.holdReason) {
    try {
      budget.usageAfter = await readUsage()
      const delta = budget.usageAfter.creditsUsed - budget.usageBefore.creditsUsed
      console.log(`Dune usage after: ${budget.usageAfter.creditsUsed.toFixed(2)} credits used (${delta >= 0 ? '+' : ''}${delta.toFixed(2)} this run by billing meter)`)
      if (delta > RUN_CREDIT_CAP) {
        warnings.push(`Dune billing delta ${delta.toFixed(2)} exceeded run cap ${RUN_CREDIT_CAP}; disable cron and review exports/executions`)
        console.warn(warnings[warnings.length - 1])
      }
    } catch (error) {
      warnings.push(`Dune usage postflight failed (${error.message}); execution costs were still logged from status endpoints`)
      console.warn(warnings[warnings.length - 1])
    }
  }

  // Phase 6 — assemble. Per-section asOf = the execution time of the data it
  // shows (x402 combines two queries: surface the older stamp, honesty first).
  const f = fragments
  const asOf = key => metaOut[key].executedAt || null
  const olderOf = (a, b) => (!a ? b : !b ? a : (Date.parse(a) <= Date.parse(b) ? a : b))
  const updatedAt = Object.values(metaOut)
    .map(m => m.executedAt)
    .filter(Boolean)
    .sort()
    .at(-1) || new Date().toISOString()

  const data = {
    updatedAt,
    meta: {
      schema: 3,
      queries: metaOut,
    },
    sources: [
      { name: 'x402 Payment Analytics', author: '@thechriscen', queryId: QUERIES[0].id },
      { name: 'x402 Analytics', author: '@hashed_official', queryId: QUERIES[1].id },
      { name: 'BASE Agentic Ecosystem', author: '@ax1research', queryId: QUERIES[2].id },
      { name: 'Virtuals ACP', author: '@hashed_official', queryId: QUERIES[3].id },
      { name: 'ERC-8004 Trustless Agents', author: '@hashed_official', queryId: QUERIES[4].id },
      { name: 'Olas Ecosystem Activity', author: '@adrian0x', queryId: QUERIES[5].id },
      { name: 'x402 token split (Base, trailing 30d)', author: 'agenteconomy', queryId: QUERIES[6].id },
      { name: 'x402 Transactions by Chain', author: '@thechriscen', queryId: QUERIES[7].id },
    ],
    x402: {
      asOf: olderOf(asOf('x402Cumulative'), asOf('x402Daily')),
      totalTxs: f.x402Cumulative.totalTxs,
      totalVolume: f.x402Cumulative.totalVolume,
      facilitatorsTracked: f.x402Cumulative.facilitatorsTracked || 15,
      monthly: f.x402Cumulative.monthly,
      daily: f.x402Daily.daily,
      protocols: f.x402Cumulative.protocols,
      // Per-chain split. Live from @thechriscen's public by-chain query when
      // readable (never executed by us — see the QUERIES entry); otherwise the
      // previous build's split via REUSERS; the frozen June-2026 snapshot only
      // remains as the last-resort floor for a from-scratch build with Dune down.
      ...(() => {
        const JUNE_SNAPSHOT = [
          { name: 'Base',      txs: 72058130, color: '#0052FF' },
          { name: 'Solana',    txs: 47231681, color: '#9945FF' },
          { name: 'Polygon',   txs: 7184927,  color: '#8247E5' },
          { name: 'BNB',       txs: 658610,   color: '#F0B90B' },
          { name: 'Avalanche', txs: 4612,     color: '#E84142' },
          { name: 'Arbitrum',  txs: 522,      color: '#12AAFF' },
          { name: 'SEI',       txs: 142,      color: '#9D4EDD' },
        ]
        const chains = f.x402Chains?.chains || JUNE_SNAPSHOT
        const live = Boolean(f.x402Chains?.chains)
        return {
          chainsTracked: chains.length,
          chains,
          // Consumers (dashboard label, apex pages) read these to state
          // provenance honestly instead of a hardcoded "June 2026" caption.
          chainsAsOf: live ? (metaOut.x402Chains?.executedAt || null) : '2026-06-30T00:00:00Z',
          chainsSource: live ? 'dune:@thechriscen (read-only)' : 'frozen snapshot (June 2026)',
        }
      })(),
      // Trailing-30d USDC-vs-total volume split on Base (live registry scope).
      // Rolling ratio, not cumulative — never folded, may move either way. Fresh
      // fragment wins; else reuse the prior split; else omit the key entirely.
      ...(f.x402TokenSplit ? {
        tokenSplit: {
          asOf: asOf('x402TokenSplit'),
          windowDays: 30,
          usdcSharePct: f.x402TokenSplit.usdcSharePct,
          totalPayments: f.x402TokenSplit.totalPayments,
          note: 'trailing 30d, Base, live facilitator registry scope; volume-weighted share',
        },
      } : (existing?.x402?.tokenSplit ? { tokenSplit: existing.x402.tokenSplit } : {})),
    },
    baseAgentic: { asOf: asOf('baseAgentic'), ...f.baseAgentic },
    virtualsAcp: { asOf: asOf('virtualsAcp'), ...f.virtualsAcp },
    tempoMpp,
    erc8004Registry: { asOf: asOf('erc8004Registry'), ...f.erc8004Registry },
    olas: { asOf: asOf('olas'), ...f.olas },
  }

  // Phase 7 — sanity gates (refuse to publish a hollow build).
  const sanityIssues = []
  if (data.x402.totalTxs <= 0) sanityIssues.push('x402.totalTxs is 0')
  if (data.x402.totalVolume <= 0) sanityIssues.push('x402.totalVolume is 0')
  if (data.x402.monthly.length < 3) sanityIssues.push(`x402.monthly has ${data.x402.monthly.length} entries (<3)`)
  if (data.x402.daily.length === 0) sanityIssues.push('x402.daily is empty')
  if (data.x402.protocols.length < 2) sanityIssues.push(`x402.protocols has ${data.x402.protocols.length} entries (<2)`)
  if (data.baseAgentic.totalTxs <= 0) sanityIssues.push('baseAgentic.totalTxs is 0')
  if (data.baseAgentic.daily.length === 0) sanityIssues.push('baseAgentic.daily is empty')
  if (data.virtualsAcp.totalMemos <= 0) sanityIssues.push('virtualsAcp.totalMemos is 0')
  if (data.virtualsAcp.daily.length === 0) sanityIssues.push('virtualsAcp.daily is empty')
  if (data.erc8004Registry.totalAgents <= 0) sanityIssues.push('erc8004Registry.totalAgents is 0')
  if (data.erc8004Registry.chains.length === 0) sanityIssues.push('erc8004Registry.chains is empty')
  if (data.olas.totalTxs <= 0) sanityIssues.push('olas.totalTxs is 0')
  if (data.olas.chains.length === 0) sanityIssues.push('olas.chains is empty')
  if (sanityIssues.length > 0) {
    throw new Error(`Output sanity failed (refusing to write data.json):\n  - ${sanityIssues.join('\n  - ')}`)
  }

  // Phase 8 — freshness SLA. Breaches don't block publishing (stale-but-visible
  // beats hidden), but they flag the workflow SLA gate so the run goes red.
  const slaBreaches = freshnessBreaches(metaOut)

  // Phase 9 — write only when something actually changed (keeps git history
  // and Vercel deploys meaningful).
  const serialized = JSON.stringify(data, null, 2)
  const previousSerialized = existing ? JSON.stringify(existing, null, 2) : null
  const changed = serialized !== previousSerialized
  if (changed) {
    writeFileSync(join(OUT_DIR, 'data.json'), serialized)
    console.log('\n✓ data.json written')
  } else {
    console.log('\n— no data changes; skipping write')
  }

  console.log(`  x402:         ${data.x402.totalTxs.toLocaleString()} txs, $${data.x402.totalVolume.toLocaleString()} vol (as of ${data.x402.asOf})`)
  console.log(`  ERC-8004:     ${data.baseAgentic.totalTxs.toLocaleString()} events, ${data.baseAgentic.daily.length} days`)
  console.log(`  Virtuals ACP: ${data.virtualsAcp.totalMemos.toLocaleString()} memos, ${data.virtualsAcp.daily.length} days`)
  console.log(`  Tempo/MPP:    ${data.tempoMpp.totalEvents.toLocaleString()} events, ${data.tempoMpp.uniquePayers} payers`)
  console.log(`  ERC-8004 Reg: ${data.erc8004Registry.totalAgents.toLocaleString()} agents across ${data.erc8004Registry.chainsTracked} chains`)
  console.log(`  Olas:         ${data.olas.totalTxs.toLocaleString()} txs, ${data.olas.chains.length} chains`)
  if (data.x402.tokenSplit) {
    console.log(`  x402 split:   ${data.x402.tokenSplit.usdcSharePct}% USDC by vol (trailing ${data.x402.tokenSplit.windowDays}d, ${data.x402.tokenSplit.totalPayments.toLocaleString()} payments)`)
  }
  console.log(`  executions:   ${executionsUsed}; execution credits: ${budget.runCredits.toFixed(2)}; downloads skipped/reused: ${Object.values(fragmentSources).filter(v => v === 'unchanged' || v === 'previous-build' || v === 'bootstrap').length}/${QUERIES.length}`)
  warnings.forEach(w => console.log(`::warning::${w}`))

  if (process.env.GITHUB_OUTPUT) {
    appendFileSync(process.env.GITHUB_OUTPUT, `changed=${changed}\nsla_breach=${slaBreaches.length > 0}\nbudget_hold=${Boolean(budget.holdReason)}\nbaselines_changed=${foldedCount > 0}\n`)
  }
  if (slaBreaches.length > 0) {
    console.error(`::error::Freshness SLA breached (data published, but needs attention):\n- ${slaBreaches.join('\n- ')}`)
  }
}

main().catch(e => { console.error(e); process.exit(1) })
