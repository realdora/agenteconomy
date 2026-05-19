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

function safeJsonForScript(value) {
  return JSON.stringify(value, null, 2)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026')
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029')
}

function escapeAttr(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

function outputPathForRoute(route) {
  if (route === '/') return join(distDir, 'index.html')
  return join(distDir, route.replace(/^\//, ''), 'index.html')
}

function cleanUrlOutputPathForRoute(route) {
  if (route === '/') return null
  return join(distDir, `${route.replace(/^\//, '')}.html`)
}

function replaceRequired(html, pattern, replacement, label) {
  const next = html.replace(pattern, replacement)
  if (next === html) {
    throw new Error(`Failed to replace ${label}`)
  }
  return next
}

function jsonLdBlock(value) {
  return `    <script type="application/ld+json">\n${safeJsonForScript(value).split('\n').map(line => `    ${line}`).join('\n')}\n    </script>`
}

function applyHomepageStructuredData(html, collectionJsonLd) {
  return replaceRequired(
    html,
    '    <!-- Open Graph -->',
    `${jsonLdBlock(collectionJsonLd)}\n\n    <!-- Open Graph -->`,
    'homepage CollectionPage JSON-LD'
  )
}

function applyRouteHead(html, head) {
  let next = html
  next = replaceRequired(next, /<title>[\s\S]*?<\/title>/, `<title>${escapeAttr(head.title)}</title>`, 'title')
  next = replaceRequired(next, /<meta name="description" content="[^"]*" \/>/, `<meta name="description" content="${escapeAttr(head.description)}" />`, 'meta description')
  next = replaceRequired(next, /<link rel="canonical" href="[^"]*" \/>/, `<link rel="canonical" href="${escapeAttr(head.canonical)}" />`, 'canonical')
  next = replaceRequired(next, /<meta property="og:title" content="[^"]*" \/>/, `<meta property="og:title" content="${escapeAttr(head.ogTitle)}" />`, 'og:title')
  next = replaceRequired(next, /<meta property="og:description" content="[^"]*" \/>/, `<meta property="og:description" content="${escapeAttr(head.ogDescription)}" />`, 'og:description')
  next = replaceRequired(next, /<meta property="og:url" content="[^"]*" \/>/, `<meta property="og:url" content="${escapeAttr(head.ogUrl)}" />`, 'og:url')
  next = replaceRequired(next, /<meta name="twitter:title" content="[^"]*" \/>/, `<meta name="twitter:title" content="${escapeAttr(head.twitterTitle)}" />`, 'twitter:title')
  next = replaceRequired(next, /<meta name="twitter:description" content="[^"]*" \/>/, `<meta name="twitter:description" content="${escapeAttr(head.twitterDescription)}" />`, 'twitter:description')

  const routeJsonLd = head.jsonLd.map(jsonLdBlock).join('\n\n')
  next = replaceRequired(
    next,
    /    <!-- Structured Data: WebSite -->[\s\S]*?    <!-- Open Graph -->/,
    `${routeJsonLd}\n\n    <!-- Open Graph -->`,
    'route JSON-LD blocks'
  )

  next = replaceRequired(
    next,
    /    <!-- SEO: noscript fallback so search engines can index content without JS -->\n    <noscript>[\s\S]*?    <\/noscript>/,
    `    <!-- SEO: route-specific noscript fallback -->\n${head.noscript}`,
    'route noscript'
  )

  return next
}

const [template, rawData] = await Promise.all([
  readFile(templatePath, 'utf8'),
  readFile(dataPath, 'utf8'),
])

const data = JSON.parse(rawData)
const { render, STAGE_1_ROUTES, getHomepageCollectionJsonLd, getRouteHead } = await import(serverEntry)
const serializedData = safeJsonForHtml(data)

for (const route of STAGE_1_ROUTES) {
  const appHtml = render(route, data)
  let html = template
    .replace('<div id="root"></div>', `<div id="root">${appHtml}</div>`)
    .replace('</body>', `    <script>window.__AE_DATA__=${serializedData}</script>\n  </body>`)

  if (route === '/') {
    html = applyHomepageStructuredData(html, getHomepageCollectionJsonLd())
  } else {
    html = applyRouteHead(html, getRouteHead(route, data))
  }

  const outputPath = outputPathForRoute(route)
  await mkdir(dirname(outputPath), { recursive: true })
  await writeFile(outputPath, html)
  const cleanOutputPath = cleanUrlOutputPathForRoute(route)
  if (cleanOutputPath) {
    await writeFile(cleanOutputPath, html)
  }
  console.log(`pre-rendered ${route} -> ${outputPath.replace(`${root}/`, '')}`)
}
