/** dishId → дата, коли позначено «приготовано» (ISO) */
export function useCooked() {
  const cooked = useLocalStorage<Record<string, string>>('kt:cooked', {})

  const isCooked = (id: string) => id in cooked.value

  function toggle(id: string) {
    const next = { ...cooked.value }
    if (next[id]) delete next[id]
    else {
      next[id] = new Date().toISOString()
      if (import.meta.client) navigator.vibrate?.(10)
    }
    cooked.value = next
  }

  /** Скільки страв країни приготовано і коли зібрано штамп (дата останньої страви) */
  function progress(dishIds: string[]) {
    const dates = dishIds.map(id => cooked.value[id]).filter((d): d is string => !!d)
    const complete = dates.length === dishIds.length && dishIds.length > 0
    return { done: dates.length, total: dishIds.length, complete, stampedAt: complete ? dates.sort().at(-1) : undefined }
  }

  return { cooked, isCooked, toggle, progress }
}
