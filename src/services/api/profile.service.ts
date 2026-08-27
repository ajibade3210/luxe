import { CUSTOM_EVENTS, PROFILE_VERSION, RESERVED_SLUGS, STORAGE_KEYS } from "@/constants";
import { businessProfile as defaultProfile, featuredOrganizations } from "@/lib/mock-data";
import type { BusinessProfile, ReviewItem, ServiceItem } from "@/types";

const delay = (ms = 150) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Normalizes services from any format (string[] or ServiceItem[]) to ServiceItem[].
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
    return { ...s, id: s.id ?? `svc-${i}` } satisfies ServiceItem;
  });
}

let memoryProfile: BusinessProfile = {
  ...defaultProfile,
  services: normalizeServices(defaultProfile.services as (string | ServiceItem)[]),
};

export function loadPersistedProfile(): BusinessProfile {
  if (typeof window !== "undefined") {
    try {
      const storedVersion = Number(localStorage.getItem(STORAGE_KEYS.profileVersion) ?? "0");
      const saved = localStorage.getItem(STORAGE_KEYS.profile);

      if (saved && storedVersion >= PROFILE_VERSION) {
        const parsed = JSON.parse(saved);
        if (parsed.services) {
          parsed.services = normalizeServices(parsed.services);
        }
        memoryProfile = { ...memoryProfile, ...parsed };
        return memoryProfile;
      }
      if (storedVersion < PROFILE_VERSION) {
        localStorage.removeItem(STORAGE_KEYS.profile);
        localStorage.setItem(STORAGE_KEYS.profileVersion, String(PROFILE_VERSION));
      }
    } catch {
      // Fallback
    }
  }
  return memoryProfile;
}

export function savePersistedProfile(profile: BusinessProfile) {
  memoryProfile = { ...profile };
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(STORAGE_KEYS.profile, JSON.stringify(profile));
      localStorage.setItem(STORAGE_KEYS.profileVersion, String(PROFILE_VERSION));
      window.dispatchEvent(new CustomEvent(CUSTOM_EVENTS.profileUpdated, { detail: profile }));
    } catch {
      // Storage quota safety
    }
  }
}

export async function getBusinessProfile(): Promise<BusinessProfile> {
  await delay(80);
  return loadPersistedProfile();
}

export async function getBusinessBySlug(slug: string): Promise<BusinessProfile | null> {
  await delay(100);
  const current = loadPersistedProfile();
  const normalized = (slug || "").toLowerCase().trim();

  if (!normalized || normalized === current.slug || normalized === "elan-events") {
    return current;
  }

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
  const isAvailable =
    !RESERVED_SLUGS.includes(normalized as (typeof RESERVED_SLUGS)[number]) &&
    normalized.length >= 3;
  return {
    available: isAvailable,
    slug: normalized,
  };
}

export async function updateBusinessProfile(
  input: Partial<BusinessProfile>
): Promise<BusinessProfile> {
  await delay(300);
  const current = loadPersistedProfile();
  const updated: BusinessProfile = {
    ...current,
    ...input,
    updatedAt: new Date().toISOString(),
  };
  savePersistedProfile(updated);
  return updated;
}

export async function publishChanges() {
  await delay(400);
  const current = loadPersistedProfile();
  const updated: BusinessProfile = {
    ...current,
    updatedAt: new Date().toISOString(),
  };
  savePersistedProfile(updated);
  return { publishedAt: updated.updatedAt };
}

export async function connectSocialChannel(id: string) {
  await delay(200);
  const current = loadPersistedProfile();
  const updatedChannels = current.socialChannels.map(c =>
    c.id === id ? { ...c, connected: true } : c
  );
  savePersistedProfile({ ...current, socialChannels: updatedChannels });
  return updatedChannels.find(c => c.id === id);
}

export async function disconnectSocialChannel(id: string) {
  await delay(200);
  const current = loadPersistedProfile();
  const updatedChannels = current.socialChannels.map(c =>
    c.id === id ? { ...c, connected: false } : c
  );
  savePersistedProfile({ ...current, socialChannels: updatedChannels });
  return updatedChannels.find(c => c.id === id);
}

export async function submitReview(input: Omit<ReviewItem, "id" | "date">): Promise<ReviewItem> {
  await delay(300);
  const newReview: ReviewItem = {
    id: `rev-${Date.now()}`,
    ...input,
    date: "Just now",
  };
  const current = loadPersistedProfile();
  const updatedReviews = [newReview, ...(current.reviews ?? [])];
  savePersistedProfile({ ...current, reviews: updatedReviews });
  return newReview;
}
