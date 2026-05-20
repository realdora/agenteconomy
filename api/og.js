import { ImageResponse } from '@vercel/og'
import { jsx, jsxs } from 'react/jsx-runtime'

export const config = { runtime: 'edge' }

const GREEN = '#16A34A'
const BLUE = '#3B82F6'
const BG = '#0B0F14'
const SURFACE = '#111827'
const BORDER = '#1E293B'
const TEXT = '#F9FAFB'
const MUTED = '#6B7280'

function fmt(n) {
  const value = Number(n || 0)
  if (value >= 1e9) return `${(value / 1e9).toFixed(2)}B`
  if (value >= 1e6) return `${(value / 1e6).toFixed(1)}M`
  if (value >= 1e3) return `${(value / 1e3).toFixed(1)}K`
  return value.toLocaleString()
}

function computeTotals(data) {
  const x402 = data?.x402 || {}
  const baseAg = data?.baseAgentic || {}
  const acp = data?.virtualsAcp || {}
  const tempo = data?.tempoMpp || {}
  const olas = data?.olas || {}

  return {
    events: (x402.totalTxs || 139277505) + (baseAg.totalTxs || 709494) + (acp.totalMemos || 0) + (tempo.totalEvents || 0) + (olas.totalTxs || 0),
    volume: x402.totalVolume || 38843631,
    x402Events: x402.totalTxs || 139277505,
  }
}

async function loadData(request) {
  try {
    const currentUrl = new URL(request.url)
    const dataUrl = new URL('/data.json', request.url)
    const bypass = currentUrl.searchParams.get('x-vercel-protection-bypass')
    if (bypass) dataUrl.searchParams.set('x-vercel-protection-bypass', bypass)

    const headers = new Headers()
    for (const name of ['cookie', 'x-vercel-protection-bypass']) {
      const value = request.headers.get(name)
      if (value) headers.set(name, value)
    }

    const response = await fetch(dataUrl, { cache: 'no-store', headers })
    if (!response.ok) return null
    return await response.json()
  } catch {
    return null
  }
}

function updatedLabel(data) {
  if (!data?.updatedAt) return ''
  const updated = new Date(data.updatedAt)
  if (Number.isNaN(updated.getTime())) return ''
  return updated.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' })
}

function DotMatrix() {
  const dots = Array.from({ length: 240 }, (_, index) => jsx('div', {
    style: {
      width: 3,
      height: 3,
      borderRadius: '50%',
      background: index % 7 === 0 ? GREEN : '#1F2937',
      opacity: index % 7 === 0 ? 0.45 : 0.72,
    },
  }, index))

  return jsx('div', {
    style: {
      position: 'absolute',
      top: 34,
      right: 42,
      bottom: 34,
      left: 42,
      display: 'flex',
      flexWrap: 'wrap',
      gap: 12,
      opacity: 0.32,
    },
    children: dots,
  })
}

function Stat({ value, label, color, borderRight }) {
  return jsxs('div', {
    style: {
      flex: 1,
      padding: '24px 28px',
      borderRight: borderRight ? `1px solid ${BORDER}` : 'none',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    children: [
      jsx('div', {
        style: {
          fontSize: 28,
          fontWeight: 700,
          color,
          letterSpacing: '-0.02em',
          marginBottom: 4,
        },
        children: value,
      }),
      jsx('div', {
        style: {
          fontSize: 13,
          color: MUTED,
        },
        children: label,
      }),
    ],
  })
}

export default async function handler(request) {
  const data = await loadData(request)
  const totals = computeTotals(data)
  const updated = updatedLabel(data)

  return new ImageResponse(
    jsxs('div', {
      style: {
        width: '100%',
        height: '100%',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        background: BG,
        fontFamily: 'Inter, system-ui, sans-serif',
        padding: '60px 72px',
      },
      children: [
        jsx(DotMatrix, {}),
        jsxs('div', {
          style: {
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            marginBottom: 16,
          },
          children: [
            jsx('span', {
              style: {
                fontSize: 24,
                fontWeight: 700,
                color: TEXT,
              },
              children: 'agenteconomy.to',
            }),
            jsxs('div', {
              style: {
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                background: '#052E16',
                border: '1px solid #14532D',
                borderRadius: 20,
                padding: '4px 12px',
              },
              children: [
                jsx('div', {
                  style: {
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    background: GREEN,
                  },
                }),
                jsx('span', {
                  style: {
                    fontSize: 12,
                    color: GREEN,
                    fontWeight: 600,
                    letterSpacing: '0.08em',
                  },
                  children: 'LIVE',
                }),
              ],
            }),
          ],
        }),
        jsx('div', {
          style: {
            position: 'relative',
            fontSize: 20,
            color: MUTED,
            fontWeight: 500,
            marginBottom: 8,
          },
          children: 'AI agent payment data dashboard',
        }),
        jsx('div', {
          style: {
            position: 'relative',
            fontSize: 96,
            fontWeight: 700,
            color: TEXT,
            letterSpacing: '-0.04em',
            lineHeight: 1,
            marginBottom: 8,
            fontVariantNumeric: 'tabular-nums',
          },
          children: totals.events.toLocaleString(),
        }),
        jsx('div', {
          style: {
            position: 'relative',
            fontSize: 16,
            color: MUTED,
            letterSpacing: '0.12em',
            fontWeight: 600,
            textTransform: 'uppercase',
            marginBottom: 40,
          },
          children: 'on-chain events tracked',
        }),
        jsxs('div', {
          style: {
            position: 'relative',
            display: 'flex',
            gap: 0,
            background: SURFACE,
            border: `1px solid ${BORDER}`,
            borderRadius: 16,
            overflow: 'hidden',
            marginTop: 'auto',
          },
          children: [
            jsx(Stat, { value: `$${fmt(totals.volume)}`, label: 'USD settled', color: GREEN, borderRight: true }),
            jsx(Stat, { value: '5', label: 'protocols', color: TEXT, borderRight: true }),
            jsx(Stat, { value: '11+', label: 'chains', color: TEXT, borderRight: true }),
            jsx(Stat, { value: fmt(totals.x402Events), label: 'x402 events', color: BLUE, borderRight: false }),
          ],
        }),
        updated ? jsx('div', {
          style: {
            position: 'relative',
            fontSize: 13,
            color: '#374151',
            marginTop: 16,
            textAlign: 'right',
            display: 'flex',
            justifyContent: 'flex-end',
          },
          children: `Updated ${updated}`,
        }) : null,
      ],
    }),
    {
      width: 1200,
      height: 630,
    }
  )
}
