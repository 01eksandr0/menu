export type Course = 'starter' | 'soup' | 'main' | 'dessert' | 'drink'

export type Continent = 'europe' | 'asia' | 'africa' | 'americas' | 'middle-east'

export type DishTag = 'vegetarian' | 'spicy' | 'gluten-free'

/** Категорія для групування у списку покупок */
export type IngredientCategory =
  | 'produce' // овочі, фрукти, зелень
  | 'meat-fish'
  | 'dairy' // молочне та яйця
  | 'grocery' // бакалія: крупи, борошно, консерви, соуси
  | 'spices'
  | 'other'

export interface Ingredient {
  name: string
  /** Кількість на `Dish.servings` порцій. Відсутня — «за смаком» */
  qty?: number
  unit?: string // 'г', 'мл', 'шт', 'ст. л.' …
  note?: string // 'дрібно нарізати'
  category: IngredientCategory
  /** Розділ у рецепті: 'Для тіста', 'Для соусу' */
  group?: string
}

export interface DishImage {
  src: string // '/images/dishes/fi-lohikeitto.webp' — scripts/fetch-image.mjs
  alt: string
  author: string
  license: string // 'CC BY-SA 4.0', 'Unsplash License'
  sourceUrl: string
}

export interface Dish {
  id: string // 'fi-lohikeitto'
  name: string // 'Лохікейто'
  originalName: string // 'Lohikeitto'
  course: Course
  description: string
  story: string
  timeMinutes: number
  difficulty: 1 | 2 | 3
  servings: number
  ingredients: Ingredient[]
  steps: string[]
  tags: DishTag[]
  // TODO(контент): зробити обов'язковим, коли фото будуть у public/images/dishes
  image?: DishImage
}

export interface Palette {
  primary: string
  accent: string
  surface: string
}

export interface Country {
  slug: string
  name: string
  flag: string
  continent: Continent
  intro: string
  palette: Palette
  funFacts: string[]
  dishes: Dish[]
}

export type CountrySummary = Pick<Country, 'slug' | 'name' | 'flag' | 'continent' | 'palette'> & {
  dishIds: string[]
}

export interface WeekInfo {
  /** Номер тижня від старту проєкту (може бути від'ємним) */
  index: number
  offset: number
  /** ISO-момент: понеділок 00:00 за Києвом */
  startsAt: string
  endsAt: string
  country: Country
}
