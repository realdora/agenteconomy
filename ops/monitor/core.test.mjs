import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { inspectFeeds, inspectRuns, inspectEvents, notificationPlan, monitorHealthy, WORKFLOWS } from './core.mjs'
const now = Date.parse('2026-09-15T21:00:00Z')
const base = JSON.parse(readFileSync(new URL('../../public/data.json', import.meta.url)))
const web = JSON.parse(readFileSync(new URL('../../public/web-sources.json', import.meta.url)))
const tempo = JSON.parse(readFileSync(new URL('../../public/tempo-data.json', import.meta.url)))
const feeds = () => ({ canonical: structuredClone(base), apex: structuredClone(base), dashboard: structuredClone(base), web, tempo })
test('stale chain coverage cannot hide behind a fresh execution or overall timestamp', () => {
  const f = feeds(); f.canonical.updatedAt = new Date(now).toISOString()
  f.canonical.meta.queries.x402Chains.executedAt = new Date(now).toISOString()
  f.canonical.x402.chainsAsOf = '2026-08-19T10:27:46Z'
  assert.ok(inspectFeeds(f, {}, now).issues.some(i => i.id === 'coverage.x402Chains'))
})
test('missing optional source and missing day are visible; missing is not zero', () => {
  const f = feeds(); delete f.canonical.meta.queries.x402TokenSplit
  f.canonical.x402.daily = f.canonical.x402.daily.filter(r => r.day !== '2026-09-12')
  const ids = inspectFeeds(f, {}, now).issues.map(i => i.id)
  assert.ok(ids.includes('source.x402TokenSplit')); assert.ok(ids.includes('gap.x402Daily'))
})
test('bad values do not replace last good comparison baseline', () => {
  const f = feeds(); f.canonical.x402.totalTxs = 0
  const result = inspectFeeds(f, { 'x402.totalTxs': 100000000 }, now)
  assert.ok(result.issues.some(i => i.id === 'drop.x402.totalTxs'))
  assert.equal(result.observations['x402.totalTxs'], 100000000)
})
test('normal is quiet, first alert immediate, persistent reminder after 24h, recovery once', () => {
  const issues = [{ id: 'coverage.x402Chains', detail: 'stale' }]
  assert.equal(notificationPlan({}, [], now), null)
  assert.equal(notificationPlan({}, issues, now).kind, 'alert')
  const sent = { notifiedIds: ['coverage.x402Chains'], lastSentAt: new Date(now).toISOString() }
  assert.equal(notificationPlan(sent, issues, now + 23 * 3600000), null)
  assert.equal(notificationPlan(sent, issues, now + 24 * 3600000).kind, 'reminder')
  assert.equal(notificationPlan(sent, [], now + 1000).kind, 'recovery')
  assert.equal(notificationPlan({ notifiedIds: [] }, [], now + 2000), null)
})
test('different issue triggers notification without waiting for tomorrow', () => {
  const state = { notifiedIds: ['old'], lastSentAt: new Date(now).toISOString() }
  assert.equal(notificationPlan(state, [{ id: 'new', detail: 'failed' }], now).kind, 'alert')
})
test('missed job is detected even without failure event; old failure replaced by recovery', () => {
  const runs = WORKFLOWS.map((name, i) => ({ name, id: i + 2, head_branch: 'main', status: 'completed', conclusion: 'success', updated_at: new Date(now).toISOString() }))
  assert.deepEqual(inspectRuns(runs, now), [])
  assert.ok(inspectRuns(runs.slice(1), now).some(i => i.id === 'task.missing.Update Dune Data'))
  runs.push({ ...runs[0], id: 1, conclusion: 'failure' })
  assert.deepEqual(inspectRuns(runs, now), [])
})
test('independent daily heartbeat catches a missed check on the same morning', () => {
  const previous = { lastDailyAt: '2026-09-14T07:17:00Z' }
  assert.equal(monitorHealthy(previous, Date.parse('2026-09-15T07:00:00Z'), true), true)
  assert.equal(monitorHealthy(previous, Date.parse('2026-09-15T08:47:00Z'), true), false)
  assert.equal(monitorHealthy({ lastDailyAt: '2026-09-15T07:17:00Z' }, Date.parse('2026-09-15T08:47:00Z'), true), true)
})
test('callback watchdog supports existing state and detects missing, late and failed jobs', () => {
  const events = Object.fromEntries(WORKFLOWS.map((name, id) => [name, { id: id + 1, conclusion: 'success', at: new Date(now).toISOString() }]))
  assert.deepEqual(inspectEvents(events, now), [])
  assert.equal(inspectEvents({}, now).length, 4)
  events['Update Dune Data'].completedAt = new Date(now - 31 * 3600000).toISOString()
  assert.ok(inspectEvents(events, now).some(i => i.id === 'task.missing.Update Dune Data'))
  events['Update Dune Data'].completedAt = new Date(now).toISOString()
  events['Update Dune Data'].conclusion = 'failure'
  assert.ok(inspectEvents(events, now).some(i => i.id === 'task.failed.Update Dune Data'))
  events['Update Dune Data'].conclusion = 'success'
  assert.deepEqual(inspectEvents(events, now), [])
})
