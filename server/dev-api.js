/**
 * Runs the /api functions on the Vite dev server.
 *
 * In production those files are Vercel serverless functions. Plain `vite`
 * knows nothing about them: it treats api/availability.js as just another
 * source file and hands the browser its text, and `vite preview` — which
 * only serves dist/ — 404s. Either way the picker shows "the calendar could
 * not be loaded", which looks like a broken calendar rather than a missing
 * backend.
 *
 * So mount the same handlers here, behind a request/response shim thin
 * enough to match what Vercel passes them (req.query, req.body, res.status).
 * `npm run dev` then books for real, against the real diary, with no Vercel
 * CLI and no login.
 */
import { loadEnv } from 'vite';
import { preferIPv4 } from './net-local.js';

/** Only these paths are routed, so a URL can never reach for another file. */
const ROUTES = { '/api/availability': 'availability.js', '/api/book': 'book.js' };

const GOOGLE_VARS = ['GOOGLE_CLIENT_ID', 'GOOGLE_CLIENT_SECRET', 'GOOGLE_REFRESH_TOKEN'];

export default function devApi() {
  return {
    name: 'hinit-dev-api',
    apply: 'serve', // never touches a production build

    config(_config, { mode }) {
      // The handlers read process.env, exactly as they do on Vercel. Vite
      // only exposes VITE_* to the browser, so the secrets in .env.local
      // stay server-side — they are read here and never bundled.
      Object.assign(process.env, loadEnv(mode, process.cwd(), ''));
    },

    configureServer(server) {
      preferIPv4();
      const missing = GOOGLE_VARS.filter((k) => !process.env[k]);
      if (missing.length) {
        server.config.logger.warn(
          `\n  [api] Google Calendar is not configured — missing ${missing.join(', ')}.` +
            `\n  [api] /api/availability will answer 502 and the picker will say it cannot load.` +
            `\n  [api] Fix: npm run auth:google, put the printed lines in .env.local, npm run check:google.\n`
        );
      }

      server.middlewares.use(async (req, res, next) => {
        const path = req.url.split('?')[0];
        const file = ROUTES[path];
        if (!file) return next();

        try {
          // ssrLoadModule (not import) so edits to the handlers take effect
          // without restarting the dev server.
          const mod = await server.ssrLoadModule(`/api/${file}`);
          shim(req, await body(req));
          await mod.default(req, patch(res));
        } catch (err) {
          server.ssrFixStacktrace?.(err);
          server.config.logger.error(`[api] ${path} threw:\n${err?.stack || err}`);
          if (!res.headersSent) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json; charset=utf-8');
            res.end(JSON.stringify({ error: 'dev_handler_failed' }));
          }
        }
      });
    },
  };
}

/** Vercel hands the handler a parsed query and body; node does not. */
function shim(req, raw) {
  req.query = Object.fromEntries(new URL(req.url, 'http://localhost').searchParams);
  try {
    req.body = raw ? JSON.parse(raw) : {};
  } catch {
    req.body = {}; // the handlers validate anyway
  }
}

/** res.status(code) — Express-style, which the handlers use. */
function patch(res) {
  res.status = (code) => {
    res.statusCode = code;
    return res;
  };
  return res;
}

function body(req) {
  if (req.method === 'GET' || req.method === 'HEAD') return Promise.resolve('');
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', (c) => {
      data += c;
      if (data.length > 100_000) reject(new Error('request body too large'));
    });
    req.on('end', () => resolve(data));
    req.on('error', reject);
  });
}
