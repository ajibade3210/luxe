import { type NextRequest, NextResponse } from "next/server";
import { STORAGE_KEYS } from "@/constants";

const PROTECTED_ROUTES = [
  "/overview",
  "/customers",
  "/leads",
  "/profile",
  "/settings",
  "/analytics",
];

const AUTH_ROUTES = ["/login", "/signup"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionCookie = request.cookies.get(STORAGE_KEYS.session)?.value;
  const isAuthenticated = Boolean(sessionCookie && sessionCookie.trim().length > 0);

  const isProtectedRoute = PROTECTED_ROUTES.some(
    route => pathname === route || pathname.startsWith(`${route}/`)
  );

  const isAuthRoute = AUTH_ROUTES.some(
    route => pathname === route || pathname.startsWith(`${route}/`)
  );

  // 1. Guard protected admin routes: redirect unauthenticated requests to login
  if (isProtectedRoute && !isAuthenticated) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 2. Redirect authenticated users away from login/signup to admin dashboard
  if (isAuthRoute && isAuthenticated) {
    const redirectTarget = request.nextUrl.searchParams.get("redirect") || "/overview";
    const targetUrl = new URL(redirectTarget, request.url);
    return NextResponse.redirect(targetUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/overview/:path*",
    "/overview",
    "/customers/:path*",
    "/customers",
    "/leads/:path*",
    "/leads",
    "/profile/:path*",
    "/profile",
    "/settings/:path*",
    "/settings",
    "/analytics/:path*",
    "/analytics",
    "/login",
    "/signup",
  ],
};
