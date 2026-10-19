import type { Country, CountrySummary, Dish } from '../../shared/types/menu'
import { COURSE_ORDER } from '../../shared/utils/menu'
import { albania } from './countries/albania'
import { brazil } from './countries/brazil'
import { ethiopia } from './countries/ethiopia'
import { finland } from './countries/finland'
import { georgia } from './countries/georgia'
import { greece } from './countries/greece'
import { hungary } from './countries/hungary'
import { india } from './countries/india'
import { italy } from './countries/italy'
import { japan } from './countries/japan'
import { korea } from './countries/korea'
import { lebanon } from './countries/lebanon'
import { mexico } from './countries/mexico'
import { morocco } from './countries/morocco'
import { nigeria } from './countries/nigeria'
import { peru } from './countries/peru'
import { portugal } from './countries/portugal'
import { thailand } from './countries/thailand'
import { turkey } from './countries/turkey'
import { vietnam } from './countries/vietnam'
import { ROTATION } from './rotation'

const ALL = [
  albania, brazil, ethiopia, finland, georgia, greece, hungary, india, italy, japan,
  korea, lebanon, mexico, morocco, nigeria, peru, portugal, thailand, turkey, vietnam,
]

export const COUNTRIES: Country[] = ALL.map(c => ({
  ...c,
  dishes: [...c.dishes].sort((a, b) => COURSE_ORDER.indexOf(a.course) - COURSE_ORDER.indexOf(b.course)),
}))

export const COUNTRY_BY_SLUG = new Map(COUNTRIES.map(c => [c.slug, c]))

export const DISH_BY_ID = new Map<string, { dish: Dish; country: Country }>(
  COUNTRIES.flatMap(country => country.dishes.map(dish => [dish.id, { dish, country }] as const)),
)

export function toSummary(c: Country): CountrySummary {
  const { slug, name, flag, continent, palette } = c
  return { slug, name, flag, continent, palette, dishIds: c.dishes.map(d => d.id) }
}

// Помилки в даних краще ловити на старті (і під час білду), ніж у продакшені
function validate() {
  const errors: string[] = []

  if (COUNTRY_BY_SLUG.size !== COUNTRIES.length) errors.push('Дублікати slug країн')
  if (DISH_BY_ID.size !== COUNTRIES.reduce((n, c) => n + c.dishes.length, 0)) errors.push('Дублікати id страв')

  for (const c of COUNTRIES) {
    const courses = c.dishes.map(d => d.course).sort().join()
    if (courses !== [...COURSE_ORDER].sort().join()) {
      errors.push(`${c.slug}: потрібно рівно по одній страві кожного курсу, маємо [${courses}]`)
    }
  }

  for (const slug of ROTATION) {
    if (!COUNTRY_BY_SLUG.has(slug)) errors.push(`ROTATION: невідома країна "${slug}"`)
  }
  const missing = COUNTRIES.filter(c => !(ROTATION as readonly string[]).includes(c.slug))
  if (missing.length) errors.push(`ROTATION: бракує ${missing.map(c => c.slug).join(', ')}`)
  if (new Set(ROTATION).size !== ROTATION.length) errors.push('ROTATION: країна повторюється')

  ROTATION.forEach((slug, i) => {
    const next = ROTATION[(i + 1) % ROTATION.length]!
    const a = COUNTRY_BY_SLUG.get(slug)?.continent
    if (a && a === COUNTRY_BY_SLUG.get(next)?.continent) errors.push(`ROTATION: ${slug} і ${next} поспіль з одного континенту`)
  })

  if (errors.length) throw new Error(`Помилки в даних меню:\n- ${errors.join('\n- ')}`)
}

validate()
