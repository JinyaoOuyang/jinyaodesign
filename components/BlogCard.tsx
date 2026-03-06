import Image from 'next/image'
import Link from 'next/link'
import { BlogPost } from '@/lib/types'

interface BlogCardProps {
  post: BlogPost
}

export function BlogCard({ post }: BlogCardProps) {
  const formattedDate = new Date(post.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <Link href={`/blog/${post.slug}`} className="group block">
      <article className="card-surface rounded-lg overflow-hidden hover:-translate-y-[3px] flex flex-col md:flex-row md:h-52">
        {/* Cover image */}
        {post.coverImage && (
          <div className="relative aspect-[16/10] md:aspect-auto md:w-[40%] md:h-full shrink-0 bg-muted overflow-hidden">
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              loading="lazy"
              className="object-cover group-hover:scale-[1.03]" style={{ transition: 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)' }}
              sizes="(max-width: 768px) 100vw, 400px"
            />
          </div>
        )}

        {/* Content */}
        <div className="flex flex-col justify-center p-5 md:p-6 gap-3 md:flex-1 overflow-hidden">
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <time dateTime={post.date}>{formattedDate}</time>
            {post.readingTime && (
              <>
                <span>·</span>
                <span>{post.readingTime}</span>
              </>
            )}
          </div>
          <h3 className="text-xl font-medium group-hover:opacity-70" style={{ transition: 'opacity 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)' }}>
            {post.title}
          </h3>
          {post.description && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {post.description}
            </p>
          )}
          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-1">
              {post.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="text-xs text-muted-foreground tag-pill px-2 py-1 rounded"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </article>
    </Link>
  )
}
