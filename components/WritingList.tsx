import Link from 'next/link'
import type { BlogPost } from '@/lib/types'
import { Reveal } from './Reveal'

interface WritingListProps {
  posts: BlogPost[]
}

export function WritingList({ posts }: WritingListProps) {
  return (
    <Reveal stagger className="flex flex-col">
      {posts.map((post) => {
        const date = new Date(post.date).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
        })
        return (
          <Link key={post.slug} href={`/blog/${post.slug}`} className="writing-row">
            <span className="date">{date}</span>
            <span className="title">{post.title}</span>
            <span className="go">Read →</span>
          </Link>
        )
      })}
    </Reveal>
  )
}
