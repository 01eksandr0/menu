# Кухня тижня 🌍

Щопонеділка о 00:00 за Києвом відкривається нова країна з меню на тиждень: закуска, суп, основна страва, десерт і напій.

```bash
npm install
npm run dev        # http://localhost:3000
npm run build && node .output/server/index.mjs
```

## Як влаштовано

- `server/data/countries/*.ts` — контент, одна країна на файл. `server/data/index.ts` під час старту перевіряє, що в кожної країни рівно 5 курсів.
- `server/data/rotation.ts` — порядок країн. Тиждень 0 починається в понеділок 2026-01-05 (`server/utils/week.ts`).
- `shared/types/menu.ts` — типи, спільні для сервера й клієнта.
- Обране, «приготовано» і відмітки покупок зберігаються в `localStorage` (`app/composables`).
- PWA: іконки й splash-скріни генеруються з `public/logo.svg` (`pwa-assets.config.ts`).

## Додати країну

1. Створіть `server/data/countries/<slug>.ts` за зразком `finland.ts`.
2. Додайте її в `COUNTRIES` (`server/data/index.ts`) і в `ROTATION`.
3. Фото з Wikimedia Commons (лише вільні ліцензії):
   ```bash
   node scripts/search-images.mjs "khachapuri adjaruli"
   node scripts/fetch-image.mjs ge-khachapuri-adjaruli "File:….jpg" "alt українською"
   ```
   Скрипт збереже `public/images/dishes/<id>.webp` (≤1600px) і надрукує готовий об'єкт `image` з автором і ліцензією. Превʼю для перевірки — у `.cache/previews/`.

Білд падає, якщо в даних є помилка: дублікати id, неповний набір курсів, два тижні поспіль з одного континенту або посилання на фото, якого немає.
