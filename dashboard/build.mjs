// Dashboard v2 FULL interactive prototype — feature parity build.
// 14 pages · interactive charts (range tabs + tooltips) · Masumi restored ·
// x402 monthly txs/volume view · mobile drawer nav. Real data only.
import { readFileSync, writeFileSync, mkdirSync, copyFileSync, readdirSync, existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const ROOT = dirname(fileURLToPath(import.meta.url))
const DATA = join(ROOT, 'data')
const DIST = join(ROOT, 'dist')
const d = JSON.parse(readFileSync(join(DATA, 'data.json'), 'utf8'))
const w = JSON.parse(readFileSync(join(DATA, 'web-sources.json'), 'utf8'))
mkdirSync(join(DIST, 'fonts'), { recursive: true })

const todayUTC = new Date().toISOString().slice(0, 10)
const fmt = n => Number(n).toLocaleString('en-US')
const compact = n => n >= 1e12 ? (n / 1e12).toFixed(2) + 'T' : n >= 1e9 ? (n / 1e9).toFixed(1) + 'B' : n >= 1e6 ? (n / 1e6).toFixed(1) + 'M' : n >= 1e3 ? (n / 1e3).toFixed(1) + 'K' : String(Math.round(n))
// A day is COMPLETE only if the feed itself has moved past it — guarding both
// against partial today-rows AND against a stale snapshot presenting its own
// partial last day as complete. Cutoff = min(build day, feed's updatedAt day).
const feedDay = String(d.updatedAt).slice(0, 10)
const completeCutoff = feedDay < todayUTC ? feedDay : todayUTC
const closed = (rows, key = 'day') => rows.filter(r => String(r[key]).slice(0, 10) < completeCutoff)
const updatedLabel = new Date(d.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' }).toUpperCase()

// ── nav ──────────────────────────────────────────────────────────────────────
const NAV = [
  { group: null, items: [['index', 'Overview']] },
  { group: 'Measured on-chain', items: [['x402', 'x402'], ['olas', 'Olas'], ['virtuals-acp', 'Virtuals ACP'], ['erc-8004', 'ERC-8004'], ['tempo-mpp', 'Tempo MPP'], ['base-agentic', 'Base agentic'], ['masumi', 'Masumi']] },
  { group: 'Sourced off-chain', items: [['market', 'Market'], ['agent-supply', 'Agent supply'], ['standards-adoption', 'Standards adoption'], ['demand-developers', 'Demand & developers']] },
  { group: 'About the data', items: [['methodology', 'Methodology'], ['data-api', 'Data API']] },
]

const CSS = `
@font-face{font-family:Geist;src:url(/fonts/Geist_Variable-s.p.0-te~ja_gpvcf.woff2) format("woff2");font-weight:100 900}
@font-face{font-family:GeistMono;src:url(/fonts/GeistMono_Variable.p.17jn9btb_52pq.woff2) format("woff2");font-weight:100 900}
*{margin:0;padding:0;box-sizing:border-box}
:root{--paper:#faf8f4;--card:#fff;--ink:#1c1917;--muted:#78716c;--faint:#a8a29e;--line:#e7e5e1;--brand:#0f766e;--live:#059669;--down:#b91c1c}
body{background:var(--paper);color:var(--ink);font-family:Geist,-apple-system,sans-serif}
a{color:inherit;text-decoration:none}
.side{width:228px;background:var(--card);border-right:1px solid var(--line);padding:20px 12px;position:fixed;top:0;left:0;bottom:0;overflow-y:auto;z-index:30}
.logo{font-family:GeistMono,ui-monospace,Menlo,monospace;font-size:13px;padding:6px 10px 18px}.logo .to{color:var(--brand)}
.nav a{display:block;padding:8px 10px;border-radius:8px;font-size:13.5px;color:#57534e;margin-bottom:1px;transition:background .15s,color .15s}
.nav a:hover{background:#f5f5f4}.nav a.on{background:#f0fdf9;color:var(--brand);font-weight:600}
.nav .h{font-family:GeistMono,ui-monospace,Menlo,monospace;font-size:10px;letter-spacing:.14em;text-transform:uppercase;color:var(--faint);padding:16px 10px 6px}
.topbar{display:none}
.main{margin-left:228px;padding:0 48px 80px;max-width:1400px}
.pagebar{display:flex;justify-content:space-between;align-items:center;padding:22px 0;border-bottom:1px solid var(--line)}
.pagebar h1{font-size:17px;font-weight:650}
.stamp{font-family:GeistMono,ui-monospace,Menlo,monospace;font-size:11px;color:var(--muted)}
.stamp .dot{display:inline-block;width:7px;height:7px;border-radius:99px;background:var(--live);margin-right:6px;animation:pulse 2s infinite}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.35}}
.hero{padding:44px 0 8px}
.eyebrow{font-family:GeistMono,ui-monospace,Menlo,monospace;font-size:11px;letter-spacing:.2em;text-transform:uppercase;color:var(--brand);margin-bottom:14px}
.big{font-size:58px;font-weight:650;letter-spacing:-0.02em;font-variant-numeric:tabular-nums;line-height:1}
.big .live-digits{color:var(--live)}
.runrate{font-family:GeistMono,ui-monospace,Menlo,monospace;font-size:11.5px;color:var(--faint);margin-top:12px}
.kpis{display:grid;grid-template-columns:repeat(var(--n,5),1fr);border-top:1px solid var(--line);border-bottom:1px solid var(--line);margin-top:30px}
.kpi{padding:18px 20px;border-right:1px solid var(--line)}.kpi:last-child{border-right:0}.kpi:first-child{padding-left:0}
.kpi .l{font-family:GeistMono,ui-monospace,Menlo,monospace;font-size:10px;letter-spacing:.14em;text-transform:uppercase;color:var(--muted)}
.kpi .v{font-size:23px;font-weight:650;margin-top:8px;font-variant-numeric:tabular-nums}
.kpi .f{font-family:GeistMono,ui-monospace,Menlo,monospace;font-size:10.5px;color:var(--faint);margin-top:4px}
.sec{margin-top:56px}
.kick{font-family:GeistMono,ui-monospace,Menlo,monospace;font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:var(--brand);margin-bottom:10px}
.kick::before{content:"— ";color:var(--faint)}
h2{font-size:25px;font-weight:650;letter-spacing:-0.01em;margin-bottom:20px}
.card{background:var(--card);border:1px solid var(--line);border-radius:14px;box-shadow:0 1px 2px rgba(28,25,23,0.04)}
.pad{padding:22px 24px}
.chart-top{display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;gap:12px;flex-wrap:wrap}
.chart-top .t{font-size:14.5px;font-weight:600}
.pills{display:flex;gap:4px}
.pill{font-family:GeistMono,ui-monospace,Menlo,monospace;font-size:10.5px;padding:4px 10px;border-radius:99px;color:var(--muted);cursor:pointer;transition:all .15s;border:1px solid transparent}
.pill:hover{border-color:var(--line)}
.pill.on{background:var(--brand);color:#fff}
.chart-sub{font-size:12px;color:var(--muted);margin-bottom:14px}
.chartv{position:relative}
.tip{position:absolute;pointer-events:none;background:#1c1917;color:#fafaf9;font-family:GeistMono,ui-monospace,Menlo,monospace;font-size:11px;padding:6px 10px;border-radius:8px;white-space:nowrap;transform:translate(-50%,-115%);opacity:0;transition:opacity .12s;z-index:5}
.tip .tv{font-weight:600}
.briefs{display:grid;grid-template-columns:repeat(4,1fr);gap:14px}
.brief{padding:18px;transition:transform .2s,box-shadow .2s;cursor:pointer;display:block}
.brief:hover{transform:translateY(-3px);box-shadow:0 8px 24px rgba(28,25,23,0.08)}
.tag{font-family:GeistMono,ui-monospace,Menlo,monospace;font-size:9.5px;letter-spacing:.12em;padding:3px 8px;border-radius:99px;display:inline-block}
.brief .n{font-size:29px;font-weight:650;margin-top:12px;font-variant-numeric:tabular-nums}
.brief .s{font-size:12.5px;color:var(--muted);line-height:1.55;margin-top:8px;min-height:58px}
.brief .cta{font-size:12px;color:var(--brand);font-weight:600;margin-top:10px}
table{width:100%;border-collapse:collapse}
th{font-family:GeistMono,ui-monospace,Menlo,monospace;font-size:10px;letter-spacing:.1em;text-transform:uppercase;color:var(--faint);font-weight:400;text-align:left;padding:10px 12px;border-bottom:1px solid var(--line)}
td{padding:13px 12px;border-bottom:1px solid #f0efeb;font-size:13.5px}
tbody tr{transition:background .15s}tbody tr:hover{background:#faf9f6}
td.p{font-weight:600}.role{color:var(--muted);font-size:12px;margin-top:2px}
td.num{font-variant-numeric:tabular-nums;text-align:right;font-size:13px}
tr:last-child td{border-bottom:0}
.hbar{display:flex;align-items:center;gap:12px;padding:8px 0}
.hbar .lbl{width:190px;font-size:13px;flex-shrink:0}
.hbar .track{flex:1;height:10px;border-radius:99px;background:#f0efeb;overflow:hidden}
.hbar .fill{height:100%;border-radius:99px;background:var(--brand);opacity:.75;transform:scaleX(0);transform-origin:left;transition:transform .8s cubic-bezier(.22,1,.36,1)}
.in .hbar .fill{transform:scaleX(1)}
.hbar .val{width:120px;text-align:right;font-variant-numeric:tabular-nums;font-size:12.5px;color:var(--muted);flex-shrink:0}
.fnote{border-top:1px solid var(--line);padding-top:14px;font-size:12.5px;color:var(--faint);line-height:1.7;max-width:820px}
.fnote-h{font-family:GeistMono,ui-monospace,Menlo,monospace;font-size:10px;letter-spacing:.16em;text-transform:uppercase;color:var(--faint);margin-bottom:6px}
.fnote li{margin:3px 0 3px 16px}
.pn{display:flex;justify-content:space-between;margin-top:56px;padding-top:18px;border-top:1px solid var(--line)}
.pn a{font-size:13px;color:var(--brand);font-weight:600}
.foot{margin-top:64px;padding-top:18px;border-top:1px solid var(--line);font-family:GeistMono,ui-monospace,Menlo,monospace;font-size:10.5px;color:var(--faint)}
.reveal{opacity:0;transform:translateY(22px);transition:opacity .65s cubic-bezier(.22,1,.36,1),transform .65s cubic-bezier(.22,1,.36,1)}
.reveal.in{opacity:1;transform:none}
.bar{transform:scaleY(0);transform-origin:bottom;transition:transform .55s cubic-bezier(.22,1,.36,1)}
.chartv.drawn .bar{transform:scaleY(1)}
.ep{padding:18px 0;border-bottom:1px solid #f0efeb}
.method{font-family:GeistMono,ui-monospace,Menlo,monospace;font-size:10.5px;font-weight:600;letter-spacing:.08em;color:#0f766e;background:#ecfdf5;border-radius:6px;padding:3px 8px;margin-right:10px;vertical-align:middle}
.method.mcp{color:#7c3aed;background:#f5f3ff}
.path{font-size:13.5px;background:transparent;padding:0;vertical-align:middle}
.epd{font-size:13px;color:var(--muted);margin-top:7px}
.keys{margin-top:9px;display:flex;flex-wrap:wrap;gap:6px}
.key{font-family:GeistMono,ui-monospace,Menlo,monospace;font-size:10.5px;color:#57534e;background:#f5f5f4;border-radius:99px;padding:3px 9px}
.prose p{font-size:14.5px;line-height:1.75;color:#44403c;max-width:720px;margin-bottom:14px}
code{font-family:GeistMono,ui-monospace,Menlo,monospace;font-size:12px;background:#f5f5f4;padding:2px 6px;border-radius:6px}
pre{font-family:GeistMono,ui-monospace,Menlo,monospace;font-size:12px;background:#1c1917;color:#e7e5e1;padding:16px 18px;border-radius:12px;overflow-x:auto;max-width:720px}
@media (max-width:1100px){.briefs{grid-template-columns:repeat(2,1fr)}.kpis{grid-template-columns:repeat(3,1fr)}.kpi{border-right:0}}
@media (max-width:820px){
  .side{transform:translateX(-105%);transition:transform .25s cubic-bezier(.22,1,.36,1);box-shadow:8px 0 30px rgba(28,25,23,.12)}
  .side.open{transform:none}
  .topbar{display:flex;align-items:center;gap:12px;position:sticky;top:0;background:var(--paper);border-bottom:1px solid var(--line);padding:12px 16px;z-index:20}
  .burger{width:34px;height:34px;border:1px solid var(--line);border-radius:9px;background:var(--card);display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:15px}
  .topbar .tl{font-family:GeistMono,ui-monospace,Menlo,monospace;font-size:12.5px}
  .main{margin-left:0;padding:0 16px 60px}
  .briefs{grid-template-columns:1fr!important}.kpis{grid-template-columns:repeat(2,1fr)}
  .big{font-size:40px}
  .scrim{position:fixed;inset:0;background:rgba(28,25,23,.25);z-index:25;opacity:0;pointer-events:none;transition:opacity .2s}
  .scrim.open{opacity:1;pointer-events:auto}
}
@media (prefers-reduced-motion: reduce){.reveal,.bar,.hbar .fill,.side{transition:none!important;opacity:1!important;transform:none!important}}
`

const JS = `
const ease=t=>t>=1?1:1-Math.pow(2,-10*t)
function countUp(el,target,dec=0,dur=1600){const s=performance.now();const tick=n=>{const t=ease(Math.min((n-s)/dur,1));el.textContent=(target*t).toLocaleString('en-US',{minimumFractionDigits:dec,maximumFractionDigits:dec});if(t<1)requestAnimationFrame(tick)};requestAnimationFrame(tick)}
document.querySelectorAll('.cnt').forEach(el=>countUp(el,Number(el.dataset.v),Number(el.dataset.dec||0)))
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:0.15})
document.querySelectorAll('.reveal').forEach(el=>io.observe(el))
const big=document.getElementById('bignum')
if(big){countUp(big,Number(big.dataset.v),0,2000);const rate=Number(big.dataset.rate);let t0=performance.now();setTimeout(()=>setInterval(()=>{const est=Number(big.dataset.v)+(performance.now()-t0)/1000*rate;big.innerHTML=Math.floor(est).toLocaleString('en-US').replace(/(\\d{3})$/,'<span class="live-digits">$1</span>')},1000),2200)}
const UNITS={compact:v=>v>=1e12?(v/1e12).toFixed(2)+'T':v>=1e9?(v/1e9).toFixed(1)+'B':v>=1e6?(v/1e6).toFixed(1)+'M':v>=1e3?(v/1e3).toFixed(1)+'K':String(Math.round(v)),usd:v=>'$'+UNITS.compact(v),full:v=>Number(v).toLocaleString('en-US'),usdfull:v=>'$'+Number(v).toLocaleString('en-US')}
function drawChart(box){
  const all=JSON.parse(box.dataset.series)
  if(!box._mode)box._mode={range:box.dataset.default||'ALL',field:'v'}
  const mode=box._mode
  const N={'7D':7,'30D':30,'60D':60,'90D':90,'8W':8,'26W':26,'12M':12}[mode.range]
  const series=N?all.slice(-N):all
  const unitName=mode.field==='v2'?(box.dataset.unit2||'compact'):(box.dataset.unit||'compact')
  const unit=UNITS[unitName]
  const fullUnit=UNITS[unitName==='usd'?'usdfull':'full']
  const W=1040,H=190,n=series.length,slot=W/n,bw=Math.min(20,slot*0.72)
  const max=Math.max(...series.map(r=>r[mode.field]||0))||1
  let s=''
  for(const t of [0.5,1])s+='<line x1="0" y1="'+(166-146*t)+'" x2="'+W+'" y2="'+(166-146*t)+'" stroke="#efede8" stroke-dasharray="2 4"/><text x="'+W+'" y="'+(162-146*t)+'" text-anchor="end" fill="#a8a29e" font-size="10" font-family="GeistMono,Menlo,monospace">'+unit(max*t)+'</text>'
  series.forEach((r,i)=>{const v=r[mode.field]||0;const bh=(v/max)*146;s+='<rect class="bar" data-i="'+i+'" style="transition-delay:'+Math.min(i*8,400)+'ms" x="'+(i*slot+(slot-bw)/2)+'" y="'+(166-bh)+'" width="'+bw+'" height="'+Math.max(bh,0.5)+'" rx="3" fill="#0f766e" opacity="'+(i===n-1?1:0.55)+'"/>'})
  s+='<text x="0" y="184" fill="#a8a29e" font-size="10" font-family="GeistMono,Menlo,monospace">'+series[0].l+'</text><text x="'+W+'" y="184" text-anchor="end" fill="#a8a29e" font-size="10" font-family="GeistMono,Menlo,monospace">'+series[n-1].l+'</text>'
  box.classList.remove('drawn')
  box.innerHTML='<svg viewBox="0 0 '+W+' '+H+'" width="100%">'+s+'</svg><div class="tip"></div>'
  requestAnimationFrame(()=>requestAnimationFrame(()=>box.classList.add('drawn')))
  const svg=box.querySelector('svg'),tip=box.querySelector('.tip')
  let hi=null
  const bars=()=>svg.querySelectorAll('.bar')
  svg.addEventListener('mousemove',e=>{
    const r=svg.getBoundingClientRect();const x=(e.clientX-r.left)/r.width*W
    const i=Math.max(0,Math.min(n-1,Math.floor(x/slot)))
    const row=series[i];if(!row)return
    if(hi)hi.setAttribute('opacity',Number(hi.dataset.i)===n-1?1:0.55)
    hi=bars()[i];if(hi)hi.setAttribute('opacity',1)
    tip.innerHTML=row.l+' · <span class="tv">'+fullUnit(row[mode.field]||0)+'</span>'
    const v=row[mode.field]||0
    tip.style.left=((i*slot+slot/2)/W*r.width)+'px'
    tip.style.top=((166-(v/max)*146)/H*r.height)+'px'
    tip.style.opacity=1
  })
  svg.addEventListener('mouseleave',()=>{tip.style.opacity=0;if(hi)hi.setAttribute('opacity',Number(hi.dataset.i)===n-1?1:0.55)})
}
document.querySelectorAll('.chartv').forEach(drawChart)
document.querySelectorAll('.pills[data-for]').forEach(p=>{
  p.addEventListener('click',e=>{
    const pill=e.target.closest('.pill');if(!pill)return
    pill.parentElement.querySelectorAll('.pill').forEach(x=>{if((x.dataset.range&&pill.dataset.range)||(x.dataset.field&&pill.dataset.field))x.classList.remove('on')})
    pill.classList.add('on')
    const box=document.getElementById(p.dataset.for)
    if(pill.dataset.range)box._mode.range=pill.dataset.range
    if(pill.dataset.field)box._mode.field=pill.dataset.field
    drawChart(box)
  })
})
const burger=document.querySelector('.burger'),side=document.querySelector('.side'),scrim=document.querySelector('.scrim')
if(burger){burger.addEventListener('click',()=>{side.classList.toggle('open');scrim.classList.toggle('open')});scrim.addEventListener('click',()=>{side.classList.remove('open');scrim.classList.remove('open')})}
if(location.hash==='#test-tooltip'){setTimeout(()=>{
  const firstPills=document.querySelector('.pills[data-for]')
  if(firstPills){const p=firstPills.querySelector('.pill');if(p)p.click()}
  const box=document.querySelector('.chartv'),svg=box&&box.querySelector('svg')
  if(svg){const r=svg.getBoundingClientRect()
  svg.dispatchEvent(new MouseEvent('mousemove',{clientX:r.left+r.width*0.6,clientY:r.top+60,bubbles:true}))}
},1200)}
`

const shell = (slug, title, content) => `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><rect width=%22100%22 height=%22100%22 rx=%2220%22 fill=%22%230f766e%22/><text x=%2250%22 y=%2272%22 font-size=%2264%22 text-anchor=%22middle%22 fill=%22white%22 font-family=%22monospace%22>a</text></svg>"><title>${title} · agent economy dashboard</title><style>${CSS}</style><script async src="https://www.googletagmanager.com/gtag/js?id=G-S6D2WTWRGZ"></script><script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)};gtag("js",new Date());gtag("config","G-S6D2WTWRGZ")</script></head><body>
<div class="scrim"></div>
<div class="side"><div class="logo">[<b>agenteconomy</b><span class="to">.to</span>]</div><div class="nav">
${NAV.map(g => (g.group ? `<div class="h">${g.group}</div>` : '') + g.items.map(([s, l]) => `<a href="${s === 'index' ? '/' : '/' + s}"${s === slug ? ' class="on"' : ''}>${l}</a>`).join('')).join('')}
</div></div>
<div class="topbar"><div class="burger">☰</div><div class="tl">[<b>agenteconomy</b>.to] · ${title}</div></div>
<div class="main">
<div class="pagebar"><h1>${title}</h1><div class="stamp"><span class="dot"></span>LIVE · UPDATED ${updatedLabel}</div></div>
${content}
<div class="foot">Every number on this page is recomputable from agenteconomy.to/data.json — free, no key, CORS-open</div>
</div><script>${JS}</script></body></html>`

// ── builders ─────────────────────────────────────────────────────────────────
let chartSeq = 0
function chartBox(title, sub, series, { unit = 'compact', unit2, ranges, fields, def } = {}) {
  const id = 'ch' + (++chartSeq)
  const pills = []
  if (fields) fields.forEach((f, i) => pills.push(`<span class="pill${i === 0 ? ' on' : ''}" data-field="${f.field}">${f.label}</span>`))
  if (ranges) for (const r of ranges) pills.push(`<span class="pill${r === def ? ' on' : ''}" data-range="${r}">${r}</span>`)
  return `<div class="card pad"><div class="chart-top"><div class="t">${title}</div>${pills.length ? `<div class="pills" data-for="${id}">${pills.join('')}</div>` : ''}</div><div class="chart-sub">${sub}</div><div class="chartv" id="${id}" data-series='${JSON.stringify(series).replace(/'/g, '&#39;')}' data-unit="${unit}"${unit2 ? ` data-unit2="${unit2}"` : ''} data-default="${def || 'ALL'}"></div></div>`
}
const hbars = (rows, unit = fmt) => rows.map(r => {
  const max = Math.max(...rows.map(x => x.value))
  return `<div class="hbar"><div class="lbl">${r.label}</div><div class="track"><div class="fill" style="width:${max ? (r.value / max) * 100 : 0}%"></div></div><div class="val">${unit(r.value)}${r.note ? ` · ${r.note}` : ''}</div></div>`
}).join('')
const kpis = items => `<div class="kpis" style="--n:${items.length}">${items.map(k => `<div class="kpi"><div class="l">${k.l}</div><div class="v">${k.v}</div>${k.f ? `<div class="f">${k.f}</div>` : ''}</div>`).join('')}</div>`
const sec = (kick, h, inner) => `<div class="sec reveal"><div class="kick">${kick}</div><h2>${h}</h2>${inner}</div>`
const fnotes = list => `<div class="sec reveal"><div class="fnote"><div class="fnote-h">Notes · how to read</div><ul>${list.map(x => `<li>${x}</li>`).join('')}</ul></div></div>`
const PROTO_ORDER = ['x402', 'olas', 'virtuals-acp', 'erc-8004', 'tempo-mpp', 'base-agentic', 'masumi']
const PROTO_NAMES = { 'x402': 'x402', 'olas': 'Olas', 'virtuals-acp': 'Virtuals ACP', 'erc-8004': 'ERC-8004', 'tempo-mpp': 'Tempo MPP', 'base-agentic': 'Base agentic', 'masumi': 'Masumi' }
const prevNext = slug => { const i = PROTO_ORDER.indexOf(slug); const L = PROTO_ORDER.length; const p = PROTO_ORDER[(i + L - 1) % L], n = PROTO_ORDER[(i + 1) % L]; return `<div class="pn"><a href="/${p}">← ${PROTO_NAMES[p]}</a><a href="/${n}">${PROTO_NAMES[n]} →</a></div>` }

// ── overview ─────────────────────────────────────────────────────────────────
const totalEvents = d.x402.totalTxs + d.olas.totalTxs + d.virtualsAcp.totalMemos + d.erc8004Registry.totalAgents + d.baseAgentic.totalTxs + d.tempoMpp.totalEvents + w.masumi.totalTxs
const xDaily = closed(d.x402.daily)
const lastDay = xDaily.at(-1)
const perSec = lastDay.txs / 86400
const regC = closed(d.erc8004Registry.daily); const acpC = closed(d.virtualsAcp.daily)
const BRIEF = [
  { tag: 'PAYMENTS', c: '#0f766e', bg: '#ecfdf5', href: '/x402', n: fmt(lastDay.txs), s: `x402 settlements on ${lastDay.day} — the daily pulse of agent payments.`, cta: 'Open x402 →' },
  { tag: 'CONCENTRATION', c: '#b45309', bg: '#fffbeb', href: '/x402', n: d.x402.protocols[0].share + '%', s: `${d.x402.protocols[0].name}'s share of all x402 settlements — the facilitator layer is still concentrated.`, cta: 'Open facilitators →' },
  { tag: 'IDENTITY', c: '#1d4ed8', bg: '#eff6ff', href: '/erc-8004', n: fmt(regC.at(-1).agents), s: `new agents registered in ERC-8004 registries on ${regC.at(-1).day}.`, cta: 'Open registry →' },
  { tag: 'COMMERCE', c: '#7c3aed', bg: '#f5f3ff', href: '/virtuals-acp', n: fmt(acpC.at(-1).memos), s: `Virtuals ACP commerce memos recorded on ${acpC.at(-1).day}.`, cta: 'Open ACP →' },
]
const spark = series => { if (!series || !series.length) return '<span style="font-family:GeistMono,Menlo,monospace;font-size:10px;color:#a8a29e">totals only</span>'; const max = Math.max(...series); const n = series.length; return `<svg width="96" height="18" viewBox="0 0 96 18">${series.map((v, i) => `<rect x="${i * (96 / n)}" y="${18 - (max ? v / max : 0) * 16}" width="${96 / n - 1.4}" height="${(max ? v / max : 0) * 16}" rx="1" fill="#0f766e" opacity="0.55"/>`).join('')}</svg>` }
const IDX = [
  { slug: 'x402', role: 'HTTP-native agent payments', ev: d.x402.totalTxs, unit: 'settlements', extra: ` · $${compact(d.x402.totalVolume)} settled`, grain: '28 days', s: xDaily.slice(-28).map(r => r.txs) },
  { slug: 'olas', role: 'Autonomous agent network', ev: d.olas.totalTxs, unit: 'agent transactions', grain: '28 weeks', s: d.olas.weekly.slice(-28).map(r => r.txs) },
  { slug: 'virtuals-acp', role: 'Agent-to-agent commerce', ev: d.virtualsAcp.totalMemos, unit: 'commerce memos', grain: '28 days', s: acpC.slice(-28).map(r => r.memos) },
  { slug: 'erc-8004', role: 'Agent identity registry', ev: d.erc8004Registry.totalAgents, unit: 'registered agents', grain: '28 days', s: regC.slice(-28).map(r => r.agents) },
  { slug: 'tempo-mpp', role: 'Machine payment channels', ev: d.tempoMpp.totalEvents, unit: 'channel events', grain: '28 days', s: closed(d.tempoMpp.daily).slice(-28).map(r => r.events) },
  { slug: 'base-agentic', role: 'Ecosystem context', ev: d.baseAgentic.totalTxs, unit: 'ecosystem transactions', grain: '28 days', s: closed(d.baseAgentic.daily).slice(-28).map(r => r.total) },
  { slug: 'masumi', role: 'Agent escrow payments (Cardano)', ev: w.masumi.totalTxs, unit: 'escrow transactions', grain: 'totals', s: null },
]
const OFFCHAIN = [
  { href: '/market', l: 'Agent token basket', v: '$' + compact(w.agentTokens.basketMcap), s: 'Curated 4-token market cap — the price the market puts on the sector.', cta: 'Market →' },
  { href: '/agent-supply', l: 'MCP servers listed', v: compact(w.agentSupply.officialMcpServers), s: 'Machine-callable services agents can reach, from a complete registry count.', cta: 'Agent supply →' },
  { href: '/standards-adoption', l: 'Domains shipping UCP', v: compact((w.standardsAdoption.rows.find(r => r.check === 'ucp') || {}).value || 0), s: `Agent standards on the open web · week of ${w.standardsAdoption.meta.date.slice(5)}.`, cta: 'Standards →' },
  { href: '/demand-developers', l: 'Inference · 30d', v: compact(w.inferenceDemand.days.reduce((s2, r) => s2 + r.tokens, 0)) + ' tokens', s: 'Demand-side signal: how much model inference the agent era is buying.', cta: 'Demand & devs →' },
]
const overview = `
<div class="hero">
  <div class="eyebrow">Events indexed by agenteconomy · live</div>
  <div class="big"><span id="bignum" data-v="${totalEvents}" data-rate="${perSec.toFixed(4)}">0</span></div>
  <div class="runrate">+${perSec.toFixed(2)} x402 settlements per second · run-rate from the latest complete day (${lastDay.day}) · recalibrates when new data lands</div>
  ${kpis([
    { l: 'USD settled · x402', v: `$<span class="cnt" data-v="${(d.x402.totalVolume / 1e6).toFixed(1)}" data-dec="1">0</span>M` },
    { l: 'Agents registered', v: `<span class="cnt" data-v="${(d.erc8004Registry.totalAgents / 1e3).toFixed(1)}" data-dec="1">0</span>K` },
    { l: 'Protocol families', v: `<span class="cnt" data-v="7">0</span>` },
    { l: 'Chains covered', v: `<span class="cnt" data-v="12">0</span>+` },
    { l: `Daily x402 · ${lastDay.day.slice(5)}`, v: `<span class="cnt" data-v="${(lastDay.txs / 1e3).toFixed(1)}" data-dec="1">0</span>K` },
  ])}
</div>
${sec('The brief · latest complete day', 'What the agents did today.', `<div class="briefs">${BRIEF.map(b => `<a class="card brief" href="${b.href}"><span class="tag" style="color:${b.c};background:${b.bg}">${b.tag}</span><div class="n">${b.n}</div><div class="s">${b.s}</div><div class="cta">${b.cta}</div></a>`).join('')}</div>`)}
${sec('x402 · daily settlements', 'The daily pulse.', chartBox('x402 transactions per day', 'Measured from public on-chain settlement activity · hover any bar for the exact figure', xDaily.slice(-90).map(r => ({ l: r.day.slice(5), v: r.txs })), { ranges: ['7D', '30D', '60D', '90D'], def: '60D' }))}
${sec('The protocols', 'Payments, commerce, identity — each measured on-chain.', `<div class="briefs" style="grid-template-columns:repeat(3,1fr)">${IDX.map(r => `<a class="card brief" href="/${r.slug}"><div style="display:flex;justify-content:space-between;align-items:baseline"><span style="font-weight:650;font-size:15px">${PROTO_NAMES[r.slug]}</span><span class="tag" style="color:#78716c;background:#f5f5f4">${r.grain}</span></div><div class="n">${compact(r.ev)}</div><div class="chart-sub" style="margin:0">${r.unit}${r.extra || ''}</div><div style="margin:10px 0 4px">${spark(r.s)}</div><div class="s" style="min-height:38px">${r.role}.</div><div class="cta">Open ${PROTO_NAMES[r.slug]} →</div></a>`).join('')}</div>`)}
${sec('Sourced off-chain', 'The world around the protocols.', `<div class="briefs">${OFFCHAIN.map(b => `<a class="card brief" href="${b.href}"><span class="tag" style="color:#78716c;background:#f5f5f4">${b.l.toUpperCase()}</span><div class="n" style="font-size:25px">${b.v}</div><div class="s">${b.s}</div><div class="cta">${b.cta}</div></a>`).join('')}</div>`)}`
writeFileSync(join(DIST, 'index.html'), shell('index', 'Agent economy overview', overview))

// ── protocol pages ───────────────────────────────────────────────────────────
function protoPage(slug, { kpiItems, charts = [], split, noteList }) {
  const body = `
${kpis(kpiItems)}
${charts.map(c => sec(c.kick, c.h2, c.html)).join('')}
${split ? sec(split.kick || 'Split', split.h2, `<div class="card pad">${split.html}</div>`) : ''}
${fnotes(noteList)}
${prevNext(slug)}`
  writeFileSync(join(DIST, `${slug}.html`), shell(slug, PROTO_NAMES[slug], body))
}
protoPage('x402', {
  kpiItems: [
    { l: 'Cumulative transactions', v: `<span class="cnt" data-v="${(d.x402.totalTxs / 1e6).toFixed(1)}" data-dec="1">0</span>M`, f: fmt(d.x402.totalTxs) },
    { l: 'USD settled', v: '$' + compact(d.x402.totalVolume), f: '$' + fmt(d.x402.totalVolume) },
    { l: 'USDC share · 30d Base', v: (w.x402TokenSplit?.usdcSharePct ?? '—') + '%', f: 'volume-weighted' },
    { l: 'Facilitators', v: d.x402.facilitatorsTracked, f: 'community registry' },
    { l: 'Chains', v: d.x402.chainsTracked, f: 'EVM + Solana' },
  ],
  charts: [
    { kick: 'Daily', h2: 'Daily settlements.', html: chartBox('x402 transactions per day', 'Hover any bar for the exact figure', xDaily.slice(-90).map(r => ({ l: r.day.slice(5), v: r.txs })), { ranges: ['7D', '30D', '60D', '90D'], def: '60D' }) },
    { kick: 'Monthly', h2: 'The monthly picture — count and dollars.', html: chartBox('x402 by month', 'Transactions or settled USD volume — switch with the tabs', d.x402.monthly.map(m => ({ l: m.month, v: m.txs, v2: m.vol })), { fields: [{ label: 'TRANSACTIONS', field: 'v' }, { label: 'VOLUME $', field: 'v2' }], unit: 'compact', unit2: 'usd' }) },
  ],
  split: { kick: 'Distribution', h2: 'Where it settles, who settles it.', html: `<div class="chart-sub" style="margin-bottom:6px">Facilitator share of settlements</div>${hbars(d.x402.protocols.map(p => ({ label: p.name, value: p.share })), v => v + '%')}<div class="chart-sub" style="margin:18px 0 6px">Chain split — snapshot · June 2026 · not yet live</div>${hbars(d.x402.chains.map(c => ({ label: c.name, value: c.txs })), compact)}` },
  noteList: [
    'Settlement counts include tests, infrastructure traffic and repeated service calls — real protocol activity, not verified end-user commerce.',
    `USDC share is a trailing-30-day, Base-only, volume-weighted figure (${fmt(w.x402TokenSplit?.totalPayments ?? 0)} payments in window).`,
    'Source: public Dune queries over facilitator-initiated transfers (EVM + Solana), refreshed daily.',
  ],
})
const olasW = d.olas.weekly
protoPage('olas', {
  kpiItems: [
    { l: 'Cumulative transactions', v: compact(d.olas.totalTxs), f: fmt(d.olas.totalTxs) },
    { l: 'Chains', v: d.olas.chains.length, f: 'Gnosis-led' },
    { l: 'Largest chain', v: d.olas.chains[0].name, f: `${((d.olas.chains[0].txs / d.olas.totalTxs) * 100).toFixed(1)}% of total` },
    { l: `Weekly · week of ${olasW.at(-1).week.slice(5)}`, v: compact(olasW.at(-1).txs), f: fmt(olasW.at(-1).txs) },
  ],
  charts: [{ kick: 'Weekly', h2: 'Weekly transactions.', html: chartBox('Olas transactions per week', 'Weekly totals · hover for exact figures', olasW.slice(-52).map(r => ({ l: r.week.slice(5), v: r.txs })), { ranges: ['8W', '26W'], def: '26W' }) }],
  split: { kick: 'Chains', h2: 'Chain distribution.', html: hbars(d.olas.chains.map(c => ({ label: c.name, value: c.txs })), compact) },
  noteList: ['Olas services run continuously — the tracked unit is autonomous-agent transaction activity, not payments.', 'Gnosis dominance is a property of the measured source; read the aggregate curve as mostly Gnosis.'],
})
protoPage('virtuals-acp', {
  kpiItems: [
    { l: 'Cumulative memos', v: compact(d.virtualsAcp.totalMemos), f: fmt(d.virtualsAcp.totalMemos) },
    { l: `Daily memos · ${acpC.at(-1).day.slice(5)}`, v: fmt(acpC.at(-1).memos), f: 'latest complete day' },
    { l: 'Unique senders · same day', v: fmt(acpC.at(-1).senders), f: 'addresses, not people' },
    { l: 'Gross agentic value', v: '$' + compact(w.virtuals.aggregates.grossAgenticUsd), f: 'summed from per-agent records' },
    { l: 'Total jobs', v: compact(w.virtuals.aggregates.totalJobs), f: 'summed from per-agent records' },
  ],
  charts: [{ kick: 'Daily', h2: 'Daily commerce memos.', html: chartBox('ACP memos per day', 'Decoded from Base logs — the only independent ACP tracker', acpC.slice(-90).map(r => ({ l: r.day.slice(5), v: r.memos })), { ranges: ['7D', '30D', '60D', '90D'], def: '60D' }) }],
  split: null,
  noteList: ['A memo is a lifecycle step (request → negotiation → transaction → evaluation), not a completed sale — memo counts overstate completed commerce.', 'Memo counts are decoded from on-chain NewMemo events; gross value and jobs are summed across every registered agent\'s public record — both independently computed, neither taken from the platform\'s own stats page.'],
})
protoPage('erc-8004', {
  kpiItems: [
    { l: 'Registered agents', v: compact(d.erc8004Registry.totalAgents), f: fmt(d.erc8004Registry.totalAgents) },
    { l: 'Chains', v: d.erc8004Registry.chainsTracked, f: 'mainnets only' },
    { l: 'Largest chain', v: d.erc8004Registry.chains[0].name, f: fmt(d.erc8004Registry.chains[0].agents) + ' agents' },
    { l: `Daily · ${regC.at(-1).day.slice(5)}`, v: fmt(regC.at(-1).agents), f: 'latest complete day' },
  ],
  charts: [{ kick: 'Daily', h2: 'Daily registrations.', html: chartBox('New ERC-8004 agents per day', 'Registered events, testnets excluded', regC.slice(-90).map(r => ({ l: r.day.slice(5), v: r.agents })), { ranges: ['7D', '30D', '60D', '90D'], def: '60D' }) }],
  split: { kick: 'Chains', h2: 'Registrations by chain.', html: hbars(d.erc8004Registry.chains.slice(0, 10).map(c => ({ label: c.name, value: c.agents })), compact) },
  noteList: ['An identity count, not an activity count: registering is one transaction; a registered agent may be active, dormant, or abandoned.', 'Registration is cheap — one campaign on one chain can move the total quickly; watch the per-chain split.'],
})
const tD = closed(d.tempoMpp.daily)
protoPage('tempo-mpp', {
  kpiItems: [
    { l: 'Total events', v: fmt(d.tempoMpp.totalEvents), f: 'since mainnet debut' },
    { l: 'Unique payers', v: fmt(d.tempoMpp.uniquePayers), f: 'addresses' },
    { l: 'Unique payees', v: fmt(d.tempoMpp.uniquePayees), f: 'addresses' },
    { l: `Daily · ${tD.at(-1).day.slice(5)}`, v: fmt(tD.at(-1).events), f: 'latest complete day' },
  ],
  charts: [{ kick: 'Daily', h2: 'Daily channel events.', html: chartBox('Tempo MPP events per day', 'Measured directly from the Tempo chain', tD.slice(-90).map(r => ({ l: r.day.slice(5), v: r.events })), { ranges: ['7D', '30D', '60D', '90D'], def: '60D' }) }],
  split: { kick: 'Types', h2: 'Event type breakdown.', html: hbars(Object.entries(d.tempoMpp.byType || {}).sort((a, b) => b[1] - a[1]).map(([k, v]) => ({ label: k, value: v })), fmt) },
  noteList: ['Early-adoption numbers, measured first-hand since mainnet debut — narrow but nobody else has the full history.', 'Address counts are not customer counts; channel events are not payments one-to-one.'],
})
const bD = closed(d.baseAgentic.daily)
protoPage('base-agentic', {
  kpiItems: [
    { l: 'Tracked-window txs', v: compact(d.baseAgentic.totalTxs), f: fmt(d.baseAgentic.totalTxs) },
    { l: `Daily total · ${bD.at(-1).day.slice(5)}`, v: fmt(bD.at(-1).total), f: 'latest complete day' },
    { l: 'Consumer · same day', v: fmt(bD.at(-1).consumer), f: 'curated category' },
    { l: 'Infrastructure · same day', v: fmt(bD.at(-1).infrastructure), f: 'curated category' },
  ],
  charts: [{ kick: 'Daily', h2: 'Daily ecosystem activity.', html: chartBox('Base agentic transactions per day', 'Curated agent-related contracts', bD.slice(-90).map(r => ({ l: r.day.slice(5), v: r.total })), { ranges: ['7D', '30D', '60D', '90D'], def: '60D' }) }],
  split: { kick: 'Categories', h2: 'Consumer vs infrastructure.', html: hbars([{ label: 'Consumer', value: bD.at(-1).consumer }, { label: 'Infrastructure', value: bD.at(-1).infrastructure }], fmt) },
  noteList: ['The loosest unit in the dataset: contract categorization is curated upstream and evolves — ecosystem context, never folded into protocol headlines.'],
})
protoPage('masumi', {
  kpiItems: [
    { l: 'Escrow transactions', v: compact(w.masumi.totalTxs), f: fmt(w.masumi.totalTxs) },
    { l: 'Chain', v: 'Cardano', f: 'mainnet payment contract' },
    { l: 'As of', v: new Date(w.masumi.asOf).toISOString().slice(5, 10), f: 'refreshed with the feed' },
  ],
  charts: [],
  split: null,
  noteList: [
    'Transactions on the Masumi mainnet payment (escrow) contract, counted via the public Koios API and cross-verified against the Masumi explorer.',
    'The feed currently carries the cumulative total only — a time series lands when the source exposes one. We show what is measured, not an interpolation.',
  ],
})

// ── context + reference pages ────────────────────────────────────────────────
const mkPage = (slug, title, body) => writeFileSync(join(DIST, `${slug}.html`), shell(slug, title, body))
mkPage('market', 'Market', `
${kpis([
  { l: 'Agent token basket mcap', v: '$' + compact(w.agentTokens.basketMcap), f: '4 curated tokens' },
  { l: 'Basket 24h volume', v: '$' + compact(w.agentTokens.basketVol24h), f: 'trading volume' },
  { l: 'As of', v: new Date(w.updatedAt).toISOString().slice(5, 10), f: 'refreshed 6-hourly' },
])}
${sec('Token basket', 'Four tokens, one honest basket.', `<div class="card" style="padding:6px 18px"><table><thead><tr><th>Token</th><th>Role</th><th style="text-align:right">Market cap</th><th style="text-align:right">24h</th></tr></thead><tbody>
${w.agentTokens.basket.map(t => `<tr><td class="p">${t.label} <span class="role" style="display:inline">· ${t.symbol}</span></td><td class="role">${t.note}</td><td class="num">$${compact(t.mcap)}</td><td class="num" style="color:${t.change24h >= 0 ? 'var(--live)' : 'var(--down)'}">${t.change24h >= 0 ? '+' : ''}${t.change24h.toFixed(2)}%</td></tr>`).join('')}
</tbody></table></div>`)}
${fnotes([`Curated basket (FET/KITE/VIRTUAL/OLAS) — deliberately NOT CoinGecko's broad "AI Agents" category ($${compact(w.agentTokens.categories[0]?.mcap || 0)}, memecoin-contaminated), which is shown here only as reference.`, 'Market data is off-chain context, kept apart from measured on-chain activity.'])}`)
mkPage('agent-supply', 'Agent supply', `
${kpis([
  { l: 'Official MCP servers', v: compact(w.agentSupply.officialMcpServers), f: 'complete registry count' },
  { l: 'Smithery servers', v: compact(w.agentSupply.smitheryMcpServers), f: 'overlaps official' },
  { l: 'Virtuals launched', v: compact(w.virtuals.launchedAgents), f: 'platform total' },
  { l: 'x402 providers', v: fmt(w.x402Services.uniqueProviders), f: 'unique domains' },
  { l: 'Solana agent accounts', v: fmt(w.solanaAgents?.totalAccounts ?? 0), f: 'upper bound' },
])}
${sec('Supply by source', 'Where agents and services register.', `<div class="card pad">${hbars([
  { label: 'Official MCP registry', value: w.agentSupply.officialMcpServers },
  { label: 'Smithery directory', value: w.agentSupply.smitheryMcpServers },
  { label: 'Virtuals launched agents', value: w.virtuals.launchedAgents },
  { label: 'Virtuals ACP agents', value: w.virtuals.acpRegisteredAgents },
  { label: 'x402 provider domains', value: w.x402Services.uniqueProviders },
  ...(w.solanaAgents?.registries ?? []).map(r => ({ label: r.label, value: r.accounts })),
], compact)}</div>`)}
${fnotes(['Directories overlap in unknown proportion — never sum across rows.', 'Solana counts come directly from on-chain registry programs — an upper bound of registrations, not active agents.', `Catalog context: ${fmt(w.x402Services.totalListings)} raw listings, top-2 hosts ≈ ${w.x402Services.top2SharePct}% of them — listings churn hard, provider domains (${fmt(w.x402Services.uniqueProviders)}) are the stable unit.`])}`)
const sa = w.standardsAdoption
const AGENT_CHECKS = [['ucp', 'UCP'], ['mcpServerCard', 'MCP server card'], ['agentSkills', 'Agent skills'], ['webBotAuth', 'web-bot-auth'], ['a2aAgentCard', 'A2A agent card'], ['acp', 'ACP'], ['mpp', 'MPP'], ['x402', 'x402'], ['ap2', 'AP2']]
const saMap = Object.fromEntries(sa.rows.map(r => [r.check, r.value]))
mkPage('standards-adoption', 'Standards adoption', `
${kpis([
  { l: 'Domains scanned', v: compact(sa.meta.successfulDomains), f: `of ${compact(sa.meta.totalDomains)} attempted` },
  { l: 'Scan week', v: `week of ${sa.meta.date.slice(5)}`, f: 'Cloudflare Radar · weekly' },
  { l: 'Standards tracked', v: AGENT_CHECKS.length, f: 'agent-facing checks' },
])}
${sec('Agent standards on the open web', 'Who actually ships the new rails.', `<div class="card pad"><div class="chart-sub" style="margin-bottom:6px">Domains exposing each standard · week of ${sa.meta.date}</div>${hbars(AGENT_CHECKS.map(([k, l]) => ({ label: l, value: saMap[k] ?? 0 })), fmt)}</div>`)}
${sec('Web-infra context', 'The baseline the agent web builds on.', `<div class="card pad">${hbars([['robotsTxt', 'robots.txt'], ['robotsTxtAiRules', 'robots.txt AI rules'], ['sitemap', 'sitemap'], ['oauthDiscovery', 'OAuth discovery'], ['contentSignals', 'content signals']].map(([k, l]) => ({ label: l, value: saMap[k] ?? 0 })), fmt)}</div>`)}
${fnotes([`Weekly scan of ${fmt(sa.meta.successfulDomains)} popular domains by Cloudflare Radar — figures describe the scan week, not a single day.`, 'Denominators differ per check (x402 only meaningful for paid-content sites) — never compare shares across standards without this footnote.', 'UCP figure is suspected over-detection upstream; treat as ceiling.'])}`)
const infDays = w.inferenceDemand.days
mkPage('demand-developers', 'Demand & developers', `
${kpis([
  { l: 'Inference · 30d tokens', v: compact(infDays.reduce((s2, r) => s2 + r.tokens, 0)), f: 'OpenRouter, tokenizer-specific' },
  { l: `Daily tokens · ${infDays.at(-1).date.slice(5)}`, v: compact(infDays.at(-1).tokens), f: 'latest full day' },
  { l: 'SDK downloads / week', v: compact(w.devAdoption.totalWeeklyAvg4w), f: '9-package basket, 4-week avg' },
])}
${sec('Demand side', 'Inference volume, day by day.', chartBox('OpenRouter tokens per day', 'Demand-side context for the agent economy · hover for exact figures', infDays.map(r => ({ l: r.date.slice(5), v: r.tokens })), { ranges: ['7D', '30D'], def: '30D' }))}
${sec('Supply side · developers', 'Payment-SDK adoption.', `<div class="card" style="padding:6px 18px"><table><thead><tr><th>Package</th><th>Registry</th><th style="text-align:right">Weekly avg (4w)</th></tr></thead><tbody>
${w.devAdoption.components.map(c => `<tr><td class="p">${c.pkg}</td><td class="role">${c.registry}</td><td class="num">${fmt(c.weeklyAvg4w)}</td></tr>`).join('')}
</tbody></table></div>`)}
${fnotes(['Recomputing? Do not sum @x402/core with its dependent packages — that double-counts.', 'Token counts are tokenizer-specific; use the trend, not cross-provider comparisons.'])}`)
mkPage('methodology', 'Methodology', `
${sec('Pipeline', 'From public chains to one file.', `<div class="card pad prose">
<p><b>1 · Pull.</b> Public chain data, read directly from the chains and from open Dune queries. No private feeds, no platform self-reporting.</p>
<p><b>2 · Decode.</b> Events are decoded and normalized per protocol family: settlements, registrations, memos, channel events — deliberately not blended into one unit.</p>
<p><b>3 · Aggregate.</b> Daily and weekly series, each carrying its own freshness stamp; cumulative totals grow monotonically and never restate history silently.</p>
<p><b>4 · Publish.</b> One open file per axis: <code>data.json</code> (measured on-chain) and <code>web-sources.json</code> (sourced off-chain). Free, open, no key required.</p></div>`)}
${sec('Reading the numbers', 'Three things to know before you quote us.', `<div class="card pad" style="font-size:13px;color:var(--muted);line-height:1.7"><ul style="margin-left:18px">
<li>Daily figures use the latest FULLY COMPLETE UTC day — if our number differs from a live tracker, that is usually why.</li>
<li>Units are deliberately not blended: settlement activity is not audited commerce, and identity counts are not active agents. Each section states what its number actually measures.</li>
<li>Anything the pipeline cannot fully measure is omitted and flagged — never estimated.</li></ul></div>`)}
${sec('Sources & attribution', 'Standing on public, credited work.', `<div class="card" style="padding:6px 18px"><table><thead><tr><th>Source</th><th>Author</th><th style="text-align:right">Reference</th></tr></thead><tbody>
${d.sources.map(sr => `<tr><td class="p">${sr.name}</td><td class="role">${sr.author}</td><td class="num">Dune query ${sr.queryId}</td></tr>`).join('')}
<tr><td class="p">Tempo MPP indexer</td><td class="role">agenteconomy (first-hand)</td><td class="num">Tempo RPC</td></tr>
<tr><td class="p">Masumi escrow count</td><td class="role">Koios public API</td><td class="num">Cardano</td></tr>
<tr><td class="p">Standards scan</td><td class="role">Cloudflare Radar</td><td class="num">weekly</td></tr>
<tr><td class="p">Inference tokens</td><td class="role">OpenRouter</td><td class="num">public datasets</td></tr>
<tr><td class="p">Token market</td><td class="role">CoinGecko</td><td class="num">public API</td></tr>
</tbody></table></div>`)}`)
mkPage('data-api', 'Data API', `
${sec('Feeds', 'Everything the dashboard shows, as JSON.', `<div class="card" style="padding:8px 24px">
  <div class="ep"><span class="method">GET</span><code class="path">https://agenteconomy.to/data.json</code>
    <div class="epd">On-chain feed (measured)</div>
    <div class="keys">${['x402', 'olas', 'virtualsAcp', 'erc8004Registry', 'baseAgentic', 'tempoMpp', 'sources', 'updatedAt'].map(k => `<span class="key">${k}</span>`).join('')}</div></div>
  <div class="ep"><span class="method">GET</span><code class="path">https://agenteconomy.to/web-sources.json</code>
    <div class="epd">Off-chain feed (sourced)</div>
    <div class="keys">${['agentTokens', 'x402Services', 'agentSupply', 'virtuals', 'devAdoption', 'masumi', 'solanaAgents', 'standardsAdoption', 'inferenceDemand', 'x402TokenSplit'].map(k => `<span class="key">${k}</span>`).join('')}</div></div>
  <div class="ep"><span class="method">GET</span><code class="path">https://agenteconomy.to/openapi.json</code>
    <div class="epd">OpenAPI 3.1 contract — every field, unit, and example</div></div>
  <div class="ep" style="border-bottom:0"><span class="method mcp">MCP</span><code class="path">https://agenteconomy.to/api/mcp</code>
    <div class="epd">Model Context Protocol server · read-only · no auth</div>
    <div class="keys">${['list_protocols', 'get_protocol', 'get_off_chain', 'get_data_freshness'].map(k => `<span class="key">${k}</span>`).join('')}</div></div>
</div>
<div class="chart-sub" style="margin:14px 2px 6px">No API key · no signup · CORS-open · try it:</div>
<pre>curl -s https://agenteconomy.to/data.json | jq '.x402.totalTxs'</pre>`)}
${fnotes(['Suggested citation: "…according to agenteconomy.to (agenteconomy.to/data.json)."', 'Monthly State of the Agent Economy reports live on the apex site: agenteconomy.to/reports.', 'Pipeline and site are built in the open: github.com/realdora/agenteconomy.'])}`)
for (const f of readdirSync(join(ROOT, 'fonts'))) copyFileSync(join(ROOT, 'fonts', f), join(DIST, 'fonts', f))
// The apex site proxies /data.json + /web-sources.json from this domain — the
// contract MUST survive the cutover, so the feeds ship inside every deploy.
for (const f of ['data.json', 'web-sources.json', 'tempo-data.json']) {
  if (existsSync(join(DATA, f))) copyFileSync(join(DATA, f), join(DIST, f))
}
writeFileSync(join(DIST, 'robots.txt'), ['User-Agent: *', 'Allow: /', '', ...['GPTBot', 'ClaudeBot', 'PerplexityBot', 'Google-Extended', 'anthropic-ai', 'CCBot', 'ChatGPT-User', 'Bingbot'].flatMap(b => [`User-Agent: ${b}`, 'Allow: /', '']), ''].join('\n'))
writeFileSync(join(DIST, 'vercel.json'), JSON.stringify({
  cleanUrls: true,
  trailingSlash: false,
  redirects: [{ source: '/data', destination: '/data-api', permanent: true }],
  headers: [
    { source: '/(data|web-sources|tempo-data).json', headers: [{ key: 'Access-Control-Allow-Origin', value: '*' }, { key: 'Cache-Control', value: 's-maxage=300, stale-while-revalidate=600' }] },
    { source: '/fonts/(.*)', headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }] },
  ],
}, null, 2))
console.log('dashboard build: 14 pages + feeds + robots + vercel.json -> dist/')
