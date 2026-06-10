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
  const launched = await getJsonRetry(`${VIRTUALS_APP}?pagination%5BpageSize%5D=1`)
  const launchedAgents = num(launched?.meta?.pagination?.total)
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

// 6. Masumi Network (Cardano) — exact tx count on the mainnet payment contract
// via Koios (free, count=exact comes back in the content-range header).
async function fetchMasumi(prev) {
  const ctrl = new AbortController()
  const t = setTimeout(() => ctrl.abort(), 25000)
  try {
    const res = await fetch(KOIOS, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Prefer: 'count=exact', Range: '0-0' },
      body: JSON.stringify({ _addresses: [MASUMI_CONTRACT] }),
      signal: ctrl.signal,
    })
    if (!res.ok && res.status !== 206) throw new Error(`Koios HTTP ${res.status}`)
    const range = res.headers.get('content-range') || ''
    const total = num(range.split('/')[1])
    if (total <= 0) throw new Error(`Koios content-range missing total (got "${range}")`)
    return {
      asOf: new Date().toISOString(),
      totalTxs: total,
      note: 'Transactions on the Masumi mainnet payment (escrow) contract, counted via Koios. Cross-verified against the Masumi explorer on 2026-06-10.',
    }
  } finally { clearTimeout(t) }
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
}

main().catch(e => { console.error(e); process.exit(1) })
