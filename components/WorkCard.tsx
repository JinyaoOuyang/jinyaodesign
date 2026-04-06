import Image from 'next/image'
import Link from 'next/link'
import { Work } from '@/lib/types'

interface WorkCardProps {
  work: Work
}

export function WorkCard({ work }: WorkCardProps) {
  return (
    <Link href={`/work/${work.slug}`} className="group block h-full">
      <article className="flex flex-col h-full card-surface rounded-lg">
        <div className="relative aspect-video overflow-hidden rounded-lg rounded-b-none bg-muted">
          <Image
            src={work.coverImage}
            alt={work.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
        <div className="flex flex-col flex-1 space-y-2 px-4 py-4">
          <h3 className="text-lg font-medium group-hover:opacity-70 transition-opacity">
            {work.title}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {work.description}
          </p>
          <div className="flex flex-wrap gap-2 mt-auto pt-2">
            {work.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-xs text-muted-foreground tag-pill px-2 py-1 rounded"
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
