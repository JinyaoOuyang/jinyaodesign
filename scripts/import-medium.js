const fs = require('fs')
const path = require('path')
const Parser = require('rss-parser')
const TurndownService = require('turndown')
const matter = require('gray-matter')

const MEDIUM_FEED_URL = process.env.MEDIUM_FEED_URL || 'https://ginouyang.medium.com/feed'

async function main() {
    const blogDir = path.join(process.cwd(), 'content/blog')
    if (!fs.existsSync(blogDir)) fs.mkdirSync(blogDir, { recursive: true })

    const parser = new Parser({
        customFields: {
            item: [
                ['content:encoded', 'contentEncoded']
            ],
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

        // Extract cover image from the first <img> in the Medium content
        const imgMatch = contentHtml.match(/<img[^>]+src=["']([^"']+)["']/)
        const coverImage = imgMatch ? imgMatch[1] : ''

        const slug = title
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '')
            .trim()
            .replace(/\s+/g, '-')
            .slice(0, 80)

        const filePath = path.join(blogDir, `${slug}.mdx`)

        // Preserve existing frontmatter fields if the file already exists
        let existingFm = {}
        if (fs.existsSync(filePath)) {
            const existing = fs.readFileSync(filePath, 'utf8')
            existingFm = matter(existing).data
        }

        // Refresh feed fields while preserving curated summaries and project links.
        const frontmatter = {
            ...existingFm,
            title,
            description: existingFm.description || (item.contentSnippet || '').replace(/\n/g, ' ').slice(0, 180),
            date: isoDate.slice(0, 10),
            tags: existingFm.tags || [],
            coverImage: existingFm.coverImage || coverImage,
            readingTime: existingFm.readingTime || '',
        }

        const attribution = `\n> Originally published on Medium: ${link}\n\n`

        fs.writeFileSync(filePath, matter.stringify(attribution + mdBody, frontmatter), 'utf8')
        console.log(`Saved: ${filePath}`)
    }

    console.log('Import complete.')
}

main().catch((err) => {
    console.error(err)
    process.exit(1)
})
