import fs from 'node:fs';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { bounds, buildEdition, appendEdition } from './snapshots.mjs';
const target = 'public/monthly-reports.json';
const paths = { data:'public/data.json',baselines:'scripts/dune/baselines.json',tempo:'public/tempo-data.json' };
const inputs = {}, hashes = {};
for (const [k,path] of Object.entries(paths)) { const raw=fs.readFileSync(path); inputs[k]=JSON.parse(raw); hashes[path]=createHash('sha256').update(raw).digest('hex'); }
const now=new Date();
const args=process.argv.slice(2);
if(args.length && !(args.length===4 && args[0]==='--revise' && args[2]==='--note' && args[3].trim().length>=10))throw Error('Usage: publish.mjs [--revise YYYY-MM --note "Reason for the correction"]');
let catalog=fs.existsSync(target)?JSON.parse(fs.readFileSync(target,'utf8')):{schema:1,updatedAt:null,reports:{}};
if(catalog.schema!==1||!catalog.reports)throw Error('Invalid report catalog');
const source={commit:execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim(),sha256:hashes};
let added=0;const missing=[];
if(args.length){
 const month=args[1];bounds(month);
 const prior=catalog.reports[month]?.revisions;
 if(!prior)throw Error('Cannot revise an unpublished month');
 const edition=buildEdition(month,inputs,{now,source,revision:prior.length+1,note:args[3]});
 if(!edition)throw Error('Correction lacks complete source coverage');
 catalog=appendEdition(catalog,edition);added++;
}
// May supplies the comparison baseline; public report routes begin with June.
for(let month='2026-05';Date.parse(bounds(month).end)+8*86400000<=now.getTime();month=bounds(month).end.slice(0,7)){
 if(catalog.reports[month])continue;
 const edition=buildEdition(month,inputs,{now,source,note:Object.keys(catalog.reports).length<5?'Fixed historical edition. Replaces rolling-feed totals; partial months are omitted. September x402 includes a coverage expansion, so incomparable growth rates are withheld.':'First fixed edition.'});
 if(!edition){missing.push(month);continue;}
 catalog=appendEdition(catalog,edition);added++;console.log(`${month}: preserved ${edition.metrics.length} metrics; ${edition.omissions.length} omitted`);
}
if(added){const temporary=target+'.tmp';fs.writeFileSync(temporary,JSON.stringify(catalog,null,2)+'\n');fs.renameSync(temporary,target);}
console.log(`Monthly reports: ${added} new editions; existing editions unchanged.`);
if(missing.length)throw Error(`No complete edition for eligible months: ${missing.join(', ')}. Existing published editions retained; inspect source coverage.`);
