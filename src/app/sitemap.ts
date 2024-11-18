// import { getBlogPosts } from '@/utils'
import { baseConfig } from '@/config/base'

const baseUrl = baseConfig.baseUrl

export default async function sitemap() {
  // let blogs = getBlogPosts().map((post) => ({
  //   url: `${baseUrl}/blog/${post.slug}`,
  //   lastModified: post.metadata.publishedAt,
  // }))

  // let routes = ['', '/blog'].map((route) => ({
  //   url: `${baseUrl}${route}`,
  //   lastModified: new Date().toISOString().split('T')[0],
  // }))

  // return [...routes, ...blogs]
  // return [...routes]
  return []
}
