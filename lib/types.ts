export type Category =
  | 'Cuba'
  | 'Apagones'
  | 'Represión'
  | 'Economía'
  | 'Protestas'
  | 'Exilio'
  | 'Opinión'
  | 'Denuncias'
  | 'General'

export interface NewsArticle {
  slug: string
  title: string
  description: string
  content: string
  url: string
  source: string
  sourceName: string
  publishedAt: string
  category: Category
  imageUrl: string | null
  featured: boolean
}

export interface NewsData {
  updatedAt: string
  articles: NewsArticle[]
}
