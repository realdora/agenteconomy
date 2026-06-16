#!/usr/bin/env node
// merge-tempo-into-data.mjs — patch data.json.tempoMpp from the fresh tempo-data.json.
//
// Normally fetch-data.js (the Dune pipeline) does this in its Phase 5, but that
// pipeline is frozen until the Dune account renews (~6/29). This lets the cloud
// Tempo cron keep data.json's tempoMpp fresh independently, so the live site
// shows current Tempo numbers without waiting for the full pipeline.
//
// Produces the EXACT same tempoMpp shape as fetch-data.js Phase 5, so when the
// Dune pipeline resumes it re-merges identically (idempotent, no conflict).
// Only the tempoMpp field is touched; every other protocol + the global
// updatedAt are left exactly as they were (they stay Dune-frozen, honestly).

import { readFileSync, writeFileSync } from "fs";

const DATA = "public/data.json";
const TEMPO = "public/tempo-data.json";

const data = JSON.parse(readFileSync(DATA, "utf8"));
const td = JSON.parse(readFileSync(TEMPO, "utf8"));

data.tempoMpp = {
  totalEvents: td.totalEvents || 0,
  uniquePayers: td.uniquePayers || 0,
  uniquePayees: td.uniquePayees || 0,
  byType: td.byType || {},
  daily: (td.daily || []).slice(-90),
};

writeFileSync(DATA, JSON.stringify(data, null, 2));
console.error(`✓ data.json.tempoMpp ← ${data.tempoMpp.totalEvents} events, daily to ${data.tempoMpp.daily.at(-1)?.day}`);
