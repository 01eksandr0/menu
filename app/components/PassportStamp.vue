<script setup lang="ts">
import type { CountrySummary } from '#shared/types/menu'

const props = defineProps<{ country: CountrySummary; done: number; total: number; stampedAt?: string }>()
const complete = computed(() => !!props.stampedAt)
const date = computed(() =>
  props.stampedAt ? new Intl.DateTimeFormat('uk-UA', { day: '2-digit', month: '2-digit', year: '2-digit' }).format(new Date(props.stampedAt)) : '',
)
// Стабільний «випадковий» нахил для кожного штампа
const tilt = computed(() => ([...props.country.slug].reduce((a, c) => a + c.charCodeAt(0), 0) % 17) - 8)
</script>

<template>
  <div class="flex flex-col items-center gap-2">
    <div
      class="relative flex aspect-square w-full flex-col items-center justify-center rounded-full border-4 border-dashed p-2 text-center transition"
      :class="complete ? '' : 'border-line opacity-60 grayscale'"
      :style="complete ? { borderColor: country.palette.primary, color: country.palette.primary, transform: `rotate(${tilt}deg)` } : undefined"
    >
      <span class="text-3xl" aria-hidden="true">{{ country.flag }}</span>
      <span class="mt-1 font-display text-sm leading-tight font-bold uppercase">{{ country.name }}</span>
      <span v-if="complete" class="text-[10px] font-semibold tracking-wider">{{ date }}</span>
    </div>
    <span class="text-xs text-muted">{{ done }}/{{ total }}</span>
  </div>
</template>
