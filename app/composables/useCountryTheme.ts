import type { Palette } from '#shared/types/menu'

/** Застосовує палітру країни до CSS-змінних і кольору статус-бару */
export function useCountryTheme(palette: MaybeRefOrGetter<Palette | undefined>) {
  useHead(() => {
    const p = toValue(palette)
    if (!p) return {}
    return {
      htmlAttrs: { style: `--c-primary:${p.primary};--c-accent:${p.accent};--c-surface:${p.surface}` },
      meta: [{ name: 'theme-color', content: p.primary }],
    }
  })
}
