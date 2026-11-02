import { articleSource } from '@/lib/articleSource'
import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getBlogPosts, getBlogBySlug, getWorkBySlug } from '@/lib/content'
import { RelatedWork } from '@/components/RelatedWork'
import type { Work } from '@/lib/types'
import { MDXContent } from '@/components/MDXContent'
import { siteConfig } from '@/lib/config'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const posts = getBlogPosts()
  return posts.map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = getBlogBySlug(slug)
  if (!post) return {}

  return {
    alternates: { canonical: articleSource(post.content).sourceUrl ?? `/blog/${post.slug}` },
    title: post.title,
    description: post.description,
    twitter: { card: 'summary_large_image', title: post.title, description: post.description, images: [post.coverImage || '/opengraph-image'] },
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      url: `${siteConfig.url}/blog/${post.slug}`,
      images: [{ url: post.coverImage || '/opengraph-image', alt: post.title }],
      publishedTime: post.date,
    },
  }
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const post = getBlogBySlug(slug)
  if (!post) notFound()

  const relatedWork = (post.relatedWork ?? [])
    .map(getWorkBySlug)
    .filter((work): work is Work => work !== null)

  // Present the imported source notice as a readable link, keeping article prose intact.
  const { sourceUrl, content: articleContent } = articleSource(post.content)

  const formattedDate = new Date(post.date).toLocaleDateString('en-US', {
    timeZone: 'UTC',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <article className="mx-auto max-w-3xl px-6 py-16">
      {/* Header */}
      <header className="mb-12">
        <Link
          href="/blog"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          ← Back to Blog
        </Link>
        <div className="flex items-center gap-3 text-sm text-muted-foreground mb-4">
          <time dateTime={post.date}>{formattedDate}</time>
          {post.readingTime && (
            <>
              <span>·</span>
              <span>{post.readingTime}</span>
            </>
          )}
        </div>
        <h1 className="text-3xl font-semibold tracking-tight md:text-4xl lg:text-5xl">
          {post.title}
        </h1>
        <p className="mt-4 text-xl text-muted-foreground">
          {post.description}
        </p>
        {sourceUrl && (
          <a href={sourceUrl.toString()} target="_blank" rel="noopener noreferrer" className="mt-5 inline-block text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground">
            Originally published on Medium <span aria-hidden="true">↗</span>
          </a>
        )}
      </header>

      {/* Content */}
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <MDXContent source={articleContent} />
      </div>

      <RelatedWork works={relatedWork} />

      <aside aria-label="About the author" className="mt-10 border-t border-border pt-6 text-sm leading-relaxed text-muted-foreground">
        Written by{' '}
        <Link href="/about" className="font-medium text-foreground underline underline-offset-4">Jinyao Ouyang</Link>,
        a Design Engineer working across product design and implementation.{' '}
        <Link href="/work" className="text-foreground underline underline-offset-4">Explore the projects</Link>{' '}
        or <a href={`mailto:${siteConfig.email}`} className="text-foreground underline underline-offset-4">get in touch</a>.
      </aside>

      {/* Tags */}
      {post.tags.length > 0 && (
        <div className="mt-12 pt-8 border-t border-border">
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="text-sm text-muted-foreground tag-pill px-3 py-1 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}
    </article>
  )
}
