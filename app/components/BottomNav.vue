<script setup lang="ts">
const tabs = [
  { to: '/', label: 'Тиждень', icon: 'M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z' },
  { to: '/shopping', label: 'Покупки', icon: 'M6 6h15l-1.5 9h-12zM6 6 5 3H2m6 18a1 1 0 1 0 0-2 1 1 0 0 0 0 2m10 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2' },
  { to: '/passport', label: 'Паспорт', icon: 'M6 2h12a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2m6 5a4 4 0 1 0 0 8 4 4 0 0 0 0-8M8 18h8' },
  { to: '/archive', label: 'Архів', icon: 'M8 2v4m8-4v4M3 9h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2' },
]
const route = useRoute()
const isActive = (to: string) => (to === '/' ? route.path === '/' : route.path.startsWith(to))
</script>

<template>
  <nav
    class="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-card/90 backdrop-blur-lg"
    style="padding-bottom: env(safe-area-inset-bottom)"
    aria-label="Головна навігація"
  >
    <ul class="mx-auto grid h-(--nav-h) max-w-xl grid-cols-4">
      <li v-for="t in tabs" :key="t.to">
        <NuxtLink
          :to="t.to"
          class="flex h-full min-h-11 flex-col items-center justify-center gap-1 text-[11px] font-semibold transition-colors"
          :class="isActive(t.to) ? 'text-primary' : 'text-muted'"
          :aria-current="isActive(t.to) ? 'page' : undefined"
        >
          <svg viewBox="0 0 24 24" class="size-6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path :d="t.icon" />
          </svg>
          {{ t.label }}
        </NuxtLink>
      </li>
    </ul>
  </nav>
</template>
