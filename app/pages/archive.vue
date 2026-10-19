<script setup lang="ts">
import type { WeekInfo } from '#shared/types/menu'

useHead({ title: 'Архів — Кухня тижня' })

const OFFSETS = [-3, -2, -1, 1, 2, 3]
const { data: weeks } = await useAsyncData('archive', () =>
  Promise.all(OFFSETS.map(o => $fetch<WeekInfo>(`/api/week/${o}`))),
)
const past = computed(() => (weeks.value ?? []).filter(w => w.offset < 0).reverse())
const future = computed(() => (weeks.value ?? []).filter(w => w.offset > 0))
</script>

<template>
  <main class="pb-nav px-6" style="padding-top: calc(env(safe-area-inset-top) + 2rem)">
    <h1 class="font-display text-3xl font-bold">Архів</h1>

    <h2 class="mt-8 text-sm font-semibold uppercase tracking-wider text-muted">Скоро</h2>
    <ul class="mt-3 space-y-3">
      <!-- Майбутні тижні — тизер: назву видно, страви ще розмиті -->
      <li v-for="w in future" :key="w.index" class="relative overflow-hidden rounded-3xl p-5 text-white" :style="{ background: w.country.palette.primary }">
        <div class="pointer-events-none absolute inset-0 flex items-center justify-end pr-4 text-8xl opacity-40 blur-md" aria-hidden="true">{{ w.country.flag }}</div>
        <p class="text-xs font-semibold uppercase tracking-widest text-white/70">{{ formatWeekRange(w) }}</p>
        <p class="mt-1 font-display text-2xl font-bold">{{ w.country.flag }} {{ w.country.name }}</p>
        <p class="mt-2 text-sm text-white/80 blur-[3px] select-none" aria-hidden="true">{{ w.country.dishes.map(d => d.name).join(' · ') }}</p>
      </li>
    </ul>

    <h2 class="mt-10 text-sm font-semibold uppercase tracking-wider text-muted">Минулі тижні</h2>
    <ul class="mt-3 space-y-3">
      <li v-for="w in past" :key="w.index" class="rounded-3xl bg-card p-5">
        <p class="text-xs font-semibold uppercase tracking-widest text-muted">{{ formatWeekRange(w) }}</p>
        <p class="mt-1 font-display text-2xl font-bold">{{ w.country.flag }} {{ w.country.name }}</p>
        <ul class="mt-3 flex flex-wrap gap-2">
          <li v-for="d in w.country.dishes" :key="d.id">
            <NuxtLink :to="`/dish/${d.id}`" class="inline-flex min-h-11 items-center rounded-full bg-bg px-4 text-sm">{{ d.name }}</NuxtLink>
          </li>
        </ul>
      </li>
    </ul>
  </main>
</template>
