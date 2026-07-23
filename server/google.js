/**
 * The smallest possible Google Calendar client: refresh an OAuth token, ask
 * for busy time, insert an event. Plain fetch, no SDK — three endpoints do
 * not justify a dependency.
 *
 * Auth is a refresh token for the owner's own Google account (a personal
 * Gmail cannot delegate to a service account). It is minted once with
 * scripts/google-auth.mjs and lives in Vercel's environment, never in the
 * repo. Scopes:
 *   calendar.freebusy — read busy/free (no event details)
 *   calendar.events   — create the appointment
 */

const TOKEN_URL = 'https://oauth2.googleapis.com/token';
const API = 'https://www.googleapis.com/calendar/v3';

export const SCOPES = [
  'https://www.googleapis.com/auth/calendar.freebusy',
  'https://www.googleapis.com/auth/calendar.events',
];

/** Environment, checked up front so a missing variable is a clear message. */
export function config() {
  const need = ['GOOGLE_CLIENT_ID', 'GOOGLE_CLIENT_SECRET', 'GOOGLE_REFRESH_TOKEN'];
  const missing = need.filter((k) => !process.env[k]);
  if (missing.length) throw new Error(`Google Calendar is not configured: set ${missing.join(', ')}`);
  return {
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
    calendarId: process.env.GOOGLE_CALENDAR_ID || 'primary',
  };
}

// One access token per warm function instance; refreshed a minute early.
let cached = { token: null, expires: 0 };

export async function accessToken() {
  if (cached.token && Date.now() < cached.expires - 60_000) return cached.token;
  const { clientId, clientSecret, refreshToken } = config();
  const res = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
      grant_type: 'refresh_token',
    }),
  });
  if (!res.ok) throw new Error(`Google token refresh failed: ${res.status} ${await res.text()}`);
  const data = await res.json();
  cached = { token: data.access_token, expires: Date.now() + data.expires_in * 1000 };
  return cached.token;
}

async function call(path, { method = 'GET', query, body } = {}) {
  const token = await accessToken();
  const url = new URL(`${API}${path}`);
  if (query) Object.entries(query).forEach(([k, v]) => url.searchParams.set(k, v));
  const res = await fetch(url, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
      ...(body ? { 'Content-Type': 'application/json' } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) throw new Error(`Google Calendar ${method} ${path} → ${res.status} ${await res.text()}`);
  return res.json();
}

/** Busy intervals on the calendar between two instants, as { start, end } Dates. */
export async function busyBetween(timeMin, timeMax) {
  const { calendarId } = config();
  const data = await call('/freeBusy', {
    method: 'POST',
    body: { timeMin: timeMin.toISOString(), timeMax: timeMax.toISOString(), items: [{ id: calendarId }] },
  });
  const cal = data.calendars?.[calendarId];
  if (cal?.errors?.length) throw new Error(`freeBusy: ${JSON.stringify(cal.errors)}`);
  return (cal?.busy || []).map((b) => ({ start: new Date(b.start), end: new Date(b.end) }));
}

/**
 * Create the appointment, invite the visitor and attach a Google Meet link.
 * `sendUpdates=all` makes Google email the invitation — that *is* the
 * confirmation the visitor receives.
 */
export async function createAppointment({ start, end, timeZone, summary, description, attendee }) {
  const { calendarId } = config();
  return call(`/calendars/${encodeURIComponent(calendarId)}/events`, {
    method: 'POST',
    query: { conferenceDataVersion: '1', sendUpdates: 'all' },
    body: {
      summary,
      description,
      start: { dateTime: start.toISOString(), timeZone },
      end: { dateTime: end.toISOString(), timeZone },
      attendees: [{ email: attendee.email, displayName: attendee.name }],
      conferenceData: {
        createRequest: { requestId: crypto.randomUUID(), conferenceSolutionKey: { type: 'hangoutsMeet' } },
      },
      guestsCanInviteOthers: false,
      guestsCanSeeOtherGuests: false,
      reminders: { useDefault: true },
    },
  });
}
