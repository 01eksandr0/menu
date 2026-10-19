import type { WeekInfo } from '#shared/types/menu'
import { COUNTRY_BY_SLUG } from '../data'
import { ROTATION } from '../data/rotation'

export const MAX_WEEK_OFFSET = 52

export function weekInfo(offset = 0, now = new Date()): WeekInfo {
  const index = weekIndex(now) + offset
  const { startsAt, endsAt } = weekBounds(index)
  const slug = ROTATION[rotationSlot(index, ROTATION.length)]!
  return {
    index,
    offset,
    startsAt: startsAt.toISOString(),
    endsAt: endsAt.toISOString(),
    country: COUNTRY_BY_SLUG.get(slug)!,
  }
}
