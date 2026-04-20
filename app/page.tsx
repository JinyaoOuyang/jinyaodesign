import Link from 'next/link'
import { getFeaturedWork, getLatestBlogPosts } from '@/lib/content'
import { FeaturedWorkSection } from '@/components/FeaturedWorkSection'
import { HeroBackground } from '@/components/HeroBackground'
import { GlyphRise } from '@/components/GlyphRise'
import { CapabilitiesStrip } from '@/components/CapabilitiesStrip'
import { WritingList } from '@/components/WritingList'
import { siteConfig } from '@/lib/config'

export default function HomePage() {
  const featuredWork = getFeaturedWork()
  const latestPosts = getLatestBlogPosts(3)

  return (
    <>
      {/* Hero — full-width background, eyebrow + glyph-rise headline */}
      <section className="relative overflow-hidden pt-36 pb-28 md:pt-44 md:pb-32 -mt-[64px]">
        <HeroBackground />
        <div className="relative mx-auto max-w-5xl px-6" style={{ zIndex: 1 }}>
          <div className="max-w-[820px]">
            <span className="eyebrow">
              <span className="dot" aria-hidden="true" />
              <span>Portfolio · 2026</span>
            </span>

            <GlyphRise
              className="mt-7 font-display font-normal text-[clamp(48px,7.2vw,96px)] leading-[1.05] tracking-[-0.02em] text-foreground"
              segments={[
                { text: 'Product design' },
                { break: true },
                { text: 'for ' },
                { text: 'adaptive', italic: true },
                { text: ' systems' },
              ]}
            />

            <p
              className="mt-8 max-w-[560px] text-[20px] md:text-[22px] leading-[1.55] text-muted-foreground"
              style={{ animation: 'fade-up 0.7s var(--ease-precise) 0.7s both' }}
            >
              I design and build AI-powered products with a focus on restraint,
              adaptive systems, and human-centered decision making.
            </p>
            <p
              className="mt-6 max-w-[560px] text-[14px] leading-[1.7] text-muted-foreground/80"
              style={{ animation: 'fade-up 0.7s var(--ease-precise) 0.85s both' }}
            >
              Currently shipping design + engineering at a small e-commerce startup.
              Previously at studios working on health, travel, and automotive.
            </p>

            <div
              className="mt-9 flex gap-3"
              style={{ animation: 'fade-up 0.7s var(--ease-precise) 1s both' }}
            >
              <Link
                href="/work"
                className="inline-flex items-center justify-center gap-[10px] rounded-[8px] btn-primary px-[22px] py-[14px] text-sm font-medium"
              >
                View Work <span aria-hidden="true">→</span>
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center justify-center gap-[10px] rounded-[8px] btn-secondary px-[22px] py-[14px] text-sm font-medium text-foreground"
              >
                About Me
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-6">
        {/* Capabilities strip */}
        <CapabilitiesStrip />

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
