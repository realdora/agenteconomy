// Runs on Mini; only sends a bounded operational summary to our existing Worker.
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import {createHash} from 'node:crypto'
import {pathToFileURL} from 'node:url'
const URL = 'https://agenteconomy-data-monitor.facto-sync-worker.workers.dev/mini'
const states = new Set(['healthy','error','running','catching-up','expired','disabled','missing'])
const status = s => states.has(s) ? s : 'missing'
const read = file => { try { if (fs.statSync(file).size > 1024**2) return {}; return JSON.parse(fs.readFileSync(file)) } catch { return {} } }
const atomic = (file,v) => { fs.writeFileSync(file+'.tmp',JSON.stringify(v,null,2)+'\n',{mode:0o600});fs.renameSync(file+'.tmp',file) }
export function buildMiniReport(root, now = new Date(), outcome) {
  const tempo=read(path.join(root,'health.json')),archive=read(path.join(root,'production/health.json')),backup=read(path.join(root,'backup-health.json'))
  let free=null;try{const s=fs.statfsSync(root);free=Math.floor(s.bavail*s.bsize/1024**3*10)/10}catch{}
  return {version:1,sentAt:now.toISOString(),diskFreeGiB:free,
    tempo:{status:status(tempo.status),lastSuccessAt:tempo.lastSuccessAt||null,through:tempo.contiguousThrough||null},
    archive:{status:status(archive.status),lastSuccessDate:archive.lastSuccessDate||null},
    backup:{status:status(['error','expired'].includes(outcome?.status)?outcome.status:backup.status),lastUploadDate:backup.lastUploadDate||null,archiveThrough:[...(backup.productionArchive?.datesIncluded||[])].sort().at(-1)||null,lastRestoredAt:backup.lastRestoredAt||null}}
}
export async function reportMini(root, {now=new Date(), outcome, fetcher=fetch, credentialFile=path.join(os.homedir(),'.config/agenteconomy-data-pilot/mini-monitor.json')}={}) {
  if(now.getUTCHours()<6)return {status:'waiting-for-daily-window'}
  const file=path.join(root,'mini-monitor-health.json'),previous=read(file),day=now.toISOString().slice(0,10)
  const payload=buildMiniReport(root,now,outcome)
  // Routine timestamps/disk drift do not produce another same-day heartbeat.
  const fingerprint=createHash('sha256').update(JSON.stringify({tempo:payload.tempo.status,through:payload.tempo.through,archive:payload.archive,backup:payload.backup.status,uploaded:payload.backup.lastUploadDate,included:payload.backup.archiveThrough,lowDisk:payload.diskFreeGiB===null||payload.diskFreeGiB<40})).digest('hex')
  if(previous.lastSentDate===day&&previous.fingerprint===fingerprint)return {status:'already-reported'}
  const attempts=previous.lastAttemptDate===day?previous.attemptsToday||0:0
  if(attempts>=3)return {status:'daily-report-limit'}
  const lock=path.join(root,'mini-monitor.lock')
  try{fs.writeFileSync(lock,JSON.stringify({pid:process.pid,at:now.toISOString()}),{flag:'wx',mode:0o600})}catch(e){if(e.code==='EEXIST')return {status:'locked'};throw e}
  let state={...previous,lastAttemptDate:day,attemptsToday:attempts+1,lastAttemptAt:now.toISOString()}
  try {
    atomic(file,state)
    const st=fs.lstatSync(credentialFile)
    if(st.isSymbolicLink()||!st.isFile()||(st.mode&0o077)||st.size>4096)throw Error('Private monitor credential unavailable')
    const config=JSON.parse(fs.readFileSync(credentialFile))
    if(config.url!==URL||!/^[a-f0-9]{64}$/.test(config.token))throw Error('Invalid monitor configuration')
    const r=await fetcher(URL,{method:'POST',headers:{Authorization:'Bearer '+config.token,'Content-Type':'application/json'},body:JSON.stringify(payload),redirect:'error',signal:AbortSignal.timeout(20000)})
    if(!r.ok)throw Error('Monitor HTTP '+r.status)
    const response=await r.json();if(response.accepted!==true&&response.skipped!=='duplicate/older report')throw Error('Invalid monitor acknowledgement')
    state={...state,status:'healthy',lastSentDate:day,lastSentAt:now.toISOString(),fingerprint,externalAlertsConfigured:true};delete state.error;atomic(file,state)
    return {status:'reported',sentAt:state.lastSentAt}
  }catch(e){state={...state,status:'error',error:/^Monitor HTTP \d+$/.test(e.message)?e.message:'Monitor report failed; inspect local configuration/network'};atomic(file,state);return {status:'report-failed',error:state.error}}
  finally{fs.unlinkSync(lock)}
}
if(process.argv[1]&&import.meta.url===pathToFileURL(path.resolve(process.argv[1])).href){const root=process.argv[2];if(!root)throw Error('Usage: node mini-reporter.mjs PILOT_ROOT');console.log(JSON.stringify(await reportMini(path.resolve(root)),null,2))}
