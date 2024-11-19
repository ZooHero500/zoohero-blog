import { baseConfig } from '@/config/base'
import { getPosts } from '@/directus/posts'

export async function GET() {
  const { posts } = await getPosts(1, 50) // 获取最新的50篇文章用于RSS

  const itemsXml = posts
    .sort((a, b) => {
      if (new Date(a.date_created) > new Date(b.date_created)) {
        return -1
      }
      return 1
    })
    .map(post => {
      const title = post.title.replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;')

      const description = (post.excerpt || '').replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;')

      return `
        <item>
          <title>${title}</title>
          <link>${baseConfig.baseUrl}/blog/${post.slug}</link>
          <guid>${baseConfig.baseUrl}/blog/${post.slug}</guid>
          <description>${description}</description>
          <pubDate>${new Date(post.date_created).toUTCString()}</pubDate>
          ${post.categories ? `<category>${post.categories}</category>` : ''}
        </item>
      `.trim()
    })
    .join('\n')

  const rssFeed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${baseConfig.title}</title>
    <link>${baseConfig.baseUrl}</link>
    <description>${baseConfig.description}</description>
    <language>en-us</language>
    <atom:link href="${baseConfig.baseUrl}/rss" rel="self" type="application/rss+xml"/>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    ${itemsXml}
  </channel>
</rss>`

  return new Response(rssFeed, {
    headers: {
      'Content-Type': 'application/xml;charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  })
}
