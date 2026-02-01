import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { Work, WorkFrontmatter, BlogPost, BlogFrontmatter } from './types'

const workDirectory = path.join(process.cwd(), 'content/work')
const blogDirectory = path.join(process.cwd(), 'content/blog')

export function getWorkPosts(): Work[] {
  if (!fs.existsSync(workDirectory)) return []
  
  const fileNames = fs.readdirSync(workDirectory)
  const posts = fileNames
    .filter((name) => name.endsWith('.mdx'))
    .map((fileName) => {
      const slug = fileName.replace(/\.mdx$/, '')
      const fullPath = path.join(workDirectory, fileName)
      const fileContents = fs.readFileSync(fullPath, 'utf8')
      const { data, content } = matter(fileContents)

      return {
        slug,
        content,
        ...(data as WorkFrontmatter),
      }
    })
    .sort((a, b) => a.featuredOrder - b.featuredOrder)

  return posts
}

export function getWorkBySlug(slug: string): Work | null {
  const fullPath = path.join(workDirectory, `${slug}.mdx`)
  if (!fs.existsSync(fullPath)) return null

  const fileContents = fs.readFileSync(fullPath, 'utf8')
  const { data, content } = matter(fileContents)

  return {
    slug,
    content,
    ...(data as WorkFrontmatter),
  }
}

export function getFeaturedWork(): Work[] {
  return getWorkPosts().slice(0, 4)
}

export function getAdjacentWork(currentSlug: string): { prev: Work | null; next: Work | null } {
  const posts = getWorkPosts()
  const currentIndex = posts.findIndex((p) => p.slug === currentSlug)

  if (currentIndex === -1) return { prev: null, next: null }

  const prev = currentIndex > 0 ? posts[currentIndex - 1] : posts[posts.length - 1]
  const next = currentIndex < posts.length - 1 ? posts[currentIndex + 1] : posts[0]

  return { prev, next }
}

export function getBlogPosts(): BlogPost[] {
  if (!fs.existsSync(blogDirectory)) return []

  const fileNames = fs.readdirSync(blogDirectory)
  const posts = fileNames
    .filter((name) => name.endsWith('.mdx'))
    .map((fileName) => {
      const slug = fileName.replace(/\.mdx$/, '')
      const fullPath = path.join(blogDirectory, fileName)
      const fileContents = fs.readFileSync(fullPath, 'utf8')
      const { data, content } = matter(fileContents)

      return {
        slug,
        content,
        ...(data as BlogFrontmatter),
      }
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  return posts
}

export function getBlogBySlug(slug: string): BlogPost | null {
  const fullPath = path.join(blogDirectory, `${slug}.mdx`)
  if (!fs.existsSync(fullPath)) return null

  const fileContents = fs.readFileSync(fullPath, 'utf8')
  const { data, content } = matter(fileContents)

  return {
    slug,
    content,
    ...(data as BlogFrontmatter),
  }
}

export function getLatestBlogPosts(count: number = 2): BlogPost[] {
  return getBlogPosts().slice(0, count)
}
