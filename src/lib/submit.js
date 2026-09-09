/**
 * Form delivery.
 *
 * Both forms used to `setTimeout(() => setStatus('success'), 1200)` — the
 * visitor got a confirmation and nothing was ever sent anywhere. That is worse
 * than no form at all, so it is gone.
 *
 * Two real paths instead:
 *
 *   1. `VITE_FORM_ENDPOINT` is set → POST the payload as JSON. Any endpoint
 *      that accepts a JSON body works (Formspree, Basin, a Cloudflare Worker,
 *      your own API). Set it in `.env.production` before deploying.
 *
 *   2. It is not set → hand the message to the visitor's own mail client with
 *      everything filled in. Clunkier, but it actually reaches info@hinit.nl,
 *      and nothing is claimed that did not happen.
 *
 * The same fallback catches a failed POST, so a visitor is never left with a
 * message that quietly went nowhere.
 */

export const CONTACT_EMAIL = 'info@hinit.nl';

const ENDPOINT = (import.meta.env.VITE_FORM_ENDPOINT || '').trim();

/** Is a real submit endpoint configured for this build? */
export const hasEndpoint = ENDPOINT.length > 0;

/** POST the payload. Throws on a network error or a non-2xx response. */
export async function postForm(payload) {
  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`Form endpoint returned ${res.status}`);
  return res;
}

/** `mailto:` URL with subject and body pre-filled from the form. */
export function mailtoUrl({ subject, lines }) {
  const body = lines.filter(Boolean).join('\n');
  return `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

/**
 * Send a form. Resolves to how it went, never throws, so the caller can put
 * the result straight into a status:
 *
 *   'sent'   — the endpoint accepted it
 *   'mail'   — handed to the visitor's mail client (no endpoint, or it failed)
 */
export async function submitForm({ payload, subject, lines }) {
  if (hasEndpoint) {
    try {
      await postForm(payload);
      return 'sent';
    } catch {
      /* fall through to the mail client rather than losing the message */
    }
  }
  window.location.href = mailtoUrl({ subject, lines });
  return 'mail';
}
