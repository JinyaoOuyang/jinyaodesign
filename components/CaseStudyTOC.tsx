'use client'

import { useEffect, useState } from 'react'
import type { TocHeading } from '@/lib/toc'

interface CaseStudyTOCProps {
  headings: TocHeading[]
}

/** Pad an int to 2 digits */
const pad = (n: number) => String(n).padStart(2, '0')

export function CaseStudyTOC({ headings }: CaseStudyTOCProps) {
  const [activeSlug, setActiveSlug] = useState<string | null>(
    headings[0]?.slug ?? null,
  )

  useEffect(() => {
    if (headings.length === 0) return

    const targets = headings
      .map((h) => document.getElementById(h.slug))
      .filter((el): el is HTMLElement => !!el)

    if (targets.length === 0) return

    // Track which headings are currently above the 40%-viewport line.
    // The last one above is considered "active".
    const onScroll = () => {
      const threshold = window.innerHeight * 0.35
      let current: string | null = headings[0].slug
      for (const el of targets) {
        const rect = el.getBoundingClientRect()
        if (rect.top - threshold <= 0) {
          current = el.id
        } else {
          break
        }
      }
      setActiveSlug(current)
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [headings])

  if (headings.length === 0) return null

  return (
    <nav aria-label="Case study sections" className="cs-toc">
      {headings.map((h) => {
        const active = h.slug === activeSlug
        return (
          <a
            key={h.slug}
            href={`#${h.slug}`}
            className={`cs-toc-item${active ? ' active' : ''}`}
          >
            <span className="num">{pad(h.index)}</span>
            <span className="title">{h.title}</span>
          </a>
        )
      })}
    </nav>
  )
}
