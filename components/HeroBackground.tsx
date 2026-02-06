'use client'

import { useEffect, useRef } from 'react'

/* ================================================================ *
 *  TUNING — adjust any of these to fine-tune the animation          *
 * ================================================================ */
const TUNE = {
  /* Stars per orbit ring */
  STARS_PER_RING: [4, 3, 4, 3] as number[],   // 14 total

  /* Star dot sizing (px) */
  STAR_R_MIN: 1.6,
  STAR_R_MAX: 3.2,
  STAR_OPACITY_MIN: 0.65,
  STAR_OPACITY_MAX: 0.95,

  /* Orbit line style */
  LINE_ALPHA: 0.14,

  /* Scroll → rotation + scale */
  SCROLL_ROTATE_DEG: 40,
  SCROLL_SCALE: 0.04,                          // 1 → 1.04
  SCROLL_RANGE_PX: 600,

  /* Cursor → pseudo-3D tilt */
  TILT_MAX_DEG: 4,
  PARALLAX_MAX_PX: 6,

  /* Sparkle (nearest-star effect) */
  SPARKLE_MS: 300,
  SPARKLE_PEAK_SCALE: 1.3,
  SPARKLE_OPACITY: 0.95,
  SPARKLE_RADIUS_PX: 120,                     // trigger within this distance

  /* Focus zone — fractions of canvas size */
  FOCUS_X1: 0.02,
  FOCUS_X2: 0.58,
  FOCUS_Y1: 0.12,
  FOCUS_Y2: 0.88,
  FOCUS_SLOW: 0.65,

  /* Lerp rates */
  LERP_CURSOR: 0.07,
  LERP_SCROLL: 0.08,
  LERP_FOCUS: 0.05,

  /* Depth scale per layer (near → far) */
  DEPTH_SCALE_NEAR: 1.02,
  DEPTH_SCALE_FAR: 0.98,

  /* Text-safety white fade */
  TEXT_SAFE_OPACITY: 0.6,
}

/* ================================================================ *
 *  Types                                                            *
 * ================================================================ */
interface Ring {
  rxF: number;  ryF: number          // radii as fraction of w / h
  baseTilt: number                    // resting tilt (radians)
  starSpeed: number                   // rad/s (negative = clockwise)
  lw: number                          // line width
  depth: number                       // 0 = near, 1 = far (parallax)
}

interface Star {
  ring: number; theta: number
  r: number; opacity: number
}

interface SparkleState { idx: number; elapsed: number }

/* ================================================================ *
 *  Ring definitions                                                 *
 * ================================================================ */
const RINGS: Ring[] = [
  { rxF: 0.44, ryF: 0.56, baseTilt: 0,    starSpeed:  0.12, lw: 1.0, depth: 0.0  },
  { rxF: 0.32, ryF: 0.42, baseTilt: 0.35, starSpeed: -0.16, lw: 0.8, depth: 0.35 },
  { rxF: 0.22, ryF: 0.30, baseTilt: 0.75, starSpeed:  0.22, lw: 0.7, depth: 0.65 },
  { rxF: 0.50, ryF: 0.36, baseTilt: 1.40, starSpeed: -0.09, lw: 0.9, depth: 1.0  },
]

/* ================================================================ *
 *  Helpers                                                          *
 * ================================================================ */
function lerp(a: number, b: number, t: number) { return a + (b - a) * t }

function ellipseXY(
  cx: number, cy: number, rx: number, ry: number,
  tilt: number, theta: number,
): [number, number] {
  const ct = Math.cos(tilt), st = Math.sin(tilt)
  const ca = Math.cos(theta), sa = Math.sin(theta)
  return [
    cx + rx * ca * ct - ry * sa * st,
    cy + rx * ca * st + ry * sa * ct,
  ]
}

function draw4Star(
  ctx: CanvasRenderingContext2D,
  x: number, y: number,
  outer: number, inner: number,
  opacity: number, rot: number,
) {
  ctx.save()
  ctx.translate(x, y)
  ctx.rotate(rot)
  ctx.beginPath()
  for (let i = 0; i < 8; i++) {
    const r = i % 2 === 0 ? outer : inner
    const a = (i / 8) * Math.PI * 2 - Math.PI / 2
    const px = Math.cos(a) * r, py = Math.sin(a) * r
    i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py)
  }
  ctx.closePath()
  ctx.fillStyle = `rgba(0,0,0,${opacity.toFixed(3)})`
  ctx.fill()
  ctx.restore()
}

/* ================================================================ *
 *  Component                                                        *
 * ================================================================ */
export function HeroBackground() {
  const wrapRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const cursorRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const canvas = canvasRef.current
    const wrap = wrapRef.current
    const cursorEl = cursorRef.current
    if (!canvas || !wrap) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    /* ---- mutable state ---- */
    let w = 0, h = 0, animId = 0, last = performance.now()

    const tgt  = { mx: 0.5, my: 0.5, sc: 0 }
    const sm   = { mx: 0.5, my: 0.5, sc: 0, focus: 0 }

    /* Create stars spread evenly per ring */
    const stars: Star[] = []
    RINGS.forEach((_, ri) => {
      const n = TUNE.STARS_PER_RING[ri] ?? 3
      for (let j = 0; j < n; j++) {
        stars.push({
          ring: ri,
          theta: (j / n) * Math.PI * 2 + Math.random() * 0.4,
          r: TUNE.STAR_R_MIN + Math.random() * (TUNE.STAR_R_MAX - TUNE.STAR_R_MIN),
          opacity: TUNE.STAR_OPACITY_MIN + Math.random() * (TUNE.STAR_OPACITY_MAX - TUNE.STAR_OPACITY_MIN),
        })
      }
    })

    let sparkle: SparkleState | null = null

    /* Create grain texture (Layer C — subtle noise, generated once) */
    const grainCanvas = document.createElement('canvas')
    grainCanvas.width = 256; grainCanvas.height = 256
    const gCtx = grainCanvas.getContext('2d')
    if (gCtx) {
      const img = gCtx.createImageData(256, 256)
      for (let i = 0; i < img.data.length; i += 4) {
        const v = Math.random() * 255
        img.data[i] = v; img.data[i+1] = v; img.data[i+2] = v
        img.data[i+3] = 6
      }
      gCtx.putImageData(img, 0, 0)
    }

    /* ---- cached ring params (recomputed per frame) ---- */
    const ringCache: { cx: number; cy: number; rx: number; ry: number; tilt: number }[] =
      RINGS.map(() => ({ cx: 0, cy: 0, rx: 0, ry: 0, tilt: 0 }))

    function computeRingCache() {
      const sN = Math.min(sm.sc / TUNE.SCROLL_RANGE_PX, 1)
      const scrollRot = sN * (TUNE.SCROLL_ROTATE_DEG * Math.PI / 180)
      const scrollSc = 1 + sN * TUNE.SCROLL_SCALE
      const mxOff = sm.mx - 0.5
      const myOff = sm.my - 0.5

      for (let i = 0; i < RINGS.length; i++) {
        const r = RINGS[i]
        const depthSc = lerp(TUNE.DEPTH_SCALE_NEAR, TUNE.DEPTH_SCALE_FAR, r.depth)
        const px = mxOff * TUNE.PARALLAX_MAX_PX * r.depth * 8
        const py = myOff * TUNE.PARALLAX_MAX_PX * r.depth * 6
        ringCache[i].cx = w * 0.5 + px
        ringCache[i].cy = h * 0.5 + py
        ringCache[i].rx = w * r.rxF * scrollSc * depthSc
        ringCache[i].ry = h * r.ryF * scrollSc * depthSc
        ringCache[i].tilt = r.baseTilt + scrollRot
      }
    }

    /* ---- resize ---- */
    function resize() {
      if (!canvas) return
      const dpr = Math.min(window.devicePixelRatio, 2)
      w = canvas.offsetWidth; h = canvas.offsetHeight
      canvas.width = w * dpr; canvas.height = h * dpr
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    /* ---- events ---- */
    let cursorVisible = false
    function onMouse(e: MouseEvent) {
      tgt.mx = e.clientX / window.innerWidth
      tgt.my = e.clientY / window.innerHeight

      // Update star cursor position relative to hero section
      if (cursorEl && wrap) {
        const rect = wrap.getBoundingClientRect()
        const inHero = e.clientX >= rect.left && e.clientX <= rect.right &&
                       e.clientY >= rect.top && e.clientY <= rect.bottom
        if (inHero) {
          cursorEl.style.left = `${e.clientX - rect.left}px`
          cursorEl.style.top = `${e.clientY - rect.top}px`
          if (!cursorVisible) {
            cursorEl.style.opacity = '1'
            cursorVisible = true
          }
        } else if (cursorVisible) {
          cursorEl.style.opacity = '0'
          cursorVisible = false
        }
      }
    }
    function onScroll() { tgt.sc = window.scrollY }

    /* ---- draw: monochrome depth gradients ---- */
    function drawBg() {
      if (!ctx) return

      // Layer A — radial depth gradient behind orbit center
      const g1 = ctx.createRadialGradient(w * 0.70, h * 0.40, 0, w * 0.70, h * 0.40, w * 0.55)
      g1.addColorStop(0, 'rgba(0,0,0,0.09)')
      g1.addColorStop(0.4, 'rgba(0,0,0,0.04)')
      g1.addColorStop(0.7, 'transparent')
      ctx.fillStyle = g1
      ctx.fillRect(0, 0, w, h)

      // Layer B — soft large-scale linear gradient (110deg)
      const g2 = ctx.createLinearGradient(0, 0, w * 0.6, h)
      g2.addColorStop(0, 'rgba(0,0,0,0.06)')
      g2.addColorStop(0.4, 'transparent')
      ctx.fillStyle = g2
      ctx.fillRect(0, 0, w, h)

      // Layer C — faint grain overlay
      ctx.save()
      ctx.globalAlpha = 0.35
      const pat = ctx.createPattern(grainCanvas, 'repeat')
      if (pat) { ctx.fillStyle = pat; ctx.fillRect(0, 0, w, h) }
      ctx.restore()
    }

    /* ---- draw: orbit lines ---- */
    function drawOrbits() {
      if (!ctx) return
      for (let i = 0; i < RINGS.length; i++) {
        const rc = ringCache[i]
        ctx.save()
        ctx.translate(rc.cx, rc.cy)
        ctx.rotate(rc.tilt)
        ctx.beginPath()
        ctx.ellipse(0, 0, Math.max(rc.rx, 1), Math.max(rc.ry, 1), 0, 0, Math.PI * 2)
        ctx.strokeStyle = `rgba(0,0,0,${TUNE.LINE_ALPHA})`
        ctx.lineWidth = RINGS[i].lw
        ctx.stroke()
        ctx.restore()
      }
    }

    /* ---- star screen position ---- */
    function starXY(s: Star): [number, number] {
      const rc = ringCache[s.ring]
      return ellipseXY(rc.cx, rc.cy, rc.rx, rc.ry, rc.tilt, s.theta)
    }

    /* ---- find nearest star within sparkle radius ---- */
    function findNearestInRange(): number {
      const cx = sm.mx * w, cy = sm.my * h
      let best = -1, bestD = Infinity
      for (let i = 0; i < stars.length; i++) {
        const [sx, sy] = starXY(stars[i])
        const d = Math.hypot(cx - sx, cy - sy)
        if (d < bestD) { bestD = d; best = i }
      }
      return bestD <= TUNE.SPARKLE_RADIUS_PX ? best : -1
    }

    /* ---- update stars ---- */
    function updateStars(dt: number) {
      const speedMul = 1 - sm.focus * (1 - TUNE.FOCUS_SLOW)
      for (const s of stars) {
        // Far layers move slower, near layers slightly faster
        const depthSpeed = 1.1 - RINGS[s.ring].depth * 0.2
        s.theta += RINGS[s.ring].starSpeed * dt * speedMul * depthSpeed
      }
    }

    /* ---- draw stars + sparkle ---- */
    function drawStars(dtMs: number) {
      if (!ctx) return

      // Advance sparkle timer
      if (sparkle) {
        sparkle.elapsed += dtMs
        if (sparkle.elapsed >= TUNE.SPARKLE_MS) sparkle = null
      }

      // Find nearest star within radius & trigger/sustain sparkle
      if (!reduced) {
        const nearest = findNearestInRange()
        if (nearest >= 0) {
          if (!sparkle || sparkle.idx !== nearest) {
            sparkle = { idx: nearest, elapsed: 0 }
          } else if (sparkle.elapsed >= TUNE.SPARKLE_MS) {
            sparkle.elapsed = 0                              // re-trigger loop
          }
        }
      }

      for (let i = 0; i < stars.length; i++) {
        const s = stars[i]
        const [x, y] = starXY(s)
        const isSpark = sparkle && sparkle.idx === i

        if (isSpark && sparkle) {
          const p = sparkle.elapsed / TUNE.SPARKLE_MS           // 0→1
          const ease = 1 - p * p                                 // ease-out
          const scale = 1 + (TUNE.SPARKLE_PEAK_SCALE - 1) * ease
          const r = s.r * scale
          const o = s.opacity + (TUNE.SPARKLE_OPACITY - s.opacity) * ease
          const rot = p * Math.PI * 0.25                         // subtle spin

          // 4-point star sparkle
          draw4Star(ctx, x, y, r * 3, r * 0.5, o, rot)

          // Subtle afterimage ring
          if (p > 0.1) {
            const ao = o * 0.18 * (1 - p)
            ctx.beginPath()
            ctx.arc(x, y, r * 2.2, 0, Math.PI * 2)
            ctx.strokeStyle = `rgba(0,0,0,${ao.toFixed(3)})`
            ctx.lineWidth = 0.5
            ctx.stroke()
          }
        } else {
          // Normal dot
          ctx.beginPath()
          ctx.arc(x, y, s.r, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(0,0,0,${s.opacity.toFixed(3)})`
          ctx.fill()
        }
      }
    }

    /* ---- text-safety gradient ---- */
    function drawTextSafety() {
      if (!ctx) return
      const g = ctx.createRadialGradient(w * 0.26, h * 0.48, 0, w * 0.26, h * 0.48, w * 0.32)
      g.addColorStop(0, `rgba(255,255,255,${TUNE.TEXT_SAFE_OPACITY})`)
      g.addColorStop(1, 'rgba(255,255,255,0)')
      ctx.fillStyle = g
      ctx.fillRect(0, 0, w, h)
    }

    /* ---- update focus zone ---- */
    function updateFocus() {
      const inside =
        sm.mx >= TUNE.FOCUS_X1 && sm.mx <= TUNE.FOCUS_X2 &&
        sm.my >= TUNE.FOCUS_Y1 && sm.my <= TUNE.FOCUS_Y2
      sm.focus = lerp(sm.focus, inside ? 1 : 0, TUNE.LERP_FOCUS)
    }

    /* ---- update 3D tilt on wrapper ---- */
    function updateTilt() {
      if (reduced || !wrap) return
      const rx = -(sm.my - 0.5) * TUNE.TILT_MAX_DEG * 2
      const ry =  (sm.mx - 0.5) * TUNE.TILT_MAX_DEG * 2
      wrap.style.transform =
        `perspective(900px) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg)`
    }

    /* ---- main loop ---- */
    function frame(now: number) {
      if (!ctx) return
      const dtSec = Math.min((now - last) / 1000, 0.1)
      const dtMs  = dtSec * 1000
      last = now

      // Smooth lerp
      if (!reduced) {
        sm.mx = lerp(sm.mx, tgt.mx, TUNE.LERP_CURSOR)
        sm.my = lerp(sm.my, tgt.my, TUNE.LERP_CURSOR)
      }
      sm.sc = lerp(sm.sc, tgt.sc, TUNE.LERP_SCROLL)

      updateFocus()
      computeRingCache()
      updateTilt()

      ctx.clearRect(0, 0, w, h)
      drawBg()
      drawOrbits()
      updateStars(reduced ? dtSec * 0.15 : dtSec)
      drawStars(dtMs)
      drawTextSafety()

      animId = requestAnimationFrame(frame)
    }

    /* ---- init ---- */
    tgt.sc = window.scrollY
    sm.sc = window.scrollY
    resize()
    window.addEventListener('resize', resize)
    if (!reduced) window.addEventListener('mousemove', onMouse)
    window.addEventListener('scroll', onScroll, { passive: true })
    animId = requestAnimationFrame(frame)

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMouse)
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  return (
    <>
      <div
        ref={wrapRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
        style={{ zIndex: 0, transformStyle: 'preserve-3d' }}
      >
        <canvas
          ref={canvasRef}
          className="absolute inset-0 h-full w-full"
        />
      </div>

      {/* Custom star cursor */}
      <div
        ref={cursorRef}
        className="pointer-events-none absolute"
        style={{
          zIndex: 10,
          width: 28,
          height: 28,
          marginLeft: -14,
          marginTop: -14,
          opacity: 0,
          transition: 'opacity 0.2s ease',
        }}
      >
        <svg
          width="28"
          height="28"
          viewBox="0 0 28 28"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="animate-star-cursor"
        >
          {/* 4-point star */}
          <path
            d="M14 0 L16.5 11 L28 14 L16.5 17 L14 28 L11.5 17 L0 14 L11.5 11 Z"
            fill="rgba(0,0,0,0.85)"
          />
          {/* Inner glow */}
          <circle cx="14" cy="14" r="3" fill="rgba(0,0,0,0.15)" />
        </svg>
      </div>
    </>
  )
}
