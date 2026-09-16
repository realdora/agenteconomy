import { test } from 'node:test'
import assert from 'node:assert/strict'
import { calendarRefreshDue } from '../dune/refresh-policy.mjs'
test('late manual runs cannot skip the next UTC day for any daily source', () => {
  const now = Date.parse('2026-09-17T02:00:00Z')
  for (const key of ['x402Cumulative', 'x402Daily', 'baseAgentic', 'virtualsAcp', 'x402TokenSplit', 'x402Chains']) {
    assert.equal(calendarRefreshDue({ key }, '2026-09-16T22:00:00Z', now), true)
    assert.equal(calendarRefreshDue({ key }, '2026-09-17T01:00:00Z', now), false)
  }
  assert.equal(calendarRefreshDue({ key: 'x402Chains', readOnly: true }, '2026-09-16T22:00:00Z', now), false)
  for (const key of ['olas', 'erc8004Registry']) assert.equal(calendarRefreshDue({ key }, '2026-09-16T22:00:00Z', now), false)
})
