import Link from 'next/link'
import { getFeaturedWork, getLatestBlogPosts } from '@/lib/content'
import { WorkCard } from '@/components/WorkCard'
import { BlogCard } from '@/components/BlogCard'
import { siteConfig } from '@/lib/config'

export default function HomePage() {
  const featuredWork = getFeaturedWork()
  const latestPosts = getLatestBlogPosts(2)

  return (
    <div className="mx-auto max-w-5xl px-6">
      {/* Hero */}
      <section className="py-24 md:py-32">
        <h1 className="text-4xl font-semibold tracking-tight md:text-5xl lg:text-6xl">
          {siteConfig.name}
        </h1>
        <p className="mt-4 text-xl text-muted-foreground md:text-2xl">
          {siteConfig.tagline}
        </p>
        <p className="mt-6 max-w-2xl text-muted-foreground leading-relaxed">
          I&apos;m a UX/Product Designer focused on creating intuitive, user-centered 
          digital experiences. I believe great design solves real problems while 
          delighting users along the way.
        </p>
        <div className="mt-8 flex gap-4">
          <Link
            href="/work"
            className="inline-flex items-center justify-center rounded-md bg-foreground px-6 py-3 text-sm font-medium text-background transition-opacity hover:opacity-80"
          >
            View Work
          </Link>
          <Link
            href="/about"
            className="inline-flex items-center justify-center rounded-md border border-border px-6 py-3 text-sm font-medium transition-colors hover:bg-muted"
          >
            About Me
          </Link>
        </div>
      </section>

      {/* Featured Work */}
      <section className="py-16 border-t border-border">
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-2xl font-semibold">Featured Work</h2>
          <Link
            href="/work"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            View all →
          </Link>
        </div>
        <div className="grid gap-8 md:grid-cols-2">
          {featuredWork.map((work) => (
            <WorkCard key={work.slug} work={work} />
          ))}
        </div>
      </section>

      {/* Latest Writing */}
      {latestPosts.length > 0 && (
        <section className="py-16 border-t border-border">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-semibold">Latest Writing</h2>
            <Link
              href="/blog"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              View all →
            </Link>
          </div>
          <div>
            {latestPosts.map((post) => (
              <BlogCard key={post.slug} post={post} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
