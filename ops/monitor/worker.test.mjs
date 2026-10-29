import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import { healthyFeeds } from './fixtures/healthy-feeds.mjs'
let code=fs.readFileSync(new URL('./worker.mjs',import.meta.url),'utf8')
code=code.replace("import { DurableObject } from 'cloudflare:workers'",'class DurableObject { constructor(ctx,env){this.ctx=ctx;this.env=env} }')
for(const name of ['core','mini','dune-receipts'])code=code.replace(`'./${name}.mjs'`,JSON.stringify(new URL(`./${name}.mjs`,import.meta.url).href))
const {default:worker,MonitorState}=await import('data:text/javascript;base64,'+Buffer.from(code).toString('base64'))
test('Mini key can only submit reports; ingest is quiet, replay cannot freshen heartbeat, preview is read-only',async t=>{
 const original=globalThis.fetch;let network=0;globalThis.fetch=async()=>{network++;throw Error('No external calls expected')};t.after(()=>{globalThis.fetch=original})
 const memory=new Map(),ctx={storage:{get:async k=>structuredClone(memory.get(k)),put:async(k,v)=>{memory.set(k,structuredClone(v))}},blockConcurrencyWhile:f=>f()}
 const env={MINI_MONITOR_TOKEN:'mini-key',MONITOR_TOKEN:'admin-key',MINI_MONITOR_ENABLED:'true'}
 const object=new MonitorState(ctx,env);env.MONITOR={idFromName:()=>1,get:()=>object}
 const req=(route,key,body)=>new Request('https://worker'+route,{method:body?'POST':'GET',headers:{Authorization:'Bearer '+key},...(body?{body:JSON.stringify(body)}:{})})
 for(const p of ['/status','/mini-check','/daily','/test','/event','/dune-receipts/status','/dune-receipts/claim'])assert.equal((await worker.fetch(req(p,'mini-key',p==='/status'||p==='/mini-check'?null:{}),env)).status,401)
 const payload={version:1,sentAt:new Date().toISOString(),diskFreeGiB:90,tempo:{status:'missing',lastSuccessAt:null,through:null},archive:{status:'missing',lastSuccessDate:null},backup:{status:'missing',lastUploadDate:null,archiveThrough:null,lastRestoredAt:null}}
 assert.equal((await worker.fetch(req('/mini','admin-key',payload),env)).status,401)
 assert.equal((await worker.fetch(req('/mini','mini-key',{...payload,secret:'forbidden'}),env)).status,400)
 const accepted=await(await worker.fetch(req('/mini','mini-key',payload),env)).json();assert.equal(accepted.accepted,true)
 const snapshot=structuredClone(memory.get('state'))
 const replay=await(await worker.fetch(req('/mini','mini-key',payload),env)).json();assert.equal(replay.skipped,'duplicate/older report');assert.deepEqual(memory.get('state'),snapshot)
 const preview=await(await worker.fetch(req('/mini-check','admin-key'),env)).json();assert(preview.issues.some(i=>i.id==='mini.archive'));assert.deepEqual(memory.get('state'),snapshot)
 assert.equal(network,0);assert(!memory.get('state').lastMail)
})

test('successful jobs with bad data still generate email; repeats dedupe; corrected data generates recovery',async t=>{
 const originalFetch=globalThis.fetch, originalNow=Date.now
 const fixture=healthyFeeds(),data=fixture.canonical
 const instant=Date.parse(data.meta.queries.x402Daily.executedAt)+4*3600000
 Date.now=()=>instant
 t.after(()=>{globalThis.fetch=originalFetch;Date.now=originalNow})
 const iso=new Date(instant).toISOString()
 for(const q of Object.values(data.meta.queries))q.executedAt=iso
 // Complete day remains yesterday; only the execution age changes for this test.
 const latest=[...data.x402.daily].sort((a,b)=>a.day.localeCompare(b.day)).at(-1)
 const web=fixture.web
 for(const key of ['agentTokens','x402Services','agentSupply','virtuals','devAdoption','masumi','solanaAgents','standardsAdoption','inferenceDemand','x402TokenSplit'])web[key]={...(web[key]||{}),asOf:iso}
 const registry=`[Network.BASE]: [${data.x402.coverage.coinbaseBaseAddresses.map(a=>`{ address: '${a}' , tokens: [] }`).join(',')}], [Network.SOLANA]: []`
 let broken=true;const sent=[]
 globalThis.fetch=async(url,options)=>{
  if(String(url)==='https://api.resend.com/emails'){sent.push(JSON.parse(options.body));return Response.json({id:'test-mail-'+sent.length})}
  if(String(url).includes('coinbase.ts'))return new Response(registry)
  if(String(url).includes('/stats/'))return new Response(`<p>recorded ${latest.txs} transactions on ${latest.day}, the latest complete UTC day</p>`)
  if(String(url).includes('web-sources'))return Response.json(web)
  if(String(url).includes('tempo-data'))return Response.json({updatedAt:iso})
  const current=structuredClone(data);if(broken)delete current.x402.coverage
  return Response.json(current)
 }
 const events=Object.fromEntries(['Update Dune Data','Update Tempo Data','Update Web Sources','Update Dashboard'].map((name,i)=>[name,{id:i+1,conclusion:'success',at:iso}]))
 const memory=new Map([['state',{events}]])
 const ctx={storage:{get:async k=>structuredClone(memory.get(k)),put:async(k,v)=>memory.set(k,structuredClone(v))},blockConcurrencyWhile:f=>f()}
 const env={MONITOR_TOKEN:'admin-key',EMAIL_ENABLED:'true',RESEND_API_KEY:'test-only',ALERT_TO:'test@example.invalid',ALERT_FROM:'test@example.invalid'}
 const object=new MonitorState(ctx,env);env.MONITOR={idFromName:()=>1,get:()=>object}
 const daily=()=>worker.fetch(new Request('https://worker/daily',{method:'POST',headers:{Authorization:'Bearer admin-key'}}),env)
 const first=await(await daily()).json()
 assert.ok(first.issues.some(i=>i.id==='contract.x402Coverage'));assert.equal(sent.length,1)
 assert.match(sent[0].subject,/数据监控发现异常/);assert.match(sent[0].text,/覆盖|未覆盖/)
 await daily();assert.equal(sent.length,1)
 broken=false
 // Restoring coverage must not hide the real holds that caused the Oct 27
 // incident. Only healthy inputs may generate a recovery notification.
 data.meta.queries.x402Daily.refreshHold='cancelled by execution cap 15 after 15.34 credits'
 data.meta.queries.x402Chains.refreshHold='shared daily credit reservation exhausted'
 const held=await(await daily()).json()
 assert.deepEqual(held.issues.map(i=>i.id).sort(),['hold.x402Chains','hold.x402Daily'])
 assert.equal(sent.length,2);assert.match(sent[1].subject,/数据监控发现异常/)
 await daily();assert.equal(sent.length,2)
 delete data.meta.queries.x402Daily.refreshHold
 delete data.meta.queries.x402Chains.refreshHold
 const restored=await(await daily()).json()
 assert.deepEqual(restored.issues,[]);assert.equal(sent.length,3);assert.match(sent[2].subject,/恢复/)
 assert.equal(memory.get('state').monitorVersion,'2026-10-22-quality-v2')
})
