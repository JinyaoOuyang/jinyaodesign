'use client'

import { Suspense, useEffect } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import { ContactShadows, useGLTF } from '@react-three/drei'
import { ClayModel } from '@/components/clay/ClayModel'
import { getClayAsset, type ClaySlug } from '@/lib/clay'
import { NoToneMapping, SRGBColorSpace } from 'three'

type ClayMiniCanvasProps = {
  url: string
  slug: ClaySlug
  scale: number
  hovered: boolean
  reduceMotion: boolean
  phase?: number
}

/**
 * High-key pastel studio — ambient dominates so no face falls into murk;
 * a soft warm key gives just enough form. Sum stays ≈1.2 so top faces
 * barely clip under NoToneMapping.
 */
function SoftStudioLights() {
  return (
    <>
      {/* three r155+ physical lights: ×π so ambient 0.95 ≈ full albedo */}
      <ambientLight intensity={0.95 * Math.PI} />
      <directionalLight
        position={[4, 6, 3]}
        intensity={0.26 * Math.PI}
        color="#FFF2E0"
      />
      <directionalLight
        position={[-3, 2, -2]}
        intensity={0.1 * Math.PI}
        color="#E4ECFF"
      />
    </>
  )
}

function InvalidateOnce({ active }: { active: boolean }) {
  const invalidate = useThree((s) => s.invalidate)
  useEffect(() => {
    if (active) invalidate()
  }, [active, invalidate])
  return null
}

export function ClayMiniCanvas({
  url,
  slug,
  scale,
  hovered,
  reduceMotion,
  phase = 0,
}: ClayMiniCanvasProps) {
  const demand = reduceMotion && !hovered
  const shadowY = getClayAsset(slug)?.shadowY ?? -0.55

  useEffect(() => {
    useGLTF.preload(url)
  }, [url])

  return (
    <Canvas
      dpr={[1, 1.5]}
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
      style={{ width: '100%', height: '100%', pointerEvents: 'none', display: 'block' }}
      frameloop={demand ? 'demand' : 'always'}
    >
      <InvalidateOnce active={demand} />
      <SoftStudioLights />
      <Suspense fallback={null}>
        <ClayModel
          url={url}
          slug={slug}
          scale={scale}
          hovered={hovered}
          reduceMotion={reduceMotion}
          phase={phase}
        />
        <ContactShadows
          position={[0, shadowY, 0]}
          opacity={0.3}
          scale={3.4}
          blur={2.8}
          far={1.3}
          resolution={256}
          color="#4A4038"
        />
      </Suspense>
    </Canvas>
  )
}
