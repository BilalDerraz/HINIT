import { RULES } from '../server/rules.js';
import { freeSlots, bookingRange } from '../server/slots.js';
import { fromZoned, addDays, parseDateKey, compareDays, dateKey } from '../server/time.js';
import { busyBetween } from '../server/google.js';
import { json } from '../server/http.js';

/**
 * GET /api/availability[?from=YYYY-MM-DD&to=YYYY-MM-DD]
 *
 * → { timeZone, from, to, days: { 'YYYY-MM-DD': ['09:00', '09:30', …] } }
 *
 * Days without a free slot are simply absent. The range is clamped to
 * today … today + horizon, whatever the caller asks for. Only busy/free is
 * read from the diary — never what the appointments are.
 */
export default async function handler(req, res) {
  if (req.method !== 'GET') return json(res, 405, { error: 'method_not_allowed' });

  const now = new Date();
  const range = bookingRange({ now });
  const from = clamp(parseDateKey(req.query?.from) || range.from, range);
  const to = clamp(parseDateKey(req.query?.to) || range.to, range);
  if (compareDays(from, to) > 0) return json(res, 400, { error: 'bad_range' });

  try {
    const busy = await busyBetween(
      fromZoned(from, RULES.timeZone),
      fromZoned(addDays(to, 1), RULES.timeZone)
    );
    const days = freeSlots({ from, to, busy, now });
    return json(res, 200, { timeZone: RULES.timeZone, from: dateKey(from), to: dateKey(to), days });
  } catch (err) {
    console.error('availability:', err);
    return json(res, 502, { error: 'calendar_unavailable' });
  }
}

function clamp(day, { from, to }) {
  if (compareDays(day, from) < 0) return from;
  if (compareDays(day, to) > 0) return to;
  return day;
}
