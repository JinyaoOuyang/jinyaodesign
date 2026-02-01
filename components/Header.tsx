'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { siteConfig } from '@/lib/config'

export function Header() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-sm">
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <Link 
          href="/" 
          className="text-lg font-medium tracking-tight hover:opacity-70 transition-opacity"
        >
          {siteConfig.name}
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {siteConfig.navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`text-sm tracking-wide transition-opacity hover:opacity-70 ${
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
              className="text-sm tracking-wide text-muted-foreground transition-opacity hover:opacity-70"
            >
              {item.name.toUpperCase()}
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
