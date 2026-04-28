'use client'

import { useEffect, useRef } from 'react'

export function StarCursor() {
  const cursorRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = cursorRef.current
    if (!el) return

    const onMove = (e: MouseEvent) => {
      el.style.left = `${e.clientX}px`
      el.style.top = `${e.clientY}px`
      el.style.opacity = '1'
    }

    const onLeave = () => {
      el.style.opacity = '0'
    }

    document.addEventListener('mousemove', onMove)
    document.addEventListener('mouseleave', onLeave)
    return () => {
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseleave', onLeave)
    }
  }, [])

  return (
    <div
      ref={cursorRef}
      className="pointer-events-none fixed"
      style={{
        zIndex: 9999,
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
          fill="#6D4CFF"
        />
        {/* Inner glow */}
        <circle cx="14" cy="14" r="3" fill="rgba(0,0,0,0.15)" />
      </svg>
    </div>
  )
}
