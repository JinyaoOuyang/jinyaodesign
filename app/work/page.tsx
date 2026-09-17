import { Metadata } from 'next'
import { getWorkByTier } from '@/lib/content'
import { WorkCard } from '@/components/WorkCard'
import { Reveal } from '@/components/Reveal'

export const metadata: Metadata = {
  title: 'Work',
  description:
    'Design engineering work — AI-native products designed, built, and shipped end to end.',
}

export default function WorkPage() {
  const primary = getWorkByTier('primary')
  const earlier = getWorkByTier('earlier')

  return (
    <div className="mx-auto max-w-5xl px-6 pt-24 pb-20">
      <header className="mb-16">
        <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
          Portfolio / Case studies
        </div>
        <h1 className="mt-3 font-display font-normal text-[clamp(40px,5.5vw,72px)] leading-[1.03] tracking-[-0.02em]">
          Selected <em className="italic text-primary">work</em>
        </h1>
        <p className="mt-5 max-w-[640px] text-[18px] leading-[1.55] text-muted-foreground">
          AI-native products, designed and built end to end — interaction, system,
          implementation, ship. Earlier product and UX work sits below.
        </p>
      </header>

      {primary.length > 0 && (
        <section>
          <h2 className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
            Selected Design Engineering Work
          </h2>
          <Reveal stagger className="mt-8 grid gap-8 md:grid-cols-2">
            {primary.map((item) => (
              <WorkCard key={item.slug} work={item} />
            ))}
          </Reveal>
        </section>
      )}

      {earlier.length > 0 && (
        <section className="mt-20 border-t border-border pt-16 md:mt-24">
          <h2 className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
            Earlier Product &amp; Design Work
          </h2>
          <p className="mt-3 max-w-[560px] text-[15px] leading-[1.6] text-muted-foreground">
            Product, UX, and strategy work — the experience I bring with me.
          </p>
          <Reveal stagger className="mt-8 grid gap-8 md:grid-cols-2">
            {earlier.map((item) => (
              <WorkCard key={item.slug} work={item} />
            ))}
          </Reveal>
        </section>
      )}
    </div>
  )
}
