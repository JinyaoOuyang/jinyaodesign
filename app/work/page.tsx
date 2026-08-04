import { Metadata } from 'next'
import { getWorkPosts } from '@/lib/content'
import { WorkCard } from '@/components/WorkCard'
import { Reveal } from '@/components/Reveal'

export const metadata: Metadata = {
  title: 'Work',
  description: 'Selected case studies and design projects.',
}

export default function WorkPage() {
  const work = getWorkPosts()

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
          A selection of projects I&apos;ve worked on, spanning product design,
          UX research, AI-powered systems, and design engineering.
        </p>
      </header>

      <Reveal stagger className="grid gap-8 md:grid-cols-2">
        {work.map((item) => (
          <WorkCard key={item.slug} work={item} />
        ))}
      </Reveal>
    </div>
  )
}
