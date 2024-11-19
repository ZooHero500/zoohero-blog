import { PostsList } from '@/components/Blog/PostsList'
import { Metadata } from 'next'

interface BlogPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export const metadata: Metadata = {
  title: 'Blog - Zoohero',
  description: 'Read our latest blog posts and articles.'
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const params = await searchParams

  const page = params.page ? parseInt(params.page as string, 10) : 1

  return (
    <div className="container max-w-4xl py-6 lg:py-10">
      <div className="flex flex-col items-start gap-4 md:flex-row md:justify-between md:gap-8">
        <h1 className="inline-block font-heading text-2xl tracking-tight lg:text-3xl">
          Blog
        </h1>
      </div>
      <hr className="my-8" />
      <PostsList page={page} />
    </div>
  )
}
