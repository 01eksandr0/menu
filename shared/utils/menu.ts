import type { Course, Ingredient, IngredientCategory } from '../types/menu'

export const COURSE_ORDER: Course[] = ['starter', 'soup', 'main', 'dessert', 'drink']

export const COURSE_LABELS: Record<Course, string> = {
  starter: 'Закуска',
  soup: 'Суп',
  main: 'Основна',
  dessert: 'Десерт',
  drink: 'Напій',
}

export const CATEGORY_LABELS: Record<IngredientCategory, string> = {
  'produce': 'Овочі, фрукти, зелень',
  'meat-fish': "М'ясо та риба",
  'dairy': 'Молочне та яйця',
  'grocery': 'Бакалія',
  'spices': 'Спеції та соуси',
  'other': 'Інше',
}

export const CATEGORY_ORDER: IngredientCategory[] = ['produce', 'meat-fish', 'dairy', 'grocery', 'spices', 'other']

/** Округлює до «кухонної» точності: 0.25 для дрібних кількостей, цілі — для великих */
function roundQty(n: number) {
  if (n >= 20) return Math.round(n)
  if (n >= 5) return Math.round(n * 2) / 2
  return Math.round(n * 4) / 4
}

const FRACTIONS: Record<string, string> = { '0.25': '¼', '0.5': '½', '0.75': '¾' }

export function formatQty(n: number) {
  const whole = Math.floor(n)
  const frac = FRACTIONS[(n - whole).toFixed(2).replace(/0$/, '')]
  if (frac) return whole ? `${whole}${frac}` : frac
  return String(n).replace('.', ',')
}

export function formatIngredientAmount(ing: Ingredient, factor = 1) {
  if (ing.qty == null) return ing.unit ?? 'за смаком'
  const qty = formatQty(roundQty(ing.qty * factor))
  return ing.unit ? `${qty} ${ing.unit}` : qty
}
