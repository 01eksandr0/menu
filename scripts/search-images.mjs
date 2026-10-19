#!/usr/bin/env node
// Пошук фото на Wikimedia Commons з вільною ліцензією.
// node scripts/search-images.mjs "lohikeitto salmon soup" [limit]
import { api, describe, FREE_LICENSE } from './commons.mjs'

const [query, limit = '15'] = process.argv.slice(2)
if (!query) {
  console.error('Usage: search-images.mjs "<query>" [limit]')
  process.exit(1)
}

const data = await api({
  action: 'query',
  generator: 'search',
  gsrsearch: `${query} filetype:bitmap`,
  gsrnamespace: '6',
  gsrlimit: limit,
  prop: 'imageinfo',
  iiprop: 'url|size|extmetadata',
  iiurlwidth: '640',
})

const results = (data.query?.pages ?? [])
  .sort((a, b) => a.index - b.index)
  .map(describe)
  .filter(r => r.width >= 1000 && FREE_LICENSE.test(r.license))

for (const r of results) console.log(`${r.title}\n  ${r.width}×${r.height} · ${r.license} · ${r.author}\n  preview: ${r.thumb}\n`)
if (!results.length) console.log('Нічого з вільною ліцензією і шириною ≥1000px')
