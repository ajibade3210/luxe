import { type NextRequest, NextResponse } from "next/server";
import { STORAGE_KEYS } from "@/constants";
import type { DecodedJwtHeader, DecodedJwtPayload } from "@/types";

const PROTECTED_ROUTES = [
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
 *
 * ⚠️  TRUST BOUNDARY NOTE:
 * This function does NOT verify the JWT signature — the Web Crypto API could do
 * it, but the secret would have to be embedded in the client bundle, which is
 * worse than not verifying at all.
 *
 * This is intentional: middleware redirects are a UX convenience only.
 * A determined user can craft a structurally valid token and bypass the redirect.
 * That is acceptable because every API request is independently authenticated
 * and authorised by the backend (src/middlewares/auth.ts) using the real secret.
 * The UI they reach without a real session will show empty/errored data.
 *
 * Do NOT treat this function as a security gate.
 */
export function isValidJwt(token?: string | null): boolean {
  if (!token || typeof token !== "string") return false;
  const trimmed = token.trim();
  const parts = trimmed.split(".");
  if (parts.length !== 3) return false;

  try {
    // 1. Validate Header
    const headerJson = decodeBase64Url(parts[0]);
    const header = JSON.parse(headerJson) as DecodedJwtHeader;
    if (!header || typeof header !== "object" || !header.alg) {
      return false;
    }

    // 2. Validate Payload
    const payloadJson = decodeBase64Url(parts[1]);
    const payload = JSON.parse(payloadJson) as DecodedJwtPayload;
    if (!payload || typeof payload !== "object") {
      return false;
    }

    // 3. Must contain a valid user identity claim
    const hasIdentifier =
      (typeof payload.userId === "string" && payload.userId.length > 0) ||
      (typeof payload.id === "string" && payload.id.length > 0);

    if (!hasIdentifier) {
      return false;
    }

    // 4. Validate Expiry Claim (with 30s clock skew margin)
    if (typeof payload.exp === "number") {
      const nowSeconds = Math.floor(Date.now() / 1000);
      if (payload.exp + 30 <= nowSeconds) {
        return false; // Token has expired
      }
    }

    // 5. Validate Issued-At Claim (prevent tokens claiming future issue)
    if (typeof payload.iat === "number") {
      const nowSeconds = Math.floor(Date.now() / 1000);
      if (payload.iat > nowSeconds + 120) {
        return false;
      }
    }

    // 6. Signature part must not be empty
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

    // If it's a JWT directly
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

    // Check optional expiresAt timestamp
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

  // Live API authentication check: validates either HttpOnly JWT access token or valid synced session metadata
  const hasValidAccessToken = isValidJwt(accessTokenCookie);
  const hasValidSession = isValidSession(sessionCookie);
  const isAuthenticated = hasValidAccessToken || hasValidSession;

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
    const response = NextResponse.redirect(loginUrl);
    // Clear any stale invalid session cookies
    if (sessionCookie && !hasValidSession) {
      response.cookies.delete(STORAGE_KEYS.session);
    }
    return response;
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
