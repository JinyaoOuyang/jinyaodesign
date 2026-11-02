/**
 * Work-page grouping. Homepage selection uses homepageFeatured independently.
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
  /** Editorial homepage selection, independent of available 3D assets. */
  homepageFeatured?: boolean
  status?: string
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
  relatedWork?: string[]
}

export interface BlogPost extends BlogFrontmatter {
  slug: string
  content: string
}
