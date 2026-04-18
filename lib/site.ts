/**
 * Canonical site URL used by metadata, OG images, sitemap, and robots.
 *
 * Resolution order:
 *   1. NEXT_PUBLIC_SITE_URL — explicit override (set this in Vercel when a
 *      custom domain is attached, e.g. "https://vishalmaurya.design").
 *   2. VERCEL_PROJECT_PRODUCTION_URL — Vercel sets this on production builds
 *      to the canonical project URL (e.g. "vishal-maurya-portfolio.vercel.app").
 *   3. VERCEL_URL — Vercel sets this on preview builds to the per-deploy URL.
 *   4. http://localhost:3000 — local dev.
 */
export const siteUrl = (() => {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/$/, "");

  const prod = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (prod) return `https://${prod}`;

  const preview = process.env.VERCEL_URL;
  if (preview) return `https://${preview}`;

  return "http://localhost:3000";
})();
