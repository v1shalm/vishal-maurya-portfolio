// Edge-safe module: no node:crypto imports here. Used by middleware.ts
// (Edge runtime). The route handler imports the Node-only helpers from
// lib/workAuth.node.ts.

export const UNLOCK_COOKIE = "work-unlock";
// Token ttl is short as a backstop. The cookie itself is a session
// cookie (no maxAge), so it dies when the browser closes — meaning the
// password is required again on a fresh visit.
export const COOKIE_TTL_SECONDS = 60 * 60 * 2; // 2 hours

export type UnlockToken = { iat: number; exp: number };

export const COOKIE_OPTIONS = {
  name: UNLOCK_COOKIE,
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  // No maxAge / expires => session cookie. Cleared when browser closes.
};

function fromBase64urlString(s: string): string {
  const b64 =
    s.replace(/-/g, "+").replace(/_/g, "/") +
    (s.length % 4 === 0 ? "" : "=".repeat(4 - (s.length % 4)));
  return atob(b64);
}

/** Edge-safe verification using Web Crypto. */
export async function verifyTokenEdge(
  token: string | undefined,
  secret: string | undefined
): Promise<boolean> {
  if (!token || !secret || secret.length < 16) return false;
  const parts = token.split(".");
  if (parts.length !== 2) return false;
  const [payload, sig] = parts;

  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const expected = new Uint8Array(
    await crypto.subtle.sign("HMAC", key, enc.encode(payload))
  );

  let provided: Uint8Array;
  try {
    const bin = fromBase64urlString(sig);
    provided = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) provided[i] = bin.charCodeAt(i);
  } catch {
    return false;
  }
  if (provided.length !== expected.length) return false;

  let diff = 0;
  for (let i = 0; i < expected.length; i++) diff |= expected[i] ^ provided[i];
  if (diff !== 0) return false;

  try {
    const json = fromBase64urlString(payload);
    const body = JSON.parse(json) as UnlockToken;
    if (typeof body.exp !== "number") return false;
    if (Math.floor(Date.now() / 1000) > body.exp) return false;
  } catch {
    return false;
  }

  return true;
}
