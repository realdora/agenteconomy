// scripts/fetch-web-sources.js
// Non-Dune data sources for agenteconomy — free, no-auth, web-readable.
// Adds dimensions on-chain payment flow can't give:
//   1. agent-token market caps (capital dimension)  — CoinGecko categories + curated basket
//   2. x402 service catalog (supply side)            — Coinbase x402 Bazaar discovery
//   3. agent supply registries                       — official MCP Registry (+ Smithery corroboration)
//   4. Virtuals ecosystem                            — launched agents, ACP agents, summed gross/jobs
//   5. developer adoption index                      — npm + PyPI downloads, fixed SDK basket
//   6. Masumi (Cardano) agent escrow txs             — Koios count on the payment contract
// Deliberately independent of the Dune pipeline (writes its own web-sources.json)
// so it keeps working while the Dune side is blocked.
//
// Heavy enumerations (MCP cursor walk ~117 pages, ACP agent walk ~422 pages,
// download stats) refresh at most once per ~20h: each section keeps its own
// asOf and is reused from the previous JSON when still fresh, so the 6-hourly
// cron stays light on third-party APIs.
//
// Run: node scripts/fetch-web-sources.js   (no API key needed)

import { writeFileSync, readFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const OUT_DIR = process.env.DATA_OUT_DIR || join(__dirname, '..', 'public')
const OUT = join(OUT_DIR, 'web-sources.json')

// Curated "agentic payments" basket — tokens of protocols on-thesis to THIS
// dashboard (agent commerce/payments + infra we track). Deliberately excludes
// pure decentralized-compute (TAO) and collapsed/ambiguous tokens, so it reads
// as "the agentic-payment economy" rather than "all AI tokens". The broad
// CoinGecko "AI Agents" category total is reported separately for context.
const BASKET = [
  { id: 'fetch-ai',         label: 'Fetch (ASI)', note: 'agent infrastructure' },
  { id: 'kite-2',           label: 'Kite',        note: 'x402 facilitator' },
  { id: 'virtual-protocol', label: 'Virtuals',    note: 'ACP / agent commerce' },
  { id: 'autonolas',        label: 'Olas',        note: 'autonomous agents' },
]
const CATEGORIES = ['ai-agents', 'ai-agent-launchpad'] // category totals (with caveat)

const CG = process.env.COINGECKO_BASE || 'https://api.coingecko.com/api/v3'
const BAZAAR = 'https://api.cdp.coinbase.com/platform/v2/x402/discovery/resources'
const MCP_REGISTRY = 'https://registry.modelcontextprotocol.io/v0/servers'
const SMITHERY = 'https://registry.smithery.ai/servers?pageSize=1'
const VIRTUALS_APP = 'https://api.virtuals.io/api/virtuals'
const VIRTUALS_ACP = 'https://acpx.virtuals.io/api/agents'
// Since 2026-07-06 api.virtuals.io/api/virtuals REQUIRES a filters[chain] param
// — an unscoped call 400s server-side ("Cannot set properties of undefined
// (setting 'chain')"). So the launched total is summed per-chain. (acpx.virtuals
// .io/api/agents is unaffected and actually rejects filters[chain].) Chains with
// agents on 2026-07-10: BASE 53,374 · SOLANA 511 · ETH 2.
const VIRTUALS_CHAINS = ['BASE', 'SOLANA', 'ETH']
const KOIOS = 'https://api.koios.rest/api/v1/address_txs'
// Masumi Network mainnet payment (escrow) contract — cross-verified against
// their public explorer (31,022 txs matched exactly on 2026-06-10).
const MASUMI_CONTRACT = 'addr1wx7j4kmg2cs7yf92uat3ed4a3u97kr7axxr4avaz0lhwdsq87ujx7'

// Developer-adoption basket: agent-PAYMENT SDKs only. MCP/A2A SDKs are general
// agent infra with 100x the volume — they'd swamp the payment signal, so they
// are deliberately excluded. Never sum @x402/core together with its leaf
// packages (@x402/fetch etc.) — leaves depend on core (double count).
const NPM_BASKET = ['x402', '@x402/core', '@coinbase/x402', 'agent0-sdk', '@virtuals-protocol/acp-node', '@virtuals-protocol/acp-node-v2']
const PYPI_BASKET = ['x402', 'cdp-sdk', 'virtuals-acp']

// Sections with heavy/rate-limited upstreams refresh at most once per ~20h.
const HEAVY_TTL_HOURS = 20
const isFresh = section => section?.asOf && (Date.now() - Date.parse(section.asOf)) < HEAVY_TTL_HOURS * 36e5

const num = v => { const n = Number(v); return Number.isFinite(n) ? n : 0 }
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

// Optional free CoinGecko Demo key improves reliability from shared CI IPs.
const CG_KEY = process.env.COINGECKO_API_KEY
async function getJson(url, { timeout = 25000, headers = {} } = {}) {
  const ctrl = new AbortController()
  const t = setTimeout(() => ctrl.abort(), timeout)
  try {
    const h = { ...headers }
    if (CG_KEY && url.includes('coingecko.com')) h['x-cg-demo-api-key'] = CG_KEY
    const res = await fetch(url, { headers: h, signal: ctrl.signal })
    if (!res.ok) throw new Error(`HTTP ${res.status} on ${url}`)
    return await res.json()
  } finally { clearTimeout(t) }
}

async function fetchAgentTokens() {
  // 1a. curated basket — fetch by ids
  const ids = BASKET.map(b => b.id).join(',')
  const markets = await getJson(`${CG}/coins/markets?vs_currency=usd&ids=${ids}&order=market_cap_desc&per_page=50&sparkline=false`)
  const byId = Object.fromEntries(markets.map(m => [m.id, m]))
  const basket = BASKET.map(b => {
    const m = byId[b.id]
    return {
      label: b.label, symbol: (m?.symbol || '').toUpperCase(), note: b.note,
      mcap: Math.round(num(m?.market_cap)),
      price: num(m?.current_price),
      change24h: num(m?.price_change_percentage_24h),
    }
  }).filter(t => t.mcap > 0).sort((a, b) => b.mcap - a.mcap)
  const basketMcap = basket.reduce((s, t) => s + t.mcap, 0)
  const basketVol = markets.reduce((s, m) => s + num(m?.total_volume), 0)

  // 1b. category totals (reference, mixes in memecoins — labelled as such).
  // Match by category id (slug), not display name — names get renamed.
  const cats = await getJson(`${CG}/coins/categories`)
  const categories = CATEGORIES.map(slug => {
    const c = cats.find(x => x.id === slug)
    return c ? { name: c.name, mcap: Math.round(num(c.market_cap)), vol24h: Math.round(num(c.volume_24h)), updatedAt: c.updated_at } : null
  }).filter(Boolean)

  if (basket.length < 3) throw new Error(`agent-token basket only resolved ${basket.length} coins (<3)`)
  return {
    asOf: new Date().toISOString(),
    basket, basketMcap, basketVol24h: Math.round(basketVol),
    categories,
    note: 'Basket is hand-curated (agenteconomy-tracked + core agent tokens). Category totals are CoinGecko-defined and include some memecoins.',
  }
}

async function fetchX402Services() {
  // Full catalog enumeration (~270 light pages, ~2 min). The raw listing count
  // is dominated by a couple of bulk-listing hosts (verified 2026-06-10: top-2
  // domains ≈ 80% of all listings, and the catalog shrank 9% in a day), so the
  // defensible headline is UNIQUE PROVIDER DOMAINS; listings are context only.
  // Any page failing after 3 attempts aborts the whole section (a partial scan
  // would under-report providers); the caller then reuses the previous values.
  const PAGE = 100
  const first = await getJson(`${BAZAAR}?limit=${PAGE}`, { timeout: 30000 })
  const total = num(first?.pagination?.total)
  if (total <= 0) throw new Error('Bazaar returned no total count')
  if (total > 200000) throw new Error(`Bazaar total ${total} implausibly large; refusing full enumeration`)

  const hosts = new Map()
  let listings = 0
  const tally = items => {
    for (const it of items || []) {
      listings += 1
      let host
      try { host = new URL(it.resource || it.resourceUrl || it.url || '').host } catch { host = '(unparsed)' }
      hosts.set(host, (hosts.get(host) || 0) + 1)
    }
  }
  tally(first.items)
  for (let offset = PAGE; offset < total; offset += PAGE) {
    let page = null, lastErr = null
    for (let attempt = 1; attempt <= 3 && !page; attempt++) {
      try { page = await getJson(`${BAZAAR}?limit=${PAGE}&offset=${offset}`, { timeout: 30000 }) }
      catch (e) { lastErr = e; await sleep(1500 * attempt) }
    }
    if (!page) throw new Error(`Bazaar enumeration failed at offset ${offset}: ${lastErr?.message}`)
    tally(page.items)
    await sleep(120)
  }

  const counts = [...hosts.values()].sort((a, b) => b - a)
  const top2ListingSharePct = listings > 0
    ? Math.round(((counts[0] || 0) + (counts[1] || 0)) / listings * 100)
    : 0
  return {
    asOf: new Date().toISOString(),
    uniqueProviders: hosts.size,
    totalListings: listings,
    top2ListingSharePct,
    note: 'Coinbase x402 Bazaar discovery, full enumeration. Headline = unique provider domains; raw listing count is concentration-skewed (a few hosts bulk-list thousands of endpoints) and churns daily.',
  }
}

async function getJsonRetry(url, opts = {}, attempts = 3) {
  let lastErr
  for (let i = 1; i <= attempts; i++) {
    try { return await getJson(url, opts) } catch (e) { lastErr = e; await sleep(1500 * i) }
  }
  throw lastErr
}

// 3. Agent supply registries — official MCP Registry total (cursor walk; the
// API exposes no total field) + Smithery's totalCount as corroboration.
async function fetchAgentSupply(prev) {
  if (isFresh(prev)) { console.log('  agentSupply: fresh (<20h), reusing'); return prev }
  const smithery = await getJsonRetry(SMITHERY)
  const smitheryCount = num(smithery?.pagination?.totalCount)

  let officialCount = 0
  let cursor = null
  for (let page = 0; page < 400; page++) {
    const url = `${MCP_REGISTRY}?limit=100&version=latest${cursor ? `&cursor=${encodeURIComponent(cursor)}` : ''}`
    const data = await getJsonRetry(url)
    officialCount += (data?.servers || []).length
    cursor = data?.metadata?.nextCursor
    if (!cursor) break
    await sleep(100)
  }
  if (officialCount < 1000) throw new Error(`MCP registry walk returned implausibly few servers (${officialCount})`)
  if (smitheryCount <= 0) throw new Error('Smithery returned no totalCount')
  return {
    asOf: new Date().toISOString(),
    officialMcpServers: officialCount,
    smitheryMcpServers: smitheryCount,
    note: 'Official MCP Registry counted by full cursor walk (version=latest, includes all listing statuses). Smithery shown as corroboration — registries differ in inclusion criteria.',
  }
}

// 4. Virtuals ecosystem — cheap totals every run; heavy per-agent aggregation
// (gross agentic USD + jobs summed over every registered ACP agent) at most
// once per ~20h. Our sums come from the primary per-agent records, not from
// scraping their headline page.
async function fetchVirtualsEcosystem(prev) {
  // Sum the launched total across the chains Virtuals deploys on (the endpoint
  // now demands a filters[chain] scope — see VIRTUALS_CHAINS note above).
  let launchedAgents = 0
  for (const chain of VIRTUALS_CHAINS) {
    const page = await getJsonRetry(`${VIRTUALS_APP}?filters%5Bchain%5D=${chain}&pagination%5BpageSize%5D=1`)
    launchedAgents += num(page?.meta?.pagination?.total)
    await sleep(120)
  }
  const acpFirst = await getJsonRetry(`${VIRTUALS_ACP}?pagination%5BpageSize%5D=1`)
  const acpRegisteredAgents = num(acpFirst?.meta?.pagination?.total)
  if (launchedAgents <= 0 || acpRegisteredAgents <= 0) throw new Error('Virtuals totals missing')

  let aggregates
  if (prev?.aggregates && isFresh(prev.aggregates)) {
    aggregates = prev.aggregates
    console.log('  virtuals aggregates: fresh (<20h), reusing')
  } else {
    const fields = 'fields%5B0%5D=grossAgenticAmount&fields%5B1%5D=totalJobCount&fields%5B2%5D=successfulJobCount'
    let gross = 0, jobs = 0, successfulJobs = 0, scanned = 0
    const pages = Math.ceil(acpRegisteredAgents / 100)
    for (let page = 1; page <= pages; page++) {
      const data = await getJsonRetry(`${VIRTUALS_ACP}?pagination%5BpageSize%5D=100&pagination%5Bpage%5D=${page}&${fields}`)
      for (const r of data?.data || []) {
        scanned += 1
        gross += num(r.grossAgenticAmount)
        jobs += num(r.totalJobCount)
        successfulJobs += num(r.successfulJobCount)
      }
      await sleep(120)
    }
    if (scanned < acpRegisteredAgents * 0.95) throw new Error(`ACP walk incomplete: scanned ${scanned}/${acpRegisteredAgents}`)
    aggregates = {
      asOf: new Date().toISOString(),
      grossAgenticUsd: Math.round(gross),
      totalJobs: jobs,
      successfulJobs,
      agentsScanned: scanned,
      note: 'Summed across every registered ACP agent record (public per-agent API) — independently computed, not scraped from the Virtuals stats page.',
    }
  }
  return { asOf: new Date().toISOString(), launchedAgents, acpRegisteredAgents, aggregates }
}

// 5. Developer adoption index — fixed basket, 4-week averages (raw weekly
// download counts swing ±40% on CI traffic; a trailing average is the honest
// line). npm via range API; PyPI via pypistats /recent (hard rate limit —
// 30s+ between calls).
async function fetchDevAdoption(prev) {
  if (isFresh(prev)) { console.log('  devAdoption: fresh (<20h), reusing'); return prev }
  const day = d => d.toISOString().slice(0, 10)
  const end = new Date(Date.now() - 2 * 864e5) // npm data lags ~1 day; stay safe
  const start = new Date(end.getTime() - 27 * 864e5)
  const components = []
  for (const pkg of NPM_BASKET) {
    const data = await getJsonRetry(`https://api.npmjs.org/downloads/range/${day(start)}:${day(end)}/${encodeURIComponent(pkg)}`)
    const total = (data?.downloads || []).reduce((s, d) => s + num(d.downloads), 0)
    components.push({ registry: 'npm', pkg, weeklyAvg4w: Math.round(total / 4) })
    await sleep(300)
  }
  for (const pkg of PYPI_BASKET) {
    // pypistats rate limit is aggressive and budget-like — 429s need a long
    // backoff (observed: 31s gaps still tripped it). 75s between retries.
    let data = null, lastErr = null
    for (let attempt = 1; attempt <= 3 && !data; attempt++) {
      try { data = await getJson(`https://pypistats.org/api/packages/${pkg}/recent`) }
      catch (e) { lastErr = e; await sleep(75000) }
    }
    if (!data) throw new Error(`pypistats failed for ${pkg}: ${lastErr?.message}`)
    // last_month ≈ 30 days → weekly average
    components.push({ registry: 'pypi', pkg, weeklyAvg4w: Math.round(num(data?.data?.last_month) * 7 / 30) })
    await sleep(45000)
  }
  const totalWeekly = components.reduce((s, c) => s + c.weeklyAvg4w, 0)
  if (totalWeekly < 1000) throw new Error(`dev adoption index implausibly low (${totalWeekly}/wk)`)
  return {
    asOf: new Date().toISOString(),
    totalWeeklyAvg4w: totalWeekly,
    components: components.sort((a, b) => b.weeklyAvg4w - a.weeklyAvg4w),
    basketVersion: 1,
    note: 'Weekly downloads, 4-week trailing average, fixed basket of agent-payment SDKs (npm + PyPI). Download counts include CI/mirror traffic — an activity proxy, not a human-developer count. MCP/A2A SDKs excluded (general agent infra, 100x volume would swamp the payment signal).',
  }
}

// 6. Masumi Network (Cardano) — exact tx count + weekly history on the
// mainnet payment contract via Koios. The weekly series is reconstructed from
// the contract's on-chain transaction list (block_time per tx, aggregated into
// Monday-start UTC weeks): full backfill on the first run (~34 pages), then
// incremental from the last seen block. Koios `_after_block_height` is
// INCLUSIVE (>=, verified 2026-07-13), so incremental rows at the boundary
// block must be skipped or they double-count.
async function fetchMasumi(prev) {
  const ctrl = new AbortController()
  const t = setTimeout(() => ctrl.abort(), 300000)
  try {
    const head = await fetch(KOIOS, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Prefer: 'count=exact', Range: '0-0' },
      body: JSON.stringify({ _addresses: [MASUMI_CONTRACT] }),
      signal: ctrl.signal,
    })
    if (!head.ok && head.status !== 206) throw new Error(`Koios HTTP ${head.status}`)
    const range = head.headers.get('content-range') || ''
    const total = num(range.split('/')[1])
    if (total <= 0) throw new Error(`Koios content-range missing total (got "${range}")`)

    // Cursor pagination — Koios' free tier silently restarts offset paging
    // from row 0 past a certain offset (verified 2026-07-13), so `Range` is
    // pinned to 0-999 and `_after_block_height` advances instead. When a page
    // comes back full, its boundary block may be cut mid-block: those rows are
    // discarded and re-counted in full on the next page (the filter is
    // inclusive), which loses nothing and double-counts nothing.
    const weeks = new Map((prev?.weekly || []).map(r => [r.week, r.txs]))
    const skipThrough = weeks.size ? num(prev?.lastBlock) : 0 // fully counted in prior runs
    let cursor = skipThrough
    let lastBlock = skipThrough
    const PAGE = 1000
    const tally = r => {
      const d = new Date(r.block_time * 1000)
      const monday = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate() - ((d.getUTCDay() + 6) % 7)))
      const wk = monday.toISOString().slice(0, 10)
      weeks.set(wk, (weeks.get(wk) || 0) + 1)
      if (r.block_height > lastBlock) lastBlock = r.block_height
    }
    for (; ;) {
      const body = { _addresses: [MASUMI_CONTRACT] }
      if (cursor) body._after_block_height = cursor
      const res = await fetch(`${KOIOS}?order=block_height.asc`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Range: `0-${PAGE - 1}` },
        body: JSON.stringify(body),
        signal: ctrl.signal,
      })
      if (!res.ok && res.status !== 206) throw new Error(`Koios page HTTP ${res.status} at cursor ${cursor}`)
      const raw = await res.json()
      const rows = raw.filter(r => r.block_height > skipThrough)
      if (raw.length < PAGE) { // last page — decided on RAW length, not filtered
        rows.forEach(tally)
        break
      }
      const boundary = raw[raw.length - 1].block_height
      if (boundary === cursor) throw new Error(`Koios paging stuck at block ${boundary}`)
      rows.filter(r => r.block_height < boundary).forEach(tally)
      cursor = boundary
      await new Promise(r2 => setTimeout(r2, 150))
    }

    // zero-fill gap weeks so the series is continuous
    const sorted = [...weeks.keys()].sort()
    const weekly = []
    if (sorted.length) {
      for (let ts = Date.parse(sorted[0]); ts <= Date.parse(sorted[sorted.length - 1]); ts += 7 * 86400000) {
        const wk = new Date(ts).toISOString().slice(0, 10)
        weekly.push({ week: wk, txs: weeks.get(wk) || 0 })
      }
    }
    const seriesSum = weekly.reduce((s, r) => s + r.txs, 0)
    // hard gate: a series that disagrees with the exact count is corrupt —
    // fail the section so the previous good data is reused
    if (Math.abs(seriesSum - total) > 25) throw new Error(`Masumi weekly series sums to ${seriesSum}, count header says ${total}`)
    if (seriesSum !== total) console.warn(`Masumi: series/total skew ${seriesSum - total} (txs landing mid-fetch)`)

    return {
      asOf: new Date().toISOString(),
      totalTxs: total,
      lastBlock,
      weekly,
      note: 'Transactions on the Masumi mainnet payment (escrow) contract, counted via Koios. Weekly series reconstructed from the contract’s on-chain transaction history (block timestamps, Monday-start UTC weeks). Cross-verified against the Masumi explorer on 2026-06-10.',
    }
  } finally { clearTimeout(t) }
}

// ── 2026-07-06 additions — deep-research 3-round verified sources.
// Full provenance, endpoints and the never-cite list: scripts/research/DATA-RADAR-2026-07.md
const RADAR_CHECK = 'https://api.cloudflare.com/client/v4/radar/agent_readiness/summary/CHECK'
const CF_RADAR_TOKEN = process.env.CLOUDFLARE_RADAR_TOKEN
const OPENROUTER_KEY = process.env.OPENROUTER_API_KEY
const OPENROUTER_DATASETS = 'https://openrouter.ai/api/v1/datasets'
const SOLANA_RPC = process.env.SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com'
// Solana agent registries — program IDs verified on-chain 2026-07-06
// (getProgramAccounts counts that day: Metaplex 1,421 · SATI 1,488).
const SOLANA_AGENT_REGISTRIES = [
  { key: 'metaplex', label: 'Metaplex MPL Agent Identity', program: '1DREGFgysWYxLnRnKQnwrxnJQeSMk2HmGaC6whw2B2p' },
  { key: 'sati', label: 'SATI / 8004-solana (QuantuLabs)', program: '8oo4dC4JvBLwy5tGgiH3WwK4B9PWxL9Z4XjA2jzkQMbQ' },
]

// 7. Cloudflare Radar agent-standards adoption — upstream is a WEEKLY bulk
// scan (~110k of top-200k domains), so refresh at most every 6 days and pin a
// ~28-days-back snapshot via the `date` param for the MoM column. Values are
// stored as returned (raw counts or shares — normalize at page layer once the
// first real response is inspected). Cross-standard comparisons need the
// denominator footnote; UCP's high share is a suspected loose heuristic.
const RADAR_TTL_HOURS = 6 * 24
async function fetchStandardsAdoption(prev) {
  if (prev?.asOf && (Date.now() - Date.parse(prev.asOf)) < RADAR_TTL_HOURS * 36e5) {
    console.log('  standardsAdoption: fresh (<6d), reusing'); return prev
  }
  if (!CF_RADAR_TOKEN) throw new Error('CLOUDFLARE_RADAR_TOKEN not set (run ~/setup-agenteconomy-keys.sh)')
  const headers = { Authorization: `Bearer ${CF_RADAR_TOKEN}` }
  const parse = data => {
    const s = data?.result?.summary_0
    if (!s || typeof s !== 'object') throw new Error('Radar response missing result.summary_0')
    const rows = Object.entries(s).map(([check, v]) => ({ check, value: num(String(v).replace('%', '')) }))
    if (rows.length < 5) throw new Error(`Radar returned only ${rows.length} checks (<5)`)
    return { rows, meta: data?.result?.meta ?? null }
  }
  const now = parse(await getJson(RADAR_CHECK, { headers }))
  const back = new Date(Date.now() - 28 * 864e5).toISOString().slice(0, 10)
  let prevMonth = null
  try { prevMonth = { date: back, rows: parse(await getJson(`${RADAR_CHECK}?date=${back}`, { headers })).rows } }
  catch (e) { console.warn('  standardsAdoption: MoM baseline fetch failed:', e.message) }
  return {
    asOf: new Date().toISOString(),
    rows: now.rows, meta: now.meta, prevMonth,
    note: 'Cloudflare Radar agent-readiness WEEKLY scan; as-of must be labelled by data week, not day. Denominators differ per check (x402 only meaningful for paid-content sites) — never compare shares across standards without the footnote. UCP share suspected over-detection.',
  }
}

// 8. Demand-side inference telemetry — OpenRouter datasets API (free key).
// Daily token usage of the top-50 public models (+aggregated `other` row).
// Attribution required by OpenRouter's dataset terms; tokenizer counts are
// provider-specific and NOT comparable across models (page must footnote).
async function fetchInferenceDemand(prev) {
  if (isFresh(prev)) { console.log('  inferenceDemand: fresh (<20h), reusing'); return prev }
  if (!OPENROUTER_KEY) throw new Error('OPENROUTER_API_KEY not set (run ~/setup-agenteconomy-keys.sh)')
  const data = await getJson(`${OPENROUTER_DATASETS}/rankings-daily`, { headers: { Authorization: `Bearer ${OPENROUTER_KEY}` } })
  const rows = Array.isArray(data?.data) ? data.data : Array.isArray(data?.rows) ? data.rows : null
  if (!rows || rows.length === 0) throw new Error('OpenRouter rankings-daily returned no rows')
  const perDay = new Map()
  for (const r of rows) {
    const day = String(r.date ?? r.day ?? '').slice(0, 10)
    const tok = num(r.total_tokens ?? r.tokens ?? r.token_count)
    if (day) perDay.set(day, (perDay.get(day) || 0) + tok)
  }
  const days = [...perDay.entries()].sort((a, b) => (a[0] < b[0] ? -1 : 1)).map(([date, tokens]) => ({ date, tokens }))
  const totalTokens = days.reduce((s, d) => s + d.tokens, 0)
  if (totalTokens <= 0) throw new Error('OpenRouter token totals parsed to 0 — response shape changed?')
  return {
    asOf: new Date().toISOString(), windowDays: days.length, days, totalTokens,
    attribution: 'Source: OpenRouter (openrouter.ai/rankings)',
    note: 'Daily token usage of top-50 public models on OpenRouter + aggregated other row (trailing default window). Provider-specific tokenizers — totals not comparable across models. Demand-side CONTEXT metric, not on-chain data.',
  }
}

// 9. Solana agent-registry counts — free public RPC, no key. Account count is
// an UPPER BOUND of registrations (may include non-identity accounts). Feeds
// the census page by-registry breakdown, NOT a standalone page (2.9K vs
// ERC-8004's 331K as of 2026-07-06). Solana Foundation markets "9,000+
// agents" — unreconciled with these on-chain counts; never cite that figure.
async function fetchSolanaAgents(prev) {
  if (isFresh(prev)) { console.log('  solanaAgents: fresh (<20h), reusing'); return prev }
  const registries = []
  for (const reg of SOLANA_AGENT_REGISTRIES) {
    let count = null, lastErr = null
    for (let attempt = 1; attempt <= 3 && count === null; attempt++) {
      try {
        const res = await fetch(SOLANA_RPC, {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'getProgramAccounts', params: [reg.program, { encoding: 'base64', dataSlice: { offset: 0, length: 0 } }] }),
        })
        if (!res.ok) throw new Error(`RPC HTTP ${res.status}`)
        const data = await res.json()
        if (!Array.isArray(data.result)) throw new Error(data.error?.message || 'no result array')
        count = data.result.length
      } catch (e) { lastErr = e; await sleep(1500 * attempt) }
    }
    if (count === null) throw new Error(`solanaAgents: ${reg.key} count failed after 3 attempts: ${lastErr?.message}`)
    if (count > 5_000_000) throw new Error(`solanaAgents: ${reg.key} count ${count} implausibly large`)
    registries.push({ key: reg.key, label: reg.label, program: reg.program, accounts: count })
    await sleep(400)
  }
  return {
    asOf: new Date().toISOString(),
    registries,
    totalAccounts: registries.reduce((s, r) => s + r.accounts, 0),
    note: 'getProgramAccounts counts on Solana agent-registry programs (public RPC). Upper bound of registrations. By-registry breakdown for the census page; do not cite the Foundation "9,000+" marketing figure.',
  }
}

// 10. x402 token split — NO network call. The USDC-vs-total volume split lives
// in the Dune pipeline's data.json (x402.tokenSplit); lift it verbatim into a
// top-level web-sources key so the apex usdc-share page can read it from this
// feed too. Reads data.json from the same output dir the pipeline writes to
// (public/ in prod, DATA_OUT_DIR when overridden). If data.json has no split
// yet, pass the previous value through so the key never flaps.
function readX402TokenSplit(prev) {
  try {
    const data = JSON.parse(readFileSync(join(OUT_DIR, 'data.json'), 'utf8'))
    const ts = data?.x402?.tokenSplit
    if (ts && Number.isFinite(Number(ts.usdcSharePct))) {
      return {
        asOf: ts.asOf || data.updatedAt || new Date().toISOString(),
        windowDays: num(ts.windowDays) || 30,
        usdcSharePct: Number(ts.usdcSharePct),
        ...(ts.totalPayments != null ? { totalPayments: num(ts.totalPayments) } : {}),
        ...(ts.note ? { note: ts.note } : {}),
      }
    }
  } catch { /* data.json missing/unreadable — fall through to prev */ }
  if (prev) return prev
  throw new Error('data.json has no x402.tokenSplit and no previous value to reuse')
}

async function main() {
  console.log('Fetching non-Dune web sources...\n')
  const out = { updatedAt: new Date().toISOString(), schema: 2 }

  // Reuse previous values on transient failure rather than dropping a section.
  let prev = {}
  try { prev = JSON.parse(readFileSync(OUT, 'utf8')) } catch {}

  const sections = [
    ['agentTokens', () => fetchAgentTokens()],
    ['x402Services', () => fetchX402Services()],
    ['agentSupply', () => fetchAgentSupply(prev.agentSupply)],
    ['virtuals', () => fetchVirtualsEcosystem(prev.virtuals)],
    ['devAdoption', () => fetchDevAdoption(prev.devAdoption)],
    ['masumi', () => fetchMasumi(prev.masumi)],
    ['solanaAgents', () => fetchSolanaAgents(prev.solanaAgents)],
    ['standardsAdoption', () => fetchStandardsAdoption(prev.standardsAdoption)],
    ['inferenceDemand', () => fetchInferenceDemand(prev.inferenceDemand)],
    ['x402TokenSplit', () => readX402TokenSplit(prev.x402TokenSplit)],
  ]
  const results = await Promise.allSettled(sections.map(([, fn]) => fn()))
  let fulfilled = 0
  sections.forEach(([key], i) => {
    if (results[i].status === 'fulfilled') { out[key] = results[i].value; fulfilled += 1 }
    else {
      console.warn(`${key} failed:`, results[i].reason?.message)
      if (prev[key]) { out[key] = prev[key]; console.warn(`${key}: reusing previous values`) }
    }
  })

  if (fulfilled === 0) throw new Error('all web sources failed and no prior data to reuse')

  writeFileSync(OUT, JSON.stringify(out, null, 2))
  console.log('✓ web-sources.json written')
  if (out.agentTokens) {
    console.log(`  agent tokens: basket $${out.agentTokens.basketMcap.toLocaleString()} (${out.agentTokens.basket.length} coins)`)
    out.agentTokens.basket.forEach(t => console.log(`     ${t.symbol.padEnd(8)} $${t.mcap.toLocaleString().padStart(13)}  ${t.change24h >= 0 ? '+' : ''}${t.change24h.toFixed(1)}%`))
    out.agentTokens.categories.forEach(c => console.log(`     [cat] ${c.name}: $${c.mcap.toLocaleString()}`))
  }
  if (out.x402Services) {
    console.log(`  x402 providers: ${out.x402Services.uniqueProviders.toLocaleString()} unique domains (${out.x402Services.totalListings.toLocaleString()} listings, top-2 hosts ${out.x402Services.top2ListingSharePct}%)`)
  }
  if (out.agentSupply) {
    console.log(`  MCP servers: ${out.agentSupply.officialMcpServers.toLocaleString()} official registry (Smithery: ${out.agentSupply.smitheryMcpServers.toLocaleString()})`)
  }
  if (out.virtuals) {
    console.log(`  Virtuals: ${out.virtuals.launchedAgents.toLocaleString()} launched, ${out.virtuals.acpRegisteredAgents.toLocaleString()} ACP agents` +
      (out.virtuals.aggregates ? `, gross $${out.virtuals.aggregates.grossAgenticUsd.toLocaleString()}, ${out.virtuals.aggregates.totalJobs.toLocaleString()} jobs` : ''))
  }
  if (out.devAdoption) {
    console.log(`  dev adoption: ${out.devAdoption.totalWeeklyAvg4w.toLocaleString()} weekly downloads (4w avg, ${out.devAdoption.components.length} packages)`)
  }
  if (out.masumi) {
    console.log(`  Masumi: ${out.masumi.totalTxs.toLocaleString()} escrow txs (Cardano)`)
  }
  if (out.solanaAgents) {
    console.log(`  Solana agents: ${out.solanaAgents.totalAccounts.toLocaleString()} accounts (${out.solanaAgents.registries.map(r => `${r.key} ${r.accounts.toLocaleString()}`).join(', ')})`)
  }
  if (out.standardsAdoption) {
    console.log(`  standards adoption: ${out.standardsAdoption.rows.length} checks, asOf ${out.standardsAdoption.asOf.slice(0, 10)}${out.standardsAdoption.prevMonth ? ` (MoM baseline ${out.standardsAdoption.prevMonth.date})` : ''}`)
  }
  if (out.inferenceDemand) {
    console.log(`  inference demand: ${(out.inferenceDemand.totalTokens / 1e12).toFixed(2)}T tokens / ${out.inferenceDemand.windowDays}d (OpenRouter)`)
  }
  if (out.x402TokenSplit) {
    console.log(`  x402 token split: ${out.x402TokenSplit.usdcSharePct}% USDC by vol (trailing ${out.x402TokenSplit.windowDays}d${out.x402TokenSplit.totalPayments != null ? `, ${out.x402TokenSplit.totalPayments.toLocaleString()} payments` : ''})`)
  }
}

main().catch(e => { console.error(e); process.exit(1) })
