import type { Dish, Ingredient, IngredientCategory } from '#shared/types/menu'

export interface ShoppingItem {
  key: string
  name: string
  amounts: string[]
  category: IngredientCategory
}

/** Сумує кількості з однаковою одиницею: 10 шт + 3 шт → 13 шт */
function sumAmounts(ings: Ingredient[]) {
  const byUnit = new Map<string, Ingredient>()
  for (const ing of ings) {
    const key = ing.qty == null ? `~${ing.unit ?? ''}` : (ing.unit ?? '')
    const prev = byUnit.get(key)
    byUnit.set(key, prev && ing.qty != null ? { ...prev, qty: (prev.qty ?? 0) + ing.qty } : prev ?? ing)
  }
  return [...byUnit.values()].map(i => formatIngredientAmount(i))
}

// Вода й подібне в магазині не купують
const SKIP = /^вода/i

/** Зводить інгредієнти всього меню тижня; відмітки зберігаються окремо для кожного тижня */
export function useShoppingList(weekIndex: MaybeRefOrGetter<number | undefined>, dishes: MaybeRefOrGetter<Dish[]>) {
  const checkedByWeek = useLocalStorage<Record<string, string[]>>('kt:shopping', {})

  const items = computed(() => {
    const grouped = new Map<string, Ingredient[]>()
    for (const dish of toValue(dishes)) {
      for (const ing of dish.ingredients) {
        if (SKIP.test(ing.name)) continue
        const key = `${ing.category}:${ing.name.toLowerCase()}`
        grouped.set(key, [...(grouped.get(key) ?? []), ing])
      }
    }
    const map = new Map<string, ShoppingItem>(
      [...grouped].map(([key, ings]) => [key, { key, name: ings[0]!.name, amounts: sumAmounts(ings), category: ings[0]!.category }]),
    )
    return CATEGORY_ORDER
      .map(category => ({ category, label: CATEGORY_LABELS[category], items: [...map.values()].filter(i => i.category === category) }))
      .filter(g => g.items.length)
  })

  const weekKey = computed(() => String(toValue(weekIndex) ?? ''))
  const checked = computed(() => new Set(checkedByWeek.value[weekKey.value] ?? []))

  function toggle(key: string) {
    const set = new Set(checked.value)
    if (set.has(key)) set.delete(key)
    else set.add(key)
    checkedByWeek.value = { ...checkedByWeek.value, [weekKey.value]: [...set] }
  }

  function asText() {
    return items.value
      .map(g => `${g.label}:\n${g.items.filter(i => !checked.value.has(i.key)).map(i => `• ${i.name} — ${i.amounts.join(' + ')}`).join('\n')}`)
      .join('\n\n')
  }

  return { items, checked, toggle, asText }
}
