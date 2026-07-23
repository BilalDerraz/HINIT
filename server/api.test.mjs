import { test, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { fromZoned, toZoned, addDays, dateKey } from './time.js';

process.env.GOOGLE_CLIENT_ID = 'id';
process.env.GOOGLE_CLIENT_SECRET = 'secret';
process.env.GOOGLE_REFRESH_TOKEN = 'rt';

const { default: availability } = await import('../api/availability.js');
const { default: book } = await import('../api/book.js');

const TZ = 'Europe/Amsterdam';
// The handlers use the real clock, so pick a working day a week out — far
// enough that minimum notice never trims the morning.
const today = toZoned(new Date(), TZ);
let d = addDays({ year: today.year, month: today.month, day: today.day }, 7);
while (![1, 2, 3, 4, 5].includes(toZoned(fromZoned({ ...d, hour: 12 }, TZ), TZ).weekday)) d = addDays(d, 1);
const day = dateKey(d);
let busy;
let inserted;

/** Stand-in for Google: token refresh, freeBusy and events.insert. */
beforeEach(() => {
  // "busy" 10:00–11:00 local on that day
  busy = [{ start: fromZoned({ ...d, hour: 10 }, TZ), end: fromZoned({ ...d, hour: 11 }, TZ) }];
  inserted = null;
  globalThis.fetch = async (url, init = {}) => {
    const u = String(url);
    const ok = (body) => new Response(JSON.stringify(body), { status: 200, headers: { 'Content-Type': 'application/json' } });
    if (u.startsWith('https://oauth2.googleapis.com/token')) return ok({ access_token: 'at', expires_in: 3600 });
    if (u.includes('/freeBusy')) {
      return ok({ calendars: { primary: { busy: busy.map((b) => ({ start: b.start.toISOString(), end: b.end.toISOString() })) } } });
    }
    if (u.includes('/calendars/primary/events')) {
      inserted = { url: u, body: JSON.parse(init.body) };
      return ok({ id: 'evt1', hangoutLink: 'https://meet.google.com/abc-defg-hij' });
    }
    throw new Error(`unexpected fetch ${u}`);
  };
});

function fakeRes() {
  const res = { statusCode: 200, headers: {}, body: '' };
  res.status = (c) => ((res.statusCode = c), res);
  res.setHeader = (k, v) => (res.headers[k] = v);
  res.end = (b) => (res.body = b);
  res.json = () => JSON.parse(res.body);
  return res;
}

test('availability: returns free slots for the requested range, minus busy time', async () => {
  const res = fakeRes();
  await availability({ method: 'GET', query: { from: day, to: day } }, res);
  assert.equal(res.statusCode, 200);
  const data = res.json();
  assert.equal(data.timeZone, TZ);
  assert.deepEqual(data.days[day].filter((t) => t < '13:00'), ['09:00', '11:30']);
  assert.equal(res.headers['Cache-Control'], 'no-store');
});

test('availability: rejects other methods, clamps the range to the horizon', async () => {
  let res = fakeRes();
  await availability({ method: 'POST', query: {} }, res);
  assert.equal(res.statusCode, 405);

  res = fakeRes();
  await availability({ method: 'GET', query: { from: '1999-01-01', to: '1999-01-02' } }, res);
  assert.equal(res.statusCode, 200);
  const data = res.json();
  assert.notEqual(data.from, '1999-01-01'); // clamped to today
  assert.equal(data.from, data.to);
});

test('book: validates input', async () => {
  const res = fakeRes();
  await book({ method: 'POST', body: { name: 'A', email: 'nope', date: 'x', time: '9' } }, res);
  assert.equal(res.statusCode, 400);
  assert.deepEqual(res.json().fields, ['name', 'email', 'date', 'time']);
});

test('book: a filled honeypot is swallowed', async () => {
  const res = fakeRes();
  await book({ method: 'POST', body: { website: 'spam', name: 'Bot', email: 'b@b.io', date: day, time: '09:00' } }, res);
  assert.equal(res.statusCode, 200);
  assert.equal(inserted, null);
});

test('book: a busy or off-grid slot is refused with 409', async () => {
  for (const time of ['10:00', '10:30', '12:00', '09:07']) {
    const res = fakeRes();
    await book({ method: 'POST', body: { name: 'Bilal Test', email: 'b@example.com', date: day, time } }, res);
    assert.equal(res.statusCode, 409, time);
    assert.equal(res.json().error, 'slot_unavailable');
  }
  assert.equal(inserted, null);
});

test('book: a free slot creates the event with attendee, Meet link and message', async () => {
  const res = fakeRes();
  await book(
    { method: 'POST', body: { name: 'Bilal Test', email: 'b@example.com', date: day, time: '13:00', message: 'Is onze mail veilig?' } },
    res
  );
  assert.equal(res.statusCode, 200, res.body);
  const data = res.json();
  assert.equal(data.ok, true);
  assert.equal(data.meetLink, 'https://meet.google.com/abc-defg-hij');
  assert.equal(data.start, fromZoned({ ...d, hour: 13 }, TZ).toISOString());

  assert.match(inserted.url, /conferenceDataVersion=1/);
  assert.match(inserted.url, /sendUpdates=all/);
  const ev = inserted.body;
  assert.equal(ev.summary, 'Kennismaking HinIT — Bilal Test');
  assert.deepEqual(ev.attendees, [{ email: 'b@example.com', displayName: 'Bilal Test' }]);
  assert.equal(ev.start.timeZone, TZ);
  assert.equal(ev.conferenceData.createRequest.conferenceSolutionKey.type, 'hangoutsMeet');
  assert.match(ev.description, /Is onze mail veilig\?/);
});

test('book: Google failure surfaces as 502, nothing invented', async () => {
  globalThis.fetch = async () => new Response('boom', { status: 500 });
  const res = fakeRes();
  await book({ method: 'POST', body: { name: 'Bilal Test', email: 'b@example.com', date: day, time: '13:00' } }, res);
  assert.equal(res.statusCode, 502);
  assert.equal(res.json().error, 'calendar_unavailable');
});
