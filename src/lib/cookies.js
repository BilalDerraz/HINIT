/**
 * Tiny first-party cookie helpers.
 *
 * These store nothing but the visitor's own display preferences (theme,
 * language), so they are strictly functional cookies — no consent banner
 * required under GDPR/ePrivacy. SameSite=Lax keeps them off cross-site
 * requests; `Secure` is added automatically on https.
 */

const ONE_YEAR = 60 * 60 * 24 * 365;

export function getCookie(name) {
  if (typeof document === 'undefined') return null;
  const prefix = `${encodeURIComponent(name)}=`;
  for (const part of document.cookie.split('; ')) {
    if (part.startsWith(prefix)) {
      try {
        return decodeURIComponent(part.slice(prefix.length));
      } catch {
        return null;
      }
    }
  }
  return null;
}

export function setCookie(name, value, maxAge = ONE_YEAR) {
  if (typeof document === 'undefined') return;
  const secure = window.location.protocol === 'https:' ? '; Secure' : '';
  document.cookie =
    `${encodeURIComponent(name)}=${encodeURIComponent(value)}` +
    `; path=/; max-age=${maxAge}; SameSite=Lax${secure}`;
}

export const COOKIE_THEME = 'hinit_theme';
export const COOKIE_LANG = 'hinit_lang';
