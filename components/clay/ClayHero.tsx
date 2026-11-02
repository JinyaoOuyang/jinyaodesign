'use client'

import { Suspense, useEffect, useRef, useState } from 'react'
import type { PointerEvent as ReactPointerEvent, ReactNode } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { ContactShadows, useGLTF } from '@react-three/drei'
import { NoToneMapping, SRGBColorSpace, type Group } from 'three'
import { ClayModel } from '@/components/clay/ClayModel'
import { SoftStudioLights } from '@/components/clay/ClayMiniCanvas'
import { getClayAsset, type ClaySlug } from '@/lib/clay'
import { usePrefersReducedMotion } from '@/lib/useReducedMotion'

type DragState = {
  active: boolean
  lastX: number
  rotationY: number
  velocity: number
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t
}

function damp(current: number, target: number, lambda: number, dt: number) {
  return lerp(current, target, 1 - Math.exp(-lambda * dt))
}

/** Outer rig the visitor can drag; wraps ClayModel's own idle animation untouched. */
function DragRig({
  drag,
  reduceMotion,
  children,
}: {
  drag: React.MutableRefObject<DragState>
  reduceMotion: boolean
  children: ReactNode
}) {
  const group = useRef<Group>(null)

  useFrame((_, dt) => {
    const g = group.current
    if (!g) return
    const d = drag.current

    if (!d.active && !reduceMotion && Math.abs(d.velocity) > 0.0005) {
      d.rotationY += d.velocity * dt
      d.velocity *= Math.max(0, 1 - dt * 3.2)
    }

    g.rotation.y = damp(g.rotation.y, d.rotationY, 10, dt)
  })

  return <group ref={group}>{children}</group>
}

function InvalidateOnce() {
  const invalidate = useThree((s) => s.invalidate)
  useEffect(() => {
    invalidate()
  }, [invalidate])
  return null
}

type ClayHeroProps = {
  slug: ClaySlug
}

const ROTATE_SENSITIVITY = 0.012

export function ClayHero({ slug }: ClayHeroProps) {
  const clay = getClayAsset(slug)
  const reduceMotion = usePrefersReducedMotion()
  const hostRef = useRef<HTMLDivElement>(null)
  // Default on so the hero always paints, even if the observer never fires.
  const [inView, setInView] = useState(true)
  const drag = useRef<DragState>({
    active: false,
    lastX: 0,
    rotationY: 0,
    velocity: 0,
  })

  useEffect(() => {
    if (clay) useGLTF.preload(clay.glb)
  }, [clay])

  // Pause the render loop when the hero scrolls out of view — no reason to
  // burn GPU/battery on a canvas nobody can see. Only pause when the element
  // is genuinely off-screen (rect-confirmed), so a flaky observer can never
  // freeze a hero that's actually visible. Fails safe if IO is unavailable.
  useEffect(() => {
    const el = hostRef.current
    if (!el || typeof IntersectionObserver === 'undefined') return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setInView(true)
          return
        }
        const r = el.getBoundingClientRect()
        const margin = 200
        const offscreen =
          r.bottom < -margin || r.top > window.innerHeight + margin
        setInView(!offscreen)
      },
      { rootMargin: '200px' }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  // R3F's initial container measure can miss (size not settled at mount),
  // leaving the canvas at its 300×150 default — a blank hero. A couple of
  // delayed resize nudges make R3F re-measure and fill; harmless once sized.
  useEffect(() => {
    const fire = () => window.dispatchEvent(new Event('resize'))
    const timers = [80, 300, 800].map((ms) => window.setTimeout(fire, ms))
    return () => timers.forEach((t) => window.clearTimeout(t))
  }, [])

  if (!clay) return null

  const onPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    drag.current.active = true
    drag.current.lastX = e.clientX
    drag.current.velocity = 0
    e.currentTarget.setPointerCapture(e.pointerId)
  }

  const onPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!drag.current.active) return
    const dx = e.clientX - drag.current.lastX
    drag.current.lastX = e.clientX
    drag.current.rotationY += dx * ROTATE_SENSITIVITY
    drag.current.velocity = dx * ROTATE_SENSITIVITY * 60
  }

  const endDrag = () => {
    drag.current.active = false
  }

  return (
    <div
      ref={hostRef}
      className="clay-hero"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerLeave={endDrag}
      onPointerCancel={endDrag}
    >
      <Canvas
        frameloop={inView ? 'always' : 'never'}
        dpr={[1, 1.75]}
        camera={{ position: [2.35, 2.05, 2.35], fov: 30, near: 0.1, far: 40 }}
        onCreated={({ camera, gl }) => {
          camera.lookAt(0, 0, 0)
          camera.updateProjectionMatrix()
          gl.toneMapping = NoToneMapping
          gl.outputColorSpace = SRGBColorSpace
        }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
          outputColorSpace: SRGBColorSpace,
          toneMapping: NoToneMapping,
        }}
        style={{ width: '100%', height: '100%', display: 'block', touchAction: 'none' }}
      >
        <InvalidateOnce />
        <SoftStudioLights />
        <Suspense fallback={null}>
          <DragRig drag={drag} reduceMotion={reduceMotion}>
            <ClayModel
              url={clay.glb}
              slug={clay.slug}
              scale={clay.scale}
              hovered
              reduceMotion={reduceMotion}
            />
          </DragRig>
          <ContactShadows
            position={[0, clay.shadowY, 0]}
            opacity={0.3}
            scale={3.4}
            blur={2.8}
            far={1.3}
            resolution={256}
            color="#4A4038"
          />
        </Suspense>
      </Canvas>
      <span className="clay-hero-hint" aria-hidden="true">
        Drag to rotate
      </span>
    </div>
  )
}
