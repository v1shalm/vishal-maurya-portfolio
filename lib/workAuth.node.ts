// Node-runtime helpers. Only imported by the unlock route handler
// (which sets `runtime = "nodejs"`). Never import this from middleware.

import { createHmac, timingSafeEqual } from "node:crypto";
import { COOKIE_TTL_SECONDS, type UnlockToken } from "@/lib/workAuth";

function getSecret(): string {
  const s = process.env.UNLOCK_SECRET;
  if (!s || s.length < 16) {
    throw new Error(
      "UNLOCK_SECRET env var is missing or too short. Set it in .env.local and on Vercel."
    );
  }
  return s;
}

function base64url(buf: Buffer): string {
  return buf
    .toString("base64")
    .replace(/=+$/, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

function sign(payload: string, secret: string): string {
  return base64url(createHmac("sha256", secret).update(payload).digest());
}

export function issueToken(): string {
  const now = Math.floor(Date.now() / 1000);
  const body: UnlockToken = { iat: now, exp: now + COOKIE_TTL_SECONDS };
  const payload = base64url(Buffer.from(JSON.stringify(body)));
  const sig = sign(payload, getSecret());
  return `${payload}.${sig}`;
}

export function checkPassword(input: string): boolean {
  const expected = process.env.WORK_PASSWORD;
  if (!expected) return false;
  if (input.length !== expected.length) return false;
  const a = Buffer.from(input);
  const b = Buffer.from(expected);
  return timingSafeEqual(a, b);
}
