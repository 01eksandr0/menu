import { DISH_BY_ID, toSummary } from '../../data'

export default defineEventHandler((event) => {
  const entry = DISH_BY_ID.get(getRouterParam(event, 'id') ?? '')
  if (!entry) throw createError({ statusCode: 404, statusMessage: 'Страву не знайдено' })
  return { dish: entry.dish, country: toSummary(entry.country) }
})
