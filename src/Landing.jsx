import './landing.css'

export default function Landing({ initialData: _initialData }) {
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
              <div className="stat-value">173.5M</div>
            </div>
            <div>
              <div className="stat-label">This month</div>
              <div className="stat-value delta">+16.3%</div>
            </div>
          </div>

          <div className="product-card-chart">
            <svg className="sparkline" viewBox="0 0 320 88" preserveAspectRatio="none" aria-hidden="true">
              <defs>
                <linearGradient id="sparkGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#00FF88" stopOpacity="0.28" />
                  <stop offset="100%" stopColor="#00FF88" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path d="M0,78 L18,76 L36,74 L54,72 L72,70 L90,67 L108,63 L126,60 L144,55 L162,50 L180,45 L198,40 L216,33 L234,27 L252,22 L270,16 L288,12 L306,8 L320,5 L320,88 L0,88 Z" fill="url(#sparkGrad)" />
              <path d="M0,78 L18,76 L36,74 L54,72 L72,70 L90,67 L108,63 L126,60 L144,55 L162,50 L180,45 L198,40 L216,33 L234,27 L252,22 L270,16 L288,12 L306,8 L320,5" fill="none" stroke="#00FF88" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <div className="chart-axis">
              <span>Jan 2024</span>
              <span>Jul 2024</span>
              <span>Jan 2025</span>
              <span>Jul 2025</span>
              <span>May 2026</span>
            </div>
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
