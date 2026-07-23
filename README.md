# HinIT — marketing site

Marketing site for **HinIT**. The message the site sells is security —
"we protect you from hackers, viruses and fake emails" — with managed IT,
network and support around it. Calm, high-contrast design with a light/dark
theme, Dutch-first copy with an English mirror, and an appointment picker.

The copy is deliberately plain: no jargon, nothing a non-technical owner has
to look up. Keep it that way when editing `src/i18n.jsx`.

## Run it

```bash
cd site
npm install
npm run dev      # → http://localhost:5173
```

`npm run build` produces a production bundle in `dist/`; `npm run preview`
serves that bundle. `npm test` runs the booking logic tests.

The appointment picker talks to the two handlers in `api/`. On Vercel those
are serverless functions; locally `npm run dev` mounts the very same handlers
on the Vite dev server (`server/dev-api.js`), so the picker books for
real without the Vercel CLI. Put the Google variables in `.env.local` first —
without them `/api/availability` answers 502, the picker shows "the calendar
could not be loaded", and the dev server says which variables are missing.

`npm run preview` serves only the built `dist/`, so `/api/*` 404s there and the
picker cannot load however the credentials are set. Use `npm run dev` to test
booking.

## Stack

React 19 · Vite 6 · Tailwind CSS v4 · lucide-react. Animations are plain CSS
(`.reveal`, `.rise-in` in `src/index.css`) plus one canvas background.
A ~50-line hash router (`src/lib/router.js`), no state library.
Fonts are self-hosted (`public/fonts`, `src/fonts.css`) — the site makes **no
third-party requests at all**.

## Configuration

Copy `.env.example` to `.env.production` and set `VITE_FORM_ENDPOINT` to an
endpoint that accepts a JSON POST for the **contact form**. Without it the
form falls back to opening the visitor's mail client with everything
pre-filled — see `src/lib/submit.js`. Either way a message reaches someone;
nothing is ever silently dropped.

The **booking** form does not use that endpoint: it books straight into
Google Calendar through `api/book.js` (next section).

## Google Calendar

Deployed on Vercel. The site itself is static; `api/availability.js` and
`api/book.js` are Vercel functions that run with the owner's Google
credentials. The browser only ever talks to the site's own origin.

Rules (working days, 09:00–12:00 / 13:00–17:00, 30-minute slots, 15 minutes
buffer around existing appointments, 24 hours notice, 90 days ahead) live in
one place: `server/rules.js`. The slot arithmetic is pure and tested
(`server/slots.test.mjs`); the same function decides what the calendar shows
and whether a booking is accepted, and the slot is re-checked against the
live diary right before the event is created, so a double booking cannot
happen.

Booking creates an event on the owner's calendar with the visitor as guest and
a Google Meet link; Google's invitation email is the visitor's confirmation.
Only free/busy is read — never the contents of other appointments.

### One-time setup (personal Gmail)

1. <https://console.cloud.google.com> → create a project (any name).
2. **APIs & Services → Library** → enable **Google Calendar API**.
3. **APIs & Services → OAuth consent screen** → External. Fill in the app
   name and your email; add the scopes
   `…/auth/calendar.freebusy` and `…/auth/calendar.events`.
   Then **Publish app** so the status reads *In production*. Do not leave it
   in *Testing* — refresh tokens issued in testing expire after seven days.
   No verification is needed for your own account; you will click through an
   "unverified app" warning once.
4. **APIs & Services → Credentials → Create credentials → OAuth client ID**.
   Type **Desktop app** is simplest — it accepts any loopback port, so nothing
   else is needed. If you already made a **Web application** client, keep it and
   add this one line under *Authorized redirect URIs*, exactly:

       http://127.0.0.1:8976/

   A web client only accepts redirect URIs registered in advance; without this
   the sign-in stops at `redirect_uri_mismatch`. (`npm run auth:google --port N`
   if 8976 is taken — register the port you use.) Note the client ID and secret.
5. Locally: `npm run auth:google`, paste the ID and secret, open the printed
   URL signed in as the calendar owner, allow both permissions. The script
   prints the four `GOOGLE_*` variables.
6. Put those four lines in `.env.local` and run `npm run check:google`. It
   refreshes the token, confirms both permissions were granted and reads
   free/busy for real, then prints the slots the picker would offer. Nothing
   is written to the calendar.
7. Vercel → project → **Settings → Environment Variables** → add them for
   Production and Preview. Redeploy.

Not an API key. A Google Calendar **API key** (`AIza…`) cannot do either half
of this: it only reaches calendars that are public to the whole internet, and
it can never create an event. The booking flow needs the OAuth client above.

To revoke the site's access later: <https://myaccount.google.com/permissions>.
To point it at a different calendar, set `GOOGLE_CALENDAR_ID` to that
calendar's ID (Google Calendar → calendar settings → *Integrate calendar*).

## Routes

Hash routes, so they survive a hard refresh on static hosting:

| Route | What |
| --- | --- |
| `#/` | home (all sections) |
| `#/services/:slug` | one of six service pages |
| `#/privacy`, `#/cookies` | the legal statements |
| `#booking`, `#contact`, … | in-page anchors, work from any route |

Anything else under `#/` renders the not-found state.

## Design system

One rhythm for the whole site, in `src/index.css` and `src/components/Section.jsx`:

- `<Section>` — vertical rhythm (`section-y` / `-sm` / `-tight`) plus the page
  gutter. `prose` narrows to a reading measure.
- `<SectionHeading>` — the kicker / title / intro block, left or centred.
- `.type-display` · `.type-page` · `.type-section` · `.type-sub` · `.type-lead`
  — every heading on the site is one of these.
- `.card` follows the theme; `.card-pop` is the same surface plus a
  `--card-accent` per service.

If you find yourself writing `py-20 sm:py-28` or a bare `text-[clamp(...)]` in
a section, reach for these instead — that drift is exactly what they replaced.

## How a few things work

**Theme** (`src/theme.jsx`, `src/lib/cookies.js`) — light/dark, resolved as
_saved choice → OS preference → dark_. The choice lives in a first-party
`hinit_theme` cookie. An inline script in `index.html` applies it before first
paint so there is no flash; **if you change the resolution logic, change it in
both places**. Until the visitor picks a side, the site keeps following the OS
live.

**Language** (`src/i18n.jsx`) — Dutch by default, English if the browser asks
for it, remembered in a `hinit_lang` cookie. Both cookies are strictly
functional preference cookies, so no consent banner is required.

**Logo** (`src/components/Logo.jsx`) — `public/logo.png` is a flat single-colour
shape with the circuit traces knocked out of the alpha channel, so it is drawn
as a CSS mask filled with `--logo-color`. One asset, recolours per theme, no
white box. Size it with a height utility; the width follows the aspect ratio.
Master art is `pics/HinIT-logo.png`; `scripts` for the derived favicons/OG image
are not checked in — regenerate from the master if the logo changes.

**Per-service colour** (`src/sections/Services.jsx`, `.card-pop` / `.accent-scope`)
— each service carries a `--card-accent`. Those accents are tuned as text on a
white card, so on the dark theme they are mixed towards white (`--card-ink-mix`)
before being used as ink. The accent drives the surface wash, the icon chip, the
link and the border, so the grid reads as six distinct services on every device
and in both themes.

**Services spotlight** (`src/sections/Services.jsx`) — one pointer listener on
the grid writes `--mx`/`--my`/`--spot` onto every card, so the light reads as a
single source sweeping across the bento rather than six separate hovers. The
colour is sampled from a brand-family ramp based on where the pointer sits
horizontally. Styles are written straight to the DOM, never through state, so
moving the mouse never triggers a React render.

**Appointment picker** (`src/sections/Booking.jsx`, `src/lib/schedule.js`,
`src/lib/calendar.js`) — Monday-first month grid, arrow-key navigation, roving
tabindex. On mount it fetches the whole horizon's free slots from
`/api/availability` (grid dims while loading, retry card on failure), and
`/api/book` confirms on the spot. A 409 from a clash drops the chosen time,
shows a note and refreshes the diary. The optional "what would you like to
discuss?" message goes into the calendar event's description.

**Business details** (`src/lib/company.js`) — phone, email, city. Every
section reads from here; `index.html` (JSON-LD + `<noscript>`) cannot import
it and carries the same values by hand.

**Clients and quotes** (`src/data/clients.js`, `src/data/testimonials.js`) —
the trust strip and the testimonials section render from these two files and
are **hidden while they are empty**. Only real clients go in; the comment at
the top of each file shows the shape. Logos live in `public/clients/`.

**FAQ** (`src/sections/FAQ.jsx`) — parked, not mounted. Whether it stays is
undecided; the component and its copy (`faq` in `src/i18n.jsx`) are kept so
it can be put back by mounting it in `App.jsx` and restoring the nav link.

## Before a real launch

- **Phone number** — `src/lib/company.js` and `index.html` still carry the
  placeholder mobile number; swap in the business line.
- **Client logos** — `src/data/clients.js` is empty, so the trust strip does
  not show. Add real clients (with permission) and their logos.
- **Testimonials** — `src/data/testimonials.js` is empty, so the section does
  not show. Real names and companies only.
- **Stats** (`src/i18n.jsx` → `stats.items`) — 99.9% online and 50+ clients
  are unverified; the <15 min figure is the incident response time. The
  certification badges (ISO 27001, SOC 2, …) were unverified and are gone —
  add one back only once it is real.
- **Google Calendar credentials** — without the `GOOGLE_*` variables on
  Vercel the calendar cannot load and nobody can book. See "Google Calendar".
- **Company details** — the privacy statement (`src/i18n.jsx` → `legal`) names
  HinIT, Amsterdam, `info@hinit.nl`. Add your KvK number and registered address
  if you want the full imprint, and confirm the retention periods match what
  you actually do.
- **Domain** — `index.html` canonical/OG tags and the JSON-LD assume
  `https://hinit.nl/`. Update if that is wrong.
- **English copy** — a functional mirror of the Dutch; have a native
  copywriter polish it.

Not implemented: analytics (deliberately — see `#/cookies`).
