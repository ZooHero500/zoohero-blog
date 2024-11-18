import { notFound } from 'next/navigation'
import { getPostBySlug, getAllPosts } from '@/directus/posts'
import { Markdown } from '@/components/MarkdownControl/Markdown'
import { Badge } from '@/components/shadcnui/badge'
import { formatDate } from '@/lib/utils'

import Link from 'next/link'
import { baseConfig } from '@/config/base'

interface BlogPostPageProps {
  params: {
    slug: string
  }
}

export async function generateStaticParams() {
  const posts = await getAllPosts()
  return posts.map((post) => ({
    slug: post.slug
  }))
}

export async function generateMetadata({ params }) {
  const { slug } = await params
  const post = await getPostBySlug(slug)

  if (!post) {
    return
  }

  const { title, excerpt: description } = post
  const ogImage = `${baseConfig.baseUrl}/og?title=${encodeURIComponent(title)}`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
      url: `${baseConfig.baseUrl}/blog/${post.slug}`,
      images: [
        {
          url: ogImage
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage]
    }
  }
}

export default async function Blog({ params }: BlogPostPageProps) {
  const { slug } = await params
  const post = await getPostBySlug(slug)

  if (!post) {
    notFound()
  }

  return (
    <article className="container relative mx-auto max-w-3xl py-8">
      <div className="space-y-4">
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold leading-tight tracking-tighter md:text-5xl lg:leading-[1.1]">
            {post.title}
          </h1>
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <time dateTime={post.date_created}>
              {formatDate(post.date_created, false)}
            </time>
            {post.status === 'draft' && (
              <Badge variant="outline" className="capitalize">
                {post.status}
              </Badge>
            )}
          </div>
        </div>
        {post.excerpt && (
          <div className="rounded-lg bg-muted/50 p-4">
            <span className="text-xs text-muted-foreground/50">摘要：</span>
            <p className="text-sm text-muted-foreground/90 leading-relaxed">
              {post.excerpt}
            </p>
          </div>
        )}
      </div>
      <div className="mt-8">
        <Markdown content={post.content || ''} />
      </div>
      {post.categories && post.categories.length > 0 && (
        <div className="mt-8 flex flex-wrap gap-2">
          {post.categories.map((category: string) => (
            <Link key={category} href={`/blog/category/${category}`}>
              <Badge
                variant="secondary"
                className="capitalize rounded-sm text-[11px] px-1.5 py-0 hover:bg-white/80 hover:text-[#333] transition-all duration-200"
              >
                {category}
              </Badge>
            </Link>
          ))}
        </div>
      )}
    </article>
  )
}
