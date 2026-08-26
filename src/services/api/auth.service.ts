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
  avatarUrl?: string;
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
    email: user.email || "director@elanatelier.com",
    role: user.role || "Studio Director",
    studioName: user.studioName || "Élan Events",
    studioSlug: user.studioSlug || "elan-events",
    avatarUrl:
      user.avatarUrl ||
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
  };
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEYS.session, JSON.stringify(session));
    // biome-ignore lint/suspicious/noDocumentCookie: cookie synchronization required for Next.js edge middleware
    document.cookie = `${STORAGE_KEYS.session}=${encodeURIComponent(JSON.stringify(session))}; path=/; max-age=2592000; SameSite=Lax`;
    window.dispatchEvent(new CustomEvent(CUSTOM_EVENTS.authChanged, { detail: session }));
  }
  return session;
}

/**
 * Initiates Google OAuth Sign-in.
 * Currently uses simulated OAuth round-trip.
 * When connecting to real backend, simply replace the body with:
 * `window.location.href = '/api/auth/google?redirect=' + encodeURIComponent(redirectUrl)`
 */
export async function signInWithGoogle(options?: { claimSlug?: string }): Promise<UserSession> {
  await delay(350);

  const claim = options?.claimSlug;
  const studioName = claim
    ? `${claim
        .split("-")
        .map(w => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ")} Atelier`
    : "Élan Events";
  const studioSlug = claim || "elan-events";

  return createSession({
    name: "Amelia Bell",
    email: "amelia.bell@gmail.com",
    role: "Studio Director",
    studioName,
    studioSlug,
  });
}

/**
 * Initiates Google OAuth Sign-up / Atelier Claim.
 * When connecting to real backend, easily swap with:
 * `window.location.href = '/api/auth/google/signup?claim=' + encodeURIComponent(data.slug)`
 */
export async function signUpWithGoogle(data?: {
  slug?: string;
  studioName?: string;
  fullName?: string;
}): Promise<UserSession> {
  await delay(350);

  const effectiveSlug = data?.slug || "my-atelier";
  const effectiveName =
    data?.studioName ||
    `${effectiveSlug
      .split("-")
      .map(w => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ")} Atelier`;
  const effectiveDirector = data?.fullName || "Amelia Bell";

  return createSession({
    name: effectiveDirector,
    email: "amelia.bell@gmail.com",
    role: "Studio Director",
    studioName: effectiveName,
    studioSlug: effectiveSlug,
  });
}

export function clearSession(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem(STORAGE_KEYS.session);
    // biome-ignore lint/suspicious/noDocumentCookie: cookie synchronization required for Next.js edge middleware
    document.cookie = `${STORAGE_KEYS.session}=; path=/; max-age=0; SameSite=Lax`;
    window.dispatchEvent(new CustomEvent(CUSTOM_EVENTS.authChanged, { detail: null }));
  }
}
