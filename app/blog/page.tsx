import { Metadata } from 'next'
import { getBlogPosts } from '@/lib/content'
import { BlogCard } from '@/components/BlogCard'
import { Reveal } from '@/components/Reveal'

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Thoughts on design, technology, and building products.',
}

export default function BlogPage() {
  const posts = getBlogPosts()

  return (
    <div className="mx-auto max-w-5xl px-6 pt-24 pb-20">
      <header className="mb-16">
        <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
          Writing / Notes
        </div>
        <h1 className="mt-3 font-display font-normal text-[clamp(40px,5.5vw,72px)] leading-[1.03] tracking-[-0.02em]">
          Latest <em className="italic text-primary">notes</em>
        </h1>
        <p className="mt-5 max-w-[640px] text-[18px] leading-[1.55] text-muted-foreground">
          Thoughts on design, technology, AI, and building products — written slowly,
          edited carefully.
        </p>
      </header>

      <Reveal stagger className="flex flex-col gap-6">
        {posts.length > 0 ? (
          posts.map((post) => <BlogCard key={post.slug} post={post} />)
        ) : (
          <p className="text-muted-foreground py-8">No posts yet.</p>
        )}
      </Reveal>
    </div>
  )
}
