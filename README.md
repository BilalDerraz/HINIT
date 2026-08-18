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
No router, no state library — it is a single page.

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
- **Contact form** (`src/sections/Contact.jsx`) — validates client-side, then
  fakes success. No backend.
- **Appointment picker** — same: it validates and shows a confirmation, but
  **nothing is actually booked and no email is sent**. Both forms have a
  honeypot field ready; wire both to a real endpoint before launch.
- **Domain** — `index.html` canonical/OG tags and the JSON-LD assume
  `https://hinit.nl/`. Update if that is wrong.
- **English copy** — a functional mirror of the Dutch; have a native
  copywriter polish it.

Not implemented: analytics, legal pages, real form submission.
