export function extendRegistry(body, id, additions) {
  if (!['6054244', '6057445'].includes(id)) return body
  const columns = id === '6054244' ? 'address, project, blockchain' : 'address, facilitator, chain'
  const rows = additions.map(r => {
    if (!/^0x[a-f0-9]{40}$/.test(r.address) || r.facilitator !== 'Coinbase' || r.chain !== 'base') throw Error('Unreviewed registry extension')
    if (body.toLowerCase().includes(r.address)) throw Error(`Address already present: ${r.address}`)
    return `(${r.address}, 'Coinbase', 'base')`
  })
  if (new Set(additions.map(r => r.address)).size !== additions.length) throw Error('Duplicate registry extension')
  return `SELECT ${columns} FROM (${body}) legacy\nUNION ALL\nSELECT ${columns} FROM (VALUES\n${rows.join(',\n')}\n) added(${columns})`
}
