const TIME_ZONE = 'Europe/Kyiv'
const DAY_MS = 24 * 60 * 60 * 1000

/** Понеділок, з якого рахуємо тижні (календарна дата за Києвом) */
const EPOCH = { year: 2026, month: 1, day: 5 }
const EPOCH_DAY = Date.UTC(EPOCH.year, EPOCH.month - 1, EPOCH.day) / DAY_MS

const dateFmt = new Intl.DateTimeFormat('en-CA', {
  timeZone: TIME_ZONE,
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hourCycle: 'h23',
})

function kyivParts(ms: number) {
  const p = Object.fromEntries(dateFmt.formatToParts(ms).map(x => [x.type, Number(x.value)]))
  return p as Record<'year' | 'month' | 'day' | 'hour' | 'minute' | 'second', number>
}

/** Номер календарного дня за Києвом (дні від 1970-01-01) */
function kyivDayNumber(ms: number) {
  const p = kyivParts(ms)
  return Date.UTC(p.year, p.month - 1, p.day) / DAY_MS
}

/** Зсув Києва від UTC у мс для заданого моменту (враховує літній час) */
function kyivOffset(ms: number) {
  const p = kyivParts(ms)
  return Date.UTC(p.year, p.month - 1, p.day, p.hour, p.minute, p.second) - Math.floor(ms / 1000) * 1000
}

/** UTC-момент київської півночі заданого календарного дня */
function kyivMidnight(dayNumber: number) {
  const asUtc = dayNumber * DAY_MS
  // Двічі, бо зсув у момент півночі може відрізнятись від зсуву в момент першого наближення
  const guess = asUtc - kyivOffset(asUtc)
  return asUtc - kyivOffset(guess)
}

export function weekIndex(date = new Date()) {
  return Math.floor((kyivDayNumber(date.getTime()) - EPOCH_DAY) / 7)
}

/** Межі тижня з номером `index`: понеділок 00:00 — наступний понеділок 00:00 за Києвом */
export function weekBounds(index: number) {
  const startDay = EPOCH_DAY + index * 7
  return {
    startsAt: new Date(kyivMidnight(startDay)),
    endsAt: new Date(kyivMidnight(startDay + 7)),
  }
}

export function rotationSlot(index: number, length: number) {
  return ((index % length) + length) % length
}
