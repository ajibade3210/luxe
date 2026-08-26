/**
 * Global Application Constants & Configuration
 * Single Source of Truth for storage keys, default configs, and routing rules.
 */

export const APP_CONFIG = {
  name: process.env.NEXT_PUBLIC_APP_NAME || "Shopwus",
  defaultStudioPhone: process.env.NEXT_PUBLIC_DEFAULT_STUDIO_PHONE || "+2348055966944",
  defaultSlug: "elan-events",
  siteDomain: process.env.NEXT_PUBLIC_SITE_DOMAIN || "shopwus.com",
  baseUrl: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
} as const;

export const STORAGE_KEYS = {
  profile: "luxe_business_profile",
  profileVersion: "luxe_profile_version",
  leads: "luxe_leads_data",
  session: "luxe_auth_session",
} as const;

export const PROFILE_VERSION = 2; // v2: services migrated to ServiceItem[]

export const RESERVED_SLUGS = [
  "admin",
  "login",
  "signup",
  "leads",
  "customers",
  "settings",
  "api",
  "profile",
] as const;

export const CUSTOM_EVENTS = {
  leadsUpdated: "luxe_leads_updated",
  profileUpdated: "luxe_profile_updated",
  authChanged: "luxe_auth_changed",
} as const;
