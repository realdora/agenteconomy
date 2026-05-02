import { useEffect, useMemo, useState } from 'react'
import {
  Bar,
  BarChart,
  Cell,
  ComposedChart,
  Line,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { FB, SOURCES } from './data'
import {
  BLUE,
  BLUE_L,
  GREEN,
  addMA,
  calcDelta,
  computeTotals,
  fmt,
  fmtMoney,
  getFreshness,
  normalizeData,
  safeColor,
  shortDate,
} from './utils'

function useReducedMotion() {
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    const query = window.matchMedia?.('(prefers-reduced-motion: reduce)')
    if (!query) return
    const update = () => setReduced(query.matches)
    update()
    query.addEventListener?.('change', update)
    return () => query.removeEventListener?.('change', update)
  }, [])

  return reduced
}

function useCountUp(target, dur = 1400) {
  const reduced = useReducedMotion()
  const [v, setV] = useState(reduced ? target : 0)

  useEffect(() => {
    if (reduced) {
      setV(target || 0)
      return
    }
    if (!target) {
      setV(0)
      return
    }
    let start = null
    let id
    const step = t => {
      if (!start) start = t
      const p = Math.min((t - start) / dur, 1)
      setV(Math.floor((1 - Math.pow(1 - p, 3)) * target))
      if (p < 1) id = requestAnimationFrame(step)
    }
    id = requestAnimationFrame(step)
    return () => cancelAnimationFrame(id)
  }, [target, dur, reduced])

  return v
}

function useDashboardData() {
  const [data, setData] = useState(FB)
  const [loadState, setLoadState] = useState('loading')

  useEffect(() => {
    let alive = true
    fetch('/data.json', { cache: 'no-store' })
      .then(r => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`)
        return r.json()
      })
      .then(d => {
        if (!alive) return
        setData(normalizeData(FB, d))
        setLoadState('loaded')
      })
      .catch(() => {
        if (!alive) return
        setData(FB)
        setLoadState('fallback')
      })
    return () => {
      alive = false
    }
  }, [])

  return { data, loadState }
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
    { top: 0, dur: '2.8s', delay: '1.4s', color: BLUE_L, w: 16 },
    { top: 0, dur: '3.6s', delay: '2.6s', color: BLUE, w: 20 },
    { top: 10, dur: '3.4s', delay: '0.5s', color: GREEN, w: 20, reverse: true },
    { top: 10, dur: '2.6s', delay: '2.0s', color: '#86EFAC', w: 14, reverse: true },
    { top: 10, dur: '3.8s', delay: '3.2s', color: GREEN, w: 22, reverse: true },
  ]
  return (
    <div className="flow-lines" aria-hidden="true">
      {[0, 10].map(y => <div key={y} className="flow-base" style={{ top: y }} />)}
      {packets.map((p, i) => (
        <div
          key={i}
          className="packet"
          style={{
            top: p.top,
            width: p.w,
            background: p.color,
            animation: `${p.reverse ? 'packetR' : 'packet'} ${p.dur} ${p.delay} linear infinite`,
            boxShadow: `0 0 6px ${p.color}60`,
          }}
        />
      ))}
    </div>
  )
}

function Delta({ value, label }) {
  if (value == null) return null
  const n = parseFloat(value)
  const up = n >= 0
  return (
    <span className={`delta ${up ? '' : 'down'}`} aria-label={`${up ? 'up' : 'down'} ${Math.abs(n)} percent ${label || ''}`}>
      <span aria-hidden="true">{up ? '▲' : '▼'}</span>
      {Math.abs(n)}%
      {label && <span style={{ color: 'var(--text-muted)', fontWeight: 500, marginLeft: 2 }}>{label}</span>}
    </span>
  )
}

function Card({ label, value, sub, accent, delta, deltaLabel, hero }) {
  return (
    <div className="card">
      <div className="card-label">{label}</div>
      <div className={`card-value ${hero ? 'hero-card' : ''}`} style={{ color: accent || 'var(--text)' }}>{value}</div>
      <div className="card-sub">
        <span>{sub}</span>
        <Delta value={delta} label={deltaLabel} />
      </div>
    </div>
  )
}

function Section({ title, badge, meta, explanation, children }) {
  const [open, setOpen] = useState(false)
  const panelId = `${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-info`
  return (
    <section className="section">
      <div className="section-head">
        <h2 className="section-title">{title}</h2>
        {badge && <span className="badge" style={{ color: badge.c, background: badge.bg }}>{badge.t}</span>}
        <span style={{ width: 1, height: 12, background: 'var(--border)' }} />
        <span className="meta">{meta}</span>
        <button className="info-btn" type="button" aria-expanded={open} aria-controls={panelId} onClick={() => setOpen(o => !o)}>
          {open ? 'hide' : 'what is this?'}
        </button>
      </div>
      {open && <div className="info-panel" id={panelId}>{explanation}</div>}
      {children}
    </section>
  )
}

function ChartTip({ active, payload, label, isMoney, unit }) {
  if (!active || !payload?.length) return null
  return (
    <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8, padding: '8px 12px', boxShadow: '0 4px 12px var(--shadow)' }}>
      <div style={{ color: 'var(--text-muted)', marginBottom: 3, fontSize: 11 }}>{label}</div>
      {payload.filter(p => p.value > 0).map((p, i) => (
        <div key={i} style={{ color: p.color || 'var(--text)', fontWeight: 700, fontSize: 12 }}>
          {p.dataKey === 'ma' ? '7d avg: ' : ''}
          {p.name || p.dataKey}: {isMoney || p.dataKey === 'vol' ? '$' : ''}{fmt(p.value)}{unit || ''}
        </div>
      ))}
    </div>
  )
}

function SourceLinks({ sources }) {
  return (
    <div className="source-row">
      <span>Source:</span>
      {sources.map((s, i) => (
        <a key={s.href} href={s.href} target={s.href.startsWith('/') ? undefined : '_blank'} rel={s.href.startsWith('/') ? undefined : 'noopener noreferrer'}>
          {s.label}{i < sources.length - 1 ? ',' : ''}
        </a>
      ))}
    </div>
  )
}

function EmptyState({ title, children, sourceKey }) {
  return (
    <div className="empty">
      <strong style={{ color: 'var(--text-sec)' }}>{title}</strong>
      <div>{children}</div>
      {sourceKey && <SourceLinks sources={SOURCES[sourceKey]} />}
    </div>
  )
}

function BarRows({ rows, total, valueKey = 'txs', colors }) {
  return rows.map((row, i) => {
    const value = row[valueKey] || 0
    const pct = total > 0 ? (value / total) * 100 : 0
    const color = safeColor(row.color || colors?.[i % colors.length] || '#9CA3AF')
    return (
      <div className="bar-row" key={`${row.name}-${i}`}>
        <div className="dot" style={{ background: color }} />
        <div className="bar-label" title={row.name}>{row.name}</div>
        <div className="bar-track">
          <div className="bar-fill" style={{ width: `${Math.max(pct, 0.5)}%`, background: color }} />
        </div>
        <div className="bar-pct">{pct.toFixed(1)}%</div>
        <div className="bar-count">{fmt(value)}</div>
      </div>
    )
  })
}

function X402Section({ x, xTxs, xVol }) {
  const [tf, setTf] = useState('month')
  const [met, setMet] = useState('txs')
  const totalChain = x.chains.reduce((s, c) => s + c.txs, 0)
  const x402d7 = calcDelta(x.daily, 'txs', 7)

  const chartData = useMemo(() => {
    if (tf === 'day') return addMA(x.daily, 'txs', 7).map(d => ({ label: d.day.slice(5), txs: d.txs, ma: d.ma }))
    return x.monthly.map((d, i, arr) => {
      const prev = arr[i - 1]?.txs
      return { label: d.month, txs: d.txs, vol: d.vol, mom: prev ? ((d.txs - prev) / prev * 100).toFixed(1) : null }
    })
  }, [tf, x.daily, x.monthly])

  return (
    <Section
      title="x402 Protocol"
      badge={{ t: 'DOMINANT', bg: 'var(--badge-blue-bg)', c: BLUE }}
      meta={`${x.facilitatorsTracked} facilitators · ${x.chainsTracked} chains`}
      explanation="x402 is an open HTTP payment standard using HTTP 402 responses for per-request stablecoin payments. The chart below separates activity trend, facilitator share, and chain concentration."
    >
      <div className="grid g4" style={{ marginBottom: 14 }}>
        <Card label="Total Events" value={xTxs.toLocaleString()} sub="all-time" delta={x402d7} deltaLabel="7d" hero />
        <Card label="Total Volume" value={`$${xVol.toLocaleString()}`} sub="USD processed" accent={GREEN} />
        <Card label="Facilitators" value={x.facilitatorsTracked} sub="active" />
        <Card label="Chains" value={x.chainsTracked} sub="EVM + Solana" />
      </div>

      <div className="panel chart-panel">
        <div className="chart-head">
          <div className="panel-title" style={{ marginBottom: 0 }}>{met === 'txs' ? 'Transaction' : 'USD'} volume</div>
          <div className="button-row" role="group" aria-label="Chart controls">
            <div className="segmented">
              {['month', 'day'].map(t => (
                <button key={t} className={`tab-btn ${tf === t ? 'active' : ''}`} type="button" onClick={() => setTf(t)}>
                  {t === 'month' ? 'Month' : 'Day'}
                </button>
              ))}
            </div>
            {tf === 'month' && (
              <div className="segmented">
                {[
                  ['txs', 'Txs'],
                  ['vol', 'Vol ($)'],
                ].map(([t, l]) => (
                  <button key={t} className={`tab-btn ${met === t ? 'active' : ''}`} type="button" onClick={() => setMet(t)}>
                    {l}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="chart-wrap">
          <ResponsiveContainer width="100%" height="100%">
            {tf === 'day' && chartData.length > 0 ? (
              <ComposedChart data={chartData} margin={{ top: 4, right: 0, bottom: 0, left: 0 }}>
                <XAxis dataKey="label" tick={{ fill: '#9CA3AF', fontSize: 9 }} axisLine={false} tickLine={false} interval={Math.max(1, Math.floor(chartData.length / 10))} />
                <YAxis tick={{ fill: '#9CA3AF', fontSize: 9 }} tickFormatter={v => fmt(v)} axisLine={false} tickLine={false} width={36} />
                <Tooltip content={<ChartTip unit=" txs" />} cursor={{ fill: 'var(--cursor-fill)' }} />
                <Bar dataKey="txs" fill={BLUE_L} radius={[3, 3, 0, 0]} barSize={8} name="Daily" />
                <Line type="monotone" dataKey="ma" stroke={BLUE} strokeWidth={2} dot={false} name="7d avg" />
              </ComposedChart>
            ) : (
              <ComposedChart data={chartData} margin={{ top: 4, right: 0, bottom: 0, left: 0 }}>
                <XAxis dataKey="label" tick={{ fill: '#9CA3AF', fontSize: 10 }} axisLine={false} tickLine={false} interval={0} />
                <YAxis tick={{ fill: '#9CA3AF', fontSize: 9 }} tickFormatter={v => fmt(v)} axisLine={false} tickLine={false} width={36} />
                <Tooltip content={<ChartTip isMoney={met === 'vol'} />} cursor={{ fill: 'var(--cursor-fill)' }} />
                <Bar dataKey={met} name={met === 'txs' ? 'Txs' : 'USD'} radius={[4, 4, 0, 0]}>
                  {chartData.map((_, i) => <Cell key={i} fill={met === 'vol' ? GREEN : BLUE} fillOpacity={0.35 + (i / Math.max(chartData.length, 1)) * 0.65} />)}
                </Bar>
                {met === 'txs' && <Line type="monotone" dataKey="vol" yAxisId={0} stroke={GREEN} strokeWidth={1.5} dot={false} opacity={0.45} name="USD context" />}
              </ComposedChart>
            )}
          </ResponsiveContainer>
        </div>
        <SourceLinks sources={SOURCES.x402} />
      </div>

      <div className="grid g2">
        <div className="panel">
          <div className="panel-title">Chain distribution</div>
          <BarRows rows={x.chains} total={totalChain} />
        </div>
        <div className="panel">
          <div className="panel-title">Facilitator share</div>
          <div className="pie-wrap">
            <PieChart width={108} height={108} style={{ flexShrink: 0 }}>
              <Pie data={x.protocols} dataKey="share" nameKey="name" cx={52} cy={52} innerRadius={28} outerRadius={52} strokeWidth={2} stroke="var(--pie-stroke)">
                {x.protocols.map((p, i) => <Cell key={i} fill={safeColor(p.color)} />)}
              </Pie>
              <Tooltip content={({ active, payload }) => {
                if (!active || !payload?.length) return null
                const d = payload[0]
                return (
                  <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8, padding: '6px 10px', boxShadow: '0 4px 12px var(--shadow)', fontSize: 11 }}>
                    <strong>{d.name}</strong><span style={{ color: 'var(--text-muted)', marginLeft: 6 }}>{d.value}%</span>
                  </div>
                )
              }} />
            </PieChart>
            <div className="legend">
              {x.protocols.map((p, i) => (
                <div className="bar-row" key={`${p.name}-${i}`}>
                  <div className="dot" style={{ borderRadius: 2, background: safeColor(p.color) }} />
                  <div className="bar-label" style={{ flex: 1, width: 'auto' }}>{p.name}</div>
                  <div className="bar-pct" style={{ width: 44, fontWeight: 800 }}>{p.share}%</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Section>
  )
}

function ProtocolComparison({ data, totals }) {
  const rows = [
    { protocol: 'x402', role: 'HTTP-native agent payments', events: data.x402.totalTxs, volume: data.x402.totalVolume, chains: data.x402.chainsTracked, source: SOURCES.x402[0] },
    { protocol: 'ERC-8004', role: 'Agent identity + reputation', events: data.baseAgentic.totalTxs, agents: data.erc8004Registry.totalAgents, chains: data.erc8004Registry.chainsTracked, source: SOURCES.erc8004[1] },
    { protocol: 'Virtuals ACP', role: 'Agent-to-agent commerce', events: data.virtualsAcp.totalMemos, volume: null, chains: 1, source: SOURCES.acp[0] },
    { protocol: 'Tempo / MPP', role: 'Machine payment channels', events: data.tempoMpp.totalEvents, volume: null, chains: 1, source: SOURCES.tempo[0] },
    { protocol: 'Olas', role: 'Autonomous agent transactions', events: data.olas.totalTxs, volume: null, chains: data.olas.chains?.length || 0, source: SOURCES.olas[0] },
  ]

  return (
    <Section
      title="Protocol Comparison"
      badge={{ t: 'OVERVIEW', bg: 'var(--badge-blue-bg)', c: BLUE }}
      meta={`${fmt(totals.combinedEvents)} aggregate events`}
      explanation="A compact comparison of the tracked protocols, their event counts, tracked chains, and source links. Registered agents are shown separately because identity registration is not a payment event."
    >
      <div className="comparison">
        <table>
          <thead>
            <tr>
              <th>Protocol</th>
              <th>Role</th>
              <th>Events</th>
              <th>Volume</th>
              <th>Chains</th>
              <th>Source</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(row => (
              <tr key={row.protocol}>
                <td><strong>{row.protocol}</strong>{row.agents ? <div style={{ color: 'var(--text-faint)' }}>{fmt(row.agents)} agents</div> : null}</td>
                <td>{row.role}</td>
                <td>{row.events ? fmt(row.events) : 'Pending'}</td>
                <td>{row.volume ? fmtMoney(row.volume) : 'N/A'}</td>
                <td>{row.chains || 'N/A'}</td>
                <td><a href={row.source.href} target={row.source.href.startsWith('/') ? undefined : '_blank'} rel={row.source.href.startsWith('/') ? undefined : 'noopener noreferrer'}>{row.source.label}</a></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Section>
  )
}

function RegistrySection({ ag, erc8004Reg, agTxs, regAgents }) {
  const agDelta = calcDelta(ag.daily, 'total', 1)
  const colors = ['#F0B90B', '#627EEA', '#0052FF', '#FF6B35', '#836EF9', '#35D07F', '#04795B', '#FF4D6A']
  return (
    <Section
      title="ERC-8004"
      badge={{ t: 'IDENTITY', bg: 'var(--badge-purple-bg)', c: '#7C3AED' }}
      meta={`Agent identity · ${erc8004Reg.chainsTracked || 1}+ chains`}
      explanation="ERC-8004 provides agent identity and reputation primitives. Base activity and multi-chain registry data are shown separately to keep transactions and agent registrations distinct."
    >
      <div className="grid g4" style={{ marginBottom: 14 }}>
        <Card label="Base Events (YTD)" value={agTxs.toLocaleString()} sub="agentic transactions" delta={agDelta} deltaLabel="WoW" hero />
        <Card label="Registered Agents" value={regAgents.toLocaleString()} sub="all chains" accent="#7C3AED" />
        <Card label="Registry Chains" value={erc8004Reg.chainsTracked || 0} sub="mainnets" />
        <Card label="Standard" value="ERC-8004" sub="Identity + reputation" />
      </div>
      <div className="grid g2">
        {ag.daily.length > 0 ? (
          <div className="panel chart-panel">
            <div className="panel-title">Agentic events</div>
            <div className="chart-wrap" style={{ height: 170 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={ag.daily} barSize={Math.max(4, Math.min(14, 600 / ag.daily.length))}>
                  <XAxis dataKey="day" tick={{ fill: '#9CA3AF', fontSize: 9 }} axisLine={false} tickLine={false} tickFormatter={v => (v || '').slice(5)} interval={Math.max(1, Math.floor(ag.daily.length / 10))} />
                  <YAxis tick={{ fill: '#9CA3AF', fontSize: 9 }} tickFormatter={v => fmt(v)} axisLine={false} tickLine={false} width={36} />
                  <Tooltip content={<ChartTip />} cursor={{ fill: 'var(--cursor-fill)' }} />
                  <Bar dataKey="infrastructure" stackId="a" fill="#6366F1" name="Infrastructure" />
                  <Bar dataKey="consumer" stackId="a" fill="#10B981" radius={[2, 2, 0, 0]} name="Consumer" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <SourceLinks sources={[SOURCES.erc8004[0]]} />
          </div>
        ) : (
          <EmptyState title="No daily events loaded" sourceKey="erc8004">The registry totals are available, but the Base daily breakdown is not present in the current JSON.</EmptyState>
        )}
        {erc8004Reg.chains.length > 0 ? (
          <div className="panel">
            <div className="panel-title">Agent registrations by chain</div>
            <BarRows rows={erc8004Reg.chains.slice(0, 8)} total={erc8004Reg.totalAgents} valueKey="agents" colors={colors} />
            <SourceLinks sources={[SOURCES.erc8004[1]]} />
          </div>
        ) : (
          <EmptyState title="Registry chain data unavailable" sourceKey="erc8004">The app will show chain distribution after the Dune registry query returns rows.</EmptyState>
        )}
      </div>
    </Section>
  )
}

function SimpleProtocolSection({ kind, title, badge, meta, explanation, totalLabel, totalValue, totalDisplay, delta, cards, chartTitle, chartData, chartKey, barColor, sourceKey, emptyText, unit }) {
  return (
    <Section title={title} badge={badge} meta={meta} explanation={explanation}>
      {totalValue > 0 ? (
        <>
          <div className="grid g4" style={{ marginBottom: 14 }}>
            <Card label={totalLabel} value={totalDisplay} sub="cumulative" delta={delta} deltaLabel={kind === 'olas' ? 'WoW' : '7d'} hero />
            {cards.map(card => <Card key={card.label} {...card} />)}
          </div>
          {chartData?.length > 0 && (
            <div className="panel chart-panel">
              <div className="panel-title">{chartTitle}</div>
              <div className="chart-wrap" style={{ height: 170 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData.slice(-60)} margin={{ top: 4, right: 0, bottom: 0, left: 0 }}>
                    <XAxis dataKey={kind === 'olas' ? 'week' : 'day'} tick={{ fill: '#9CA3AF', fontSize: 9 }} axisLine={false} tickLine={false} tickFormatter={v => (v || '').slice(5)} interval={Math.max(1, Math.floor(chartData.length / 12))} />
                    <YAxis tick={{ fill: '#9CA3AF', fontSize: 9 }} tickFormatter={v => fmt(v)} axisLine={false} tickLine={false} width={36} />
                    <Tooltip content={<ChartTip unit={unit} />} cursor={{ fill: 'var(--cursor-fill)' }} />
                    <Bar dataKey={chartKey} fill={barColor} radius={[3, 3, 0, 0]} barSize={kind === 'olas' ? 14 : 6} opacity={0.72} name={chartTitle} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <SourceLinks sources={SOURCES[sourceKey]} />
            </div>
          )}
        </>
      ) : (
        <EmptyState title={`${title} data not indexed yet`} sourceKey={sourceKey}>{emptyText}</EmptyState>
      )}
    </Section>
  )
}

function OlasChainPanel({ olas }) {
  if (!olas.chains?.length) return null
  const total = olas.chains.reduce((s, ch) => s + ch.txs, 0)
  return (
    <div className="panel" style={{ marginTop: 10 }}>
      <div className="panel-title">Olas chain distribution</div>
      <BarRows rows={olas.chains.slice(0, 8)} total={total} />
      <SourceLinks sources={SOURCES.olas} />
    </div>
  )
}

export default function App() {
  const { data, loadState } = useDashboardData()
  const [dark, setDark] = useState(() => {
    try {
      const saved = localStorage.getItem('ae-theme')
      if (saved) return saved === 'dark'
    } catch {}
    const h = new Date().getHours()
    return h < 6 || h >= 18
  })

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light')
  }, [dark])

  const toggleTheme = () => setDark(d => {
    const next = !d
    try { localStorage.setItem('ae-theme', next ? 'dark' : 'light') } catch {}
    return next
  })

  const x = data.x402
  const ag = data.baseAgentic
  const acp = data.virtualsAcp || FB.virtualsAcp
  const tempo = data.tempoMpp || FB.tempoMpp
  const erc8004Reg = data.erc8004Registry || FB.erc8004Registry
  const olas = data.olas || FB.olas
  const totals = computeTotals(data)
  const freshness = getFreshness(data.updatedAt, loadState)

  const cEvents = useCountUp(totals.combinedEvents)
  const cVol = useCountUp(totals.combinedVol)
  const xTxs = useCountUp(x.totalTxs)
  const xVol = useCountUp(x.totalVolume)
  const agTxs = useCountUp(ag.totalTxs)
  const acpMemos = useCountUp(acp.totalMemos || 0)
  const tempoEvts = useCountUp(tempo.totalEvents || 0)
  const regAgents = useCountUp(totals.registeredAgents || 0)
  const olasTxs = useCountUp(olas.totalTxs || 0)

  return (
    <div className="app">
      <nav className="nav">
        <div className="nav-inner">
          <div className="brand-row">
            <span className="brand">agenteconomy.to</span>
            <span className="live-pill"><LiveDot />LIVE</span>
            <button className="theme-btn" type="button" onClick={toggleTheme} aria-label={dark ? 'Switch to light theme' : 'Switch to dark theme'}>
              {dark ? (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" /></svg>
              ) : (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" /><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" /><line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" /></svg>
              )}
            </button>
          </div>
          <div className="nav-meta">
            <span className={`status-pill ${freshness.tone === 'warn' ? 'warn' : ''}`}>{freshness.label}</span>
            <span>Updated {shortDate(data.updatedAt)}</span>
            <a href="#methodology">Methodology</a>
          </div>
        </div>
        <div className="mob-meta">
          <span className={`status-pill ${freshness.tone === 'warn' ? 'warn' : ''}`}>{freshness.label}</span>
          <span className="mobile-date">{shortDate(data.updatedAt)}</span>
        </div>
      </nav>

      <main className="shell">
        <section className="hero fade">
          <h1 className="hero-title">Tracking the<br />agentic economy.</h1>
          <div className="eyebrow">On-chain events tracked</div>
          <div className="hero-num">{cEvents.toLocaleString()}</div>
          <FlowLines />
          <div className="hero-row">
            {[
              { value: `$${cVol.toLocaleString()}`, label: 'USD settled', color: GREEN },
              { value: fmt(regAgents), label: 'agents registered', color: '#7C3AED' },
              { value: totals.protocols, label: 'protocols', color: 'var(--text-strong)' },
              { value: totals.chains, label: 'chains', color: 'var(--text-strong)' },
            ].map((item, i) => (
              <div className="hero-cell" key={i}>
                <div className="hero-sub" style={{ color: item.color }}>{item.value}</div>
                <div className="hero-label">{item.label}</div>
              </div>
            ))}
          </div>
          <div className="quick-actions">
            <a className="action-link" href="/data.json">Raw JSON</a>
            <a className="action-link" href="/tempo-data.json">Tempo data</a>
            <a className="action-link" href="https://github.com/realdora/agenteconomy" target="_blank" rel="noopener noreferrer">GitHub</a>
            <a className="action-link" href="#comparison">Compare protocols</a>
          </div>
        </section>

        <div id="comparison">
          <ProtocolComparison data={data} totals={totals} />
        </div>

        <X402Section x={x} xTxs={xTxs} xVol={xVol} />

        <RegistrySection ag={ag} erc8004Reg={erc8004Reg} agTxs={agTxs} regAgents={regAgents} />

        <SimpleProtocolSection
          kind="acp"
          title="Virtuals ACP"
          badge={{ t: 'ERC-8183', bg: 'var(--badge-green-bg)', c: GREEN }}
          meta="Agent Commerce · Base"
          explanation="ERC-8183 enables trustless agent-to-agent commerce with escrowed payments and evaluator verification. ACP tracks job lifecycle memos across create, deliver, evaluate, and settle."
          totalLabel="Total Memos"
          totalValue={acp.totalMemos || 0}
          totalDisplay={acpMemos.toLocaleString()}
          delta={calcDelta(acp.daily, 'memos', 7)}
          cards={[{ label: 'Standard', value: 'ERC-8183', sub: 'Agent commerce layer' }]}
          chartTitle="Daily ACP memos"
          chartData={acp.daily}
          chartKey="memos"
          barColor="#22C55E"
          sourceKey="acp"
          emptyText="The Dune query is linked below; the UI now treats missing rows as an indexed-data gap rather than a loading spinner."
          unit=" memos"
        />

        <SimpleProtocolSection
          kind="tempo"
          title="Tempo / MPP"
          badge={{ t: 'MPP', bg: 'var(--badge-yellow-bg)', c: '#D97706' }}
          meta="Machine Payments Protocol · Tempo L1"
          explanation="MPP is an open HTTP payment standard co-authored by Stripe and Tempo. This section tracks on-chain channel and settlement events when the indexer has rows."
          totalLabel="Total Events"
          totalValue={tempo.totalEvents || 0}
          totalDisplay={tempoEvts.toLocaleString()}
          delta={calcDelta(tempo.daily, 'events', 7)}
          cards={[
            { label: 'Unique Payers', value: tempo.uniquePayers || 0, sub: 'agent wallets' },
            { label: 'Unique Payees', value: tempo.uniquePayees || 0, sub: 'service providers' },
            { label: 'Protocol', value: 'MPP', sub: 'Stripe + Tempo' },
          ]}
          chartTitle="Daily MPP events"
          chartData={tempo.daily}
          chartKey="events"
          barColor={BLUE}
          sourceKey="tempo"
          emptyText="Tempo RPC indexing is not returning live rows in the current dataset. The raw endpoint is still exposed for verification."
          unit=" events"
        />

        {tempo.totalEvents > 0 && Object.keys(tempo.byType || {}).length > 0 && (
          <div className="panel" style={{ marginTop: -22, marginBottom: 32 }}>
            <div className="panel-title">Tempo event breakdown</div>
            <BarRows rows={Object.entries(tempo.byType).sort(([, a], [, b]) => b - a).map(([name, events]) => ({ name, events }))} total={tempo.totalEvents} valueKey="events" />
          </div>
        )}

        <SimpleProtocolSection
          kind="olas"
          title="Olas / Autonolas"
          badge={{ t: 'AUTONOMOUS', bg: 'var(--badge-green-bg)', c: '#04795B' }}
          meta={`${olas.chains?.length || 0} chains · Gnosis-dominant`}
          explanation="Olas is a decentralized protocol for co-owned autonomous AI agents. It tracks a separate family of autonomous agent transactions from the other standards."
          totalLabel="Total Transactions"
          totalValue={olas.totalTxs || 0}
          totalDisplay={olasTxs.toLocaleString()}
          delta={calcDelta(olas.weekly, 'txs', 1)}
          cards={[{ label: 'Primary Chain', value: 'Gnosis', sub: 'prediction markets' }]}
          chartTitle="Weekly transactions"
          chartData={olas.weekly}
          chartKey="txs"
          barColor="#04795B"
          sourceKey="olas"
          emptyText="The Olas Dune query did not return rows for the current JSON. Source is linked for manual inspection."
          unit=" txs"
        />
        <OlasChainPanel olas={olas} />

        <section id="methodology" className="panel fade" style={{ animationDelay: '.25s' }}>
          <div className="section-title" style={{ marginBottom: 16 }}>Methodology</div>
          <div className="method-grid">
            <div>
              <div className="panel-title">What we track</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', lineHeight: 1.7 }}>
                On-chain events from verified agent contracts: x402 settlements, ERC-8004 registry activity and registrations, Virtuals ACP job memos, Tempo/MPP channel events, and Olas autonomous agent transactions.
              </div>
            </div>
            <div>
              <div className="panel-title">Data sources</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', lineHeight: 1.7 }}>
                {[...SOURCES.x402, ...SOURCES.erc8004, ...SOURCES.acp, ...SOURCES.olas, ...SOURCES.tempo].map(s => (
                  <div key={s.href}><a href={s.href} target={s.href.startsWith('/') ? undefined : '_blank'} rel={s.href.startsWith('/') ? undefined : 'noopener noreferrer'}>{s.label}</a></div>
                ))}
              </div>
            </div>
            <div>
              <div className="panel-title">Limitations</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', lineHeight: 1.7 }}>
                Raw counts include testing, self-dealing, and infrastructure activity. Genuine commerce is a subset of totals. Off-chain payment protocols are not included in the aggregate.
              </div>
            </div>
          </div>
          <div style={{ marginTop: 18, paddingTop: 14, borderTop: '1px solid var(--border-light)', fontSize: 10, color: 'var(--text-ghost)' }}>
            Data refreshes daily. Current state: {freshness.label}.
          </div>
        </section>

        <section className="fade" style={{ marginTop: 24, animationDelay: '.3s' }}>
          <div className="section-title" style={{ marginBottom: 14 }}>Frequently asked questions</div>
          {[
            ['What is the agent economy?', 'The agent economy refers to AI agents autonomously transacting, paying for services, and settling activity on-chain.'],
            ['What does agenteconomy.to track?', 'The dashboard aggregates x402, ERC-8004, Virtuals ACP, Tempo MPP, and Olas activity across supported chains with public raw JSON.'],
            ['How is the data collected?', 'Data comes from Dune Analytics community queries and direct RPC indexers. Each source is linked from the relevant chart and methodology section.'],
            ['Can I use the data?', 'Yes. The raw dataset is available at /data.json for researchers, builders, and analysts.'],
          ].map(([q, a], i) => (
            <details className="details-card" key={i}>
              <summary>{q}<span style={{ color: 'var(--text-faint)', marginLeft: 8 }}>+</span></summary>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', lineHeight: 1.7, marginTop: 10, paddingTop: 10, borderTop: '1px solid var(--border-light)' }}>{a}</div>
            </details>
          ))}
        </section>
      </main>

      <footer className="footer">
        <div className="footer-inner">
          <a className="action-link" href="/data.json">Raw data</a>
          <a className="action-link" href="https://github.com/realdora/agenteconomy/issues/new?template=data-source.yml" target="_blank" rel="noopener noreferrer">Submit a data source</a>
          <a href="https://x.com/realdora_eth" target="_blank" rel="noopener noreferrer" aria-label="Open realdora on X" style={{ display: 'inline-flex', color: 'var(--text-faint)' }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
          </a>
        </div>
      </footer>
    </div>
  )
}
