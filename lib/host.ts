import { headers } from "next/headers";

/**
 * On the `portfolio.*` subdomain (e.g. portfolio.vishalmaurya.work) we
 * surface every case study including ones flagged as `locked: true`.
 * On the public domain (vishalmaurya.work) the locked entries are
 * filtered out of listings and case study detail pages add a noindex
 * meta tag so search engines don't surface them.
 *
 * In local dev (`localhost`, `127.0.0.1`, `0.0.0.0`, LAN IPs like
 * `192.168.*`) we behave as if on the unlocked subdomain so the
 * locked work is visible while building.
 *
 * Server-side only: relies on Next's `headers()` to read the request host.
 */
export async function isUnlockedHost(): Promise<boolean> {
  const h = await headers();
  const host = h.get("host") ?? "";

  // Local development always behaves as unlocked
  if (
    host.startsWith("localhost") ||
    host.startsWith("127.0.0.1") ||
    host.startsWith("0.0.0.0") ||
    /^\d+\.\d+\.\d+\.\d+/.test(host) // bare IPv4 (LAN testing)
  ) {
    return true;
  }

  return host.startsWith("portfolio.");
}
