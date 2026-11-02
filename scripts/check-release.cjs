const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const base = process.env.PORTFOLIO_URL || 'http://127.0.0.1:3010'
const origin = 'https://www.jinyaodesign.com'
async function check() {
  const paths = ['/', '/work', '/blog', '/about']
  for (const kind of ['work', 'blog']) {
    for (const name of fs.readdirSync(`content/${kind}`).filter(x => x.endsWith('.mdx'))) paths.push(`/${kind}/${name.slice(0,-4)}`)
  }
  for (const route of paths) {
    const response = await fetch(base + route)
    assert.equal(response.status, 200, route)
    const html = await response.text()
    const canonical = html.match(/<link rel="canonical" href="([^"]+)"/)
    assert.ok(canonical, `canonical: ${route}`)
    assert.ok(html.includes('property="og:image"'), `OG image: ${route}`)
    assert.ok(html.includes('name="twitter:card" content="summary_large_image"'), `Twitter card: ${route}`)
    if (route.startsWith('/blog/')) assert.match(canonical[1], /^https:\/\/(?:medium\.com|[a-z0-9-]+\.medium\.com)\//)
    else assert.equal(canonical[1], origin + (route === '/' ? '' : route))
    for (const href of html.matchAll(/href="(\/[^"?#]*)/g)) {
      const local = href[1]
      if (/\.[a-z0-9]{2,5}$/i.test(local) && !local.startsWith('/_next/')) assert.ok(fs.existsSync(path.join('public', decodeURIComponent(local))), `missing asset ${local}`)
    }
  }
  const pdf = await fetch(base + '/Jinyao_Ouyang_Resume.pdf')
  assert.equal(pdf.status, 200)
  assert.match(pdf.headers.get('content-type'), /pdf/)
  assert.equal(Buffer.from(await pdf.arrayBuffer()).subarray(0,4).toString(), '%PDF')
  const image = await fetch(base + '/opengraph-image')
  assert.equal(image.status, 200, 'OG renderer')
  assert.match(image.headers.get('content-type'), /image\/png/)
  const sitemap = await (await fetch(base + '/sitemap.xml')).text()
  assert.ok(!sitemap.includes('/blog/'), 'Do not submit syndicated articles as canonical pages')
  for (const route of ['/clay-preview', '/clay-scroll-test']) assert.match(await (await fetch(base + route)).text(), /noindex/)
  console.log(`${paths.length} pages passed canonical/share checks; PDF, OG renderer, sitemap, preview noindex, and linked assets passed.`)
}
check().catch(e => { console.error(e); process.exitCode = 1 })
