import { RULES } from '../server/rules.js';
import { isSlotFree, slotInterval, bookingRange } from '../server/slots.js';
import { fromZoned, addDays, parseDateKey, parseTime, compareDays } from '../server/time.js';
import { busyBetween, createAppointment } from '../server/google.js';
import { json, readBody, isEmail } from '../server/http.js';

/**
 * POST /api/book  { name, email, date: 'YYYY-MM-DD', time: 'HH:MM', message?, website? }
 *
 * → 200 { ok: true, meetLink, start, end }
 * → 400 { error: 'invalid', fields: [...] }   something is missing or malformed
 * → 409 { error: 'slot_unavailable' }          taken meanwhile, too soon, or off the grid
 * → 502 { error: 'calendar_unavailable' }      Google did not answer
 *
 * The slot is re-checked against the live diary right before the event is
 * created, so two visitors picking the same moment cannot both get it.
 */
export default async function handler(req, res) {
  if (req.method !== 'POST') return json(res, 405, { error: 'method_not_allowed' });

  const body = readBody(req);
  // honeypot: a filled "website" field is a bot — pretend it worked
  if (body.website) return json(res, 200, { ok: true });

  const name = String(body.name || '').trim().slice(0, 100);
  const email = String(body.email || '').trim();
  const message = String(body.message || '').trim().slice(0, 2000);
  const day = parseDateKey(body.date);
  const time = parseTime(body.time) == null ? null : String(body.time);

  const fields = [];
  if (name.length < 2) fields.push('name');
  if (!isEmail(email)) fields.push('email');
  if (!day) fields.push('date');
  if (!time) fields.push('time');
  if (fields.length) return json(res, 400, { error: 'invalid', fields });

  const now = new Date();
  const range = bookingRange({ now });
  if (compareDays(day, range.from) < 0 || compareDays(day, range.to) > 0) {
    return json(res, 409, { error: 'slot_unavailable' });
  }

  try {
    const busy = await busyBetween(fromZoned(day, RULES.timeZone), fromZoned(addDays(day, 1), RULES.timeZone));
    if (!isSlotFree({ day, time, busy, now })) return json(res, 409, { error: 'slot_unavailable' });

    const { start, end } = slotInterval({ day, time });
    const event = await createAppointment({
      start,
      end,
      timeZone: RULES.timeZone,
      summary: `Kennismaking HinIT — ${name}`,
      description: [
        `Naam: ${name}`,
        `E-mail: ${email}`,
        message ? '' : null,
        message ? `Waar het over moet gaan:\n${message}` : null,
        '',
        'Geboekt via hinit.nl',
      ]
        .filter((l) => l != null)
        .join('\n'),
      attendee: { name, email },
    });

    return json(res, 200, {
      ok: true,
      meetLink: event.hangoutLink || null,
      start: start.toISOString(),
      end: end.toISOString(),
    });
  } catch (err) {
    console.error('book:', err);
    return json(res, 502, { error: 'calendar_unavailable' });
  }
}
