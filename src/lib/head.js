import { useEffect } from 'react';

/**
 * Keep <title> and the description/canonical/OG tags in step with the route
 * *and* with the chosen language.
 *
 * The site is a static SPA, so index.html ships the Dutch home-page values and
 * this hook rewrites them on navigation or a language switch. Crawlers that run
 * JS and anyone who bookmarks or shares a page then get the right title instead
 * of the home one — in the language they were actually reading.
 */

export const SITE_NAME = 'HinIT';
export const SITE_URL = 'https://hinit.nl/';

function setMeta(selector, attr, value) {
  const el = document.querySelector(selector);
  if (el && value) el.setAttribute(attr, value);
}

export function useDocumentHead({ title, description, canonical, ogLocale }) {
  useEffect(() => {
    if (title) document.title = title;
    setMeta('meta[name="description"]', 'content', description);
    setMeta('meta[property="og:title"]', 'content', title);
    setMeta('meta[property="og:description"]', 'content', description);
    setMeta('meta[property="og:locale"]', 'content', ogLocale);
    setMeta('meta[name="twitter:title"]', 'content', title);
    setMeta('meta[name="twitter:description"]', 'content', description);
    setMeta('link[rel="canonical"]', 'href', canonical || SITE_URL);
    setMeta('meta[property="og:url"]', 'content', canonical || SITE_URL);
  }, [title, description, canonical, ogLocale]);
}
