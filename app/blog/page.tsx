import { Metadata } from 'next'
import { getBlogPosts } from '@/lib/content'
import { BlogCard } from '@/components/BlogCard'

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Thoughts on design, technology, and building products.',
}

export default function BlogPage() {
  const posts = getBlogPosts()

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <header className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">Blog</h1>
        <p className="mt-4 text-muted-foreground">
          Thoughts on design, technology, and building products.
        </p>
      </header>

      <div>
        {posts.length > 0 ? (
          posts.map((post) => <BlogCard key={post.slug} post={post} />)
        ) : (
          <p className="text-muted-foreground py-8">No posts yet.</p>
        )}
      </div>
    </div>
  )
}
