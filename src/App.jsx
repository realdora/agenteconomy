import { useState, useEffect, useMemo } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
  PieChart, Pie, ComposedChart, Line,
} from 'recharts'

// ─── FALLBACK ─────────────────────────────────────────────────
const FB = {
  updatedAt: '2026-04-04T00:00:00Z',
  x402: {
    totalTxs: 139277505, totalVolume: 38843631,
    facilitatorsTracked: 15, chainsTracked: 7,
    monthly: [
      { month: "Oct '25", txs: 28400000, vol: 8200000 },
      { month: "Nov '25", txs: 61200000, vol: 14300000 },
      { month: "Dec '25", txs: 22800000, vol: 7100000 },
      { month: "Jan '26", txs: 14600000, vol: 4800000 },
      { month: "Feb '26", txs: 8100000,  vol: 2900000 },
      { month: "Mar '26", txs: 4177505,  vol: 1543631 },
    ],
    daily: [],
    protocols: [
      { name: 'Coinbase', share: 45.4, color: '#0052FF' },
      { name: 'Dexter', share: 15.0, color: '#6366F1' },
      { name: 'PayAI', share: 13.6, color: '#10B981' },
      { name: 'DayDreams', share: 11.6, color: '#F59E0B' },
      { name: 'ThirdWeb', share: 7.1, color: '#A855F7' },
      { name: 'Other', share: 7.3, color: '#9CA3AF' },
    ],
    chains: [
      { name: 'Base', txs: 72058130, color: '#0052FF' },
      { name: 'Solana', txs: 47231681, color: '#9945FF' },
      { name: 'Polygon', txs: 7184927, color: '#8247E5' },
      { name: 'BNB', txs: 658610, color: '#F0B90B' },
      { name: 'Avalanche', txs: 4612, color: '#E84142' },
      { name: 'Arbitrum', txs: 522, color: '#12AAFF' },
      { name: 'SEI', txs: 142, color: '#9D4EDD' },
    ],
  },
  baseAgentic: { totalTxs: 709494, daily: [] },
  virtualsAcp: { totalMemos: 0, daily: [] },
  tempoMpp: { totalEvents: 0, uniquePayers: 0, uniquePayees: 0, byType: {}, daily: [] },
  erc8004Registry: { totalAgents: 0, chainsTracked: 0, chains: [], daily: [] },
  olas: { totalTxs: 0, chains: [], weekly: [] },
}

// ─── HELPERS ──────────────────────────────────────────────────
const GREEN = '#16A34A', BLUE = '#3B82F6', BLUE_L = '#93C5FD'
const MONO = "'JetBrains Mono', monospace"

const safeColor = c => /^#[0-9a-fA-F]{3,8}$/.test(c) ? c : '#9CA3AF'

const fmt = n => {
  if (n >= 1e9) return (n / 1e9).toFixed(2) + 'B'
  if (n >= 1e6) return (n / 1e6).toFixed(1) + 'M'
  if (n >= 1e3) return (n / 1e3).toFixed(1) + 'K'
  return n.toLocaleString()
}

function calcDelta(arr, key, w) {
  if (!arr || arr.length < w * 2) return null
  const recent = arr.slice(-w)
  const prior = arr.slice(-w * 2, -w)
  const sR = recent.reduce((s, d) => s + (d[key] || 0), 0)
  const sP = prior.reduce((s, d) => s + (d[key] || 0), 0)
  if (sP === 0) return null
  return ((sR - sP) / sP * 100).toFixed(1)
}

function addMA(data, key, w = 7) {
  return data.map((d, i) => {
    const sl = data.slice(Math.max(0, i - w + 1), i + 1)
    return { ...d, ma: Math.round(sl.reduce((a, v) => a + (v[key] || 0), 0) / sl.length) }
  })
}

// ─── COMPONENTS ───────────────────────────────────────────────
function useCountUp(target, dur = 1600) {
  const [v, setV] = useState(0)
  useEffect(() => {
    if (!target) return
    let s = null, id
    const step = t => {
      if (!s) s = t
      const p = Math.min((t - s) / dur, 1)
      setV(Math.floor((1 - Math.pow(1 - p, 3)) * target))
      if (p < 1) id = requestAnimationFrame(step)
    }
    id = requestAnimationFrame(step)
    return () => cancelAnimationFrame(id)
  }, [target])
  return v
}

function LiveDot() {
  return (
    <span style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 8, height: 8 }}>
      <span style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: GREEN, animation: 'ping 1.5s ease-out infinite', opacity: 0.4 }} />
      <span style={{ position: 'relative', width: 6, height: 6, borderRadius: '50%', background: GREEN }} />
    </span>
  )
}

function FlowLines() {
  const packets = [
    { top: 0, dur: '3.2s', delay: '0s', color: BLUE, w: 24 },
    { top: 0, dur: '2.8s', delay: '1.4s', color: '#93C5FD', w: 16 },
    { top: 0, dur: '3.6s', delay: '2.6s', color: BLUE, w: 20 },
    { top: 10, dur: '3.4s', delay: '0.5s', color: GREEN, w: 20, reverse: true },
    { top: 10, dur: '2.6s', delay: '2.0s', color: '#86EFAC', w: 14, reverse: true },
    { top: 10, dur: '3.8s', delay: '3.2s', color: GREEN, w: 22, reverse: true },
  ]
  return (
    <div style={{ position: 'relative', height: 14, margin: '20px 0', overflow: 'hidden' }}>
      {[0, 10].map(y => (
        <div key={y} style={{ position: 'absolute', top: y, left: 0, right: 0, height: 3, background: 'var(--chart-bg)', borderRadius: 2 }} />
      ))}
      {packets.map((p, i) => (
        <div key={i} style={{
          position: 'absolute', top: p.top, height: 3, width: p.w,
          borderRadius: 2, background: p.color, opacity: 0,
          animation: `${p.reverse ? 'packetR' : 'packet'} ${p.dur} ${p.delay} linear infinite`,
          boxShadow: `0 0 6px ${p.color}60`,
        }} />
      ))}
    </div>
  )
}

function Delta({ value, label }) {
  if (value == null) return null
  const n = parseFloat(value), up = n >= 0
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 2, fontSize: 10, fontWeight: 600, color: up ? GREEN : '#DC2626', background: up ? 'var(--delta-plus-bg)' : 'var(--delta-minus-bg)', borderRadius: 4, padding: '2px 6px' }}>
      <span style={{ fontSize: 8 }}>{up ? '\u25B2' : '\u25BC'}</span>{Math.abs(n)}%
      {label && <span style={{ fontWeight: 400, color: 'var(--text-muted)', marginLeft: 2 }}>{label}</span>}
    </span>
  )
}

function Card({ label, value, sub, accent, delta, deltaLabel, hero }) {
  return (
    <div className="card" style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, padding: '18px 16px', transition: 'box-shadow .2s, border-color .2s' }}>
      <div style={{ fontSize: 10, color: 'var(--text-faint)', letterSpacing: '.1em', fontWeight: 500, textTransform: 'uppercase', marginBottom: 8 }}>{label}</div>
      <div style={{ fontSize: hero ? 'clamp(24px,3.5vw,34px)' : 'clamp(20px,3vw,28px)', fontWeight: 700, color: accent || 'var(--text)', letterSpacing: '-.02em', marginBottom: 4, fontVariantNumeric: 'tabular-nums', lineHeight: 1.1 }}>{value}</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
        <span style={{ fontSize: 11, color: 'var(--text-faint)' }}>{sub}</span>
        <Delta value={delta} label={deltaLabel} />
      </div>
    </div>
  )
}

function Skeleton({ height = 120, style }) {
  return <div className="skeleton" style={{ height, borderRadius: 10, ...style }} />
}

function Sect({ title, badge, meta, explanation, children }) {
  const [open, setOpen] = useState(false)
  return (
    <div style={{ marginBottom: 32 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: open ? 8 : 14, flexWrap: 'wrap' }}>
        <h2 style={{ fontSize: 11, color: 'var(--text-sec)', letterSpacing: '.08em', fontWeight: 700, textTransform: 'uppercase', margin: 0 }}>{title}</h2>
        {badge && <span style={{ fontSize: 9, fontWeight: 600, color: badge.c, background: badge.bg, borderRadius: 4, padding: '2px 6px' }}>{badge.t}</span>}
        <span style={{ width: 1, height: 12, background: 'var(--border)' }} />
        <span style={{ fontSize: 10, color: 'var(--text-faint)' }}>{meta}</span>
        <button onClick={() => setOpen(o => !o)} style={{ fontSize: 10, color: 'var(--text-muted)', background: 'var(--chart-bg)', border: 'none', borderRadius: 4, padding: '2px 8px', cursor: 'pointer', fontFamily: 'inherit' }}>
          {open ? 'hide' : 'what is this?'}
        </button>
      </div>
      {open && <div style={{ background: 'var(--surface-alt)', border: '1px solid var(--border)', borderRadius: 8, padding: '10px 14px', fontSize: 11, color: 'var(--text-muted)', lineHeight: 1.65, marginBottom: 14 }}>{explanation}</div>}
      {children}
    </div>
  )
}

const ChartTip = ({ active, payload, label, isMoney, unit }) => {
  if (!active || !payload?.length) return null
  return (
    <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8, padding: '8px 12px', boxShadow: '0 4px 12px var(--shadow)' }}>
      <div style={{ color: 'var(--text-muted)', marginBottom: 3, fontSize: 11 }}>{label}</div>
      {payload.filter(p => p.value > 0).map((p, i) => (
        <div key={i} style={{ color: p.color || 'var(--text)', fontWeight: 600, fontSize: 12 }}>
          {p.dataKey === 'ma' ? '7d avg: ' : ''}{isMoney ? '$' : ''}{fmt(p.value)}{unit || ''}
        </div>
      ))}
    </div>
  )
}

// ─── MAIN ─────────────────────────────────────────────────────
export default function App() {
  const [data, setData] = useState(FB)
  const [tf, setTf] = useState('month')
  const [met, setMet] = useState('txs')

  const [dark, setDark] = useState(() => {
    try { const saved = localStorage.getItem('ae-theme'); if (saved) return saved === 'dark' } catch {}
    const h = new Date().getHours()
    return h < 6 || h >= 18
  })
  useEffect(() => { document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light') }, [dark])
  const toggleTheme = () => setDark(d => { const next = !d; try { localStorage.setItem('ae-theme', next ? 'dark' : 'light') } catch {}; return next })

  useEffect(() => {
    fetch('/data.json').then(r => r.json()).then(d => {
      if (d.x402) {
        setData({
          ...FB, ...d,
          virtualsAcp: d.virtualsAcp || FB.virtualsAcp,
          tempoMpp: d.tempoMpp || FB.tempoMpp,
          erc8004Registry: d.erc8004Registry || FB.erc8004Registry,
          olas: d.olas || FB.olas,
        })
      } else if (d.totalTxs !== undefined) {
        // backward compat with old flat format
        setData({
          ...FB,
          updatedAt: d.updatedAt || FB.updatedAt,
          x402: { ...FB.x402, totalTxs: d.totalTxs, totalVolume: d.totalVolume, facilitatorsTracked: d.facilitatorsTracked || 15, chainsTracked: d.chainsTracked || 7, monthly: d.monthly || FB.x402.monthly, protocols: d.protocols || FB.x402.protocols, chains: d.chains || FB.x402.chains },
        })
      }
    }).catch(() => {})
  }, [])

  const x = data.x402
  const ag = data.baseAgentic
  const acp = data.virtualsAcp || FB.virtualsAcp
  const tempo = data.tempoMpp || FB.tempoMpp
  const erc8004Reg = data.erc8004Registry || FB.erc8004Registry
  const olas = data.olas || FB.olas

  // Totals (Olas txs added — different protocol/contracts, zero overlap)
  const combinedEvents = x.totalTxs + ag.totalTxs + (acp.totalMemos || 0) + (tempo.totalEvents || 0) + (olas.totalTxs || 0)
  const combinedVol = x.totalVolume

  // Animated
  const cEvents = useCountUp(combinedEvents)
  const cVol = useCountUp(combinedVol)
  const xTxs = useCountUp(x.totalTxs)
  const xVol = useCountUp(x.totalVolume)
  const agTxs = useCountUp(ag.totalTxs)
  const acpMemos = useCountUp(acp.totalMemos || 0)
  const tempoEvts = useCountUp(tempo.totalEvents || 0)
  const regAgents = useCountUp(erc8004Reg.totalAgents || 0)
  const olasTxs = useCountUp(olas.totalTxs || 0)

  // Deltas
  const x402d7 = calcDelta(x.daily, 'txs', 7)
  const agDelta = calcDelta(ag.daily, 'total', 1)
  const acpDelta = calcDelta(acp.daily, 'memos', 7)
  const tempoDelta = calcDelta(tempo.daily, 'events', 7)
  const olasDelta = calcDelta(olas.weekly, 'txs', 1)

  // Chart
  const chartData = useMemo(() => {
    if (tf === 'day') return addMA(x.daily, 'txs', 7).map(d => ({ label: d.day.slice(5), txs: d.txs, ma: d.ma }))
    return x.monthly.map(d => ({ label: d.month, txs: d.txs, vol: d.vol }))
  }, [tf, x.daily, x.monthly])

  const totalChain = x.chains.reduce((s, c) => s + c.txs, 0)

  const updatedLabel = (() => {
    try { return new Date(data.updatedAt).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit', timeZone: 'UTC', timeZoneName: 'short' }) }
    catch { return '' }
  })()

  const tb = a => ({ padding: '6px 12px', borderRadius: 5, fontSize: 10, fontWeight: 500, cursor: 'pointer', border: 'none', background: a ? 'var(--tab-active)' : 'transparent', color: a ? 'var(--text)' : 'var(--text-faint)', boxShadow: a ? '0 1px 3px var(--tab-shadow)' : 'none', transition: 'all .15s', fontFamily: 'inherit', minHeight: 32 })

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', fontFamily: "'Inter', system-ui, -apple-system, sans-serif", color: 'var(--text)', WebkitFontSmoothing: 'antialiased' }}>
      <style>{`
        :root{--bg:#FAFAFA;--surface:#fff;--surface-alt:#F9FAFB;--border:#E5E7EB;--border-light:#F3F4F6;--border-focus:#D1D5DB;--text:#111827;--text-strong:#0A0A0A;--text-sec:#374151;--text-muted:#6B7280;--text-faint:#9CA3AF;--text-ghost:#D1D5DB;--chart-bg:#F3F4F6;--cursor-fill:#F9FAFB;--shadow:rgba(0,0,0,0.08);--shadow-md:rgba(0,0,0,0.08);--card-shadow:rgba(0,0,0,0.06);--tab-shadow:rgba(0,0,0,0.08);--live-bg:#F0FDF4;--live-border:#DCFCE7;--delta-plus-bg:#F0FDF4;--delta-minus-bg:#FEF2F2;--tab-bg:#F3F4F6;--tab-active:#fff;--pie-stroke:#FAFAFA;--hover-bg:#F9FAFB;--badge-purple-bg:#F5F3FF;--badge-blue-bg:#EFF6FF;--badge-green-bg:#F0FDF4;--badge-yellow-bg:#FEF3C7;--dashed-blue:#93C5FD;--dashed-gray:#D1D5DB;--nav-bg:#fff}
        [data-theme="dark"]{--bg:#0B0F14;--surface:#111827;--surface-alt:#0D1117;--border:#1E293B;--border-light:#1E293B;--border-focus:#374151;--text:#E5E7EB;--text-strong:#F9FAFB;--text-sec:#D1D5DB;--text-muted:#9CA3AF;--text-faint:#6B7280;--text-ghost:#374151;--chart-bg:#1E293B;--cursor-fill:#111827;--shadow:rgba(0,0,0,0.4);--shadow-md:rgba(0,0,0,0.4);--card-shadow:rgba(255,255,255,0.03);--tab-shadow:rgba(0,0,0,0.3);--live-bg:#052E16;--live-border:#14532D;--delta-plus-bg:#052E16;--delta-minus-bg:#450A0A;--tab-bg:#1E293B;--tab-active:#374151;--pie-stroke:#111827;--hover-bg:#111827;--badge-purple-bg:#1E1B4B;--badge-blue-bg:#172554;--badge-green-bg:#052E16;--badge-yellow-bg:#422006;--dashed-blue:#1E3A5F;--dashed-gray:#374151;--nav-bg:#0B0F14}
        @keyframes ping{0%{transform:scale(1);opacity:.4}100%{transform:scale(2.2);opacity:0}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
        @keyframes packet{0%{left:-4%;opacity:0}5%{opacity:1}90%{opacity:1}100%{left:104%;opacity:0}}
        @keyframes packetR{0%{right:-4%;opacity:0}5%{opacity:1}90%{opacity:1}100%{right:104%;opacity:0}}
        @keyframes shimmer{0%{background-position:-400px 0}100%{background-position:400px 0}}
        .skeleton{background:linear-gradient(90deg,var(--chart-bg) 25%,var(--border-light) 50%,var(--chart-bg) 75%);background-size:800px 100%;animation:shimmer 1.8s ease-in-out infinite}
        .sect-divider{height:1px;margin:8px 0 32px;background:linear-gradient(90deg,transparent,var(--border),transparent)}
        *{box-sizing:border-box;margin:0;padding:0}
        a{color:var(--text-muted);text-decoration:none;transition:color .15s}a:hover{color:var(--text)}
        .fade{animation:fadeUp .5s ease both}
        .card:hover{box-shadow:0 4px 20px var(--card-shadow);border-color:var(--border-focus)!important}
        .info-tip{position:relative;display:inline-flex;align-items:center;cursor:default}
        .info-tip .info-bubble{visibility:hidden;opacity:0;position:absolute;top:calc(100% + 8px);left:0;width:280px;background:var(--surface);border:1px solid var(--border);border-radius:8px;padding:10px 14px;font-size:11px;color:var(--text-muted);line-height:1.6;letter-spacing:normal;font-weight:400;box-shadow:0 4px 16px var(--shadow);transition:opacity .15s,visibility .15s;z-index:50;pointer-events:none;text-transform:none}
        .info-tip .info-bubble::before{content:'';position:absolute;bottom:100%;left:16px;border:5px solid transparent;border-bottom-color:var(--border)}
        .info-tip:hover .info-bubble{visibility:visible;opacity:1}
        .footer-link{color:var(--text-faint)!important;text-decoration:none!important;transition:color .15s}.footer-link:hover{color:var(--text-sec)!important}
        @media(min-width:769px) and (max-width:1024px){
          .hero-row{grid-template-columns:repeat(2,1fr)!important}
          .hero-row>div:nth-child(2){border-right:none!important}
          .hero-row>div:nth-child(1),.hero-row>div:nth-child(2){border-bottom:1px solid var(--border)}
        }
        @media(max-width:768px){
          .hero-title{font-size:22px!important}
          .g4{grid-template-columns:repeat(2,1fr)!important}
          .g2{grid-template-columns:1fr!important}
          .mg{grid-template-columns:1fr!important}
          .nr{display:none!important}
          .mob-meta{display:flex!important}
          .ni{padding:0 16px!important}
          .mc{padding:20px 16px!important}
          .hero-num{font-size:48px!important}
          .hero-row{grid-template-columns:1fr!important}
          .hero-row>div{border-right:none!important;border-bottom:1px solid var(--border)}
          .hero-row>div:last-child{border-bottom:none!important}
          .pie-wrap{flex-direction:column!important;align-items:flex-start!important}
          .pie-wrap svg{margin:0 auto}
          .info-tip .info-bubble{left:-40px!important;width:240px!important}
          .info-tip .info-bubble::before{left:56px!important}
          .tempo-partners{flex-direction:column!important;gap:10px!important}
          .chain-label{width:52px!important}
          .evt-label{width:80px!important}
          .footer-inner{padding:14px 16px!important}
        }
        @media(max-width:480px){
          .g4{grid-template-columns:1fr!important;gap:8px!important}
          .card{padding:14px 12px!important}
          .hero-num{font-size:36px!important}
          .chart-toggles{flex-direction:column!important;align-items:flex-start!important}
        }
      `}</style>

      {/* NAV */}
      <div style={{ background: 'var(--nav-bg)', borderBottom: '1px solid var(--border)', position: 'sticky', top: 0, zIndex: 100 }}>
        <div className="ni" style={{ maxWidth: 1160, margin: '0 auto', padding: '0 24px', height: 48, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 13, fontWeight: 700 }}>agenteconomy.to</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, background: 'var(--live-bg)', border: '1px solid var(--live-border)', borderRadius: 20, padding: '2px 8px' }}>
              <LiveDot /><span style={{ fontSize: 9, color: GREEN, fontWeight: 600, letterSpacing: '.08em' }}>LIVE</span>
            </div>
            <button onClick={toggleTheme} style={{ width: 32, height: 32, borderRadius: '50%', border: '1px solid var(--border)', background: 'var(--surface)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', padding: 0, transition: 'border-color .15s' }}>
              {dark ? (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--text-muted)' }}><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
              ) : (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--text-muted)' }}><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
              )}
            </button>
          </div>
          <div className="nr" style={{ display: 'flex', gap: 16, alignItems: 'center', fontSize: 11, color: 'var(--text-faint)' }}>
            <span>Updated {updatedLabel}</span>
            <a href="#methodology" style={{ fontWeight: 500 }}>Methodology</a>
          </div>
        </div>
        <div className="mob-meta" style={{ display: 'none', justifyContent: 'space-between', alignItems: 'center', padding: '6px 16px', fontSize: 10, color: 'var(--text-faint)', borderTop: '1px solid var(--border)' }}>
          <span>Updated {updatedLabel}</span>
          <a href="#methodology" style={{ fontWeight: 500, fontSize: 10, color: 'var(--text-faint)' }}>Methodology</a>
        </div>
      </div>

      <div className="mc" style={{ maxWidth: 1160, margin: '0 auto', padding: '40px 24px 60px' }}>

        {/* HERO */}
        <div className="fade" style={{ marginBottom: 48 }}>
          <h1 className="hero-title" style={{ fontSize: 'clamp(24px, 3.5vw, 36px)', fontWeight: 800, color: 'var(--text-strong)', letterSpacing: '-.03em', lineHeight: 1.15, marginBottom: 28 }}>
            Tracking the<br />agentic economy.
          </h1>
          <div style={{ fontSize: 10, color: 'var(--text-faint)', letterSpacing: '.12em', fontWeight: 600, textTransform: 'uppercase', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
            <span>On-chain events tracked</span>
            <span className="info-tip">
              <span style={{ width: 14, height: 14, borderRadius: '50%', border: '1px solid var(--border-focus)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, color: 'var(--text-faint)', lineHeight: 1, cursor: 'help' }}>?</span>
              <span className="info-bubble">Aggregate of x402 settlements, ERC-8004 agentic events, Virtuals ACP memos, Tempo MPP events, and Olas agent transactions. Each protocol tracks different smart contracts with zero overlap.</span>
            </span>
          </div>
          <div className="hero-num" style={{ fontFamily: MONO, fontSize: 'clamp(48px, 8vw, 80px)', fontWeight: 700, lineHeight: 1, letterSpacing: '-.04em', color: 'var(--text-strong)', fontVariantNumeric: 'tabular-nums' }}>
            {cEvents.toLocaleString()}
          </div>
          <FlowLines />
          <div className="hero-row" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, overflow: 'hidden', marginBottom: 20 }}>
            {[
              { value: '$' + cVol.toLocaleString(), label: 'USD settled', color: GREEN },
              { value: fmt(regAgents), label: 'agents registered', color: '#7C3AED' },
              { value: 5, label: 'protocols', color: 'var(--text-strong)' },
              { value: 11, label: 'chains', color: 'var(--text-strong)' },
            ].map((item, i) => (
              <div key={i} style={{ padding: '16px 20px', borderRight: i < 3 ? '1px solid var(--border)' : 'none', textAlign: 'center' }}>
                <div className="hero-sub" style={{ fontFamily: MONO, fontSize: 'clamp(18px, 2.5vw, 26px)', fontWeight: 700, color: item.color, letterSpacing: '-.02em', marginBottom: 2 }}>{item.value}</div>
                <div style={{ fontSize: 11, color: 'var(--text-faint)' }}>{item.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── x402 ── */}
        <div className="fade" style={{ animationDelay: '.05s' }}>
          <Sect title="x402 Protocol" badge={{ t: 'DOMINANT', bg: 'var(--badge-blue-bg)', c: BLUE }} meta={`${x.facilitatorsTracked} facilitators · ${x.chainsTracked} chains`}
            explanation="x402 is an open HTTP payment standard by Coinbase using HTTP 402 status code. Enables AI agents to pay for APIs per request. Foundation governed by Coinbase + Cloudflare; members include Google, Visa, AWS, Circle, Anthropic, Vercel.">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 10, marginBottom: 14 }} className="g4">
              <Card label="Total Events" value={xTxs.toLocaleString()} sub="all-time" delta={x402d7} deltaLabel="7d" hero />
              <Card label="Total Volume" value={'$' + xVol.toLocaleString()} sub="USD processed" accent={GREEN} />
              <Card label="Facilitators" value={x.facilitatorsTracked} sub="active" />
              <Card label="Chains" value={x.chainsTracked} sub="EVM + Solana" />
            </div>

            <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, padding: '18px 16px', marginBottom: 10 }}>
              <div className="chart-toggles" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14, flexWrap: 'wrap', gap: 8 }}>
                <div style={{ fontSize: 12, fontWeight: 600 }}>{met === 'txs' ? 'Transaction' : 'USD'} volume</div>
                <div style={{ display: 'flex', gap: 4 }}>
                  <div style={{ display: 'flex', background: 'var(--tab-bg)', borderRadius: 6, padding: 2, gap: 1 }}>
                    {[['month', 'Month'], ['day', 'Day']].map(([t, l]) => (
                      <button key={t} onClick={() => setTf(t)} style={tb(tf === t)}>{l}</button>
                    ))}
                  </div>
                  {tf === 'month' && <div style={{ display: 'flex', background: 'var(--tab-bg)', borderRadius: 6, padding: 2, gap: 1 }}>
                    {[['txs', 'Txs'], ['vol', 'Vol ($)']].map(([t, l]) => (
                      <button key={t} onClick={() => setMet(t)} style={tb(met === t)}>{l}</button>
                    ))}
                  </div>}
                </div>
              </div>
              <ResponsiveContainer width="100%" height={200}>
                {tf === 'day' && chartData.length > 0 ? (
                  <ComposedChart data={chartData} margin={{ top: 4, right: 0, bottom: 0, left: 0 }}>
                    <XAxis dataKey="label" tick={{ fill: '#9CA3AF', fontSize: 9 }} axisLine={false} tickLine={false} interval={Math.max(1, Math.floor(chartData.length / 10))} />
                    <YAxis tick={{ fill: '#9CA3AF', fontSize: 9 }} tickFormatter={v => fmt(v)} axisLine={false} tickLine={false} width={36} />
                    <Tooltip content={<ChartTip unit=" txs" />} cursor={{ fill: 'var(--cursor-fill)' }} />
                    <Bar dataKey="txs" fill={BLUE_L} radius={[3, 3, 0, 0]} barSize={8} name="Daily" />
                    <Line type="monotone" dataKey="ma" stroke={BLUE} strokeWidth={2} dot={false} name="7d avg" />
                  </ComposedChart>
                ) : (
                  <BarChart data={chartData} barSize={32} margin={{ top: 4, right: 0, bottom: 0, left: 0 }}>
                    <XAxis dataKey="label" tick={{ fill: '#9CA3AF', fontSize: 10 }} axisLine={false} tickLine={false} interval={0} />
                    <YAxis tick={{ fill: '#9CA3AF', fontSize: 9 }} tickFormatter={v => fmt(v)} axisLine={false} tickLine={false} width={36} />
                    <Tooltip content={<ChartTip isMoney={met === 'vol'} />} cursor={{ fill: 'var(--cursor-fill)' }} />
                    <Bar dataKey={met === 'txs' ? 'txs' : 'vol'} radius={[4, 4, 0, 0]}>
                      {chartData.map((_, i) => <Cell key={i} fill={met === 'vol' ? GREEN : BLUE} fillOpacity={0.35 + (i / chartData.length) * 0.65} />)}
                    </Bar>
                  </BarChart>
                )}
              </ResponsiveContainer>
              {tf === 'day' && <div style={{ display: 'flex', gap: 14, marginTop: 8 }}>
                {[[BLUE_L, 'Daily'], [BLUE, '7-day avg']].map(([c, l]) => (
                  <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 10, color: 'var(--text-faint)' }}>
                    <div style={{ width: 10, height: 3, borderRadius: 1, background: c }} />{l}
                  </div>
                ))}
              </div>}
              <div style={{ fontSize: 9, color: 'var(--text-ghost)', marginTop: 8 }}>Source: @thechriscen / @hashed_official / Dune</div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }} className="g2">
              <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, padding: '18px 16px' }}>
                <div style={{ fontSize: 11, fontWeight: 600, marginBottom: 14 }}>Chain distribution</div>
                {x.chains.map((c, i) => {
                  const pct = (c.txs / totalChain) * 100
                  return (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                      <div style={{ width: 6, height: 6, borderRadius: '50%', background: safeColor(c.color), flexShrink: 0 }} />
                      <div className="chain-label" style={{ fontSize: 11, color: 'var(--text-sec)', width: 64, fontWeight: 500 }}>{c.name}</div>
                      <div style={{ flex: 1, height: 4, background: 'var(--chart-bg)', borderRadius: 2, overflow: 'hidden' }}>
                        <div style={{ width: Math.max(pct, 0.5) + '%', height: '100%', background: safeColor(c.color), borderRadius: 2 }} />
                      </div>
                      <div style={{ fontSize: 10, color: 'var(--text-muted)', width: 36, textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{pct.toFixed(1)}%</div>
                      <div style={{ fontSize: 9, color: 'var(--text-faint)', width: 40, textAlign: 'right' }}>{c.txs >= 1e6 ? (c.txs / 1e6).toFixed(1) + 'M' : c.txs.toLocaleString()}</div>
                    </div>
                  )
                })}
              </div>
              <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, padding: '18px 16px' }}>
                <div style={{ fontSize: 11, fontWeight: 600, marginBottom: 14 }}>Facilitator share</div>
                <div className="pie-wrap" style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                  <PieChart width={100} height={100} style={{ flexShrink: 0 }}>
                    <Pie data={x.protocols} dataKey="share" nameKey="name" cx={48} cy={48} innerRadius={26} outerRadius={48} strokeWidth={2} stroke="var(--pie-stroke)">
                      {x.protocols.map((p, i) => <Cell key={i} fill={safeColor(p.color)} />)}
                    </Pie>
                    <Tooltip content={({ active, payload }) => {
                      if (!active || !payload?.length) return null
                      const d = payload[0]
                      return (
                        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8, padding: '6px 10px', boxShadow: '0 4px 12px var(--shadow)', fontSize: 11 }}>
                          <span style={{ color: 'var(--text-sec)', fontWeight: 600 }}>{d.name}</span>
                          <span style={{ color: 'var(--text-muted)', marginLeft: 6 }}>{d.value}%</span>
                        </div>
                      )
                    }} />
                  </PieChart>
                  <div style={{ flex: 1 }}>
                    {x.protocols.map((p, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                        <div style={{ width: 6, height: 6, borderRadius: 2, background: safeColor(p.color), flexShrink: 0 }} />
                        <div style={{ fontSize: 11, color: 'var(--text-sec)', flex: 1 }}>{p.name}</div>
                        <div style={{ fontSize: 11, fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>{p.share}%</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Sect>
        </div>

        <div className="sect-divider" />
        {/* ── ERC-8004 ── */}
        <div className="fade" style={{ animationDelay: '.1s' }}>
          <Sect title="ERC-8004" badge={{ t: 'IDENTITY', bg: 'var(--badge-purple-bg)', c: '#7C3AED' }} meta={`Agent identity · ${erc8004Reg.chainsTracked || 1}+ chains`}
            explanation="ERC-8004 defines on-chain identity and reputation for AI agents. Co-authored by MetaMask, Google, Coinbase. Deployed on 20+ EVM chains with identical contract addresses. Base events track agentic activity; registry data tracks agent registrations across all chains. Different contracts from x402 — zero overlap.">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 10, marginBottom: 14 }} className="g4">
              <Card label="Base Events (YTD)" value={agTxs.toLocaleString()} sub="agentic transactions" delta={agDelta} deltaLabel="WoW" hero />
              <Card label="Registered Agents" value={regAgents.toLocaleString()} sub="all chains" accent="#7C3AED" />
              <Card label="Registry Chains" value={erc8004Reg.chainsTracked || 0} sub="mainnets" />
              <Card label="Standard" value="ERC-8004" sub="Identity + reputation" />
            </div>
            {ag.daily.length > 0 && (
              <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, padding: '18px 16px' }}>
                <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 14 }}>Agentic events</div>
                <ResponsiveContainer width="100%" height={160}>
                  <BarChart data={ag.daily} barSize={Math.max(4, Math.min(14, 600 / ag.daily.length))}>
                    <XAxis dataKey="day" tick={{ fill: '#9CA3AF', fontSize: 9 }} axisLine={false} tickLine={false} tickFormatter={v => (v || '').slice(5)} interval={Math.max(1, Math.floor(ag.daily.length / 10))} />
                    <YAxis tick={{ fill: '#9CA3AF', fontSize: 9 }} tickFormatter={v => fmt(v)} axisLine={false} tickLine={false} width={36} />
                    <Tooltip content={<ChartTip />} cursor={{ fill: 'var(--cursor-fill)' }} />
                    <Bar dataKey="infrastructure" stackId="a" fill="#6366F1" name="Infrastructure" />
                    <Bar dataKey="consumer" stackId="a" fill="#10B981" radius={[2, 2, 0, 0]} name="Consumer" />
                  </BarChart>
                </ResponsiveContainer>
                <div style={{ display: 'flex', gap: 14, marginTop: 8 }}>
                  {[['#6366F1', 'Infrastructure'], ['#10B981', 'Consumer']].map(([c, l]) => (
                    <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 10, color: 'var(--text-faint)' }}>
                      <div style={{ width: 8, height: 4, borderRadius: 1, background: c }} />{l}
                    </div>
                  ))}
                </div>
                <div style={{ fontSize: 9, color: 'var(--text-ghost)', marginTop: 6 }}>Source: @ax1research / Dune</div>
              </div>
            )}
            {erc8004Reg.chains.length > 0 && (
              <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, padding: '18px 16px', marginTop: 10 }}>
                <div style={{ fontSize: 11, fontWeight: 600, marginBottom: 14 }}>Agent registrations by chain</div>
                {erc8004Reg.chains.slice(0, 8).map((c, i) => {
                  const pct = erc8004Reg.totalAgents > 0 ? (c.agents / erc8004Reg.totalAgents) * 100 : 0
                  const colors = ['#F0B90B', '#627EEA', '#0052FF', '#FF6B35', '#836EF9', '#35D07F', '#04795B', '#FF4D6A']
                  return (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                      <div style={{ width: 6, height: 6, borderRadius: '50%', background: colors[i % colors.length], flexShrink: 0 }} />
                      <div className="chain-label" style={{ fontSize: 11, color: 'var(--text-sec)', width: 64, fontWeight: 500 }}>{c.name}</div>
                      <div style={{ flex: 1, height: 4, background: 'var(--chart-bg)', borderRadius: 2, overflow: 'hidden' }}>
                        <div style={{ width: Math.max(pct, 0.5) + '%', height: '100%', background: colors[i % colors.length], borderRadius: 2 }} />
                      </div>
                      <div style={{ fontSize: 10, color: 'var(--text-muted)', width: 36, textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{pct.toFixed(1)}%</div>
                      <div style={{ fontSize: 9, color: 'var(--text-faint)', width: 44, textAlign: 'right' }}>{fmt(c.agents)}</div>
                    </div>
                  )
                })}
                <div style={{ fontSize: 9, color: 'var(--text-ghost)', marginTop: 6 }}>Source: @hashed_official / Dune</div>
              </div>
            )}
          </Sect>
        </div>

        <div className="sect-divider" />
        {/* ── Virtuals ACP ── */}
        <div className="fade" style={{ animationDelay: '.15s' }}>
          <Sect title="Virtuals ACP" badge={{ t: 'ERC-8183', bg: 'var(--badge-green-bg)', c: GREEN }} meta="Agent Commerce · Base"
            explanation="ERC-8183 enables trustless agent-to-agent commerce with escrowed payments and evaluator verification. ACP tracks job lifecycle 'memos' (create → deliver → evaluate → settle) — distinct from x402 payments and ERC-8004 identity events.">
            {acp.totalMemos > 0 ? (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 10, marginBottom: 14 }} className="g4">
                  <Card label="Total Memos" value={acpMemos.toLocaleString()} sub="cumulative" delta={acpDelta} deltaLabel="7d" hero />
                  <Card label="Standard" value="ERC-8183" sub="Agent commerce layer" />
                </div>
                {acp.daily.length > 0 && (
                  <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, padding: '18px 16px' }}>
                    <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 14 }}>Daily ACP memos</div>
                    <ResponsiveContainer width="100%" height={160}>
                      <ComposedChart data={acp.daily.slice(-60)} margin={{ top: 4, right: 0, bottom: 0, left: 0 }}>
                        <XAxis dataKey="day" tick={{ fill: '#9CA3AF', fontSize: 9 }} axisLine={false} tickLine={false} tickFormatter={v => (v || '').slice(5)} interval={Math.max(1, Math.floor(acp.daily.length / 12))} />
                        <YAxis tick={{ fill: '#9CA3AF', fontSize: 9 }} tickFormatter={v => fmt(v)} axisLine={false} tickLine={false} width={36} />
                        <Tooltip content={<ChartTip unit=" memos" />} cursor={{ fill: 'var(--cursor-fill)' }} />
                        <Bar dataKey="memos" fill="#22C55E" radius={[3, 3, 0, 0]} barSize={6} opacity={0.6} name="Daily memos" />
                      </ComposedChart>
                    </ResponsiveContainer>
                    <div style={{ fontSize: 9, color: 'var(--text-ghost)', marginTop: 6 }}>Source: @hashed_official / Dune</div>
                  </div>
                )}
              </>
            ) : (
              <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, padding: '20px 16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                  <Skeleton height={10} style={{ width: 80 }} />
                  <Skeleton height={10} style={{ width: 60 }} />
                </div>
                <Skeleton height={28} style={{ width: 140, marginBottom: 6 }} />
                <Skeleton height={10} style={{ width: 100, marginBottom: 16 }} />
                <Skeleton height={120} />
                <div style={{ fontSize: 10, color: 'var(--text-faint)', marginTop: 12, textAlign: 'center' }}>
                  Loading from <a href="https://dune.com/hashed_official/acp-virtuals" target="_blank" rel="noopener noreferrer">Dune Analytics</a>
                </div>
              </div>
            )}
          </Sect>
        </div>

        <div className="sect-divider" />
        {/* ── Tempo / MPP ── */}
        <div className="fade" style={{ animationDelay: '.2s' }}>
          <Sect title="Tempo / MPP" badge={{ t: 'MPP', bg: 'var(--badge-yellow-bg)', c: '#D97706' }} meta="Machine Payments Protocol · Tempo L1"
            explanation="MPP is an open HTTP payment standard co-authored by Stripe and Tempo (launched March 18, 2026). Tempo is a payments-focused EVM-compatible L1 incubated by Stripe and Paradigm. Tracks on-chain stablecoin settlement events (ChannelOpened, ChannelClosed, Settled, etc.) for agent-to-service payments.">
            {tempo.totalEvents > 0 ? (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 10, marginBottom: 14 }} className="g4">
                  <Card label="Total Events" value={tempoEvts.toLocaleString()} sub="on-chain" delta={tempoDelta} deltaLabel="7d" hero />
                  <Card label="Unique Payers" value={tempo.uniquePayers} sub="agent wallets" />
                  <Card label="Unique Payees" value={tempo.uniquePayees} sub="service providers" />
                  <Card label="Protocol" value="MPP" sub="Stripe + Tempo" />
                </div>
                {tempo.byType && Object.keys(tempo.byType).length > 0 && (
                  <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, padding: '18px 16px', marginBottom: 10 }}>
                    <div style={{ fontSize: 11, fontWeight: 600, marginBottom: 14 }}>Event breakdown</div>
                    {Object.entries(tempo.byType).sort(([,a],[,b]) => b - a).map(([type, count], i) => {
                      const total = tempo.totalEvents
                      const pct = (count / total) * 100
                      const colors = ['#3B82F6', '#6366F1', '#10B981', '#F59E0B', '#A855F7', '#EC4899']
                      return (
                        <div key={type} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                          <div style={{ width: 6, height: 6, borderRadius: '50%', background: colors[i % colors.length], flexShrink: 0 }} />
                          <div className="evt-label" style={{ fontSize: 11, color: 'var(--text-sec)', width: 110, fontWeight: 500 }}>{type}</div>
                          <div style={{ flex: 1, height: 4, background: 'var(--chart-bg)', borderRadius: 2, overflow: 'hidden' }}>
                            <div style={{ width: Math.max(pct, 0.5) + '%', height: '100%', background: colors[i % colors.length], borderRadius: 2 }} />
                          </div>
                          <div style={{ fontSize: 10, color: 'var(--text-muted)', width: 36, textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{pct.toFixed(1)}%</div>
                          <div style={{ fontSize: 9, color: 'var(--text-faint)', width: 44, textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{fmt(count)}</div>
                        </div>
                      )
                    })}
                  </div>
                )}
                {tempo.daily.length > 0 && (
                  <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, padding: '18px 16px' }}>
                    <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 14 }}>Daily MPP events</div>
                    <ResponsiveContainer width="100%" height={160}>
                      <BarChart data={tempo.daily.slice(-60)} margin={{ top: 4, right: 0, bottom: 0, left: 0 }}>
                        <XAxis dataKey="day" tick={{ fill: '#9CA3AF', fontSize: 9 }} axisLine={false} tickLine={false} tickFormatter={v => (v || '').slice(5)} interval={Math.max(1, Math.floor(tempo.daily.length / 12))} />
                        <YAxis tick={{ fill: '#9CA3AF', fontSize: 9 }} tickFormatter={v => fmt(v)} axisLine={false} tickLine={false} width={36} />
                        <Tooltip content={<ChartTip unit=" events" />} cursor={{ fill: 'var(--cursor-fill)' }} />
                        <Bar dataKey="events" fill="#3B82F6" radius={[3, 3, 0, 0]} barSize={6} opacity={0.7} name="Events" />
                      </BarChart>
                    </ResponsiveContainer>
                    <div style={{ fontSize: 9, color: 'var(--text-ghost)', marginTop: 6 }}>Source: Tempo RPC indexer</div>
                  </div>
                )}
              </>
            ) : (
              <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, padding: '20px 16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                  <Skeleton height={10} style={{ width: 80 }} />
                  <Skeleton height={10} style={{ width: 60 }} />
                </div>
                <Skeleton height={28} style={{ width: 120, marginBottom: 6 }} />
                <Skeleton height={10} style={{ width: 180, marginBottom: 16 }} />
                <Skeleton height={120} />
                <div style={{ fontSize: 10, color: 'var(--text-faint)', marginTop: 12, textAlign: 'center' }}>
                  Indexer in progress via Tempo RPC · Mainnet live Mar 18, 2026
                </div>
              </div>
            )}
          </Sect>
        </div>

        <div className="sect-divider" />
        {/* ── Olas ── */}
        <div className="fade" style={{ animationDelay: '.22s' }}>
          <Sect title="Olas / Autonolas" badge={{ t: 'AUTONOMOUS', bg: 'var(--badge-green-bg)', c: '#04795B' }} meta={`${olas.chains?.length || 0} chains · Gnosis-dominant`}
            explanation="Olas is a decentralized protocol for co-owned autonomous AI agents. Agents perform on-chain tasks like trading prediction markets and executing DeFi strategies. Over 75% of Safe transactions on Gnosis Chain come from Olas agents. Tracks different contracts from all other protocols — zero overlap.">
            {olas.totalTxs > 0 ? (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 10, marginBottom: 14 }} className="g4">
                  <Card label="Total Transactions" value={olasTxs.toLocaleString()} sub="cumulative" delta={olasDelta} deltaLabel="WoW" hero />
                  <Card label="Primary Chain" value="Gnosis" sub="prediction markets" />
                </div>
                {olas.weekly?.length > 0 && (
                  <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, padding: '18px 16px', marginBottom: 10 }}>
                    <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 14 }}>Weekly transactions</div>
                    <ResponsiveContainer width="100%" height={160}>
                      <BarChart data={olas.weekly.slice(-26)} barSize={14} margin={{ top: 4, right: 0, bottom: 0, left: 0 }}>
                        <XAxis dataKey="week" tick={{ fill: '#9CA3AF', fontSize: 9 }} axisLine={false} tickLine={false} tickFormatter={v => (v || '').slice(5)} interval={Math.max(1, Math.floor(olas.weekly.slice(-26).length / 10))} />
                        <YAxis tick={{ fill: '#9CA3AF', fontSize: 9 }} tickFormatter={v => fmt(v)} axisLine={false} tickLine={false} width={36} />
                        <Tooltip content={<ChartTip unit=" txs" />} cursor={{ fill: 'var(--cursor-fill)' }} />
                        <Bar dataKey="txs" fill="#04795B" radius={[3, 3, 0, 0]} opacity={0.7} name="Weekly txs" />
                      </BarChart>
                    </ResponsiveContainer>
                    <div style={{ fontSize: 9, color: 'var(--text-ghost)', marginTop: 6 }}>Source: @adrian0x / Dune</div>
                  </div>
                )}
                {olas.chains?.length > 1 && (() => {
                  const total = olas.chains.reduce((s, ch) => s + ch.txs, 0)
                  const top = olas.chains[0]
                  const rest = olas.chains.slice(1, 6)
                  const restMax = rest.length > 0 ? rest[0].txs : 1
                  const topPct = total > 0 ? (top.txs / total) * 100 : 0
                  const colors = ['#FF0420', '#8247E5', '#0052FF', '#627EEA', '#35D07F']
                  return (
                    <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, padding: '18px 16px' }}>
                      <div style={{ fontSize: 11, fontWeight: 600, marginBottom: 14 }}>Chain distribution</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14, padding: '10px 12px', background: 'var(--chart-bg)', borderRadius: 8 }}>
                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#04795B', flexShrink: 0 }} />
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-sec)' }}>{top.name}</div>
                          <div style={{ fontSize: 10, color: 'var(--text-faint)' }}>{topPct.toFixed(1)}% · {fmt(top.txs)} txs</div>
                        </div>
                        <div style={{ width: 60, height: 4, background: 'var(--border)', borderRadius: 2, overflow: 'hidden' }}>
                          <div style={{ width: topPct + '%', height: '100%', background: '#04795B', borderRadius: 2 }} />
                        </div>
                      </div>
                      {rest.map((c, i) => {
                        const pct = total > 0 ? (c.txs / total) * 100 : 0
                        const barPct = restMax > 0 ? (c.txs / restMax) * 100 : 0
                        return (
                          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                            <div style={{ width: 6, height: 6, borderRadius: '50%', background: colors[i % colors.length], flexShrink: 0 }} />
                            <div className="chain-label" style={{ fontSize: 11, color: 'var(--text-sec)', width: 64, fontWeight: 500 }}>{c.name}</div>
                            <div style={{ flex: 1, height: 4, background: 'var(--chart-bg)', borderRadius: 2, overflow: 'hidden' }}>
                              <div style={{ width: Math.max(barPct, 1) + '%', height: '100%', background: colors[i % colors.length], borderRadius: 2 }} />
                            </div>
                            <div style={{ fontSize: 10, color: 'var(--text-muted)', width: 36, textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{pct.toFixed(1)}%</div>
                            <div style={{ fontSize: 9, color: 'var(--text-faint)', width: 44, textAlign: 'right' }}>{fmt(c.txs)}</div>
                          </div>
                        )
                      })}
                    </div>
                  )
                })()}
              </>
            ) : (
              <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, padding: '20px 16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                  <Skeleton height={10} style={{ width: 80 }} />
                  <Skeleton height={10} style={{ width: 60 }} />
                </div>
                <Skeleton height={28} style={{ width: 160, marginBottom: 6 }} />
                <Skeleton height={10} style={{ width: 100, marginBottom: 16 }} />
                <Skeleton height={120} />
                <div style={{ fontSize: 10, color: 'var(--text-faint)', marginTop: 12, textAlign: 'center' }}>
                  Loading from <a href="https://dune.com/adrian0x/autonolas-ecosystem-activity" target="_blank" rel="noopener noreferrer">Dune Analytics</a>
                </div>
              </div>
            )}
          </Sect>
        </div>

        {/* ── METHODOLOGY ── */}
        <div id="methodology" className="fade" style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, padding: '20px 18px', animationDelay: '.25s' }}>
          <div style={{ fontSize: 10, color: 'var(--text-faint)', letterSpacing: '.1em', fontWeight: 600, textTransform: 'uppercase', marginBottom: 16 }}>Methodology</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }} className="mg">
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-sec)', marginBottom: 6 }}>What we track</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', lineHeight: 1.7 }}>
                On-chain events from verified agent contracts. x402 settlements, ERC-8004 registry interactions and agent registrations, Virtuals ACP job memos, Tempo/MPP channel events, and Olas autonomous agent transactions. Each protocol tracks different contracts with zero overlap.
              </div>
            </div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-sec)', marginBottom: 6 }}>Data sources</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', lineHeight: 1.7 }}>
                <a href="https://dune.com/thechriscen/x402-payment-analytics" target="_blank" rel="noopener noreferrer">@thechriscen · x402 Payment Analytics</a><br />
                <a href="https://dune.com/hashed_official/x402-analytics" target="_blank" rel="noopener noreferrer">@hashed_official · x402 + Virtuals ACP</a><br />
                <a href="https://dune.com/ax1research/base-agentic-ecosystem" target="_blank" rel="noopener noreferrer">@ax1research · BASE Agentic Ecosystem</a><br />
                <a href="https://dune.com/hashed_official/erc8004" target="_blank" rel="noopener noreferrer">@hashed_official · ERC-8004 Registry</a><br />
                <a href="https://dune.com/adrian0x/autonolas-ecosystem-activity" target="_blank" rel="noopener noreferrer">@adrian0x · Olas Ecosystem</a><br />
                Tempo RPC indexer
              </div>
            </div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-sec)', marginBottom: 6 }}>Limitations</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', lineHeight: 1.7 }}>
                Raw counts include ecosystem testing, self-dealing, and infrastructure activity. Genuine commerce is a subset of totals. Off-chain payments (Google UCP, Visa TAP) not tracked.
              </div>
            </div>
          </div>
          <div style={{ marginTop: 18, paddingTop: 14, borderTop: '1px solid var(--border-light)', fontSize: 10, color: 'var(--text-ghost)' }}>
            Data refreshes every 6 hours
          </div>
        </div>

        {/* ── FAQ ── */}
        <div className="fade" style={{ marginTop: 24, animationDelay: '.3s' }}>
          <div style={{ fontSize: 10, color: 'var(--text-faint)', letterSpacing: '.1em', fontWeight: 600, textTransform: 'uppercase', marginBottom: 14 }}>Frequently asked questions</div>
          {[
            ['What is the agent economy?', 'The agent economy (or agentic economy) refers to the emerging ecosystem where AI agents autonomously transact, pay for services, and settle payments on-chain. It encompasses protocols like x402 (HTTP-native payments), ERC-8004 (agent identity), ERC-8183 (agent-to-agent commerce), MPP (machine payment protocol by Stripe and Tempo), and Olas (autonomous agent network).'],
            ['What does agenteconomy.to track?', 'agenteconomy.to is a free, real-time dashboard that tracks on-chain events from AI agent protocols across 11+ blockchains including Base, Solana, Gnosis, Polygon, Ethereum, and Tempo. It aggregates data from x402 settlements, ERC-8004 agent registrations, Virtuals ACP job memos, Tempo MPP channel events, and Olas autonomous agent transactions. Data refreshes every 6 hours.'],
            ['What is the x402 payment protocol?', 'x402 is an open HTTP payment standard by Coinbase that uses the HTTP 402 status code. It enables AI agents to pay for API resources per request using stablecoins. Foundation members include Google, Visa, AWS, Circle, Anthropic, and Vercel. x402 is the dominant agent payment standard by transaction volume.'],
            ['How is the data collected?', 'All data comes from verified on-chain smart contracts. Sources include Dune Analytics community queries and direct RPC indexers. Raw counts include ecosystem testing and infrastructure activity — genuine commerce is a subset of totals. Off-chain payments (Google UCP, Visa TAP) are not tracked.'],
          ].map(([q, a], i) => (
            <details key={i} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8, padding: '12px 16px', marginBottom: 6, cursor: 'pointer' }}>
              <summary style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-sec)', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                {q}
                <span style={{ fontSize: 10, color: 'var(--text-faint)', flexShrink: 0, marginLeft: 8 }}>+</span>
              </summary>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', lineHeight: 1.7, marginTop: 10, paddingTop: 10, borderTop: '1px solid var(--border-light)' }}>{a}</div>
            </details>
          ))}
        </div>

      </div>

      {/* FOOTER */}
      <footer style={{ borderTop: '1px solid var(--border)', background: 'var(--surface)' }}>
        <div className="footer-inner" style={{ maxWidth: 1160, margin: '0 auto', padding: '18px 24px', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 18 }}>
          <a href="https://github.com/realdora/agenteconomy/issues/new?template=data-source.yml" target="_blank" rel="noopener noreferrer" className="footer-link" style={{ fontSize: 10, fontWeight: 500, letterSpacing: '.06em' }}>
            Submit a data source
          </a>
          <a href="https://x.com/realdora_eth" target="_blank" rel="noopener noreferrer" className="footer-link" style={{ display: 'inline-flex' }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
          </a>
        </div>
      </footer>
    </div>
  )
}
