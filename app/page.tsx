import Link from 'next/link'
import { getFeaturedWork, getLatestBlogPosts } from '@/lib/content'
import { BlogCard } from '@/components/BlogCard'
import { FeaturedWorkSection } from '@/components/FeaturedWorkSection'
import { siteConfig } from '@/lib/config'

export default function HomePage() {
  const featuredWork = getFeaturedWork()
  const latestPosts = getLatestBlogPosts(2)

  return (
    <div className="mx-auto max-w-5xl px-6">
      {/* Hero */}
      <section className="py-24 md:py-32">
        <h1 className="text-4xl font-semibold tracking-tight md:text-5xl lg:text-6xl" style={{ fontFamily: 'var(--font-display)' }}>
          {siteConfig.name}
        </h1>
        <p className="mt-4 text-xl text-muted-foreground md:text-2xl">
          {siteConfig.tagline}
        </p>
        <p className="mt-6 max-w-2xl text-muted-foreground leading-relaxed">
          I design and build AI-powered products with a focus on adaptive systems,
restraint, and human-centered decision making.
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
      <FeaturedWorkSection works={featuredWork} />

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
