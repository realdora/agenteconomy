# [SUPERSEDED 2026-06-10 → see RUNBOOK-2026-06-29.md]
# This documented the incremental-fork backfill; that design was abandoned
# (forks dead with the suspended account; recent-window + frozen baseline now).
# Kept for the gotchas only.

# Dune backfill — resume runbook (after free-tier execution cap resets)

Blocked 2026-06-06: ~40 executions in one session tripped an account-level
execution block on the free account (all executes → HTTP 400 "Deprecated query
engine"; reads still work). Expected to reset at 00:00 UTC. Resume in small,
spaced daily batches so it doesn't re-trip.

All commands assume:
```
set -a; source ~/.config/dune/agenteconomy.env; set +a
cd /tmp/agenteconomy-fix   # branch feat/dune-pipeline-v3
```

## 0. Preflight — confirm the cap reset (1 cheap execution)
```
curl -s -X POST -H "x-dune-api-key: $DUNE_API_KEY" -H "Content-Type: application/json" \
  -d '{"performance":"small"}' https://api.dune.com/api/v1/query/6200422/execute
```
- `execution_id` in response → unblocked, proceed.
- `"Deprecated query engine"` → still capped, wait longer.

## 1. Registry fork 7666083 (already PATCHed: boundary-fixed, floor 2025-09-30, 12d)
Its stored result is empty (needs full backfill, ~21 runs). Spread over days if needed.
```
node scripts/dune/backfill.mjs 7666083 block_date --max-runs=12 --space-ms=20000
# repeat next day until it prints "Caught up"
```

## 2. x402 fork 7666075 (MUST re-PATCH first — current Dune def is the buggy-boundary version)
```
node -e "const fs=require('fs');fs.writeFileSync('/tmp/p.json',JSON.stringify({query_sql:fs.readFileSync('scripts/dune/x402-cumulative-incremental.sql','utf8'),query_engine:'v2 Dune SQL'}))"
curl -s -X PATCH -H "x-dune-api-key: $DUNE_API_KEY" -H "Content-Type: application/json" \
  --data @/tmp/p.json https://api.dune.com/api/v1/query/7666075   # resets to empty
node scripts/dune/backfill.mjs 7666075 day --max-runs=12 --space-ms=20000
# repeat next day until "Caught up"
```

## 3. Verify both clean (no duplicate keys = boundary correct)
```
for q in 7666075:day:facilitator 7666083:block_date:blockchain; do
  id=${q%%:*}; rest=${q#*:}; df=${rest%%:*}; kc=${rest#*:}
  curl -s -H "x-dune-api-key: $DUNE_API_KEY" \
    "https://api.dune.com/api/v1/query/$id/results?limit=30000" \
  | node -e "let s='';process.stdin.on('data',d=>s+=d).on('end',()=>{const r=JSON.parse(s).result.rows;const seen=new Set();let dup=0;for(const x of r){const k=x['$df']+'|'+x['$kc'];if(seen.has(k))dup++;seen.add(k)}console.log('$id:',r.length,'rows,',dup,'dups')})"
done
```

## 4. Full pipeline + reconcile vs prod (zero executions — reads fresh fork results)
```
TMP=$(mktemp -d); cp public/data.json "$TMP/"; cp public/tempo-data.json "$TMP/" 2>/dev/null
DATA_OUT_DIR="$TMP" DUNE_MAX_EXECUTIONS_PER_RUN=0 node scripts/fetch-data.js
# compare $TMP/data.json x402.totalTxs + registry.totalAgents to public/data.json
```
x402 should now be within ~1 day's growth of prod (the ~3% boundary inflation gone).

## 5. Go live
```
DUNE_MAX_EXECUTIONS_PER_RUN=3 node scripts/fetch-data.js      # writes public/data.json
git add public/data.json && git commit -m "chore: refresh data via incremental forks"
gh secret set DUNE_API_KEY -R realdora/agenteconomy           # paste NEW account key
gh workflow enable "Update Dune Data" -R realdora/agenteconomy
```
Steady state = 1–3 small executions/day (only stale sources refresh), far under any cap.
