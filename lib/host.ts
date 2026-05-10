import { headers } from "next/headers";

/**
 * On the `portfolio.*` subdomain (e.g. portfolio.vishalmaurya.work) we
 * surface every case study including ones flagged as `locked: true`.
 * Everywhere else, including localhost dev, locked entries are filtered
 * out of listings and case study detail pages add a noindex meta tag.
 *
 * To preview the unlocked subdomain locally, run dev on a hostname
 * that starts with `portfolio.` — e.g. add `127.0.0.1 portfolio.localhost`
 * to your hosts file and visit `http://portfolio.localhost:3000`.
 *
 * Server-side only: relies on Next's `headers()` to read the request host.
 */
export async function isUnlockedHost(): Promise<boolean> {
  const h = await headers();
  const host = h.get("host") ?? "";
  return host.startsWith("portfolio.");
}
