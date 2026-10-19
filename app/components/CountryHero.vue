<script setup lang="ts">
import type { WeekInfo } from '#shared/types/menu'

const props = defineProps<{ week: WeekInfo }>()

const now = useNow({ scheduler: cb => useIntervalFn(cb, 60_000) })
const countdown = computed(() => {
  const ms = new Date(props.week.endsAt).getTime() - now.value.getTime()
  if (ms <= 0) return 'вже зараз'
  const days = Math.floor(ms / 86_400_000)
  const hours = Math.floor((ms % 86_400_000) / 3_600_000)
  if (days >= 1) return `${days} ${plural(days, 'день', 'дні', 'днів')}`
  return `${hours} ${plural(hours, 'година', 'години', 'годин')}`
})

function plural(n: number, one: string, few: string, many: string) {
  const r10 = n % 10
  const r100 = n % 100
  if (r10 === 1 && r100 !== 11) return one
  if (r10 >= 2 && r10 <= 4 && (r100 < 12 || r100 > 14)) return few
  return many
}
</script>

<template>
  <header
    class="relative overflow-hidden px-6 pb-10 text-white"
    style="padding-top: calc(env(safe-area-inset-top) + 3rem); background: linear-gradient(160deg, var(--c-primary), color-mix(in oklab, var(--c-primary) 55%, black))"
  >
    <span class="pointer-events-none absolute -top-6 -right-8 text-[10rem] opacity-25 select-none" aria-hidden="true">{{ week.country.flag }}</span>
    <p class="text-sm font-semibold uppercase tracking-[0.2em] text-white/70">Кухня тижня · {{ formatWeekRange(week) }}</p>
    <h1 class="mt-3 font-display text-5xl leading-none font-bold">
      {{ week.country.name }} <span aria-hidden="true">{{ week.country.flag }}</span>
    </h1>
    <p class="mt-4 max-w-md text-base leading-relaxed text-white/85">{{ week.country.intro }}</p>
    <p class="mt-6 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-medium backdrop-blur">
      <span aria-hidden="true">✈️</span> До наступної країни: <ClientOnly><strong>{{ countdown }}</strong></ClientOnly>
    </p>
  </header>
</template>
