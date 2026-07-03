// scripts/dune/dune-api.mjs — minimal Dune API client for the baseline tools.
// READ-heavy by design: result reads don't execute queries. Executions are
// explicit and single (these tools never loop executions — account hygiene).

const BASE = process.env.DUNE_API_BASE || 'https://api.dune.com/api/v1'
const sleep = ms => new Promise(r => setTimeout(r, ms))
const performanceTier = () => process.env.DUNE_PERFORMANCE || ''

function key() {
  const k = process.env.DUNE_API_KEY
  if (!k) throw new Error('Missing DUNE_API_KEY')
  return k
}

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: { 'x-dune-api-key': key(), ...(options.body ? { 'Content-Type': 'application/json' } : {}) },
  })
  const text = await res.text()
  let json = {}
  try { json = JSON.parse(text) } catch { json = { raw: text } }
  if (!res.ok) {
    const e = new Error(json?.error?.message || json?.message || text || `HTTP ${res.status}`)
    e.status = res.status
    throw e
  }
  return json
}

// READ the latest stored result (no execution, cheap).
export async function getLatestResult(queryId, limit = 20000) {
  const payload = await request(`/query/${queryId}/results?limit=${limit}&allow_partial_results=true`)
  if (payload?.error) throw new Error(`query ${queryId} latest result is an error: ${payload.error.message || JSON.stringify(payload.error)}`)
  return {
    rows: payload?.result?.rows || [],
    executionId: payload.execution_id || null,
    executedAt: payload.execution_ended_at || payload.submitted_at || null,
  }
}

// ONE execution + poll. Used only when a stored result doesn't cover the
// period being frozen. Slow polling, small engine, single shot.
export async function executeOnce(queryId, { windowStart, limit = 20000, timeoutMs = 10 * 60 * 1000 } = {}) {
  const started = await request(`/query/${queryId}/execute`, {
    method: 'POST',
    body: JSON.stringify({
      ...(performanceTier() ? { performance: performanceTier() } : {}),
      ...(windowStart ? { query_parameters: { window_start: windowStart } } : {}),
    }),
  })
  if (!started.execution_id) throw new Error(`query ${queryId}: execute response missing execution_id`)
  const t0 = Date.now()
  while (Date.now() - t0 < timeoutMs) {
    const status = await request(`/execution/${started.execution_id}/status`)
    if (status.state === 'QUERY_STATE_COMPLETED' || status.state === 'QUERY_STATE_COMPLETED_PARTIAL') {
      const payload = await request(`/execution/${started.execution_id}/results?limit=${limit}&allow_partial_results=true`)
      return {
        rows: payload?.result?.rows || [],
        executionId: started.execution_id,
        executedAt: payload.execution_ended_at || new Date().toISOString(),
      }
    }
    if (['QUERY_STATE_FAILED', 'QUERY_STATE_CANCELED', 'QUERY_STATE_CANCELLED', 'QUERY_STATE_EXPIRED'].includes(status.state)) {
      throw new Error(`query ${queryId}: execution ${started.execution_id} ${status?.error?.message || status.state}`)
    }
    await sleep(5000)
  }
  throw new Error(`query ${queryId}: execution timed out`)
}
