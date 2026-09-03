import { z } from "zod";

/**
 * Normalizes an API or App URL to ensure it always includes the protocol (https:// by default).
 */
function normalizeUrl(url: string): string {
  const trimmed = url.trim().replace(/\/+$/, "");
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }
  return `https://${trimmed}`;
}

const isTest = process.env.NODE_ENV === "test" || process.env.VITEST === "true";

const envSchema = z
  .object({
    // Client-side environment variables
    NEXT_PUBLIC_APP_NAME: z.string().default("Shopwus"),
    NEXT_PUBLIC_APP_URL: z.string().min(1, "NEXT_PUBLIC_APP_URL is required"),
    NEXT_PUBLIC_SITE_DOMAIN: z.string().default("shopwus.com"),
    NEXT_PUBLIC_DEFAULT_STUDIO_PHONE: z.string().default("+2348055966944"),
    NEXT_PUBLIC_USE_MOCK_API: z
      .enum(["true", "false"])
      .default("false")
      .transform(val => val === "true"),
    NEXT_PUBLIC_API_URL: z.string().optional(),
    NEXT_PUBLIC_API_BASE_URL: z.string().optional(),
    NEXT_PUBLIC_GOOGLE_CLIENT_ID: z.string().optional(),
    NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: z.string().optional(),

    // Server-side & Build environment variables
    NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
    GOOGLE_CLIENT_ID: z.string().optional(),
    GOOGLE_CLIENT_SECRET: z.string().optional(),
    GOOGLE_OAUTH_REDIRECT_URI: z.string().optional(),
  })
  .refine(data => isTest || Boolean(data.NEXT_PUBLIC_API_URL || data.NEXT_PUBLIC_API_BASE_URL), {
    message:
      "Missing API URL: Either NEXT_PUBLIC_API_URL or NEXT_PUBLIC_API_BASE_URL must be defined in your environment variables.",
    path: ["NEXT_PUBLIC_API_URL"],
  });

const parsed = envSchema.safeParse({
  NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
  NEXT_PUBLIC_APP_URL:
    process.env.NEXT_PUBLIC_APP_URL || (isTest ? "http://localhost:3000" : undefined),
  NEXT_PUBLIC_SITE_DOMAIN: process.env.NEXT_PUBLIC_SITE_DOMAIN,
  NEXT_PUBLIC_DEFAULT_STUDIO_PHONE: process.env.NEXT_PUBLIC_DEFAULT_STUDIO_PHONE,
  NEXT_PUBLIC_USE_MOCK_API: process.env.NEXT_PUBLIC_USE_MOCK_API,
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
  NEXT_PUBLIC_GOOGLE_CLIENT_ID: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
  NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
  NODE_ENV: process.env.NODE_ENV,
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  GOOGLE_OAUTH_REDIRECT_URI: process.env.GOOGLE_OAUTH_REDIRECT_URI,
});

if (!parsed.success) {
  const errorDetails = parsed.error.issues
    .map(issue => `  - [${issue.path.join(".") || "ENV"}]: ${issue.message}`)
    .join("\n");
  console.error(`\n❌ Environment Validation Failed:\n${errorDetails}\n`);
  throw new Error(`Environment Validation Failed:\n${errorDetails}`);
}

const rawApiUrl = (parsed.data.NEXT_PUBLIC_API_URL ||
  parsed.data.NEXT_PUBLIC_API_BASE_URL ||
  (isTest ? "http://localhost:5555/api/v1" : "")) as string;

if (!rawApiUrl) {
  throw new Error(
    "Missing NEXT_PUBLIC_API_URL or NEXT_PUBLIC_API_BASE_URL in environment variables."
  );
}

export const env = {
  ...parsed.data,
  /**
   * Guaranteed valid absolute API Base URL derived strictly from environment variables.
   * If protocol is omitted in the env variable (e.g. 'api.shopwus.com/api/v1'), it automatically prepends 'https://'.
   */
  API_BASE_URL: normalizeUrl(rawApiUrl),
  APP_URL: normalizeUrl(parsed.data.NEXT_PUBLIC_APP_URL),
} as const;
