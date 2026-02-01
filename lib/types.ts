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
