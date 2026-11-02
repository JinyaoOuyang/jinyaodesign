'use client'

import dynamic from 'next/dynamic'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { getClayAsset } from '@/lib/clay'
import { ClayErrorBoundary } from '@/components/clay/ClayErrorBoundary'

const ClayHero = dynamic(
  () => import('@/components/clay/ClayHero').then((m) => m.ClayHero),
  { ssr: false }
)

type CaseStudyCoverProps = {
  slug: string
  coverImage: string
  title: string
}

export function CaseStudyCover({ slug, coverImage, title }: CaseStudyCoverProps) {
  const clay = getClayAsset(slug)
  const [webglOk, setWebglOk] = useState(true)

  useEffect(() => {
    try {
      const c = document.createElement('canvas')
      setWebglOk(!!(c.getContext('webgl') || c.getContext('experimental-webgl')))
    } catch {
      setWebglOk(false)
    }
  }, [])

  const staticCover = (
    <Image
      src={coverImage}
      alt={title}
      fill
      className="object-cover"
      priority
      sizes="(max-width: 768px) 100vw, 1024px"
    />
  )

  if (clay && webglOk) {
    return (
      <ClayErrorBoundary key={clay.glb} fallback={staticCover}>
        <ClayHero slug={clay.slug} />
      </ClayErrorBoundary>
    )
  }

  return staticCover
}
