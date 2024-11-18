import Link from 'next/link'
import { Badge } from '@/components/shadcnui/badge'
import { formatDate } from '@/lib/utils'

import { getPosts, getPostByCategory } from '@/directus/posts'

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from '@/components/shadcnui/pagination'

interface BlogPostsProps {
  page?: number
  category?: string
}

export async function PostsList({ page = 1, category }: BlogPostsProps) {
  let posts, total
  if (category) {
    ;({ posts, total } = await getPostByCategory(category, page))
  } else {
    ;({ posts, total } = await getPosts(page))
  }

  const totalPages = Math.ceil(total / 10)

  return (
    <div className="space-y-8">
      <div className="space-y-6">
        {posts
          .sort((a, b) => {
            if (new Date(a.date_created) > new Date(b.date_created)) {
              return -1
            }
            return 1
          })
          .map((post) => (
            <article
              key={post.slug}
              className="group relative border-b pb-6 last:border-0"
            >
              <div className="flex flex-col space-y-1.5">
                <div className="space-y-1">
                  <h2 className="text-md font-medium tracking-tight">
                    <Link
                      href={`/blog/${post.slug}`}
                      className="text-foreground transition-all duration-200 hover:text-foreground/80 hover:-translate-x-0.5"
                    >
                      {post.title}
                    </Link>
                  </h2>
                  <div className="flex items-center gap-x-3 text-xs text-muted-foreground">
                    <time dateTime={post.date_created}>
                      {formatDate(post.date_created, false)}
                    </time>
                  </div>
                </div>
                {post.excerpt && (
                  <p className="text-sm text-muted-foreground/90 line-clamp-2">
                    {post.excerpt}
                  </p>
                )}
                {post.categories && post.categories.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {post.categories.map((category) => (
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
              </div>
            </article>
          ))}
      </div>

      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href={
                  page > 1
                    ? category
                      ? `/blog/${category}?page=${page - 1}`
                      : `/blog?page=${page - 1}`
                    : undefined
                }
                disabled={page <= 1}
              />
            </PaginationItem>
            {Array.from({ length: totalPages }).map((_, i) => {
              const pageNumber = i + 1
              const isCurrentPage = pageNumber === page

              // Show first page, last page, and pages around current page
              if (
                pageNumber === 1 ||
                pageNumber === totalPages ||
                (pageNumber >= page - 1 && pageNumber <= page + 1)
              ) {
                return (
                  <PaginationItem key={pageNumber}>
                    <PaginationLink
                      href={
                        category
                          ? `/blog/${category}?page=${pageNumber}`
                          : `/blog?page=${pageNumber}`
                      }
                      isActive={isCurrentPage}
                    >
                      {pageNumber}
                    </PaginationLink>
                  </PaginationItem>
                )
              }

              // Show ellipsis for gaps
              if (pageNumber === page - 2 || pageNumber === page + 2) {
                return (
                  <PaginationItem key={pageNumber}>
                    <PaginationEllipsis />
                  </PaginationItem>
                )
              }

              return null
            })}
            <PaginationItem>
              <PaginationNext
                href={
                  page < totalPages
                    ? category
                      ? `/blog/${category}?page=${page + 1}`
                      : `/blog?page=${page + 1}`
                    : undefined
                }
                disabled={page >= totalPages}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  )
}
