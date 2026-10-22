export function analyticsDisabled() {
  try { return localStorage.getItem('ae.analytics.disabled') === '1'; } catch { return false; }
}
export function trackUsage(name:'open_dashboard'|'data_access_click'|'citation_copy'|'chart_interaction',parameters:Record<string,string>={}) {
  if(typeof window==='undefined'||analyticsDisabled())return;
  const w=window as Window & {gtag?:(...args:unknown[])=>void};
  const pageType=location.pathname.startsWith('/stats/')?'stat':location.pathname.startsWith('/reports/')?'report':location.pathname==='/'?'home':'protocol_or_info';
  w.gtag?.('event',name,{page_type:pageType,...parameters});
}
