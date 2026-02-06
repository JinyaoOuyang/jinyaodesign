'use client'

import Link from 'next/link'
import { WorkCard } from '@/components/WorkCard'
import { ScrollRevealColor } from '@/components/ScrollRevealColor'
import type { Work } from '@/lib/types'

interface FeaturedWorkSectionProps {
  works: Work[]
}

export function FeaturedWorkSection({ works }: FeaturedWorkSectionProps) {
  return (
    <section className="py-16">
      <div className="flex items-center justify-between mb-12">
        <h2 className="text-2xl font-semibold">Featured Work</h2>
        <Link
          href="/work"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          View all →
        </Link>
      </div>
      <div className="grid gap-8 md:grid-cols-2">
        {works.map((work, index) => (
          <ScrollRevealColor key={work.slug}>
            <WorkCard work={work} />
          </ScrollRevealColor>
        ))}
      </div>
    </section>
  )
}
