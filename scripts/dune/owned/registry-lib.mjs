// Reviewed (facilitator, chain) pairs an extension may add. Anything else is
// refused, so an extension cannot silently widen scope to a new facilitator.
const REVIEWED = new Set(['Coinbase/base', 'Celo/celo'])
const EXTENSIBLE = ['6054244', '6057445']

// Each addition may name the registries it extends (`registries`); without it,
// it extends both, which keeps the 2026-10-22 Coinbase extension unchanged.
export function extendRegistry(body, id, additions) {
  if (!EXTENSIBLE.includes(id)) return body
  const scoped = additions.filter(r => (r.registries || EXTENSIBLE).includes(id))
  if (!scoped.length) return body
  const columns = id === '6054244' ? 'address, project, blockchain' : 'address, facilitator, chain'
  const rows = scoped.map(r => {
    if (!/^0x[a-f0-9]{40}$/.test(r.address) || !REVIEWED.has(`${r.facilitator}/${r.chain}`)) throw Error('Unreviewed registry extension')
    if (body.toLowerCase().includes(r.address)) throw Error(`Address already present: ${r.address}`)
    return `(${r.address}, '${r.facilitator}', '${r.chain}')`
  })
  if (new Set(scoped.map(r => r.address)).size !== scoped.length) throw Error('Duplicate registry extension')
  return `SELECT ${columns} FROM (${body}) legacy\nUNION ALL\nSELECT ${columns} FROM (VALUES\n${rows.join(',\n')}\n) added(${columns})`
}
