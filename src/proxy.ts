import { type NextRequest, NextResponse } from "next/server";
import { STORAGE_KEYS } from "@/constants";
import type { DecodedJwtHeader, DecodedJwtPayload } from "@/types";

const PROTECTED_ROUTES = ["/vendor"];

const LEGACY_DASHBOARD_ROUTES = [
  "/vendors",
  "/overview",
  "/customers",
  "/leads",
  "/invoices",
  "/expenses",
  "/profile",
  "/settings",
  "/analytics",
];

const AUTH_ROUTES = ["/login", "/signup"];

/**
 * Safely decodes base64url encoded JSON strings (Web standard, edge-compatible).
 */
function decodeBase64Url(base64Url: string): string {
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  const pad = base64.length % 4;
  const paddedBase64 = pad ? base64 + "=".repeat(4 - pad) : base64;
  return decodeURIComponent(
    atob(paddedBase64)
      .split("")
      .map(c => `%${`00${c.charCodeAt(0).toString(16)}`.slice(-2)}`)
      .join("")
  );
}

/**
 * Validates the structure, claims, and expiration of a JWT on Next.js Edge Runtime.
 */
export function isValidJwt(token?: string | null): boolean {
  if (!token || typeof token !== "string") return false;
  const trimmed = token.trim();
  const parts = trimmed.split(".");
  if (parts.length !== 3) return false;

  try {
    const headerJson = decodeBase64Url(parts[0]);
    const header = JSON.parse(headerJson) as DecodedJwtHeader;
    if (!header || typeof header !== "object" || !header.alg) {
      return false;
    }

    const payloadJson = decodeBase64Url(parts[1]);
    const payload = JSON.parse(payloadJson) as DecodedJwtPayload;
    if (!payload || typeof payload !== "object") {
      return false;
    }

    const hasIdentifier =
      (typeof payload.userId === "string" && payload.userId.length > 0) ||
      (typeof payload.id === "string" && payload.id.length > 0);

    if (!hasIdentifier) {
      return false;
    }

    if (typeof payload.exp === "number") {
      const nowSeconds = Math.floor(Date.now() / 1000);
      if (payload.exp + 30 <= nowSeconds) {
        return false;
      }
    }

    if (typeof payload.iat === "number") {
      const nowSeconds = Math.floor(Date.now() / 1000);
      if (payload.iat > nowSeconds + 120) {
        return false;
      }
    }

    if (!parts[2] || parts[2].trim().length === 0) {
      return false;
    }

    return true;
  } catch {
    return false;
  }
}

/**
 * Validates session cookie or JWT payload string.
 */
export function isValidSession(cookieValue?: string | null): boolean {
  if (!cookieValue || cookieValue.trim().length === 0) return false;

  try {
    const raw = decodeURIComponent(cookieValue.trim());

    if (raw.split(".").length === 3) {
      return isValidJwt(raw);
    }

    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return false;

    const hasValidIdentity =
      typeof parsed.id === "string" &&
      parsed.id.length > 0 &&
      typeof parsed.email === "string" &&
      parsed.email.includes("@");

    if (!hasValidIdentity) return false;

    if (parsed.expiresAt) {
      const expTime = new Date(parsed.expiresAt).getTime();
      if (Number.isFinite(expTime) && expTime <= Date.now()) {
        return false;
      }
    }

    return true;
  } catch {
    return false;
  }
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const accessTokenCookie = request.cookies.get("shopwus_access_token")?.value;
  const sessionCookie = request.cookies.get(STORAGE_KEYS.session)?.value;

  // Live API authentication check
  const hasValidAccessToken = isValidJwt(accessTokenCookie);
  const hasValidSession = isValidSession(sessionCookie);
  const isAuthenticated = hasValidAccessToken || hasValidSession;

  // 1. Redirect legacy top-level dashboard routes to /vendor/*
  const legacyMatch = LEGACY_DASHBOARD_ROUTES.find(
    route => pathname === route || pathname.startsWith(`${route}/`)
  );
  if (legacyMatch) {
    const cleanSubpath = pathname.startsWith("/vendors")
      ? pathname.replace(/^\/vendors/, "")
      : pathname;
    const targetUrl = new URL(`/vendor${cleanSubpath}${request.nextUrl.search}`, request.url);
    return NextResponse.redirect(targetUrl);
  }

  // 2. Redirect /vendor root to /vendor/overview
  if (pathname === "/vendor") {
    const targetUrl = new URL("/vendor/overview", request.url);
    return NextResponse.redirect(targetUrl);
  }

  const isProtectedRoute = PROTECTED_ROUTES.some(
    route => pathname === route || pathname.startsWith(`${route}/`)
  );

  const isAuthRoute = AUTH_ROUTES.some(
    route => pathname === route || pathname.startsWith(`${route}/`)
  );

  // 3. Guard protected vendor routes: redirect unauthenticated requests to login
  if (isProtectedRoute && !isAuthenticated) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    const response = NextResponse.redirect(loginUrl);
    if (sessionCookie && !hasValidSession) {
      response.cookies.delete(STORAGE_KEYS.session);
    }
    return response;
  }

  // 4. Redirect authenticated users away from login/signup to vendor dashboard
  if (isAuthRoute && isAuthenticated) {
    const redirectTarget = request.nextUrl.searchParams.get("redirect") || "/vendor/overview";
    const targetUrl = new URL(redirectTarget, request.url);
    return NextResponse.redirect(targetUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/vendor/:path*",
    "/vendor",
    "/vendors/:path*",
    "/vendors",
    "/overview/:path*",
    "/overview",
    "/customers/:path*",
    "/customers",
    "/leads/:path*",
    "/leads",
    "/invoices/:path*",
    "/invoices",
    "/expenses/:path*",
    "/expenses",
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

export default proxy;
