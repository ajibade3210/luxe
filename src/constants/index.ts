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
  profile: "shopwus_business_profile",
  profileVersion: "shopwus_profile_version",
  leads: "shopwus_leads_data",
  session: "shopwus_auth_session",
  autoQuoteModalSeen: "shopwus_auto_quote_modal_seen",
} as const;

export const AUTO_QUOTE_MODAL_DELAY_MS = 60_000; // 1 minute dwell time

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
  "analytics",
  "overview",
] as const;

export const CUSTOM_EVENTS = {
  leadsUpdated: "shopwus_leads_updated",
  customersUpdated: "shopwus_customers_updated",
  invoicesUpdated: "shopwus_invoices_updated",
  profileUpdated: "shopwus_profile_updated",
  authChanged: "shopwus_auth_changed",
  broadcastSent: "shopwus_broadcast_sent",
} as const;

export const API_ENDPOINTS = {
  leads: "/api/leads",
  customers: "/api/customers",
  invoices: "/api/invoices",
  analytics: "/api/analytics",
  profile: "/api/profile",
  auth: "/api/auth",
} as const;

export const SOCIAL_PREFIX_MAP: Record<string, string> = {
  instagram: "instagram.com/",
  facebook: "facebook.com/",
  linkedin: "linkedin.com/in/",
  tiktok: "tiktok.com/@",
  x: "x.com/",
  youtube: "youtube.com/@",
  whatsapp: "wa.me/",
  threads: "threads.com/",
  pinterest: "pinterest.com/",
  website: "https://",
} as const;

export * from "./landing";
