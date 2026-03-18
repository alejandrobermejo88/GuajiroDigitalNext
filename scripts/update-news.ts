/**
 * update-news.ts
 * Fetches latest Cuba news from NewsAPI and writes to data/news.json
 *
 * Usage:
 *   npm run update-news
 *
 * Required env:
 *   NEWS_API_KEY — your NewsAPI developer key
 */

import * as fs from 'fs'
import * as path from 'path'
import { fetchCubaNews } from '../lib/fetch-news'
import { processArticles } from '../lib/process-news'
import type { NewsData } from '../lib/types'

async function main() {
  const apiKey = process.env.NEWS_API_KEY
  if (!apiKey) {
    console.error('ERROR: NEWS_API_KEY environment variable is not set.')
    console.error('Get a free key at https://newsapi.org/register')
    process.exit(1)
  }

  console.log('Fetching Cuba news from NewsAPI...')
  const rawArticles = await fetchCubaNews(apiKey)
  console.log(`Fetched ${rawArticles.length} raw articles`)

  const articles = processArticles(rawArticles)
  console.log(`Processed ${articles.length} unique articles`)

  const newsData: NewsData = {
    updatedAt: new Date().toISOString(),
    articles,
  }

  const outputPath = path.join(process.cwd(), 'data', 'news.json')
  fs.mkdirSync(path.dirname(outputPath), { recursive: true })
  fs.writeFileSync(outputPath, JSON.stringify(newsData, null, 2), 'utf-8')
  console.log(`Written to ${outputPath}`)

  // Summary by category
  const byCategory = articles.reduce<Record<string, number>>((acc, a) => {
    acc[a.category] = (acc[a.category] ?? 0) + 1
    return acc
  }, {})
  console.log('\nArticles by category:')
  for (const [cat, count] of Object.entries(byCategory)) {
    console.log(`  ${cat}: ${count}`)
  }
}

main().catch((err) => {
  console.error('Fatal error:', err)
  process.exit(1)
})
