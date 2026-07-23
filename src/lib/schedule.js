/**
 * Date helpers for the appointment picker.
 *
 * Availability itself is real: it comes from the owner's Google Calendar via
 * /api/availability (see server/ and src/lib/calendar.js). This file only
 * knows how to lay out a month and which days are even eligible — working
 * days inside the horizon — so the grid can render before the diary answers.
 */

/** Mirrors `horizonDays` in server/rules.js — the server clamps to it anyway. */
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

/**
 * Could this day be bookable at all? Working days only, inside the horizon.
 * The diary has the final say (see `availableDays` in Booking.jsx); this just
 * keeps weekends and far-future months from ever looking clickable.
 */
export function isBookable(date, today = startOfDay(new Date())) {
  const d = startOfDay(date);
  if (d <= today) return false; // same-day booking needs a phone call
  const horizon = startOfDay(new Date(today));
  horizon.setDate(horizon.getDate() + BOOKING_HORIZON_DAYS);
  if (d > horizon) return false;
  return weekdayIndex(d) <= 4; // no weekends
}

/** Split a day's free HH:MM times into the two groups the picker shows. */
export function splitSlots(times = []) {
  const morning = [];
  const afternoon = [];
  for (const time of times) (time < '12:00' ? morning : afternoon).push({ time });
  return { morning, afternoon };
}

/** "donderdag 21 augustus" — built from the i18n month/weekday names. */
export function formatLongDate(date, tb) {
  return `${tb.weekdaysFull[weekdayIndex(date)]} ${date.getDate()} ${tb.months[date.getMonth()]}`;
}
