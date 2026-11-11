import test from 'node:test'
import assert from 'node:assert/strict'
import { chooseWindow, mergeByDay, parseAcpRows, parseSourceRows, rollupSources, summarizeSources, reconcileWithRegistry } from './lib.mjs'

test('window: normal run rescans the last three complete days', () => {
  assert.deepEqual(chooseWindow({ today: '2026-11-11', lastStoredDay: '2026-11-10' }), { start: '2026-11-08', end: '2026-11-10' })
  assert.deepEqual(chooseWindow({ today: '2026-11-11' }), { start: '2026-11-08', end: '2026-11-10' })
})

test('window: stretches after an outage but never past maxDays', () => {
  assert.equal(chooseWindow({ today: '2026-11-11', lastStoredDay: '2026-11-05' }).start, '2026-11-06')
  assert.equal(chooseWindow({ today: '2026-11-11', lastStoredDay: '2026-09-01' }).start, '2026-11-01')
})

test('window: override is explicit and validated', () => {
  assert.equal(chooseWindow({ today: '2026-11-11', override: '2026-10-01' }).start, '2026-10-01')
  assert.throws(() => chooseWindow({ today: '2026-11-11', override: '2026-11-11' }))
  assert.throws(() => chooseWindow({ today: '2026-11-11', override: 'yesterday' }))
})

test('merge: window days are replaced, older days kept, empty days dropped', () => {
  const stored = [{ day: '2026-11-07', v: 1 }, { day: '2026-11-08', v: 2 }, { day: '2026-11-09', v: 3 }]
  const fresh = [{ day: '2026-11-08', v: 20 }, { day: '2026-11-10', v: 40 }, { day: '2026-11-11', v: 99 }]
  assert.deepEqual(mergeByDay(stored, fresh, { start: '2026-11-08', end: '2026-11-10' }),
    [{ day: '2026-11-07', v: 1 }, { day: '2026-11-08', v: 20 }, { day: '2026-11-10', v: 40 }])
})

test('parse: ACP rows, and bad counts are rejected', () => {
  const row = { period: '2026-11-10 00:00:00.000 UTC', blockchain: 'base', jobs_created: 31, jobs_funded: 31, jobs_submitted: 31, jobs_completed: 30, jobs_rejected: 0, unique_clients: 4, unique_providers: 5 }
  assert.deepEqual(parseAcpRows([row])[0], { day: '2026-11-10', chain: 'base', created: 31, funded: 31, submitted: 31, completed: 30, rejected: 0, clients: 4, providers: 5 })
  assert.throws(() => parseAcpRows([{ ...row, jobs_created: 'n/a' }]))
})

const REG = '0x8004a169fb4a3325136eb29fa0ceb6d2e539a432'
const src = (day, chain, source, registered, contract = REG) => ({ period: `${day} 00:00:00.000 UTC`, blockchain: chain, contract_address: contract, source, registered, unique_owners: registered })

test('sources: rollup, summary and testnet filter', () => {
  const rows = parseSourceRows([
    src('2026-11-09', 'arc', 'bulk.example', 900),
    src('2026-11-09', 'base', 'bulk.example', 50),
    src('2026-11-09', 'base', 'small.example', 40),
    src('2026-11-09', 'bnb', '(long tail)', 10, '0xABC'),
    src('2026-11-09', 'sepolia', 'bulk.example', 5000),
    src('2026-11-10', 'base', 'small.example', 100),
  ], new Set(['sepolia']))
  const rollup = rollupSources(rows, { registry: REG })
  assert.deepEqual(rollup[0], { day: '2026-11-09', total: 1000, canonicalRegistry: 990, exLargestSource: 50,
    topSources: [{ source: 'bulk.example', registered: 950 }, { source: 'small.example', registered: 40 }] })
  const s = summarizeSources(rollup, 7)
  assert.equal(s.total, 1100)
  assert.equal(s.largestSource, 'bulk.example')
  assert.equal(s.largestShare, 0.864)
  assert.equal(s.exLargest, 150)
  assert.equal(summarizeSources([], 7), null)
})

test('reconcile: complete days must match; the last published day is skipped as partial', () => {
  const rollup = [{ day: '2026-11-07', total: 6730 }, { day: '2026-11-08', total: 6248 }, { day: '2026-11-09', total: 7039 }]
  const published = [{ day: '2026-11-07', agents: 6730 }, { day: '2026-11-08', agents: 6248 }, { day: '2026-11-09', agents: 1282 }]
  assert.deepEqual(reconcileWithRegistry(rollup, published), { compared: 2, mismatches: [] })
  published[1].agents = 6000
  assert.equal(reconcileWithRegistry(rollup, published).mismatches.length, 1)
})
