/**
 * Global Application Constants & Configuration
 * Single Source of Truth for storage keys, default configs, and routing rules.
 */

import type { BusinessType } from "@/types";

export const APP_CONFIG = {
  name: process.env.NEXT_PUBLIC_APP_NAME || "Shopwus",
  defaultStudioPhone: process.env.NEXT_PUBLIC_DEFAULT_STUDIO_PHONE || "+2348055966944",
  defaultSlug: "elan-events",
  defaultLeadBudget: 25_000,
  defaultServiceAmount: 35_000,
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

/** Default fallback business type across the app. */
export const DEFAULT_BUSINESS_TYPE = "sales" as const;

/**
 * Maps each BusinessType to its public-facing CTA button label.
 * Used on the studio navbar, consultation modal, and floating action buttons.
 */
export const BUSINESS_TYPE_CTA_MAP = {
  service: "Book a Consultation",
  sales: "Make an Order",
  retail: "Buy Here",
  ecommerce: "Place Order",
} as const;

/** Human-readable one-word labels for BusinessType selectors in Settings. */
export const BUSINESS_TYPE_LABELS: Record<BusinessType, string> = {
  service: "Service",
  sales: "Sales",
  retail: "Retail",
  ecommerce: "Ecommerce",
};

/** Modal eyebrow tag above the title. */
export const BUSINESS_TYPE_MODAL_EYEBROW = {
  service: "Inquiry Desk",
  sales: "Order Desk",
  retail: "Shop Desk",
  ecommerce: "Order Desk",
} as const;

/** Modal subtitle sentence below the title. */
export const BUSINESS_TYPE_MODAL_SUBTITLE = {
  service: "about your project, service requirement, or upcoming occasion.",
  sales: "about your custom order, specifications, or bespoke requirements.",
  retail: "about what you'd like to buy, pick up, or arrange in-store.",
  ecommerce: "what you'd like to order and we'll get it delivered to you.",
} as const;

/** Label for the "what do you need" select in the modal. */
export const BUSINESS_TYPE_ITEM_LABEL = {
  service: "Service Needed",
  sales: "Product / Item",
  retail: "Product / Item",
  ecommerce: "Product / Item",
} as const;

/** Label for the date field in the modal. */
export const BUSINESS_TYPE_DATE_LABEL = {
  service: "Estimated Date",
  sales: "Delivery Date",
  retail: "Collection Date",
  ecommerce: "Delivery Date",
} as const;

/** Placeholder for the message/details textarea. */
export const BUSINESS_TYPE_MESSAGE_PLACEHOLDER = {
  service: "Share details about your requirements, timeline, quantity, or aesthetic preferences...",
  sales: "Share your order details, quantities, specifications, or any customisation notes...",
  retail: "List the items, quantities, and any special requests...",
  ecommerce: "List the items, quantities, and your delivery address or special instructions...",
} as const;

/** Submit button label inside the modal. */
export const BUSINESS_TYPE_SUBMIT_LABEL = {
  service: "Submit Consultation Request",
  sales: "Submit Order Request",
  retail: "Submit Purchase Request",
  ecommerce: "Submit Order",
} as const;

/** Per-service card action link label in the services section. */
export const BUSINESS_TYPE_SERVICE_ACTION = {
  service: "Inquire",
  sales: "Order",
  retail: "Buy",
  ecommerce: "Order",
} as const;

/** Section heading and navigation label for the services/products catalog. */
export const BUSINESS_TYPE_SERVICES_SECTION_TITLE = {
  service: "Services",
  sales: "Products",
  retail: "Products",
  ecommerce: "Products",
} as const;

/** Section heading and navigation label for the gallery/portfolio. */
export const BUSINESS_TYPE_PORTFOLIO_SECTION_TITLE = {
  service: "Portfolio",
  sales: "Lookbook",
  retail: "Gallery",
  ecommerce: "Showcase",
} as const;

export * from "./landing";
