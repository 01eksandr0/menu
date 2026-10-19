/**
 * Порядок країн по тижнях. Континенти чергуються, включно з переходом
 * з кінця списку на початок (перевіряється в server/data/index.ts).
 * Тиждень 0 = понеділок 2026-01-05 (див. server/utils/week.ts).
 */
export const ROTATION = [
  'finland', 'japan', 'peru', 'italy', 'morocco',
  'vietnam', 'georgia', 'mexico', 'lebanon', 'portugal',
  'india', 'ethiopia', 'greece', 'brazil', 'korea',
  'hungary', 'turkey', 'nigeria', 'albania', 'thailand',
] as const
