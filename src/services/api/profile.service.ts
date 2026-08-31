import { apiClient } from "@/lib/api-client";
import type { BusinessProfile, OrganizationPreview, ReviewItem, ServiceItem } from "@/types";
import { slugify } from "@/utils";

export function normalizeServices(raw: (string | ServiceItem)[] | undefined): ServiceItem[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((s, i) => {
    if (typeof s === "string") {
      return {
        id: `svc-legacy-${i}`,
        name: s,
        category: "",
        description: "",
      } satisfies ServiceItem;
    }
    return { ...s, id: s.id ?? `svc-${i}` } satisfies ServiceItem;
  });
}

let inFlightProfilePromise: Promise<BusinessProfile> | null = null;

export async function getBusinessProfile(): Promise<BusinessProfile> {
  if (inFlightProfilePromise) {
    return inFlightProfilePromise;
  }

  inFlightProfilePromise = (async () => {
    try {
      const profile = await apiClient.get<BusinessProfile>("/studios/me");
      return {
        ...profile,
        services: normalizeServices(profile.services as (string | ServiceItem)[]),
      };
    } finally {
      setTimeout(() => {
        inFlightProfilePromise = null;
      }, 50);
    }
  })();

  return inFlightProfilePromise;
}

export async function getBusinessBySlug(slug: string): Promise<BusinessProfile | null> {
  const normalized = (slug || "").toLowerCase().trim();
  const profile = await apiClient.get<BusinessProfile>(
    `/studios/${encodeURIComponent(normalized)}`
  );
  if (!profile) return null;
  return {
    ...profile,
    services: normalizeServices(profile.services as (string | ServiceItem)[]),
  };
}

export async function checkSlugAvailability(
  slug: string
): Promise<{ available: boolean; slug: string }> {
  return apiClient.get<{ available: boolean; slug: string }>("/studios/check-slug", {
    slug: slugify(slug),
  });
}

export async function updateBusinessProfile(
  input: Partial<BusinessProfile>
): Promise<BusinessProfile> {
  const updated = await apiClient.put<BusinessProfile>("/studios/me", input);
  return {
    ...updated,
    services: normalizeServices(updated.services as (string | ServiceItem)[]),
  };
}

export async function publishChanges(): Promise<{ publishedAt: string }> {
  await apiClient.post("/studios/me/publish", { isLive: true });
  return { publishedAt: new Date().toISOString() };
}

export async function connectSocialChannel(id: string) {
  return apiClient.post(`/studios/me/social-channels/${encodeURIComponent(id)}/connect`);
}

export async function disconnectSocialChannel(id: string) {
  return apiClient.post(`/studios/me/social-channels/${encodeURIComponent(id)}/disconnect`);
}

export async function submitReview(
  input: Omit<ReviewItem, "id" | "date"> & { studioSlug?: string }
): Promise<ReviewItem> {
  const targetSlug = input.studioSlug;
  if (!targetSlug) {
    throw new Error("studioSlug is required to submit a review");
  }
  return apiClient.post<ReviewItem>(`/studios/${encodeURIComponent(targetSlug)}/reviews`, {
    author: input.author,
    rating: input.rating,
    comment: input.comment,
    eventType: input.eventType || "Creative Commission",
    role: input.role,
    avatar: input.avatar,
  });
}

export async function getFeaturedOrganizations(): Promise<OrganizationPreview[]> {
  const res = await apiClient.get<OrganizationPreview[]>("/studios/featured");
  return Array.isArray(res) ? res : [];
}
