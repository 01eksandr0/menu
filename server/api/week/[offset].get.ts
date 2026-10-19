export default defineEventHandler((event) => {
  const offset = Number(getRouterParam(event, 'offset'))
  if (!Number.isInteger(offset) || Math.abs(offset) > MAX_WEEK_OFFSET) {
    throw createError({ statusCode: 400, statusMessage: `offset має бути цілим числом від -${MAX_WEEK_OFFSET} до ${MAX_WEEK_OFFSET}` })
  }
  return weekInfo(offset)
})
