import assert from 'node:assert/strict'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { compileMDX } from 'next-mdx-remote/rsc'

const options = { blockJS: true, blockDangerousJS: true }
const payload = '(() => { throw new Error("MDX_EXPRESSION_EXECUTED") })()'
const sources = [
  `Before {${payload}} after`,
  `{${payload}}`,
  `<Figure caption="Safe caption" src="/work/example.png" bad={${payload}} />`,
  `<Figure caption="Safe caption" {...${payload}} />`,
]
for (const source of sources) {
  const { content } = await compileMDX({
    source,
    options,
    components: { Figure: ({ caption, src }) => React.createElement('figure', { 'data-src': src }, caption) },
  })
  const html = renderToStaticMarkup(content)
  assert.ok(!html.includes('MDX_EXPRESSION_EXECUTED'))
  if (source.includes('Before')) assert.match(html, /Before.*after/)
  if (source.includes('Safe caption')) assert.match(html, /Safe caption/)
  if (source.includes('/work/example.png')) assert.match(html, /data-src="\/work\/example.png"/)
}
console.log('MDX security checks passed: inline, block, attribute, and spread expressions blocked; literal component props preserved.')
