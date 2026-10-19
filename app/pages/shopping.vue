<script setup lang="ts">
const { data: week } = await useWeek(0)
useCountryTheme(() => week.value?.country.palette)
useHead({ title: 'Список покупок — Кухня тижня' })

const { items, checked, toggle, asText } = useShoppingList(() => week.value?.index, () => week.value?.country.dishes ?? [])
const total = computed(() => items.value.reduce((n, g) => n + g.items.length, 0))

const { share, isSupported: canShare } = useShare()
const { copy, copied } = useClipboard()
function shareList() {
  const text = `🛒 ${week.value?.country.flag} ${week.value?.country.name} — список покупок\n\n${asText()}`
  if (canShare.value) share({ title: 'Список покупок', text })
  else copy(text)
}
</script>

<template>
  <main class="pb-nav px-6" style="padding-top: calc(env(safe-area-inset-top) + 2rem)">
    <header class="flex items-start justify-between gap-4">
      <div>
        <h1 class="font-display text-3xl font-bold">Список покупок</h1>
        <p v-if="week" class="mt-1 text-muted">
          {{ week.country.flag }} {{ week.country.name }} · усе меню тижня
          <ClientOnly> · {{ checked.size }}/{{ total }}</ClientOnly>
        </p>
      </div>
      <ClientOnly>
        <button class="min-h-11 shrink-0 rounded-full bg-primary px-4 text-sm font-bold text-white" @click="shareList">
          {{ copied ? 'Скопійовано' : 'Поділитися' }}
        </button>
      </ClientOnly>
    </header>

    <section v-for="group in items" :key="group.category" class="mt-8">
      <h2 class="text-sm font-semibold uppercase tracking-wider text-muted">{{ group.label }}</h2>
      <ul class="mt-2 divide-y divide-line rounded-2xl bg-card px-4">
        <li v-for="item in group.items" :key="item.key">
          <label class="flex min-h-14 cursor-pointer items-center gap-4 py-3">
            <input
              type="checkbox"
              class="size-5 shrink-0 accent-(--c-primary)"
              :checked="checked.has(item.key)"
              @change="toggle(item.key)"
            >
            <span class="flex-1" :class="{ 'text-muted line-through': checked.has(item.key) }">{{ item.name }}</span>
            <span class="text-right text-sm text-muted">{{ item.amounts.join(' + ') }}</span>
          </label>
        </li>
      </ul>
    </section>
  </main>
</template>
