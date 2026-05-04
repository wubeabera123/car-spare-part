import { auth } from "@/auth";
import { NextResponse } from "next/server";

const PROTECTED = [/^\/account/, /^\/checkout/, /^\/wishlist/];
const SELLER_ONLY = [/^\/seller/];
const ADMIN_ONLY = [/^\/admin/];

export default auth((req) => {
  const { nextUrl } = req;
  const session = req.auth;
  const path = nextUrl.pathname;

  const isProtected = PROTECTED.some((r) => r.test(path));
  const isSeller = SELLER_ONLY.some((r) => r.test(path));
  const isAdmin = ADMIN_ONLY.some((r) => r.test(path));

  if ((isProtected || isSeller || isAdmin) && !session) {
    const loginUrl = new URL("/login", nextUrl);
    loginUrl.searchParams.set("callbackUrl", path);
    return NextResponse.redirect(loginUrl);
  }

  if (
    isSeller &&
    session?.user?.role !== "SELLER" &&
    session?.user?.role !== "ADMIN"
  ) {
    return NextResponse.redirect(new URL("/", nextUrl));
  }

  if (isAdmin && session?.user?.role !== "ADMIN") {
    return NextResponse.redirect(new URL("/", nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.).*)"],
};
