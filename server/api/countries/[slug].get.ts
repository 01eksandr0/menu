import { COUNTRY_BY_SLUG } from '../../data'

export default defineEventHandler((event) => {
  const country = COUNTRY_BY_SLUG.get(getRouterParam(event, 'slug') ?? '')
  if (!country) throw createError({ statusCode: 404, statusMessage: 'Країну не знайдено' })
  return country
})
