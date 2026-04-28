'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRef } from 'react'
import { Work } from '@/lib/types'

interface WorkCardProps {
  work: Work
}

export function WorkCard({ work }: WorkCardProps) {
  const ref = useRef<HTMLAnchorElement>(null)

  // Spotlight follows cursor via CSS variables
  const onMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    el.style.setProperty('--mx', `${((e.clientX - rect.left) / rect.width) * 100}%`)
    el.style.setProperty('--my', `${((e.clientY - rect.top) / rect.height) * 100}%`)
  }

  return (
    <Link
      ref={ref}
      href={`/work/${work.slug}`}
      className="work-card group block h-full"
      data-variant="orbital-magnet"
      onMouseMove={onMove}
    >
      <article className="flex h-full flex-col">
        <div className="cover">
          <Image
            src={work.coverImage}
            alt={work.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
          <span className="label-overlay" aria-hidden="true">
            <span className="label-dot" />
            {work.role || 'Case Study'}
          </span>
          <span className="orbit-ring" aria-hidden="true" />
          <span className="corner-frame" aria-hidden="true" />
        </div>
        <div className="body flex flex-1 flex-col">
          <h3 className="title">{work.title}</h3>
          <p className="desc">{work.description}</p>
          <div className="tags mt-auto">
            {work.tags.slice(0, 3).map((tag) => (
              <span key={tag} className="tag">{tag}</span>
            ))}
          </div>
          <span className="meta-row" aria-hidden="true">
            <span>Read case</span>
            <span className="arrow" />
          </span>
        </div>
        <span className="spotlight" aria-hidden="true" />
      </article>
    </Link>
  )
}
