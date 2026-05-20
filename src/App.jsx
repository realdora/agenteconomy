import { lazy, Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { Link, Navigate, Route, Routes } from 'react-router-dom'
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

const LazyCharts = lazy(() => import('./Charts.jsx'))

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
  const didMount = useRef(false)
  const current = useRef(target || 0)
  const [v, setV] = useState(target || 0)

  useEffect(() => {
    current.current = v
  }, [v])

  useEffect(() => {
    if (!didMount.current) {
      didMount.current = true
      return
    }
    if (reduced) {
      setV(target || 0)
      return
    }
    const from = current.current || 0
    const to = target || 0
    if (from === to) return
    let start = null
    let id
    const step = t => {
      if (!start) start = t
      const p = Math.min((t - start) / dur, 1)
      const eased = 1 - Math.pow(1 - p, 3)
      setV(Math.floor(from + eased * (to - from)))
      if (p < 1) id = requestAnimationFrame(step)
    }
    id = requestAnimationFrame(step)
    return () => cancelAnimationFrame(id)
  }, [target, dur, reduced])

  return v
}

function useDashboardData(initialData) {
  const [data, setData] = useState(() => normalizeData(FB, initialData || FB))
  const [loadState, setLoadState] = useState(initialData ? 'loaded' : 'loading')

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

function getInitialDark() {
  try {
    const saved = localStorage.getItem('ae-theme')
    if (saved) return saved === 'dark'
  } catch {}
  const h = new Date().getHours()
  return h < 6 || h >= 18
}

function useTheme() {
  const [dark, setDark] = useState(getInitialDark)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light')
  }, [dark])

  const toggleTheme = () => setDark(d => {
    const next = !d
    try { localStorage.setItem('ae-theme', next ? 'dark' : 'light') } catch {}
    return next
  })

  return { dark, toggleTheme }
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

function ClientRendered({ children }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return mounted ? children : null
}

function ChartSurface({ children }) {
  return (
    <ClientRendered>
      <Suspense fallback={null}>
        <LazyCharts>{children}</LazyCharts>
      </Suspense>
    </ClientRendered>
  )
}

function ThemeIcon({ dark }) {
  return (
    <ClientRendered>
      {dark ? (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" /></svg>
      ) : (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" /><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" /><line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" /></svg>
      )}
    </ClientRendered>
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
          <ChartSurface>
            {({ Bar, Cell, ComposedChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis }) => (
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
            )}
          </ChartSurface>
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
            <ChartSurface>
              {({ Cell, Pie, PieChart, Tooltip }) => (
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
              )}
            </ChartSurface>
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
    { protocol: 'x402', href: '/x402', role: 'HTTP-native agent payments', events: data.x402.totalTxs, volume: data.x402.totalVolume, chains: data.x402.chainsTracked, source: SOURCES.x402[0] },
    { protocol: 'ERC-8004', href: '/erc-8004', role: 'Agent identity + reputation', events: data.baseAgentic.totalTxs, agents: data.erc8004Registry.totalAgents, chains: data.erc8004Registry.chainsTracked, source: SOURCES.erc8004[1] },
    { protocol: 'Virtuals ACP', href: '/virtuals-acp', role: 'Agent-to-agent commerce', events: data.virtualsAcp.totalMemos, volume: null, chains: 1, source: SOURCES.acp[0] },
    { protocol: 'Tempo / MPP', href: '/tempo-mpp', role: 'Machine payment channels', events: data.tempoMpp.totalEvents, volume: null, chains: 1, source: SOURCES.tempo[0] },
    { protocol: 'Olas', href: '/olas', role: 'Autonomous agent transactions', events: data.olas.totalTxs, volume: null, chains: data.olas.chains?.length || 0, source: SOURCES.olas[0] },
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
                <td><strong><Link to={row.href}>{row.protocol}</Link></strong>{row.agents ? <div style={{ color: 'var(--text-faint)' }}>{fmt(row.agents)} agents</div> : null}</td>
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
              <ChartSurface>
                {({ Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis }) => (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={ag.daily} barSize={Math.max(4, Math.min(14, 600 / ag.daily.length))}>
                      <XAxis dataKey="day" tick={{ fill: '#9CA3AF', fontSize: 9 }} axisLine={false} tickLine={false} tickFormatter={v => (v || '').slice(5)} interval={Math.max(1, Math.floor(ag.daily.length / 10))} />
                      <YAxis tick={{ fill: '#9CA3AF', fontSize: 9 }} tickFormatter={v => fmt(v)} axisLine={false} tickLine={false} width={36} />
                      <Tooltip content={<ChartTip />} cursor={{ fill: 'var(--cursor-fill)' }} />
                      <Bar dataKey="infrastructure" stackId="a" fill="#6366F1" name="Infrastructure" />
                      <Bar dataKey="consumer" stackId="a" fill="#10B981" radius={[2, 2, 0, 0]} name="Consumer" />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </ChartSurface>
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
                <ChartSurface>
                  {({ Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis }) => (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData.slice(-60)} margin={{ top: 4, right: 0, bottom: 0, left: 0 }}>
                        <XAxis dataKey={kind === 'olas' ? 'week' : 'day'} tick={{ fill: '#9CA3AF', fontSize: 9 }} axisLine={false} tickLine={false} tickFormatter={v => (v || '').slice(5)} interval={Math.max(1, Math.floor(chartData.length / 12))} />
                        <YAxis tick={{ fill: '#9CA3AF', fontSize: 9 }} tickFormatter={v => fmt(v)} axisLine={false} tickLine={false} width={36} />
                        <Tooltip content={<ChartTip unit={unit} />} cursor={{ fill: 'var(--cursor-fill)' }} />
                        <Bar dataKey={chartKey} fill={barColor} radius={[3, 3, 0, 0]} barSize={kind === 'olas' ? 14 : 6} opacity={0.72} name={chartTitle} />
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </ChartSurface>
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

function DashboardPage({ initialData }) {
  const { data, loadState } = useDashboardData(initialData)
  const { dark, toggleTheme } = useTheme()

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
              <ThemeIcon dark={dark} />
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
          <h1 className="hero-title">AI Agent Payment Data Dashboard</h1>
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

const STAGE_1_ROUTES = [
  '/',
  '/x402',
  '/erc-8004',
  '/virtuals-acp',
  '/olas',
  '/tempo-mpp',
  '/methodology',
  '/data',
]

export { STAGE_1_ROUTES }

const SITE_URL = 'https://agenteconomy.to'
const DATA_URL = `${SITE_URL}/data.json`
const TEMPO_DATA_URL = `${SITE_URL}/tempo-data.json`
const PROTOCOL_ROUTES = ['/x402', '/erc-8004', '/virtuals-acp', '/olas', '/tempo-mpp']
const METHODOLOGY_ROUTE = '/methodology'
const DATA_ROUTE = '/data'

function routeUrl(path) {
  return path === '/' ? `${SITE_URL}/` : `${SITE_URL}${path}`
}

function protocolRelatedRoutes(path) {
  return [...PROTOCOL_ROUTES.filter(route => route !== path), METHODOLOGY_ROUTE, DATA_ROUTE]
}

function fullNumber(value) {
  return Number(value || 0).toLocaleString()
}

function pct(value) {
  return `${Number(value || 0).toFixed(1)}%`
}

function linkAttrs(href) {
  return href.startsWith('/') ? {} : { target: '_blank', rel: 'noopener noreferrer' }
}

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function sourceList(keys) {
  return keys.flatMap(key => SOURCES[key] || [])
}

function uniqueSources(sources) {
  const seen = new Set()
  return sources.filter(source => {
    if (!source?.href || seen.has(source.href)) return false
    seen.add(source.href)
    return true
  })
}

function getTopChain(rows, valueKey) {
  return [...(rows || [])].sort((a, b) => (b[valueKey] || 0) - (a[valueKey] || 0))[0]
}

function getOlasGnosisShare(data) {
  const chains = data.olas?.chains || []
  const total = chains.reduce((sum, row) => sum + (row.txs || 0), 0)
  const gnosis = chains.find(row => row.name === 'Gnosis')?.txs || 0
  return total > 0 ? (gnosis / total) * 100 : 0
}

function getUpdatedLabel(data) {
  return shortDate(data.updatedAt) || data.updatedAt || 'Unknown'
}

const ROUTE_PAGES = {
  '/x402': {
    title: 'x402 Transaction Volume & Facilitator Data | Agent Economy',
    description: 'x402 transaction volume dashboard with live payment counts, USD settlement volume, facilitator share, chain distribution, source links, and methodology notes.',
    h1: 'x402 Transaction Volume and Agent Payment Data',
    eyebrow: 'x402 transaction volume',
    meta: data => `${fmtMoney(data.x402.totalVolume)} settled · ${data.x402.facilitatorsTracked} facilitators · ${data.x402.chainsTracked} chains`,
    heroMetric: data => fullNumber(data.x402.totalTxs),
    heroLabel: 'on-chain x402 transactions',
    explainerTitle: 'What is x402?',
    explainer: [
      'x402 is an HTTP-native payment standard for machine-readable resource access. The flow uses HTTP 402 as the payment requirement: an agent requests a resource, receives payment instructions, signs a stablecoin payment, and retries with proof of payment.',
      'Agent Economy tracks x402 through visible on-chain settlement activity. The page separates transaction count, USD settlement volume, facilitator share, and chain distribution so builders can see both usage scale and concentration.',
      'The metric is useful because agent/API payment activity is measurable on-chain, but raw settlement activity should not be read as pure verified end-user commerce. Testing, infrastructure activity, and self-directed usage can be present in the totals.',
    ],
    metricsTitle: 'How big is x402 now?',
    metrics: data => {
      const topChain = getTopChain(data.x402.chains, 'txs')
      const topFacilitator = data.x402.protocols?.[0]
      return [
        { label: 'Total transactions', value: fullNumber(data.x402.totalTxs), unit: 'count', field: 'x402.totalTxs', source: SOURCES.x402[0] },
        { label: 'USD settlement volume', value: `$${fullNumber(data.x402.totalVolume)}`, unit: 'USD', field: 'x402.totalVolume', source: SOURCES.x402[0] },
        { label: 'Facilitators tracked', value: fullNumber(data.x402.facilitatorsTracked), unit: 'facilitators', field: 'x402.facilitatorsTracked', source: SOURCES.x402[1] },
        { label: 'Chains tracked', value: fullNumber(data.x402.chainsTracked), unit: 'chains', field: 'x402.chainsTracked', source: SOURCES.x402[1] },
        { label: 'Largest chain', value: topChain ? `${topChain.name} · ${fullNumber(topChain.txs)}` : 'N/A', unit: 'transactions', field: 'x402.chains[]', source: SOURCES.x402[0] },
        { label: 'Largest facilitator share', value: topFacilitator ? `${topFacilitator.name} · ${topFacilitator.share}%` : 'N/A', unit: 'share', field: 'x402.protocols[]', source: SOURCES.x402[1] },
      ]
    },
    methodology: [
      'x402 data is pulled from public Dune dashboards and embedded into `public/data.json` by the daily GitHub Actions pipeline.',
      'The route uses the same fields as the dashboard: `x402.totalTxs`, `x402.totalVolume`, `x402.protocols`, `x402.chains`, and daily/monthly trend arrays.',
      'Caveat: raw on-chain settlement events can include tests, infrastructure activity, and repeated service calls. The page reports visible protocol activity, not audited organic commerce.',
    ],
    sourceKeys: ['x402'],
    faq: data => [
      { q: 'What does x402 transaction volume measure?', a: `It measures visible x402 on-chain settlement events in the Agent Economy dataset. The current build embeds ${fullNumber(data.x402.totalTxs)} transactions from data.json.` },
      { q: 'How much x402 payment volume is tracked?', a: `The current x402 USD settlement field is $${fullNumber(data.x402.totalVolume)}, sourced from public Dune x402 dashboards and refreshed through the daily pipeline.` },
      { q: 'Which chains show x402 activity?', a: `The dataset currently tracks ${data.x402.chainsTracked} x402 chains. The largest rows include ${data.x402.chains.slice(0, 3).map(row => row.name).join(', ')}.` },
      { q: 'Is x402 the same as Tempo MPP?', a: 'No. The x402 brief describes HTTP 402 per-resource payments, while the MPP brief frames Tempo MPP as a machine payment/channel style protocol. Agent Economy tracks both separately.' },
      { q: 'Does x402 volume equal verified organic commerce?', a: 'No. The methodology notes treat raw on-chain activity as a market signal that can include testing, infrastructure traffic, and self-directed activity.' },
    ],
    datasetName: 'x402 Transaction Volume Dataset',
    datasetDescription: 'Live x402 payment transaction, USD settlement, facilitator, and chain distribution fields from Agent Economy data.json.',
    schemaTopic: 'x402 transaction volume',
    relatedRoutes: protocolRelatedRoutes('/x402'),
  },
  '/erc-8004': {
    title: 'ERC-8004 Agent Registry Data Across Chains | Agent Economy',
    description: 'ERC-8004 agent registry data with live registered-agent totals, chain distribution, identity methodology, source links, and agent economy context today.',
    h1: 'ERC-8004 Agent Registry Data Across Chains',
    eyebrow: 'ERC-8004 agent registry',
    meta: data => `${fullNumber(data.erc8004Registry.totalAgents)} registered agents · ${data.erc8004Registry.chainsTracked} chains`,
    heroMetric: data => fullNumber(data.erc8004Registry.totalAgents),
    heroLabel: 'registered AI agents',
    explainerTitle: 'What is ERC-8004?',
    explainer: [
      'ERC-8004 is the identity and reputation layer in the Agent Economy protocol map. It lets agents register an on-chain identity before they transact, build reputation, or participate in other agent workflows.',
      'Agent Economy keeps ERC-8004 registrations separate from payment events. Registered agents are an identity supply metric, while Base Agentic activity is an event metric sourced from a separate dashboard.',
      'The registry matters because payment protocols need agents that can be addressed, evaluated, and counted across chains. This page focuses on registration counts and chain distribution rather than treating identity registration as direct commerce.',
    ],
    metricsTitle: 'How big is the ERC-8004 registry now?',
    metrics: data => {
      const topChain = getTopChain(data.erc8004Registry.chains, 'agents')
      return [
        { label: 'Registered agents', value: fullNumber(data.erc8004Registry.totalAgents), unit: 'agents', field: 'erc8004Registry.totalAgents', source: SOURCES.erc8004[1] },
        { label: 'Registry chains', value: fullNumber(data.erc8004Registry.chainsTracked), unit: 'chains', field: 'erc8004Registry.chainsTracked', source: SOURCES.erc8004[1] },
        { label: 'Largest registry chain', value: topChain ? `${topChain.name} · ${fullNumber(topChain.agents)}` : 'N/A', unit: 'agents', field: 'erc8004Registry.chains[]', source: SOURCES.erc8004[1] },
        { label: 'Base agentic events', value: fullNumber(data.baseAgentic.totalTxs), unit: 'events', field: 'baseAgentic.totalTxs', source: SOURCES.erc8004[0] },
        { label: 'Standard tracked', value: 'ERC-8004', unit: 'identity registry', field: 'erc8004Registry', source: SOURCES.erc8004[1] },
      ]
    },
    methodology: [
      'ERC-8004 registry data comes from the multi-chain Dune registry source listed in the dashboard source metadata.',
      'Base Agentic events are shown as a separate activity signal because registrations and transactions are different things. This avoids inflating payment/event totals with identity records.',
      'The daily pipeline embeds `erc8004Registry.totalAgents`, `erc8004Registry.chainsTracked`, `erc8004Registry.chains`, and `baseAgentic.totalTxs` into the prerendered page.',
    ],
    sourceKeys: ['erc8004'],
    faq: data => [
      { q: 'What does the ERC-8004 agent registry count?', a: `It counts registered AI agents in the ERC-8004 registry dataset. The current build embeds ${fullNumber(data.erc8004Registry.totalAgents)} registered agents.` },
      { q: 'Are ERC-8004 registrations counted as payment transactions?', a: 'No. Agent Economy treats identity registrations separately from payment or job events so the aggregate event count is not inflated by registry supply.' },
      { q: 'Which chain has the most ERC-8004 registered agents?', a: `The current top chain is ${getTopChain(data.erc8004Registry.chains, 'agents')?.name || 'unavailable'} in the embedded chain distribution.` },
      { q: 'Why track Base Agentic events on an ERC-8004 page?', a: 'Base Agentic activity is a related agentic activity source, but it is displayed separately from the registry total because it measures events rather than registered identities.' },
    ],
    datasetName: 'ERC-8004 Agent Registry Dataset',
    datasetDescription: 'Live ERC-8004 registered agent totals, chain counts, and related Base Agentic activity fields from Agent Economy data.json.',
    schemaTopic: 'ERC-8004 agent registry',
    relatedRoutes: protocolRelatedRoutes('/erc-8004'),
  },
  '/virtuals-acp': {
    title: 'Virtuals ACP / ERC-8183 Agent Commerce Data | Agent Economy',
    description: 'Virtuals ACP agent commerce data with live ERC-8183 memo counts, agent GDP context, Base methodology, source links, and protocol-specific FAQ updated.',
    h1: 'Virtuals ACP Agent Commerce and ERC-8183 Data',
    eyebrow: 'Virtuals ACP',
    meta: data => `${fullNumber(data.virtualsAcp.totalMemos)} ACP memos · ERC-8183 · Base`,
    heroMetric: data => fullNumber(data.virtualsAcp.totalMemos),
    heroLabel: 'ACP lifecycle memos',
    explainerTitle: 'What is Virtuals ACP?',
    explainer: [
      'Virtuals ACP, the Agent Commerce Protocol, is the agent-to-agent commerce surface in the Agent Economy map. The existing dashboard describes ACP as an ERC-8183 flow for job creation, delivery, evaluation, and settlement.',
      'Agent Economy tracks ACP through on-chain memos rather than treating every memo as a final paid transaction. A memo is a lifecycle event in the job flow, which makes it useful for measuring marketplace activity without overstating final commerce.',
      'This page pairs the live memo count with methodology and source links so researchers can distinguish ACP activity from x402 API payments, ERC-8004 identity registration, Olas autonomous activity, and Tempo MPP channel events.',
    ],
    metricsTitle: 'How big is Virtuals ACP now?',
    metrics: data => [
      { label: 'Total ACP memos', value: fullNumber(data.virtualsAcp.totalMemos), unit: 'memos', field: 'virtualsAcp.totalMemos', source: SOURCES.acp[0] },
      { label: 'Daily rows loaded', value: fullNumber(data.virtualsAcp.daily?.length || 0), unit: 'days', field: 'virtualsAcp.daily[]', source: SOURCES.acp[0] },
      { label: 'Standard', value: 'ERC-8183', unit: 'agent commerce', field: 'virtualsAcp', source: SOURCES.acp[0] },
      { label: 'Primary chain', value: 'Base', unit: 'chain', field: 'virtualsAcp', source: SOURCES.acp[0] },
    ],
    methodology: [
      'Virtuals ACP data is sourced from the public Dune ACP dashboard referenced in `src/data.js` and the project README.',
      'The live table uses `virtualsAcp.totalMemos` and `virtualsAcp.daily` from `data.json`. These are job lifecycle memos, not a direct USD GDP field.',
      'Caveat: ACP memo counts can include every lifecycle step. The page describes them as commerce-process activity, not as one-to-one completed purchases.',
    ],
    sourceKeys: ['acp'],
    faq: data => [
      { q: 'What is Virtuals ACP?', a: 'Virtuals ACP is the Agent Commerce Protocol route tracked by Agent Economy for agent-to-agent commerce workflow activity on Base.' },
      { q: 'What is ERC-8183 in this context?', a: 'ERC-8183 is the agent commerce standard label used by the dashboard for ACP job lifecycle flows such as create, deliver, evaluate, and settle.' },
      { q: 'What does an ACP memo count represent?', a: `It represents an on-chain lifecycle memo in the ACP flow. The current build embeds ${fullNumber(data.virtualsAcp.totalMemos)} total memos from data.json.` },
      { q: 'Does the ACP memo count equal agent GDP?', a: 'No. The current Agent Economy dataset exposes memo counts. The page keeps agent GDP as context and does not convert memos into a USD value.' },
    ],
    datasetName: 'Virtuals ACP ERC-8183 Memo Dataset',
    datasetDescription: 'Live Virtuals ACP memo count and daily memo fields from Agent Economy data.json.',
    schemaTopic: 'Virtuals ACP agent commerce',
    relatedRoutes: protocolRelatedRoutes('/virtuals-acp'),
  },
  '/olas': {
    title: 'Olas Autonolas Transaction Data | Agent Economy',
    description: 'Olas Autonolas data with live autonomous-agent transaction totals, Gnosis-dominant chain distribution, methodology, source links, and protocol FAQ now.',
    h1: 'Olas Autonolas Data and Autonomous Agent Transactions',
    eyebrow: 'Olas Autonolas data',
    meta: data => `${fullNumber(data.olas.totalTxs)} transactions · ${data.olas.chains?.length || 0} chains`,
    heroMetric: data => fullNumber(data.olas.totalTxs),
    heroLabel: 'autonomous agent transactions',
    explainerTitle: 'What is Olas?',
    explainer: [
      'Olas, also known as Autonolas in the existing source material, is a decentralized protocol for co-owned autonomous AI agent services. Agent Economy tracks it as a separate family of autonomous agent transactions.',
      'The Olas row is not an HTTP payment standard like x402 and not an identity registry like ERC-8004. It captures autonomous agent service activity, including the Gnosis-dominant transaction footprint shown in the current dataset.',
      'The page uses Olas transaction totals, weekly history, and chain distribution to show where autonomous agent activity is visible on-chain.',
    ],
    metricsTitle: 'How big is Olas now?',
    metrics: data => {
      const topChain = getTopChain(data.olas.chains, 'txs')
      return [
        { label: 'Total transactions', value: fullNumber(data.olas.totalTxs), unit: 'transactions', field: 'olas.totalTxs', source: SOURCES.olas[0] },
        { label: 'Chains tracked', value: fullNumber(data.olas.chains?.length || 0), unit: 'chains', field: 'olas.chains[]', source: SOURCES.olas[0] },
        { label: 'Largest chain', value: topChain ? `${topChain.name} · ${fullNumber(topChain.txs)}` : 'N/A', unit: 'transactions', field: 'olas.chains[]', source: SOURCES.olas[0] },
        { label: 'Gnosis share', value: pct(getOlasGnosisShare(data)), unit: 'share', field: 'olas.chains[]', source: SOURCES.olas[0] },
        { label: 'Weekly rows loaded', value: fullNumber(data.olas.weekly?.length || 0), unit: 'weeks', field: 'olas.weekly[]', source: SOURCES.olas[0] },
      ]
    },
    methodology: [
      'Olas data comes from the public Autonolas/Olas ecosystem Dune source listed in the dashboard metadata.',
      'The daily pipeline stores cumulative transaction count, weekly history, and chain distribution under `olas` in `data.json`.',
      'Caveat: Olas activity measures autonomous agent transactions. It is intentionally tracked outside x402, ACP, MPP, and ERC-8004 registration counts to avoid mixing protocol roles.',
    ],
    sourceKeys: ['olas'],
    faq: data => [
      { q: 'What does Olas Autonolas data measure?', a: `It measures autonomous agent transactions in the Olas ecosystem source. The current build embeds ${fullNumber(data.olas.totalTxs)} total transactions.` },
      { q: 'Why is Gnosis important for Olas?', a: `The current chain distribution is Gnosis-dominant, with ${pct(getOlasGnosisShare(data))} of tracked Olas transactions on Gnosis in data.json.` },
      { q: 'Is Olas activity counted as x402 payment volume?', a: 'No. Olas is tracked as autonomous agent transaction activity and kept separate from x402 HTTP payment settlements.' },
      { q: 'How often is Olas data refreshed?', a: 'It refreshes through the same daily Agent Economy pipeline that embeds data.json into each prerendered route.' },
    ],
    datasetName: 'Olas Autonolas Transaction Dataset',
    datasetDescription: 'Live Olas autonomous agent transaction totals, weekly history, and chain distribution fields from Agent Economy data.json.',
    schemaTopic: 'Olas Autonolas data',
    relatedRoutes: protocolRelatedRoutes('/olas'),
  },
  '/tempo-mpp': {
    title: 'Tempo MPP Machine Payment Protocol Data | Agent Economy',
    description: 'Tempo MPP machine payment protocol data with live channel-event counts, payer and payee totals, Tempo methodology, source data, and protocol FAQ today.',
    h1: 'Tempo MPP Machine Payment Protocol Data',
    eyebrow: 'Tempo MPP',
    meta: data => `${fullNumber(data.tempoMpp.totalEvents)} events · ${fullNumber(data.tempoMpp.uniquePayers)} payers`,
    heroMetric: data => fullNumber(data.tempoMpp.totalEvents),
    heroLabel: 'MPP channel events',
    explainerTitle: 'What is Tempo MPP?',
    explainer: [
      'Tempo MPP is the machine payment protocol route in the Agent Economy map. The x402-vs-MPP brief frames it as a machine payment/channel style approach associated with Tempo and Stripe infrastructure.',
      'Agent Economy tracks MPP separately from x402 because the two payment patterns are different: x402 emphasizes HTTP 402 per-resource payments, while MPP points toward machine payment channels and stablecoin micropayments on Tempo.',
      'The current route reports Tempo RPC-indexed events, unique payers, unique payees, event types, and daily rows. This is narrower than Dune-backed x402 coverage and should be interpreted as early Tempo-specific visible activity.',
    ],
    metricsTitle: 'How big is Tempo MPP now?',
    metrics: data => [
      { label: 'Total MPP events', value: fullNumber(data.tempoMpp.totalEvents), unit: 'events', field: 'tempoMpp.totalEvents', source: SOURCES.tempo[0] },
      { label: 'Unique payers', value: fullNumber(data.tempoMpp.uniquePayers), unit: 'addresses', field: 'tempoMpp.uniquePayers', source: SOURCES.tempo[0] },
      { label: 'Unique payees', value: fullNumber(data.tempoMpp.uniquePayees), unit: 'addresses', field: 'tempoMpp.uniquePayees', source: SOURCES.tempo[0] },
      { label: 'Event types', value: fullNumber(Object.keys(data.tempoMpp.byType || {}).length), unit: 'types', field: 'tempoMpp.byType', source: SOURCES.tempo[0] },
      { label: 'Daily rows loaded', value: fullNumber(data.tempoMpp.daily?.length || 0), unit: 'days', field: 'tempoMpp.daily[]', source: SOURCES.tempo[0] },
    ],
    methodology: [
      'Tempo MPP data is produced by the local RPC indexer summary and exposed through `tempo-data.json`, then merged into `data.json` for the dashboard.',
      'The route uses `tempoMpp.totalEvents`, `tempoMpp.uniquePayers`, `tempoMpp.uniquePayees`, `tempoMpp.byType`, and `tempoMpp.daily` at build time.',
      'Caveat: the x402-vs-MPP brief treats MPP as earlier and narrower in visible data coverage. This route reports Tempo-specific indexed activity rather than broad market share.',
    ],
    sourceKeys: ['tempo'],
    faq: data => [
      { q: 'What does Tempo MPP data measure?', a: `It measures RPC-indexed Machine Payment Protocol events on Tempo. The current build embeds ${fullNumber(data.tempoMpp.totalEvents)} total events.` },
      { q: 'How is MPP different from x402?', a: 'The project brief describes x402 as HTTP 402 per-resource payments and MPP as a machine payment/channel style protocol. Agent Economy keeps their metrics separate.' },
      { q: 'What are unique payers and payees?', a: `They are distinct addresses extracted by the Tempo summary script. The current build shows ${fullNumber(data.tempoMpp.uniquePayers)} payers and ${fullNumber(data.tempoMpp.uniquePayees)} payees.` },
      { q: 'Why is Tempo MPP coverage narrower than x402?', a: 'The current MPP source is a Tempo RPC indexer rather than multiple public Dune dashboards. The page presents it as early visible activity, not a complete cross-chain market.' },
    ],
    datasetName: 'Tempo MPP Machine Payment Dataset',
    datasetDescription: 'Live Tempo MPP event, payer, payee, event-type, and daily fields from Agent Economy data.json and tempo-data.json.',
    schemaTopic: 'Tempo MPP machine payment protocol',
    distributions: [DATA_URL, TEMPO_DATA_URL],
    relatedRoutes: protocolRelatedRoutes('/tempo-mpp'),
  },
  '/methodology': {
    title: 'Agentic Payment Data Methodology | Agent Economy',
    description: 'Agentic payment data methodology for x402, ERC-8004, Virtuals ACP, Tempo MPP, and Olas, with source references, caveats, and update flow for researchers.',
    h1: 'How Agentic Payment Data Is Tracked',
    eyebrow: 'agentic payment data methodology',
    meta: (data, totals) => `${fmt(totals.combinedEvents)} aggregate events · ${totals.protocols} protocols · daily refresh`,
    heroMetric: (data, totals) => fullNumber(totals.combinedEvents),
    heroLabel: 'aggregate on-chain events',
    explainerTitle: 'Overall approach',
    explainer: [
      'Agent Economy is a daily-updated static dashboard for measurable on-chain agent activity. The project brief defines its core coverage as x402, ERC-8004, ERC-8183 / Virtuals ACP, Tempo MPP, and Olas across 11+ chains.',
      'The methodology is deliberately conservative: each protocol keeps its native unit. x402 reports settlement transactions and USD volume, ERC-8004 reports registered agents, ACP reports lifecycle memos, MPP reports indexed channel events, and Olas reports autonomous agent transactions.',
      'This avoids pretending that every protocol emits the same kind of economic event. The combined event total is a high-level footprint, while the page-level tables preserve protocol-specific meaning.',
    ],
    metricsTitle: 'Current methodology snapshot',
    metrics: (data, totals) => [
      { label: 'Aggregate events', value: fullNumber(totals.combinedEvents), unit: 'events', field: 'computed: x402 + baseAgentic + virtualsAcp + tempoMpp + olas', source: { label: 'Agent Economy aggregate logic', href: 'https://github.com/realdora/agenteconomy' } },
      { label: 'Protocols tracked', value: fullNumber(totals.protocols), unit: 'protocol families', field: 'computeTotals().protocols', source: { label: 'Agent Economy README', href: 'https://github.com/realdora/agenteconomy' } },
      { label: 'Chains tracked', value: `${totals.chains}+`, unit: 'chains', field: 'computeTotals().chains', source: { label: 'Agent Economy README', href: 'https://github.com/realdora/agenteconomy' } },
      { label: 'Registered agents', value: fullNumber(totals.registeredAgents), unit: 'agents', field: 'erc8004Registry.totalAgents', source: SOURCES.erc8004[1] },
      { label: 'Refresh cadence', value: 'Daily', unit: 'UTC', field: 'GitHub Actions cron', source: { label: 'Agent Economy README', href: 'https://github.com/realdora/agenteconomy' } },
    ],
    methodRows: () => [
      { protocol: 'x402', unit: 'settlement transactions and USD volume', fields: 'x402.totalTxs, x402.totalVolume, x402.protocols, x402.chains', source: SOURCES.x402[0].label, caveat: 'Raw settlements are not pure verified end-user commerce.' },
      { protocol: 'ERC-8004', unit: 'registered agents and registry chain distribution', fields: 'erc8004Registry.totalAgents, erc8004Registry.chains', source: SOURCES.erc8004[1].label, caveat: 'Identity registration is separate from payment activity.' },
      { protocol: 'Virtuals ACP', unit: 'job lifecycle memos', fields: 'virtualsAcp.totalMemos, virtualsAcp.daily', source: SOURCES.acp[0].label, caveat: 'Memos are workflow events, not necessarily completed purchases.' },
      { protocol: 'Tempo MPP', unit: 'RPC-indexed channel events', fields: 'tempoMpp.totalEvents, tempoMpp.uniquePayers, tempoMpp.uniquePayees', source: SOURCES.tempo[0].label, caveat: 'Coverage is Tempo-specific and early.' },
      { protocol: 'Olas', unit: 'autonomous agent transactions', fields: 'olas.totalTxs, olas.chains, olas.weekly', source: SOURCES.olas[0].label, caveat: 'Kept separate from HTTP payment and registry metrics.' },
    ],
    methodology: [
      'The fetch pipeline reads Dune latest results, optionally executes stale queries, merges Tempo RPC summary data, writes `public/data.json`, and relies on Vercel Git auto-deploy.',
      'Data quality notes from the README apply across routes: raw counts include ecosystem testing, self-dealing, and infrastructure activity; genuine commerce is a subset of totals; off-chain payment protocols are not included.',
      'All Stage 2 pages embed the current `data.json` values at build time so crawlers can read current metrics without executing JavaScript.',
    ],
    sourceKeys: ['x402', 'erc8004', 'acp', 'tempo', 'olas'],
    faq: data => [
      { q: 'How is agentic payment data tracked?', a: 'Agent Economy combines public Dune sources and a Tempo RPC summary into data.json, then prerenders each route with those values at build time.' },
      { q: 'Why are ERC-8004 agents not counted as payment events?', a: 'ERC-8004 measures registered agent identities. The methodology keeps it separate from payment or job-event metrics to avoid mixing units.' },
      { q: 'How often does the dataset update?', a: `The pipeline runs daily. This build embeds the dataset updated at ${data.updatedAt}.` },
      { q: 'What are the main caveats?', a: 'Raw on-chain activity can include testing, self-dealing, and infrastructure activity. The dataset tracks visible protocol activity, not audited organic commerce.' },
    ],
    datasetName: 'Agentic Payment Data Methodology Dataset',
    datasetDescription: 'Methodology and source references for Agent Economy protocol data fields and aggregate calculations.',
    schemaTopic: 'agentic payment data methodology',
    relatedTitle: 'Related protocols and data',
    relatedRoutes: [...PROTOCOL_ROUTES, DATA_ROUTE],
  },
  '/data': {
    title: 'Agentic Payment Data API Schema | Agent Economy',
    description: 'Agentic payment data API reference for data.json fields, units, update cadence, source coverage, caveats, and consuming the live dataset without scraping.',
    h1: 'Agentic Payment Data API and data.json Schema',
    eyebrow: 'agentic payment data API',
    meta: (data, totals) => `${fmt(totals.combinedEvents)} events · public JSON · daily refresh`,
    heroMetric: (data, totals) => fullNumber(totals.combinedEvents),
    heroLabel: 'events available in data.json',
    explainerTitle: 'What does the data API expose?',
    explainer: [
      'Agent Economy exposes the same dataset that powers the dashboard at `/data.json`. It is machine-readable JSON intended for researchers, builders, journalists, and AI/search systems that need protocol-level agent economy data without scraping the UI.',
      '`data.json` includes aggregate x402, ERC-8004, Virtuals ACP, Tempo MPP, and Olas fields. Tempo also has a raw summary endpoint at `/tempo-data.json` for the RPC-indexed MPP source.',
      'The dataset refreshes through the daily GitHub Actions pipeline. Vercel rebuilds after data changes, so route HTML and JSON stay aligned with the latest committed data.',
    ],
    metricsTitle: 'Current data.json fields',
    metrics: (data, totals) => [
      { label: 'combinedEvents', value: fullNumber(totals.combinedEvents), unit: 'computed count', field: 'computed aggregate', source: { label: 'Agent Economy aggregate logic', href: 'https://github.com/realdora/agenteconomy' } },
      { label: 'x402.totalTxs', value: fullNumber(data.x402.totalTxs), unit: 'transactions', field: 'x402.totalTxs', source: { label: 'data.json', href: '/data.json' } },
      { label: 'erc8004Registry.totalAgents', value: fullNumber(data.erc8004Registry.totalAgents), unit: 'agents', field: 'erc8004Registry.totalAgents', source: { label: 'data.json', href: '/data.json' } },
      { label: 'virtualsAcp.totalMemos', value: fullNumber(data.virtualsAcp.totalMemos), unit: 'memos', field: 'virtualsAcp.totalMemos', source: { label: 'data.json', href: '/data.json' } },
      { label: 'tempoMpp.totalEvents', value: fullNumber(data.tempoMpp.totalEvents), unit: 'events', field: 'tempoMpp.totalEvents', source: { label: 'data.json', href: '/data.json' } },
      { label: 'olas.totalTxs', value: fullNumber(data.olas.totalTxs), unit: 'transactions', field: 'olas.totalTxs', source: { label: 'data.json', href: '/data.json' } },
      { label: 'updatedAt', value: data.updatedAt, unit: 'ISO datetime', field: 'updatedAt', source: { label: 'data.json', href: '/data.json' } },
    ],
    methodRows: () => [
      { protocol: 'x402', unit: 'count, USD, facilitator share, chain rows', fields: 'x402.totalTxs, x402.totalVolume, x402.protocols, x402.chains', source: '/data.json', caveat: 'Settlement activity, not audited organic commerce.' },
      { protocol: 'ERC-8004', unit: 'agent count and chain rows', fields: 'erc8004Registry.totalAgents, erc8004Registry.chainsTracked, erc8004Registry.chains', source: '/data.json', caveat: 'Identity supply metric, not a payment count.' },
      { protocol: 'Virtuals ACP', unit: 'memo count and daily rows', fields: 'virtualsAcp.totalMemos, virtualsAcp.daily', source: '/data.json', caveat: 'Lifecycle memos, not necessarily completed purchases.' },
      { protocol: 'Tempo MPP', unit: 'event count, addresses, event types', fields: 'tempoMpp.totalEvents, tempoMpp.uniquePayers, tempoMpp.uniquePayees, tempoMpp.byType', source: '/data.json and /tempo-data.json', caveat: 'Tempo-specific RPC indexer coverage.' },
      { protocol: 'Olas', unit: 'transaction count, chain rows, weekly rows', fields: 'olas.totalTxs, olas.chains, olas.weekly', source: '/data.json', caveat: 'Autonomous agent activity tracked separately.' },
    ],
    methodology: [
      'Fetch `/data.json` directly for the canonical dashboard dataset. Use `/tempo-data.json` only when you need to inspect the Tempo MPP summary source separately.',
      'Fields are intentionally nested by protocol so consumers can avoid mixing units. Treat `combinedEvents` as a dashboard aggregate, not a universal economic volume metric.',
      'The license for dataset schema in the existing homepage JSON-LD is CC BY 4.0. The repo code remains MIT licensed.',
    ],
    sourceKeys: ['x402', 'erc8004', 'acp', 'tempo', 'olas'],
    faq: data => [
      { q: 'Where is the Agent Economy data API?', a: 'The public dataset is available at https://agenteconomy.to/data.json, with a Tempo-specific source summary at https://agenteconomy.to/tempo-data.json.' },
      { q: 'Can I use data.json without rendering the dashboard?', a: 'Yes. The file is plain JSON and contains the same protocol fields embedded into the prerendered route HTML.' },
      { q: 'How fresh is the API data?', a: `The current build embeds data updated at ${data.updatedAt}. The pipeline is configured for a daily UTC refresh.` },
      { q: 'What unit should I use for combinedEvents?', a: 'Use count, and label it as an aggregate protocol-event footprint. Do not treat it as USD volume or verified organic commerce.' },
    ],
    datasetName: 'Agentic Payment Data API Dataset',
    datasetDescription: 'Machine-readable Agent Economy data.json schema and live protocol fields for x402, ERC-8004, Virtuals ACP, Tempo MPP, and Olas.',
    schemaTopic: 'agentic payment data API',
    distributions: [DATA_URL, TEMPO_DATA_URL],
    relatedTitle: 'Related protocols and methodology',
    relatedRoutes: [...PROTOCOL_ROUTES, METHODOLOGY_ROUTE],
  },
}

const ROUTE_LINKS = Object.entries(ROUTE_PAGES).map(([path, config]) => ({
  path,
  title: config.h1,
  description: config.description,
}))

function getRelatedRoutes(config) {
  return (config.relatedRoutes || []).map(path => {
    const relatedConfig = getPageConfig(path)
    return {
      path,
      title: relatedConfig.h1,
      description: relatedConfig.description,
    }
  })
}

function getRouteData(initialData) {
  const data = normalizeData(FB, initialData || FB)
  return { data, totals: computeTotals(data) }
}

function getPageConfig(path) {
  const config = ROUTE_PAGES[path]
  if (!config) throw new Error(`Unknown route config: ${path}`)
  return config
}

function getMetrics(config, data, totals) {
  return config.metrics(data, totals)
}

function getFaq(config, data, totals) {
  return config.faq(data, totals)
}

function renderSourceLink(source) {
  return (
    <a href={source.href} {...linkAttrs(source.href)}>
      {source.label}
    </a>
  )
}

function RelatedRoutesSection({ config }) {
  const relatedRoutes = getRelatedRoutes(config)
  if (!relatedRoutes.length) return null

  return (
    <section className="section" data-section="related">
      <div className="section-head">
        <h2 className="section-title">{config.relatedTitle || 'Related protocols'}</h2>
        <span className="badge" style={{ color: GREEN, background: 'var(--badge-green-bg)' }}>LINKS</span>
      </div>
      <div className="related-grid">
        {relatedRoutes.map(route => (
          <Link className="related-link" to={route.path} key={route.path}>
            <span className="related-title">{route.title}</span>
            <span className="related-desc">{route.description}</span>
          </Link>
        ))}
      </div>
    </section>
  )
}

function ProtocolRoutePage({ initialData, path }) {
  const { data, totals } = getRouteData(initialData)
  const config = getPageConfig(path)
  const metrics = getMetrics(config, data, totals)
  const faqs = getFaq(config, data, totals)
  const sources = uniqueSources([...metrics.map(row => row.source), ...sourceList(config.sourceKeys)])
  const freshness = getFreshness(data.updatedAt, 'loaded')
  const { dark, toggleTheme } = useTheme()

  return (
    <div className="app">
      <nav className="nav">
        <div className="nav-inner">
          <div className="brand-row">
            <span className="brand">agenteconomy.to</span>
            <span className="live-pill"><LiveDot />LIVE</span>
            <button className="theme-btn" type="button" onClick={toggleTheme} aria-label={dark ? 'Switch to light theme' : 'Switch to dark theme'}>
              <ThemeIcon dark={dark} />
            </button>
          </div>
          <div className="nav-meta">
            <span className={`status-pill ${freshness.tone === 'warn' ? 'warn' : ''}`}>{freshness.label}</span>
            <span>Updated {shortDate(data.updatedAt)}</span>
            <Link to="/">Dashboard</Link>
          </div>
        </div>
        <div className="mob-meta">
          <span className={`status-pill ${freshness.tone === 'warn' ? 'warn' : ''}`}>{freshness.label}</span>
          <span className="mobile-date">{shortDate(data.updatedAt)}</span>
        </div>
      </nav>

      <main className="shell">
        <section className="hero fade">
          <h1 className="hero-title">{config.h1}</h1>
          <div className="eyebrow">{config.eyebrow}</div>
          <div className="hero-num">{config.heroMetric(data, totals)}</div>
          <div style={{ marginTop: 0, marginBottom: 12, color: 'var(--text-muted)', fontSize: 12 }}>{config.heroLabel}</div>
          <div className="hero-row">
            {metrics.slice(0, 4).map((item, i) => (
              <div className="hero-cell" key={i}>
                <div className="hero-sub" style={{ color: i === 0 ? BLUE : 'var(--text-strong)' }}>{item.value}</div>
                <div className="hero-label">{item.label}</div>
              </div>
            ))}
          </div>
          <div className="quick-actions">
            <Link className="action-link" to="/">Dashboard</Link>
            {path !== '/methodology' && <Link className="action-link" to="/methodology">Methodology</Link>}
            {path !== '/data' && <Link className="action-link" to="/data">Data API</Link>}
            <a className="action-link" href="/data.json">Raw JSON</a>
          </div>
        </section>

        <section className="section" data-section="explainer">
          <div className="section-head">
            <h2 className="section-title">{config.explainerTitle}</h2>
            <span className="badge" style={{ color: BLUE, background: 'var(--badge-blue-bg)' }}>EXPLAINER</span>
            <span style={{ width: 1, height: 12, background: 'var(--border)' }} />
            <span className="meta">{config.meta(data, totals)}</span>
          </div>
          <div className="panel">
            {config.explainer.map(paragraph => (
              <p key={paragraph} style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.8, margin: '0 0 12px' }}>{paragraph}</p>
            ))}
          </div>
        </section>

        <section className="section" data-section="metrics">
          <div className="section-head">
            <h2 className="section-title">{config.metricsTitle}</h2>
            <span className="badge" style={{ color: GREEN, background: 'var(--badge-green-bg)' }}>LIVE</span>
            <span style={{ width: 1, height: 12, background: 'var(--border)' }} />
            <span className="meta">Updated {getUpdatedLabel(data)}</span>
          </div>
          <div className="comparison">
            <table>
              <thead>
                <tr>
                  <th>Metric</th>
                  <th>Value</th>
                  <th>Unit</th>
                  <th>data.json field</th>
                  <th>Source</th>
                </tr>
              </thead>
              <tbody>
                {metrics.map(row => (
                  <tr key={row.label}>
                    <td><strong>{row.label}</strong></td>
                    <td>{row.value}</td>
                    <td>{row.unit}</td>
                    <td>{row.field}</td>
                    <td>{renderSourceLink(row.source)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="panel" style={{ marginTop: 14 }}>
            <div className="panel-title">Last updated</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', lineHeight: 1.7 }}>
              <time dateTime={data.updatedAt}>{getUpdatedLabel(data)}</time>. This route was prerendered with the same `data.json` values used by the dashboard.
            </div>
          </div>
        </section>

        <section className="section" data-section="methodology">
          <div className="section-head">
            <h2 className="section-title">How this data is tracked</h2>
            <span className="badge" style={{ color: '#7C3AED', background: 'var(--badge-purple-bg)' }}>METHODOLOGY</span>
          </div>
          {config.methodRows && (
            <div className="comparison" style={{ marginBottom: 14 }}>
              <table>
                <thead>
                  <tr>
                    <th>Protocol</th>
                    <th>Unit</th>
                    <th>Fields</th>
                    <th>Source</th>
                    <th>Caveat</th>
                  </tr>
                </thead>
                <tbody>
                  {config.methodRows(data, totals).map(row => (
                    <tr key={row.protocol}>
                      <td><strong>{row.protocol}</strong></td>
                      <td>{row.unit}</td>
                      <td>{row.fields}</td>
                      <td>{row.source}</td>
                      <td>{row.caveat}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <div className="panel">
            {config.methodology.map(paragraph => (
              <p key={paragraph} style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.8, margin: '0 0 12px' }}>{paragraph}</p>
            ))}
          </div>
        </section>

        <section className="section" data-section="sources">
          <div className="section-head">
            <h2 className="section-title">Data sources</h2>
            <span className="badge" style={{ color: BLUE, background: 'var(--badge-blue-bg)' }}>SOURCES</span>
          </div>
          <div className="panel">
            <ul style={{ margin: 0, paddingLeft: 18, color: 'var(--text-muted)', fontSize: 12, lineHeight: 1.9 }}>
              {sources.map(source => (
                <li key={source.href}>{renderSourceLink(source)}</li>
              ))}
              <li><a href="/data.json">Agent Economy raw dataset</a></li>
              <li><a href="https://github.com/realdora/agenteconomy" target="_blank" rel="noopener noreferrer">Agent Economy GitHub repository</a></li>
            </ul>
          </div>
        </section>

        <section className="section" data-section="faq">
          <div className="section-head">
            <h2 className="section-title">FAQ</h2>
            <span className="badge" style={{ color: GREEN, background: 'var(--badge-green-bg)' }}>JSON-LD</span>
          </div>
          {faqs.map(item => (
            <details className="details-card" key={item.q}>
              <summary>{item.q}<span style={{ color: 'var(--text-faint)', marginLeft: 8 }}>+</span></summary>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', lineHeight: 1.7, marginTop: 10, paddingTop: 10, borderTop: '1px solid var(--border-light)' }}>{item.a}</div>
            </details>
          ))}
        </section>

        <RelatedRoutesSection config={config} />
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

export default function App({ initialData }) {
  return (
    <Routes>
      <Route path="/" element={<DashboardPage initialData={initialData} />} />
      {Object.keys(ROUTE_PAGES).map(path => (
        <Route key={path} path={path} element={<ProtocolRoutePage initialData={initialData} path={path} />} />
      ))}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export function getRouteHead(path, initialData) {
  if (path === '/') return null
  const { data, totals } = getRouteData(initialData)
  const config = getPageConfig(path)
  const url = routeUrl(path)
  return {
    title: config.title,
    description: config.description,
    canonical: url,
    ogTitle: config.title,
    ogDescription: config.description,
    ogUrl: url,
    twitterTitle: config.title,
    twitterDescription: config.description,
    jsonLd: getRouteJsonLd(path, data, totals),
    noscript: getRouteNoscript(path, data, totals),
  }
}

export function getHomepageCollectionJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'AI Agent Payment Data Dashboard',
    description: 'Daily updated AI agent payment data dashboard for x402, ERC-8004, Virtuals ACP, Olas, Tempo MPP, methodology, and raw JSON endpoints.',
    url: routeUrl('/'),
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: ROUTE_LINKS.map((route, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: route.title,
        url: routeUrl(route.path),
      })),
    },
  }
}

function getRouteJsonLd(path, data, totals) {
  const config = getPageConfig(path)
  const url = routeUrl(path)
  const metrics = getMetrics(config, data, totals)
  const faqs = getFaq(config, data, totals)
  const distributions = config.distributions || [DATA_URL]

  return [
    {
      '@context': 'https://schema.org',
      '@type': 'TechArticle',
      headline: config.h1,
      description: config.description,
      url,
      mainEntityOfPage: url,
      dateModified: data.updatedAt,
      author: {
        '@type': 'Person',
        name: 'realdora',
        url: 'https://x.com/realdora_eth',
      },
      publisher: {
        '@type': 'Organization',
        name: 'agenteconomy.to',
        url: SITE_URL,
      },
      about: config.schemaTopic,
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Dataset',
      name: config.datasetName,
      description: config.datasetDescription,
      url,
      sameAs: DATA_URL,
      license: 'https://creativecommons.org/licenses/by/4.0/',
      creator: {
        '@type': 'Person',
        name: 'realdora',
        url: 'https://x.com/realdora_eth',
      },
      dateModified: data.updatedAt,
      distribution: distributions.map(contentUrl => ({
        '@type': 'DataDownload',
        encodingFormat: 'application/json',
        contentUrl,
      })),
      variableMeasured: metrics.map(row => ({
        '@type': 'PropertyValue',
        name: row.label,
        propertyID: row.field,
        unitText: row.unit,
      })),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqs.map(item => ({
        '@type': 'Question',
        name: item.q,
        acceptedAnswer: {
          '@type': 'Answer',
          text: item.a,
        },
      })),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Agent Economy',
          item: routeUrl('/'),
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: config.h1,
          item: url,
        },
      ],
    },
  ]
}

function getRouteNoscript(path, data, totals) {
  const config = getPageConfig(path)
  const metrics = getMetrics(config, data, totals)
  const faqs = getFaq(config, data, totals)
  const sources = uniqueSources([...metrics.map(row => row.source), ...sourceList(config.sourceKeys)])
  const relatedRoutes = getRelatedRoutes(config)

  const metricRows = metrics.map(row => `
          <tr>
            <td>${escapeHtml(row.label)}</td>
            <td>${escapeHtml(row.value)}</td>
            <td>${escapeHtml(row.unit)}</td>
            <td>${escapeHtml(row.field)}</td>
            <td><a href="${escapeHtml(row.source.href)}">${escapeHtml(row.source.label)}</a></td>
          </tr>`).join('')

  const sourceItems = sources.map(source => `
          <li><a href="${escapeHtml(source.href)}">${escapeHtml(source.label)}</a></li>`).join('')

  const faqItems = faqs.map(item => `
        <h3>${escapeHtml(item.q)}</h3>
        <p>${escapeHtml(item.a)}</p>`).join('')

  const relatedItems = relatedRoutes.map(route => `
          <li><a href="${escapeHtml(route.path)}">${escapeHtml(route.title)}</a>: ${escapeHtml(route.description)}</li>`).join('')

  return `    <noscript>
      <div style="max-width:900px;margin:0 auto;padding:40px 24px;font-family:Inter,system-ui,sans-serif;color:#111827">
        <h1>${escapeHtml(config.h1)}</h1>
        <p>${escapeHtml(config.description)}</p>

        <h2>${escapeHtml(config.explainerTitle)}</h2>
${config.explainer.map(paragraph => `        <p>${escapeHtml(paragraph)}</p>`).join('\n')}

        <h2>${escapeHtml(config.metricsTitle)}</h2>
        <table>
          <tr><th>Metric</th><th>Value</th><th>Unit</th><th>data.json field</th><th>Source</th></tr>${metricRows}
        </table>
        <p>Last updated: <time datetime="${escapeHtml(data.updatedAt)}">${escapeHtml(getUpdatedLabel(data))}</time>.</p>

        <h2>How this data is tracked</h2>
${config.methodology.map(paragraph => `        <p>${escapeHtml(paragraph)}</p>`).join('\n')}

        <h2>Data sources</h2>
        <ul>${sourceItems}
          <li><a href="/data.json">Agent Economy raw dataset</a></li>
          <li><a href="https://github.com/realdora/agenteconomy">Agent Economy GitHub repository</a></li>
        </ul>

        <h2>FAQ</h2>${faqItems}

        <h2>${escapeHtml(config.relatedTitle || 'Related protocols')}</h2>
        <ul>${relatedItems}</ul>
      </div>
    </noscript>`
}
