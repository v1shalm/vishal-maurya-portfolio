import { NextResponse, type NextRequest } from "next/server";
import { COOKIE_OPTIONS } from "@/lib/workAuth";
import { checkPassword, issueToken } from "@/lib/workAuth.node";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  let body: { password?: unknown };
  try {
    body = (await req.json()) as { password?: unknown };
  } catch {
    return NextResponse.json({ ok: false, error: "Bad request" }, { status: 400 });
  }

  const password = typeof body.password === "string" ? body.password : "";
  if (!password) {
    return NextResponse.json({ ok: false, error: "Password required" }, { status: 400 });
  }

  if (!checkPassword(password)) {
    return NextResponse.json({ ok: false, error: "Wrong password" }, { status: 401 });
  }

  const token = issueToken();
  const res = NextResponse.json({ ok: true });
  res.cookies.set({ ...COOKIE_OPTIONS, value: token });
  return res;
}
