import {createHash,randomBytes} from 'node:crypto'
export const digest = value => createHash('sha256').update(typeof value==='string'?value:JSON.stringify(value)).digest('hex')
const fail = message => Object.assign(Error(message),{receiptHold:true})
export function makeReceiptClient({url,token,owner,sourceCommit,fetcher=fetch}) {
  if(url!=='https://agenteconomy-data-monitor.facto-sync-worker.workers.dev' || !token || !/^github:\d+:\d+$/.test(owner||'') || !/^[a-f0-9]{40}$/.test(sourceCommit||''))throw fail('Shared execution receipt configuration is missing or invalid')
  async function request(route,body) {
    let r
    try {r=await fetcher(url+'/dune-receipts/'+route,{method:'POST',headers:{Authorization:'Bearer '+token,'Content-Type':'application/json'},body:JSON.stringify(body),signal:AbortSignal.timeout(15000)})}
    catch {throw fail('Shared receipt response unavailable; stop execution and reconcile')}
    let payload;try{payload=await r.json()}catch{throw fail('Invalid shared receipt response')}
    if(!r.ok)throw fail(`Shared receipt HTTP ${r.status}: ${payload.error||'request rejected'}`)
    return payload
  }
  return {
    async begin(spec,execute) {
      const nonce=randomBytes(16).toString('hex')
      const claim=await request('claim',{...spec,owner,sourceCommit,nonce})
      let record=claim.record
      if(!record || !['execute','resume'].includes(claim.action) || record.queryId!==spec.queryId || record.fingerprint!==spec.fingerprint)throw fail('Invalid receipt claim')
      if(claim.action==='execute') {
        let started
        try {started=await execute()} catch {throw fail('Dune execute response unavailable/rejected; shared intent retained for review (no retry)')}
        const executionId=started?.execution_id
        if(typeof executionId!=='string'||!/^[A-Za-z0-9_-]{1,80}$/.test(executionId))throw fail('Dune execution ID missing; shared intent retained for review')
        // Log only the public execution ID before persistence, providing recovery
        // evidence if saving its shared receipt fails.
        console.log(`Dune ${spec.queryKey}: execution receipt ${executionId}`)
        record=(await request('execution',{queryKey:spec.queryKey,queryId:spec.queryId,day:record.day,executionId,owner,nonce})).record
      }
      if(!record?.executionId)throw fail('Shared receipt has no execution ID')
      return record
    },
    async settle(record,phase,costCredits) {return request('settle',{queryKey:record.queryKey,queryId:record.queryId,day:record.day,executionId:record.executionId,phase,costCredits})},
  }
}
