import { Metadata } from 'next'
import { getFeaturedWork } from '@/lib/content'
import { WorkCard } from '@/components/WorkCard'

export const metadata: Metadata = {
  title: 'Work',
  description: 'Selected case studies and design projects.',
}

export default function WorkPage() {
  const work = getFeaturedWork()

  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <header className="mb-12">
        <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">Work</h1>
        <p className="mt-4 text-muted-foreground max-w-2xl">
          A selection of projects I&apos;ve worked on, spanning product design, 
          UX research, and design systems.
        </p>
      </header>

      <div className="grid gap-8 md:grid-cols-2">
        {work.map((item) => (
          <WorkCard key={item.slug} work={item} />
        ))}
      </div>
    </div>
  )
}
