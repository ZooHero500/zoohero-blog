import Link from 'next/link'
import { getRecentPosts } from '@/directus/posts'
import { formatDate } from '@/lib/utils'

export async function RecentPosts() {
  let blogs = await getRecentPosts()

  return (
    <div className="space-y-2 mt-3">
      {blogs
        .map(post => (
          <Link
            key={post.slug}
            className="flex flex-col space-y-1"
            href={`/blog/${post.slug}`}
          >
            <div className="w-full flex items-center justify-between ">
              <p className="text-muted-foreground  text-sm">
                {formatDate(post.date_created, false)}
              </p>
              <p className="text-muted-foreground hover:text-primary tracking-tight transition-colors">
                {post.title}
              </p>
            </div>
          </Link>
        ))}
    </div>
  )
}