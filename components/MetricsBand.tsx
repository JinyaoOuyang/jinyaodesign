'use client'

import { useEffect, useRef, useState } from 'react'

type MetricsBandProps = {
  metrics: string[]
}

type ParsedMetric =
  | { kind: 'count'; n: number; caption: string }
  | { kind: 'arrow'; from: string; to: string; caption: string }
  | { kind: 'text'; text: string }

/** "0→1 product" → arrow · "4 days to ship" → count · else → plain text card. */
function parseMetric(raw: string): ParsedMetric {
  const arrow = raw.match(/^(\S+)→(\S+)\s+(.+)$/)
  if (arrow) return { kind: 'arrow', from: arrow[1], to: arrow[2], caption: arrow[3] }

  const count = raw.match(/^(\d+)\s+(.+)$/)
  if (count) return { kind: 'count', n: parseInt(count[1], 10), caption: count[2] }

  return { kind: 'text', text: raw }
}

function CountUp({ to, active }: { to: number; active: boolean }) {
  const [n, setN] = useState(0)

  useEffect(() => {
    if (!active) return
    const duration = 650
    const start = performance.now()
    let raf: number
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration)
      const eased = 1 - Math.pow(1 - t, 3)
      setN(Math.round(eased * to))
      if (t < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [active, to])

  return <>{n}</>
}

export function MetricsBand({ metrics }: MetricsBandProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setInView(true)
          io.disconnect()
        }
      },
      { rootMargin: '-40px', threshold: 0.3 }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <div ref={ref} className="metrics-band metrics-surface">
      {metrics.map((raw, i) => {
        const m = parseMetric(raw)
        return (
          <div
            key={i}
            className="metrics-cell"
            data-in-view={inView ? 'true' : 'false'}
            style={{ transitionDelay: `${i * 80}ms` }}
          >
            {m.kind === 'count' && (
              <>
                <div className="metrics-number">
                  <CountUp to={m.n} active={inView} />
                </div>
                <p className="metrics-caption">{m.caption}</p>
              </>
            )}
            {m.kind === 'arrow' && (
              <>
                <div className="metrics-number metrics-arrow">
                  {m.from}
                  <span aria-hidden="true">→</span>
                  {m.to}
                </div>
                <p className="metrics-caption">{m.caption}</p>
              </>
            )}
            {m.kind === 'text' && <p className="metrics-text">{m.text}</p>}
          </div>
        )
      })}
    </div>
  )
}
