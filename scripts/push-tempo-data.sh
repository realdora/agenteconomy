#!/bin/bash
# push-tempo-data.sh — Generate tempo summary and push to GitHub
# Runs every 6 hours via launchd, 15 minutes before GitHub Action cron

set -e

REPO_DIR="$HOME/agenteconomy"
EVENTS_JSON="$HOME/automaton/tempo-mpp-indexer/data/events.json"
LOG_FILE="$HOME/automaton/logs/tempo-push.log"

mkdir -p "$(dirname "$LOG_FILE")"

{
  echo "──── $(date -u '+%Y-%m-%d %H:%M UTC') ────"

  cd "$REPO_DIR"

  # Pull latest to avoid conflicts
  git pull --rebase --quiet

  # Generate tempo summary
  /opt/homebrew/bin/node scripts/tempo-summary.js "$EVENTS_JSON" --out public/tempo-data.json

  # Commit and push if changed
  git add public/tempo-data.json
  if git diff --staged --quiet; then
    echo "No changes to tempo data, skipping push"
  else
    git commit -m "chore: update tempo data $(date -u '+%Y-%m-%d %H:%M UTC')"
    git push
    echo "Pushed tempo-data.json to GitHub"
  fi

  echo ""
} >> "$LOG_FILE" 2>&1
