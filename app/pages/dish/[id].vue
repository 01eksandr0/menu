<script setup lang="ts">
import type { CountrySummary, Dish, Ingredient } from '#shared/types/menu'

const route = useRoute()
const id = computed(() => String(route.params.id))
const { data } = await useFetch<{ dish: Dish; country: CountrySummary }>(() => `/api/dishes/${id.value}`)
if (!data.value) throw createError({ statusCode: 404, statusMessage: 'Страву не знайдено', fatal: true })

const dish = computed(() => data.value!.dish)
const country = computed(() => data.value!.country)
useCountryTheme(() => country.value.palette)
useHead(() => ({ title: `${dish.value.name} — ${country.value.flag} ${country.value.name}` }))

// Перемикач порцій перераховує інгредієнти
const servings = ref(dish.value.servings)
const factor = computed(() => servings.value / dish.value.servings)
const groups = computed(() => {
  const map = new Map<string, Ingredient[]>()
  for (const ing of dish.value.ingredients) map.set(ing.group ?? '', [...(map.get(ing.group ?? '') ?? []), ing])
  return [...map]
})

const { isFavorite, toggle: toggleFavorite } = useFavorites()
const { isCooked, toggle: toggleCooked, progress } = useCooked()

const celebrate = ref(false)
function onCooked() {
  const wasComplete = progress(country.value.dishIds).complete
  toggleCooked(dish.value.id)
  if (!wasComplete && progress(country.value.dishIds).complete) celebrate.value = true
}

const cooking = ref(false)

// Фото «стискається» при скролі
const { y } = useWindowScroll()
const heroStyle = computed(() => {
  const shift = Math.min(y.value, 240)
  return { transform: `translateY(${shift * 0.4}px) scale(${1 + shift / 1200})`, opacity: 1 - shift / 400 }
})

const TAG_LABELS = { 'vegetarian': '🌱 Вегетаріанське', 'spicy': '🌶 Гостре', 'gluten-free': 'Без глютену' } as const
</script>

<template>
  <main class="pb-nav">
    <div class="relative h-[52vh] max-h-[460px] overflow-hidden">
      <DishImage :dish="dish" :flag="country.flag" class="size-full will-change-transform" :style="heroStyle" eager />
      <div class="absolute inset-x-0 top-0 flex justify-between p-4" style="padding-top: calc(env(safe-area-inset-top) + 0.75rem)">
        <button class="flex size-11 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur" aria-label="Назад" @click="$router.back()">←</button>
        <ClientOnly>
          <button
            class="flex size-11 items-center justify-center rounded-full bg-black/40 text-xl text-white backdrop-blur"
            :aria-label="isFavorite(dish.id) ? 'Прибрати з обраного' : 'Додати в обране'"
            :aria-pressed="isFavorite(dish.id)"
            @click="toggleFavorite(dish.id)"
          >{{ isFavorite(dish.id) ? '♥' : '♡' }}</button>
        </ClientOnly>
      </div>
    </div>

    <article class="relative -mt-8 rounded-t-[2rem] bg-bg px-6 pt-8">
      <p class="text-sm font-semibold uppercase tracking-widest text-primary">{{ country.flag }} {{ COURSE_LABELS[dish.course] }}</p>
      <h1 class="mt-2 font-display text-4xl leading-tight font-bold">{{ dish.name }}</h1>
      <p class="mt-1 text-muted italic">{{ dish.originalName }}</p>
      <p class="mt-4 text-[17px] leading-relaxed">{{ dish.description }}</p>

      <dl class="mt-6 grid grid-cols-3 gap-3 text-center">
        <div class="rounded-2xl bg-card p-3">
          <dt class="text-xs text-muted">Час</dt>
          <dd class="mt-1 font-bold">{{ dish.timeMinutes }} хв</dd>
        </div>
        <div class="rounded-2xl bg-card p-3">
          <dt class="text-xs text-muted">Складність</dt>
          <dd class="mt-1 font-bold text-primary" :aria-label="`${dish.difficulty} з 3`">{{ '●'.repeat(dish.difficulty) }}<span class="text-line">{{ '●'.repeat(3 - dish.difficulty) }}</span></dd>
        </div>
        <div class="rounded-2xl bg-card p-3">
          <dt class="text-xs text-muted">Порції</dt>
          <dd class="mt-1 font-bold">{{ servings }}</dd>
        </div>
      </dl>

      <ul v-if="dish.tags.length" class="mt-4 flex flex-wrap gap-2">
        <li v-for="tag in dish.tags" :key="tag" class="rounded-full bg-card px-3 py-1 text-sm">{{ TAG_LABELS[tag] }}</li>
      </ul>

      <section class="mt-8 rounded-3xl border-l-4 border-accent bg-card p-5">
        <h2 class="font-display text-lg font-bold">Історія страви</h2>
        <p class="mt-2 leading-relaxed text-muted">{{ dish.story }}</p>
      </section>

      <section class="mt-10" aria-labelledby="ingredients-title">
        <div class="flex items-center justify-between">
          <h2 id="ingredients-title" class="font-display text-2xl font-bold">Інгредієнти</h2>
          <div class="flex items-center gap-1 rounded-full bg-card p-1" role="group" aria-label="Кількість порцій">
            <button class="size-11 rounded-full text-xl disabled:opacity-30" :disabled="servings <= 1" aria-label="Менше порцій" @click="servings--">−</button>
            <span class="w-8 text-center font-bold" aria-live="polite">{{ servings }}</span>
            <button class="size-11 rounded-full text-xl" aria-label="Більше порцій" @click="servings++">+</button>
          </div>
        </div>
        <div v-for="[group, items] in groups" :key="group" class="mt-4">
          <h3 v-if="group" class="mb-1 text-sm font-semibold uppercase tracking-wider text-muted">{{ group }}</h3>
          <ul class="divide-y divide-line">
            <li v-for="ing in items" :key="ing.name" class="flex justify-between gap-4 py-3">
              <span>{{ ing.name }}<span v-if="ing.note" class="text-muted">, {{ ing.note }}</span></span>
              <span class="shrink-0 font-semibold tabular-nums">{{ formatIngredientAmount(ing, factor) }}</span>
            </li>
          </ul>
        </div>
      </section>

      <section class="mt-10" aria-labelledby="steps-title">
        <h2 id="steps-title" class="font-display text-2xl font-bold">Приготування</h2>
        <ol class="mt-4 space-y-5">
          <li v-for="(s, i) in dish.steps" :key="i" class="flex gap-4">
            <span class="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">{{ i + 1 }}</span>
            <p class="pt-1 leading-relaxed">{{ s }}</p>
          </li>
        </ol>
      </section>

      <div class="sticky z-10 mt-10 grid grid-cols-2 gap-3" style="bottom: calc(var(--nav-h) + env(safe-area-inset-bottom) + 0.75rem)">
        <button class="min-h-14 rounded-2xl bg-primary font-bold text-white shadow-lg" @click="cooking = true">👩‍🍳 Готую</button>
        <ClientOnly>
          <button
            class="min-h-14 rounded-2xl font-bold shadow-lg"
            :class="isCooked(dish.id) ? 'bg-accent text-black/80' : 'bg-card'"
            :aria-pressed="isCooked(dish.id)"
            @click="onCooked"
          >{{ isCooked(dish.id) ? '✓ Приготовано' : 'Позначити приготованим' }}</button>
        </ClientOnly>
      </div>

      <p v-if="dish.image" class="mt-8 text-xs text-muted">
        Фото: <a :href="dish.image.sourceUrl" class="underline" target="_blank" rel="noopener">{{ dish.image.author }}</a>, {{ dish.image.license }}
      </p>
    </article>

    <CookMode v-if="cooking" :title="dish.name" :steps="dish.steps" @close="cooking = false" />
    <StampCelebration v-if="celebrate" :flag="country.flag" :name="country.name" :color="country.palette.primary" @close="celebrate = false" />
  </main>
</template>
