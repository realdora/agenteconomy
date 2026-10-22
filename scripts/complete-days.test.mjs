import test from 'node:test';
import assert from 'node:assert/strict';
import ts from 'typescript';
import fs from 'node:fs';
const source = fs.readFileSync(new URL('../lib/complete-days.ts', import.meta.url), 'utf8');
const { outputText } = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ES2022 } });
const { completeDays, x402DailyExecution } = await import('data:text/javascript;base64,' + Buffer.from(outputText).toString('base64'));
test('partial snapshot remains partial after the clock advances; dedicated query time wins', () => {
  const data = { meta: { queries: { x402Daily: { executedAt: '2026-10-22T02:21:00Z' } } }, x402: { asOf: '2026-10-23T04:00:00Z' } };
  const rows = [{ day: '2026-10-22', txs: 26 }, { day: '2026-10-21', txs: 24681 }];
  assert.deepEqual(completeDays(rows, x402DailyExecution(data), new Date('2026-10-24T12:00:00Z')), [rows[1]]);
  assert.equal(rows[0].day, '2026-10-22');
});
test('missing timestamp is not certified complete; future clock is capped at today', () => {
  const rows = [{ day: '2026-10-22' }, { day: '2026-10-21' }];
  assert.deepEqual(completeDays(rows, undefined), []);
  assert.deepEqual(completeDays(rows, '2026-10-24T00:00:00Z', new Date('2026-10-22T12:00:00Z')), [rows[1]]);
});
