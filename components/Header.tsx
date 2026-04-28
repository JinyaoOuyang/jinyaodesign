'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import { siteConfig } from '@/lib/config'

export function Header() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isAtTop, setIsAtTop] = useState(true)

  useEffect(() => {
    const onScroll = () => setIsAtTop(window.scrollY <= 10)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const isHome = pathname === '/'

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-[background-color,backdrop-filter,box-shadow,border-color] duration-300 ease-in-out ${
        isHome && isAtTop
          ? 'bg-transparent border-b border-transparent'
          : 'bg-background/80 backdrop-blur-sm border-b border-border'
      }`}
    >
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-6 py-[18px]">
        <Link
          href="/"
          aria-label={siteConfig.name}
          className="hover:opacity-70 transition-opacity"
        >
          {siteConfig.logoPath ? (
            <Image
              src={siteConfig.logoPath}
              alt={siteConfig.name}
              width={160}
              height={40}
              priority
              style={{ height: '32px', width: 'auto' }}
            />
          ) : (
            <span
              className="font-display text-[22px] leading-none tracking-tight text-foreground"
            >
              {siteConfig.name.split(/(\s+)/).map((part, i, arr) => {
                // italicize the last non-space segment for the "accent" treatment
                const isLast = i === arr.length - 1 || (i === arr.length - 2 && /^\s+$/.test(arr[arr.length - 1]))
                if (/^\s+$/.test(part)) return part
                return isLast ? (
                  <em key={i} className="italic text-primary not-italic-off" style={{ fontStyle: 'italic' }}>{part}</em>
                ) : (
                  <span key={i}>{part}</span>
                )
              })}
            </span>
          )}
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-9">
          {siteConfig.navigation.map((item) => {
            const active = pathname === item.href || pathname.startsWith(item.href + '/')
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`font-mono text-[12px] font-medium tracking-[0.12em] uppercase relative transition-colors ${
                  active ? 'text-foreground nav-active' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {item.name}
              </Link>
            )
          })}
          {siteConfig.externalLinks.map((item) => (
            <a
              key={item.name}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-[12px] font-medium tracking-[0.12em] uppercase text-muted-foreground hover:text-foreground transition-colors"
            >
              {item.name}
            </a>
          ))}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 -mr-2"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <svg
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {mobileMenuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-background">
          <div className="px-6 py-4 space-y-4">
            {siteConfig.navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block text-sm tracking-wide ${
                  pathname === item.href || pathname.startsWith(item.href + '/')
                    ? 'text-foreground'
                    : 'text-muted-foreground'
                }`}
              >
                {item.name.toUpperCase()}
              </Link>
            ))}
            {siteConfig.externalLinks.map((item) => (
              <a
                key={item.name}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-sm tracking-wide text-muted-foreground"
              >
                {item.name.toUpperCase()}
              </a>
            ))}
          </div>
        </div>
      )}
    </header>
  )
}
