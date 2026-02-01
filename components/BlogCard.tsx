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
      <article className="py-6 border-b border-border">
        <div className="space-y-2">
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <time dateTime={post.date}>{formattedDate}</time>
            {post.readingTime && (
              <>
                <span>·</span>
                <span>{post.readingTime}</span>
              </>
            )}
          </div>
          <h3 className="text-xl font-medium group-hover:opacity-70 transition-opacity">
            {post.title}
          </h3>
          <p className="text-muted-foreground">
            {post.description}
          </p>
        </div>
      </article>
    </Link>
  )
}
