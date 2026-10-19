<script setup lang="ts">
const props = defineProps<{ title: string; steps: string[] }>()
const emit = defineEmits<{ close: [] }>()

const step = ref(0)
const next = () => (step.value = Math.min(step.value + 1, props.steps.length - 1))
const prev = () => (step.value = Math.max(step.value - 1, 0))

// Екран не гасне, поки готуємо
const wakeLock = reactive(useWakeLock())
onMounted(() => wakeLock.isSupported && wakeLock.request('screen'))
onBeforeUnmount(() => wakeLock.isActive && wakeLock.release())

const el = useTemplateRef('el')
useSwipe(el, {
  onSwipeEnd(_, direction) {
    if (direction === 'left') next()
    if (direction === 'right') prev()
  },
})
onKeyStroke('ArrowRight', next)
onKeyStroke('ArrowLeft', prev)
onKeyStroke('Escape', () => emit('close'))
</script>

<template>
  <div
    ref="el"
    class="fixed inset-0 z-50 flex flex-col bg-bg"
    style="padding: calc(env(safe-area-inset-top) + 1rem) 1.5rem calc(env(safe-area-inset-bottom) + 1rem)"
    role="dialog"
    aria-modal="true"
    :aria-label="`Режим готування: ${title}`"
  >
    <div class="flex items-center justify-between">
      <p class="text-sm font-semibold text-muted">Крок {{ step + 1 }} з {{ steps.length }}</p>
      <button class="min-h-11 min-w-11 text-2xl" aria-label="Закрити режим готування" @click="emit('close')">✕</button>
    </div>
    <div class="mt-2 h-1.5 overflow-hidden rounded-full bg-line">
      <div class="h-full bg-primary transition-all" :style="{ width: `${((step + 1) / steps.length) * 100}%` }" />
    </div>

    <p class="my-auto font-display text-3xl leading-snug" aria-live="polite">{{ steps[step] }}</p>

    <div class="grid grid-cols-2 gap-3">
      <button class="min-h-14 rounded-2xl bg-card text-lg font-semibold disabled:opacity-40" :disabled="step === 0" @click="prev">← Назад</button>
      <button v-if="step < steps.length - 1" class="min-h-14 rounded-2xl bg-primary text-lg font-semibold text-white" @click="next">Далі →</button>
      <button v-else class="min-h-14 rounded-2xl bg-accent text-lg font-semibold text-black/80" @click="emit('close')">Готово 🎉</button>
    </div>
    <p v-if="wakeLock.isActive" class="mt-3 text-center text-xs text-muted">Екран не вимкнеться, поки відкрито цей режим</p>
  </div>
</template>
