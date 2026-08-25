import {
  activities,
  businessProfile,
  customers,
  currentUser,
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
  SocialChannel,
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
export function normalizeServices(
  raw: (string | ServiceItem)[] | undefined,
): ServiceItem[] {
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
    businessProfile.services as (string | ServiceItem)[],
  );
  return businessProfile;
}

function savePersistedProfile(profile: BusinessProfile) {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
      localStorage.setItem(VERSION_KEY, String(PROFILE_VERSION));
      window.dispatchEvent(
        new CustomEvent("luxe_profile_updated", { detail: profile }),
      );
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

export async function getBusinessBySlug(
  slug: string,
): Promise<BusinessProfile | null> {
  await delay(100);
  const current = loadPersistedProfile();
  const normalized = (slug || "").toLowerCase().trim();

  // If slug matches the configured business slug or is a recognized default preview slug
  if (
    !normalized ||
    normalized === current.slug ||
    normalized === "elan-events" ||
    normalized === "maison-bell-events"
  ) {
    return current;
  }

  // Return active business profile with requested preview slug
  return {
    ...current,
    slug: normalized,
  };
}

export async function checkSlugAvailability(
  slug: string,
): Promise<{ available: boolean; slug: string }> {
  await delay(200);
  const normalized = slug
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "-")
    .replace(/-+/g, "-");
  const reserved = [
    "admin",
    "login",
    "signup",
    "leads",
    "customers",
    "settings",
    "api",
    "profile",
  ];
  const isAvailable = !reserved.includes(normalized) && normalized.length >= 3;
  return {
    available: isAvailable,
    slug: normalized,
  };
}

export async function submitConsultationInquiry(
  input: Omit<Lead, "id" | "createdAt" | "status">,
): Promise<Lead> {
  await delay(300);
  const newLead: Lead = {
    id: `l-${Date.now()}`,
    ...input,
    status: "new",
    createdAt: new Date().toISOString(),
  };
  leads.unshift(newLead);
  return newLead;
}

export async function uploadBusinessLogo(
  _file?: File | Blob | string,
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
  file?: File | Blob | string,
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

export async function submitReview(
  input: Omit<ReviewItem, "id" | "date">,
): Promise<ReviewItem> {
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

export async function getLeads(): Promise<Lead[]> {
  await delay(100);
  return leads;
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
  input: Partial<BusinessProfile>,
): Promise<BusinessProfile> {
  await delay(300);
  const current = loadPersistedProfile();
  Object.assign(current, input, { updatedAt: new Date().toISOString() });
  savePersistedProfile(current);
  return current;
}

export async function updateLeadStatus(id: string, status: LeadStatus) {
  await delay(250);
  const lead = leads.find(l => l.id === id);
  if (lead) lead.status = status;
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

export { socialChannels };
