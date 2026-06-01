import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default async function middleware(req: NextRequest) {
  // Auth/role checks are enforced in server layouts/pages with `auth()`.
  // Keeping middleware light avoids edge auth-cookie parsing issues in production.
  void req;
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.).*)"],
};
