import { RULES } from './rules.js';
import { fromZoned, toZoned, addDays, compareDays, dateKey, parseTime, minutesToHHMM } from './time.js';

/**
 * Pure slot arithmetic. Given a date range, the diary's busy intervals and
 * "now", return every slot a visitor may book — keyed by day, as HH:MM start
 * times in the rules' time zone.
 *
 * No I/O here on purpose: the same function decides what the calendar shows
 * *and* whether a booking request is allowed, and it can be tested without
 * a Google account (see slots.test.mjs).
 */
export function freeSlots({ from, to, busy = [], now = new Date(), rules = RULES }) {
  const tz = rules.timeZone;
  const slotMs = rules.slotMinutes * 60_000;
  const bufferMs = rules.bufferMinutes * 60_000;
  const earliest = now.getTime() + rules.minNoticeHours * 3_600_000;

  // Expand busy blocks by the buffer once, so the overlap test below is plain.
  const blocks = busy
    .map((b) => ({ start: b.start.getTime() - bufferMs, end: b.end.getTime() + bufferMs }))
    .filter((b) => b.end > b.start);

  const days = {};
  for (let d = from; compareDays(d, to) <= 0; d = addDays(d, 1)) {
    // weekday of this calendar day: noon local avoids any DST edge at midnight
    const noon = fromZoned({ ...d, hour: 12 }, tz);
    if (!rules.workDays.includes(toZoned(noon, tz).weekday)) continue;

    const times = [];
    for (const [open, close] of rules.windows) {
      const openMin = parseTime(open);
      const closeMin = parseTime(close);
      for (let m = openMin; m + rules.slotMinutes <= closeMin; m += rules.slotMinutes) {
        const start = fromZoned({ ...d, hour: Math.floor(m / 60), minute: m % 60 }, tz).getTime();
        const end = start + slotMs;
        if (start < earliest) continue;
        if (blocks.some((b) => start < b.end && end > b.start)) continue;
        times.push(minutesToHHMM(m));
      }
    }
    if (times.length) days[dateKey(d)] = times;
  }
  return days;
}

/** Is this exact slot bookable right now? Same rules, one day, fresh `busy`. */
export function isSlotFree({ day, time, busy, now, rules = RULES }) {
  const free = freeSlots({ from: day, to: day, busy, now, rules });
  return (free[dateKey(day)] || []).includes(time);
}

/** Start and end instants of a slot, for the calendar event. */
export function slotInterval({ day, time, rules = RULES }) {
  const m = parseTime(time);
  const start = fromZoned({ ...day, hour: Math.floor(m / 60), minute: m % 60 }, rules.timeZone);
  return { start, end: new Date(start.getTime() + rules.slotMinutes * 60_000) };
}

/** The window the calendar may show: today through the horizon, as days. */
export function bookingRange({ now = new Date(), rules = RULES } = {}) {
  const today = toZoned(now, rules.timeZone);
  const from = { year: today.year, month: today.month, day: today.day };
  return { from, to: addDays(from, rules.horizonDays) };
}
