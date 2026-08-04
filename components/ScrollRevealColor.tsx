'use client'

import { useEffect, useRef, useState, ReactNode } from 'react'

interface ScrollRevealColorProps {
  children: ReactNode
  className?: string
}

export function ScrollRevealColor({ children, className = '' }: ScrollRevealColorProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const handleScroll = () => {
      const rect = element.getBoundingClientRect()
      const windowHeight = window.innerHeight
      
      // Calculate how much of the element is visible
      // Start transition when element enters viewport, complete when it's 40% up
      const start = windowHeight
      const end = windowHeight * 0.4
      
      if (rect.top >= start) {
        setProgress(0)
      } else if (rect.top <= end) {
        setProgress(1)
      } else {
        const p = 1 - (rect.top - end) / (start - end)
        setProgress(Math.max(0, Math.min(1, p)))
      }
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleScroll)
    }
  }, [])

  const grayscale = 1 - progress

  return (
    <div
      ref={ref}
      className={className}
      style={{
        filter: `grayscale(${grayscale})`,
        transition: 'filter 0.1s ease-out',
      }}
    >
      {children}
    </div>
  )
}
