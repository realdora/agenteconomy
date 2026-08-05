// Shared fetch for the published feeds (data.json / web-sources.json).
//
// Every feed read goes through here so a hung upstream cannot stall an ISR
// regeneration indefinitely. Callers keep their own try/catch and fall back to
// their baked-in snapshot, so a timeout degrades to stale-but-honest data
// rather than an error page.
//
// Why a raced timer instead of AbortSignal: Next.js treats a `signal` on fetch
// as an explicit opt-out of request deduplication — see the guard at the top of
// `next/src/server/lib/dedupe-fetch.ts`, which passes any signal-bearing call
// straight to the unpatched fetch. The homepage reads data.json three times
// (agent-data, platform-data, protocol-index) and relies on that dedupe to
// collapse them into one request, so adding a signal would triple real upstream
// traffic. Racing a timer keeps the dedupe and the data cache intact.
//
// The tradeoff is that a timed-out request's socket is left to the runtime
// rather than aborted. That is acceptable here: the platform reclaims it, and
// the render — the thing we actually need unblocked — proceeds immediately.

const FEED_REVALIDATE_SECONDS = 3600;
const FEED_TIMEOUT_MS = 8000;

export function fetchFeed(url: string, revalidate: number = FEED_REVALIDATE_SECONDS): Promise<Response> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  return Promise.race([
    fetch(url, { next: { revalidate } }),
    new Promise<never>((_, reject) => {
      timer = setTimeout(
        () => reject(new Error(`feed timeout after ${FEED_TIMEOUT_MS}ms: ${url}`)),
        FEED_TIMEOUT_MS,
      );
    }),
  ]).finally(() => clearTimeout(timer));
}
