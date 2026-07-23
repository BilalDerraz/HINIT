# HinIT — showcase frontend

A cinematic, Awwwards-style marketing site for **HinIT** (premium managed IT,
cybersecurity & infrastructure, Amsterdam). Dark "living digital infrastructure"
theme with WebGL, kinetic typography, smooth scroll and a full NL/EN toggle.

## Run it

```bash
cd site
npm install
npm run dev      # → http://localhost:5173
```

`npm run build` produces a production bundle in `dist/`.

## Stack

React 19 · Vite 6 · Tailwind CSS v4 · Motion (Framer Motion) · GSAP + ScrollTrigger ·
Lenis (smooth scroll) · ogl (WebGL particles). Several components are lifted/adapted
from the sibling `react-bits` library (`src/lib/reactbits/`).

## What's placeholder (swap before a real launch)

Everything below is intentionally faked for the demo and marked `TODO` in code:

- **Client logos** (`src/sections/TrustBar.jsx`) — placeholder wordmarks.
- **Stats** (`src/i18n.jsx` → `stats.items`) — 99.9% uptime, <15 min response, 50+
  orgs, and the security badges (ISO 27001, Microsoft Partner, …) are unverified.
- **Testimonials** (`src/i18n.jsx` → `testimonials.items`) — invented quotes,
  names and avatar initials.
- **Contact form** (`src/sections/Contact.jsx`) — validates client-side then fakes
  a success state; there is no backend. Wire to a real endpoint before launch.
- **English copy** (`src/i18n.jsx`) — a functional mirror of the Dutch; have a
  native copywriter polish it.

Not implemented (out of scope for a showcase): SEO/meta, analytics, cookie banner,
auth, legal pages, real form submission.
