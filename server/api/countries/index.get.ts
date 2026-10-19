import { COUNTRIES, toSummary } from '../../data'

export default defineEventHandler(() => COUNTRIES.map(toSummary))
