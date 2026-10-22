"use client";
import { useEffect, useState } from 'react';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { GoogleAnalytics } from './GoogleAnalytics';
import { analyticsDisabled, trackUsage } from '@/lib/analytics-events';

export function UsageAnalytics(){
  const [enabled,setEnabled]=useState(false);
  useEffect(()=>{
    if(analyticsDisabled())return;
    setEnabled(true);
    const onClick=(event:MouseEvent)=>{
      if(!event.isTrusted||!(event.target instanceof Element))return;
      const a=event.target.closest('a[href]');if(!a)return;
      const url=new URL(a.getAttribute('href')!,location.href);
      if(url.hostname==='dashboard.agenteconomy.to')trackUsage('open_dashboard',{destination_type:'dashboard'});
      else if(url.hostname===location.hostname&&['/data.json','/web-sources.json','/monthly-reports.json'].includes(url.pathname))trackUsage('data_access_click',{format:'json',destination_type:url.pathname==='/monthly-reports.json'?'report_snapshot':'live_feed'});
    };
    document.addEventListener('click',onClick,true);
    return()=>document.removeEventListener('click',onClick,true);
  },[]);
  if(!enabled)return null;
  return <><GoogleAnalytics/><Analytics/><SpeedInsights/></>;
}
