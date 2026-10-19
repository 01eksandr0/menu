import type { WeekInfo } from '#shared/types/menu'

/**
 * Прогріває кеші service worker: поточний і наступний тиждень разом зі сторінками страв,
 * щоб рецепт відкрився навіть у супермаркеті без інтернету.
 * Назви кешів збігаються з runtimeCaching у nuxt.config.ts.
 */
export default defineNuxtPlugin(() => {
  if (import.meta.dev || !('serviceWorker' in navigator) || !('caches' in window)) return

  onNuxtReady(async () => {
    await navigator.serviceWorker.ready
    try {
      const weeks = await Promise.all([$fetch<WeekInfo>('/api/week/current'), $fetch<WeekInfo>('/api/week/1')])
      const dishIds = weeks.flatMap(w => w.country.dishes.map(d => d.id))
      const [api, pages] = await Promise.all([caches.open('api'), caches.open('pages')])
      await Promise.allSettled([
        api.addAll(dishIds.map(id => `/api/dishes/${id}`)),
        pages.addAll(dishIds.map(id => `/dish/${id}`)),
      ])
    }
    catch {
      // Офлайн або сервер недоступний — спробуємо наступного разу
    }
  })
})
