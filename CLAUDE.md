# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Dev Commands

```bash
pnpm dev          # Start dev server (uses --turbo)
pnpm build        # Production build
pnpm start        # Start production server
```

No test framework is configured.

## Architecture

Next.js 15 App Router personal blog/portfolio. Content is stored as local files (no external CMS).

### Content System

Blog posts, gallery, and projects data all live in `content/`:

- `content/blog/*.md` — Markdown files with YAML frontmatter (title, slug, date, excerpt, categories, status)
- `content/gallery.json` — Gallery image entries (id, title, image path, description)
- `content/projects.json` — Project entries (id, title, url, cover path, description)

`src/lib/content.ts` is the data layer — reads these files with `gray-matter` and exposes async functions (`getPosts`, `getPostBySlug`, `getAllPosts`, `getRecentPosts`, `getPostByCategory`, `getGallery`, `getProjects`). All page/component data fetching goes through this single file.

Images for gallery and projects go in `public/gallery/` and `public/projects/`.

### Markdown Rendering

Blog content renders at runtime via `react-markdown` (not compiled MDX). Custom component overrides live in `src/components/MarkdownControl/`:
- `Markdown.tsx` — main renderer with remark-gfm, rehype-slug, rehype-raw plugins
- `CodeBlock.tsx` — syntax highlighting with react-syntax-highlighter (Dracula theme)
- `MarkdownImage.tsx` — image display with lightbox support
- `ImageViewer.tsx` — fullscreen image modal

### UI Components

Uses shadcn/ui components in `src/components/shadcnui/`. Styling uses Tailwind CSS with CSS variable-based theming (HSL colors defined in `src/styles/globals.css`). Dark mode is default, toggled via `next-themes` with `darkMode: 'selector'`.

### Key Path Alias

`@/*` maps to `src/*` (configured in tsconfig.json).

### Site Config

- `src/config/base.ts` — baseUrl, title, description, social links, theme
- `src/config/navbar.ts` — navigation items
- `src/config/about.ts` — homepage data (tech stacks, tools, hobbies)

### SEO Routes

- `/og` — dynamic OG image generation
- `/rss` — RSS 2.0 XML feed
- `/sitemap.xml` and `/robots.txt` — auto-generated

### Comments

Uses Giscus (GitHub Discussions-based) configured in `src/components/Comments.tsx`, repo: `ZooHero500/zoohero-blog`.

## Conventions

- React 18 with Next.js 15 App Router (server components by default, `'use client'` only when needed)
- TypeScript with strict mode off
- Shadcn UI + Tailwind CSS + lucide-react icons
- Package manager: pnpm
