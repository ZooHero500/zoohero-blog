# Directus to Local Files Migration Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the dead Directus CMS backend with local Markdown + JSON files so the site builds and deploys without external dependencies.

**Architecture:** All blog content becomes `.md` files with YAML frontmatter in `content/blog/`. Gallery and projects become JSON files in `content/`. A new `src/lib/content.ts` reads these files using `fs` + `gray-matter` and exposes the same function signatures the rest of the codebase already calls.

**Tech Stack:** gray-matter (frontmatter parsing), Node.js fs/path (file reading)

**Spec:** `docs/superpowers/specs/2026-03-16-directus-to-local-files-design.md`

---

## Task 1: Dependencies

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Add gray-matter, remove @directus/sdk**

```bash
cd /Users/wuzhiqiang/Documents/WWW/MySelf/zoohero && pnpm remove @directus/sdk && pnpm add gray-matter
```

- [ ] **Step 2: Commit**

```bash
git add package.json pnpm-lock.yaml
git commit -m "chore: replace @directus/sdk with gray-matter"
```

---

## Task 2: Create content directory and sample data

**Files:**
- Create: `content/blog/hello-world.md`
- Create: `content/gallery.json`
- Create: `content/projects.json`

- [ ] **Step 1: Create sample blog post**

Create `content/blog/hello-world.md`:

```markdown
---
title: "Hello World"
slug: "hello-world"
date: "2026-03-16"
excerpt: "Welcome to ZooHero"
categories: ["general"]
status: "published"
---

Welcome to ZooHero!
```

- [ ] **Step 2: Create empty gallery and projects JSON**

Create `content/gallery.json`:

```json
[]
```

Create `content/projects.json`:

```json
[]
```

- [ ] **Step 3: Commit**

```bash
git add content/
git commit -m "chore: add content directory with sample data"
```

---

## Task 3: Update type definitions

**Files:**
- Modify: `src/types/post.ts`
- Modify: `src/types/gallery.ts`
- Modify: `src/types/project.ts`

- [ ] **Step 1: Simplify Post type**

Replace `src/types/post.ts` with:

```typescript
export interface Post {
  title: string
  content: string
  slug: string
  status: string
  date_created: string
  excerpt?: string
  categories?: string[]
}
```

- [ ] **Step 2: Simplify Gallery type**

Replace `src/types/gallery.ts` with:

```typescript
export interface Gallery {
  id: string
  title: string
  image: string
  description: string
}
```

- [ ] **Step 3: Simplify Project type**

Replace `src/types/project.ts` with:

```typescript
export interface Project {
  id: string
  title: string
  url: string
  cover: string
  description: string
}
```

- [ ] **Step 4: Commit**

```bash
git add src/types/
git commit -m "refactor: simplify types, remove Directus-specific fields"
```

---

## Task 4: Create new data layer `src/lib/content.ts`

**Files:**
- Create: `src/lib/content.ts`

This is the core of the migration. It replaces the entire `src/directus/` directory.

- [ ] **Step 1: Write content.ts**

Create `src/lib/content.ts`:

```typescript
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
    total: all.length, // Fixed: counts only category-filtered posts
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
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/content.ts
git commit -m "feat: add local file-based content layer"
```

---

## Task 5: Update all consumers — change imports

Every file that imports from `@/directus/*` must be updated to import from `@/lib/content`.

**Files:**
- Modify: `src/components/Blog/PostsList.tsx` (import + bug fix)
- Modify: `src/components/RecentPosts.tsx` (import)
- Modify: `src/app/blog/[slug]/page.tsx` (import)
- Modify: `src/app/rss/route.ts` (import)
- Modify: `src/app/sitemap.ts` (import)
- Modify: `src/app/gallery/page.tsx` (import + remove revalidate)
- Modify: `src/app/projects/page.tsx` (import + remove revalidate + fix image src)
- Modify: `src/components/GalleryGrid.tsx` (fix image src)

- [ ] **Step 1: Update PostsList.tsx**

Change line 5:
```
- import { getPosts, getPostByCategory } from '@/directus/posts'
+ import { getPosts, getPostByCategory } from '@/lib/content'
```

Fix pagination bug — change 3 occurrences of `` `/blog/${category}` `` to `` `/blog/category/${category}` ``:

Line 95: `/blog/${category}?page=${page - 1}` → `/blog/category/${category}?page=${page - 1}`
Line 117: `/blog/${category}?page=${pageNumber}` → `/blog/category/${category}?page=${pageNumber}`
Line 144: `/blog/${category}?page=${page + 1}` → `/blog/category/${category}?page=${page + 1}`

- [ ] **Step 2: Update RecentPosts.tsx**

Change line 2:
```
- import { getRecentPosts } from '@/directus/posts'
+ import { getRecentPosts } from '@/lib/content'
```

- [ ] **Step 3: Update blog/[slug]/page.tsx**

Change line 2:
```
- import { getPostBySlug, getAllPosts } from '@/directus/posts'
+ import { getPostBySlug, getAllPosts } from '@/lib/content'
```

- [ ] **Step 4: Update rss/route.ts**

Change line 2:
```
- import { getPosts } from '@/directus/posts'
+ import { getPosts } from '@/lib/content'
```

- [ ] **Step 5: Update sitemap.ts**

Change line 2:
```
- import { getAllPosts } from '@/directus/posts'
+ import { getAllPosts } from '@/lib/content'
```

- [ ] **Step 6: Update gallery/page.tsx**

Change line 1 and remove revalidate:
```
- import { getGallery } from '@/directus/gallery'
+ import { getGallery } from '@/lib/content'
```

Remove: `export const revalidate = 3600`

- [ ] **Step 7: Update projects/page.tsx**

Change line 1 and remove revalidate:
```
- import { getProjects } from '@/directus/projects'
+ import { getProjects } from '@/lib/content'
```

Remove: `export const revalidate = 3600`

Change image src on line 43:
```
- src={`/api/image?id=${project.cover}`}
+ src={project.cover}
```

- [ ] **Step 8: Update GalleryGrid.tsx**

Change 2 occurrences of `/api/image?id=${image.image}` to `${image.image}`:

Line 23: `const imageUrl = `/api/image?id=${image.image}`` → `const imageUrl = image.image`
Line 28: `src={`/api/image?id=${image.image}`}` → `src={image.image}`

- [ ] **Step 9: Commit**

```bash
git add src/components/Blog/PostsList.tsx src/components/RecentPosts.tsx src/app/blog/\[slug\]/page.tsx src/app/rss/route.ts src/app/sitemap.ts src/app/gallery/page.tsx src/app/projects/page.tsx src/components/GalleryGrid.tsx
git commit -m "refactor: update all imports from directus to local content"
```

---

## Task 6: Update MarkdownImage and cleanup

**Files:**
- Modify: `src/components/MarkdownControl/MarkdownImage.tsx`
- Modify: `next.config.js`
- Modify: `src/config/base.ts`
- Modify: `.env`
- Delete: `src/directus/` (entire directory)
- Delete: `src/app/api/image/route.ts`

- [ ] **Step 1: Update MarkdownImage.tsx**

Remove the Directus URL transform block (lines 16-19). The component becomes:

```typescript
'use client'

import Image from 'next/image'
import { cn } from '@/lib/utils'
import { useMarkdown } from './MarkdownContext'

interface MarkdownImageProps {
  src: string
  alt: string
}

export function MarkdownImage({ src, alt }: MarkdownImageProps) {
  const { openViewer } = useMarkdown()

  return (
    <span className='flex flex-col items-center my-8'>
      <button
        onClick={() => openViewer(src, alt || '')}
        className="relative block w-full overflow-hidden rounded-sm"
      >
        <Image
          src={src}
          alt={alt || ''}
          width={600}
          height={300}
          className={cn(
            'rounded-sm object-cover transition-all hover:scale-105',
            'aspect-[2/1]'
          )}
        />
      </button>
      {alt && (
        <span className="mt-2 text-center text-xs text-muted-foreground/80">
          {alt}
        </span>
      )}
    </span>
  )
}
```

- [ ] **Step 2: Clean next.config.js**

Replace with (remove remotePatterns entirely since no remote images):

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {}

module.exports = nextConfig
```

- [ ] **Step 3: Remove cmsUrl from base.ts**

Remove `cmsUrl?: string` from the `BaseConfig` interface (line 11).

- [ ] **Step 4: Clean .env**

Remove `DIRECTUS_URL` and `DIRECTUS_TOKEN` lines. Keep only:

```
NEXT_PUBLIC_BASE_URL="https://zoohero.me"
```

- [ ] **Step 5: Delete src/directus/ directory**

```bash
rm -rf /Users/wuzhiqiang/Documents/WWW/MySelf/zoohero/src/directus
```

- [ ] **Step 6: Delete src/app/api/image/route.ts**

```bash
rm /Users/wuzhiqiang/Documents/WWW/MySelf/zoohero/src/app/api/image/route.ts
```

If `src/app/api/` is now empty, delete the directory too.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "refactor: remove Directus, clean up config and dead code"
```

---

## Task 7: Build verification

- [ ] **Step 1: Run build**

```bash
cd /Users/wuzhiqiang/Documents/WWW/MySelf/zoohero && pnpm build
```

Expected: Build succeeds with no errors. Output should show:
- Static pages generated for `/`, `/blog`, `/blog/hello-world`, `/gallery`, `/projects`
- No references to `directus.zoohero.me`

- [ ] **Step 2: Verify no directus references remain**

```bash
grep -r "directus" src/ --include="*.ts" --include="*.tsx" --include="*.js"
```

Expected: No output (zero matches).

- [ ] **Step 3: Final commit if any fixes needed**

If build revealed issues, fix and commit.
