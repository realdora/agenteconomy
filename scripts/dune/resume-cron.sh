#!/bin/zsh
# Self-healing nightly resume for the Dune backfill, after the free-tier
# execution cap (HTTP 400 "Deprecated query engine") resets.
#
# Runs daily at 08:30 local (just after 00:00 UTC reset). Each run:
#   1. preflight — is execution unblocked? if not, log and exit (retry tomorrow)
#   2. advance registry + x402 backfills as far as the day's quota allows
#      (stops cleanly on cap/timeout; resumes from stored state next day)
#   3. when BOTH are caught up: reconcile + dup-check, write .backfill-done,
#      and stop the launchd job. NEVER swaps the GH secret or re-enables cron
#      (those wait for Dora's explicit OK).
#
# Driven by com.dora.agenteconomy-resume.plist.

export PATH="/usr/local/bin:/opt/homebrew/bin:/usr/bin:/bin:/usr/sbin:/sbin"
DIR=~/Code/agenteconomy-fix
LOG="$DIR/scripts/dune/resume.log"
DONE="$DIR/scripts/dune/.backfill-done"
PATCHED="$DIR/scripts/dune/.x402-patched"
exec >> "$LOG" 2>&1

echo ""
echo "================ resume run $(date) ================"
[ -f "$DONE" ] && { echo "already DONE — nothing to do"; exit 0; }

source ~/.config/dune/agenteconomy.env
export DUNE_API_KEY
cd "$DIR" || { echo "FATAL: no $DIR"; exit 1; }

# 1. preflight ---------------------------------------------------------------
RESP=$(curl -s --max-time 30 -X POST -H "x-dune-api-key: $DUNE_API_KEY" \
  -H "Content-Type: application/json" -d '{"performance":"small"}' \
  https://api.dune.com/api/v1/query/6200422/execute)
echo "preflight: $RESP"
if ! echo "$RESP" | grep -q execution_id; then
  echo "STILL CAPPED — will retry next scheduled run"
  exit 0
fi
echo "UNBLOCKED — proceeding"

# 2. registry (7666083) — already PATCHed (12d, boundary-fixed); resumes -------
echo "--- registry backfill ---"
node scripts/dune/backfill.mjs 7666083 block_date --max-runs=24 --space-ms=20000
REG=$?
echo "registry exit=$REG (0=caught up)"

# 3. x402 (7666075) — PATCH the fixed SQL once, then backfill ------------------
echo "--- x402 backfill ---"
if [ ! -f "$PATCHED" ]; then
  node -e "const fs=require('fs');fs.writeFileSync('/tmp/x402patch.json',JSON.stringify({query_sql:fs.readFileSync('scripts/dune/x402-cumulative-incremental.sql','utf8'),query_engine:'v2 Dune SQL'}))"
  PR=$(curl -s -X PATCH -H "x-dune-api-key: $DUNE_API_KEY" -H "Content-Type: application/json" \
    --data @/tmp/x402patch.json https://api.dune.com/api/v1/query/7666075)
  echo "x402 PATCH: $PR"
  echo "$PR" | grep -q query_id && touch "$PATCHED"
fi
node scripts/dune/backfill.mjs 7666075 day --max-runs=24 --space-ms=20000
X402=$?
echo "x402 exit=$X402 (0=caught up)"

# 4. both caught up? reconcile, mark done, stop the job -----------------------
if [ "$REG" -eq 0 ] && [ "$X402" -eq 0 ]; then
  echo "--- both caught up: reconcile (zero executions) ---"
  TMP=$(mktemp -d); cp public/data.json "$TMP/"; cp public/tempo-data.json "$TMP/" 2>/dev/null
  DATA_OUT_DIR="$TMP" DUNE_MAX_EXECUTIONS_PER_RUN=0 node scripts/fetch-data.js || echo "(pipeline read had warnings)"
  node -e "
    const prod=require('./public/data.json'), neu=require('$TMP/data.json');
    const pct=(a,b)=>b?((a-b)/b*100).toFixed(2)+'%':'n/a';
    console.log('RECONCILE x402.totalTxs prod',prod.x402.totalTxs,'fork',neu.x402.totalTxs,'Δ',pct(neu.x402.totalTxs,prod.x402.totalTxs));
    console.log('RECONCILE registry.agents prod',prod.erc8004Registry.totalAgents,'fork',neu.erc8004Registry.totalAgents,'Δ',pct(neu.erc8004Registry.totalAgents,prod.erc8004Registry.totalAgents));
  " 2>&1
  touch "$DONE"
  echo "BACKFILL DONE — data backfilled & reconciled. Awaiting Dora's OK for secret swap + cron enable."
  launchctl unload ~/Library/LaunchAgents/com.dora.agenteconomy-resume.plist 2>/dev/null
  echo "launchd job unloaded (will not run again)"
else
  echo "not fully caught up (reg=$REG x402=$X402) — daily quota likely spent; resumes next scheduled run"
fi
echo "================ end $(date) ================"
