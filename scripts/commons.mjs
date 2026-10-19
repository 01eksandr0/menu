// Спільне для скриптів роботи з Wikimedia Commons
export const API = 'https://commons.wikimedia.org/w/api.php'
export const UA = 'KukhniaTyzhnia/0.1 (recipe app; image attribution kept in data)'

// Ліцензії, які дозволяють використання з атрибуцією
export const FREE_LICENSE = /^(cc[- ]?by(-sa)?[- ]?\d|cc0|public domain|pd)/i

/** fetch з повторами: Commons відповідає 429 при частих запитах */
export async function fetchRetry(url, tries = 5) {
  for (let i = 0; ; i++) {
    const res = await fetch(url, { headers: { 'User-Agent': UA } })
    if (res.ok || i >= tries - 1 || (res.status !== 429 && res.status < 500)) return res
    const wait = Number(res.headers.get('retry-after')) * 1000 || 2000 * 2 ** i
    await new Promise(r => setTimeout(r, wait))
  }
}

export async function api(params) {
  const url = `${API}?${new URLSearchParams({ format: 'json', formatversion: '2', origin: '*', ...params })}`
  const res = await fetchRetry(url)
  if (!res.ok) throw new Error(`Commons API ${res.status}`)
  return res.json()
}

export function stripHtml(s = '') {
  return s.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim()
}

export function describe(page) {
  const info = page.imageinfo?.[0]
  const meta = info?.extmetadata ?? {}
  return {
    title: page.title,
    width: info?.width,
    height: info?.height,
    license: stripHtml(meta.LicenseShortName?.value),
    author: stripHtml(meta.Artist?.value) || stripHtml(meta.Credit?.value) || 'Unknown',
    sourceUrl: info?.descriptionurl,
    thumb: info?.thumburl,
  }
}
