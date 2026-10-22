import { asOfLabel, fmt, usd } from './stats-data';
import { latestEdition, type ReportCatalog } from './report-catalog';
export { asOfLabel };
export function isValidYm(ym:string){return /^20\d\d-(0[1-9]|1[0-2])$/.test(ym);}
export function monthName(ym:string){return new Date(`${ym}-01T00:00:00Z`).toLocaleDateString('en-US',{month:'long',year:'numeric',timeZone:'UTC'});}
export function isClosedMonth(ym:string,now:Date){return ym<now.toISOString().slice(0,7);}
export function buildMonthlyReport(ym:string,catalog:ReportCatalog){
  const edition=latestEdition(catalog,ym);
  if(!edition||ym<'2026-06')return null;
  const name=monthName(ym);
  const metrics=edition.metrics.map(m=>{
    const value=m.unit==='USD'?usd(m.value):fmt(m.value);
    const text:Record<string,string>={
      x402Txs:`x402 settled ${value} tracked transactions in ${name}.`,
      x402Volume:`x402 moved ${value} of tracked stablecoin volume in ${name}.`,
      ercRegistrations:`${value} new agents registered in tracked ERC-8004 identity registries in ${name}.`,
      acpMemos:`Virtuals ACP recorded ${value} on-chain commerce memos in ${name}.`,
      baseTransactions:`Base's broader agentic ecosystem produced ${value} transactions in ${name}.`,
      tempoEvents:`Tempo's Machine Payments Protocol produced ${value} tracked channel events in ${name}.`,
      olasTransactions:`Olas autonomous agents made ${value} transactions across the complete weeks starting in ${name}.`,
    };
    return {...m,value,quotable:text[m.id]??`${m.label}: ${value} in ${name}.`};
  });
  const notes=[...edition.omissions];
  if(edition.metrics.some(m=>m.comparison&&m.comparison.comparisonKey!==m.comparisonKey))notes.push('x402 coverage changed between these periods; month-over-month growth is withheld because the scopes are not comparable.');
  return {ym,monthName:name,asOf:edition.publishedAt,publishedAt:edition.publishedAt,revision:edition.revision,revisionNote:edition.note,metrics,coverageNotes:notes,source:edition.source};
}
