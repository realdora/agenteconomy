// scripts/fetch-data.js
// Fetches cached results from Dune queries + (future) Tempo RPC.
// Run: DUNE_API_KEY=xxx node scripts/fetch-data.js

import { readFileSync, writeFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const API_KEY = process.env.DUNE_API_KEY

if (!API_KEY) {
  console.error('Missing DUNE_API_KEY')
  process.exit(1)
}

const headers = { 'x-dune-api-key': API_KEY }

const DUNE_API_BASE = process.env.DUNE_API_BASE || 'https://api.dune.com/api/v1'
const CACHE_MAX_AGE_HOURS = Number(process.env.DUNE_CACHE_MAX_AGE_HOURS || 5)
const REFRESH_MODE = process.env.DUNE_REFRESH_MODE || 'stale' // stale | always | never
const EXECUTION_TIMEOUT_MS = Number(process.env.DUNE_EXECUTION_TIMEOUT_MS || 15 * 60 * 1000)
const POLL_INTERVAL_MS = Number(process.env.DUNE_POLL_INTERVAL_MS || 5000)
let remainingExecutions = Number(process.env.DUNE_MAX_EXECUTIONS_PER_RUN || 1)

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

async function duneRequest(path, options = {}) {
  const url = path.startsWith('http') ? path : `${DUNE_API_BASE}${path}`
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
  if (!res.ok) {
    const message = json?.error?.message || json?.message || text || `HTTP ${res.status}`
    throw new Error(message)
  }
  return json
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

function shouldExecute(latestResult) {
  if (REFRESH_MODE === 'always') return true
  if (REFRESH_MODE === 'never') return false
  return ageHours(getExecutionEndedAt(latestResult)) > CACHE_MAX_AGE_HOURS
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

function isRateLimitError(error) {
  return /too many requests|rate limit|http 429/i.test(error?.message || '')
}

function isQuotaError(error) {
  return /datapoint limit|billing cycle|subscription settings|configured datapoint|monthly limit|quota/i.test(error?.message || '')
}

function readExistingData() {
  try {
    const dataPath = join(__dirname, '..', 'public', 'data.json')
    return JSON.parse(readFileSync(dataPath, 'utf8'))
  } catch {
    return null
  }
}

async function getExecutionResult(executionId, limit) {
  return duneRequest(`/execution/${executionId}/results?limit=${limit}&allow_partial_results=true`)
}

async function executeAndWait(queryId, limit) {
  const started = await duneRequest(`/query/${queryId}/execute`, {
    method: 'POST',
    body: JSON.stringify({ performance: process.env.DUNE_PERFORMANCE || 'medium' }),
  })
  const executionId = started.execution_id
  if (!executionId) throw new Error(`Dune ${queryId}: execute response missing execution_id`)

  const startedAt = Date.now()
  while (Date.now() - startedAt < EXECUTION_TIMEOUT_MS) {
    const status = await duneRequest(`/execution/${executionId}/status`)
    if (status.state === 'QUERY_STATE_COMPLETED' || status.state === 'QUERY_STATE_COMPLETED_PARTIAL') {
      return getExecutionResult(executionId, limit)
    }
    if (status.state === 'QUERY_STATE_FAILED' || status.state === 'QUERY_STATE_CANCELED' || status.state === 'QUERY_STATE_EXPIRED') {
      const detail = status?.error?.message || status.state
      throw new Error(`Dune ${queryId}: execution ${executionId} ${detail}`)
    }
    await sleep(POLL_INTERVAL_MS)
  }
  throw new Error(`Dune ${queryId}: execution timed out after ${Math.round(EXECUTION_TIMEOUT_MS / 1000)}s`)
}

async function fetchQuery(queryId, limit = 1000) {
  const latest = await duneRequest(`/query/${queryId}/results?limit=${limit}&allow_partial_results=true`)
  const endedAt = getExecutionEndedAt(latest)
  const latestAge = ageHours(endedAt)

  if (!shouldExecute(latest)) {
    console.log(`Dune ${queryId}: using latest result from ${endedAt || 'unknown time'} (${Number.isFinite(latestAge) ? latestAge.toFixed(1) : 'unknown'}h old)`)
    return resultRows(latest, `Dune ${queryId} latest result`)
  }

  if (remainingExecutions <= 0) {
    console.warn(`Dune ${queryId}: latest result is ${Number.isFinite(latestAge) ? latestAge.toFixed(1) : 'unknown'}h old, but DUNE_MAX_EXECUTIONS_PER_RUN budget is exhausted; using cached latest result`)
    return resultRows(latest, `Dune ${queryId} latest result`)
  }
  remainingExecutions -= 1

  console.log(`Dune ${queryId}: latest result is ${Number.isFinite(latestAge) ? latestAge.toFixed(1) : 'unknown'}h old; executing fresh query`)
  try {
    const fresh = await executeAndWait(queryId, limit)
    return resultRows(fresh, `Dune ${queryId} fresh execution`)
  } catch (error) {
    if (!isRateLimitError(error) && !isQuotaError(error)) throw error
    console.warn(`Dune ${queryId}: fresh execution was rate/quota limited; using cached latest result instead`)
    return resultRows(latest, `Dune ${queryId} latest result`)
  }
}

const PROTOCOL_COLORS = {
  'Coinbase': '#0052FF', 'Dexter': '#6366F1', 'PayAI': '#10B981',
  'DayDreams': '#F59E0B', 'Daydreams': '#F59E0B', 'thirdweb': '#A855F7',
  'ThirdWeb': '#A855F7', 'OpenX402': '#14B8A6', 'Open X402': '#14B8A6',
  'Pieverse': '#EC4899', 'pieverse': '#EC4899', 'Mogami': '#F97316',
  'Corbits': '#84CC16', 'X402rs': '#64748B', 'AurraCloud': '#06B6D4',
  'Questflow': '#8B5CF6', 'Polygon': '#8247E5', 'Virtuals Protocol': '#22C55E',
}
const FALLBACK_COLORS = ['#6366F1','#10B981','#F59E0B','#A855F7','#14B8A6','#EC4899','#F97316','#64748B']
const getColor = (name, idx) => PROTOCOL_COLORS[name] || FALLBACK_COLORS[idx % FALLBACK_COLORS.length]
const safeNum = v => { const n = parseFloat(v); return isNaN(n) ? 0 : n }

async function main() {
  console.log('Fetching Dune queries...\n')
  console.log(`Dune refresh mode: ${REFRESH_MODE}; max cache age: ${CACHE_MAX_AGE_HOURS}h\n`)
  console.log(`Dune fresh execution budget: ${remainingExecutions} per run\n`)
  const existingData = readExistingData()
  const requiredFailures = []
  const reusedExistingSections = []
  const recordRequiredFailure = (label, error) => {
    const message = error.message
    requiredFailures.push({ label, message, isQuota: isQuotaError(error) })
    console.warn(`${label} failed:`, error.message)
  }
  const reuseExistingSection = (label, sectionName, error) => {
    if (!isQuotaError(error) || !existingData?.[sectionName]) return false
    reusedExistingSections.push({ label, sectionName, message: error.message })
    console.warn(`${label} failed due to Dune quota; reusing existing ${sectionName} data`)
    return true
  }
  const captureQuery = promise => promise.then(rows => ({ rows }), error => ({ error }))
  const readQuery = async query => {
    const result = await query
    if (result.error) throw result.error
    return result.rows
  }

  // Start all Dune calls up front so fresh executions run in parallel instead of serially.
  const queries = {
    q6058135: captureQuery(fetchQuery(6058135, 1000)),
    q6084845: captureQuery(fetchQuery(6084845, 1000)),
    q6731879: captureQuery(fetchQuery(6731879, 5000)),
    q6200422: captureQuery(fetchQuery(6200422, 1000)),
    q6130922: captureQuery(fetchQuery(6130922, 5000)),
    q3344834: captureQuery(fetchQuery(3344834, 5000)),
  }

  // ── Q1: x402 cumulative + monthly (Query 6058135) ──────────
  let totalTxs = 0, totalVolume = 0
  let protocolMap = {}, monthlyMap = {}

  try {
    const rows = await readQuery(queries.q6058135)
    assertRowShape(rows, ['cumulative_txn','cumulative_volume','total_txn','total_vol','facilitator','date_time'], 'Q6058135')
    console.log(`Q6058135 (x402 cumulative): ${rows.length} rows`)
    if (rows.length > 0) {
      totalTxs = safeNum(rows[0].cumulative_txn) || totalTxs
      totalVolume = safeNum(rows[0].cumulative_volume) || totalVolume
      rows.forEach(row => {
        const name = row.facilitator || 'Other'
        if (!protocolMap[name]) protocolMap[name] = { txs: 0, vol: 0 }
        protocolMap[name].txs += safeNum(row.total_txn)
        protocolMap[name].vol += safeNum(row.total_vol)
        const month = (row.date_time || '').slice(0, 7)
        if (month) {
          if (!monthlyMap[month]) monthlyMap[month] = { txs: 0, vol: 0 }
          monthlyMap[month].txs += safeNum(row.total_txn)
          monthlyMap[month].vol += safeNum(row.total_vol)
        }
      })
    }
  } catch (e) { recordRequiredFailure('Q6058135', e) }

  // ── Q2: x402 daily breakdown (Query 6084845) ───────────────
  let dailyMap = {}
  try {
    const rows = await readQuery(queries.q6084845)
    assertRowShape(rows, ['period','txs'], 'Q6084845')
    console.log(`Q6084845 (x402 daily): ${rows.length} rows`)
    rows.forEach(row => {
      const day = (row.period || '').slice(0, 10)
      if (!day) return
      if (!dailyMap[day]) dailyMap[day] = { txs: 0 }
      dailyMap[day].txs += safeNum(row.txs)
    })
  } catch (e) { recordRequiredFailure('Q6084845', e) }

  // ── Q3: ERC-8004 Base Agentic (Query 6731879) ──────────────
  let agenticDaily = [], agenticTotalTxs = 0
  try {
    const rows = await readQuery(queries.q6731879)
    // Schema changed 2026-05-20: upstream dropped 'Cumulative Transactions' column.
    // Derive cumulative by summing Daily Transactions across the full returned window.
    assertRowShape(rows, ['day','category','Daily Transactions'], 'Q6731879')
    console.log(`Q6731879 (ERC-8004): ${rows.length} rows`)
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
    agenticDaily = Object.entries(agMap)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([day, v]) => ({ day, consumer: v.consumer, infrastructure: v.infrastructure, total: v.consumer + v.infrastructure }))

    agenticTotalTxs = agenticDaily.reduce((sum, d) => sum + d.total, 0)
  } catch (e) { recordRequiredFailure('Q6731879', e) }

  // ── Q4: Virtuals ACP memos (Query 6200422) ─────────────────
  let acpTotalMemos = 0, acpDaily = []
  try {
    const rows = await readQuery(queries.q6200422)
    assertRowShape(rows, ['period','num_of_memo','unique_sender','total_memo'], 'Q6200422')
    console.log(`Q6200422 (Virtuals ACP): ${rows.length} rows`)

    // Rows are per-day per-version (v1, v2). Merge by day.
    const acpMap = {}
    let maxTotalMemo = 0

    rows.forEach(row => {
      const day = (row.period || '').slice(0, 10)
      if (!day) return
      if (!acpMap[day]) acpMap[day] = { memos: 0, senders: 0 }
      acpMap[day].memos += safeNum(row.num_of_memo)
      acpMap[day].senders = Math.max(acpMap[day].senders, safeNum(row.unique_sender))

      // total_memo is cumulative — take the highest value across all rows
      const tm = safeNum(row.total_memo)
      if (tm > maxTotalMemo) maxTotalMemo = tm
    })

    acpTotalMemos = maxTotalMemo
    acpDaily = Object.entries(acpMap)
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-90)
      .map(([day, v]) => ({ day, memos: v.memos, senders: v.senders }))
  } catch (e) { recordRequiredFailure('Q6200422', e) }

  // ── Q5: Tempo/MPP (from public/tempo-data.json if present) ──
  let tempoTotalEvents = 0, tempoDaily = [], tempoByType = {}, tempoPayers = 0, tempoPayees = 0
  try {
    const tempoPath = join(__dirname, '..', 'public', 'tempo-data.json')
    const raw = readFileSync(tempoPath, 'utf8')
    const td = JSON.parse(raw)
    tempoTotalEvents = td.totalEvents || 0
    tempoPayers = td.uniquePayers || 0
    tempoPayees = td.uniquePayees || 0
    tempoByType = td.byType || {}
    tempoDaily = (td.daily || []).slice(-90)
    console.log(`Tempo data:  ${tempoTotalEvents.toLocaleString()} events, ${tempoPayers} payers, ${tempoPayees} payees`)
  } catch (e) { console.log('Tempo data:  not found (public/tempo-data.json), skipping') }

  // ── Q6: ERC-8004 Multi-chain Registry (Query 6130922) ──
  const chainName = n => ({ bnb: 'BNB', opbnb: 'opBNB', megaeth: 'MegaETH', avalanche_c: 'Avalanche' }[n] || n.charAt(0).toUpperCase() + n.slice(1))
  const TESTNETS = new Set(['sepolia', 'goerli', 'mumbai', 'amoy', 'holesky'])
  let erc8004Chains = {}, erc8004Daily = {}, erc8004TotalAgents = 0
  let erc8004RegistryFallback = null
  try {
    const rows = await readQuery(queries.q6130922)
    assertRowShape(rows, ['blockchain','block_date','registered'], 'Q6130922')
    console.log(`Q6130922 (ERC-8004 registry): ${rows.length} rows`)
    rows.forEach(row => {
      const chain = row.blockchain || ''
      if (TESTNETS.has(chain)) return
      const day = (row.block_date || '').slice(0, 10)
      const reg = safeNum(row.registered)
      const name = chainName(chain)
      if (!erc8004Chains[name]) erc8004Chains[name] = 0
      erc8004Chains[name] += reg
      if (day) {
        if (!erc8004Daily[day]) erc8004Daily[day] = 0
        erc8004Daily[day] += reg
      }
    })
    erc8004TotalAgents = Object.values(erc8004Chains).reduce((s, v) => s + v, 0)
  } catch (e) {
    if (reuseExistingSection('Q6130922', 'erc8004Registry', e)) {
      erc8004RegistryFallback = existingData.erc8004Registry
    } else {
      recordRequiredFailure('Q6130922', e)
    }
  }

  // ── Q7: Olas / Autonolas (Query 3344834) ───────────────
  let olasTotalTxs = 0, olasChains = {}, olasWeekly = []
  try {
    const rows = await readQuery(queries.q3344834)
    assertRowShape(rows, ['time','chain','total_weekly_transactions_number','global_cumulative_transactions_number'], 'Q3344834')
    console.log(`Q3344834 (Olas): ${rows.length} rows`)
    const latest = rows.reduce((best, r) => (r.time || '') > (best.time || '') ? r : best, {})
    olasTotalTxs = safeNum(latest.global_cumulative_transactions_number)
    const weekMap = {}
    rows.forEach(row => {
      const week = (row.time || '').slice(0, 10)
      const chain = row.chain || ''
      const txs = safeNum(row.total_weekly_transactions_number)
      const name = chainName(chain)
      if (!olasChains[name]) olasChains[name] = 0
      olasChains[name] += txs
      if (week) {
        if (!weekMap[week]) weekMap[week] = { txs: 0 }
        weekMap[week].txs += txs
      }
    })
    olasWeekly = Object.entries(weekMap)
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-52)
      .map(([week, v]) => ({ week, txs: v.txs }))
  } catch (e) { recordRequiredFailure('Q3344834', e) }

  if (requiredFailures.length > 0) {
    const formattedFailures = requiredFailures.map(f => `${f.label}: ${f.message}`).join('\n- ')
    if (requiredFailures.every(f => f.isQuota)) {
      console.warn(`::warning::Dune billing/datapoint quota blocked required queries. Keeping existing public/data.json unchanged instead of writing partial data.\n- ${formattedFailures}`)
      return
    }
    throw new Error(`Required Dune queries failed; refusing to write a fresh data.json with fallback or partial data.\n- ${formattedFailures}`)
  }

  // ── Build monthly data ─────────────────────────────────────
  const monthly = Object.entries(monthlyMap)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, v]) => {
      const [year, month] = key.split('-')
      const label = new Date(parseInt(year), parseInt(month) - 1).toLocaleString('en-US', { month: 'short', year: '2-digit' })
      return { month: label, txs: Math.round(v.txs), vol: Math.round(v.vol) }
    })
  const finalMonthly = monthly

  // ── Build x402 daily (last 60 days) ────────────────────────
  const daily = Object.entries(dailyMap)
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-60)
    .map(([day, v]) => ({ day, txs: Math.round(v.txs) }))

  // ── Build protocol shares ──────────────────────────────────
  const protocolEntries = Object.entries(protocolMap).sort(([, a], [, b]) => b.txs - a.txs)
  const totalProtoTxs = protocolEntries.reduce((s, [, v]) => s + v.txs, 0) || totalTxs
  const top6 = protocolEntries.slice(0, 6)
  const otherTxs = protocolEntries.slice(6).reduce((s, [, v]) => s + v.txs, 0)
  const protocols = [
    ...top6.map(([name, v], i) => ({
      name,
      share: parseFloat(((v.txs / totalProtoTxs) * 100).toFixed(1)),
      color: getColor(name, i),
    })),
    ...(otherTxs > 0 ? [{ name: 'Other', share: parseFloat(((otherTxs / totalProtoTxs) * 100).toFixed(1)), color: '#6B7280' }] : [])
  ]
  const finalProtocols = protocols

  // ── Assemble output ────────────────────────────────────────
  const data = {
    updatedAt: new Date().toISOString(),
    sources: [
      { name: 'x402 Payment Analytics', author: '@thechriscen', queryId: 6058135 },
      { name: 'x402 Analytics', author: '@hashed_official', queryId: 6084845 },
      { name: 'BASE Agentic Ecosystem', author: '@ax1research', queryId: 6731879 },
      { name: 'Virtuals ACP', author: '@hashed_official', queryId: 6200422 },
      { name: 'ERC-8004 Trustless Agents', author: '@hashed_official', queryId: 6130922 },
      { name: 'Olas Ecosystem Activity', author: '@adrian0x', queryId: 3344834 },
    ],
    x402: {
      totalTxs: Math.round(totalTxs),
      totalVolume: Math.round(totalVolume),
      facilitatorsTracked: Object.keys(protocolMap).length || 15,
      chainsTracked: 7,
      monthly: finalMonthly,
      daily,
      protocols: finalProtocols,
      chains: [
        { name: 'Base',      txs: 72058130, color: '#0052FF' },
        { name: 'Solana',    txs: 47231681, color: '#9945FF' },
        { name: 'Polygon',   txs: 7184927,  color: '#8247E5' },
        { name: 'BNB',       txs: 658610,   color: '#F0B90B' },
        { name: 'Avalanche', txs: 4612,     color: '#E84142' },
        { name: 'Arbitrum',  txs: 522,      color: '#12AAFF' },
        { name: 'SEI',       txs: 142,      color: '#9D4EDD' },
      ],
    },
    baseAgentic: {
      totalTxs: agenticTotalTxs,
      daily: agenticDaily,
    },
    virtualsAcp: {
      totalMemos: acpTotalMemos,
      daily: acpDaily,
    },
    // Tempo/MPP
    tempoMpp: {
      totalEvents: tempoTotalEvents,
      uniquePayers: tempoPayers,
      uniquePayees: tempoPayees,
      byType: tempoByType,
      daily: tempoDaily,
    },
    // ERC-8004 Registry (multi-chain)
    erc8004Registry: erc8004RegistryFallback || {
      totalAgents: erc8004TotalAgents,
      chainsTracked: Object.keys(erc8004Chains).length,
      chains: Object.entries(erc8004Chains)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 12)
        .map(([name, agents]) => ({ name, agents })),
      daily: Object.entries(erc8004Daily)
        .sort(([a], [b]) => a.localeCompare(b))
        .slice(-90)
        .map(([day, agents]) => ({ day, agents })),
    },
    // Olas / Autonolas
    olas: {
      totalTxs: olasTotalTxs,
      chains: Object.entries(olasChains)
        .sort(([,a], [,b]) => b - a)
        .map(([name, txs]) => ({ name, txs })),
      weekly: olasWeekly,
    },
  }

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

  const outPath = join(__dirname, '..', 'public', 'data.json')
  writeFileSync(outPath, JSON.stringify(data, null, 2))
  console.log(`\n✓ data.json written`)
  reusedExistingSections.forEach(section => {
    console.log(`  reused:       ${section.sectionName} from existing data (${section.label} quota-limited)`)
  })
  console.log(`  x402:         ${data.x402.totalTxs.toLocaleString()} txs, $${data.x402.totalVolume.toLocaleString()} vol`)
  console.log(`  x402:         ${data.x402.protocols.length} protocols, ${data.x402.monthly.length} months, ${data.x402.daily.length} days`)
  console.log(`  ERC-8004:     ${data.baseAgentic.totalTxs.toLocaleString()} events, ${data.baseAgentic.daily.length} days`)
  console.log(`  Virtuals ACP: ${data.virtualsAcp.totalMemos.toLocaleString()} memos, ${data.virtualsAcp.daily.length} days`)
  console.log(`  Tempo/MPP:    ${data.tempoMpp.totalEvents.toLocaleString()} events, ${data.tempoMpp.uniquePayers} payers`)
  console.log(`  ERC-8004 Reg: ${data.erc8004Registry.totalAgents.toLocaleString()} agents across ${data.erc8004Registry.chainsTracked} chains`)
  console.log(`  Olas:         ${data.olas.totalTxs.toLocaleString()} txs, ${data.olas.chains.length} chains`)
  console.log(`  ─────────────`)
  console.log(`  COMBINED:     ${(data.x402.totalTxs + data.baseAgentic.totalTxs + data.virtualsAcp.totalMemos + data.tempoMpp.totalEvents + data.olas.totalTxs).toLocaleString()} on-chain events`)
  console.log(`  AGENTS:       ${data.erc8004Registry.totalAgents.toLocaleString()} registered (ERC-8004)`)
}

main().catch(e => { console.error(e); process.exit(1) })
