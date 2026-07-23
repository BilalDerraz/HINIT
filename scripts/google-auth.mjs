#!/usr/bin/env node
/**
 * One-time: get a Google refresh token for the calendar the site books into.
 *
 *   GOOGLE_CLIENT_ID=… GOOGLE_CLIENT_SECRET=… node scripts/google-auth.mjs
 *
 * (or run it bare and paste both when asked). It prints a URL; open it,
 * sign in with the Google account whose calendar it is, allow the two
 * permissions, and the script prints the GOOGLE_REFRESH_TOKEN to put in
 * Vercel. Nothing is written to disk.
 *
 * Prerequisites, all in https://console.cloud.google.com — see README:
 *   1. a project with the "Google Calendar API" enabled
 *   2. OAuth consent screen: External, publishing status "In production"
 *      (in "Testing" the refresh token dies after 7 days)
 *   3. an OAuth client of type "Desktop app" → the client ID and secret
 */
import http from 'node:http';
import readline from 'node:readline/promises';
import { stdin, stdout } from 'node:process';
import { SCOPES } from '../server/google.js';
import { preferIPv4 } from '../server/net-local.js';

preferIPv4();

const rl = readline.createInterface({ input: stdin, output: stdout });
const clientId = process.env.GOOGLE_CLIENT_ID || (await rl.question('OAuth client ID: ')).trim();
const clientSecret = process.env.GOOGLE_CLIENT_SECRET || (await rl.question('OAuth client secret: ')).trim();
rl.close();
if (!clientId || !clientSecret) {
  console.error('Both the client ID and the client secret are needed.');
  process.exit(1);
}

// A throwaway local server catches Google's redirect with the auth code.
//
// The port is fixed, not random. A "Desktop app" client accepts any loopback
// port, but a "Web application" client only accepts redirect URIs registered
// in the console beforehand — and you cannot register a port you don't know
// yet. A fixed port works for both. Override with --port if 8976 is taken.
const portArg = process.argv.indexOf('--port');
const port = Number(portArg > -1 ? process.argv[portArg + 1] : process.env.GOOGLE_OAUTH_PORT) || 8976;
const server = http.createServer();
try {
  await new Promise((ok, no) => server.listen(port, '127.0.0.1', ok).on('error', no));
} catch (err) {
  console.error(
    `Could not listen on 127.0.0.1:${port} — ${err.code}.` +
      (err.code === 'EADDRINUSE' ? ' Something else has it; try `--port 8977`.' : '')
  );
  process.exit(1);
}
const redirectUri = `http://127.0.0.1:${port}/`;

console.log(`\nIf this is a "Web application" client, open the client in the Cloud Console`);
console.log(`(APIs & Services → Credentials) and add exactly this under`);
console.log(`"Authorized redirect URIs", then save and wait a few seconds:\n`);
console.log(`    ${redirectUri}\n`);
console.log(`A "Desktop app" client needs no such registration.`);

const auth = new URL('https://accounts.google.com/o/oauth2/v2/auth');
auth.search = new URLSearchParams({
  client_id: clientId,
  redirect_uri: redirectUri,
  response_type: 'code',
  scope: SCOPES.join(' '),
  access_type: 'offline', // → refresh token
  prompt: 'consent', // always issue one, even if consent was given before
});
console.log('\nOpen this in a browser, signed in as the calendar owner:\n');
console.log(auth.toString());
console.log('\nWaiting for Google to call back…');

// Two ways the code can arrive: Google's redirect hits the local server, or
// — when the browser cannot reach it, which happens under WSL and on a
// remote machine — the operator pastes the redirected URL back here.
const caught = new Promise((resolve, reject) => {
  server.on('request', (req, res) => {
    const url = new URL(req.url, redirectUri);
    if (url.pathname !== '/') return res.writeHead(404).end();
    const err = url.searchParams.get('error');
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(
      `<p style="font-family:sans-serif">${
        err ? `Google returned an error: <b>${err}</b>.` : 'Done.'
      } You can close this tab and go back to the terminal.</p>`
    );
    err ? reject(new Error(err)) : resolve(url.searchParams.get('code'));
  });
});

const paste = readline.createInterface({ input: stdin, output: stdout });
let done = false;

/** Keep asking until something with a usable ?code= turns up. A typo or a
    stray Enter must not abort the flow — the redirect may still land. */
async function askForPaste() {
  while (!done) {
    const answer = (
      await paste.question(
        '\n…or, if the browser cannot open 127.0.0.1 (common under WSL), approve anyway,\n' +
          'then copy the whole address bar URL and paste it here:\n\n> '
      )
    ).trim();
    if (done) break;
    if (!answer) continue;
    try {
      const code = answer.startsWith('http') ? new URL(answer).searchParams.get('code') : answer;
      if (code) return code;
      console.log('  That URL has no ?code= in it. Approve first, then copy the whole URL.');
    } catch {
      console.log('  Could not read that as a URL — paste the whole thing, or just the code.');
    }
  }
  return new Promise(() => {}); // the server won; stop competing
}

const code = await Promise.race([caught, askForPaste()]).finally(() => {
  done = true;
  server.close();
  paste.close();
});

const res = await fetch('https://oauth2.googleapis.com/token', {
  method: 'POST',
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  body: new URLSearchParams({
    code,
    client_id: clientId,
    client_secret: clientSecret,
    redirect_uri: redirectUri,
    grant_type: 'authorization_code',
  }),
});
const data = await res.json();
if (!res.ok || !data.refresh_token) {
  console.error('\nToken exchange failed:', JSON.stringify(data, null, 2));
  console.error('No refresh_token in the reply usually means consent was skipped — run again and approve both permissions.');
  process.exit(1);
}

console.log('\nAdd these to the Vercel project (Settings → Environment Variables), Production + Preview:\n');
console.log(`GOOGLE_CLIENT_ID=${clientId}`);
console.log(`GOOGLE_CLIENT_SECRET=${clientSecret}`);
console.log(`GOOGLE_REFRESH_TOKEN=${data.refresh_token}`);
console.log('GOOGLE_CALENDAR_ID=primary');
console.log('\nKeep the refresh token secret: it is a standing permission on your calendar.');
