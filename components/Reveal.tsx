'use client'

import { ReactNode, useEffect, useRef } from 'react'

interface RevealProps {
  children: ReactNode
  className?: string
  /** `stagger` uses `.reveal-stagger` instead of `.reveal` */
  stagger?: boolean
  /** How far into the viewport before triggering (0-1). Default 0.15. */
  threshold?: number
  as?: keyof JSX.IntrinsicElements
}

/**
 * Intersection-observer based reveal-on-scroll. Adds `.in` class when the
 * element enters the viewport. Uses `.reveal` or `.reveal-stagger` utility
 * classes defined in globals.css.
 */
export function Reveal({
  children,
  className = '',
  stagger = false,
  threshold = 0.15,
  as: Tag = 'div',
}: RevealProps) {
  const ref = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('in')
            io.unobserve(entry.target)
          }
        }
      },
      { threshold, rootMargin: '0px 0px -10% 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [threshold])

  const base = stagger ? 'reveal-stagger' : 'reveal'
  // @ts-expect-error - dynamic ref typing
  return <Tag ref={ref} className={`${base} ${className}`.trim()}>{children}</Tag>
}
