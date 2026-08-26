import { CUSTOM_EVENTS, STORAGE_KEYS } from "@/constants";
import { currentUser } from "@/lib/mock-data";
import type { User } from "@/lib/types";

const delay = (ms = 150) => new Promise(resolve => setTimeout(resolve, ms));

export interface UserSession {
  id: string;
  name: string;
  email: string;
  role: string;
  studioName?: string;
  studioSlug?: string;
}

export async function getCurrentUser(): Promise<User> {
  await delay(80);
  return currentUser;
}

export function getCurrentSession(): UserSession | null {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem(STORAGE_KEYS.session);
    if (!stored) return null;
    try {
      return JSON.parse(stored);
    } catch {
      return null;
    }
  }
  return null;
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
    localStorage.setItem(STORAGE_KEYS.session, JSON.stringify(session));
    window.dispatchEvent(new CustomEvent(CUSTOM_EVENTS.authChanged, { detail: session }));
  }
  return session;
}

export function clearSession(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem(STORAGE_KEYS.session);
    window.dispatchEvent(new CustomEvent(CUSTOM_EVENTS.authChanged, { detail: null }));
  }
}
