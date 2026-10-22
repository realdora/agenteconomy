import { cache } from 'react';
import { z } from 'zod';
import fallback from './report-snapshot-fallback.json';
import { fetchFeed } from './feed-fetch';

const observation = z.object({ date:z.string().regex(/^\d{4}-\d{2}-\d{2}$/), value:z.number().finite().nonnegative() });
const metric = z.object({
  id:z.string(),family:z.string(),label:z.string(),value:z.number().finite().nonnegative(),unit:z.enum(['count','USD']),
  grain:z.enum(['day','week','month']),start:z.string(),end:z.string(),sourceAsOf:z.string().datetime(),comparisonKey:z.string(),
  rows:z.array(observation).min(1),note:z.string().optional(),momPct:z.number().finite().nullable(),
  comparison:z.object({month:z.string(),revision:z.number().int().positive(),value:z.number().nonnegative(),comparisonKey:z.string()}).nullable(),
}).superRefine((m,ctx)=>{
  const sum=m.rows.reduce((s,r)=>s+r.value,0);
  if(Math.abs(sum-m.value)>0.000001||new Set(m.rows.map(r=>r.date)).size!==m.rows.length)ctx.addIssue({code:'custom',message:'Snapshot evidence does not reconcile'});
  const comparable=m.comparison&&m.comparison.value>0&&m.comparison.comparisonKey===m.comparisonKey&&m.grain!=='week';
  const expected=comparable?Math.round((m.value/m.comparison!.value-1)*1000)/10:null;
  if(m.momPct!==expected)ctx.addIssue({code:'custom',message:'Snapshot comparison does not reconcile'});
});
const edition=z.object({month:z.string().regex(/^20\d\d-(0[1-9]|1[0-2])$/),revision:z.number().int().positive(),publishedAt:z.string().datetime(),note:z.string(),source:z.object({commit:z.string().regex(/^[a-f0-9]{40}$/),sha256:z.record(z.string(),z.string())}),metrics:z.array(metric).min(4),omissions:z.array(z.string())});
const schema=z.object({schema:z.literal(1),updatedAt:z.string().datetime(),reports:z.record(z.string(),z.object({revisions:z.array(edition).min(1)}))}).superRefine((c,ctx)=>{
  for(const [month,record]of Object.entries(c.reports))record.revisions.forEach((e,i)=>{
    if(e.month!==month||e.revision!==i+1||new Set(e.metrics.map(m=>m.id)).size!==e.metrics.length)ctx.addIssue({code:'custom',message:'Invalid report edition'});
  });
});
export type ReportCatalog=z.infer<typeof schema>;
export type ReportEdition=z.infer<typeof edition>;
export const bundledReports=schema.parse(fallback);
export const getReportCatalog=cache(async():Promise<ReportCatalog>=>{
  try{
    const response=await fetchFeed('https://dashboard.agenteconomy.to/monthly-reports.json');
    if(!response.ok)throw Error('Report feed unavailable');
    const remote=schema.parse(await response.json());
    const reports={...bundledReports.reports};
    for(const [month,record]of Object.entries(remote.reports)){
      const local=reports[month];
      if(!local||record.revisions.length>=local.revisions.length)reports[month]=record;
    }
    return {...remote,reports};
  }catch{
    // A network failure cannot erase published history or revert to rolling data.
    return bundledReports;
  }
});
export function reportMonths(catalog:ReportCatalog){return Object.keys(catalog.reports).filter(m=>m>='2026-06').sort().reverse();}
export function latestEdition(catalog:ReportCatalog,month:string){return catalog.reports[month]?.revisions.at(-1);}
