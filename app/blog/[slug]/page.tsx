import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getBlogPosts, getBlogBySlug } from '@/lib/content'
import { MDXContent } from '@/components/MDXContent'
import { siteConfig } from '@/lib/config'

interface Props {
  params: { slug: string }
}

export async function generateStaticParams() {
  const posts = getBlogPosts()
  return posts.map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = getBlogBySlug(params.slug)
  if (!post) return {}

  return {
    title: post.title,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      url: `${siteConfig.url}/blog/${post.slug}`,
      images: post.coverImage ? [{ url: post.coverImage }] : undefined,
    },
  }
}

export default async function BlogPostPage({ params }: Props) {
  const post = getBlogBySlug(params.slug)
  if (!post) notFound()

  
  const formattedDate = new Date(post.date).toLocaleDateString('en-US', {
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
      </header>

      {/* Content */}
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <MDXContent source={post.content} />
      </div>

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
