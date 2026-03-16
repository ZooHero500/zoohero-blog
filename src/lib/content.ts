import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { Post } from '@/types/post'
import { Gallery } from '@/types/gallery'
import { Project } from '@/types/project'

const blogDir = path.join(process.cwd(), 'content', 'blog')

function getPublishedPosts(): Post[] {
  if (!fs.existsSync(blogDir)) return []

  const files = fs.readdirSync(blogDir).filter(f => f.endsWith('.md'))

  const posts = files.map(file => {
    const raw = fs.readFileSync(path.join(blogDir, file), 'utf-8')
    const { data, content } = matter(raw)
    return {
      title: data.title,
      slug: data.slug,
      status: data.status || 'published',
      date_created: data.date,
      excerpt: data.excerpt,
      categories: data.categories,
      content,
    } as Post
  })

  return posts
    .filter(p => p.status === 'published')
    .sort((a, b) => new Date(b.date_created).getTime() - new Date(a.date_created).getTime())
}

export async function getPosts(
  page = 1,
  limit = 10
): Promise<{ posts: Post[]; total: number }> {
  const all = getPublishedPosts()
  const offset = (page - 1) * limit
  return {
    posts: all.slice(offset, offset + limit),
    total: all.length,
  }
}

export async function getPostByCategory(
  category: string,
  page = 1,
  limit = 10
): Promise<{ posts: Post[]; total: number }> {
  const all = getPublishedPosts().filter(
    p => p.categories?.includes(category)
  )
  const offset = (page - 1) * limit
  return {
    posts: all.slice(offset, offset + limit),
    total: all.length,
  }
}

export async function getAllPosts(): Promise<{ slug: string }[]> {
  if (!fs.existsSync(blogDir)) return []

  const files = fs.readdirSync(blogDir).filter(f => f.endsWith('.md'))

  return files.map(file => {
    const raw = fs.readFileSync(path.join(blogDir, file), 'utf-8')
    const { data } = matter(raw)
    return { slug: data.slug }
  }).filter(p => p.slug)
}

export async function getRecentPosts(limit = 3): Promise<Post[]> {
  const all = getPublishedPosts()
  return all.slice(0, limit)
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const all = getPublishedPosts()
  return all.find(p => p.slug === slug) || null
}

export async function getGallery(): Promise<Gallery[]> {
  const filePath = path.join(process.cwd(), 'content', 'gallery.json')
  if (!fs.existsSync(filePath)) return []
  const raw = fs.readFileSync(filePath, 'utf-8')
  return JSON.parse(raw) as Gallery[]
}

export async function getProjects(): Promise<Project[]> {
  const filePath = path.join(process.cwd(), 'content', 'projects.json')
  if (!fs.existsSync(filePath)) return []
  const raw = fs.readFileSync(filePath, 'utf-8')
  return JSON.parse(raw) as Project[]
}
