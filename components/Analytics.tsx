'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { classifyLink } from '@/lib/analytics'

const measurementId = 'G-9WWV08C6KQ'
const productionHosts = ['www.jinyaodesign.com', 'jinyaodesign.com']

declare global {
  interface Window {
    dataLayer?: unknown[]
    gtag?: (...args: unknown[]) => void
  }
}

function track(name: string, params: Record<string, string | undefined>) {
  if (!productionHosts.includes(window.location.hostname)) {
    console.debug('[analytics]', name, params)
    return
  }
  window.gtag?.('event', name, params)
}

export function Analytics() {
  const pathname = usePathname()

  useEffect(() => {
    const production = productionHosts.includes(window.location.hostname)
    if (production && !window.gtag) {
      window.dataLayer = window.dataLayer || []
      window.gtag = function () { window.dataLayer!.push(arguments) }
      window.gtag('js', new Date())
      // Keep GA's automatic page views; sending our own would count visits twice.
      window.gtag('config', measurementId)
      const script = document.createElement('script')
      script.async = true
      script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`
      document.head.appendChild(script)
    }
    const click = (event: MouseEvent) => {
      const target = event.target instanceof Element ? event.target.closest('a[href]') : null
      if (!(target instanceof HTMLAnchorElement)) return
      if (target.pathname === window.location.pathname && target.hash) return
      const result = classifyLink(target.href, window.location.origin)
      if (!result) return
      const region = target.closest('[data-analytics-location]')?.getAttribute('data-analytics-location')
      const location = region || (target.closest('header') ? 'header' : target.closest('footer') ? 'footer' : 'content')
      track(result.name, { ...result.params, page_path: window.location.pathname, location })
    }
    document.addEventListener('click', click, true)
    return () => document.removeEventListener('click', click, true)
  }, [])

  useEffect(() => {
    const match = pathname.match(/^\/work\/([^/]+)\/?$/)
    if (match) track('case_study_view', { project_slug: match[1], page_path: pathname })
  }, [pathname])

  return null
}
