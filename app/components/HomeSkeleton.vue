<template>
  <div class="animate-pulse" aria-busy="true" aria-label="Завантаження">
    <div class="h-80 bg-line" />
    <div class="mt-8 flex gap-4 overflow-hidden px-6">
      <div v-for="i in 2" :key="i" class="aspect-[4/5] w-[78vw] max-w-80 shrink-0 rounded-3xl bg-line" />
    </div>
  </div>
</template>
