import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {buildEdition, appendEdition, comparableChange} from './snapshots.mjs';
const read=p=>JSON.parse(fs.readFileSync(new URL(p,import.meta.url),'utf8'));
// Hermetic fixtures from retained first editions, never from the moving live feed.
const editions=read('../../public/monthly-reports.json').reports;
const fixtureMonths=['2026-05','2026-06','2026-07','2026-08','2026-09'];
const baseline={x402:{cutoff:'2026-10-01',monthly:[]}}, data={meta:{queries:{}},x402:{monthly:[],coverage:{registryVersion:'2026-10-22-coinbase-base-v2',expandedCoverageFrom:'2026-09-16'}}};
for(const ym of fixtureMonths){
 const ms=editions[ym].revisions[0].metrics;
 baseline.x402.monthly.push({month:ym,txs:ms.find(m=>m.id==='x402Txs').value,vol:ms.find(m=>m.id==='x402Volume').value});
 for(const [family,id,field,key]of [['erc8004Registry','ercRegistrations','agents','day'],['virtualsAcp','acpMemos','memos','day'],['baseAgentic','baseTransactions','total','day'],['olas','olasTransactions','txs','week']]){
  const grain=key==='week'?'weekly':'daily';baseline[family]??={[grain]:[]};
  baseline[family][grain].push(...ms.find(m=>m.id===id).rows.map(r=>({[key]:r.date,[field]:r.value})));
 }
}
for(const family of ['erc8004Registry','virtualsAcp','baseAgentic','olas']){
 data[family]=structuredClone(baseline[family]);if(data[family].daily)data[family].daily=data[family].daily.filter(r=>r.day>='2026-07-24');
 data.meta.queries[family]={executedAt:'2026-10-22T02:00:00Z'};
}
data.meta.queries.x402Cumulative={executedAt:'2026-10-22T02:00:00Z'};
data.x402.monthly=structuredClone(baseline.x402.monthly);
const inputs={data,baselines:baseline,tempo:{updatedAt:'2026-10-22T02:00:00Z'}};
const now=new Date('2026-10-23T00:00:00Z');
test('real July full history, not the truncated live tail',()=>{
 const e=buildEdition('2026-07',inputs,{now});
 assert.equal(e.metrics.find(m=>m.id==='ercRegistrations').value,101956);
 assert.equal(e.metrics.find(m=>m.id==='acpMemos').value,7269);
 assert.equal(e.metrics.find(m=>m.id==='ercRegistrations').rows.length,31);
});
test('missing day, negative observation and duplicate day cannot certify a full month',()=>{
 const partial=structuredClone(inputs);
 for(const src of [partial.data,partial.baselines])src.erc8004Registry.daily=src.erc8004Registry.daily.filter(r=>r.day!=='2026-07-26');
 assert.ok(!buildEdition('2026-07',partial,{now}).metrics.some(m=>m.id==='ercRegistrations'));
 partial.data.virtualsAcp.daily.find(r=>r.day==='2026-07-26').memos=-1;
 assert.ok(!buildEdition('2026-07',partial,{now}).metrics.some(m=>m.id==='acpMemos'));
 partial.data.virtualsAcp.daily.push({...partial.data.virtualsAcp.daily[0]});
 assert.throws(()=>buildEdition('2026-07',partial,{now}),/Duplicate/);
});
test('advancing clock cannot certify stale or missing timestamps, or a partial week',()=>{
 const stale=structuredClone(inputs);stale.data.meta.queries.erc8004Registry.executedAt='2026-07-31T23:00:00Z';stale.data.erc8004Registry.asOf='2026-07-31T23:00:00Z';
 stale.data.meta.queries.olas.executedAt='2026-08-02T23:00:00Z';
 const e=buildEdition('2026-07',stale,{now:new Date('2027-02-01')});
 assert.ok(!e.metrics.some(m=>m.id==='ercRegistrations'));assert.ok(!e.metrics.some(m=>m.id==='olasTransactions'));
 assert.equal(buildEdition('2026-10',inputs,{now}),null);
});
test('editions and their comparison denominator survive rolling windows and later corrections',()=>{
 let cat={schema:1,updatedAt:null,reports:{}};
 cat=appendEdition(cat,buildEdition('2026-07',inputs,{now}));
 cat=appendEdition(cat,buildEdition('2026-08',inputs,{now}));
 const before=JSON.stringify(cat.reports['2026-08']);
 assert.equal(cat.reports['2026-08'].revisions[0].metrics.find(m=>m.id==='ercRegistrations').momPct,20.8);
 assert.equal(cat.reports['2026-08'].revisions[0].metrics.find(m=>m.id==='acpMemos').momPct,58.2);
 const correction=buildEdition('2026-07',inputs,{now,revision:2,note:'Explicit source correction.'});
 const corrected=correction.metrics.find(m=>m.id==='ercRegistrations');corrected.value+=100;corrected.rows[0].value+=100;
 cat=appendEdition(cat,correction);
 assert.equal(JSON.stringify(cat.reports['2026-08']),before);
 assert.throws(()=>appendEdition(cat,correction),/Revision/);
 const live=structuredClone(inputs);live.data.erc8004Registry.daily=[];live.baselines.erc8004Registry.daily=[];
 buildEdition('2026-07',live,{now:new Date('2027-02-01')});
 assert.equal(JSON.stringify(cat.reports['2026-08']),before);
});
test('incomparable coverage, no prior denominator, weekly grain and zero denominator have no MoM',()=>{
 const sept=buildEdition('2026-09',inputs,{now}),aug=buildEdition('2026-08',inputs,{now});
 assert.equal(comparableChange(sept.metrics[0],aug.metrics[0]),null);
 assert.equal(comparableChange(aug.metrics[0],undefined),null);
 assert.equal(comparableChange(aug.metrics[0],{...aug.metrics[0],value:0}),null);
 const olas=aug.metrics.find(m=>m.family==='olas');assert.equal(comparableChange(olas,olas),null);
});
test('published snapshot evidence reconciles and contains fixed comparisons',()=>{
 const cat=read('../../public/monthly-reports.json');
 for(const r of Object.values(cat.reports))for(const e of r.revisions)for(const m of e.metrics){
  assert.equal(m.rows.reduce((s,r)=>s+r.value,0),m.value);
  assert.equal(new Set(m.rows.map(r=>r.date)).size,m.rows.length);
  assert.equal(m.momPct,comparableChange(m,m.comparison));
 }
});
