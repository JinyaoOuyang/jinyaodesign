import fs from 'fs'
import path from 'path'
import Parser from 'rss-parser'
import TurndownService from 'turndown'

// Configure your Medium feed URL here or pass via env MEDIUM_FEED_URL
const MEDIUM_FEED_URL = process.env.MEDIUM_FEED_URL || 'https://ginouyang.medium.com/feed'

async function main() {
  const blogDir = path.join(process.cwd(), 'content/blog')
  if (!fs.existsSync(blogDir)) fs.mkdirSync(blogDir, { recursive: true })

  const parser = new Parser({
    customFields: {
      item: [['content:encoded', 'contentEncoded']],
    },
  }) as Parser<{ items: any[] }>

  console.log(`Fetching Medium feed: ${MEDIUM_FEED_URL}`)
  const feed = await parser.parseURL(MEDIUM_FEED_URL)

  const turndown = new TurndownService({ headingStyle: 'atx' })

  for (const item of feed.items) {
    const title: string = item.title || 'untitled'
    const isoDate: string = (item as any).isoDate || new Date().toISOString()
    const link: string = item.link || ''
    const contentHtml: string = (item as any).contentEncoded || (item as any)['content:encoded'] || (item as any).content || ''
    const mdBody = turndown.turndown(contentHtml)

    // Create a slug from title
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
