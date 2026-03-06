import Image from 'next/image'
import { siteConfig } from '@/lib/config'

interface AboutHeroProps {
  portraitSrc?: string
  portraitAlt?: string
}

export function AboutHero({
  portraitSrc = '/about-portrait.png',
  portraitAlt = `Portrait of ${siteConfig.name}`,
}: AboutHeroProps) {
  return (
    <section className="pt-24 md:pt-32 pb-0">
      <div className="mx-auto max-w-5xl px-6">
        <div className="relative aspect-[16/9] w-full overflow-hidden rounded-lg">
          <Image
            src={portraitSrc}
            alt={portraitAlt}
            fill
            priority
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 1024px"
          />
        </div>
      </div>
    </section>
  )
}
