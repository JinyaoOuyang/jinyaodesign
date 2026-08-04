'use client'

// Dev-only stage for screenshotting the four clay models without the
// heavy homepage hero shader. Not linked from anywhere.
import dynamic from 'next/dynamic'
import { useState } from 'react'
import { clayBySlug } from '@/lib/clay'

const ClayMiniCanvas = dynamic(
  () =>
    import('@/components/clay/ClayMiniCanvas').then((m) => m.ClayMiniCanvas),
  { ssr: false }
)

export default function ClayPreviewPage() {
  const [hovered, setHovered] = useState<string | null>(null)
  const items = Object.values(clayBySlug)

  return (
    <main
      style={{
        background: '#f4f2ed',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 0,
        padding: '8px 24px',
      }}
    >
      {items.map((clay, i) => (
        <div
          key={clay.slug}
          style={{ aspectRatio: '5 / 3', position: 'relative' }}
          onMouseEnter={() => setHovered(clay.slug)}
          onMouseLeave={() => setHovered(null)}
        >
          <ClayMiniCanvas
            url={clay.glb}
            slug={clay.slug}
            scale={clay.scale}
            hovered={hovered === clay.slug}
            reduceMotion={false}
            phase={i * 1.3}
          />
          <span
            style={{
              position: 'absolute',
              left: 8,
              bottom: 4,
              fontSize: 12,
              color: '#555',
              fontFamily: 'monospace',
            }}
          >
            {clay.slug}
          </span>
        </div>
      ))}
    </main>
  )
}
