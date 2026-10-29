import { test } from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import { healthyFeeds } from './fixtures/healthy-feeds.mjs'
import { currentCoinbaseBaseAddresses, inspectX402Coverage, inspectX402Page } from './coverage.mjs'
import { assertX402Contract } from '../../scripts/dune/x402-contract.mjs'
const a='0x'+'a'.repeat(40), b='0x'+'b'.repeat(40)
const source=`[Network.BASE]: [{ address: '${a}', tokens: [] }, { address: '${b}', deprecated: true }], [Network.SOLANA]: []`
const data={meta:{queries:{x402Daily:{executedAt:'2026-10-22T02:00:00Z'}}},x402:{coverage:{registryVersion:'test-v1',reviewedAt:'2026-10-22',expandedCoverageFrom:'2026-09-16',coinbaseBaseAddresses:[a]},daily:Array.from({length:9},(_,i)=>({day:`2026-10-${String(i+13).padStart(2,'0')}`,txs:i<7?10000:10})),recentFacilitators:[{day:'2026-10-21',project:'Coinbase',txs:10}]}}
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
test('missing coverage and malformed daily arrays alert instead of silently skipping or throwing',()=>{
 const d=structuredClone(data);delete d.x402.coverage;d.x402.daily={bad:true}
 const ids=inspectX402Coverage(d,{source},{},now).issues.map(i=>i.id)
 assert.ok(ids.includes('contract.x402Coverage'));assert.ok(ids.includes('registry.coinbaseBase'));assert.ok(ids.includes('contract.x402Daily'))
 assert.throws(()=>assertX402Contract(d),/refusing to publish/)
})
test('rolling lows cannot erase incident; two genuinely recovered complete days can',()=>{
 const first=inspectX402Coverage(data,{source},{},now)
 const low=structuredClone(data);low.x402.daily.forEach(r=>r.txs=10)
 const ongoing=inspectX402Coverage(low,{source},first.observations,now)
 assert.ok(ongoing.issues.some(i=>i.id==='activity.x402Drop'))
 low.x402.daily.at(-2).txs=6000;low.x402.daily.at(-1).txs=6000;low.x402.recentFacilitators[0].txs=6000
 // Recovery starts after the incident start, on two subsequent days.
 const recovered=inspectX402Coverage(low,{source},{'x402.activityDrop':{baseline:10000,since:'2026-10-19'}},now)
 assert.ok(!recovered.issues.some(i=>i.id==='activity.x402Drop'))
 assert.equal(recovered.observations['x402.activityDrop'],null)
})
test('missing contributor stays alarming on next day even after a zero comparison',()=>{
 const first=inspectX402Coverage(data,{source},{'x402.facilitatorDay':{day:'2026-10-20',counts:{Coinbase:10000}}},now)
 const next=structuredClone(data);next.meta.queries.x402Daily.executedAt='2026-10-23T02:00:00Z'
 next.x402.daily.push({day:'2026-10-22',txs:10});next.x402.recentFacilitators=[{day:'2026-10-22',project:'Other',txs:10}]
 const result=inspectX402Coverage(next,{source},first.observations,now)
 assert.ok(result.issues.some(i=>i.id==='activity.facilitator.Coinbase'))
})
test('actual October incident alerts by Oct 15 and stays open through Oct 22',()=>{
 const incident=JSON.parse(fs.readFileSync(new URL('./fixtures/x402-incident-20261022.json',import.meta.url)))
 let observations={},firstAlert=null
 for(let day=10;day<=22;day++){
   const cutoff=`2026-10-${day}`;const d=structuredClone(data)
   d.meta.queries.x402Daily.executedAt=cutoff+'T02:00:00Z'
   d.x402.daily=incident.daily.filter(r=>r.day<cutoff)
   d.x402.recentFacilitators=[];delete d.x402.coverage
   const result=inspectX402Coverage(d,{source},observations,Date.parse(cutoff+'T07:17:00Z'))
   if(result.issues.some(i=>i.id==='activity.x402Drop'))firstAlert||=cutoff
   if(day>=15)assert.ok(result.issues.some(i=>i.id==='activity.x402Drop'),cutoff)
   assert.ok(result.issues.some(i=>i.id==='registry.coinbaseBase'))
   observations=result.observations
 }
 assert.equal(firstAlert,'2026-10-15')
})
test('healthy fixture passes the publication contract; duplicate, missing groups, partial day and wrong version fail',()=>{
 const good=healthyFeeds().canonical
 assert.doesNotThrow(()=>assertX402Contract(good))
 for(const mutate of [d=>d.x402.daily.push(d.x402.daily[0]),d=>delete d.x402.recentFacilitators,d=>d.x402.daily.pop(),d=>d.x402.daily.push({day:d.meta.queries.x402Daily.executedAt.slice(0,10),txs:1})]){
   const d=structuredClone(good);mutate(d);assert.throws(()=>assertX402Contract(d))
 }
 assert.throws(()=>assertX402Contract(good,{expectedVersion:'wrong-version'}))
})
test('other facilitator coverage cannot be treated as reviewed forever',()=>{
 const result=inspectX402Coverage(data,{source},{},Date.parse('2026-11-23T07:17:00Z'))
 assert.ok(result.issues.some(i=>i.id==='registry.reviewDue'))
})
test('page verification catches stale display even when JSON is correct, with a two hour grace',()=>{
 const stale={source:'<p>recorded 26 transactions on 2026-10-22, the latest complete UTC day</p>'}
 assert.equal(inspectX402Page(data,stale,now)[0].id,'page.x402')
 assert.deepEqual(inspectX402Page(data,stale,Date.parse('2026-10-22T03:00:00Z')),[])
 assert.deepEqual(inspectX402Page(data,{source:'<p>recorded 10 transactions on 2026-10-21, the latest complete UTC day</p>'},now),[])
 assert.equal(inspectX402Page(data,{source:'new unrecognized layout'},now)[0].id,'page.x402')
})
