import { existsSync } from 'node:fs'
import tailwindcss from '@tailwindcss/vite'
import { DISH_BY_ID } from './server/data'

// Посилання на фото, якого немає в public/, ламає білд
const missingImages = [...DISH_BY_ID.values()]
  .map(({ dish }) => dish.image?.src)
  .filter((src): src is string => !!src && !existsSync(`public${src}`))
if (missingImages.length) throw new Error(`Немає файлів фото:\n${missingImages.join('\n')}`)

const THEME_COLOR = '#1f1b16'

export default defineNuxtConfig({
  compatibilityDate: '2026-10-01',
  devtools: { enabled: true },

  modules: ['@vueuse/nuxt', '@nuxt/fonts', '@nuxt/image', '@vite-pwa/nuxt'],

  css: ['~/assets/css/main.css'],
  vite: { plugins: [tailwindcss()] },

  app: {
    head: {
      htmlAttrs: { lang: 'uk' },
      title: 'Кухня тижня',
      meta: [
        // viewport-fit=cover — щоб працював env(safe-area-inset-*)
        { name: 'viewport', content: 'width=device-width, initial-scale=1, viewport-fit=cover' },
        { name: 'description', content: 'Щотижня нова країна і повне меню на тиждень' },
        { name: 'apple-mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' },
      ],
    },
  },

  experimental: { viewTransition: true },

  fonts: {
    // Fraunces з плану не має кирилиці, тому serif — Playfair Display
    families: [
      { name: 'Playfair Display', provider: 'google' },
      { name: 'Manrope', provider: 'google' },
    ],
    defaults: { weights: [400, 600, 700], subsets: ['latin', 'latin-ext', 'cyrillic'] },
  },

  image: { format: ['avif', 'webp'], screens: { sm: 800, lg: 1600 } },

  routeRules: {
    '/api/countries/**': { cache: { maxAge: 60 * 60 * 24 } },
    '/api/dishes/**': { cache: { maxAge: 60 * 60 * 24 } },
    // /api/week/** не кешуємо на сервері: обчислення миттєве, а кеш на 10 хв
    // віддавав би стару країну в перші хвилини понеділка.
  },

  nitro: {
    prerender: { routes: [...DISH_BY_ID.keys()].map(id => `/dish/${id}`) },
  },

  pwa: {
    registerType: 'autoUpdate',
    client: { installPrompt: true },
    pwaAssets: { config: true },
    manifest: {
      name: 'Кухня тижня',
      short_name: 'Кухня тижня',
      description: 'Щопонеділка — нова країна і повне меню на тиждень',
      lang: 'uk',
      display: 'standalone',
      orientation: 'portrait',
      start_url: '/',
      theme_color: THEME_COLOR,
      background_color: THEME_COLOR,
    },
    workbox: {
      // SSR: статичного index.html немає, тож сторінки кешуємо в рантаймі (нижче)
      navigateFallback: null,
      globPatterns: ['**/*.{js,css,woff2,svg,png,ico,webp,avif}'],
      // Фото страв кешуються в рантаймі (CacheFirst нижче), а не всі 100 одразу при встановленні
      globIgnores: ['**/apple-splash-*', '**/images/dishes/**', '**/_ipx/**'],
      runtimeCaching: [
        {
          // Країна тижня має оновитися одразу в понеділок, тому спершу мережа
          urlPattern: ({ url }) => url.pathname.startsWith('/api/week/'),
          handler: 'NetworkFirst',
          options: { cacheName: 'api-week', networkTimeoutSeconds: 3 },
        },
        {
          urlPattern: ({ url }) => url.pathname.startsWith('/api/'),
          handler: 'StaleWhileRevalidate',
          options: { cacheName: 'api' },
        },
        {
          urlPattern: ({ request }) => request.destination === 'image',
          handler: 'CacheFirst',
          options: {
            cacheName: 'images',
            expiration: { maxEntries: 100, maxAgeSeconds: 60 * 60 * 24 * 60 },
          },
        },
        {
          urlPattern: ({ request }) => request.mode === 'navigate',
          handler: 'NetworkFirst',
          options: { cacheName: 'pages', networkTimeoutSeconds: 3 },
        },
      ],
    },
    devOptions: { enabled: false },
  },
})
