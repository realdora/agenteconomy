// Test-process only: route the fixed receipt origin to the in-process mock.
const original=globalThis.fetch
globalThis.fetch=(url,options)=>original(String(url).replace('https://agenteconomy-data-monitor.facto-sync-worker.workers.dev',process.env.DUNE_API_BASE),options)
