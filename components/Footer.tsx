import Link from 'next/link'
import { siteConfig } from '@/lib/config'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-border mt-10">
      <div className="mx-auto max-w-5xl px-8 py-10 pb-12">
        <div className="flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
          <div className="space-y-3">
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
              Let&apos;s connect
            </p>
            <a
              href={`mailto:${siteConfig.email}`}
              className="font-display text-2xl md:text-3xl leading-none text-foreground hover:text-primary transition-colors"
            >
              {siteConfig.email}
            </a>
          </div>

          <div className="flex items-center gap-7">
            <a
              href={siteConfig.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground hover:text-foreground transition-colors"
            >
              LinkedIn
            </a>
            {siteConfig.medium && (
              <a
                href={siteConfig.medium}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground hover:text-foreground transition-colors"
              >
                Medium
              </a>
            )}
            <a
              href={siteConfig.resumePath}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground hover:text-foreground transition-colors"
            >
              Resume
            </a>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-border flex items-center justify-between">
          <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
            © {currentYear} {siteConfig.name}
          </p>
          <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
            Designed &amp; built with care
          </p>
        </div>
      </div>
    </footer>
  )
}
