import { test } from 'node:test';
import assert from 'node:assert/strict';
import { freeSlots, isSlotFree, slotInterval } from './slots.js';
import { fromZoned, tzOffsetMs, parseDateKey } from './time.js';

const TZ = 'Europe/Amsterdam';
const rules = {
  timeZone: TZ,
  workDays: [1, 2, 3, 4, 5],
  windows: [['09:00', '12:00'], ['13:00', '17:00']],
  slotMinutes: 30,
  bufferMinutes: 15,
  minNoticeHours: 24,
  horizonDays: 90,
};
// a Monday in January, "now" well before the range so notice never bites
const mon = { year: 2026, month: 1, day: 12 };
const longAgo = new Date('2026-01-01T00:00:00Z');

test('time zone: winter and summer offsets, DST-day conversion', () => {
  assert.equal(tzOffsetMs(new Date('2026-01-12T12:00:00Z'), TZ), 3_600_000);
  assert.equal(tzOffsetMs(new Date('2026-07-12T12:00:00Z'), TZ), 7_200_000);
  // 09:00 Amsterdam on the Monday after the March 2026 switch (29 Mar) is 07:00Z
  assert.equal(fromZoned({ year: 2026, month: 3, day: 30, hour: 9 }, TZ).toISOString(), '2026-03-30T07:00:00.000Z');
  assert.equal(fromZoned({ year: 2026, month: 1, day: 12, hour: 9 }, TZ).toISOString(), '2026-01-12T08:00:00.000Z');
});

test('a free working day yields every slot in both windows', () => {
  const days = freeSlots({ from: mon, to: mon, busy: [], now: longAgo, rules });
  assert.deepEqual(days['2026-01-12'], [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
  ]);
});

test('weekends are skipped entirely', () => {
  const sat = { year: 2026, month: 1, day: 17 };
  const sun = { year: 2026, month: 1, day: 18 };
  const days = freeSlots({ from: sat, to: sun, busy: [], now: longAgo, rules });
  assert.deepEqual(days, {});
});

test('a busy block removes overlapping slots plus the buffer on each side', () => {
  // busy 10:00–11:00 local → with 15 min buffer blocks 09:45–11:15,
  // so 09:30 (ends 10:00, fine? no: 09:30–10:00 overlaps 09:45) and 11:00 go too
  const busy = [{ start: fromZoned({ ...mon, hour: 10 }, TZ), end: fromZoned({ ...mon, hour: 11 }, TZ) }];
  const days = freeSlots({ from: mon, to: mon, busy, now: longAgo, rules });
  assert.deepEqual(days['2026-01-12'].filter((t) => t < '13:00'), ['09:00', '11:30']);
});

test('minimum notice hides slots that start too soon', () => {
  // now = Sunday 11 Jan 10:00 local → nothing before Monday 10:00 local
  const now = fromZoned({ year: 2026, month: 1, day: 11, hour: 10 }, TZ);
  const days = freeSlots({ from: mon, to: mon, busy: [], now, rules });
  assert.equal(days['2026-01-12'][0], '10:00');
});

test('a day with nothing left is absent from the result', () => {
  const busy = [{ start: fromZoned({ ...mon, hour: 8 }, TZ), end: fromZoned({ ...mon, hour: 18 }, TZ) }];
  const days = freeSlots({ from: mon, to: mon, busy, now: longAgo, rules });
  assert.equal(days['2026-01-12'], undefined);
});

test('isSlotFree agrees with freeSlots; slotInterval is 30 minutes in the zone', () => {
  const busy = [{ start: fromZoned({ ...mon, hour: 14 }, TZ), end: fromZoned({ ...mon, hour: 15 }, TZ) }];
  assert.equal(isSlotFree({ day: mon, time: '13:00', busy, now: longAgo, rules }), true);
  assert.equal(isSlotFree({ day: mon, time: '14:00', busy, now: longAgo, rules }), false);
  assert.equal(isSlotFree({ day: mon, time: '12:00', busy: [], now: longAgo, rules }), false); // lunch
  assert.equal(isSlotFree({ day: mon, time: '09:07', busy: [], now: longAgo, rules }), false); // off-grid
  const { start, end } = slotInterval({ day: mon, time: '13:00', rules });
  assert.equal(start.toISOString(), '2026-01-12T12:00:00.000Z');
  assert.equal(end.getTime() - start.getTime(), 30 * 60_000);
});

test('parseDateKey rejects impossible dates', () => {
  assert.deepEqual(parseDateKey('2026-02-28'), { year: 2026, month: 2, day: 28 });
  assert.equal(parseDateKey('2026-02-30'), null);
  assert.equal(parseDateKey('2026-13-01'), null);
  assert.equal(parseDateKey('yesterday'), null);
});
