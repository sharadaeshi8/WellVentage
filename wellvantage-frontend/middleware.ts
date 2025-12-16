import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { authService } from "./lib/services";

// Define auth routes that should redirect to /leads if user is authenticated
const authRoutes = ["/", "/signin", "/signup"];

// Define protected routes that require authentication
const protectedRoutes = ["/leads"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get("access_token")?.value;

  // Check if user is on an auth route
  const isAuthRoute = authRoutes.includes(pathname);

  // Check if user is on a protected route
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // If user is authenticated and trying to access auth pages, redirect to /leads
  if (accessToken && isAuthRoute) {
    return NextResponse.redirect(new URL("/leads", request.url));
  }

  // If user is not authenticated and trying to access protected routes, redirect to /signup
  if (!accessToken && isProtectedRoute) {
    return NextResponse.redirect(new URL("/signup", request.url));
  }

  return NextResponse.next();
}

// Configure which routes the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes - these handle their own auth)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc.)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
