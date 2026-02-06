const fs = require('fs')
const path = require('path')
const Parser = require('rss-parser')
const TurndownService = require('turndown')

const MEDIUM_FEED_URL = process.env.MEDIUM_FEED_URL || 'https://ginouyang.medium.com/feed'

async function main() {
  const blogDir = path.join(process.cwd(), 'content/blog')
  if (!fs.existsSync(blogDir)) fs.mkdirSync(blogDir, { recursive: true })

  const parser = new Parser({
    customFields: {
      item: [['content:encoded', 'contentEncoded']],
    },
  })

  console.log(`Fetching Medium feed: ${MEDIUM_FEED_URL}`)
  const feed = await parser.parseURL(MEDIUM_FEED_URL)

  const turndown = new TurndownService({ headingStyle: 'atx' })

  for (const item of feed.items) {
    const title = item.title || 'untitled'
    const isoDate = item.isoDate || new Date().toISOString()
    const link = item.link || ''
    const contentHtml = item.contentEncoded || item['content:encoded'] || item.content || ''
    const mdBody = turndown.turndown(contentHtml)

    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-')
      .slice(0, 80)

    const fm = [
      '---',
      `title: "${title.replace(/"/g, '\\"')}"`,
      `description: "${(item.contentSnippet || '').replace(/\n/g, ' ').slice(0, 180).replace(/"/g, '\\"')}"`,
      `date: "${isoDate.slice(0, 10)}"`,
      'tags: []',
      `readingTime: ""`,
      '---',
      '',
    ].join('\n')

    const attribution = `\n> Originally published on Medium: ${link}\n\n`
    const filePath = path.join(blogDir, `${slug}.mdx`)

    fs.writeFileSync(filePath, fm + attribution + mdBody, 'utf8')
    console.log(`Saved: ${filePath}`)
  }

  console.log('Import complete.')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
