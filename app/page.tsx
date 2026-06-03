import Link from 'next/link'
import { getWorkPosts, getLatestBlogPosts } from '@/lib/content'
import { FeaturedWorkSection } from '@/components/FeaturedWorkSection'
import { WritingList } from '@/components/WritingList'

export default function HomePage() {
  const featuredWork = getWorkPosts()
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
          viewBox="0 0 1120 1000"
          preserveAspectRatio="xMidYMid meet"
          xmlns="http://www.w3.org/2000/svg"
          className="pointer-events-none absolute right-0 top-0 h-full w-[78%]"
        >
          <defs>
            {/*
              gradientUnits="userSpaceOnUse" → x1/x2 are in viewBox px.
              Fade: x=0 (left edge of SVG) transparent → x=460 fully opaque.
            */}
            <linearGradient id="orbitFade" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="460" y2="0">
              <stop offset="0%"   stopColor="white" stopOpacity="0" />
              <stop offset="100%" stopColor="white" stopOpacity="1" />
            </linearGradient>
            {/*
              maskUnits="userSpaceOnUse" → mask region in viewBox px.
              The rect fills the entire viewBox with the gradient.
            */}
            <mask id="orbitMask" maskUnits="userSpaceOnUse" x="0" y="0" width="1120" height="1000">
              <rect x="0" y="0" width="1120" height="1000" fill="url(#orbitFade)" />
            </mask>
          </defs>

          {/*
            Three elliptical orbits, center (560, 480) in a 1120×1000 viewBox.
            Orbit endpoints: P = center ± (a·cosθ, a·sinθ)

            Orbit 1: a=540 b=215 θ=−20° → P1=(1067.4,295.3) P2=(52.6,664.7)
            Orbit 2: a=400 b=160 θ=+15° → P1=(946.4,583.5) P2=(173.6,376.5)
            Orbit 3: a=640 b=130 θ=−45° → P1=(1012.5,27.5) P2=(107.5,932.5)
          */}
          <g mask="url(#orbitMask)">
            {/* ── Orbit strokes (also referenced by animateMotion via id) ── */}
            <path
              id="op1"
              d="M 1067.4 295.3 A 540 215 -20 0 1 52.6 664.7 A 540 215 -20 0 1 1067.4 295.3"
              fill="none"
              stroke="#1a1535"
              strokeWidth="0.6"
              opacity="0.12"
            />
            <path
              id="op2"
              d="M 946.4 583.5 A 400 160 15 0 1 173.6 376.5 A 400 160 15 0 1 946.4 583.5"
              fill="none"
              stroke="#1a1535"
              strokeWidth="0.6"
              opacity="0.12"
            />
            <path
              id="op3"
              d="M 1012.5 27.5 A 640 130 -45 0 1 107.5 932.5 A 640 130 -45 0 1 1012.5 27.5"
              fill="none"
              stroke="#1a1535"
              strokeWidth="0.6"
              opacity="0.12"
            />

            {/* ── Stars: 4-point ✦ centered at (0,0), moved by animateMotion ── */}

            {/* Orbit 1 — 34 s — dark, 12 px */}
            <path d="M 0,-6 L 1.35,-1.35 L 6,0 L 1.35,1.35 L 0,6 L -1.35,1.35 L -6,0 L -1.35,-1.35 Z" fill="#1a1535" opacity="0.5">
              <animateMotion dur="34s" repeatCount="indefinite" rotate="0" begin="0s" calcMode="linear">
                <mpath href="#op1" />
              </animateMotion>
            </path>

            {/* Orbit 1 — 34 s — dark, 9 px, half-cycle offset */}
            <path d="M 0,-4.5 L 0.9,-0.9 L 4.5,0 L 0.9,0.9 L 0,4.5 L -0.9,0.9 L -4.5,0 L -0.9,-0.9 Z" fill="#1a1535" opacity="0.35">
              <animateMotion dur="34s" repeatCount="indefinite" rotate="0" begin="-17s" calcMode="linear">
                <mpath href="#op1" />
              </animateMotion>
            </path>

            {/* Orbit 2 — 24 s — dark, 10 px */}
            <path d="M 0,-5.25 L 1.05,-1.05 L 5.25,0 L 1.05,1.05 L 0,5.25 L -1.05,1.05 L -5.25,0 L -1.05,-1.05 Z" fill="#1a1535" opacity="0.5">
              <animateMotion dur="24s" repeatCount="indefinite" rotate="0" begin="-6s" calcMode="linear">
                <mpath href="#op2" />
              </animateMotion>
            </path>

            {/* Orbit 2 — 24 s — PURPLE accent, 15 px */}
            <path d="M 0,-7.5 L 1.65,-1.65 L 7.5,0 L 1.65,1.65 L 0,7.5 L -1.65,1.65 L -7.5,0 L -1.65,-1.65 Z" fill="#6b5ce7" opacity="0.65">
              <animateMotion dur="24s" repeatCount="indefinite" rotate="0" begin="-14s" calcMode="linear">
                <mpath href="#op2" />
              </animateMotion>
            </path>

            {/* Orbit 3 — 16 s — dark, 9 px */}
            <path d="M 0,-4.5 L 0.9,-0.9 L 4.5,0 L 0.9,0.9 L 0,4.5 L -0.9,0.9 L -4.5,0 L -0.9,-0.9 Z" fill="#1a1535" opacity="0.45">
              <animateMotion dur="16s" repeatCount="indefinite" rotate="0" begin="-4s" calcMode="linear">
                <mpath href="#op3" />
              </animateMotion>
            </path>

            {/* Orbit 3 — 16 s — dark, 10 px, offset */}
            <path d="M 0,-5.25 L 1.05,-1.05 L 5.25,0 L 1.05,1.05 L 0,5.25 L -1.05,1.05 L -5.25,0 L -1.05,-1.05 Z" fill="#1a1535" opacity="0.38">
              <animateMotion dur="16s" repeatCount="indefinite" rotate="0" begin="-10s" calcMode="linear">
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

      {/* Featured Work — full-width gallery, heading stays aligned with content */}
      <section className="py-24">
        <div className="mx-auto max-w-5xl px-6">
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
        </div>
        <FeaturedWorkSection works={featuredWork} />
      </section>

      <div className="mx-auto max-w-5xl px-6">
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
