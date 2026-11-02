import { Metadata } from 'next'
import { siteConfig } from '@/lib/config'
import { getBlogPosts } from '@/lib/content'
import { BlogCard } from '@/components/BlogCard'
import { Reveal } from '@/components/Reveal'

export const metadata: Metadata = {
  alternates: { canonical: "/blog" },
  title: 'Blog',
  description: 'Notes by Jinyao Ouyang on product design, implementation, and AI-assisted workflows, connected to the projects behind them.',
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
          Notes from the <em className="italic text-primary">build</em>
        </h1>
        <p className="mt-5 max-w-[640px] text-[18px] leading-[1.55] text-muted-foreground">
          Product decisions, implementation details, and lessons from building with
          AI. Articles connect to the case studies behind the work.
        </p>
        <a href={siteConfig.medium} target="_blank" rel="noopener noreferrer" className="mt-6 inline-block text-sm font-medium underline underline-offset-4 hover:text-primary">
          Read on Medium <span aria-hidden="true">↗</span>
        </a>
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
