<script setup lang="ts">
import type { Dish } from '#shared/types/menu'

const props = defineProps<{ dish: Dish; flag: string }>()
const { isCooked } = useCooked()
const cooked = computed(() => isCooked(props.dish.id))
</script>

<template>
  <NuxtLink
    :to="`/dish/${dish.id}`"
    class="group relative block w-[78vw] max-w-80 shrink-0 snap-center overflow-hidden rounded-3xl bg-card shadow-lg shadow-black/5"
  >
    <DishImage :dish="dish" :flag="flag" class="aspect-[4/5]" sizes="80vw sm:320px" />
    <div class="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-5 pt-16 text-white">
      <p class="text-xs font-semibold uppercase tracking-widest text-white/75">{{ COURSE_LABELS[dish.course] }}</p>
      <h3 class="mt-1 font-display text-2xl leading-tight">{{ dish.name }}</h3>
      <p class="mt-0.5 text-sm text-white/70 italic">{{ dish.originalName }}</p>
      <p class="mt-3 flex gap-3 text-xs font-medium text-white/85">
        <span>⏱ {{ dish.timeMinutes }} хв</span>
        <span>{{ '●'.repeat(dish.difficulty) }}{{ '○'.repeat(3 - dish.difficulty) }}</span>
      </p>
    </div>
    <span
      v-if="cooked"
      class="absolute top-4 right-4 rounded-full bg-accent px-3 py-1 text-xs font-bold text-black/80"
    >✓ приготовано</span>
  </NuxtLink>
</template>
