import Image from 'next/image'
import Link from 'next/link'
import { Work } from '@/lib/types'

interface WorkCardProps {
  work: Work
}

export function WorkCard({ work }: WorkCardProps) {
  return (
    <Link href={`/work/${work.slug}`} className="group block">
      <article className="space-y-4">
        <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-muted">
          <Image
            src={work.coverImage}
            alt={work.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-medium group-hover:opacity-70 transition-opacity">
            {work.title}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {work.description}
          </p>
          <div className="flex flex-wrap gap-2">
            {work.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </article>
    </Link>
  )
}
