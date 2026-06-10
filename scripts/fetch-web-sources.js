// scripts/fetch-web-sources.js
// Non-Dune data sources for agenteconomy — free, no-auth, web-readable.
// Adds dimensions on-chain payment flow can't give:
//   1. agent-token market caps (capital dimension)  — CoinGecko categories + curated basket
//   2. x402 service catalog (supply side)            — Coinbase x402 Bazaar discovery
// Deliberately independent of the Dune pipeline (writes its own web-sources.json)
// so it keeps working while the Dune side is blocked.
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

async function main() {
  console.log('Fetching non-Dune web sources...\n')
  const out = { updatedAt: new Date().toISOString(), schema: 1 }
  const results = await Promise.allSettled([fetchAgentTokens(), fetchX402Services()])

  // Reuse previous values on transient failure rather than dropping a section.
  let prev = {}
  try { prev = JSON.parse(readFileSync(OUT, 'utf8')) } catch {}

  const [tokens, services] = results
  if (tokens.status === 'fulfilled') out.agentTokens = tokens.value
  else { console.warn('agentTokens failed:', tokens.reason?.message); if (prev.agentTokens) out.agentTokens = prev.agentTokens }
  if (services.status === 'fulfilled') out.x402Services = services.value
  else { console.warn('x402Services failed:', services.reason?.message); if (prev.x402Services) out.x402Services = prev.x402Services }

  if (!out.agentTokens && !out.x402Services) throw new Error('all web sources failed and no prior data to reuse')

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
}

main().catch(e => { console.error(e); process.exit(1) })
