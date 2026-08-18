/**
 * Availability rules for the appointment picker.
 *
 * There is no backend yet, so availability is *simulated* — but it is
 * simulated deterministically: the same date always yields the same slots,
 * which means the calendar never shuffles under the visitor between renders.
 *
 * When a real scheduling backend arrives, `isBookable` and `slotsFor` are the
 * only two functions that need to change.
 */

export const BOOKING_HORIZON_DAYS = 90;

export function startOfDay(d) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

/** Stable YYYY-MM-DD key in local time (avoids the UTC shift of toISOString). */
export function toKey(d) {
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${m}-${day}`;
}

export const sameDay = (a, b) => a && b && toKey(a) === toKey(b);

/** Monday-first weekday index: 0 = Monday … 6 = Sunday. */
export const weekdayIndex = (d) => (d.getDay() + 6) % 7;

/** Small stable hash so "busy" days and slots stay put across renders. */
function hash(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0) / 4294967295;
}

/**
 * Weeks for a month as a 6×7 grid, padded with the neighbouring months so
 * every row is full. Each cell is { date, inMonth }.
 */
export function monthMatrix(year, month) {
  const first = new Date(year, month, 1);
  const lead = weekdayIndex(first);
  const cells = [];
  for (let i = 0; i < 42; i++) {
    const date = new Date(year, month, 1 - lead + i);
    cells.push({ date, inMonth: date.getMonth() === month });
  }
  const weeks = [];
  for (let i = 0; i < 42; i += 7) weeks.push(cells.slice(i, i + 7));
  // Drop trailing weeks that belong entirely to the next month. A 28-day
  // February starting on a Monday leaves *two* of them, so loop rather than
  // checking only the last row.
  while (weeks.length > 4 && weeks[weeks.length - 1].every((c) => !c.inMonth)) weeks.pop();
  return weeks;
}

/** Can this day be booked at all? Working days only, inside the horizon. */
export function isBookable(date, today = startOfDay(new Date())) {
  const d = startOfDay(date);
  if (d <= today) return false; // same-day booking needs a phone call
  const horizon = startOfDay(new Date(today));
  horizon.setDate(horizon.getDate() + BOOKING_HORIZON_DAYS);
  if (d > horizon) return false;
  const wd = weekdayIndex(d);
  if (wd > 4) return false; // no weekends
  // roughly one working day in seven is already full
  return hash(`day:${toKey(d)}`) > 0.14;
}

const MORNING = ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30'];
const AFTERNOON = ['13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'];

/**
 * Slots for a bookable day, split into morning and afternoon. Around a third
 * are marked taken so the calendar feels like a real diary rather than an
 * empty grid.
 */
export function slotsFor(date) {
  if (!date) return { morning: [], afternoon: [] };
  const key = toKey(date);
  const build = (times) =>
    times.map((time) => ({ time, taken: hash(`slot:${key}:${time}`) < 0.34 }));
  return { morning: build(MORNING), afternoon: build(AFTERNOON) };
}

export const hasFreeSlot = (date) => {
  const { morning, afternoon } = slotsFor(date);
  return [...morning, ...afternoon].some((s) => !s.taken);
};

/** "donderdag 21 augustus" — built from the i18n month/weekday names. */
export function formatLongDate(date, tb) {
  return `${tb.weekdaysFull[weekdayIndex(date)]} ${date.getDate()} ${tb.months[date.getMonth()]}`;
}
