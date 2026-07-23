/**
 * When HinIT can be booked. One object, so the availability endpoint and the
 * booking endpoint can never disagree about what a valid slot is.
 *
 * All wall-clock values are in `timeZone`; the functions run in UTC on Vercel
 * and convert (see time.js), so summer/winter time is handled.
 */
export const RULES = {
  timeZone: 'Europe/Amsterdam',
  /** JS weekday numbers: 0 = Sunday … 6 = Saturday. */
  workDays: [1, 2, 3, 4, 5],
  /** Bookable windows on a working day, as [start, end) in HH:MM. */
  windows: [
    ['09:00', '12:00'],
    ['13:00', '17:00'],
  ],
  /** Length of an intro call. Slots start every `slotMinutes`. */
  slotMinutes: 30,
  /** Breathing room kept free on both sides of anything already in the diary. */
  bufferMinutes: 15,
  /** Earliest a visitor may book, counted from the moment they look. */
  minNoticeHours: 24,
  /** How far ahead the calendar reaches. Mirrors BOOKING_HORIZON_DAYS in the client. */
  horizonDays: 90,
};
