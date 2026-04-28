import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getWorkPosts, getWorkBySlug, getAdjacentWork } from '@/lib/content'
import { MDXContent } from '@/components/MDXContent'
import { CaseStudyTOC } from '@/components/CaseStudyTOC'
import { extractHeadings } from '@/lib/toc'
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
  
  const formattedDate = new Date(work.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
  })

  return (
    <article className="mx-auto max-w-5xl px-6 pt-10 pb-16">
      {/* Back link */}
      <Link
        href="/work"
        className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground hover:text-foreground transition-colors mb-10"
      >
        <span aria-hidden="true">←</span> Back to work
      </Link>

      {/* Header: tag row + title + desc on left, meta side on right */}
      <header className="grid gap-10 md:grid-cols-[2fr_1fr] md:gap-12 items-end pb-8 border-b border-border">
        <div>
          <div className="cs-tag-row">
            {work.tags.slice(0, 4).map((tag) => (
              <span key={tag} className="tag">{tag}</span>
            ))}
          </div>
          <h1 className="cs-title">{work.title}</h1>
          <p className="cs-desc">{work.description}</p>
        </div>
        <div className="cs-side">
          <div className="row">
            <span className="k">Role</span>
            <span className="v">{work.role}</span>
          </div>
          <div className="row">
            <span className="k">Timeline</span>
            <span className="v">{work.timeline}</span>
          </div>
          <div className="row">
            <span className="k">Date</span>
            <span className="v">{formattedDate}</span>
          </div>
          <div className="row">
            <span className="k">Tools</span>
            <span className="v">{work.tools.join(', ')}</span>
          </div>
        </div>
      </header>

      {/* Cover */}
      <div className="cs-cover-wrap my-12 md:my-16">
        <Image
          src={work.coverImage}
          alt={work.title}
          fill
          className="object-cover"
          priority
          sizes="(max-width: 768px) 100vw, 1024px"
        />
      </div>

      {/* Metrics (optional) */}
      {work.metrics && work.metrics.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-8 metrics-surface rounded-lg px-6 mb-12">
          {work.metrics.map((metric, index) => (
            <div key={index} className="text-center">
              <p className="text-lg font-semibold">{metric}</p>
            </div>
          ))}
        </div>
      )}

      {/* Content with sticky TOC sidebar */}
      <div className="cs-body">
        <CaseStudyTOC headings={extractHeadings(work.content)} />
        <div className="min-w-0 max-w-[720px]">
          <MDXContent
            source={work.content}
            headings={extractHeadings(work.content)}
          />
        </div>
      </div>

      {/* Tags */}
      <div className="mx-auto max-w-3xl mt-16 pt-8 border-t border-border">
        <div className="flex flex-wrap gap-2">
          {work.tags.map((tag) => (
            <span
              key={tag}
              className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground tag-pill px-3 py-1 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <nav className="mx-auto max-w-3xl mt-12 pt-8 border-t border-border">
        <div className="flex justify-between gap-6">
          {prev && (
            <Link href={`/work/${prev.slug}`} className="group flex-1">
              <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
                ← Previous
              </span>
              <p className="mt-2 font-display text-2xl leading-tight group-hover:text-primary transition-colors">
                {prev.title}
              </p>
            </Link>
          )}
          {next && (
            <Link href={`/work/${next.slug}`} className="group flex-1 text-right ml-auto">
              <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
                Next →
              </span>
              <p className="mt-2 font-display text-2xl leading-tight group-hover:text-primary transition-colors">
                {next.title}
              </p>
            </Link>
          )}
        </div>
      </nav>
    </article>
  )
}
