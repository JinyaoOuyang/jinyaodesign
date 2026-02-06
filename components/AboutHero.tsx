import Image from 'next/image'
import { siteConfig } from '@/lib/config'

interface AboutHeroProps {
  portraitSrc?: string
  portraitAlt?: string
}

export function AboutHero({
  portraitSrc = '/about-portrait.jpg',
  portraitAlt = `Portrait of ${siteConfig.name}`,
}: AboutHeroProps) {
  return (
    <section className="relative w-full overflow-hidden">
      {/* Image container with editorial aspect ratio */}
      <div className="relative aspect-[3/4] w-full sm:aspect-[4/5] md:aspect-[16/10] lg:aspect-[16/9]">
        <Image
          src={portraitSrc}
          alt={portraitAlt}
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />

        {/* Subtle gradient overlay for text legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-black/20" />

        {/* Meta text — top left */}
        <div className="absolute left-6 top-6 md:left-10 md:top-10">
          <p className="text-[11px] uppercase tracking-[0.2em] text-white/70">
            Portfolio
          </p>
        </div>

        {/* Meta text — top right */}
        <div className="absolute right-6 top-6 md:right-10 md:top-10">
          <p className="text-[11px] uppercase tracking-[0.2em] text-white/70">
            UX / Product Designer
          </p>
        </div>

        {/* Large overlay name */}
        <div className="absolute inset-x-0 bottom-8 flex items-end justify-center md:bottom-12">
          <h1
            className="text-center text-5xl font-semibold tracking-tight text-white/90 sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {siteConfig.name}
          </h1>
        </div>
      </div>
    </section>
  )
}
