'use client'

import { Component, Suspense, useEffect, useRef, useState, type ReactNode } from 'react'
import { LiquidMetal } from '@paper-design/shaders-react'
import { LiquidShipItCanvas } from '@/components/LiquidShipItCanvas'
import {
  HERO_BG,
  LIQUID_TEXT,
  buildTextMask,
  measureLiquidTextBox,
} from '@/components/liquid-ship-it-utils'

function supportsWebGL(): boolean {
  if (typeof window === 'undefined') return false
  try {
    const canvas = document.createElement('canvas')
    return !!(canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
  } catch {
    return false
  }
}

function LiquidMetalFill({
  imageUrl,
  width,
  height,
}: {
  imageUrl: string
  width: number
  height: number
}) {
  return (
    <LiquidMetal
      image={imageUrl}
      width={width}
      height={height}
      fit="contain"
      scale={1}
      colorBack={HERO_BG}
      colorTint="#ffffff"
      repetition={2}
      shiftRed={0.35}
      shiftBlue={0.35}
      contour={0.45}
      softness={0.12}
      distortion={0.08}
      angle={45}
      speed={0.45}
      webGlContextAttributes={{ alpha: true, premultipliedAlpha: false }}
      className="hero-line--liquid-shader"
    />
  )
}

// Catches Paper Shaders throwing when WebGL init fails at runtime.
class ShaderErrorBoundary extends Component<
  { fallback: ReactNode; children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  render() {
    if (this.state.failed) return this.props.fallback
    return this.props.children
  }
}

function LiquidShipItWebGL() {
  const rootRef = useRef<HTMLSpanElement>(null)
  const [ready, setReady] = useState(false)
  const [size, setSize] = useState({ w: 1, h: 1 })
  const [maskUrl, setMaskUrl] = useState<string | null>(null)

  useEffect(() => {
    const root = rootRef.current
    if (!root) return

    const dpr = Math.min(window.devicePixelRatio || 1, 2)

    const rebuild = () => {
      const rect = root.getBoundingClientRect()
      const cs = getComputedStyle(root)
      const font = `${cs.fontStyle} ${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`
      const measured = measureLiquidTextBox(font, Math.max(1, Math.ceil(rect.height)))
      const cssW = Math.max(measured.w, Math.ceil(rect.width))
      const cssH = Math.max(measured.h, Math.ceil(rect.height))
      setSize({ w: cssW, h: cssH })

      const next = buildTextMask(LIQUID_TEXT, cssW, cssH, font, dpr)
      if (!next) return

      setMaskUrl(next)
      setReady(true)
    }

    const fontsReady = (document as Document & { fonts?: FontFaceSet }).fonts?.ready
    Promise.resolve(fontsReady).then(rebuild)
    const fallback = window.setTimeout(rebuild, 400)

    const ro = new ResizeObserver(rebuild)
    ro.observe(root)

    return () => {
      window.clearTimeout(fallback)
      ro.disconnect()
    }
  }, [])

  return (
    <ShaderErrorBoundary fallback={<LiquidShipItCanvas />}>
      <span
        ref={rootRef}
        className="hero-line italic font-normal hero-line--liquid"
        aria-label={LIQUID_TEXT}
        style={{
          ...(ready
            ? { color: 'transparent', WebkitTextFillColor: 'transparent' }
            : { color: '#6b5ce7' }),
          minWidth: size.w > 1 ? size.w : undefined,
        }}
      >
        {LIQUID_TEXT}
        {maskUrl ? (
          <Suspense fallback={null}>
            <LiquidMetalFill imageUrl={maskUrl} width={size.w} height={size.h} />
          </Suspense>
        ) : null}
      </span>
    </ShaderErrorBoundary>
  )
}

export function LiquidShipIt() {
  const [webgl, setWebgl] = useState<boolean | null>(null)

  useEffect(() => {
    setWebgl(supportsWebGL())
  }, [])

  // Loading: show static purple so layout doesn't jump.
  if (webgl === null) {
    return (
      <span
        className="hero-line italic font-normal hero-line--liquid"
        aria-label={LIQUID_TEXT}
        style={{ color: '#6b5ce7' }}
      >
        {LIQUID_TEXT}
      </span>
    )
  }

  if (!webgl) return <LiquidShipItCanvas />

  return <LiquidShipItWebGL />
}
