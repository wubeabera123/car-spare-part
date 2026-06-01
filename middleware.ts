import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const PROTECTED = [
  /^\/account(?:\/|$)/,
  /^\/checkout(?:\/|$)/,
  /^\/wishlist(?:\/|$)/,
];
const SELLER_ONLY = [/^\/seller(?:\/|$)/];
const ADMIN_ONLY = [/^\/admin(?:\/|$)/];

export default async function middleware(req: NextRequest) {
  const { nextUrl } = req;
  const path = nextUrl.pathname;

  const token = await getToken({
    req,
    secret: process.env.AUTH_SECRET,
  });

  const isProtected = PROTECTED.some((r) => r.test(path));
  const isSeller = SELLER_ONLY.some((r) => r.test(path));
  const isAdmin = ADMIN_ONLY.some((r) => r.test(path));

  if ((isProtected || isSeller || isAdmin) && !token) {
    const loginUrl = new URL("/login", nextUrl);
    loginUrl.searchParams.set("callbackUrl", path);
    return NextResponse.redirect(loginUrl);
  }

  const role = token?.role as string | undefined;

  if (isSeller && role !== "SELLER" && role !== "ADMIN") {
    return NextResponse.redirect(new URL("/", nextUrl));
  }

  if (isAdmin && role !== "ADMIN") {
    return NextResponse.redirect(new URL("/", nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.).*)"],
};
