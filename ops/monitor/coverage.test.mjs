import { test } from 'node:test'
import assert from 'node:assert/strict'
import { currentCoinbaseBaseAddresses, inspectX402Coverage } from './coverage.mjs'
const a='0x'+'a'.repeat(40), b='0x'+'b'.repeat(40)
const source=`[Network.BASE]: [{ address: '${a}', tokens: [] }, { address: '${b}', deprecated: true }], [Network.SOLANA]: []`
const data={meta:{queries:{x402Daily:{executedAt:'2026-10-22T02:00:00Z'}}},x402:{coverage:{coinbaseBaseAddresses:[a]},daily:Array.from({length:10},(_,i)=>({day:`2026-10-${String(i+13).padStart(2,'0')}`,txs:i<7?10000:10})),recentFacilitators:[{day:'2026-10-21',project:'Coinbase',txs:10}]}}
const now=Date.parse('2026-10-23T07:00:00Z')
test('reference drift reports missing addresses, ignoring deprecated addresses',()=>{
 assert.deepEqual(currentCoinbaseBaseAddresses(source),[a])
 const d=structuredClone(data);d.x402.coverage.coinbaseBaseAddresses=[]
 assert.ok(inspectX402Coverage(d,{source},{},now).issues.some(i=>i.id==='registry.coinbaseBase'))
 assert.ok(inspectX402Coverage(d,{error:'HTTP 503'},{},now).issues.some(i=>i.id==='registry.reference'))
})
test('two complete day drops alert; partial collection day cannot create a false recovery',()=>{
 assert.ok(inspectX402Coverage(data,{source},{},now).issues.some(i=>i.id==='activity.x402Drop'))
 const d=structuredClone(data);d.x402.daily[8].txs=10000
 assert.ok(!inspectX402Coverage(d,{source},{},now).issues.some(i=>i.id==='activity.x402Drop'))
})
test('disappearing major contributor remains an alert on same-day callbacks',()=>{
 const prior={'x402.facilitatorDay':{day:'2026-10-20',counts:{Coinbase:10000}}}
 const first=inspectX402Coverage(data,{source},prior,now)
 assert.ok(first.issues.some(i=>i.id==='activity.facilitator.Coinbase'))
 const again=inspectX402Coverage(data,{source},first.observations,now)
 assert.ok(again.issues.some(i=>i.id==='activity.facilitator.Coinbase'))
})
