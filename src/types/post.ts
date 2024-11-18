

export interface Post {
  id: string;
  title: string;
  content: string;
  slug: string;
  status: string;
  user_created: string;
  user_updated: string;
  date_created: string;
  date_updated: string;
  excerpt?: string;
  categories?: string[];
}