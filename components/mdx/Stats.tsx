'use client'

import { useEffect, useRef, useState } from 'react'
import { usePrefersReducedMotion } from '@/lib/useReducedMotion'

interface StatItem {
  label: string
  value: string
}

interface StatsProps {
  items: StatItem[]
}

/** Reveal on scroll, but fail safe: if IO is unsupported or never fires, show anyway. */
function useInView<T extends HTMLElement>() {
  const ref = useRef<T>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (typeof IntersectionObserver === 'undefined') {
      setInView(true)
      return
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setInView(true)
          io.disconnect()
        }
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.15 }
    )
    io.observe(el)
    // Safety net: reveal even if the observer never reports (edge browsers, quirks).
    const fallback = window.setTimeout(() => setInView(true), 1600)
    return () => {
      io.disconnect()
      window.clearTimeout(fallback)
    }
  }, [])

  return { ref, inView }
}

/**
 * Integer values count up when they enter view — but the DISPLAYED number is
 * always correct by default (count is seeded to the final value), so a missed
 * observer, reduced motion, or no-JS never leaves a stat reading "0".
 */
function StatValue({
  value,
  active,
  reduce,
}: {
  value: string
  active: boolean
  reduce: boolean
}) {
  const n = /^\d+$/.test(value) ? parseInt(value, 10) : null
  const [count, setCount] = useState<number>(n ?? 0)

  useEffect(() => {
    if (n === null) return
    if (reduce || !active) {
      setCount(n)
      return
    }
    const duration = 700
    const start = performance.now()
    let raf = 0
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration)
      const eased = 1 - Math.pow(1 - t, 3)
      setCount(Math.round(eased * n))
      if (t < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [active, n, reduce])

  return <>{n === null ? value : count}</>
}

export function Stats({ items }: StatsProps) {
  const { ref, inView } = useInView<HTMLDivElement>()
  const reduce = usePrefersReducedMotion()

  return (
    <div ref={ref} className="stats-grid">
      {items.map((item, index) => (
        <div
          key={index}
          className="stats-card"
          data-in-view={inView ? 'true' : 'false'}
          style={{ transitionDelay: `${index * 70}ms` }}
        >
          <div className="stats-value">
            <StatValue value={item.value} active={inView} reduce={reduce} />
          </div>
          <div className="stats-label">{item.label}</div>
        </div>
      ))}
    </div>
  )
}
