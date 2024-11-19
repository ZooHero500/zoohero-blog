import { readItems } from '@directus/sdk'
import { directusClient } from './client'
import { Project } from '@/types/project'

export async function getProjects(): Promise<Project[]> {
  try {
    const response = await directusClient.request(
      readItems('BlogProjects', {
        filter: {},
        sort: ['-date_created']
      })
    )

    return response as unknown as Project[]
  } catch (error) {
    console.error('Error fetching projects:', error)
    return []
  }
}
