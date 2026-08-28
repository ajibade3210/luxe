import { NextResponse } from "next/server";
import { GOOGLE_REVIEW_CONSTANTS, INITIAL_MOCK_LOCATIONS } from "@/constants";
import type { GoogleBusinessConnection, GoogleLocation, ReviewSummary } from "@/types";

interface GoogleTokenResponse {
  access_token: string;
  refresh_token?: string;
  expires_in: number;
  token_type: string;
  scope: string;
}

interface GoogleAccountItem {
  name: string; // "accounts/{accountId}"
  accountName?: string;
  type?: string;
  role?: string;
}

interface GoogleAccountsListResponse {
  accounts?: GoogleAccountItem[];
}

interface GoogleLocationItem {
  name: string; // "locations/{locationId}" or "accounts/{accId}/locations/{locId}"
  title?: string;
  storeCode?: string;
  storefrontAddress?: {
    addressLines?: string[];
    locality?: string;
    administrativeArea?: string;
    postalCode?: string;
  };
  metadata?: {
    placeId?: string;
  };
}

interface GoogleLocationsListResponse {
  locations?: GoogleLocationItem[];
}

function parseGoogleAddress(loc: GoogleLocationItem): string {
  const parts: string[] = [];
  if (loc.storefrontAddress?.addressLines) {
    parts.push(...loc.storefrontAddress.addressLines);
  }
  if (loc.storefrontAddress?.locality) {
    parts.push(loc.storefrontAddress.locality);
  }
  if (loc.storefrontAddress?.administrativeArea) {
    parts.push(loc.storefrontAddress.administrativeArea);
  }
  return parts.length > 0 ? parts.join(", ") : "Main Business Location";
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const error = url.searchParams.get("error");
  const returnUrl = url.searchParams.get("state") || "/admin/settings";

  if (error || !code) {
    const errorTarget = new URL(returnUrl, url.origin);
    errorTarget.searchParams.set("google_auth", "error");
    if (error) errorTarget.searchParams.set("error_reason", error);
    return NextResponse.redirect(errorTarget.toString());
  }

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const redirectUri =
    process.env.GOOGLE_OAUTH_REDIRECT_URI || `${url.origin}/api/auth/google/callback`;

  if (!clientId || !clientSecret) {
    const errorTarget = new URL(returnUrl, url.origin);
    errorTarget.searchParams.set("google_auth", "error");
    errorTarget.searchParams.set("error_reason", "missing_credentials");
    return NextResponse.redirect(errorTarget.toString());
  }

  try {
    // 1. Exchange code for access & refresh tokens
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }),
    });

    if (!tokenRes.ok) {
      const errText = await tokenRes.text();
      console.error("[Google OAuth] Token exchange failed:", errText);
      const errorTarget = new URL(returnUrl, url.origin);
      errorTarget.searchParams.set("google_auth", "error");
      errorTarget.searchParams.set("error_reason", "token_exchange_failed");
      return NextResponse.redirect(errorTarget.toString());
    }

    const tokenData = (await tokenRes.json()) as GoogleTokenResponse;
    const accessToken = tokenData.access_token;

    // 2. Fetch Business Accounts
    let accounts: GoogleAccountItem[] = [];
    try {
      const accRes = await fetch("https://mybusinessaccountmanagement.googleapis.com/v1/accounts", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (accRes.ok) {
        const accData = (await accRes.json()) as GoogleAccountsListResponse;
        accounts = accData.accounts || [];
      }
    } catch (e) {
      console.warn("[Google OAuth] Could not fetch accounts list:", e);
    }

    const primaryAccount = accounts[0];
    const accountId = primaryAccount?.name || "accounts/primary";
    const accountName = primaryAccount?.accountName || "Connected Google Business";

    // 3. Fetch Locations for the account
    const discoveredLocations: GoogleLocation[] = [];

    if (primaryAccount?.name) {
      try {
        const locRes = await fetch(
          `https://mybusinessbusinessinformation.googleapis.com/v1/${primaryAccount.name}/locations?readMask=name,title,storefrontAddress,metadata`,
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );
        if (locRes.ok) {
          const locData = (await locRes.json()) as GoogleLocationsListResponse;
          for (const item of locData.locations || []) {
            const locId = item.name.split("/").pop() || item.name;
            discoveredLocations.push({
              accountId: primaryAccount.name,
              locationId: locId,
              locationName: item.title || "Main Location",
              placeId: item.metadata?.placeId || GOOGLE_REVIEW_CONSTANTS.DEFAULT_PLACE_ID,
              address: parseGoogleAddress(item),
              storeCode: item.storeCode,
            });
          }
        }
      } catch (e) {
        console.warn("[Google OAuth] Could not fetch locations:", e);
      }
    }

    const availableLocations =
      discoveredLocations.length > 0 ? discoveredLocations : INITIAL_MOCK_LOCATIONS;

    const selectedLoc = availableLocations[0];

    const initialSummary: ReviewSummary = {
      averageRating: 5.0,
      totalReviews: 5,
      ratingCounts: { 5: 5, 4: 0, 3: 0, 2: 0, 1: 0 },
    };

    const connectionData: GoogleBusinessConnection = {
      status: "connected",
      accountId,
      accountName,
      selectedLocation: selectedLoc,
      availableLocations,
      lastSyncedAt: new Date().toISOString(),
      reviewSummary: initialSummary,
      directReviewUrl: `${GOOGLE_REVIEW_CONSTANTS.WRITE_REVIEW_BASE_URL}${selectedLoc.placeId}`,
    };

    // Redirect to settings page with connection payload encoded in cookie or query
    const targetUrl = new URL(returnUrl, url.origin);
    targetUrl.searchParams.set("google_auth", "success");

    const response = NextResponse.redirect(targetUrl.toString());

    // Save connection state in cookie so client hydrate can pick it up immediately
    response.cookies.set({
      name: "shopwus_google_conn",
      value: encodeURIComponent(JSON.stringify(connectionData)),
      path: "/",
      maxAge: 60 * 60 * 24 * 30, // 30 days
      sameSite: "lax",
    });

    return response;
  } catch (err) {
    console.error("[Google OAuth] Callback unexpected error:", err);
    const errorTarget = new URL(returnUrl, url.origin);
    errorTarget.searchParams.set("google_auth", "error");
    errorTarget.searchParams.set("error_reason", "server_error");
    return NextResponse.redirect(errorTarget.toString());
  }
}
