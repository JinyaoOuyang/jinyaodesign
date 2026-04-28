import { WorkCard } from '@/components/WorkCard'
import { Reveal } from '@/components/Reveal'
import type { Work } from '@/lib/types'

interface FeaturedWorkSectionProps {
  works: Work[]
}

export function FeaturedWorkSection({ works }: FeaturedWorkSectionProps) {
  return (
    <Reveal stagger className="grid gap-8 md:grid-cols-2">
      {works.map((work) => (
        <WorkCard key={work.slug} work={work} />
      ))}
    </Reveal>
  )
}
