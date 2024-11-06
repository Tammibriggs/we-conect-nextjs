import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Custom middleware route protection
// mainly to redirect authenticated users navigating to the login or register page to the home page
export async function middleware(req: NextRequest) {
  const withoutAuthRoutes = ["/login", "/register"];
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const pathname = req.nextUrl.pathname;
  const redirect = (path: string) => {
    return NextResponse.redirect(new URL(path, req.url));
  };

  if (token) {
    if (withoutAuthRoutes.includes(pathname)) {
      return redirect("/");
    }
    return NextResponse.next();
  } else if (!withoutAuthRoutes.includes(pathname)) {
    return redirect("/login");
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
