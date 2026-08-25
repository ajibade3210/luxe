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
  SocialChannel,
  User,
} from "./types";

const STORAGE_KEY = "luxe_business_profile";

const delay = (ms = 150) => new Promise(resolve => setTimeout(resolve, ms));

function loadPersistedProfile(): BusinessProfile {
  if (typeof window !== "undefined") {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        Object.assign(businessProfile, parsed);
      }
    } catch {
      // Fallback to in-memory profile
    }
  }
  return businessProfile;
}

function savePersistedProfile(profile: BusinessProfile) {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
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
