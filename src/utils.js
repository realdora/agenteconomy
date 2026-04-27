export const GREEN = '#16A34A'
export const BLUE = '#3B82F6'
export const BLUE_L = '#93C5FD'

export function safeColor(c) {
  return /^#[0-9a-fA-F]{3,8}$/.test(c || '') ? c : '#9CA3AF'
}

export function fmt(n = 0) {
  if (n >= 1e9) return `${(n / 1e9).toFixed(2)}B`
  if (n >= 1e6) return `${(n / 1e6).toFixed(1)}M`
  if (n >= 1e3) return `${(n / 1e3).toFixed(1)}K`
  return Number(n || 0).toLocaleString()
}

export function fmtMoney(n = 0) {
  return `$${fmt(n)}`
}

export function calcDelta(arr, key, w) {
  if (!arr || arr.length < w * 2) return null
  const recent = arr.slice(-w)
  const prior = arr.slice(-w * 2, -w)
  const sR = recent.reduce((s, d) => s + (d[key] || 0), 0)
  const sP = prior.reduce((s, d) => s + (d[key] || 0), 0)
  if (sP === 0) return null
  return ((sR - sP) / sP * 100).toFixed(1)
}

export function addMA(data, key, w = 7) {
  return (data || []).map((d, i) => {
    const sl = data.slice(Math.max(0, i - w + 1), i + 1)
    return { ...d, ma: Math.round(sl.reduce((a, v) => a + (v[key] || 0), 0) / sl.length) }
  })
}

export function computeTotals(data) {
  const x = data.x402 || {}
  const ag = data.baseAgentic || {}
  const acp = data.virtualsAcp || {}
  const tempo = data.tempoMpp || {}
  const olas = data.olas || {}
  const erc = data.erc8004Registry || {}

  return {
    combinedEvents: (x.totalTxs || 0) + (ag.totalTxs || 0) + (acp.totalMemos || 0) + (tempo.totalEvents || 0) + (olas.totalTxs || 0),
    combinedVol: x.totalVolume || 0,
    registeredAgents: erc.totalAgents || 0,
    chains: Math.max(x.chainsTracked || 0, 11),
    protocols: 5,
  }
}

export function normalizeData(fallback, incoming) {
  if (!incoming) return fallback
  if (incoming.x402) {
    return {
      ...fallback,
      ...incoming,
      x402: { ...fallback.x402, ...incoming.x402 },
      baseAgentic: incoming.baseAgentic || fallback.baseAgentic,
      virtualsAcp: incoming.virtualsAcp || fallback.virtualsAcp,
      tempoMpp: incoming.tempoMpp || fallback.tempoMpp,
      erc8004Registry: incoming.erc8004Registry || fallback.erc8004Registry,
      olas: incoming.olas || fallback.olas,
    }
  }
  if (incoming.totalTxs !== undefined) {
    return {
      ...fallback,
      updatedAt: incoming.updatedAt || fallback.updatedAt,
      x402: {
        ...fallback.x402,
        totalTxs: incoming.totalTxs,
        totalVolume: incoming.totalVolume,
        facilitatorsTracked: incoming.facilitatorsTracked || fallback.x402.facilitatorsTracked,
        chainsTracked: incoming.chainsTracked || fallback.x402.chainsTracked,
        monthly: incoming.monthly || fallback.x402.monthly,
        protocols: incoming.protocols || fallback.x402.protocols,
        chains: incoming.chains || fallback.x402.chains,
      },
    }
  }
  return fallback
}

export function getFreshness(updatedAt, loadState) {
  if (loadState === 'loading') return { label: 'Loading', tone: 'muted' }
  if (loadState === 'fallback') return { label: 'Fallback data', tone: 'warn' }
  if (loadState === 'error') return { label: 'Data fetch failed', tone: 'warn' }
  const updated = new Date(updatedAt)
  if (Number.isNaN(updated.getTime())) return { label: 'Unknown freshness', tone: 'warn' }
  const hours = (Date.now() - updated.getTime()) / 36e5
  if (hours > 12) return { label: 'Stale data', tone: 'warn' }
  if (hours > 6) return { label: 'Cached data', tone: 'ok' }
  return { label: 'Live data', tone: 'ok' }
}

export function shortDate(updatedAt) {
  try {
    return new Date(updatedAt).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'UTC',
      timeZoneName: 'short',
    })
  } catch {
    return ''
  }
}
