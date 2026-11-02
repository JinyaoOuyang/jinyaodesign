'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { WorkCard } from '@/components/WorkCard'
import type { Work } from '@/lib/types'
import styles from '@/components/caseStudies.module.css'

interface WorkGalleryProps {
  works: Work[]
}

function randomBetween(min: number, max: number) {
  return min + Math.random() * (max - min)
}

function assignTimingVars(el: HTMLElement) {
  if (el.dataset.timingSet) return
  el.style.setProperty('--duration', `${randomBetween(7, 11).toFixed(2)}s`)
  el.style.setProperty('--delay', `${randomBetween(-10, 0).toFixed(2)}s`)
  el.dataset.timingSet = '1'
}

export function WorkGallery({ works }: WorkGalleryProps) {
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const itemRefs = useRef<Array<HTMLDivElement | null>>([])
  const motionRefs = useRef<Array<HTMLDivElement | null>>([])

  /** Map each card's layout slot → shared vanishing point at screen center */
  const measureVanishingPoint = useCallback(() => {
    const stage = stageRef.current
    if (!stage) return

    const vanishX = window.innerWidth / 2
    const stageRect = stage.getBoundingClientRect()
    const vanishY = stageRect.top + stageRect.height * 0.4

    itemRefs.current.forEach((item, i) => {
      const motion = motionRefs.current[i]
      if (!item || !motion) return

      const rect = item.getBoundingClientRect()
      const cardCenterX = rect.left + rect.width / 2
      const cardCenterY = rect.top + rect.height / 2

      const originX = vanishX - cardCenterX
      const originY = vanishY - cardCenterY

      motion.style.setProperty('--origin-x', `${originX.toFixed(1)}px`)
      motion.style.setProperty('--origin-y', `${originY.toFixed(1)}px`)
      motion.style.setProperty('--pass-x', `${(-originX * 0.14).toFixed(1)}px`)
      motion.style.setProperty('--pass-y', `${(-originY * 0.14 + 56).toFixed(1)}px`)
      assignTimingVars(motion)
    })
  }, [])

  useEffect(() => {
    const run = () => requestAnimationFrame(measureVanishingPoint)
    run()

    const stage = stageRef.current
    const scroller = scrollRef.current
    const ro = stage ? new ResizeObserver(run) : null
    if (stage && ro) ro.observe(stage)

    window.addEventListener('resize', run)
    scroller?.addEventListener('scroll', run, { passive: true })
    const delayed = window.setTimeout(run, 600)

    return () => {
      ro?.disconnect()
      window.removeEventListener('resize', run)
      scroller?.removeEventListener('scroll', run)
      window.clearTimeout(delayed)
    }
  }, [measureVanishingPoint, works.length])

  useEffect(() => {
    requestAnimationFrame(measureVanishingPoint)
  }, [focusedIndex, measureVanishingPoint])

  const handleFocusIn = useCallback((index: number) => {
    setFocusedIndex(index)
  }, [])

  const handleFocusOut = useCallback(() => {
    setFocusedIndex(null)
  }, [])

  const trackClassName = ['work-gallery-track', styles.perspectiveContainer]
    .filter(Boolean)
    .join(' ')

  return (
    <div
      ref={stageRef}
      className="work-gallery-stage work-gallery-stage--deep-space"
    >
      <div className="work-gallery" ref={scrollRef} role="list">
        <div className={trackClassName} onMouseLeave={handleFocusOut}>
          {works.map((work, i) => (
            <div
              key={work.slug}
              ref={(el) => {
                itemRefs.current[i] = el
              }}
              role="listitem"
              className="work-gallery-item"
              data-focused={focusedIndex === i ? 'true' : undefined}
              onMouseEnter={() => handleFocusIn(i)}
              onFocusCapture={() => handleFocusIn(i)}
              onBlurCapture={(e) => {
                if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
                  handleFocusOut()
                }
              }}
            >
              <div
                ref={(el) => {
                  motionRefs.current[i] = el
                }}
                className={[
                  styles.caseStudyCard,
                  focusedIndex === i ? styles.cardFocused : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
              >
                <WorkCard work={work} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
