/**
 * Work-page grouping. Independent of the homepage Selected Work roster,
 * which is derived from the clay (GLB) assets — see getFeaturedWork().
 */
export type WorkTier = 'primary' | 'earlier'

export interface WorkFrontmatter {
  title: string
  description: string
  date: string
  tags: string[]
  role: string
  timeline: string
  tools: string[]
  coverImage: string
  featuredOrder: number
  /** Defaults to 'earlier' when absent, so new work is never silently hidden. */
  tier?: WorkTier
  metrics?: string[]
}

export interface Work extends WorkFrontmatter {
  slug: string
  content: string
}

export interface BlogFrontmatter {
  title: string
  description: string
  date: string
  tags: string[]
  coverImage?: string
  readingTime?: string
}

export interface BlogPost extends BlogFrontmatter {
  slug: string
  content: string
}
