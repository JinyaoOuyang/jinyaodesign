'use client'

import { Suspense, useEffect, useMemo, useRef, useState } from 'react'
import type { PointerEvent as ReactPointerEvent } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Center, ContactShadows, useGLTF } from '@react-three/drei'
import {
  Color,
  NoToneMapping,
  SRGBColorSpace,
  type Group,
  type Mesh,
  type MeshStandardMaterial,
} from 'three'
import { SoftStudioLights } from '@/components/clay/ClayMiniCanvas'
import { usePrefersReducedMotion } from '@/lib/useReducedMotion'

const ISLAND_URL = '/work/isleo/focus/paradise-v1.glb?v=1'
const GROWTH_URLS = [
  '/work/isleo/focus/paradise-v2.glb?v=1',
  '/work/isleo/focus/paradise-v3.glb?v=1',
  '/work/isleo/focus/paradise-v4.glb?v=1',
]

const clamp01 = (x: number) => Math.min(1, Math.max(0, x))
const smooth = (a: number, b: number, x: number) => {
  const t = clamp01((x - a) / (b - a))
  return t * t * (3 - 2 * t)
}
const lerp = (a: number, b: number, t: number) => a + (b - a) * t

type MatState = {
  mat: MeshStandardMaterial
  blank: Color
  cursed: Color
  paradise: Color
}

/**
 * Derive the "undiscovered" (pale) and "cursed" (ashen) looks from each
 * material's real paradise color, so one app GLB carries all three states.
 */
function deriveStates(root: Group): MatState[] {
  const out: MatState[] = []
  root.traverse((obj) => {
    const mesh = obj as Mesh
    if (!mesh.isMesh) return
    const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material]
    mats.forEach((m) => {
      const mat = m as MeshStandardMaterial
      if (!mat?.color) return
      mat.roughness = 0.85
      if ('metalness' in mat) mat.metalness = 0
      if ('envMapIntensity' in mat) mat.envMapIntensity = 0
      const hsl = { h: 0, s: 0, l: 0 }
      mat.color.getHSL(hsl)
      const blank = new Color().setHSL(
        hsl.h,
        hsl.s * 0.1,
        Math.min(0.9, hsl.l * 0.45 + 0.6)
      )
      // Cursed: darken hard, then pull toward ash charcoal for a burnt look.
      const cursed = new Color()
        .setHSL(hsl.h, hsl.s * 0.16, hsl.l * 0.16 + 0.02)
        .lerp(new Color('#33302a'), 0.5)
      out.push({ mat, blank, cursed, paradise: mat.color.clone() })
    })
  })
  return out
}

/** Applies the white → cursed → paradise blend for a given progress. */
function applyStateColors(states: MatState[], p: number) {
  const toCursed = smooth(0.3, 0.42, p)
  const toParadise = smooth(0.5, 0.64, p)
  states.forEach((s) => {
    s.mat.color.copy(s.blank).lerp(s.cursed, toCursed).lerp(s.paradise, toParadise)
    s.mat.needsUpdate = true
  })
}

function Island({
  progress,
  reduceMotion,
  dragY,
}: {
  progress: React.MutableRefObject<number>
  reduceMotion: boolean
  dragY: React.MutableRefObject<number>
}) {
  const { scene } = useGLTF(ISLAND_URL)
  const clone = useMemo(() => scene.clone(true) as Group, [scene])
  const states = useMemo(() => deriveStates(clone), [clone])
  const root = useRef<Group>(null)
  const spin = useRef(0)

  useFrame((_, dt) => {
    const p = progress.current
    applyStateColors(states, p)
    const g = root.current
    if (!g) return
    if (!reduceMotion) spin.current += dt * lerp(0.05, 0.16, smooth(0.5, 0.7, p))
    g.rotation.y = spin.current + dragY.current
    // Rise + gentle grow as it blooms into paradise, then grows more.
    const bloom = smooth(0.5, 0.68, p)
    const grow = smooth(0.7, 1, p)
    g.scale.setScalar(lerp(0.9, 1, bloom) * lerp(1, 1.12, grow))
    g.position.y = lerp(-0.15, 0, bloom)
  })

  return (
    <group ref={root}>
      <primitive object={clone} />
    </group>
  )
}

/** Extra islands that fade/scale in during the growth beat. */
function GrowthIslands({
  progress,
  reduceMotion,
}: {
  progress: React.MutableRefObject<number>
  reduceMotion: boolean
}) {
  const models = GROWTH_URLS.map((u) => useGLTF(u))
  const clones = useMemo(
    () => models.map((m) => m.scene.clone(true) as Group),
    [models]
  )
  useMemo(() => clones.forEach((c) => deriveStates(c)), [clones])
  const refs = useRef<(Group | null)[]>([])
  const spin = useRef(0)

  const layout = useMemo(
    () => [
      { x: -2.6, z: -0.6, s: 0.5, delay: 0.0 },
      { x: 2.5, z: -1.1, s: 0.42, delay: 0.12 },
      { x: 0.3, z: 2.6, s: 0.46, delay: 0.24 },
    ],
    []
  )

  useFrame((_, dt) => {
    if (!reduceMotion) spin.current += dt * 0.1
    const p = progress.current
    clones.forEach((_, i) => {
      const g = refs.current[i]
      const l = layout[i]
      if (!g || !l) return
      const t = smooth(0.72 + l.delay, 0.92 + l.delay, p)
      g.visible = t > 0.001
      g.position.set(l.x, lerp(-1.4, -0.35, t), l.z)
      g.scale.setScalar(l.s * t)
      g.rotation.y = spin.current + i
    })
  })

  return (
    <>
      {clones.map((c, i) => (
        <group
          key={i}
          ref={(el) => {
            refs.current[i] = el
          }}
          visible={false}
        >
          <primitive object={c} />
        </group>
      ))}
    </>
  )
}

function Scene({
  progress,
  reduceMotion,
  dragY,
}: {
  progress: React.MutableRefObject<number>
  reduceMotion: boolean
  dragY: React.MutableRefObject<number>
}) {
  return (
    <>
      <SoftStudioLights />
      <Center>
        <Suspense fallback={null}>
          <Island progress={progress} reduceMotion={reduceMotion} dragY={dragY} />
          <GrowthIslands progress={progress} reduceMotion={reduceMotion} />
        </Suspense>
      </Center>
      <ContactShadows
        position={[0, -1.15, 0]}
        opacity={0.28}
        scale={9}
        blur={2.8}
        far={2.2}
        resolution={256}
        color="#4A4038"
      />
    </>
  )
}

const BEATS = [
  { key: 'intro', label: '' },
  { key: 'overview', label: 'Overview' },
  { key: 'cursed', label: 'Miss a day' },
  { key: 'paradise', label: 'Hit your goal' },
  { key: 'growth', label: 'Keep going' },
]

function beatFromProgress(p: number) {
  if (p < 0.14) return 0
  if (p < 0.3) return 1
  if (p < 0.5) return 2
  if (p < 0.7) return 3
  return 4
}

type ClayScrollHeroProps = {
  debugProgress?: number
  children?: React.ReactNode
}

export function ClayScrollHero({ debugProgress }: ClayScrollHeroProps) {
  const reduceMotion = usePrefersReducedMotion()
  const sectionRef = useRef<HTMLDivElement>(null)
  const progress = useRef(debugProgress ?? 0)
  const dragY = useRef(0)
  const dragging = useRef(false)
  const lastX = useRef(0)
  const [beat, setBeat] = useState(debugProgress ? beatFromProgress(debugProgress) : 0)

  // R3F's initial container measure can miss at mount; nudge it to fill.
  useEffect(() => {
    const fire = () => window.dispatchEvent(new Event('resize'))
    const timers = [80, 300, 800].map((ms) => window.setTimeout(fire, ms))
    return () => timers.forEach((t) => window.clearTimeout(t))
  }, [])

  useEffect(() => {
    if (debugProgress != null) {
      progress.current = debugProgress
      setBeat(beatFromProgress(debugProgress))
      return
    }
    const onScroll = () => {
      const el = sectionRef.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      const total = el.offsetHeight - window.innerHeight
      const p = clamp01(-rect.top / Math.max(1, total))
      progress.current = p
      setBeat((b) => {
        const nb = beatFromProgress(p)
        return nb === b ? b : nb
      })
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [debugProgress])

  // Drag to rotate — only meaningful once the island has bloomed (paradise+).
  const canDrag = beat >= 3
  const onPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!canDrag) return
    dragging.current = true
    lastX.current = e.clientX
    e.currentTarget.setPointerCapture(e.pointerId)
  }
  const onPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!dragging.current) return
    dragY.current += (e.clientX - lastX.current) * 0.01
    lastX.current = e.clientX
  }
  const endDrag = () => {
    dragging.current = false
  }

  return (
    <div
      ref={sectionRef}
      className="clay-scroll"
      style={{ height: debugProgress != null ? '100vh' : '520vh' }}
    >
      <div className="clay-scroll-pin">
        <div className="clay-scroll-copy" data-beat={BEATS[beat].key}>
          {beat === 0 && (
            <div className="clay-scroll-panel">
              <h1 className="clay-scroll-title">Isleo</h1>
              <p className="clay-scroll-sub">
                A focus companion where time you protect becomes a world you grow.
              </p>
              <span className="clay-scroll-scrollcue">Scroll ↓</span>
            </div>
          )}
          {beat === 1 && (
            <div className="clay-scroll-panel">
              <span className="clay-scroll-eyebrow">01 — Overview</span>
              <p className="clay-scroll-body">
                Habit apps sell streaks. Isleo sells a place you return to. Each
                day is a hex tile; each month, a map. Focus grows the land.
              </p>
            </div>
          )}
          {beat === 2 && (
            <div className="clay-scroll-panel">
              <span className="clay-scroll-eyebrow">Miss a day</span>
              <p className="clay-scroll-body">
                Skip your focus and the tile turns cursed — fog and ash instead of
                growth. The state machine, not a screen, carries the consequence.
              </p>
            </div>
          )}
          {beat === 3 && (
            <div className="clay-scroll-panel">
              <span className="clay-scroll-eyebrow">Hit your goal</span>
              <p className="clay-scroll-body">
                Protect the time and the land blooms into paradise. Drag it — it's
                the real clay model shipped in the app, rendered live on the web.
              </p>
            </div>
          )}
          {beat === 4 && (
            <div className="clay-scroll-panel">
              <span className="clay-scroll-eyebrow">Keep going</span>
              <p className="clay-scroll-body">
                Focus every day and one island becomes many — a month-world you can
                revisit. This is what consistency looks like.
              </p>
            </div>
          )}
        </div>

        <div
          className="clay-scroll-canvas"
          data-can-drag={canDrag ? 'true' : 'false'}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerLeave={endDrag}
        >
          <Canvas
            dpr={[1, 1.75]}
            camera={{ position: [3.2, 2.6, 3.2], fov: 32, near: 0.1, far: 60 }}
            onCreated={({ camera, gl }) => {
              camera.lookAt(0, -0.1, 0)
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
            style={{ width: '100%', height: '100%', touchAction: 'pan-y' }}
          >
            <Scene progress={progress} reduceMotion={reduceMotion} dragY={dragY} />
          </Canvas>

          {canDrag && (
            <span className="clay-scroll-hint" aria-hidden="true">
              Drag to rotate
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

useGLTF.preload(ISLAND_URL)
GROWTH_URLS.forEach((u) => useGLTF.preload(u))
