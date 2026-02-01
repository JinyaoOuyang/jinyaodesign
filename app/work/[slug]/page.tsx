import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getWorkPosts, getWorkBySlug, getAdjacentWork } from '@/lib/content'
import { serializeMDX } from '@/lib/mdx'
import { MDXContent } from '@/components/MDXContent'
import { siteConfig } from '@/lib/config'

interface Props {
  params: { slug: string }
}

export async function generateStaticParams() {
  const posts = getWorkPosts()
  return posts.map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const work = getWorkBySlug(params.slug)
  if (!work) return {}

  return {
    title: work.title,
    description: work.description,
    openGraph: {
      title: work.title,
      description: work.description,
      type: 'article',
      url: `${siteConfig.url}/work/${work.slug}`,
      images: work.coverImage ? [{ url: work.coverImage }] : undefined,
    },
  }
}

export default async function WorkDetailPage({ params }: Props) {
  const work = getWorkBySlug(params.slug)
  if (!work) notFound()

  const { prev, next } = getAdjacentWork(params.slug)
  const mdxSource = await serializeMDX(work.content)

  const formattedDate = new Date(work.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
  })

  return (
    <article className="mx-auto max-w-3xl px-6 py-16">
      {/* Header */}
      <header className="mb-12">
        <Link
          href="/work"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          ← Back to Work
        </Link>
        <h1 className="text-3xl font-semibold tracking-tight md:text-4xl lg:text-5xl">
          {work.title}
        </h1>
        <p className="mt-4 text-xl text-muted-foreground">
          {work.description}
        </p>
      </header>

      {/* Cover Image */}
      <div className="relative aspect-video overflow-hidden rounded-lg bg-muted mb-12">
        <Image
          src={work.coverImage}
          alt={work.title}
          fill
          className="object-cover"
          priority
          sizes="(max-width: 768px) 100vw, 760px"
        />
      </div>

      {/* Meta Info */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-8 border-y border-border mb-12">
        <div>
          <h3 className="text-sm text-muted-foreground mb-1">Role</h3>
          <p className="font-medium">{work.role}</p>
        </div>
        <div>
          <h3 className="text-sm text-muted-foreground mb-1">Timeline</h3>
          <p className="font-medium">{work.timeline}</p>
        </div>
        <div>
          <h3 className="text-sm text-muted-foreground mb-1">Date</h3>
          <p className="font-medium">{formattedDate}</p>
        </div>
        <div>
          <h3 className="text-sm text-muted-foreground mb-1">Tools</h3>
          <p className="font-medium">{work.tools.join(', ')}</p>
        </div>
      </div>

      {/* Metrics */}
      {work.metrics && work.metrics.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-8 bg-muted rounded-lg px-6 mb-12">
          {work.metrics.map((metric, index) => (
            <div key={index} className="text-center">
              <p className="text-lg font-semibold">{metric}</p>
            </div>
          ))}
        </div>
      )}

      {/* Content */}
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <MDXContent source={mdxSource} />
      </div>

      {/* Tags */}
      <div className="mt-12 pt-8 border-t border-border">
        <div className="flex flex-wrap gap-2">
          {work.tags.map((tag) => (
            <span
              key={tag}
              className="text-sm text-muted-foreground bg-muted px-3 py-1 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <nav className="mt-12 pt-8 border-t border-border">
        <div className="flex justify-between">
          {prev && (
            <Link
              href={`/work/${prev.slug}`}
              className="group"
            >
              <span className="text-sm text-muted-foreground">Previous</span>
              <p className="font-medium group-hover:opacity-70 transition-opacity">
                {prev.title}
              </p>
            </Link>
          )}
          {next && (
            <Link
              href={`/work/${next.slug}`}
              className="group text-right ml-auto"
            >
              <span className="text-sm text-muted-foreground">Next</span>
              <p className="font-medium group-hover:opacity-70 transition-opacity">
                {next.title}
              </p>
            </Link>
          )}
        </div>
      </nav>
    </article>
  )
}
