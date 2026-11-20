import { test } from 'node:test'
import assert from 'node:assert/strict'
import { applyCoverageBackfill } from '../dune/coverage-backfill.mjs'
import { extendRegistry } from '../dune/owned/registry-lib.mjs'
const addr = '0x' + 'a'.repeat(40)
const revision = { version: 'v2', backfillFrom: '2026-09-16', reviewedAt: '2026-10-22', addresses: [{ address: addr, facilitator: 'Coinbase', chain: 'base' }] }
const baseline = { x402: { cutoff: '2026-09-18', totalTxs: 100, totalVolume: 10, monthly: [{ month: '2026-09', txs: 100, vol: 10 }], protocols: [{ name: 'Coinbase', txs: 50, vol: 2 }], source: 'test' }, x402Daily: { cutoff: '2026-09-18', daily: [{ day: '2026-09-17', txs: 90 }], source: 'test' }, x402Chains: { cutoff: '2026-09-18', counts: { base: 100 }, source: 'test' } }
const row = { day: '2026-09-17', address: addr, daily_txs: 11, transfer_txs: 10, volume: 1, usdc_txs: 9 }
test('frozen boundary is exclusive and tx/transfer scopes stay distinct', () => {
  const { baselines: b } = applyCoverageBackfill(baseline, [row, { ...row, day: '2026-09-18' }], revision)
  assert.equal(b.x402.totalTxs, 110); assert.equal(b.x402Daily.daily[0].txs, 101); assert.equal(b.x402Chains.counts.base, 110)
  assert.equal(baseline.x402.totalTxs, 100)
  assert.throws(() => applyCoverageBackfill(b, [row], revision), /already applied/)
})
test('duplicate or out-of-scope deltas fail before applying', () => {
  assert.throws(() => applyCoverageBackfill(baseline, [row, row], revision), /duplicate/)
  assert.throws(() => applyCoverageBackfill(baseline, [{ ...row, day: '2026-09-15' }], revision), /Invalid/)
  assert.throws(() => extendRegistry(`SELECT ${addr}`, '6057445', revision.addresses), /already present/)
  assert.throws(() => extendRegistry('SELECT 1', '6057445', [...revision.addresses, ...revision.addresses]), /Duplicate/)
})
test('scoped extensions only extend the registries they name', () => {
  const celo = { address: '0x' + 'b'.repeat(40), facilitator: 'Celo', chain: 'celo', registries: ['6054244'] }
  assert.match(extendRegistry('SELECT 1', '6054244', [celo]), /\(0xb{40}, 'Celo', 'celo'\)/)
  assert.equal(extendRegistry('SELECT 1', '6057445', [celo]), 'SELECT 1')
  // A scoped address already present elsewhere does not block the registry it targets.
  assert.equal(extendRegistry(`SELECT ${celo.address}`, '6057445', [celo]), `SELECT ${celo.address}`)
  // Unscoped additions keep extending both registries (the Coinbase extension).
  for (const id of ['6054244', '6057445']) assert.match(extendRegistry('SELECT 1', id, revision.addresses), /'Coinbase', 'base'/)
})
test('extensions outside the reviewed facilitator/chain pairs are refused', () => {
  for (const bad of [{ facilitator: 'Celo', chain: 'base' }, { facilitator: 'Coinbase', chain: 'celo' }, { facilitator: "x'); DROP", chain: 'base' }])
    assert.throws(() => extendRegistry('SELECT 1', '6054244', [{ address: addr, ...bad }]), /Unreviewed/)
})
test('shipped manifest adds the Celo signer to x402 daily only', async () => {
  const { readFileSync } = await import('node:fs')
  const read = f => readFileSync(new URL(`../dune/owned/generated/${f}`, import.meta.url), 'utf8').toLowerCase()
  const signer = '0x0d74d5cefd2e7f24e623330ebe3d8d4cb45ffb48'
  assert.match(read('x402Daily.sql'), new RegExp(`\\(${signer}, 'celo', 'celo'\\)`))
  // Cumulative already carries it once via the frozen Chris registry; the extension must not add a second row.
  const uses = readFileSync(new URL('../dune/owned/templates/x402Cumulative.sql', import.meta.url), 'utf8').replace(/--[^\n]*/g, '').match(/\bquery_6057445\b/g).length
  assert.equal(read('x402Cumulative.sql').split(`${signer} , 'celo')`).length - 1, uses)
  assert.ok(!read('x402Cumulative.sql').includes(`(${signer}, 'celo', 'celo')`))
})
