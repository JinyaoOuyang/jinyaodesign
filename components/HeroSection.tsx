import Link from 'next/link'
import { HeroChat } from '@/components/HeroChat'
import { siteConfig } from '@/lib/config'

export function HeroSection() {
  return (
    <div className="font-sans grid gap-12 lg:grid-cols-2 lg:gap-16 lg:items-start">
      <div className="min-w-0">
        <div className="inline-flex items-center gap-2 rounded-full border-[0.5px] border-border bg-background px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.12em] text-muted-foreground">
          <span className="relative flex h-2 w-2 shrink-0">
            <span
              className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-40"
              aria-hidden
            />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-600" aria-hidden />
          </span>
          Open to opportunities
        </div>

        <h1 className="font-display mt-8 text-foreground">
          <span className="block text-[clamp(2.5rem,5vw,3.75rem)] font-normal leading-[1.08] tracking-[-0.02em]">
            Jinyao
          </span>
          <span className="mt-1 block text-[clamp(2.75rem,5.5vw,4.25rem)] font-normal italic leading-[1.05] tracking-[-0.02em]">
            Ouyang
          </span>
        </h1>

        <p className="mt-6 text-[15px] leading-relaxed text-muted-foreground md:text-base">
          Design Engineer · AI-native builder
        </p>

        <div className="mt-8 space-y-3">
          <p className="text-[clamp(1.25rem,2.2vw,1.75rem)] font-semibold leading-snug tracking-[-0.02em] text-primary">
            I design it. I build it. I ship it.
          </p>
        </div>

        <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
          <Link
            href="/work"
            className="inline-flex items-center justify-center gap-[10px] rounded-[8px] btn-primary px-[22px] py-[14px] text-sm font-medium"
          >
            <span>View Work</span>
            <span aria-hidden="true">→</span>
          </Link>
          <a
            href={siteConfig.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-foreground underline decoration-border underline-offset-[6px] transition-opacity hover:opacity-70"
          >
            LinkedIn →
          </a>
        </div>
      </div>

      <HeroChat />
    </div>
  )
}
