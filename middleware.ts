import { NextResponse, type NextRequest } from "next/server";
import { UNLOCK_COOKIE, verifyTokenEdge } from "@/lib/workAuth";

const LOCKED_SLUGS = new Set(["nexus-247"]);

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const match = pathname.match(/^\/work\/([^/]+)\/?$/);
  if (!match) return NextResponse.next();

  const slug = match[1];
  if (!LOCKED_SLUGS.has(slug)) return NextResponse.next();

  const token = req.cookies.get(UNLOCK_COOKIE)?.value;
  const ok = await verifyTokenEdge(token, process.env.UNLOCK_SECRET);
  if (ok) return NextResponse.next();

  const url = req.nextUrl.clone();
  url.pathname = `/work/${slug}/locked`;
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: ["/work/:slug"],
};
