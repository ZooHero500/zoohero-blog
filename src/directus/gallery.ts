import { readItems } from '@directus/sdk'
import { directusClient } from './client'
import { Gallery } from '@/types/gallery'

export async function getGallery(): Promise<Gallery[]> {
  try {
    const response = await directusClient.request(
      readItems('Gallery', {
        filter: {
          status: {
            _eq: 'published'
          }
        },
        sort: ['-date_created']
      })
    )

    return response as unknown as Gallery[]
  } catch (error) {
    console.error('Error fetching projects:', error)
    return []
  }
}
