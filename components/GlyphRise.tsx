'use client'

import { ReactNode, useEffect, useRef, useState } from 'react'

interface GlyphRiseProps {
  /**
   * Segments rendered as words. A segment with `italic: true` is wrapped in
   * `<em>` (uses the display-serif italic accent color defined by `.cs-title em`
   * / `.hero h1 em` in globals.css).
   */
  segments: { text?: string; italic?: boolean; break?: boolean }[]
  className?: string
  /** Delay in ms before the animation starts. Default 120. */
  delay?: number
  /** Per-letter stagger in ms. Default 24. */
  stagger?: number
}

/**
 * Per-letter rise animation for a headline. Each character is wrapped in a
 * span with a staggered animation-delay. Spaces are preserved via
 * whitespace-preserving word groups.
 */
export function GlyphRise({
  segments,
  className = '',
  delay = 120,
  stagger = 24,
}: GlyphRiseProps) {
  const ref = useRef<HTMLHeadingElement>(null)
  const [armed, setArmed] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setArmed(true), 60)
    return () => clearTimeout(t)
  }, [])

  // Build the character spans with global counter for stagger
  let counter = 0

  return (
    <h1
      ref={ref}
      className={`glyph-rise ${armed ? 'animate' : ''} ${className}`.trim()}
    >
      {segments.map((seg, si) => {
        if (seg.break) return <br key={`br-${si}`} />
        const words = (seg.text ?? '').split(/(\s+)/) // keep spaces
        const inner = words.map((w, wi) => {
          if (/^\s+$/.test(w)) return <span key={`sp-${si}-${wi}`}>{w}</span>
          return (
            <span className="word" key={`w-${si}-${wi}`}>
              {Array.from(w).map((ch, ci) => {
                const idx = counter++
                return (
                  <span
                    key={`c-${si}-${wi}-${ci}`}
                    style={{ animationDelay: `${delay + idx * stagger}ms` }}
                  >
                    {ch}
                  </span>
                )
              })}
            </span>
          )
        })
        return seg.italic ? <em key={`s-${si}`}>{inner}</em> : <span key={`s-${si}`}>{inner}</span>
      })}
    </h1>
  )
}
