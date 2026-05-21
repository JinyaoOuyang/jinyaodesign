import Link from 'next/link'
import { getFeaturedWork, getLatestBlogPosts } from '@/lib/content'
import { FeaturedWorkSection } from '@/components/FeaturedWorkSection'
import { HeroBackground } from '@/components/HeroBackground'
import { HeroSection } from '@/components/HeroSection'
import { WritingList } from '@/components/WritingList'

export default function HomePage() {
  const featuredWork = getFeaturedWork()
  const latestPosts = getLatestBlogPosts(3)

  return (
    <>
      {/* Hero — full-width background, eyebrow + glyph-rise headline */}
      <section className="relative isolate overflow-hidden pt-36 pb-28 md:pt-44 md:pb-32 -mt-[64px]">
        <HeroBackground />
        <div className="relative z-10 mx-auto max-w-5xl px-6">
          <HeroSection />
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
