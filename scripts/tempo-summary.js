#!/usr/bin/env node
// scripts/tempo-summary.js
// Reads the Tempo MPP indexer's events.json and outputs a summary for the dashboard.
//
// Usage on Mac Mini:
//   node tempo-summary.js /Users/dora/automaton/tempo-mpp-indexer/data/events.json > public/tempo-data.json
//
// Or add to a cron / launchd that pushes to GitHub every 6h.

import { readFileSync, writeFileSync } from 'fs'

const inputPath = process.argv[2] || '/Users/dora/automaton/tempo-mpp-indexer/data/events.json'

let events
try {
  events = JSON.parse(readFileSync(inputPath, 'utf8'))
} catch (e) {
  console.error(`Cannot read ${inputPath}: ${e.message}`)
  process.exit(1)
}

// Normalize: handle both array and object-with-events formats
const eventList = Array.isArray(events) ? events : (events.events || [])

// Count by type
const byType = {}
eventList.forEach(ev => {
  const type = ev.event || ev.type || ev.eventName || 'Unknown'
  byType[type] = (byType[type] || 0) + 1
})

// Daily aggregation
const byDay = {}
eventList.forEach(ev => {
  // Try multiple timestamp fields
  const ts = ev.timestamp || ev.blockTimestamp || ev.block_timestamp || ev.date || ''
  const day = typeof ts === 'number'
    ? new Date(ts * 1000).toISOString().slice(0, 10)
    : String(ts).slice(0, 10)
  if (!day || day.length < 10) return
  if (!byDay[day]) byDay[day] = { events: 0, payers: new Set(), payees: new Set() }
  byDay[day].events++
  if (ev.payer || ev.sender || ev.from) byDay[day].payers.add(ev.payer || ev.sender || ev.from)
  if (ev.payee || ev.receiver || ev.to) byDay[day].payees.add(ev.payee || ev.receiver || ev.to)
})

// Unique addresses
const allPayers = new Set()
const allPayees = new Set()
eventList.forEach(ev => {
  if (ev.payer || ev.sender || ev.from) allPayers.add(ev.payer || ev.sender || ev.from)
  if (ev.payee || ev.receiver || ev.to) allPayees.add(ev.payee || ev.receiver || ev.to)
})

const daily = Object.entries(byDay)
  .sort(([a], [b]) => a.localeCompare(b))
  .map(([day, v]) => ({
    day,
    events: v.events,
    payers: v.payers.size,
    payees: v.payees.size,
  }))

const summary = {
  updatedAt: new Date().toISOString(),
  totalEvents: eventList.length,
  uniquePayers: allPayers.size,
  uniquePayees: allPayees.size,
  byType,
  daily,
}

// If stdout is a TTY, pretty print; otherwise compact for file output
const output = JSON.stringify(summary, null, 2)

if (process.argv[3] === '--out' && process.argv[4]) {
  writeFileSync(process.argv[4], output)
  console.error(`✓ Wrote ${process.argv[4]}`)
  console.error(`  Total events: ${summary.totalEvents.toLocaleString()}`)
  console.error(`  Unique payers: ${summary.uniquePayers}`)
  console.error(`  Unique payees: ${summary.uniquePayees}`)
  console.error(`  Days tracked: ${summary.daily.length}`)
} else {
  process.stdout.write(output + '\n')
}
