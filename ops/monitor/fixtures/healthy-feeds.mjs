// Synthetic, fixed-clock inputs. Offline regressions must not inherit a live
// producer outage, refresh hold, activity change, or expiring review date.
export function healthyFeeds(iso = '2026-10-22T02:00:00Z') {
  const keys = ['x402Cumulative','x402Daily','x402Chains','x402TokenSplit','baseAgentic','virtualsAcp','erc8004Registry','olas']
  const daily = Array.from({length:9}, (_,i) => ({day:new Date(Date.parse(iso.slice(0,10))-(9-i)*864e5).toISOString().slice(0,10),txs:10000}))
  const address = '0x'+'a'.repeat(40)
  const canonical = {
    updatedAt:iso,
    meta:{queries:Object.fromEntries(keys.map((key,i)=>[key,{executedAt:iso,executionId:String(i+1).padStart(26,'0')}]))},
    x402:{totalTxs:90000,totalVolume:10000,daily,
      chains:[{chain:'base',txs:90000}],chainsAsOf:daily.at(-1).day+'T23:59:59.999Z',
      recentFacilitators:daily.map(row=>({...row,project:'Coinbase'})),
      coverage:{registryVersion:'test-v1',reviewedAt:iso.slice(0,10),expandedCoverageFrom:daily[0].day,coinbaseBaseAddresses:[address]}},
    baseAgentic:{totalTxs:10000},virtualsAcp:{totalMemos:10000},erc8004Registry:{totalAgents:10000},olas:{totalTxs:10000}
  }
  const web=Object.fromEntries(['agentTokens','x402Services','agentSupply','virtuals','devAdoption','masumi','solanaAgents','standardsAdoption','inferenceDemand','x402TokenSplit'].map(key=>[key,{asOf:iso}]))
  return {canonical,apex:structuredClone(canonical),dashboard:structuredClone(canonical),web,tempo:{updatedAt:iso},
    coinbaseRegistry:{source:`[Network.BASE]: [{ address: '${address}', tokens: [] }], [Network.SOLANA]: []`},
    x402Page:{source:`<p>recorded 10000 transactions on ${daily.at(-1).day}, the latest complete UTC day</p>`}}
}
