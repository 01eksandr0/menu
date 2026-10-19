import type { WeekInfo } from '#shared/types/menu'

export function useWeek(offset: MaybeRefOrGetter<number> = 0) {
  const key = computed(() => `week:${toValue(offset)}`)
  return useFetch<WeekInfo>(() => (toValue(offset) === 0 ? '/api/week/current' : `/api/week/${toValue(offset)}`), { key })
}

export function formatWeekRange(w: Pick<WeekInfo, 'startsAt' | 'endsAt'>) {
  const fmt = new Intl.DateTimeFormat('uk-UA', { day: 'numeric', month: 'short', timeZone: 'Europe/Kyiv' })
  const end = new Date(new Date(w.endsAt).getTime() - 1)
  return `${fmt.format(new Date(w.startsAt))} — ${fmt.format(end)}`
}
