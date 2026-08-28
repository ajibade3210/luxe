import {
  GOOGLE_REVIEW_CONSTANTS,
  INITIAL_MOCK_GOOGLE_REVIEWS,
  INITIAL_MOCK_LOCATIONS,
} from "@/constants";
import type { GoogleBusinessConnection, GoogleReview, ReviewSummary } from "@/types";

export function calculateReviewSummary(reviews: GoogleReview[]): ReviewSummary {
  if (!reviews.length) {
    return {
      averageRating: 5.0,
      totalReviews: 0,
      ratingCounts: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
    };
  }

  const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  let sum = 0;

  for (const rev of reviews) {
    const r = Math.min(5, Math.max(1, Math.round(rev.rating))) as 1 | 2 | 3 | 4 | 5;
    counts[r] = (counts[r] || 0) + 1;
    sum += rev.rating;
  }

  const avg = Number((sum / reviews.length).toFixed(1));

  return {
    averageRating: avg,
    totalReviews: reviews.length,
    ratingCounts: counts,
  };
}

export function getGoogleReviewIntentUrl(placeId?: string): string {
  const pid = placeId || GOOGLE_REVIEW_CONSTANTS.DEFAULT_PLACE_ID;
  return `${GOOGLE_REVIEW_CONSTANTS.WRITE_REVIEW_BASE_URL}${pid}`;
}

export function getGoogleMapsViewUrl(placeId?: string): string {
  const pid = placeId || GOOGLE_REVIEW_CONSTANTS.DEFAULT_PLACE_ID;
  return `${GOOGLE_REVIEW_CONSTANTS.VIEW_REVIEWS_BASE_URL}${pid}`;
}

function getStoredConnection(): GoogleBusinessConnection {
  if (typeof window === "undefined") {
    return {
      status: "connected",
      accountId: "acc-google-109283",
      accountName: "Élan Events Global LLC",
      selectedLocation: INITIAL_MOCK_LOCATIONS[0],
      availableLocations: INITIAL_MOCK_LOCATIONS,
      lastSyncedAt: new Date().toISOString(),
      reviewSummary: calculateReviewSummary(INITIAL_MOCK_GOOGLE_REVIEWS),
      directReviewUrl: getGoogleReviewIntentUrl(INITIAL_MOCK_LOCATIONS[0].placeId),
    };
  }

  // 1. Check for freshly set OAuth callback cookie
  try {
    const cookieMatch = document.cookie.match(/shopwus_google_conn=([^;]+)/);
    if (cookieMatch?.[1]) {
      const decoded = decodeURIComponent(cookieMatch[1]);
      const parsed = JSON.parse(decoded);
      if (parsed && typeof parsed === "object") {
        saveStoredConnection(parsed);
        // biome-ignore lint/suspicious/noDocumentCookie: Cookie clearing after hydration
        document.cookie = "shopwus_google_conn=; Max-Age=0; path=/;";
        return parsed;
      }
    }
  } catch {
    // Ignore cookie parse error
  }

  // 2. Check localStorage
  try {
    const raw = localStorage.getItem(GOOGLE_REVIEW_CONSTANTS.STORAGE_KEY_CONNECTION);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch {
    // Ignore error and return default
  }

  return {
    status: "connected",
    accountId: "acc-google-109283",
    accountName: "Élan Events Global LLC",
    selectedLocation: INITIAL_MOCK_LOCATIONS[0],
    availableLocations: INITIAL_MOCK_LOCATIONS,
    lastSyncedAt: new Date().toISOString(),
    reviewSummary: calculateReviewSummary(INITIAL_MOCK_GOOGLE_REVIEWS),
    directReviewUrl: getGoogleReviewIntentUrl(INITIAL_MOCK_LOCATIONS[0].placeId),
  };
}

function saveStoredConnection(connection: GoogleBusinessConnection): void {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(
        GOOGLE_REVIEW_CONSTANTS.STORAGE_KEY_CONNECTION,
        JSON.stringify(connection)
      );
    } catch {
      // Storage unavailable
    }
  }
}

export function getStoredReviews(): GoogleReview[] {
  if (typeof window === "undefined") {
    return INITIAL_MOCK_GOOGLE_REVIEWS;
  }

  try {
    const raw = localStorage.getItem(GOOGLE_REVIEW_CONSTANTS.STORAGE_KEY_REVIEWS);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch {
    // Return default
  }

  return INITIAL_MOCK_GOOGLE_REVIEWS;
}

function saveStoredReviews(reviews: GoogleReview[]): void {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(GOOGLE_REVIEW_CONSTANTS.STORAGE_KEY_REVIEWS, JSON.stringify(reviews));
    } catch {
      // Storage unavailable
    }
  }
}

export async function getGoogleConnection(): Promise<GoogleBusinessConnection> {
  await new Promise(r => setTimeout(r, 100));
  return getStoredConnection();
}

export async function getGoogleReviews(): Promise<GoogleReview[]> {
  await new Promise(r => setTimeout(r, 100));
  return getStoredReviews();
}

export async function connectGoogleBusiness(
  selectedLocationId?: string
): Promise<GoogleBusinessConnection> {
  await new Promise(r => setTimeout(r, 600));

  const loc =
    INITIAL_MOCK_LOCATIONS.find(l => l.locationId === selectedLocationId) ||
    INITIAL_MOCK_LOCATIONS[0];

  const reviews = getStoredReviews();
  const summary = calculateReviewSummary(reviews);

  const connection: GoogleBusinessConnection = {
    status: "connected",
    accountId: "acc-google-109283",
    accountName: "Élan Events Global LLC",
    selectedLocation: loc,
    availableLocations: INITIAL_MOCK_LOCATIONS,
    lastSyncedAt: new Date().toISOString(),
    reviewSummary: summary,
    directReviewUrl: getGoogleReviewIntentUrl(loc.placeId),
  };

  saveStoredConnection(connection);
  return connection;
}

export async function disconnectGoogleBusiness(): Promise<GoogleBusinessConnection> {
  await new Promise(r => setTimeout(r, 400));

  const connection: GoogleBusinessConnection = {
    status: "disconnected",
    availableLocations: [],
    reviewSummary: {
      averageRating: 0,
      totalReviews: 0,
      ratingCounts: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
    },
  };

  saveStoredConnection(connection);
  return connection;
}

export async function selectGoogleLocation(locationId: string): Promise<GoogleBusinessConnection> {
  await new Promise(r => setTimeout(r, 300));
  const current = getStoredConnection();
  const loc =
    current.availableLocations.find(l => l.locationId === locationId) ||
    current.availableLocations[0];

  const updated: GoogleBusinessConnection = {
    ...current,
    selectedLocation: loc,
    directReviewUrl: getGoogleReviewIntentUrl(loc?.placeId),
  };

  saveStoredConnection(updated);
  return updated;
}

export async function syncGoogleReviews(
  _locationId?: string
): Promise<{ connection: GoogleBusinessConnection; reviews: GoogleReview[] }> {
  await new Promise(r => setTimeout(r, 800));

  const reviews = getStoredReviews();
  const summary = calculateReviewSummary(reviews);
  const current = getStoredConnection();

  const updated: GoogleBusinessConnection = {
    ...current,
    status: "connected",
    lastSyncedAt: new Date().toISOString(),
    reviewSummary: summary,
  };

  saveStoredConnection(updated);
  saveStoredReviews(reviews);

  return { connection: updated, reviews };
}
