import Link from 'next/link'
import { getFeaturedWork, getLatestBlogPosts } from '@/lib/content'
import { FeaturedWorkSection } from '@/components/FeaturedWorkSection'
import { WritingList } from '@/components/WritingList'

export default function HomePage() {
  const featuredWork = getFeaturedWork()
  const latestPosts = getLatestBlogPosts(3)

  return (
    <>
      {/* Hero — full viewport, typographic only, content anchored bottom-left */}
      <section
        className="relative -mt-[64px] flex min-h-dvh flex-col"
        style={{ background: '#f5f3ee' }}
      >
        <div className="flex-1" />
        <div className="mx-auto w-full max-w-5xl px-6 pb-32 md:pb-40">
          <p
            className="hero-line"
            style={{ color: '#1a1535' }}
          >
            I design it.
          </p>
          <p
            className="hero-line"
            style={{ color: '#1a1535' }}
          >
            I build it.
          </p>
          <p
            className="hero-line italic font-normal"
            style={{ color: '#6b5ce7' }}
          >
            I ship it.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-6">
        {/* Featured Work */}
        <section className="py-24">
          <div className="section-head">
            <div>
              <div className="num">01 / Work</div>
              <h2 className="mt-2">
                Selected <em>case studies</em>
              </h2>
            </div>
            <Link href="/work" className="view-all">
              View all <span aria-hidden="true">→</span>
            </Link>
          </div>
          <FeaturedWorkSection works={featuredWork} />
        </section>

        {/* Latest Writing */}
        {latestPosts.length > 0 && (
          <section className="py-16 pb-24">
            <div className="section-head">
              <div>
                <div className="num">02 / Writing</div>
                <h2 className="mt-2">
                  Latest <em>notes</em>
                </h2>
              </div>
              <Link href="/blog" className="view-all">
                View all <span aria-hidden="true">→</span>
              </Link>
            </div>
            <WritingList posts={latestPosts} />
          </section>
        )}
      </div>
    </>
  )
}
