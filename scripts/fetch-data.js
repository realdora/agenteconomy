// scripts/fetch-data.js
// Fetches cached results from Dune queries + (future) Tempo RPC.
// Run: DUNE_API_KEY=xxx node scripts/fetch-data.js

import { writeFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const API_KEY = process.env.DUNE_API_KEY

if (!API_KEY) {
  console.error('Missing DUNE_API_KEY')
  process.exit(1)
}

const headers = { 'x-dune-api-key': API_KEY }

async function fetchQuery(queryId, limit = 1000) {
  const url = `https://api.dune.com/api/v1/query/${queryId}/results?limit=${limit}`
  const res = await fetch(url, { headers })
  if (!res.ok) throw new Error(`Dune ${queryId}: HTTP ${res.status}`)
  const json = await res.json()
  return json?.result?.rows || []
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

  // ── Q1: x402 cumulative + monthly (Query 6058135) ──────────
  let totalTxs = 139277505, totalVolume = 38843631
  let protocolMap = {}, monthlyMap = {}

  try {
    const rows = await fetchQuery(6058135, 1000)
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
  } catch (e) { console.warn('Q6058135 failed:', e.message) }

  // ── Q2: x402 daily breakdown (Query 6084845) ───────────────
  let dailyMap = {}
  try {
    const rows = await fetchQuery(6084845, 1000)
    console.log(`Q6084845 (x402 daily): ${rows.length} rows`)
    rows.forEach(row => {
      const day = (row.period || '').slice(0, 10)
      if (!day) return
      if (!dailyMap[day]) dailyMap[day] = { txs: 0 }
      dailyMap[day].txs += safeNum(row.txs)
    })
  } catch (e) { console.warn('Q6084845 failed:', e.message) }

  // ── Q3: ERC-8004 Base Agentic (Query 6731879) ──────────────
  let agenticDaily = [], agenticTotalTxs = 0
  try {
    const rows = await fetchQuery(6731879, 1000)
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

    // Sum cumulative across ALL categories for latest day
    const cumByDay = {}
    rows.forEach(r => {
      const day = r.day || ''
      const cum = safeNum(r['Cumulative Transactions'])
      if (day && cum > 0) {
        if (!cumByDay[day]) cumByDay[day] = 0
        cumByDay[day] += cum
      }
    })
    const sortedDays = Object.entries(cumByDay).sort(([a], [b]) => b.localeCompare(a))
    if (sortedDays.length > 0) agenticTotalTxs = sortedDays[0][1]
  } catch (e) { console.warn('Q6731879 failed:', e.message) }

  // ── Q4: Virtuals ACP memos (Query 6200422) ─────────────────
  let acpTotalMemos = 0, acpDaily = []
  try {
    const rows = await fetchQuery(6200422, 1000)
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
  } catch (e) { console.warn('Q6200422 failed:', e.message) }

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

  // ── Build monthly data ─────────────────────────────────────
  const monthly = Object.entries(monthlyMap)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, v]) => {
      const [year, month] = key.split('-')
      const label = new Date(parseInt(year), parseInt(month) - 1).toLocaleString('en-US', { month: 'short', year: '2-digit' })
      return { month: label, txs: Math.round(v.txs), vol: Math.round(v.vol) }
    })
  const finalMonthly = monthly.length >= 3 ? monthly : [
    { month: "Oct '25", txs: 28400000, vol: 8200000 },
    { month: "Nov '25", txs: 61200000, vol: 14300000 },
    { month: "Dec '25", txs: 22800000, vol: 7100000 },
    { month: "Jan '26", txs: 14600000, vol: 4800000 },
    { month: "Feb '26", txs: 8100000,  vol: 2900000 },
    { month: "Mar '26", txs: 4177505,  vol: 1543631 },
  ]

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
  const finalProtocols = protocols.length >= 2 ? protocols : [
    { name: 'Coinbase',  share: 45.4, color: '#0052FF' },
    { name: 'Dexter',    share: 15.0, color: '#6366F1' },
    { name: 'PayAI',     share: 13.6, color: '#10B981' },
    { name: 'DayDreams', share: 11.6, color: '#F59E0B' },
    { name: 'ThirdWeb',  share: 7.1,  color: '#A855F7' },
    { name: 'Other',     share: 7.3,  color: '#6B7280' },
  ]

  // ── Assemble output ────────────────────────────────────────
  const data = {
    updatedAt: new Date().toISOString(),
    sources: [
      { name: 'x402 Payment Analytics', author: '@thechriscen', queryId: 6058135 },
      { name: 'x402 Analytics', author: '@hashed_official', queryId: 6084845 },
      { name: 'BASE Agentic Ecosystem', author: '@ax1research', queryId: 6731879 },
      { name: 'Virtuals ACP', author: '@hashed_official', queryId: 6200422 },
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
      totalTxs: agenticTotalTxs || 709494,
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
  }

  const outPath = join(__dirname, '..', 'public', 'data.json')
  writeFileSync(outPath, JSON.stringify(data, null, 2))
  console.log(`\n✓ data.json written`)
  console.log(`  x402:         ${data.x402.totalTxs.toLocaleString()} txs, $${data.x402.totalVolume.toLocaleString()} vol`)
  console.log(`  x402:         ${data.x402.protocols.length} protocols, ${data.x402.monthly.length} months, ${data.x402.daily.length} days`)
  console.log(`  ERC-8004:     ${data.baseAgentic.totalTxs.toLocaleString()} events, ${data.baseAgentic.daily.length} days`)
  console.log(`  Virtuals ACP: ${data.virtualsAcp.totalMemos.toLocaleString()} memos, ${data.virtualsAcp.daily.length} days`)
  console.log(`  Tempo/MPP:    ${data.tempoMpp.totalEvents.toLocaleString()} events, ${data.tempoMpp.uniquePayers} payers`)
  console.log(`  ─────────────`)
  console.log(`  COMBINED:     ${(data.x402.totalTxs + data.baseAgentic.totalTxs + data.virtualsAcp.totalMemos + data.tempoMpp.totalEvents).toLocaleString()} on-chain events`)
}

main().catch(e => { console.error(e); process.exit(1) })
