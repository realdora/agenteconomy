import test from 'node:test'
import assert from 'node:assert/strict'
import {receiptRequest} from './dune-receipts.mjs'
import {makeReceiptClient,digest} from '../../scripts/dune/execution-receipts.mjs'
const root='https://agenteconomy-data-monitor.facto-sync-worker.workers.dev'
const day0=Date.parse('2026-09-20T01:00:00Z')
const spec={queryKey:'x402Chains',queryId:8734676,sqlHash:'a'.repeat(64),registryHash:'b'.repeat(64),baselineHash:'c'.repeat(64),parameters:{window_start:'2026-09-15'},performance:''}
spec.fingerprint=digest(spec)
function lab() {
  const map=new Map();let now=day0,queue=Promise.resolve(),calls=0,drop=null
  const storage={get:async k=>Array.isArray(k)?new Map(k.filter(x=>map.has(x)).map(x=>[x,structuredClone(map.get(x))])):structuredClone(map.get(k)),
    put:async(k,v)=>{for(const [a,b] of typeof k==='string'?[[k,v]]:Object.entries(k))map.set(a,structuredClone(b))}}
  const fetcher=(url,options)=>{
    const result=queue.then(async()=>{const r=await receiptRequest(new Request(url,options),storage,now);if(drop&&url.endsWith(drop)){drop=null;throw Error('response lost')}return r})
    queue=result.catch(()=>{});return result
  }
  const client=owner=>makeReceiptClient({url:root,token:'test-only',owner:owner||'github:100:1',sourceCommit:'d'.repeat(40),fetcher})
  return {map,storage,fetcher,client,advance:()=>{now+=864e5},drop:route=>{drop=route},count:()=>calls,execute:async()=>({execution_id:'EXEC-'+(++calls)})}
}
test('two concurrent producers obtain one execute; known ID resumes across restart',async()=>{
  const l=lab();const a=l.client(),b=l.client('github:101:1')
  const r=await Promise.allSettled([a.begin(spec,l.execute),b.begin(spec,l.execute)])
  assert.equal(l.count(),1);assert(r.some(x=>x.status==='fulfilled'))
  const resumed=await l.client('github:102:1').begin(spec,l.execute)
  assert.equal(resumed.executionId,'EXEC-1');assert.equal(l.count(),1)
  await a.settle(resumed,'completed',8.5);await a.settle(resumed,'completed',8.5)
  assert.equal(l.map.get('dune-budget:2026-09-20').reservedCredits,8.5)
  l.advance();await b.begin(spec,l.execute);assert.equal(l.count(),2)
})
test('lost execute response remains ambiguous across days and changed definitions',async()=>{
  const l=lab();await assert.rejects(l.client().begin(spec,async()=>{await l.execute();throw Error('socket lost')}),/retained/)
  l.advance();await assert.rejects(l.client().begin(spec,l.execute),/ambiguous/)
  const edited={...spec,sqlHash:'e'.repeat(64)};delete edited.fingerprint;edited.fingerprint=digest(edited)
  await assert.rejects(l.client().begin(edited,l.execute),/conflict/)
  assert.equal(l.count(),1);assert.equal(l.map.get('dune-budget:2026-09-20').reservedCredits,15)
})
test('lost intent acknowledgment never authorizes POST; lost execution-save acknowledgment resumes by stored ID',async()=>{
  const first=lab();first.drop('/claim');await assert.rejects(first.client().begin(spec,first.execute),/unavailable/)
  await assert.rejects(first.client().begin(spec,first.execute),/ambiguous/);assert.equal(first.count(),0)
  const second=lab();second.drop('/execution');await assert.rejects(second.client().begin(spec,second.execute),/unavailable/)
  const resumed=await second.client().begin(spec,second.execute);assert.equal(resumed.executionId,'EXEC-1');assert.equal(second.count(),1)
})
test('invalid query, body, identity and settlement fail closed without changing ledger',async()=>{
  const l=lab(),client=l.client();const record=await client.begin(spec,l.execute)
  await assert.rejects(client.begin({...spec,queryId:6166650},l.execute),/unapproved/)
  const snapshot=JSON.stringify([...l.map]);
  await assert.rejects(client.settle({...record,executionId:'WRONG'},'completed',2),/identity/)
  await assert.rejects(client.settle(record,'completed',-1),/settlement/)
  assert.equal(JSON.stringify([...l.map]),snapshot)
  const bad=await receiptRequest(new Request(root+'/dune-receipts/claim',{method:'POST',body:'x'.repeat(4097)}),l.storage,day0);assert.equal(bad.status,413)
})
test('unknown costs retain reservation and block new work; terminal failures never reexecute that day',async()=>{
  const l=lab(),c=l.client(),record=await c.begin(spec,l.execute)
  await c.settle(record,'failed',null)
  await c.begin(spec,l.execute);assert.equal(l.count(),1)
  const other={...spec,queryKey:'x402Daily',queryId:8748139};delete other.fingerprint;other.fingerprint=digest(other)
  await assert.rejects(c.begin(other,l.execute),/reservation/)
  assert.equal(l.map.get('dune-budget:2026-09-20').reservedCredits,15)
})
test('realistic eight-query daily cost fits reservations; over-reservation cost halts',async()=>{
  const l=lab(),c=l.client()
  for(const [queryKey,queryId,cost] of [['baseAgentic',8748141,6.55],['virtualsAcp',7881007,.4],['x402Chains',8734676,8.5],['x402Cumulative',8748138,8.62],['x402Daily',8748139,6.4],['x402TokenSplit',8748140,1.29],['erc8004Registry',7881124,2.34],['olas',7881008,.42]]) {
    const next={...spec,queryKey,queryId};delete next.fingerprint;next.fingerprint=digest(next)
    const r=await c.begin(next,l.execute);await c.settle(r,'completed',cost)
  }
  assert.equal(l.count(),8);assert(l.map.get('dune-budget:2026-09-20').reservedCredits<35)
  const over=lab();const r=await over.client().begin(spec,over.execute);await over.client().settle(r,'completed',16)
  assert.equal(over.map.get('dune-budget:2026-09-20').halted,true)
})
