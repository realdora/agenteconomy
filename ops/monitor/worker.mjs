import { DurableObject } from 'cloudflare:workers'
import { inspectFeeds, inspectEvents, notificationPlan, monitorHealthy, WORKFLOWS } from './core.mjs'

const urls = {
  canonical: 'https://raw.githubusercontent.com/realdora/agenteconomy/main/public/data.json',
  apex: 'https://agenteconomy.to/data.json',
  dashboard: 'https://dashboard.agenteconomy.to/data.json',
  tempo: 'https://raw.githubusercontent.com/realdora/agenteconomy/main/public/tempo-data.json',
  web: 'https://agenteconomy.to/web-sources.json',
}
async function collect(fetcher = fetch) {
  return Object.fromEntries(await Promise.all(Object.entries(urls).map(async ([name, url]) => {
    try {
      const response = await fetcher(url, { headers: { 'User-Agent': 'AgentEconomyDataMonitor/1.0', 'Cache-Control': 'no-cache' }, signal: AbortSignal.timeout(12000) })
      if (!response.ok) throw Error(`HTTP ${response.status}`)
      return [name, await response.json()]
    } catch (error) { return [name, { error: error.name === 'TimeoutError' ? '请求超时' : error.message }] }
  })))
}
async function sha(value) {
  return [...new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value)))].map(n => n.toString(16).padStart(2, '0')).join('')
}

// One object serializes cron and workflow callbacks, preventing duplicate sends.
export class MonitorState extends DurableObject {
  async fetch(request) {
    return this.ctx.blockConcurrencyWhile(async () => {
      const path = new URL(request.url).pathname
      const state = await this.ctx.storage.get('state') || {}
      if (path === '/status') return Response.json(state)
      const now = Date.now(), iso = new Date(now).toISOString()
      let event = null
      if (path === '/event') {
        event = await request.json()
        if (!WORKFLOWS.includes(event.name) || !Number.isSafeInteger(event.id) || !['success', 'failure', 'cancelled', 'timed_out', 'action_required'].includes(event.conclusion)) return new Response('Invalid event', { status: 400 })
        state.events ||= {}
        const previous = state.events[event.name]
        if (previous && previous.id >= event.id) return Response.json({ skipped: 'duplicate/older event' })
        if (event.completedAt && (!Number.isFinite(Date.parse(event.completedAt)) || Date.parse(event.completedAt) > now + 60000)) return new Response('Invalid completion time', { status: 400 })
        state.events[event.name] = { id: event.id, conclusion: event.conclusion, at: iso, completedAt: event.completedAt || iso }
        // Healthy success events do not run another check or send a message.
        if (event.conclusion === 'success' && !(state.issues || []).length) {
          await this.ctx.storage.put('state', state)
          return Response.json({ skipped: 'healthy success' })
        }
      }
      const test = path === '/test'
      let issues = state.issues || [], observations = state.observations || {}
      if (!test) {
        const feeds = await collect()
        const inspected = inspectFeeds(feeds, observations, now)
        issues = inspected.issues; observations = inspected.observations
        issues.push(...inspectEvents(state.events, now))
        issues = [...new Map(issues.map(i => [i.id, i])).values()]
        state.lastCheckedAt = iso
        if (path === '/daily') state.lastDailyAt = iso
        state.issues = issues; state.observations = observations
      }
      let plan = notificationPlan(state, issues, now, { test })
      // Save pending payload before sending. Same key/body can be retried after
      // an ambiguous network failure without duplicate delivery (24h window).
      if (state.pending && now - Date.parse(state.pending.at) < 86400000) plan = state.pending.plan
      else if (state.pending) {
        state.deliveryError = '上一次发信结果超过 24 小时仍不明确，需要人工核对后解除，避免重复投递。'
        await this.ctx.storage.put('state', state)
        return Response.json({ error: 'Ambiguous mail delivery requires review' }, { status: 503 })
      }
      if (plan && this.env.EMAIL_ENABLED === 'true') {
        if (!this.env.RESEND_API_KEY || !this.env.ALERT_TO || !this.env.ALERT_FROM) return new Response('Mail configuration incomplete', { status: 503 })
        state.pending ||= { at: iso, plan, key: `ae-${await sha(JSON.stringify([plan.kind, plan.ids, iso]))}` }
        await this.ctx.storage.put('state', state)
        try {
          const r = await fetch('https://api.resend.com/emails', {
            method: 'POST', signal: AbortSignal.timeout(10000),
            headers: { Authorization: `Bearer ${this.env.RESEND_API_KEY}`, 'Content-Type': 'application/json', 'Idempotency-Key': state.pending.key },
            body: JSON.stringify({ from: this.env.ALERT_FROM, to: [this.env.ALERT_TO], subject: plan.subject, text: plan.text }),
          })
          if (!r.ok) throw Error(`Email provider HTTP ${r.status}`)
          const sent = await r.json()
          if (!sent.id) throw Error('Email provider did not return message ID')
          state.lastMail = { id: sent.id, at: iso, kind: plan.kind, status: 'provider-accepted' }
          if (plan.kind !== 'test') { state.notifiedIds = plan.ids; state.lastSentAt = iso }
          delete state.pending; delete state.deliveryError
        } catch (error) { state.deliveryError = error.message }
      }
      await this.ctx.storage.put('state', state)
      return Response.json({ checkedAt: state.lastCheckedAt, issues, mail: state.lastMail, deliveryError: state.deliveryError, emailEnabled: this.env.EMAIL_ENABLED === 'true' }, { status: state.deliveryError ? 503 : 200 })
    })
  }
}

const stub = env => env.MONITOR.get(env.MONITOR.idFromName('daily-data-monitor-v1'))
export default {
  async scheduled(_event, env, ctx) {
    ctx.waitUntil(stub(env).fetch(new Request('https://internal/daily', { method: 'POST' })).then(async r => {
      if (!r.ok) throw Error(`Daily monitor failed: HTTP ${r.status}`)
    }))
  },
  async fetch(request, env) {
    const path = new URL(request.url).pathname
    if (path === '/health' && request.method === 'GET') {
      const state = await (await stub(env).fetch(new Request('https://internal/status'))).json()
      const healthy = monitorHealthy(state, Date.now(), env.EMAIL_ENABLED === 'true')
      return Response.json({ lastDailyAt: state.lastDailyAt || null, emailEnabled: env.EMAIL_ENABLED === 'true', deliveryProblem: Boolean(state.deliveryError), ok: healthy }, { status: healthy ? 200 : 503 })
    }
    if (!env.MONITOR_TOKEN || request.headers.get('Authorization') !== `Bearer ${env.MONITOR_TOKEN}`) return new Response('Unauthorized', { status: 401 })
    if (!['/status', '/daily', '/event', '/test'].includes(path)) return new Response('Not found', { status: 404 })
    if (request.method !== (path === '/status' ? 'GET' : 'POST')) return new Response('Method not allowed', { status: 405 })
    return stub(env).fetch(request)
  },
}
