'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { WorkCard } from '@/components/WorkCard'
import type { Work } from '@/lib/types'

interface WorkGalleryProps {
  works: Work[]
}

interface Metrics {
  collapsedW: number
  expandedW: number
  gap: number
  padLeft: number
}

// Delay between cards in the idle auto-play loop (ms).
const AUTO_LATENCY = 2000

// Scroll animation must match the card's CSS width transition exactly so the
// card expands and centers as a single smooth motion:
//   .work-gallery-item { transition: width 0.6s var(--ease-precise) }
//   --ease-precise: cubic-bezier(0.2, 0.8, 0.2, 1)
const SCROLL_DURATION = 600

function makeCubicBezier(p1x: number, p1y: number, p2x: number, p2y: number) {
  const cx = 3 * p1x
  const bx = 3 * (p2x - p1x) - cx
  const ax = 1 - cx - bx
  const cy = 3 * p1y
  const by = 3 * (p2y - p1y) - cy
  const ay = 1 - cy - by
  const sampleX = (t: number) => ((ax * t + bx) * t + cx) * t
  const sampleY = (t: number) => ((ay * t + by) * t + cy) * t
  const sampleDX = (t: number) => (3 * ax * t + 2 * bx) * t + cx
  const solveX = (x: number) => {
    let t = x
    for (let i = 0; i < 8; i++) {
      const dx = sampleX(t) - x
      if (Math.abs(dx) < 1e-4) break
      const d = sampleDX(t)
      if (Math.abs(d) < 1e-6) break
      t -= dx / d
    }
    return t
  }
  return (x: number) => sampleY(solveX(Math.max(0, Math.min(1, x))))
}

const easePrecise = makeCubicBezier(0.2, 0.8, 0.2, 1)

export function WorkGallery({ works }: WorkGalleryProps) {
  // The middle card is expanded by default; hovering/focusing any card promotes it.
  const middleIndex = Math.floor(works.length / 2)
  const [activeIndex, setActiveIndex] = useState(middleIndex)

  const scrollRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const itemRefs = useRef<Array<HTMLDivElement | null>>([])
  const metrics = useRef<Metrics>({ collapsedW: 320, expandedW: 520, gap: 24, padLeft: 24 })
  const didInit = useRef(false)

  // Live, render-independent copy of the active index for the auto-play loop.
  const activeRef = useRef(activeIndex)
  activeRef.current = activeIndex
  const autoTimer = useRef<ReturnType<typeof setInterval> | null>(null)
  const scrollRaf = useRef<number | null>(null)

  // Capture resting layout dimensions. At rest one card is expanded and every
  // other is collapsed, so both widths can be read directly. Stable values
  // used to compute centering even mid-animation.
  const measure = useCallback(() => {
    const scroller = scrollRef.current
    const track = trackRef.current
    const items = itemRefs.current
    if (!scroller || !track || items.length === 0) return

    const expandedEl = items[activeRef.current] ?? items[0]
    const collapsedEl = items.find((el, i) => el && i !== activeRef.current)

    const padLeft = parseFloat(getComputedStyle(scroller).paddingLeft) || 24
    const gap = parseFloat(getComputedStyle(track).columnGap || '24') || 24

    metrics.current = {
      collapsedW: collapsedEl?.getBoundingClientRect().width ?? 320,
      expandedW: expandedEl?.getBoundingClientRect().width ?? 520,
      gap,
      padLeft,
    }
  }, [])

  // Bring card `i` to the horizontal center of the stage. When `animate` is
  // true the scroll runs on a rAF loop matching the card's width transition
  // (same duration + easing), so expanding and centering happen as one motion.
  const centerCard = useCallback((i: number, animate = true) => {
    const scroller = scrollRef.current
    if (!scroller) return
    const { collapsedW, expandedW, gap, padLeft } = metrics.current

    const cardLeft = padLeft + i * (collapsedW + gap)
    const cardCenter = cardLeft + expandedW / 2
    const max = scroller.scrollWidth - scroller.clientWidth
    const target = Math.max(0, Math.min(cardCenter - scroller.clientWidth / 2, max))

    if (scrollRaf.current) {
      cancelAnimationFrame(scrollRaf.current)
      scrollRaf.current = null
    }

    if (!animate) {
      scroller.scrollLeft = target
      return
    }

    const from = scroller.scrollLeft
    const dist = target - from
    if (Math.abs(dist) < 1) {
      scroller.scrollLeft = target
      return
    }

    const start = performance.now()
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / SCROLL_DURATION)
      scroller.scrollLeft = from + dist * easePrecise(t)
      if (t < 1) {
        scrollRaf.current = requestAnimationFrame(tick)
      } else {
        scrollRaf.current = null
      }
    }
    scrollRaf.current = requestAnimationFrame(tick)
  }, [])

  // Activate card `i`. `center` controls whether it scrolls to the middle
  // (used by auto-play / keyboard) or stays where it is (used by hover).
  const setActive = useCallback(
    (i: number, center: boolean) => {
      setActiveIndex(i)
      activeRef.current = i
      if (center) centerCard(i)
    },
    [centerCard],
  )

  const stopAuto = useCallback(() => {
    if (autoTimer.current) {
      clearInterval(autoTimer.current)
      autoTimer.current = null
    }
  }, [])

  // Idle auto-play: advance through the cases one at a time, centered, looping.
  const startAuto = useCallback(() => {
    stopAuto()
    if (works.length < 2) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    autoTimer.current = setInterval(() => {
      const next = (activeRef.current + 1) % works.length
      setActive(next, true)
    }, AUTO_LATENCY)
  }, [setActive, stopAuto, works.length])

  // Center the default (middle) card on load, then begin auto-play.
  useEffect(() => {
    if (didInit.current) return
    didInit.current = true
    requestAnimationFrame(() => {
      measure()
      centerCard(activeIndex, false)
      startAuto()
    })
  }, [measure, centerCard, activeIndex, startAuto])

  useEffect(() => {
    const onResize = () => {
      measure()
      centerCard(activeRef.current, false)
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [measure, centerCard])

  useEffect(
    () => () => {
      stopAuto()
      if (scrollRaf.current) cancelAnimationFrame(scrollRaf.current)
    },
    [stopAuto],
  )

  return (
    <div className="work-gallery-stage" onMouseEnter={stopAuto} onMouseLeave={startAuto}>
      <div className="work-gallery" ref={scrollRef} role="list">
        <div className="work-gallery-track" ref={trackRef}>
          {works.map((work, i) => (
            <div
              key={work.slug}
              ref={(el) => {
                itemRefs.current[i] = el
              }}
              role="listitem"
              className="work-gallery-item"
              data-active={activeIndex === i}
              onMouseEnter={() => setActive(i, false)}
              onFocusCapture={() => setActive(i, true)}
            >
              <WorkCard work={work} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
