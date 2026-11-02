'use client'

import { useEffect, useRef, useState } from 'react'
import {
  ACCENT_PURPLE,
  ACCENT_PURPLE_DEEP,
  ACCENT_PURPLE_LIGHT,
  LIQUID_TEXT,
  measureLiquidTextBox,
} from '@/components/liquid-ship-it-utils'

// Canvas 2D liquid-metal fallback for browsers without WebGL.
export function LiquidShipItCanvas() {
  const rootRef = useRef<HTMLSpanElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [minW, setMinW] = useState<number | undefined>()

  useEffect(() => {
    const root = rootRef.current
    const view = canvasRef.current
    if (!root || !view) return

    const ctx = view.getContext('2d')
    if (!ctx) return

    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let cssW = 1
    let cssH = 1
    let fontStr = ''

    const resize = () => {
      const rect = root.getBoundingClientRect()
      const cs = getComputedStyle(root)
      fontStr = `${cs.fontStyle} ${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`
      const measured = measureLiquidTextBox(fontStr, Math.max(1, Math.ceil(rect.height)))
      cssW = Math.max(measured.w, Math.ceil(rect.width))
      cssH = Math.max(measured.h, Math.ceil(rect.height))
      setMinW(cssW)
      view.width = Math.round(cssW * dpr)
      view.height = Math.round(cssH * dpr)
      view.style.width = `${cssW}px`
      view.style.height = `${cssH}px`
    }

    const channel = (ox: number, r: number, rgb: string, a: number) => {
      const g = ctx.createRadialGradient(ox, 0, 0, ox, 0, r)
      g.addColorStop(0, `rgba(${rgb},${a})`)
      g.addColorStop(0.72, `rgba(${rgb},${a})`)
      g.addColorStop(0.92, `rgba(${rgb},${a * 0.5})`)
      g.addColorStop(1, `rgba(${rgb},0)`)
      ctx.fillStyle = g
      ctx.fillRect(ox - r, -r, r * 2, r * 2)
    }

    const paint = (timeSec: number) => {
      const t = timeSec
      const W = cssW
      const H = cssH

      ctx.setTransform(1, 0, 0, 1, 0, 0)
      ctx.clearRect(0, 0, view.width, view.height)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      const speed = 0.13
      const p = (t * speed) % 1
      const s = -0.06 + 1.51 * p
      const cx = s * W
      const cy = (1 - s) * H
      const ang = -Math.PI / 4

      const DEEP = ACCENT_PURPLE_DEEP
      const PURPLE = ACCENT_PURPLE
      const PURPLE_LIGHT = ACCENT_PURPLE_LIGHT
      const base = ctx.createLinearGradient(0, H, W, 0)
      const stops: Array<[number, string]> = [
        [0, DEEP],
        [s - 0.62, DEEP],
        [s - 0.45, PURPLE],
        [s - 0.06, PURPLE_LIGHT],
        [s + 0.05, DEEP],
        [1, DEEP],
      ]
      let lastPos = -1
      for (const [posRaw, col] of stops) {
        let pos = Math.min(1, Math.max(0, posRaw))
        if (pos <= lastPos) pos = Math.min(1, lastPos + 0.0005)
        base.addColorStop(pos, col)
        lastPos = pos
      }
      ctx.globalCompositeOperation = 'source-over'
      ctx.fillStyle = base
      ctx.fillRect(0, 0, W, H)

      ctx.globalCompositeOperation = 'screen'
      ctx.save()
      ctx.translate(cx, cy)
      ctx.rotate(ang)
      const pulse = 1 + 0.14 * Math.sin(t * 1.7)
      ctx.scale(pulse, (1 / pulse) * 0.95)

      const r = H * 0.6
      const d = r * 0.2
      channel(d, r, '255,45,55', 0.92)
      channel(d * 0.5, r, '255,180,55', 0.88)
      channel(0, r, '70,255,95', 0.92)
      channel(-d * 0.5, r, '50,210,255', 0.88)
      channel(-d, r, '95,85,255', 0.92)
      channel(0, r * 0.55, '255,255,255', 0.9)
      ctx.restore()

      const mg = ctx.createRadialGradient(cx, cy, 0, cx, cy, r * 1.05)
      mg.addColorStop(0, 'rgba(255,255,255,0.95)')
      mg.addColorStop(0.65, 'rgba(225,215,255,0.45)')
      mg.addColorStop(1, 'rgba(255,255,255,0)')
      ctx.strokeStyle = mg
      ctx.lineWidth = Math.max(1.5, H * 0.022)
      ctx.lineJoin = 'round'
      ctx.font = fontStr
      ctx.strokeText(LIQUID_TEXT, 0, H * 0.8)

      ctx.globalCompositeOperation = 'destination-in'
      ctx.fillStyle = '#000'
      ctx.textBaseline = 'alphabetic'
      ctx.font = fontStr
      ctx.fillText(LIQUID_TEXT, 0, H * 0.8)

      ctx.globalCompositeOperation = 'source-over'
    }

    let raf = 0
    let t0 = 0
    const loop = (ts: number) => {
      if (!t0) t0 = ts
      paint((ts - t0) / 1000)
      raf = requestAnimationFrame(loop)
    }

    let started = false
    const start = () => {
      if (started) return
      started = true
      resize()
      if (reduce) paint(6)
      else raf = requestAnimationFrame(loop)
    }

    const fontsReady = (document as Document & { fonts?: FontFaceSet }).fonts?.ready
    Promise.resolve(fontsReady).then(start)
    const fallbackTimer = window.setTimeout(start, 400)

    const ro = new ResizeObserver(() => {
      resize()
      if (reduce) paint(6)
    })
    ro.observe(root)

    return () => {
      cancelAnimationFrame(raf)
      window.clearTimeout(fallbackTimer)
      ro.disconnect()
    }
  }, [])

  return (
    <span
      ref={rootRef}
      className="hero-line italic font-normal hero-line--liquid"
      aria-label={LIQUID_TEXT}
      style={{
        color: 'transparent',
        WebkitTextFillColor: 'transparent',
        minWidth: minW,
      }}
    >
      {LIQUID_TEXT}
      <canvas ref={canvasRef} className="hero-line--liquid-canvas" aria-hidden="true" />
    </span>
  )
}
