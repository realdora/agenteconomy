#!/usr/bin/env node
// index-tempo.mjs — cloud fallback for the Tempo MPP indexer (replaces the Mac mini).
// Stateless full re-scan of the public Tempo RPC: fetch all TempoStreamChannel logs
// from startBlock → head and write the summary shape the dashboard's data pipeline
// (fetch-data.js Phase 5) expects.
//
//   node scripts/index-tempo.mjs [outPath]   (default: public/tempo-data.json)
//
// No API key (public RPC), no persistent state, no Mac mini.

import { createPublicClient, http } from "viem";
import { writeFileSync } from "fs";

const RPC = "https://rpc.tempo.xyz";
const CHAIN_ID = 4217;
const CONTRACT = "0x33b901018174DDabE4841042ab76ba85D4e24f25";
const START_BLOCK = 9_764_000n;
const BATCH = 99_999n; // RPC block-range cap per getLogs
const OUT = process.argv[2] || "public/tempo-data.json";

const abi = [
  { type: "event", name: "ChannelOpened", inputs: [
    { name: "channelId", type: "bytes32", indexed: true }, { name: "payer", type: "address", indexed: true }, { name: "payee", type: "address", indexed: true },
    { name: "token", type: "address" }, { name: "authorizedSigner", type: "address" }, { name: "salt", type: "bytes32" }, { name: "deposit", type: "uint256" } ] },
  { type: "event", name: "Settled", inputs: [
    { name: "channelId", type: "bytes32", indexed: true }, { name: "payer", type: "address", indexed: true }, { name: "payee", type: "address", indexed: true },
    { name: "cumulativeAmount", type: "uint256" }, { name: "deltaPaid", type: "uint256" }, { name: "newSettled", type: "uint256" } ] },
  { type: "event", name: "TopUp", inputs: [
    { name: "channelId", type: "bytes32", indexed: true }, { name: "payer", type: "address", indexed: true }, { name: "payee", type: "address", indexed: true },
    { name: "additionalDeposit", type: "uint256" }, { name: "newDeposit", type: "uint256" } ] },
  { type: "event", name: "CloseRequested", inputs: [
    { name: "channelId", type: "bytes32", indexed: true }, { name: "payer", type: "address", indexed: true }, { name: "payee", type: "address", indexed: true }, { name: "closeGraceEnd", type: "uint256" } ] },
  { type: "event", name: "ChannelClosed", inputs: [
    { name: "channelId", type: "bytes32", indexed: true }, { name: "payer", type: "address", indexed: true }, { name: "payee", type: "address", indexed: true },
    { name: "settledToPayee", type: "uint256" }, { name: "refundedToPayer", type: "uint256" } ] },
  { type: "event", name: "CloseRequestCancelled", inputs: [
    { name: "channelId", type: "bytes32", indexed: true }, { name: "payer", type: "address", indexed: true }, { name: "payee", type: "address", indexed: true } ] },
  { type: "event", name: "ChannelExpired", inputs: [
    { name: "channelId", type: "bytes32", indexed: true }, { name: "payer", type: "address", indexed: true }, { name: "payee", type: "address", indexed: true } ] },
];

const client = createPublicClient({
  chain: { id: CHAIN_ID, name: "Tempo", nativeCurrency: { name: "USD", symbol: "USD", decimals: 18 }, rpcUrls: { default: { http: [RPC] } } },
  transport: http(RPC, { timeout: 30_000, retryCount: 5, retryDelay: 300 }),
});

// getLogs over [from,to]; on "too many results" errors, split the range and recurse.
async function getLogsRange(from, to) {
  try {
    return await client.getLogs({ address: CONTRACT, events: abi, fromBlock: from, toBlock: to });
  } catch (e) {
    if (to > from) {
      const mid = from + (to - from) / 2n;
      const [a, b] = await Promise.all([getLogsRange(from, mid), getLogsRange(mid + 1n, to)]);
      return [...a, ...b];
    }
    throw e;
  }
}

// getBlock timestamp with backoff (public RPC rate-limits aggressively).
async function blockTs(b, tries = 6) {
  for (let t = 0; t < tries; t++) {
    try { return Number((await client.getBlock({ blockNumber: b })).timestamp); }
    catch { await new Promise((r) => setTimeout(r, 250 * (t + 1))); }
  }
  throw new Error(`getBlock ${b} failed after ${tries} tries`);
}

async function main() {
  const head = await client.getBlockNumber();
  console.error(`[tempo] scanning ${START_BLOCK} → ${head} (${(head - START_BLOCK).toLocaleString()} blocks)`);

  // 1) collect all contract logs in batches
  const events = [];
  for (let from = START_BLOCK; from <= head; from += BATCH) {
    const to = from + BATCH - 1n > head ? head : from + BATCH - 1n;
    const logs = await getLogsRange(from, to);
    if (logs.length) { events.push(...logs); if (events.length % 2000 < logs.length) console.error(`[tempo]   …${events.length} events`); }
  }
  console.error(`[tempo] ${events.length} events total.`);
  if (!events.length) { console.error("[tempo] no events — aborting (won't overwrite with empty)"); process.exit(1); }

  // 2) day buckets via INTERPOLATION — exact per-block timestamps would be 27k+
  //    rate-limited getBlock calls; instead sample ~500 anchors + interpolate.
  const blocks = events.map((e) => e.blockNumber);
  const minB = blocks.reduce((a, b) => (b < a ? b : a));
  const maxB = blocks.reduce((a, b) => (b > a ? b : a));
  const N = 500n;
  const anchorBlocks = [...new Set([minB, maxB, ...Array.from({ length: Number(N) + 1 }, (_, i) => minB + ((maxB - minB) * BigInt(i)) / N)])]
    .sort((a, b) => (a < b ? -1 : 1));
  console.error(`[tempo] sampling ${anchorBlocks.length} anchor timestamps (concurrency 6)…`);
  const anchors = [];
  for (let i = 0; i < anchorBlocks.length; i += 6) {
    const slice = anchorBlocks.slice(i, i + 6);
    const ts = await Promise.all(slice.map((b) => blockTs(b)));
    slice.forEach((b, j) => anchors.push([b, ts[j]]));
  }
  anchors.sort((a, b) => (a[0] < b[0] ? -1 : 1));
  const tsFor = (block) => {
    if (block <= anchors[0][0]) return anchors[0][1];
    if (block >= anchors[anchors.length - 1][0]) return anchors[anchors.length - 1][1];
    let lo = 0, hi = anchors.length - 1;
    while (lo + 1 < hi) { const mid = (lo + hi) >> 1; if (anchors[mid][0] <= block) lo = mid; else hi = mid; }
    const [b0, t0] = anchors[lo], [b1, t1] = anchors[hi];
    return Math.round(t0 + (Number(block - b0) / Number(b1 - b0 || 1n)) * (t1 - t0));
  };

  // 3) summarize (same shape as the old tempo-summary.js)
  const byType = {};
  const allPayers = new Set(), allPayees = new Set(), byDay = {};
  for (const ev of events) {
    byType[ev.eventName] = (byType[ev.eventName] || 0) + 1;
    const payer = (ev.args?.payer || "").toLowerCase();
    const payee = (ev.args?.payee || "").toLowerCase();
    if (payer) allPayers.add(payer);
    if (payee) allPayees.add(payee);
    const day = new Date(tsFor(ev.blockNumber) * 1000).toISOString().slice(0, 10);
    if (!byDay[day]) byDay[day] = { events: 0, payers: new Set(), payees: new Set() };
    byDay[day].events++;
    if (payer) byDay[day].payers.add(payer);
    if (payee) byDay[day].payees.add(payee);
  }
  const daily = Object.entries(byDay).sort(([a], [b]) => a.localeCompare(b))
    .map(([day, v]) => ({ day, events: v.events, payers: v.payers.size, payees: v.payees.size }));

  const summary = { updatedAt: new Date().toISOString(), totalEvents: events.length, uniquePayers: allPayers.size, uniquePayees: allPayees.size, byType, daily };
  writeFileSync(OUT, JSON.stringify(summary, null, 2));
  console.error(`✓ wrote ${OUT} — ${summary.totalEvents} events, ${summary.uniquePayers} payers, ${summary.uniquePayees} payees, ${daily.length} days`);
}

main().catch((e) => { console.error("FATAL:", e.message); process.exit(1); });
