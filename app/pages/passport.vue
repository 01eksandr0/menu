<script setup lang="ts">
import type { CountrySummary } from '#shared/types/menu'

useHead({ title: 'Паспорт — Кухня тижня' })
const { data: countries } = await useFetch<CountrySummary[]>('/api/countries')
const { progress } = useCooked()
const { ids: favorites } = useFavorites()

const stamps = computed(() => (countries.value ?? []).map(c => ({ country: c, ...progress(c.dishIds) })))
const collected = computed(() => stamps.value.filter(s => s.complete).length)
</script>

<template>
  <main class="pb-nav px-6" style="padding-top: calc(env(safe-area-inset-top) + 2rem)">
    <h1 class="font-display text-3xl font-bold">Паспорт мандрівника</h1>
    <ClientOnly>
      <p class="mt-1 text-muted">Зібрано {{ collected }} з {{ stamps.length }} віз · {{ favorites.length }} в обраному</p>
    </ClientOnly>
    <p class="mt-4 text-sm text-muted">Приготуйте всі 5 страв країни, щоб отримати її штамп.</p>

    <ClientOnly>
      <div class="mt-8 grid grid-cols-3 gap-x-4 gap-y-6">
        <PassportStamp v-for="s in stamps" :key="s.country.slug" :country="s.country" :done="s.done" :total="s.total" :stamped-at="s.stampedAt" />
      </div>
    </ClientOnly>
  </main>
</template>
