const assert = require('node:assert/strict')
const fs = require('node:fs')
const vm = require('node:vm')
const ts = require('typescript')
function load(file) {
  const module = { exports: {} }
  const source = ts.transpileModule(fs.readFileSync(file, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText
  vm.runInNewContext(source, { module, exports: module.exports, URL })
  return module.exports
}
const { classifyLink } = load('lib/analytics.ts')
const origin = 'https://www.jinyaodesign.com'
const classify = (href) => classifyLink(href, origin)
assert.equal(classify('/work/isleo?utm_source=medium').params.project_slug, 'isleo')
assert.equal(classify('/Jinyao_Ouyang_Resume.pdf?download=1').name, 'resume_click')
assert.equal(classify('mailto:private@example.com?body=secret').params.method, 'email')
assert.ok(!JSON.stringify(classify('mailto:private@example.com?body=secret')).includes('private'))
assert.equal(classify('https://evil.example/work/isleo'), null)
assert.equal(classify('https://linkedin.com.evil.example'), null)
assert.equal(classify('javascript:alert(1)'), null)
assert.equal(classify('https://trailai-rose.vercel.app/?private=secret').params.destination, 'trailai-rose.vercel.app')
const { articleSource } = load('lib/articleSource.ts')
assert.equal(articleSource('Original article').sourceUrl, null)
assert.equal(articleSource('> Originally published on Medium: https://medium.com/@author/article?source=rss#hi\n\nBody').sourceUrl, 'https://medium.com/@author/article')
assert.equal(articleSource('> Originally published on Medium: https://medium.com/@author/article\n\nBody').content, 'Body')
assert.equal(articleSource('> Originally published on Medium: https://medium.com.evil.example/article\n\nBody').sourceUrl, null)
console.log('12 checks passed: event destinations, privacy, and article canonicals.')
