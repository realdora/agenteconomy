import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import { extendRegistry } from './registry-lib.mjs'
const root = path.dirname(new URL(import.meta.url).pathname)
const file = path.join(root, 'manifest.json')
const manifest = JSON.parse(fs.readFileSync(file))
const normalize = sql => sql.replace(/--[^\n]*/g, '').trim().replace(/;+\s*$/, '')
const sha = value => crypto.createHash('sha256').update(value).digest('hex')
const additions = (manifest.extensions || []).flatMap(file => JSON.parse(fs.readFileSync(path.join(root, file))).addresses)
for (const [key, query] of Object.entries(manifest.queries)) {
  const template = normalize(fs.readFileSync(path.join(root, query.template), 'utf8'))
  let sql = template
  for (const id of query.registries) {
    const registry = manifest.registries[id]
    const raw = fs.readFileSync(path.join(root, registry.file), 'utf8')
    if (sha(raw) !== registry.sha256) throw Error(`Registry ${id} changed: review and version it before rebuilding`)
    const body = extendRegistry(normalize(raw), id, additions)
    if (/\bquery_\d+\b/.test(body)) throw Error(`Nested query dependency: ${id}`)
    sql = sql.replace(new RegExp(`\\bquery_${id}\\b`, 'g'), `(${body})`)
  }
  if (/\bquery_\d+\b/.test(sql)) throw Error(`Unresolved external query: ${key}`)
  // Reverse substitution proves that no filter, grouping or time bound changed.
  let reversed = sql
  for (const id of query.registries) reversed = reversed.replaceAll(`(${extendRegistry(normalize(fs.readFileSync(path.join(root, manifest.registries[id].file), 'utf8')), id, additions)})`, `query_${id}`)
  if (reversed !== template) throw Error(`Unexpected semantic edit: ${key}`)
  const attribution = query.registries.length ? `Based on source ${query.sourceQueryId} v${query.sourceVersion} by ${query.sourceOwner}; reviewed additions in manifest.` : `Preserves source ${query.sourceQueryId} v${query.sourceVersion} by ${query.sourceOwner}.`
  const output = `-- Agent Economy owned production SQL; registry version ${query.registryVersion || manifest.version}.\n-- ${attribution}\n${sql}\n`
  query.sqlSha256 = sha(output)
  if (process.argv.includes('--check')) {
    if (fs.readFileSync(path.join(root, query.generated), 'utf8') !== output) throw Error(`Generated SQL differs: ${key}`)
  } else fs.writeFileSync(path.join(root, query.generated), output)
}
if (!process.argv.includes('--check')) fs.writeFileSync(file, JSON.stringify(manifest, null, 2) + '\n')
console.log('Owned queries verified; frozen source registries plus reviewed extensions; no executable external query references')
