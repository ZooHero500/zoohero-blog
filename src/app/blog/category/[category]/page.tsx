import { Metadata } from 'next'
import { PostsList } from '@/components/Blog/PostsList'

interface BlogPageProps {
  params: {
    category: string
  }
  searchParams: { [key: string]: string | string[] | undefined }
}

export const metadata: Metadata = {
  title: 'Blog Category - Zoohero',
  description: 'Read our latest blog posts and articles in this category.'
}

export default async function BlogCategoryPage({
  searchParams,
  params
}: BlogPageProps) {
  const searchData = await searchParams
  const { category } = await params

  const page = searchData.page ? parseInt(searchData.page as string, 10) : 1

  return (
    <div className="container max-w-4xl py-6 lg:py-10">
      <div className="flex flex-col items-start gap-4 md:flex-row md:justify-between md:gap-8">
        <h1 className="inline-block font-heading text-xl tracking-tight lg:text-2xl">
          分类：{category}
        </h1>
      </div>
      <hr className="my-8" />
      <PostsList category={category} page={page} />
    </div>
  )
}
