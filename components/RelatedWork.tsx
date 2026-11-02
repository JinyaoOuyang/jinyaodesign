import Link from 'next/link'
import type { Work } from '@/lib/types'

export function RelatedWork({ works }: { works: Work[] }) {
  if (works.length === 0) return null

  return (
    <aside data-analytics-location="related_work" aria-labelledby="related-work-title" className="mt-14 rounded-xl border border-border p-6 md:p-8">
      <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
        From the article to the product
      </p>
      <h2 id="related-work-title" className="mt-3 font-display text-3xl font-normal">
        See the work behind the story
      </h2>
      <div className="mt-5 divide-y divide-border">
        {works.map((work) => (
          <Link key={work.slug} href={`/work/${work.slug}`} className="group block py-4 first:pt-0 last:pb-0">
            <h3 className="text-lg font-medium group-hover:text-primary">
              {work.title} <span aria-hidden="true">→</span>
            </h3>
            {work.status && <p className="mt-1 text-xs text-muted-foreground">{work.status}</p>}
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{work.description}</p>
            <span className="mt-3 inline-block text-sm underline underline-offset-4">View case study</span>
          </Link>
        ))}
      </div>
    </aside>
  )
}
