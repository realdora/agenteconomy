// Shared execute ledger. It does not coordinate Git publication or grant Mini
// producer access. Called only behind the existing trusted admin authentication.
export const RECEIPT_QUERIES = Object.freeze({x402Cumulative:8748138,x402Daily:8748139,x402TokenSplit:8748140,baseAgentic:8748141,x402Chains:8734676,virtualsAcp:7881007,erc8004Registry:7881124,olas:7881008})
const RESERVATIONS = {x402Cumulative:15,x402Daily:15,x402TokenSplit:3,baseAgentic:10,x402Chains:15,virtualsAcp:2,erc8004Registry:5,olas:2}
const hex = x => typeof x === 'string' && /^[a-f0-9]{64}$/.test(x)
const validId = x => typeof x === 'string' && /^[A-Za-z0-9_-]{1,80}$/.test(x)
const terminal = phase => ['completed','failed','cancelled','partial'].includes(phase)
const reply = (body,status=200) => Response.json(body,{status})
export async function receiptRequest(request,storage,now=Date.now()) {
  const route = new URL(request.url).pathname
  if(route === '/dune-receipts/status') {
    const states = await storage.get(Object.keys(RECEIPT_QUERIES).map(k=>'dune:'+k))
    return reply({checkedAt:new Date(now).toISOString(),queries:Object.fromEntries([...states].map(([k,v])=>[k.slice(5),v]))})
  }
  let body
  const text = await request.text()
  if(new TextEncoder().encode(text).length>4096)return reply({error:'receipt body too large'},413)
  try {body=JSON.parse(text)} catch {return reply({error:'invalid JSON'},400)}
  if(!body || typeof body!=='object' || Array.isArray(body))return reply({error:'invalid receipt'},400)
  const {queryKey,queryId}=body
  if(!Object.hasOwn(RECEIPT_QUERIES,queryKey) || RECEIPT_QUERIES[queryKey]!==queryId)return reply({error:'unapproved query'},400)
  const key='dune:'+queryKey, state=await storage.get(key)||{records:[]}
  const day=new Date(now).toISOString().slice(0,10),iso=new Date(now).toISOString()
  if(route==='/dune-receipts/claim') {
    const fields=['queryKey','queryId','fingerprint','sqlHash','registryHash','baselineHash','parameters','performance','sourceCommit','owner','nonce']
    if(Object.keys(body).some(k=>!fields.includes(k)) || !['fingerprint','sqlHash','registryHash','baselineHash'].every(k=>hex(body[k])) ||
      !/^[a-f0-9]{40}$/.test(body.sourceCommit||'') || !/^github:\d+:\d+$/.test(body.owner||'') || !/^[a-f0-9]{32}$/.test(body.nonce||'') ||
      !body.parameters || typeof body.parameters!=='object' || Array.isArray(body.parameters) ||
      Object.keys(body.parameters).some(k=>k!=='window_start') || (body.parameters.window_start!==undefined && !/^\d{4}-\d{2}-\d{2}$/.test(body.parameters.window_start)) ||
      !['','small','medium','large'].includes(body.performance))return reply({error:'invalid claim'},400)
    const identity={queryKey,queryId,sqlHash:body.sqlHash,registryHash:body.registryHash,baselineHash:body.baselineHash,parameters:body.parameters,performance:body.performance}
    const digest=[...new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(JSON.stringify(identity))))].map(b=>b.toString(16).padStart(2,'0')).join('')
    if(digest!==body.fingerprint)return reply({error:'fingerprint mismatch'},400)
    // Nonterminal records block subsequent dates too; a midnight boundary cannot
    // release an execution whose outcome is unknown.
    const active=state.records.find(r=>!terminal(r.phase))
    const existing=active || state.records.find(r=>r.day===day)
    if(existing) {
      if(existing.fingerprint!==body.fingerprint)return reply({error:'receipt definition conflict; reconcile before executing',record:existing},409)
      if(!existing.executionId)return reply({error:'ambiguous execution; no automatic retry',record:existing},409)
      return reply({action:'resume',record:existing})
    }
    const budgetKey='dune-budget:'+day,budget=await storage.get(budgetKey)||{reservedCredits:0,halted:false}
    const reservation=RESERVATIONS[queryKey]
    if(budget.halted || budget.reservedCredits+reservation>45)return reply({error:'shared daily credit reservation exhausted'},409)
    const record={...body,day,phase:'intent',createdAt:iso,updatedAt:iso,executionId:null,reservedCredits:reservation}
    // Retain terminal history 31 days; unresolved records are never expired.
    state.records=state.records.filter(r=>!terminal(r.phase)||Date.parse(r.day)>=now-31*864e5)
    state.records.push(record);budget.reservedCredits+=reservation
    // Multi-key put is atomic; the outer Durable Object serializes this handler.
    await storage.put({[key]:state,[budgetKey]:budget})
    return reply({action:'execute',record})
  }
  if(!/^\d{4}-\d{2}-\d{2}$/.test(body.day||'') || !validId(body.executionId))return reply({error:'invalid execution identity'},400)
  const record=state.records.find(r=>r.day===body.day)
  if(!record)return reply({error:'receipt not found'},404)
  if(route==='/dune-receipts/execution') {
    if(Object.keys(body).some(k=>!['queryKey','queryId','day','executionId','owner','nonce'].includes(k)))return reply({error:'unexpected field'},400)
    if(record.owner!==body.owner || record.nonce!==body.nonce || (record.executionId && record.executionId!==body.executionId))return reply({error:'execution receipt conflict'},409)
    if(!record.executionId){record.executionId=body.executionId;record.phase='executing';record.updatedAt=iso;await storage.put(key,state)}
    return reply({record})
  }
  if(route==='/dune-receipts/settle') {
    if(Object.keys(body).some(k=>!['queryKey','queryId','day','executionId','phase','costCredits'].includes(k)) || !terminal(body.phase) ||
      (body.costCredits!==null && (typeof body.costCredits!=='number' || !Number.isFinite(body.costCredits) || body.costCredits<0)))return reply({error:'invalid settlement'},400)
    if(record.executionId!==body.executionId)return reply({error:'execution identity conflict'},409)
    if(terminal(record.phase))return record.phase===body.phase && record.costCredits===body.costCredits ? reply({record}) : reply({error:'terminal receipt conflict'},409)
    const budgetKey='dune-budget:'+record.day,budget=await storage.get(budgetKey)
    if(!budget)return reply({error:'missing reservation ledger'},503)
    record.phase=body.phase;record.costCredits=body.costCredits;record.updatedAt=iso
    // Missing cost keeps the full reservation and halts new queries that day.
    if(body.costCredits===null)budget.halted=true
    else {budget.reservedCredits+=body.costCredits-record.reservedCredits;if(body.costCredits>record.reservedCredits || budget.reservedCredits>45)budget.halted=true}
    await storage.put({[key]:state,[budgetKey]:budget});return reply({record})
  }
  return reply({error:'not found'},404)
}
