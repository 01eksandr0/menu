<script setup lang="ts">
const { data: week, error } = await useWeek(0)
useCountryTheme(() => week.value?.country.palette)
useHead(() => ({ title: week.value ? `${week.value.country.flag} ${week.value.country.name} — Кухня тижня` : 'Кухня тижня' }))

const { progress } = useCooked()
const stats = computed(() => (week.value ? progress(week.value.country.dishes.map(d => d.id)) : undefined))
</script>

<template>
  <main class="pb-nav">
    <template v-if="week">
      <CountryHero :week="week" />

      <section class="mt-8" aria-labelledby="menu-title">
        <div class="flex items-end justify-between px-6">
          <h2 id="menu-title" class="font-display text-2xl font-bold">Меню тижня</h2>
          <ClientOnly>
            <span v-if="stats" class="text-sm text-muted">Приготовано {{ stats.done }} з {{ stats.total }}</span>
          </ClientOnly>
        </div>
        <div class="scrollbar-none mt-4 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-6 px-6 pb-4">
          <CourseCard v-for="dish in week.country.dishes" :key="dish.id" :dish="dish" :flag="week.country.flag" />
        </div>
      </section>

      <section class="mx-6 mt-6 rounded-3xl bg-card p-6" aria-labelledby="facts-title">
        <h2 id="facts-title" class="font-display text-xl font-bold">Чи знали ви?</h2>
        <ul class="mt-3 space-y-3">
          <li v-for="fact in week.country.funFacts" :key="fact" class="flex gap-3 text-[15px] leading-relaxed">
            <span class="mt-2 size-1.5 shrink-0 rounded-full bg-accent" aria-hidden="true" />
            {{ fact }}
          </li>
        </ul>
      </section>
    </template>

    <p v-else-if="error" class="p-6 pt-20 text-center text-muted">Не вдалося завантажити меню. Перевірте з'єднання.</p>
    <HomeSkeleton v-else />
  </main>
</template>
