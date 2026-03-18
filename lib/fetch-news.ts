const NEWSAPI_BASE = 'https://newsapi.org/v2'

const CUBA_KEYWORDS = [
  'Cuba', 'cubano', 'cubana', 'cubanos', 'cubanas',
  'La Habana', 'Havana', 'Díaz-Canel', 'Diaz-Canel',
  'apagón Cuba', 'blackout Cuba', 'represión Cuba',
  'MLC Cuba', 'dólar Cuba', 'éxodo Cuba', 'exilio cubano',
  'presos políticos Cuba', 'MSI Cuba', 'LGBTQ Cuba',
  'Guantánamo', 'Santiago de Cuba', 'protesta Cuba',
  'manifestación Cuba', 'régimen cubano', 'gobierno cubano',
]

export interface RawArticle {
  title: string
  description: string | null
  content: string | null
  url: string
  urlToImage: string | null
  publishedAt: string
  source: { id: string | null; name: string }
}

export async function fetchCubaNews(apiKey: string): Promise<RawArticle[]> {
  const results: RawArticle[] = []
  const seen = new Set<string>()

  // Strategy 1: everything=cuba, sorted by publishedAt, last 3 days
  const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
    .toISOString()
    .slice(0, 10)

  const queries = [
    'Cuba noticias',
    'Cuba news',
    'Cuba represión OR apagón OR protesta',
  ]

  for (const q of queries) {
    const url = new URL(`${NEWSAPI_BASE}/everything`)
    url.searchParams.set('q', q)
    url.searchParams.set('language', 'es')
    url.searchParams.set('from', threeDaysAgo)
    url.searchParams.set('sortBy', 'publishedAt')
    url.searchParams.set('pageSize', '20')
    url.searchParams.set('apiKey', apiKey)

    try {
      const res = await fetch(url.toString())
      if (!res.ok) {
        console.error(`NewsAPI error for query "${q}": ${res.status} ${res.statusText}`)
        continue
      }
      const data = await res.json()
      for (const article of data.articles ?? []) {
        if (!seen.has(article.url) && article.title !== '[Removed]') {
          seen.add(article.url)
          results.push(article)
        }
      }
    } catch (err) {
      console.error(`Failed to fetch for query "${q}":`, err)
    }
  }

  // Strategy 2: top-headlines Cuba
  const topUrl = new URL(`${NEWSAPI_BASE}/top-headlines`)
  topUrl.searchParams.set('q', 'Cuba')
  topUrl.searchParams.set('language', 'es')
  topUrl.searchParams.set('pageSize', '20')
  topUrl.searchParams.set('apiKey', apiKey)

  try {
    const res = await fetch(topUrl.toString())
    if (res.ok) {
      const data = await res.json()
      for (const article of data.articles ?? []) {
        if (!seen.has(article.url) && article.title !== '[Removed]') {
          seen.add(article.url)
          results.push(article)
        }
      }
    }
  } catch (err) {
    console.error('Failed to fetch top-headlines:', err)
  }

  return filterByCubaRelevance(results)
}

function filterByCubaRelevance(articles: RawArticle[]): RawArticle[] {
  return articles.filter((a) => {
    const text = `${a.title} ${a.description ?? ''} ${a.content ?? ''}`.toLowerCase()
    return CUBA_KEYWORDS.some((kw) => text.includes(kw.toLowerCase()))
  })
}
