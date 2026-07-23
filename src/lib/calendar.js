/**
 * The two calls the appointment picker makes to its own backend (the Vercel
 * functions in /api). Same origin, so no CORS and no third-party request
 * from the browser — the functions talk to Google, the visitor never does.
 */

export class BookingError extends Error {
  constructor(code, status) {
    super(code);
    this.code = code; // 'slot_unavailable' | 'calendar_unavailable' | 'invalid' | 'network'
    this.status = status;
  }
}

async function parse(res) {
  try {
    return await res.json();
  } catch {
    return {};
  }
}

/** Free slots per day: { 'YYYY-MM-DD': ['09:00', …] } for the whole horizon. */
export async function fetchAvailability({ signal } = {}) {
  let res;
  try {
    res = await fetch('/api/availability', { signal, headers: { Accept: 'application/json' } });
  } catch (err) {
    if (err?.name === 'AbortError') throw err;
    throw new BookingError('network');
  }
  const data = await parse(res);
  if (!res.ok) throw new BookingError(data.error || 'calendar_unavailable', res.status);
  return data.days || {};
}

/** Book a slot. Resolves to { meetLink, start, end }; throws a BookingError. */
export async function bookSlot(payload) {
  let res;
  try {
    res = await fetch('/api/book', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(payload),
    });
  } catch {
    throw new BookingError('network');
  }
  const data = await parse(res);
  if (!res.ok || !data.ok) throw new BookingError(data.error || 'calendar_unavailable', res.status);
  return data;
}
