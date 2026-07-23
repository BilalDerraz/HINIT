/**
 * A local-network workaround, for development only.
 *
 * Google's API hostnames publish AAAA records. A machine that resolves those
 * but has no working IPv6 route — WSL2 very often, some coffee-shop Wi-Fi —
 * still gets IPv6 addresses back, and Node's "happy eyeballs" races a
 * connection to each family. The IPv6 attempt does not fail fast, it hangs,
 * so roughly one call in five dies with ETIMEDOUT. Measured on this machine:
 * 2 failures in 8 with the defaults, 0 in 10 with IPv4 pinned.
 *
 * The symptom is misleading — the picker says the calendar could not be
 * loaded, as if Google or the credentials were wrong, and it comes and goes.
 *
 * Only `npm run dev` and the two CLI scripts call this. The functions in
 * api/ are left alone: on Vercel both families work and the platform should
 * pick for itself.
 */
import dns from 'node:dns';
import net from 'node:net';

export function preferIPv4() {
  dns.setDefaultResultOrder('ipv4first'); // ask for A records first
  net.setDefaultAutoSelectFamily?.(false); // and do not race AAAA anyway
}
