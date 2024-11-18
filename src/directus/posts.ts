// @ts-ignore
import { readItems } from '@directus/sdk'
import { directusClient } from './client'
import { Post } from '@/types/post'

// Helper function to fetch posts
export async function getPosts(
  page = 1,
  limit = 10
): Promise<{ posts: Post[]; total: number }> {
  try {
    const response = await directusClient.request(
      readItems('blog', {
        filter: {
          status: {
            _eq: 'published'
          }
        },
        sort: ['-date_created'],
        limit,
        offset: (page - 1) * limit
      })
    )

    const total = await directusClient.request(
      readItems('blog', {
        filter: {
          status: {
            _eq: 'published'
          }
        },
        aggregate: {
          count: 'id'
        }
      })
    )

    return {
      posts: response as unknown as Post[],
      // @ts-ignore
      total: total.count
    }
  } catch (error) {
    console.error('Error fetching posts:', error)
    return {
      posts: [],
      total: 0
    }
  }
}

/**
 *
 * @description Get posts by category
 * @param category
 * @param page
 * @param limit
 * @returns
 */
export async function getPostByCategory(
  category: string,
  page = 1,
  limit = 10
): Promise<{ posts: Post[]; total: number }> {
  try {
    const response = await directusClient.request(
      readItems('blog', {
        filter: {
          categories: {
            _contains: category
          },
          status: {
            _eq: 'published'
          }
        },
        sort: ['-date_created'],
        limit,
        offset: (page - 1) * limit
      })
    )

    const total = await directusClient.request(
      readItems('blog', {
        filter: {
          status: {
            _eq: 'published'
          }
        },
        aggregate: {
          count: 'id'
        }
      })
    )

    return {
      posts: response as unknown as Post[],
      // @ts-ignore
      total: total.count
    }
  } catch (error) {
    console.error('Error fetching posts:', error)
    return {
      posts: [],
      total: 0
    }
  }
}

export async function getAllPosts() {
  try {
    const response = await directusClient.request(
      readItems('blog', {
        fields: ['slug'],
        filter: {
          status: {
            _eq: 'published'
          }
        }
      })
    )
    return response || []
  } catch (error) {
    console.error('Error fetching posts:', error)
    return []
  }
}

/**
 * Get recent posts
 * @description Get recent posts
 * @param limit
 * @returns
 */
export async function getRecentPosts(limit = 3) {
  try {
    const response = await directusClient.request(
      readItems('blog', {
        filter: {
          status: {
            _eq: 'published'
          }
        },
        sort: ['-date_created'],
        limit
      })
    )

    return response || []
  } catch (error) {
    console.error('getRecentPosts: Error fetching posts:', error)
    return []
  }
}

export async function getPostBySlug(slug: string): Promise<Post> {
  try {
    const response = await directusClient.request(
      readItems('blog', {
        filter: {
          slug: {
            _eq: slug
          },
          status: {
            _eq: 'published'
          }
        },
        limit: 1
      })
    )

    return response[0] as unknown as Post
  } catch (error) {
    console.error('Error fetching post:', error)
    return null
  }
}
