import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
let code=fs.readFileSync(new URL('./worker.mjs',import.meta.url),'utf8')
code=code.replace("import { DurableObject } from 'cloudflare:workers'",'class DurableObject { constructor(ctx,env){this.ctx=ctx;this.env=env} }')
for(const name of ['core','mini'])code=code.replace(`'./${name}.mjs'`,JSON.stringify(new URL(`./${name}.mjs`,import.meta.url).href))
const {default:worker,MonitorState}=await import('data:text/javascript;base64,'+Buffer.from(code).toString('base64'))
test('Mini key can only submit reports; ingest is quiet, replay cannot freshen heartbeat, preview is read-only',async t=>{
 const original=globalThis.fetch;let network=0;globalThis.fetch=async()=>{network++;throw Error('No external calls expected')};t.after(()=>{globalThis.fetch=original})
 const memory=new Map(),ctx={storage:{get:async k=>structuredClone(memory.get(k)),put:async(k,v)=>{memory.set(k,structuredClone(v))}},blockConcurrencyWhile:f=>f()}
 const env={MINI_MONITOR_TOKEN:'mini-key',MONITOR_TOKEN:'admin-key',MINI_MONITOR_ENABLED:'true'}
 const object=new MonitorState(ctx,env);env.MONITOR={idFromName:()=>1,get:()=>object}
 const req=(route,key,body)=>new Request('https://worker'+route,{method:body?'POST':'GET',headers:{Authorization:'Bearer '+key},...(body?{body:JSON.stringify(body)}:{})})
 for(const p of ['/status','/mini-check','/daily','/test','/event'])assert.equal((await worker.fetch(req(p,'mini-key',p==='/status'||p==='/mini-check'?null:{}),env)).status,401)
 const payload={version:1,sentAt:new Date().toISOString(),diskFreeGiB:90,tempo:{status:'missing',lastSuccessAt:null,through:null},archive:{status:'missing',lastSuccessDate:null},backup:{status:'missing',lastUploadDate:null,archiveThrough:null,lastRestoredAt:null}}
 assert.equal((await worker.fetch(req('/mini','admin-key',payload),env)).status,401)
 assert.equal((await worker.fetch(req('/mini','mini-key',{...payload,secret:'forbidden'}),env)).status,400)
 const accepted=await(await worker.fetch(req('/mini','mini-key',payload),env)).json();assert.equal(accepted.accepted,true)
 const snapshot=structuredClone(memory.get('state'))
 const replay=await(await worker.fetch(req('/mini','mini-key',payload),env)).json();assert.equal(replay.skipped,'duplicate/older report');assert.deepEqual(memory.get('state'),snapshot)
 const preview=await(await worker.fetch(req('/mini-check','admin-key'),env)).json();assert(preview.issues.some(i=>i.id==='mini.archive'));assert.deepEqual(memory.get('state'),snapshot)
 assert.equal(network,0);assert(!memory.get('state').lastMail)
})
