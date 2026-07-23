#!/usr/bin/env node
/**
 * Preflight: does this machine's Google configuration actually work?
 *
 *   npm run check:google
 *
 * Reads .env.local (same file `vercel dev` uses), then does the two things
 * the site does — refresh the token, ask for busy time — and prints the
 * slots /api/availability would return. Nothing is written to the calendar
 * and no event is created.
 *
 * Run it after `npm run auth:google` and again after pasting the variables
 * into Vercel, so a bad credential is found here rather than by a visitor.
 */
import { existsSync } from 'node:fs';
import { RULES } from '../server/rules.js';
import { freeSlots, bookingRange } from '../server/slots.js';
import { fromZoned, addDays } from '../server/time.js';
import { accessToken, busyBetween, config, SCOPES } from '../server/google.js';
import { preferIPv4 } from '../server/net-local.js';

preferIPv4();

if (existsSync('.env.local')) {
  process.loadEnvFile('.env.local');
  console.log('Read .env.local');
} else {
  console.log('No .env.local — using the variables already in the environment');
}

// 1. the variables are there at all -------------------------------------------
let cfg;
try {
  cfg = config();
} catch (err) {
  fail(err.message, 'Run `npm run auth:google` and put the printed lines in .env.local.');
}
console.log(`\nClient ID   ${redact(cfg.clientId)}`);
console.log(`Secret      ${redact(cfg.clientSecret)}`);
console.log(`Refresh tok ${redact(cfg.refreshToken)}`);
console.log(`Calendar    ${cfg.calendarId}`);

// 2. the refresh token still works --------------------------------------------
let token;
try {
  token = await accessToken();
  console.log('\n✓ Token refresh works');
} catch (err) {
  fail(
    `Token refresh failed — ${err.message}`,
    'A refresh token dies if the OAuth consent screen is left in "Testing" (7 days),\n' +
      'if access was revoked at myaccount.google.com/permissions, or if the secret was\n' +
      'rotated. Mint a new one with `npm run auth:google`.'
  );
}

// 3. both permissions were actually granted -----------------------------------
// Consent can be given for one scope and not the other; availability then
// works and the first real booking fails with a 403. Catch that here.
const info = await (await fetch(`https://oauth2.googleapis.com/tokeninfo?access_token=${token}`)).json();
const granted = String(info.scope || '').split(' ');
const missing = SCOPES.filter((s) => !granted.includes(s));
if (missing.length) {
  fail(
    `The token is missing: ${missing.join(', ')}`,
    'Re-run `npm run auth:google` and tick every permission Google asks about.'
  );
}
console.log('✓ Both calendar permissions granted (freebusy + events)');

// 4. the calendar answers, and the site has something to show -----------------
const now = new Date();
const { from } = bookingRange({ now });
const to = addDays(from, 14);
let busy;
try {
  busy = await busyBetween(fromZoned(from, RULES.timeZone), fromZoned(addDays(to, 1), RULES.timeZone));
  console.log(`✓ free/busy read — ${busy.length} busy block(s) in the next 14 days`);
} catch (err) {
  fail(
    `Could not read free/busy — ${err.message}`,
    `Check that GOOGLE_CALENDAR_ID ("${cfg.calendarId}") is a calendar this account can see.`
  );
}

const days = freeSlots({ from, to, busy, now });
const keys = Object.keys(days);
const total = keys.reduce((n, k) => n + days[k].length, 0);
console.log(`\nThe picker would offer ${total} slot(s) across ${keys.length} day(s) of the next 14:`);
for (const k of keys.slice(0, 5)) {
  console.log(`  ${k}  ${days[k].slice(0, 8).join(' ')}${days[k].length > 8 ? ' …' : ''}`);
}
if (keys.length > 5) console.log(`  … and ${keys.length - 5} more day(s)`);
if (!total) {
  console.log(
    `\nNothing is bookable. That is correct if the diary is full, but check\n` +
      `server/rules.js — ${RULES.minNoticeHours}h notice, ${RULES.workDays.length} working days, windows ` +
      RULES.windows.map(([a, b]) => `${a}–${b}`).join(' and ') +
      `.`
  );
}
console.log(`\nAll good. The same variables in Vercel make hinit.nl book for real.`);

function redact(s) {
  return s.length > 12 ? `${s.slice(0, 6)}…${s.slice(-4)} (${s.length} chars)` : '(suspiciously short)';
}

function fail(what, hint) {
  console.error(`\n✗ ${what}\n\n${hint}`);
  process.exit(1);
}
