// Closed-month editions. Never recompute a published edition from rolling feeds.
const DAY = 86400000;
export const FIRST_MONTH = '2026-06';
export function bounds(month) {
  if (!/^20\d\d-(0[1-9]|1[0-2])$/.test(month)) throw Error('Invalid month');
  const [y, m] = month.split('-').map(Number);
  return { start: `${month}-01`, end: new Date(Date.UTC(y, m, 1)).toISOString().slice(0, 10) };
}
export function previousMonth(month) {
  return new Date(Date.parse(bounds(month).start) - DAY).toISOString().slice(0, 7);
}
function days(start, end, step = 1) {
  const out = [];
  for (let t = Date.parse(start); t < Date.parse(end); t += step * DAY) out.push(new Date(t).toISOString().slice(0, 10));
  return out;
}
function mergeRows(a = [], b = [], dateKey) {
  const out = new Map();
  for (const rows of [a, b]) {
    const seen = new Set();
    for (const row of rows) {
      const date = String(row[dateKey] ?? '').slice(0, 10);
      if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || new Date(date).toISOString().slice(0, 10) !== date) throw Error('Invalid row date');
      if (seen.has(date)) throw Error(`Duplicate ${dateKey}: ${date}`);
      seen.add(date); out.set(date, row);
    }
  }
  return [...out.values()];
}
function freshThrough(asOf, end, now) {
  const t = Date.parse(asOf);
  return Number.isFinite(t) && t >= Date.parse(end) && t <= now.getTime() + 300000;
}
function value(v, integer = true) {
  return typeof v === 'number' && Number.isFinite(v) && v >= 0 && (!integer || Number.isSafeInteger(v));
}
export function buildEdition(month, { data, baselines, tempo }, { now = new Date(), source = {}, revision = 1, note = 'First fixed edition.' } = {}) {
  const { start, end } = bounds(month);
  // Allows final daily folds and the last week starting in the month to close.
  if (Date.parse(end) + 8 * DAY > now.getTime()) return null;
  const metrics = [], omissions = [];
  function omit(label, reason) { omissions.push(`${label}: ${reason}; omitted, not zero.`); }
  const queries = data.meta?.queries ?? {};
  const xAsOf = queries.x402Cumulative?.executedAt ?? data.x402?.asOf;
  const label = new Date(start).toLocaleDateString('en-US', { month: 'short', year: '2-digit', timeZone: 'UTC' });
  const live = (data.x402?.monthly ?? []).filter(r => r.month === label || r.month === month);
  const frozen = (baselines.x402?.monthly ?? []).filter(r => r.month === month);
  if (live.length > 1 || frozen.length > 1) throw Error('Duplicate x402 month');
  // A baseline month is closed only when its cutoff is past the month end.
  const row = live[0] ?? (baselines.x402?.cutoff >= end ? frozen[0] : undefined);
  const coverage = data.x402?.coverage ?? baselines.x402?.coverage;
  if (row && value(row.txs) && value(row.vol, false) && freshThrough(xAsOf, end, now) && coverage?.registryVersion && coverage?.expandedCoverageFrom) {
    const boundary = coverage.expandedCoverageFrom;
    const comparisonKey = end <= boundary ? 'x402:legacy-before-2026-09-16' : start >= boundary ? `x402:${coverage.registryVersion}` : `x402:mixed:${month}`;
    for (const [id, title, field, unit] of [['x402Txs','x402 transactions','txs','count'], ['x402Volume','x402 settled volume','vol','USD']]) {
      metrics.push({ id, family: 'x402', label: title, value: row[field], unit, grain: 'month', start, end, sourceAsOf: xAsOf, comparisonKey, rows: [{ date: start, value: row[field] }], note: coverage.note ?? 'Tracked-address scope; not a complete census of agent commerce.' });
    }
  } else omit('x402', 'closed-month aggregate or documented coverage is unavailable');
  for (const [family, id, title, field] of [
    ['erc8004Registry','ercRegistrations','New ERC-8004 registrations','agents'],
    ['virtualsAcp','acpMemos','Virtuals ACP memos','memos'],
    ['baseAgentic','baseTransactions','Base agentic-ecosystem transactions','total'],
    ['tempoMpp','tempoEvents','Tempo MPP events','events'],
  ]) {
    const asOf = family === 'tempoMpp' ? tempo?.updatedAt : queries[family]?.executedAt ?? data[family]?.asOf;
    const rows = mergeRows(baselines[family]?.daily, data[family]?.daily, 'day').filter(r => r.day >= start && r.day < end);
    const expected = days(start, end), dates = new Set(rows.map(r => r.day));
    if (!freshThrough(asOf, end, now) || expected.some(d => !dates.has(d)) || rows.length !== expected.length || rows.some(r => !value(r[field]))) {
      omit(title, 'a full set of dated daily observations and a post-close source timestamp are not available'); continue;
    }
    const evidence = rows.map(r => ({ date: r.day, value: r[field] })).sort((a,b) => a.date.localeCompare(b.date));
    metrics.push({ id, family, label: title, value: evidence.reduce((s,r) => s+r.value,0), unit: 'count', grain: 'day', start, end, sourceAsOf: asOf, comparisonKey: `${family}:v1`, rows: evidence });
  }
  const olasAsOf = queries.olas?.executedAt ?? data.olas?.asOf;
  const weeks = days(start, end).filter(d => new Date(d).getUTCDay() === 1);
  const weekEnd = new Date(Date.parse(weeks.at(-1)) + 7 * DAY).toISOString().slice(0,10);
  const weekly = mergeRows(baselines.olas?.weekly, data.olas?.weekly, 'week').filter(r => r.week >= start && r.week < end);
  if (freshThrough(olasAsOf, weekEnd, now) && weekly.length === weeks.length && weeks.every(d => weekly.some(r => r.week === d)) && weekly.every(r => value(r.txs))) {
    const evidence = weekly.map(r => ({ date:r.week,value:r.txs })).sort((a,b) => a.date.localeCompare(b.date));
    metrics.push({ id:'olasTransactions', family:'olas', label:'Olas transactions (weeks starting in month)', value:evidence.reduce((s,r)=>s+r.value,0), unit:'count', grain:'week', start, end:weekEnd, sourceAsOf:olasAsOf, comparisonKey:'olas:weeks-starting:v1', rows:evidence, note:'Complete weeks starting in the month; not a calendar-month total.' });
  } else omit('Olas', 'not all complete weeks starting in this month are available');
  if (metrics.filter(m=>m.family==='x402').length !== 2 || new Set(metrics.map(m=>m.family)).size < 3) return null;
  return { month, revision, publishedAt:now.toISOString(), note, source, metrics, omissions };
}
export function appendEdition(catalog, edition) {
  bounds(edition.month);
  for (const m of edition.metrics) {
    if (!value(m.value, m.unit !== 'USD') || !m.rows.length || m.rows.some(r => !value(r.value, m.unit !== 'USD')) || new Set(m.rows.map(r=>r.date)).size !== m.rows.length || Math.abs(m.rows.reduce((s,r)=>s+r.value,0)-m.value)>0.000001) throw Error('Edition evidence must reconcile before publication');
  }
  const previous = catalog.reports[edition.month]?.revisions ?? [];
  if (edition.revision !== previous.length + 1) throw Error('Revision must append; published editions cannot be overwritten');
  if (previous.length && (!edition.note || edition.note === 'First fixed edition.')) throw Error('A correction needs an explanation');
  const next = structuredClone(catalog);
  // Pin comparisons to a specific prior edition too: a later correction to
  // last month must not silently rewrite this month's published growth rates.
  const priorMonth = previousMonth(edition.month);
  const priorEdition = catalog.reports[priorMonth]?.revisions.at(-1);
  const frozenEdition = structuredClone(edition);
  frozenEdition.metrics = frozenEdition.metrics.map(metric => {
    const prior = priorEdition?.metrics.find(m => m.id === metric.id);
    return { ...metric, momPct:comparableChange(metric, prior), comparison:prior ? { month:priorMonth,revision:priorEdition.revision,value:prior.value,comparisonKey:prior.comparisonKey } : null };
  });
  next.reports[edition.month] = { revisions:[...previous,frozenEdition] };
  next.updatedAt = edition.publishedAt;
  return next;
}
export function comparableChange(metric, previous) {
  return previous && previous.value > 0 && metric.comparisonKey === previous.comparisonKey && metric.grain !== 'week'
    ? Math.round((metric.value / previous.value - 1) * 1000) / 10 : null;
}
