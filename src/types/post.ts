export interface Post {
  title: string
  content: string
  slug: string
  status: string
  date_created: string
  excerpt?: string
  categories?: string[]
}
