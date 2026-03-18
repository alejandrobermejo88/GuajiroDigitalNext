import type { RawArticle } from './fetch-news'
import type { Category, NewsArticle } from './types'

const CATEGORY_RULES: Array<{ category: Category; keywords: string[] }> = [
  {
    category: 'Apagones',
    keywords: ['apagón', 'apagones', 'blackout', 'electricidad', 'energía eléctrica', 'luz', 'sistema energético', 'termoeléctr'],
  },
  {
    category: 'Represión',
    keywords: ['represión', 'preso político', 'presos políticos', 'detenido', 'arrestado', 'encarcelado', 'juicio', 'condena', 'policía', 'Seguridad del Estado', 'G2', 'violación derechos'],
  },
  {
    category: 'Economía',
    keywords: ['economía', 'MLC', 'dólar', 'inflación', 'escasez', 'desabastecimiento', 'salario', 'precio', 'mercado', 'divisas', 'peso cubano'],
  },
  {
    category: 'Protestas',
    keywords: ['protesta', 'manifestación', 'marcha', '11J', 'levantamiento', 'huelga', 'insurrección'],
  },
  {
    category: 'Exilio',
    keywords: ['exilio', 'emigración', 'migrante', 'refugiado', 'balsero', 'éxodo', 'diáspora', 'cubano en el exterior'],
  },
  {
    category: 'Opinión',
    keywords: ['opinión', 'análisis', 'columna', 'editorial', 'perspectiva', 'punto de vista'],
  },
]

function categorize(article: RawArticle): Category {
  const text = `${article.title} ${article.description ?? ''} ${article.content ?? ''}`.toLowerCase()

  for (const rule of CATEGORY_RULES) {
    if (rule.keywords.some((kw) => text.includes(kw.toLowerCase()))) {
      return rule.category
    }
  }

  return 'Cuba'
}

function slugify(title: string, publishedAt: string): string {
  const date = publishedAt.slice(0, 10)
  const slug = title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .slice(0, 60)
  return `${date}-${slug}`
}

function deduplicateByTitle(articles: RawArticle[]): RawArticle[] {
  const seen = new Map<string, RawArticle>()
  for (const article of articles) {
    const key = normalizeTitle(article.title)
    if (!seen.has(key)) {
      seen.set(key, article)
    }
  }
  return Array.from(seen.values())
}

function normalizeTitle(title: string): string {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/g, '')
    .trim()
    .replace(/\s+/g, ' ')
    .slice(0, 60)
}

function cleanContent(raw: string | null): string {
  if (!raw) return ''
  // NewsAPI truncates content with "[+N chars]" — strip that
  return raw.replace(/\[\+\d+ chars\]$/, '').trim()
}

export function processArticles(rawArticles: RawArticle[]): NewsArticle[] {
  const deduped = deduplicateByTitle(rawArticles)

  const processed: NewsArticle[] = deduped
    .filter((a) => a.title && a.description)
    .map((a, index) => ({
      slug: slugify(a.title, a.publishedAt),
      title: a.title,
      description: a.description ?? '',
      content: cleanContent(a.content),
      url: a.url,
      source: a.source.id ?? a.source.name.toLowerCase().replace(/\s+/g, '-'),
      sourceName: a.source.name,
      publishedAt: a.publishedAt,
      category: categorize(a),
      imageUrl: a.urlToImage,
      featured: index === 0,
    }))

  // Sort newest first
  processed.sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  )

  // Mark the top article as featured
  if (processed.length > 0) {
    processed[0].featured = true
  }

  return processed
}
