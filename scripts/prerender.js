import { mkdir, readFile, writeFile } from 'fs/promises'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')
const distDir = join(root, 'dist')
const serverEntry = join(root, 'dist-ssr', 'entry-server.js')
const templatePath = join(distDir, 'index.html')
const dataPath = join(root, 'public', 'data.json')

function safeJsonForHtml(value) {
  return JSON.stringify(value)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026')
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029')
}

function outputPathForRoute(route) {
  if (route === '/') return join(distDir, 'index.html')
  return join(distDir, route.replace(/^\//, ''), 'index.html')
}

const [template, rawData] = await Promise.all([
  readFile(templatePath, 'utf8'),
  readFile(dataPath, 'utf8'),
])

const data = JSON.parse(rawData)
const { render, STAGE_1_ROUTES } = await import(serverEntry)
const serializedData = safeJsonForHtml(data)

for (const route of STAGE_1_ROUTES) {
  const appHtml = render(route, data)
  const html = template
    .replace('<div id="root"></div>', `<div id="root">${appHtml}</div>`)
    .replace('</body>', `    <script>window.__AE_DATA__=${serializedData}</script>\n  </body>`)

  const outputPath = outputPathForRoute(route)
  await mkdir(dirname(outputPath), { recursive: true })
  await writeFile(outputPath, html)
  console.log(`pre-rendered ${route} -> ${outputPath.replace(`${root}/`, '')}`)
}
