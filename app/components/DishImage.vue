<script setup lang="ts">
import type { Dish } from '#shared/types/menu'

// Поки фото немає — градієнт у кольорах країни з назвою курсу
const props = defineProps<{ dish: Dish; flag?: string; sizes?: string; eager?: boolean }>()
</script>

<template>
  <div class="relative overflow-hidden bg-primary" :style="{ viewTransitionName: `dish-${props.dish.id}` }">
    <NuxtImg
      v-if="dish.image"
      :src="dish.image.src"
      :alt="dish.image.alt"
      :sizes="sizes ?? '100vw sm:800px'"
      :loading="eager ? 'eager' : 'lazy'"
      class="size-full object-cover"
    />
    <div
      v-else
      class="flex size-full items-center justify-center"
      style="background: radial-gradient(circle at 30% 20%, var(--c-accent), var(--c-primary) 70%)"
      role="img"
      :aria-label="dish.name"
    >
      <span class="text-6xl drop-shadow-lg" aria-hidden="true">{{ flag ?? '🍽️' }}</span>
    </div>
  </div>
</template>
