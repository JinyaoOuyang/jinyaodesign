'use client'

import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Center, useGLTF } from '@react-three/drei'
import {
  Color,
  Group,
  MathUtils,
  Quaternion,
  Vector3,
  type Material,
  type Mesh,
  type MeshStandardMaterial,
  type Object3D,
} from 'three'
import type { ClaySlug } from '@/lib/clay'

type ClayModelProps = {
  url: string
  slug: ClaySlug
  scale: number
  hovered: boolean
  reduceMotion: boolean
  phase?: number
}

type Pose = {
  obj: Object3D
  px: number
  py: number
  pz: number
  sx: number
  sy: number
  sz: number
  quat: Quaternion
}

type SwayPart = { g: Group; phase: number }
type FramePiece = { group: Group; base: Vector3; baseS: number }

type Rig = {
  /** Local-space axes shared by all flat GLB children (up + two horizontals). */
  up: Vector3
  ax1: Vector3
  ax2: Vector3
  glow: MeshStandardMaterial[]
  // isleo
  trees: SwayPart[]
  bushes: Pose[]
  // trail
  trailTip?: Group
  trailTipHome?: Vector3
  trailSpinner?: Group
  // listing
  frames: FramePiece[]
  beltSegs: Pose[]
  beltSpacing: number
  rollers: Pose[]
  convDir?: Vector3
  convSpan: number
  // tesla
  handle?: { g: Group; home: Vector3; out: Vector3; fwd: Vector3 }
  bars: Pose[]
}

const clamp = (v: number, min: number, max: number) =>
  Math.min(max, Math.max(min, v))

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t
}

function damp(current: number, target: number, lambda: number, dt: number) {
  return lerp(current, target, 1 - Math.exp(-lambda * dt))
}

/**
 * Material normalization only — the candy-pastel palette is authored in the
 * Blender build scripts, so colors pass through untouched. This just keeps
 * the clay surface matte and lighting-safe.
 */
function applyPastelClayLook(root: Group) {
  root.traverse((obj) => {
    const mesh = obj as Mesh
    if (!mesh.isMesh) return

    const apply = (mat: Material) => {
      const std = mat as MeshStandardMaterial
      if (!std.color) return
      std.roughness = 0.82
      if ('metalness' in std) std.metalness = 0
      if ('envMapIntensity' in std) std.envMapIntensity = 0
      std.needsUpdate = true
    }

    if (Array.isArray(mesh.material)) mesh.material.forEach(apply)
    else if (mesh.material) apply(mesh.material)
  })
}

function poseOf(obj: Object3D): Pose {
  return {
    obj,
    px: obj.position.x,
    py: obj.position.y,
    pz: obj.position.z,
    sx: obj.scale.x,
    sy: obj.scale.y,
    sz: obj.scale.z,
    quat: obj.quaternion.clone(),
  }
}

function buildRig(root: Group, slug: ClaySlug): Rig {
  root.updateMatrixWorld(true)

  const named: Object3D[] = []
  root.traverse((o) => {
    if (o.name) named.push(o)
  })
  const find = (n: string) => named.find((o) => o.name === n)

  // All meshes share one flat parent; express world up/horizontals in its space
  const anyMesh = named.find((o) => (o as Mesh).isMesh)
  const invQ = anyMesh?.parent
    ? anyMesh.parent.getWorldQuaternion(new Quaternion()).invert()
    : new Quaternion()
  const up = new Vector3(0, 1, 0).applyQuaternion(invQ).normalize()
  const ax1 = new Vector3(1, 0, 0).applyQuaternion(invQ).normalize()
  const ax2 = new Vector3().crossVectors(up, ax1).normalize()

  const rig: Rig = {
    up,
    ax1,
    ax2,
    glow: [],
    trees: [],
    bushes: [],
    frames: [],
    beltSegs: [],
    beltSpacing: 0.235,
    rollers: [],
    convSpan: 0,
    bars: [],
  }

  // Emissive parts glow in their own pigment; dark screens glow cyan
  named.forEach((obj) => {
    const mesh = obj as Mesh
    if (!mesh.isMesh || !/^GlowRing|^LampDome|^Screen|^Bar\d/.test(obj.name)) return
    const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material]
    mats.forEach((m) => {
      const std = m as MeshStandardMaterial
      if (!std || rig.glow.includes(std)) return
      const hsl = { h: 0, s: 0, l: 0 }
      std.color.getHSL(hsl)
      if (!std.emissive) std.emissive = new Color(0x000000)
      if (hsl.l < 0.3) std.emissive.set('#6CBAC9')
      else std.emissive.copy(std.color)
      std.emissiveIntensity = 0.1
      rig.glow.push(std)
    })
  })

  if (slug === 'isleo') {
    for (const prefix of ['TreeL', 'TreeR', 'Pine']) {
      const parts = named.filter((o) => o.name.startsWith(`${prefix}_`))
      if (parts.length === 0) continue
      const trunk = parts.find((o) => /trunk/i.test(o.name)) ?? parts[0]
      const parent = trunk.parent
      if (!parent) continue
      const g = new Group()
      g.name = `${prefix}_sway`
      g.position.copy(trunk.position)
      parent.add(g)
      parts.forEach((p) => g.attach(p))
      rig.trees.push({ g, phase: rig.trees.length * 1.15 })
    }
    rig.bushes = named.filter((o) => /^Bush|^Tuft/.test(o.name)).map(poseOf)
  }

  if (slug === 'trail') {
    const body = find('CompassBody')
    if (body?.parent) {
      const parent = body.parent
      const tip = new Group()
      tip.name = 'CompassTipRig'
      tip.position.copy(body.position)
      parent.add(tip)
      // spinner axis = dial normal (baked -42° tilt lives in body quaternion)
      const spinBase = new Group()
      spinBase.quaternion.copy(body.quaternion)
      tip.add(spinBase)
      const spinner = new Group()
      spinBase.add(spinner)
      named
        .filter((o) => /^Needle/.test(o.name))
        .forEach((o) => spinner.attach(o))
      named
        .filter((o) => /^Compass(Body|Bezel|Face)$|^NMark$|^Tick\d/.test(o.name))
        .forEach((o) => tip.attach(o))
      rig.trailTip = tip
      rig.trailTipHome = tip.position.clone()
      rig.trailSpinner = spinner
    }
  }

  if (slug === 'listing-image-pipeline') {
    const ra = find('RollerA')
    const rb = find('RollerB')
    if (ra && rb && ra.parent) {
      const dir = rb.position.clone().sub(ra.position).normalize()
      const span = ra.position.distanceTo(rb.position) * 1.3
      const center = ra.position.clone().add(rb.position).multiplyScalar(0.5)
      rig.convDir = dir
      rig.convSpan = span
      for (let i = 0; i < 3; i++) {
        const rim = find(`FrameRim${i}`)
        if (!rim?.parent) continue
        const slot = find(`FrameSlot${i}`)
        const g = new Group()
        g.name = `FrameConvey${i}`
        g.position.copy(rim.position)
        rim.parent.add(g)
        const base = g.position.clone()
        const baseS = base.clone().sub(center).dot(dir)
        g.attach(rim)
        if (slot) g.attach(slot)
        rig.frames.push({ group: g, base, baseS })
      }
      rig.beltSegs = named.filter((o) => /^BeltSeg/.test(o.name)).map(poseOf)
      rig.rollers = [ra, rb].map(poseOf)
    }
  }

  if (slug === 'tesla-charging') {
    const handle = find('Handle')
    const handleTip = find('HandleTip')
    const body = find('ChargerBody')
    const screen = find('Screen')
    if (handle?.parent && body) {
      const flat = (v: Vector3) =>
        v.sub(up.clone().multiplyScalar(v.dot(up))).normalize()
      const out = flat(handle.position.clone().sub(body.position))
      const fwd = screen
        ? flat(screen.position.clone().sub(body.position))
        : out.clone()
      const g = new Group()
      g.name = 'HandleRig'
      g.position.copy(handle.position)
      handle.parent.add(g)
      g.attach(handle)
      if (handleTip) g.attach(handleTip)
      rig.handle = { g, home: g.position.clone(), out, fwd }
    }
    rig.bars = named.filter((o) => /^Bar\d/.test(o.name)).map(poseOf)
  }

  return rig
}

/** Falling leaves + glowing sprites around the Isleo island on hover. */
function IsleoFx({
  active,
  reduceMotion,
}: {
  active: boolean
  reduceMotion: boolean
}) {
  const group = useRef<Group>(null)
  const fade = useRef(0)
  const leaves = useMemo(
    () =>
      Array.from({ length: 20 }, (_, i) => ({
        id: i,
        x: (i % 5) * 0.26 - 0.52,
        z: Math.floor(i / 5) * 0.26 - 0.39,
        phase: i * 0.7,
        speed: 0.3 + (i % 4) * 0.07,
        size: 0.05 + (i % 3) * 0.014,
      })),
    []
  )
  const sprites = useMemo(
    () =>
      Array.from({ length: 6 }, (_, i) => ({
        id: i,
        r: 0.5 + (i % 3) * 0.09,
        phase: i * 1.15,
        y: 0.45 + (i % 3) * 0.14,
      })),
    []
  )

  useFrame((state, dt) => {
    const g = group.current
    if (!g) return
    const t = state.clock.elapsedTime
    const target = active && !reduceMotion ? 1 : 0
    fade.current = damp(fade.current, target, 5, dt)
    const f = fade.current
    g.visible = f > 0.02
    if (!g.visible) return

    leaves.forEach((leaf, i) => {
      const child = g.children[i] as Mesh
      if (!child) return
      const life = (t * leaf.speed + leaf.phase) % 2.6
      const u = life / 2.6
      child.position.set(
        leaf.x + Math.sin(t * 1.2 + leaf.phase) * 0.16,
        0.72 - u * 0.85,
        leaf.z + Math.cos(t * 0.9 + leaf.phase) * 0.1
      )
      child.rotation.z = t * 2.2 + leaf.phase
      child.rotation.x = Math.sin(t + leaf.phase) * 0.7
      const s = leaf.size * (0.7 + Math.sin(u * Math.PI) * 0.5) * f
      child.scale.setScalar(Math.max(0.001, s))
    })

    sprites.forEach((sp, i) => {
      const child = g.children[leaves.length + i] as Mesh
      if (!child) return
      const ang = t * 0.8 + sp.phase
      child.position.set(
        Math.cos(ang) * sp.r,
        sp.y + Math.sin(t * 2.4 + sp.phase) * 0.08,
        Math.sin(ang) * sp.r * 0.75
      )
      const pulse = (0.05 + Math.sin(t * 4 + sp.phase) * 0.016) * f
      child.scale.setScalar(Math.max(0.001, pulse))
    })
  })

  return (
    <group ref={group} visible={false}>
      {leaves.map((leaf) => (
        <mesh key={`leaf-${leaf.id}`}>
          <planeGeometry args={[1, 1.4]} />
          <meshStandardMaterial
            color="#8FA97E"
            roughness={0.92}
            transparent
            opacity={0.92}
            depthWrite={false}
          />
        </mesh>
      ))}
      {sprites.map((sp) => (
        <mesh key={`sprite-${sp.id}`}>
          <sphereGeometry args={[1, 10, 10]} />
          <meshStandardMaterial
            color="#E8D9A8"
            emissive="#D0A568"
            emissiveIntensity={1.4}
            roughness={0.9}
            transparent
            opacity={0.9}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  )
}

const qTmp = new Quaternion()
const qTmp2 = new Quaternion()
const Z_AXIS = new Vector3(0, 0, 1)

export function ClayModel({
  url,
  slug,
  scale,
  hovered,
  reduceMotion,
  phase = 0,
}: ClayModelProps) {
  const { scene } = useGLTF(url)
  const { clone, rig } = useMemo(() => {
    const next = scene.clone(true) as Group
    applyPastelClayLook(next)
    return { clone: next, rig: buildRig(next, slug) }
  }, [scene, slug])

  const root = useRef<Group>(null)
  const hoverAmt = useRef(0)
  const spin = useRef(phase)
  const needleSpin = useRef(0)
  const rollAngle = useRef(0)

  useFrame((state, dt) => {
    const g = root.current
    if (!g) return

    const target = hovered && !reduceMotion ? 1 : 0
    hoverAmt.current = damp(hoverAmt.current, target, 5, dt)
    const h = hoverAmt.current
    const t = state.clock.elapsedTime + phase

    if (reduceMotion) {
      g.rotation.y = hovered ? 0.12 : 0
      g.position.y = 0
      return
    }

    // Idle: slow free spin. Hover slows it so the signature move reads.
    const idleSpeed = lerp(0.28, 0.05, h)
    spin.current += dt * idleSpeed
    g.rotation.y = spin.current
    g.position.y = Math.sin(t * 0.7) * lerp(0.018, 0.008, h)

    // —— Isleo: gusts bend whole trees; bushes wobble ——
    if (slug === 'isleo') {
      rig.trees.forEach((tree) => {
        const idle = Math.sin(t * 1.1 + tree.phase) * 0.022
        const gust =
          (Math.sin(t * 3.1 + tree.phase) * 0.16 +
            Math.sin(t * 5.3 + tree.phase * 2) * 0.05) *
          h
        const a1 = idle + gust
        const a2 = Math.sin(t * 2.3 + tree.phase * 1.7) * 0.09 * h
        qTmp.setFromAxisAngle(rig.ax1, a1)
        qTmp2.setFromAxisAngle(rig.ax2, a2)
        tree.g.quaternion.copy(qTmp).multiply(qTmp2)
      })
      rig.bushes.forEach((p, i) => {
        const wob = Math.sin(t * 4 + i) * 0.09 * h
        qTmp.setFromAxisAngle(rig.ax1, wob)
        p.obj.quaternion.copy(p.quat).multiply(qTmp)
      })
    }

    // —— Trail: compass stands up first, then the needle spins ——
    if (slug === 'trail' && rig.trailTip && rig.trailSpinner && rig.trailTipHome) {
      const tip = rig.trailTip
      const rise = MathUtils.smoothstep(h, 0.0, 0.6)
      tip.rotation.x = damp(tip.rotation.x, -0.5 * rise, 6, dt)
      tip.position
        .copy(rig.trailTipHome)
        .addScaledVector(rig.up, 0.07 * rise)

      const gate = MathUtils.smoothstep(h, 0.55, 0.9)
      if (gate > 0.01) {
        needleSpin.current += dt * (4.8 + Math.sin(t * 1.4) * 1.2) * gate
      } else {
        // settle back to north
        const twoPi = Math.PI * 2
        const nearest = Math.round(needleSpin.current / twoPi) * twoPi
        needleSpin.current = damp(needleSpin.current, nearest, 4, dt)
      }
      rig.trailSpinner.rotation.z = needleSpin.current
    }

    // —— Listing: conveyor loops L→R, frames pop in one by one ——
    if (slug === 'listing-image-pipeline' && rig.convDir) {
      const speed = 0.16 // belt cycles per second
      rig.frames.forEach((f) => {
        const u = (((f.baseS / rig.convSpan + 0.5 + t * speed) % 1) + 1) % 1
        const s = (u - 0.5) * rig.convSpan
        const pop =
          MathUtils.smoothstep(u, 0.02, 0.16) *
          (1 - MathUtils.smoothstep(u, 0.84, 0.98))
        f.group.position
          .copy(f.base)
          .addScaledVector(rig.convDir!, (s - f.baseS) * h)
        f.group.scale.setScalar(Math.max(0.001, lerp(1, pop, h)))
      })

      const shift = ((t * speed * rig.convSpan) % rig.beltSpacing) * h
      rig.beltSegs.forEach((p) => {
        p.obj.position.set(p.px, p.py, p.pz).addScaledVector(rig.convDir!, shift)
      })

      // Roller local Z is the cylinder axis (baked 90° tilt lives in quat)
      rollAngle.current += dt * ((speed * rig.convSpan) / 0.14) * h
      qTmp.setFromAxisAngle(Z_AXIS, -rollAngle.current)
      rig.rollers.forEach((p) => {
        p.obj.quaternion.copy(p.quat).multiply(qTmp)
      })
    }

    // —— Tesla: unplug → push in to charge → glow surge → dock back ——
    if (slug === 'tesla-charging') {
      let charge = 0
      if (rig.handle) {
        const P = 3.2
        const u = ((t / P) % 1 + 1) % 1
        const s = (a: number, b: number) => MathUtils.smoothstep(u, a, b)
        const outA = s(0.02, 0.2) - s(0.78, 0.96)
        const fwdA = s(0.24, 0.42) - s(0.66, 0.86)
        charge = s(0.42, 0.5) - s(0.6, 0.72)
        rig.handle.g.position
          .copy(rig.handle.home)
          .addScaledVector(rig.handle.out, 0.1 * outA * h)
          .addScaledVector(rig.up, 0.05 * outA * h)
          .addScaledVector(rig.handle.fwd, 0.16 * fwdA * h)
      }
      rig.bars.forEach((p, i) => {
        const fill = clamp(charge * 3 - i * 0.8, 0, 1)
        const grow = 1 - h + h * (0.3 + 0.7 * fill)
        p.obj.scale.y = damp(p.obj.scale.y, p.sy * grow, 8, dt)
      })
      rig.glow.forEach((mat) => {
        const pulse = 0.1 + h * (0.2 + charge * (0.6 + 0.2 * Math.sin(t * 9)))
        mat.emissiveIntensity = damp(mat.emissiveIntensity || 0, pulse, 8, dt)
      })
    } else {
      // Other models: gentle glow lift on hover (listing lamp)
      rig.glow.forEach((mat) => {
        const pulse = 0.1 + h * (0.45 + 0.2 * Math.sin(t * 5))
        mat.emissiveIntensity = damp(mat.emissiveIntensity || 0, pulse, 6, dt)
      })
    }
  })

  return (
    <group ref={root}>
      <Center>
        <group scale={scale}>
          <primitive object={clone} />
          {slug === 'isleo' && (
            <IsleoFx active={hovered} reduceMotion={reduceMotion} />
          )}
        </group>
      </Center>
    </group>
  )
}

export function preloadClay(url: string) {
  useGLTF.preload(url)
}
