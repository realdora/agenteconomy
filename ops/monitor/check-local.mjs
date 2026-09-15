import { readFileSync } from 'node:fs'
import { inspectFeeds } from './core.mjs'
const read = name => JSON.parse(readFileSync(new URL(`../../public/${name}`, import.meta.url)))
const data = read('data.json')
console.log(JSON.stringify(inspectFeeds({ canonical: data, apex: data, dashboard: data, web: read('web-sources.json'), tempo: read('tempo-data.json') }), null, 2))
