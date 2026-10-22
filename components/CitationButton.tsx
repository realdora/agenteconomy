"use client";
import { useState } from 'react';
import { trackUsage } from '@/lib/analytics-events';
export function CitationButton({text}:{text:string}){
  const [status,setStatus]=useState('Copy citation');
  return <button type="button" className="mt-5 rounded border border-white/20 px-4 py-2 text-sm text-white/70 hover:border-white/50 hover:text-white focus-visible:outline focus-visible:outline-2" onClick={async()=>{
    try{await navigator.clipboard.writeText(text);setStatus('Citation copied');trackUsage('citation_copy',{destination_type:'clipboard'});}
    catch{setStatus('Copy unavailable — select the citation above');}
  }}><span aria-live="polite">{status}</span></button>;
}
