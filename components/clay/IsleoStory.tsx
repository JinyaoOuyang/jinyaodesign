'use client'

import dynamic from 'next/dynamic'

const ClayScrollHero = dynamic(
  () => import('@/components/clay/ClayScrollHero').then((m) => m.ClayScrollHero),
  {
    ssr: false,
    loading: () => (
      <div className="clay-scroll-loading" aria-hidden="true">
        <span className="clay-scroll-title">Isleo</span>
      </div>
    ),
  }
)

export function IsleoStory() {
  return <ClayScrollHero />
}
