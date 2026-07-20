'use client'

import dynamic from 'next/dynamic'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import type { Work } from '@/lib/types'
import { getClayAsset } from '@/lib/clay'

const ClayMiniCanvas = dynamic(
  () =>
    import('@/components/clay/ClayMiniCanvas').then((m) => m.ClayMiniCanvas),
  { ssr: false }
)

type ClayStageProps = {
  works: Work[]
}

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const sync = () => setReduced(mq.matches)
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])

  return reduced
}

function useInViewOnce<T extends HTMLElement>(rootMargin = '240px') {
  const ref = useRef<T>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el || inView) return

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setInView(true)
          io.disconnect()
        }
      },
      { rootMargin, threshold: 0 }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [inView, rootMargin])

  return { ref, inView }
}

/** Deep, cream-readable accent pulled from each model's palette. */
const ROW_ACCENT: Record<string, string> = {
  isleo: '#5f7a4e',
  trail: '#c26a3c',
  'listing-image-pipeline': '#a9772b',
  'tesla-charging': '#2f8f86',
}

export function ClayStage({ works }: ClayStageProps) {
  const { ref, inView } = useInViewOnce<HTMLDivElement>()
  const reduceMotion = usePrefersReducedMotion()
  const [hovered, setHovered] = useState<string | null>(null)
  const [webglOk, setWebglOk] = useState(true)

  useEffect(() => {
    try {
      const c = document.createElement('canvas')
      const ok = !!(c.getContext('webgl') || c.getContext('experimental-webgl'))
      setWebglOk(ok)
    } catch {
      setWebglOk(false)
    }
  }, [])

  const items = works
    .map((work) => {
      const clay = getClayAsset(work.slug)
      return clay ? { work, clay } : null
    })
    .filter(Boolean) as { work: Work; clay: NonNullable<ReturnType<typeof getClayAsset>> }[]

  if (items.length === 0) return null

  return (
    <div ref={ref} className="clay-stage">
      <ul className="clay-rows">
        {items.map(({ work, clay }, i) => {
          const isHovered = hovered === work.slug
          const showCanvas = inView && webglOk
          const accent = ROW_ACCENT[work.slug] ?? 'var(--primary)'
          const index = String(i + 1).padStart(2, '0')
          const meta = [work.timeline, work.tags[0]].filter(Boolean).join(' · ')

          return (
            <li key={work.slug} className="clay-row min-w-0">
              <Link
                href={`/work/${work.slug}`}
                className="clay-row-link"
                data-hovered={isHovered ? 'true' : 'false'}
                style={{ '--row-accent': accent } as React.CSSProperties}
                onMouseEnter={() => setHovered(work.slug)}
                onMouseLeave={() => setHovered((h) => (h === work.slug ? null : h))}
                onFocus={() => setHovered(work.slug)}
                onBlur={() => setHovered((h) => (h === work.slug ? null : h))}
              >
                <span className="clay-row-index" aria-hidden="true">
                  {index}
                </span>

                <div className="clay-row-model" aria-hidden="true">
                  {showCanvas ? (
                    <ClayMiniCanvas
                      url={clay.glb}
                      slug={clay.slug}
                      scale={clay.scale}
                      hovered={isHovered}
                      reduceMotion={reduceMotion}
                      phase={i * 1.3}
                    />
                  ) : (
                    <Image
                      src={work.coverImage}
                      alt=""
                      fill
                      className="clay-row-fallback object-contain"
                      sizes="(max-width: 720px) 100vw, 45vw"
                    />
                  )}
                </div>

                <div className="clay-row-info">
                  <h3 className="clay-row-title">{work.title}</h3>
                  {meta && <p className="clay-row-meta">{meta}</p>}
                  <div className="clay-row-detail">
                    <div className="clay-row-detail-inner">
                      <p className="clay-row-desc">{work.description}</p>
                      <div className="clay-row-tags">
                        {work.tags.slice(0, 3).map((tag) => (
                          <span key={tag} className="clay-row-tag">
                            {tag}
                          </span>
                        ))}
                      </div>
                      <span className="clay-row-cta" aria-hidden="true">
                        Read case <span className="clay-row-arrow" />
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
