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
        className="relative -mt-[64px] flex min-h-dvh flex-col overflow-hidden"
        style={{ background: '#f5f3ee' }}
      >
        {/* Orbital star system — right half, SVG-native left-edge fade */}
        <svg
          aria-hidden="true"
          viewBox="0 0 1000 1000"
          preserveAspectRatio="xMidYMid meet"
          xmlns="http://www.w3.org/2000/svg"
          className="pointer-events-none absolute right-0 top-0 h-full w-[75%]"
        >
          <defs>
            {/*
              gradientUnits="userSpaceOnUse" → x1/x2 are in viewBox px (0–1000).
              Fade: x=0 (left edge of SVG) transparent → x=420 fully opaque.
            */}
            <linearGradient id="orbitFade" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="420" y2="0">
              <stop offset="0%"   stopColor="white" stopOpacity="0" />
              <stop offset="100%" stopColor="white" stopOpacity="1" />
            </linearGradient>
            {/*
              maskUnits="userSpaceOnUse" → mask region in viewBox px.
              The rect fills the entire 1000×1000 viewBox with the gradient.
            */}
            <mask id="orbitMask" maskUnits="userSpaceOnUse" x="0" y="0" width="1000" height="1000">
              <rect x="0" y="0" width="1000" height="1000" fill="url(#orbitFade)" />
            </mask>
          </defs>

          {/*
            Three elliptical orbits, center (550, 480) in a 1000×1000 viewBox.
            Orbit endpoints: P = center ± (a·cosθ, a·sinθ)

            Orbit 1: a=420 b=165 θ=−20° → P1=(944.7,336.4) P2=(155.3,623.6)
            Orbit 2: a=310 b=125 θ=+15° → P1=(849.4,560.2) P2=(250.6,399.8)
            Orbit 3: a=500 b=100 θ=−45° → P1=(903.6,126.4) P2=(196.4,833.6)
          */}
          <g mask="url(#orbitMask)">
            {/* ── Orbit strokes (also referenced by animateMotion via id) ── */}
            <path
              id="op1"
              d="M 944.7 336.4 A 420 165 -20 0 1 155.3 623.6 A 420 165 -20 0 1 944.7 336.4"
              fill="none"
              stroke="#1a1535"
              strokeWidth="0.6"
              opacity="0.12"
            />
            <path
              id="op2"
              d="M 849.4 560.2 A 310 125 15 0 1 250.6 399.8 A 310 125 15 0 1 849.4 560.2"
              fill="none"
              stroke="#1a1535"
              strokeWidth="0.6"
              opacity="0.12"
            />
            <path
              id="op3"
              d="M 903.6 126.4 A 500 100 -45 0 1 196.4 833.6 A 500 100 -45 0 1 903.6 126.4"
              fill="none"
              stroke="#1a1535"
              strokeWidth="0.6"
              opacity="0.12"
            />

            {/* ── Stars: 4-point ✦ centered at (0,0), moved by animateMotion ── */}

            {/* Orbit 1 — 18 s — dark, 8 px */}
            <path d="M 0,-4 L 0.9,-0.9 L 4,0 L 0.9,0.9 L 0,4 L -0.9,0.9 L -4,0 L -0.9,-0.9 Z" fill="#1a1535" opacity="0.5">
              <animateMotion dur="18s" repeatCount="indefinite" rotate="0" begin="0s" calcMode="linear">
                <mpath href="#op1" />
              </animateMotion>
            </path>

            {/* Orbit 1 — 18 s — dark, 6 px, half-cycle offset */}
            <path d="M 0,-3 L 0.6,-0.6 L 3,0 L 0.6,0.6 L 0,3 L -0.6,0.6 L -3,0 L -0.6,-0.6 Z" fill="#1a1535" opacity="0.35">
              <animateMotion dur="18s" repeatCount="indefinite" rotate="0" begin="-9s" calcMode="linear">
                <mpath href="#op1" />
              </animateMotion>
            </path>

            {/* Orbit 2 — 12 s — dark, 7 px */}
            <path d="M 0,-3.5 L 0.7,-0.7 L 3.5,0 L 0.7,0.7 L 0,3.5 L -0.7,0.7 L -3.5,0 L -0.7,-0.7 Z" fill="#1a1535" opacity="0.5">
              <animateMotion dur="12s" repeatCount="indefinite" rotate="0" begin="-3s" calcMode="linear">
                <mpath href="#op2" />
              </animateMotion>
            </path>

            {/* Orbit 2 — 12 s — PURPLE accent, 10 px */}
            <path d="M 0,-5 L 1.1,-1.1 L 5,0 L 1.1,1.1 L 0,5 L -1.1,1.1 L -5,0 L -1.1,-1.1 Z" fill="#6b5ce7" opacity="0.65">
              <animateMotion dur="12s" repeatCount="indefinite" rotate="0" begin="-7s" calcMode="linear">
                <mpath href="#op2" />
              </animateMotion>
            </path>

            {/* Orbit 3 — 8 s — dark, 6 px */}
            <path d="M 0,-3 L 0.6,-0.6 L 3,0 L 0.6,0.6 L 0,3 L -0.6,0.6 L -3,0 L -0.6,-0.6 Z" fill="#1a1535" opacity="0.45">
              <animateMotion dur="8s" repeatCount="indefinite" rotate="0" begin="-2s" calcMode="linear">
                <mpath href="#op3" />
              </animateMotion>
            </path>

            {/* Orbit 3 — 8 s — dark, 7 px, offset */}
            <path d="M 0,-3.5 L 0.7,-0.7 L 3.5,0 L 0.7,0.7 L 0,3.5 L -0.7,0.7 L -3.5,0 L -0.7,-0.7 Z" fill="#1a1535" opacity="0.38">
              <animateMotion dur="8s" repeatCount="indefinite" rotate="0" begin="-5s" calcMode="linear">
                <mpath href="#op3" />
              </animateMotion>
            </path>
          </g>
        </svg>

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
