'use client'

// Dev-only harness to verify ClayScrollHero beats deterministically via ?p=0..1
import dynamic from 'next/dynamic'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

const ClayScrollHero = dynamic(
  () => import('@/components/clay/ClayScrollHero').then((m) => m.ClayScrollHero),
  { ssr: false }
)

function Inner() {
  const sp = useSearchParams()
  const raw = sp.get('p')
  const p = raw != null ? Math.min(1, Math.max(0, parseFloat(raw))) : undefined
  return <ClayScrollHero debugProgress={p} />
}

export default function ClayScrollTestPage() {
  return (
    <Suspense fallback={null}>
      <Inner />
    </Suspense>
  )
}
