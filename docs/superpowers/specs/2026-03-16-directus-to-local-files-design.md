# Directus to Local Files Migration

## Background

The project's Directus CMS (`directus.zoohero.me`) has been permanently shut down. All content (blog posts, gallery, projects) was served from Directus via `@directus/sdk`. The Vercel deployment fails because the data layer cannot reach the Directus server. No existing data needs to be migrated.

## Goal

Replace the Directus data layer with local Markdown + JSON files. Zero external content dependencies.

## Content Storage Structure

```
content/
├── blog/
│   └── example-post.md        # One .md file per blog post
├── gallery.json                # Gallery items array
└── projects.json               # Projects array
public/
├── gallery/                    # Gallery images
└── projects/                   # Project cover images
```

The existing `data/about.md` stays where it is -- `content/` is specifically for the 3 content types that were in Directus.

## Blog Post Format (.md with frontmatter)

```markdown
---
title: "Example Post"
slug: "example-post"
date: "2024-01-15"
excerpt: "A short summary"
categories: ["tech", "react"]
status: "published"
---

Markdown content here...
```

- Use `.md` (not `.mdx`) because the project renders markdown at runtime via `react-markdown`, not compiled MDX.
- `date` in frontmatter maps to `date_created` in the Post type for backward compatibility with all consumers.
- `content` is the markdown body below the frontmatter, not a frontmatter field.
- File name does not matter; `slug` comes from frontmatter.

## JSON Schemas

### gallery.json

```json
[
  {
    "id": "1",
    "title": "Photo Title",
    "image": "/gallery/photo1.jpg",
    "description": "Description text"
  }
]
```

### projects.json

```json
[
  {
    "id": "1",
    "title": "Project Name",
    "url": "https://example.com",
    "cover": "/projects/cover1.jpg",
    "description": "Project description"
  }
]
```

## Type Definition Updates

### Post (`src/types/post.ts`)

Remove Directus-specific fields. New interface:

```typescript
interface Post {
  title: string;
  content: string;
  slug: string;
  status: string;
  date_created: string;
  excerpt?: string;
  categories?: string[];
}
```

Removed: `id`, `user_created`, `user_updated`, `date_updated`.

### Gallery (`src/types/gallery.ts`)

```typescript
interface Gallery {
  id: string;
  title: string;
  image: string;       // local path, e.g. "/gallery/photo1.jpg"
  description: string;
}
```

Removed: `status`, `user_created`, `user_updated`, `date_created`, `date_updated`.

### Project (`src/types/project.ts`)

```typescript
interface Project {
  id: string;
  title: string;
  url: string;
  cover: string;       // local path, e.g. "/projects/cover1.jpg"
  description: string;
}
```

Removed: `status`, `user_created`, `user_updated`, `date_created`, `date_updated`.

## New Data Layer: `src/lib/content.ts`

New dependency: `gray-matter` for frontmatter parsing.

Replaces the entire `src/directus/` directory. Provides the same function signatures:

| Function | Behavior |
|----------|----------|
| `getPosts(page, limit)` | Read all `.md` files from `content/blog/`, parse frontmatter only, filter `status === 'published'`, sort by date desc, paginate. Return `{ posts: Post[], total: number }`. |
| `getPostByCategory(category, page, limit)` | Same as `getPosts` but filter by category. **Fix existing bug**: total must count only category-filtered posts, not all posts. |
| `getAllPosts()` | Read frontmatter only (no body parsing), return `{ slug }[]` for `generateStaticParams` and sitemap. Lightweight. |
| `getRecentPosts(limit)` | Like `getPosts` but returns just the array, no total. |
| `getPostBySlug(slug)` | Find the `.md` file whose frontmatter `slug` matches, parse frontmatter + body. Map body to `content` field, `date` to `date_created`. Return `Post`. |
| `getGallery()` | Read and parse `content/gallery.json`. Return `Gallery[]`. |
| `getProjects()` | Read and parse `content/projects.json`. Return `Project[]`. |

Path resolution: Use `path.join(process.cwd(), 'content', ...)` for Vercel compatibility.

## Files to Delete

| File/Directory | Reason |
|----------------|--------|
| `src/directus/` (entire directory) | Replaced by `src/lib/content.ts` |
| `src/app/api/image/route.ts` | No longer needed; images served from `public/` |

## Files to Modify

| File | Changes |
|------|---------|
| `src/app/blog/[slug]/page.tsx` | Change imports from `@/directus/posts` to `@/lib/content` |
| `src/app/blog/page.tsx` | Change imports |
| `src/app/blog/category/[category]/page.tsx` | Change imports |
| `src/components/Blog/PostsList.tsx` | Change imports. **Fix bug**: category pagination URLs from `/blog/${category}` to `/blog/category/${category}` |
| `src/components/RecentPosts.tsx` | Change imports |
| `src/app/gallery/page.tsx` | Change imports. Remove `revalidate = 3600` (static data now). |
| `src/app/projects/page.tsx` | Change imports. Remove `revalidate = 3600`. Change image `src` from `/api/image?id=${project.cover}` to `${project.cover}` directly. |
| `src/components/GalleryGrid.tsx` | Change image `src` from `/api/image?id=${image.image}` to `${image.image}` directly. |
| `src/app/rss/route.ts` | Change imports |
| `src/app/sitemap.ts` | Change imports |
| `src/components/MarkdownControl/MarkdownImage.tsx` | Remove the Directus URL → `/api/image` transform block entirely. |
| `src/types/post.ts` | Simplify interface (remove Directus fields) |
| `src/types/gallery.ts` | Simplify interface |
| `src/types/project.ts` | Simplify interface |
| `next.config.js` | Remove `directus.zoohero.me` from `remotePatterns` |
| `.env` | Remove `DIRECTUS_URL` and `DIRECTUS_TOKEN` |
| `package.json` | Remove `@directus/sdk`, add `gray-matter` |

## Cleanup

- Add `.env` to `.gitignore` (token was previously committed).
- Remove `DIRECTUS_URL` and `DIRECTUS_TOKEN` from `.env`, keep `NEXT_PUBLIC_BASE_URL`.
- Check if `src/config/base.ts` has an unused `cmsUrl` field -- remove if present.

## Sample Content

Create one sample blog post, empty gallery array, and empty projects array so the build succeeds and the site is testable:

```markdown
// content/blog/hello-world.md
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

```json
// content/gallery.json
[]

// content/projects.json
[]
```

## Verification

After implementation, `pnpm build` must complete without errors and produce:
- Static blog listing page
- Static blog post page for `hello-world`
- Static gallery page (empty)
- Static projects page (empty)
- Working RSS feed
- Working sitemap
- No references to `directus` anywhere in `src/`
