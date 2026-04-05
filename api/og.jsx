import { ImageResponse } from '@vercel/og'
import { readFileSync } from 'fs'
import { join } from 'path'

export const config = { runtime: 'nodejs' }

function fmt(n) {
  if (n >= 1e9) return (n / 1e9).toFixed(2) + 'B'
  if (n >= 1e6) return (n / 1e6).toFixed(1) + 'M'
  if (n >= 1e3) return (n / 1e3).toFixed(1) + 'K'
  return n.toLocaleString()
}

export default async function handler(req) {
  // Load live data
  let data
  try {
    const raw = readFileSync(join(process.cwd(), 'public', 'data.json'), 'utf-8')
    data = JSON.parse(raw)
  } catch {
    data = null
  }

  const x402 = data?.x402 || {}
  const baseAg = data?.baseAgentic || {}
  const acp = data?.virtualsAcp || {}
  const tempo = data?.tempoMpp || {}

  const totalEvents = (x402.totalTxs || 139277505) + (baseAg.totalTxs || 709494) + (acp.totalMemos || 0) + (tempo.totalEvents || 0)
  const totalVol = x402.totalVolume || 38843631
  const standards = 4
  const chains = 8

  const updated = (() => {
    try {
      return new Date(data?.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' })
    } catch { return '' }
  })()

  return new ImageResponse(
    (
      <div style={{
        width: '100%', height: '100%',
        display: 'flex', flexDirection: 'column',
        background: '#0B0F14',
        fontFamily: 'Inter, system-ui, sans-serif',
        padding: '60px 72px',
      }}>
        {/* Top bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
          <span style={{ fontSize: 24, fontWeight: 700, color: '#F9FAFB' }}>agenteconomy.to</span>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 6,
            background: '#052E16', border: '1px solid #14532D',
            borderRadius: 20, padding: '4px 12px',
          }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#16A34A' }} />
            <span style={{ fontSize: 12, color: '#16A34A', fontWeight: 600, letterSpacing: '0.08em' }}>LIVE</span>
          </div>
        </div>

        {/* Title */}
        <div style={{ fontSize: 20, color: '#6B7280', fontWeight: 500, marginBottom: 8 }}>
          Tracking the agentic economy
        </div>

        {/* Big number */}
        <div style={{
          fontSize: 96, fontWeight: 700, color: '#F9FAFB',
          letterSpacing: '-0.04em', lineHeight: 1, marginBottom: 8,
          fontVariantNumeric: 'tabular-nums',
        }}>
          {totalEvents.toLocaleString()}
        </div>
        <div style={{ fontSize: 16, color: '#6B7280', letterSpacing: '0.12em', fontWeight: 600, textTransform: 'uppercase', marginBottom: 40 }}>
          on-chain events tracked
        </div>

        {/* Stats row */}
        <div style={{
          display: 'flex', gap: 0,
          background: '#111827', border: '1px solid #1E293B',
          borderRadius: 16, overflow: 'hidden',
          marginTop: 'auto',
        }}>
          {[
            { value: '$' + fmt(totalVol), label: 'USD settled', color: '#16A34A' },
            { value: String(standards), label: 'standards', color: '#F9FAFB' },
            { value: String(chains), label: 'chains', color: '#F9FAFB' },
            { value: fmt(x402.totalTxs || 139277505), label: 'x402 events', color: '#3B82F6' },
          ].map((item, i) => (
            <div key={i} style={{
              flex: 1, padding: '24px 28px',
              borderRight: i < 3 ? '1px solid #1E293B' : 'none',
              display: 'flex', flexDirection: 'column', alignItems: 'center',
            }}>
              <div style={{ fontSize: 28, fontWeight: 700, color: item.color, letterSpacing: '-0.02em', marginBottom: 4 }}>
                {item.value}
              </div>
              <div style={{ fontSize: 13, color: '#6B7280' }}>{item.label}</div>
            </div>
          ))}
        </div>

        {/* Footer */}
        {updated && (
          <div style={{ fontSize: 13, color: '#374151', marginTop: 16, textAlign: 'right', display: 'flex', justifyContent: 'flex-end' }}>
            Updated {updated}
          </div>
        )}
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  )
}
