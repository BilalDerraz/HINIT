import { useEffect, useState } from 'react';

/**
 * A tiny hash router.
 *
 * The site is deployed as static files, so hash routes are the only kind that
 * survive a hard refresh or a pasted URL without server-side rewrites.
 *
 * Two shapes of hash live side by side:
 *   #/services/beveiliging  → a route (starts with a slash)
 *   #booking                → an in-page anchor on the home page
 *
 * Anything that is not a route keeps behaving exactly like the plain anchor
 * links the site already used, so existing `href="#booking"` links still work
 * from every page.
 */

export const HOME = '/';

/** Split a raw `location.hash` into { path, anchor }. */
export function parseHash(raw) {
  const h = String(raw || '').replace(/^#/, '');
  if (h.startsWith('/')) {
    // strip a trailing slash so `/services/x/` and `/services/x` are one route
    const path = h.length > 1 ? h.replace(/\/+$/, '') : HOME;
    return { path: path || HOME, anchor: null };
  }
  return { path: HOME, anchor: h || null };
}

/** Current route, kept in sync with back/forward and in-page link clicks. */
export function useRoute() {
  const [route, setRoute] = useState(() => parseHash(window.location.hash));

  useEffect(() => {
    const read = () => setRoute(parseHash(window.location.hash));
    window.addEventListener('hashchange', read);
    window.addEventListener('popstate', read);
    return () => {
      window.removeEventListener('hashchange', read);
      window.removeEventListener('popstate', read);
    };
  }, []);

  return route;
}

/** Standalone pages that live at the top level, e.g. #/privacy. */
export const PAGES = ['privacy', 'cookies'];

/** Href for a standalone page. */
export const pageHref = (slug) => `#/${slug}`;

/** Pull a known page slug out of the path, or null when it is not one. */
export function pageSlug(path) {
  const m = /^\/([a-z0-9-]+)$/i.exec(path);
  const slug = m && m[1].toLowerCase();
  return slug && PAGES.includes(slug) ? slug : null;
}

/** Href for a service detail page. */
export const serviceHref = (slug) => `#/services/${slug}`;

/** Pull the slug out of `/services/:slug`, or null when the path is not one. */
export function serviceSlug(path) {
  const m = /^\/services\/([a-z0-9-]+)$/i.exec(path);
  return m ? m[1] : null;
}
