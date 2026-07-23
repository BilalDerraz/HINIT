/**
 * Just enough time-zone arithmetic to turn "Monday 09:00 in Amsterdam" into
 * an instant and back, without a date library. Built on Intl, which every
 * supported Node has.
 */

const DTF = new Map();
function formatter(tz) {
  if (!DTF.has(tz)) {
    DTF.set(
      tz,
      new Intl.DateTimeFormat('en-US', {
        timeZone: tz,
        hourCycle: 'h23',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        weekday: 'short',
      })
    );
  }
  return DTF.get(tz);
}

const WEEKDAYS = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };

/** Wall-clock parts of an instant in `tz`. */
export function toZoned(instant, tz) {
  const parts = Object.fromEntries(formatter(tz).formatToParts(instant).map((p) => [p.type, p.value]));
  return {
    year: +parts.year,
    month: +parts.month, // 1–12
    day: +parts.day,
    hour: +parts.hour,
    minute: +parts.minute,
    second: +parts.second,
    weekday: WEEKDAYS[parts.weekday],
  };
}

/** Offset of `tz` from UTC at `instant`, in milliseconds (CEST → +7 200 000). */
export function tzOffsetMs(instant, tz) {
  const z = toZoned(instant, tz);
  const asUtc = Date.UTC(z.year, z.month - 1, z.day, z.hour, z.minute, z.second);
  return asUtc - Math.floor(instant.getTime() / 1000) * 1000;
}

/**
 * The instant at which the wall clock in `tz` reads the given time. Correct
 * across DST changes: the offset is looked up at the guess and re-checked at
 * the result, which settles the hour either side of a transition.
 */
export function fromZoned({ year, month, day, hour = 0, minute = 0 }, tz) {
  const guess = Date.UTC(year, month - 1, day, hour, minute);
  const first = guess - tzOffsetMs(new Date(guess), tz);
  const second = guess - tzOffsetMs(new Date(first), tz);
  return new Date(second);
}

/** "YYYY-MM-DD" → { year, month, day }, or null if it is not one. */
export function parseDateKey(key) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(key || ''));
  if (!m) return null;
  const [year, month, day] = [+m[1], +m[2], +m[3]];
  if (month < 1 || month > 12 || day < 1 || day > 31) return null;
  // reject 31 February and friends
  const probe = new Date(Date.UTC(year, month - 1, day));
  if (probe.getUTCMonth() !== month - 1 || probe.getUTCDate() !== day) return null;
  return { year, month, day };
}

/** "HH:MM" → minutes since midnight, or null. */
export function parseTime(hhmm) {
  const m = /^(\d{2}):(\d{2})$/.exec(String(hhmm || ''));
  if (!m) return null;
  const h = +m[1];
  const min = +m[2];
  if (h > 23 || min > 59) return null;
  return h * 60 + min;
}

export const pad2 = (n) => String(n).padStart(2, '0');
export const dateKey = ({ year, month, day }) => `${year}-${pad2(month)}-${pad2(day)}`;
export const minutesToHHMM = (m) => `${pad2(Math.floor(m / 60))}:${pad2(m % 60)}`;

/** The calendar day `n` days after the given one (pure date arithmetic, no tz). */
export function addDays({ year, month, day }, n) {
  const d = new Date(Date.UTC(year, month - 1, day + n));
  return { year: d.getUTCFullYear(), month: d.getUTCMonth() + 1, day: d.getUTCDate() };
}

export const compareDays = (a, b) => dateKey(a).localeCompare(dateKey(b));
