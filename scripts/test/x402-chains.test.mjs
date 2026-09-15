import { test } from 'node:test'
import assert from 'node:assert/strict'
import { chainWindowTotals, foldChainWindow, selectUsagePeriod } from '../dune/x402-chains-lib.mjs'

const base = { cutoff: '2026-09-11', counts: { base: 100, solana: 200 } }
const rows = [
  { day: '2026-09-10', blockchain: 'base', total_txn: 9000 },
  { day: '2026-09-11', blockchain: 'base', total_txn: 5 },
  { day: '2026-09-11', blockchain: 'solana', total_txn: 7 },
  { day: '2026-09-12', blockchain: 'base', total_txn: 9 },
].map(r => ({ ...r, window_start: '2026-09-10', window_end: '2026-09-13' }))

test('overlapping backfill never adds closed history twice; folding preserves totals', () => {
  const expected = { counts: { base: 114, solana: 207 }, coveredThrough: '2026-09-12T23:59:59.999Z' }
  assert.deepEqual(chainWindowTotals(base, rows), expected)
  const folded = foldChainWindow(base, rows, '2026-09-12')
  assert.deepEqual(folded.counts, { base: 105, solana: 207 })
  assert.deepEqual(chainWindowTotals(folded, rows), expected)
  assert.deepEqual(chainWindowTotals(base, rows), expected)
})
test('missing day, gap, duplicate, bad count and invalid fold fail closed', () => {
  assert.throws(() => chainWindowTotals(base, rows.slice(0, -1)))
  assert.throws(() => chainWindowTotals(base, [...rows, rows[1]]))
  assert.throws(() => chainWindowTotals(base, rows.map(r => ({ ...r, window_start: '2026-09-12' }))))
  assert.throws(() => chainWindowTotals(base, rows.map(r => ({ ...r, total_txn: -1 }))))
  assert.throws(() => foldChainWindow(base, rows, '2026-09-14'))
})
test('use active billing period, never malformed trailing zero period', () => {
  const active = { start_date: '2026-09-10', end_date: '2026-09-24', credits_used: 234.833, credits_included: 2500 }
  const invalid = { start_date: '2026-09-24', end_date: '2026-09-15', credits_used: 0, credits_included: 0 }
  assert.equal(selectUsagePeriod({ billing_periods: [active, invalid] }, '2026-09-15'), active)
  assert.throws(() => selectUsagePeriod({ billing_periods: [invalid] }, '2026-09-15'))
  assert.throws(() => selectUsagePeriod({ billing_periods: [active, active] }, '2026-09-15'))
})
