#!/usr/bin/env node
// Завантажує фото з Commons, конвертує у webp (макс. 1600px) і друкує об'єкт `image` для даних.
// node scripts/fetch-image.mjs <dish-id> "File:Some photo.jpg" ["alt-текст"]
import { mkdir } from 'node:fs/promises'
import sharp from 'sharp'
import { api, describe, fetchRetry, FREE_LICENSE } from './commons.mjs'

const [id, title, alt = ''] = process.argv.slice(2)
if (!id || !title?.startsWith('File:')) {
  console.error('Usage: fetch-image.mjs <dish-id> "File:Name.jpg" ["alt"]')
  process.exit(1)
}

const data = await api({ action: 'query', titles: title, prop: 'imageinfo', iiprop: 'url|size|extmetadata', iiurlwidth: '1600' })
const page = data.query?.pages?.[0]
if (!page || page.missing) throw new Error(`Не знайдено: ${title}`)
const info = describe(page)
if (!FREE_LICENSE.test(info.license)) throw new Error(`Ліцензія не підходить: "${info.license}"`)

const res = await fetchRetry(info.thumb)
if (!res.ok) throw new Error(`Завантаження ${res.status}`)

const input = Buffer.from(await res.arrayBuffer())
const out = `public/images/dishes/${id}.webp`
await mkdir('public/images/dishes', { recursive: true })
// Маленьке jpg-превʼю для візуальної перевірки (не комітиться)
await mkdir('.cache/previews', { recursive: true })
await sharp(input).rotate().resize({ width: 480 }).jpeg({ quality: 70 }).toFile(`.cache/previews/${id}.jpg`)
await sharp(input)
  .rotate()
  .resize({ width: 1600, height: 1600, fit: 'inside', withoutEnlargement: true })
  .webp({ quality: 78 })
  .toFile(out)

const image = { src: `/images/dishes/${id}.webp`, alt, author: info.author.slice(0, 120), license: info.license, sourceUrl: info.sourceUrl }
console.log(`Збережено ${out}, превʼю: .cache/previews/${id}.jpg\n`)
console.log(`image: ${JSON.stringify(image, null, 2).replace(/"(\w+)":/g, '$1:').replace(/"/g, "'")},`)
