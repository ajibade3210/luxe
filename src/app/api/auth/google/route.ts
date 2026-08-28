import { NextResponse } from "next/server";
import { GOOGLE_REVIEW_CONSTANTS } from "@/constants";

export async function GET(request: Request) {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const url = new URL(request.url);
  const redirectUri =
    process.env.GOOGLE_OAUTH_REDIRECT_URI || `${url.origin}/api/auth/google/callback`;

  if (!clientId) {
    return NextResponse.json(
      { error: "GOOGLE_CLIENT_ID environment variable is missing." },
      { status: 500 }
    );
  }

  const scope = "https://www.googleapis.com/auth/business.manage";

  const authUrl = new URL(GOOGLE_REVIEW_CONSTANTS.OAUTH_AUTH_URL);
  authUrl.searchParams.set("client_id", clientId);
  authUrl.searchParams.set("redirect_uri", redirectUri);
  authUrl.searchParams.set("response_type", "code");
  authUrl.searchParams.set("scope", scope);
  authUrl.searchParams.set("access_type", "offline");
  authUrl.searchParams.set("prompt", "consent");
  authUrl.searchParams.set("state", url.searchParams.get("returnUrl") || "/admin/settings");

  return NextResponse.redirect(authUrl.toString());
}
