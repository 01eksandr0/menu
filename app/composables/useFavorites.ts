export function useFavorites() {
  const ids = useLocalStorage<string[]>('kt:favorites', [])

  const isFavorite = (id: string) => ids.value.includes(id)
  const toggle = (id: string) => {
    ids.value = isFavorite(id) ? ids.value.filter(x => x !== id) : [...ids.value, id]
  }

  return { ids, isFavorite, toggle }
}
