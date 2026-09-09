# HinIT — marketing site

Marketing site for **HinIT** (managed IT, cybersecurity & infrastructure).
Calm, high-contrast design with a light/dark theme, Dutch-first copy with an
English mirror, and an appointment picker.

## Run it

```bash
cd site
npm install
npm run dev      # → http://localhost:5173
```

`npm run build` produces a production bundle in `dist/`; `npm run preview`
serves that bundle.

## Stack

React 19 · Vite 6 · Tailwind CSS v4 · Motion · lucide-react.
A ~50-line hash router (`src/lib/router.js`), no state library.
Fonts are self-hosted (`public/fonts`, `src/fonts.css`) — the site makes **no
third-party requests at all**.

## Configuration

Copy `.env.example` to `.env.production` and set `VITE_FORM_ENDPOINT` to an
endpoint that accepts a JSON POST. Without it the forms fall back to opening
the visitor's mail client with everything pre-filled — see
`src/lib/submit.js`. Either way a message reaches someone; nothing is ever
silently dropped.

## Routes

Hash routes, so they survive a hard refresh on static hosting:

| Route | What |
| --- | --- |
| `#/` | home (all sections) |
| `#/services/:slug` | one of six service pages |
| `#/privacy`, `#/cookies` | the legal statements |
| `#booking`, `#faq`, … | in-page anchors, work from any route |

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

**Appointment picker** (`src/sections/Booking.jsx`, `src/lib/schedule.js`) —
Monday-first month grid, arrow-key navigation, roving tabindex, working days
only, 90-day horizon. Availability is **simulated deterministically** so the
calendar never reshuffles under the visitor. `isBookable` and `slotsFor` are
the only two functions that need replacing when a real backend arrives.

## What's placeholder (swap before a real launch)

- **Client logos** (`src/sections/TrustBar.jsx`) — placeholder wordmarks.
- **Stats** (`src/i18n.jsx` → `stats.items`) — 99.9% uptime, <15 min response,
  50+ clients, and the badges (ISO 27001, Microsoft Partner, …) are unverified.
- **Testimonials** (`src/i18n.jsx` → `testimonials.items`) — invented quotes and
  names.
- **Booking availability** — the calendar's free/busy days are simulated (see
  `src/lib/schedule.js`). The submitted request is real and reaches you, but it
  is not checked against an actual diary.
- **Company details** — the privacy statement (`src/i18n.jsx` → `legal`) names
  HinIT, Amsterdam, `info@hinit.nl`. Add your KvK number and registered address
  if you want the full imprint, and confirm the retention periods match what
  you actually do.
- **Domain** — `index.html` canonical/OG tags and the JSON-LD assume
  `https://hinit.nl/`. Update if that is wrong.
- **English copy** — a functional mirror of the Dutch; have a native
  copywriter polish it.

Not implemented: analytics (deliberately — see `#/cookies`).
