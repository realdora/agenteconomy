import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import {validateMini,readMini,inspectMini} from './mini.mjs'
import {notificationPlan} from './core.mjs'
import {buildMiniReport,reportMini} from './mini-reporter.mjs'
const now=Date.parse('2026-09-20T07:17:00Z')
const payload=()=>({version:1,sentAt:'2026-09-19T11:25:00Z',diskFreeGiB:90,tempo:{status:'healthy',lastSuccessAt:'2026-09-19T05:25:00Z',through:'2026-09-18'},archive:{status:'healthy',lastSuccessDate:'2026-09-19'},backup:{status:'healthy',lastUploadDate:'2026-09-19',archiveThrough:'2026-09-19',lastRestoredAt:'2026-09-19T15:35:00Z'}})
const record=()=>({receivedAt:'2026-09-19T11:25:01Z',payload:payload()})
test('normal previous-day report passes morning check; healthy is silent',()=>{assert.deepEqual(inspectMini(record(),now),[]);assert.equal(notificationPlan({},[],now),null)})
test('offline Mini is caught externally; fresh heartbeat cannot mask stale archive or missing R2 contents',()=>{
 const r=record();assert(inspectMini(r,now+86400000).some(i=>i.id==='mini.heartbeat'))
 r.payload.sentAt=r.receivedAt=new Date(now).toISOString();r.payload.archive.lastSuccessDate='2026-09-17';r.payload.backup.archiveThrough='2026-09-17'
 const ids=inspectMini(r,now).map(i=>i.id);assert(ids.includes('mini.archive'));assert(ids.includes('mini.backupCoverage'));assert(!ids.includes('mini.backup'))
})
test('failure, disk floor and expired pilot remain visible even if Mini stops sending',()=>{
 const r=record();r.payload.backup.status='error';r.payload.diskFreeGiB=39
 assert(inspectMini(r,now).some(i=>i.id==='mini.status.backup'));assert(inspectMini(r,now).some(i=>i.id==='mini.disk'))
 assert(inspectMini(null,Date.parse('2026-09-21T07:17:00Z')).some(i=>i.id==='mini.expiry.archive'))
 assert(inspectMini(null,Date.parse('2026-10-16T07:17:00Z')).some(i=>i.id==='mini.expiry.credential'))
})
test('infrastructure incidents use existing once-daily reminders and single recovery',()=>{
 const issues=inspectMini(null,now),first=notificationPlan({},issues,now);assert.equal(first.kind,'alert')
 const state={notifiedIds:first.ids,lastSentAt:new Date(now).toISOString()}
 assert.equal(notificationPlan(state,issues,now+23*3600000),null);assert.equal(notificationPlan(state,issues,now+86400000).kind,'reminder');assert.equal(notificationPlan(state,[],now+86400000).kind,'recovery')
})
test('ingest rejects future, old, extra sensitive fields and oversized bodies',async()=>{
 const p=payload();p.sentAt=new Date(now).toISOString();assert.deepEqual(validateMini(p,now),p)
 assert.throws(()=>validateMini({...p,token:'secret'},now));assert.throws(()=>validateMini({...p,sentAt:new Date(now+120000).toISOString()},now));assert.throws(()=>validateMini(payload(),now))
 await assert.rejects(readMini(new Request('https://x',{method:'POST',body:'x'.repeat(5000)}),now));assert.deepEqual(await readMini(new Request('https://x',{method:'POST',body:JSON.stringify(p)}),now),p)
})
test('sender excludes secrets, sends once, allows state recovery, caps failures and never changes backup state',async t=>{
 const root=fs.mkdtempSync(path.join(os.tmpdir(),'ae-mini-report-'));t.after(()=>fs.rmSync(root,{recursive:true,force:true}));fs.mkdirSync(path.join(root,'production'))
 const p=payload();fs.writeFileSync(path.join(root,'health.json'),JSON.stringify({status:'healthy',lastSuccessAt:p.tempo.lastSuccessAt,contiguousThrough:p.tempo.through,error:'secret'}));fs.writeFileSync(path.join(root,'production/health.json'),JSON.stringify(p.archive));
 const backup={status:'healthy',lastUploadDate:'2026-09-19',productionArchive:{datesIncluded:['2026-09-19']},apiKey:'do-not-send'};fs.writeFileSync(path.join(root,'backup-health.json'),JSON.stringify(backup))
 const credentialFile=path.join(root,'private.json');fs.writeFileSync(credentialFile,JSON.stringify({url:'https://agenteconomy-data-monitor.facto-sync-worker.workers.dev/mini',token:'a'.repeat(64)}),{mode:0o600})
 let calls=0;const opts={now:new Date('2026-09-19T15:00:00Z'),credentialFile,fetcher:async(url,o)=>{calls++;assert(!o.body.includes('do-not-send'));assert(!o.body.includes('secret'));return Response.json({accepted:true})}}
 assert.equal((await reportMini(root,opts)).status,'reported');assert.equal((await reportMini(root,opts)).status,'already-reported');assert.equal(calls,1)
 assert.equal((await reportMini(root,{...opts,outcome:{status:'error'}})).status,'reported');assert.equal((await reportMini(root,opts)).status,'reported');assert.equal((await reportMini(root,{...opts,outcome:{status:'error'}})).status,'daily-report-limit')
 assert.deepEqual(JSON.parse(fs.readFileSync(path.join(root,'backup-health.json'))),backup)
 const tomorrow={...opts,now:new Date('2026-09-20T15:00:00Z'),fetcher:async()=>{throw Error('secret network details')}};assert.equal((await reportMini(root,tomorrow)).status,'report-failed');assert(!fs.readFileSync(path.join(root,'mini-monitor-health.json'),'utf8').includes('secret network details'))
})
