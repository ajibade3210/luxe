import {
  activities,
  businessProfile,
  currentUser,
  customers,
  featuredOrganizations,
  leads,
  socialChannels,
} from "./mock-data";
import type {
  BusinessProfile,
  Customer,
  Lead,
  LeadStatus,
  ReviewItem,
  ServiceItem,
  User,
} from "./types";

const STORAGE_KEY = "luxe_business_profile";
/** Bump this whenever a breaking schema change is made to BusinessProfile. */
const PROFILE_VERSION = 2; // v2: services migrated from string[] to ServiceItem[]
const VERSION_KEY = "luxe_profile_version";

const delay = (ms = 150) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Normalizes services from any format (string[] or ServiceItem[]) to ServiceItem[].
 * This is the single source-of-truth migration point for both localStorage data
 * and future API responses — callers never need to handle the old format.
 *
 * When switching to a real API, call this on the raw API response before storing
 * it in state. The function is intentionally format-agnostic.
 */
export function normalizeServices(raw: (string | ServiceItem)[] | undefined): ServiceItem[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((s, i) => {
    if (typeof s === "string") {
      return {
        id: `svc-legacy-${i}`,
        name: s,
        category: "Bespoke",
        description: "",
      } satisfies ServiceItem;
    }
    // Ensure id always exists even if API omits it
    return { ...s, id: s.id ?? `svc-${i}` } satisfies ServiceItem;
  });
}

function loadPersistedProfile(): BusinessProfile {
  if (typeof window !== "undefined") {
    try {
      const storedVersion = Number(localStorage.getItem(VERSION_KEY) ?? "0");
      const saved = localStorage.getItem(STORAGE_KEY);

      if (saved && storedVersion >= PROFILE_VERSION) {
        // Schema is current — merge persisted data
        const parsed = JSON.parse(saved);
        if (parsed.services) {
          parsed.services = normalizeServices(parsed.services);
        }
        Object.assign(businessProfile, parsed);
      } else if (storedVersion < PROFILE_VERSION) {
        // Stale schema — clear and re-persist with fresh mock data
        localStorage.removeItem(STORAGE_KEY);
        localStorage.setItem(VERSION_KEY, String(PROFILE_VERSION));
      }
    } catch {
      // Fallback to in-memory profile
    }
  }
  // Always normalize in-memory profile (handles fresh mock data path)
  businessProfile.services = normalizeServices(
    businessProfile.services as (string | ServiceItem)[]
  );
  return businessProfile;
}

function savePersistedProfile(profile: BusinessProfile) {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
      localStorage.setItem(VERSION_KEY, String(PROFILE_VERSION));
      window.dispatchEvent(new CustomEvent("luxe_profile_updated", { detail: profile }));
    } catch {
      // Ignore storage quota errors
    }
  }
}

export async function getCurrentUser(): Promise<User> {
  await delay(80);
  return currentUser;
}

export async function getBusinessProfile(): Promise<BusinessProfile> {
  await delay(80);
  return loadPersistedProfile();
}

export async function getBusinessBySlug(slug: string): Promise<BusinessProfile | null> {
  await delay(100);
  const current = loadPersistedProfile();
  const normalized = (slug || "").toLowerCase().trim();

  // If matches active persisted business slug or default preview
  if (!normalized || normalized === current.slug || normalized === "elan-events") {
    return current;
  }

  // Look up in featured organizations directory
  const matchedOrg = featuredOrganizations.find(o => o.slug.toLowerCase() === normalized);
  if (matchedOrg) {
    return {
      ...current,
      id: `bp-${matchedOrg.slug}`,
      businessName: matchedOrg.name,
      slug: matchedOrg.slug,
      tagline: matchedOrg.tagline,
      logoUrl: matchedOrg.logoUrl,
    };
  }

  // Slug not found in registry
  return null;
}

export async function checkSlugAvailability(
  slug: string
): Promise<{ available: boolean; slug: string }> {
  await delay(200);
  const normalized = slug
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "-")
    .replace(/-+/g, "-");
  const reserved = ["admin", "login", "signup", "leads", "customers", "settings", "api", "profile"];
  const isAvailable = !reserved.includes(normalized) && normalized.length >= 3;
  return {
    available: isAvailable,
    slug: normalized,
  };
}

const LEADS_STORAGE_KEY = "luxe_leads_data";

function loadPersistedLeads(): Lead[] {
  if (typeof window !== "undefined") {
    try {
      const saved = localStorage.getItem(LEADS_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // Fallback to default mock leads
    }
  }
  return [...leads];
}

function savePersistedLeads(data: Lead[]): void {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(LEADS_STORAGE_KEY, JSON.stringify(data));
      window.dispatchEvent(new CustomEvent("luxe_leads_updated", { detail: data }));
    } catch {
      // Storage quota safety
    }
  }
}

/**
 * Creates a new consultation inquiry lead.
 *
 * Mock implementation: Persists to local leads state & broadcasts updates.
 * Ready for production: Replace function body with `await fetch('/api/v1/leads', ...)`
 */
export async function createLead(input: Omit<Lead, "id" | "createdAt" | "status">): Promise<Lead> {
  await delay(300);
  const currentLeads = loadPersistedLeads();
  const newLead: Lead = {
    id: `l-${Date.now()}`,
    ...input,
    status: "new",
    createdAt: new Date().toISOString(),
  };
  currentLeads.unshift(newLead);
  savePersistedLeads(currentLeads);
  return newLead;
}

/** Backward-compatible alias for createLead */
export const submitConsultationInquiry = createLead;

/**
 * Generates a pre-formatted WhatsApp chat URL with the client's consultation inquiry brief.
 * Mock-ready: easily swappable with server-side WhatsApp Business API / webhooks in production.
 */
export function createWhatsAppConsultationUrl(params: {
  studioPhone?: string;
  studioName: string;
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  service: string;
  eventDate?: string;
  budget?: number | string;
  message?: string;
}): string {
  const rawPhone = (params.studioPhone || "+2348055966944").replace(/[^0-9]/g, "");
  const targetPhone = rawPhone.length >= 7 ? rawPhone : "2348055966944";

  const budgetDisplay = params.budget
    ? `$${Number(params.budget).toLocaleString()}`
    : "Custom / To be discussed";

  const brief = `✨ *New Consultation Inquiry — Shopwus*
━━━━━━━━━━━━━━━━━━━━━
👤 *Client Name:* ${params.clientName}
📱 *Phone:* ${params.clientPhone || "Not provided"}
✉️ *Email:* ${params.clientEmail}
🛎️ *Service Requested:* ${params.service}
📅 *Estimated Date:* ${params.eventDate || "Flexible"}
💰 *Target Budget:* ${budgetDisplay}

💬 *Event Vision & Details:*
${params.message || "Consultation requested via Shopwus studio profile."}
━━━━━━━━━━━━━━━━━━━━━
_Sent via ${params.studioName} on Shopwus_`;

  return `https://wa.me/${targetPhone}?text=${encodeURIComponent(brief)}`;
}

export async function uploadBusinessLogo(
  _file?: File | Blob | string
): Promise<{ url: string; success: boolean }> {
  await delay(400);
  const cdnUrl =
    "https://cdn.accessa.ng/test/accessa/louis-dike-ayskyj/images/c95e52aa48bf676ed0d53f36bb957b81.png";
  return {
    url: cdnUrl,
    success: true,
  };
}

export async function uploadPortfolioImage(
  file?: File | Blob | string
): Promise<{ url: string; success: boolean }> {
  await delay(350);
  if (file && typeof window !== "undefined" && file instanceof File) {
    return new Promise(resolve => {
      const reader = new FileReader();
      reader.onload = e => {
        const dataUrl = e.target?.result as string;
        resolve({ url: dataUrl, success: true });
      };
      reader.onerror = () => {
        resolve({
          url: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80",
          success: true,
        });
      };
      reader.readAsDataURL(file);
    });
  }
  return {
    url: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80",
    success: true,
  };
}

export async function submitReview(input: Omit<ReviewItem, "id" | "date">): Promise<ReviewItem> {
  await delay(300);
  const newReview: ReviewItem = {
    id: `rev-${Date.now()}`,
    ...input,
    date: "Just now",
  };
  const current = loadPersistedProfile();
  if (current.reviews) {
    current.reviews.unshift(newReview);
  } else {
    current.reviews = [newReview];
  }
  savePersistedProfile(current);
  return newReview;
}

/**
 * Fetches all leads.
 * Ready for production: Replace function body with `await fetch('/api/v1/leads').then(r => r.json())`
 */
export async function getLeads(): Promise<Lead[]> {
  await delay(100);
  return loadPersistedLeads();
}

export async function getCustomers(): Promise<Customer[]> {
  await delay(100);
  return customers;
}

export async function getCustomer(id: string): Promise<Customer | undefined> {
  await delay(120);
  return customers.find(c => c.id === id);
}

export async function getCustomerActivity(id: string) {
  await delay(100);
  return activities.filter(a => a.customerId === id);
}

export async function updateBusinessProfile(
  input: Partial<BusinessProfile>
): Promise<BusinessProfile> {
  await delay(300);
  const current = loadPersistedProfile();
  Object.assign(current, input, { updatedAt: new Date().toISOString() });
  savePersistedProfile(current);
  return current;
}

/**
 * Updates a lead's workflow status (e.g. new -> contacted -> converted).
 * Ready for production: Replace with `await fetch('/api/v1/leads/' + id, { method: 'PATCH', ... })`
 */
export async function updateLeadStatus(id: string, status: LeadStatus): Promise<Lead | undefined> {
  await delay(250);
  const currentLeads = loadPersistedLeads();
  const lead = currentLeads.find(l => l.id === id);
  if (lead) {
    lead.status = status;
    savePersistedLeads(currentLeads);
  }
  return lead;
}

export async function publishChanges() {
  await delay(400);
  const current = loadPersistedProfile();
  current.updatedAt = new Date().toISOString();
  savePersistedProfile(current);
  return { publishedAt: current.updatedAt };
}

export async function connectSocialChannel(id: string) {
  await delay(200);
  const current = loadPersistedProfile();
  const channel = current.socialChannels.find(c => c.id === id);
  if (channel) {
    channel.connected = true;
    savePersistedProfile(current);
  }
  return channel;
}

export async function disconnectSocialChannel(id: string) {
  await delay(200);
  const current = loadPersistedProfile();
  const channel = current.socialChannels.find(c => c.id === id);
  if (channel) {
    channel.connected = false;
    savePersistedProfile(current);
  }
  return channel;
}

export interface UserSession {
  id: string;
  name: string;
  email: string;
  role: string;
  studioName?: string;
  studioSlug?: string;
}

export function getCurrentSession(): UserSession | null {
  if (typeof window === "undefined") return null;
  const stored = localStorage.getItem("luxe_auth_session");
  if (!stored) return null;
  try {
    return JSON.parse(stored);
  } catch {
    return null;
  }
}

export function isAuthenticated(): boolean {
  return getCurrentSession() !== null;
}

export function createSession(user: Partial<UserSession>): UserSession {
  const session: UserSession = {
    id: user.id || `usr-${Date.now()}`,
    name: user.name || "Amelia Bell",
    email: user.email || "hello@elanevents.com",
    role: user.role || "Studio Director",
    studioName: user.studioName || "Élan Events",
    studioSlug: user.studioSlug || "elan-events",
  };
  if (typeof window !== "undefined") {
    localStorage.setItem("luxe_auth_session", JSON.stringify(session));
    window.dispatchEvent(new CustomEvent("luxe_auth_changed", { detail: session }));
  }
  return session;
}

export function clearSession(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem("luxe_auth_session");
    window.dispatchEvent(new CustomEvent("luxe_auth_changed", { detail: null }));
  }
}

export { socialChannels };
