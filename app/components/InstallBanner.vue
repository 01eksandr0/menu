<script setup lang="ts">
const { $pwa } = useNuxtApp()
const dismissed = useLocalStorage('kt:install-dismissed', false)

// iOS не має beforeinstallprompt, тому показуємо інструкцію з «Поділитися»
const isIos = ref(false)
const isStandalone = ref(false)
onMounted(() => {
  isIos.value = /iphone|ipad|ipod/i.test(navigator.userAgent)
  isStandalone.value = window.matchMedia('(display-mode: standalone)').matches || ('standalone' in navigator && !!navigator.standalone)
})

const show = computed(() => !dismissed.value && !isStandalone.value && ($pwa?.showInstallPrompt || isIos.value))

async function install() {
  await $pwa?.install()
}
function dismiss() {
  dismissed.value = true
  $pwa?.cancelInstall()
}
</script>

<template>
  <ClientOnly>
    <div
      v-if="show"
      class="fixed inset-x-3 z-30 mx-auto flex max-w-xl items-center gap-3 rounded-2xl bg-card p-4 shadow-xl ring-1 ring-line"
      style="bottom: calc(var(--nav-h) + env(safe-area-inset-bottom) + 0.75rem)"
      role="dialog"
      aria-label="Встановити застосунок"
    >
      <img src="/logo.svg" alt="" class="size-11 rounded-xl">
      <p v-if="$pwa?.showInstallPrompt" class="flex-1 text-sm">Додайте «Кухню тижня» на головний екран — рецепти будуть доступні офлайн.</p>
      <p v-else class="flex-1 text-sm">
        Натисніть
        <svg viewBox="0 0 24 24" class="inline size-4 align-text-bottom" fill="none" stroke="currentColor" stroke-width="2" aria-label="Поділитися"><path d="M12 3v12M8 7l4-4 4 4M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-7" /></svg>
        і «На початковий екран».
      </p>
      <button v-if="$pwa?.showInstallPrompt" class="min-h-11 rounded-xl bg-primary px-4 text-sm font-bold text-white" @click="install">Додати</button>
      <button class="min-h-11 min-w-11 text-muted" aria-label="Закрити" @click="dismiss">✕</button>
    </div>
  </ClientOnly>
</template>
