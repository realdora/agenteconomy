import './landing.css'
import { computeTotals, fmt } from './utils.js'

const SPARK_WIDTH = 320
const SPARK_HEIGHT = 88
const SPARK_TOP = 6
const SPARK_BOTTOM = 10

function countChains(data) {
  // Sum unique tracked chains across protocols. Returns a stable positive
  // number suitable for a hero stat — avoids the "partial month" trap.
  const chains = new Set()
  for (const row of data?.x402?.chains || []) if (row?.name) chains.add(row.name)
  for (const row of data?.erc8004Registry?.chains || []) if (row?.name) chains.add(row.name)
  for (const row of data?.olas?.chains || []) if (row?.name) chains.add(row.name)
  return chains.size || (data?.x402?.chainsTracked || 0) + (data?.erc8004Registry?.chainsTracked || 0)
}

function roundPathValue(value) {
  return Number(value.toFixed(2))
}

function chartPoint(x, y) {
  return `${roundPathValue(x)},${roundPathValue(y)}`
}

function smoothPath(points) {
  if (points.length < 2) return ''

  return points.slice(1).reduce((path, next, index) => {
    const current = points[index]
    const previous = points[index - 1] || current
    const after = points[index + 2] || next
    const c1 = {
      x: current.x + (next.x - previous.x) / 6,
      y: current.y + (next.y - previous.y) / 6,
    }
    const c2 = {
      x: next.x - (after.x - current.x) / 6,
      y: next.y - (after.y - current.y) / 6,
    }

    return `${path} C${chartPoint(c1.x, c1.y)} ${chartPoint(c2.x, c2.y)} ${chartPoint(next.x, next.y)}`
  }, `M${chartPoint(points[0].x, points[0].y)}`)
}

function buildSparkline(daily) {
  // Build a cumulative series so the chart is a clean J-curve (always up).
  // Raw daily values bounce, which reads as "noise" on a hero card; the
  // running total tells the growth story without lying about the data.
  const raw = (daily || [])
    .filter(day => typeof day?.day === 'string' && Number.isFinite(day?.txs) && day.txs >= 0)
    .map(day => ({ day: day.day, txs: day.txs }))

  if (!raw.length) return { linePath: '', fillPath: '', labels: [] }

  let running = 0
  const values = raw.map(({ day, txs }) => {
    running += txs
    return { day, txs: running }
  })

  const minValue = Math.min(...values.map(day => day.txs))
  const maxValue = Math.max(...values.map(day => day.txs))
  const valueRange = maxValue - minValue
  const chartRange = SPARK_HEIGHT - SPARK_TOP - SPARK_BOTTOM
  const points = values.map((day, index) => ({
    x: values.length === 1 ? 0 : index / (values.length - 1) * SPARK_WIDTH,
    y: valueRange === 0
      ? SPARK_TOP + chartRange / 2
      : SPARK_TOP + (maxValue - day.txs) / valueRange * chartRange,
  }))

  if (points.length === 1) points.push({ x: SPARK_WIDTH, y: points[0].y })

  const linePath = smoothPath(points)
  return {
    linePath,
    fillPath: `${linePath} L${SPARK_WIDTH},${SPARK_HEIGHT} L0,${SPARK_HEIGHT} Z`,
    labels: getAxisLabels(values),
  }
}

function formatDayLabel(day) {
  const date = new Date(`${day}T00:00:00Z`)
  if (Number.isNaN(date.getTime())) return day

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  })
}

function getAxisLabels(values) {
  if (!values.length) return []

  return [0, 0.25, 0.5, 0.75, 1]
    .map(progress => Math.round((values.length - 1) * progress))
    .filter((index, position, indices) => indices.indexOf(index) === position)
    .map(index => formatDayLabel(values[index].day))
}

export default function Landing({ initialData }) {
  const data = initialData || {}
  const eventsTracked = fmt(computeTotals(data).combinedEvents)
  const chainCount = countChains(data)
  const sparkline = buildSparkline(data.x402?.daily)

  return (
    <div className="landing">
      <div className="ticker">
        <span className="chip"><strong>Base</strong> 37.1% x402 share</span>
        <span className="chip"><strong>Coinbase</strong> 30.4% facilitator</span>
        <span className="chip"><strong>BNB</strong> 78.6K 8004 agents</span>
        <span className="chip"><strong>Gnosis</strong> 97.1% Olas share</span>
        <span className="spacer" />
        <span className="chip"><strong>AGG</strong> 173,491,414 events</span>
      </div>

      <nav className="nav">
        <div className="brand">agenteconomy.to<span className="cursor" /></div>
        <ul className="nav-links">
          <li><a href="#what">What is</a></li>
          <li><a href="#protocols">Protocols</a></li>
          <li><a href="#methodology">Methodology</a></li>
          <li><a href="#data">Live data</a></li>
          <li><a href="#faq">FAQ</a></li>
        </ul>
        <a className="nav-cta" href="/dashboard">Open dashboard &rarr;</a>
      </nav>

      <div className="meta-row">
        <div className="left">
          <span><span className="pulse" />Live</span>
          <span>/index</span>
          <span>&mdash; Agent Payment Monitor</span>
          <span>&middot; Open data</span>
        </div>
        <div>Edition No. 143 &middot; Daily refresh 02:00 UTC</div>
      </div>

      <section className="hero-stage">
        <div className="tile tile--banner">
          <img src="/landing/tile-1-banner.svg" alt="" aria-hidden="true" />
        </div>

        <div className="tile tile--top-sq">
          <img src="/landing/tile-2-square.svg" alt="" aria-hidden="true" />
        </div>

        <div className="tile tile--right-tall">
          <img src="/landing/tile-3-tall.svg" alt="" aria-hidden="true" />
        </div>

        <div className="tile tile--left-bot">
          <img src="/landing/tile-4-tall.svg" alt="" aria-hidden="true" />
        </div>

        <div className="tile tile--mid-bot">
          <img src="/landing/tile-5-wide.svg" alt="" aria-hidden="true" />
        </div>

        <h1 className="headline headline--top">
          Onchain<br />payments<span className="dot">.</span>
        </h1>

        <div className="subhead-inline">by <em>AI agents</em></div>

        <h1 className="headline headline--bot">
          you can<br />explore.
        </h1>

        <article className="product-card">
          <header className="product-card-head">
            <div className="product-card-icon">&#9679;</div>
            <div>
              <div className="product-card-title">Agent Economy Index</div>
              <div className="product-card-sub">Cross-protocol &middot; daily</div>
            </div>
          </header>

          <div className="product-card-stats">
            <div>
              <div className="stat-label">Events tracked</div>
              <div className="stat-value">{eventsTracked}</div>
            </div>
            {chainCount > 0 && (
              <div>
                <div className="stat-label">Chains tracked</div>
                <div className="stat-value delta">{chainCount}</div>
              </div>
            )}
          </div>

          <div className="product-card-chart">
            <svg className="sparkline" viewBox="0 0 320 88" preserveAspectRatio="none" aria-hidden="true">
              <defs>
                <linearGradient id="sparkGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#00FF88" stopOpacity="0.28" />
                  <stop offset="100%" stopColor="#00FF88" stopOpacity="0" />
                </linearGradient>
              </defs>
              {sparkline.fillPath && <path d={sparkline.fillPath} fill="url(#sparkGrad)" />}
              {sparkline.linePath && <path d={sparkline.linePath} fill="none" stroke="#00FF88" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />}
            </svg>
            {sparkline.labels.length > 0 && (
              <div className="chart-axis">
                {sparkline.labels.map(label => <span key={label}>{label}</span>)}
              </div>
            )}
          </div>
        </article>
      </section>

      <div className="pitch-row">
        <p className="pitch-text">
          A daily index of <strong>onchain payments by AI agents</strong>. Every transaction by x402, ERC-8004,
          Virtuals ACP, Olas, and Tempo MPP &mdash; aggregated into a single live view. Built for VCs, builders,
          researchers, and journalists who want to know what the agent economy <em>actually does</em>, not what it
          claims.
        </p>
        <a className="pitch-cta" href="/dashboard">
          Open the dashboard <span className="arrow">&rarr;</span>
        </a>
      </div>
    </div>
  )
}
