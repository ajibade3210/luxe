import { describe, expect, it } from "vitest";
import { GOOGLE_REVIEW_CONSTANTS, INITIAL_MOCK_GOOGLE_REVIEWS } from "@/constants";
import {
  calculateReviewSummary,
  connectGoogleBusiness,
  disconnectGoogleBusiness,
  getGoogleConnection,
  getGoogleMapsViewUrl,
  getGoogleReviewIntentUrl,
  getGoogleReviews,
  selectGoogleLocation,
  syncGoogleReviews,
} from "../reviews.service";

describe("Reviews Service", () => {
  it("calculates accurate review summary metrics", () => {
    const summary = calculateReviewSummary(INITIAL_MOCK_GOOGLE_REVIEWS);
    expect(summary.totalReviews).toBe(INITIAL_MOCK_GOOGLE_REVIEWS.length);
    expect(summary.averageRating).toBeGreaterThanOrEqual(4.0);
    expect(summary.averageRating).toBeLessThanOrEqual(5.0);
    expect(summary.ratingCounts[5]).toBeGreaterThan(0);
  });

  it("handles empty review list gracefully in summary calculation", () => {
    const emptySummary = calculateReviewSummary([]);
    expect(emptySummary.totalReviews).toBe(0);
    expect(emptySummary.averageRating).toBe(5.0);
    expect(emptySummary.ratingCounts[5]).toBe(0);
  });

  it("generates correct 1-click Google review intent URL with Place ID", () => {
    const customPlaceId = "ChIJTestPlaceId12345";
    const url = getGoogleReviewIntentUrl(customPlaceId);
    expect(url).toBe(`${GOOGLE_REVIEW_CONSTANTS.WRITE_REVIEW_BASE_URL}${customPlaceId}`);

    const defaultUrl = getGoogleReviewIntentUrl();
    expect(defaultUrl).toBe(
      `${GOOGLE_REVIEW_CONSTANTS.WRITE_REVIEW_BASE_URL}${GOOGLE_REVIEW_CONSTANTS.DEFAULT_PLACE_ID}`
    );
  });

  it("generates correct Google Maps view URL", () => {
    const customPlaceId = "ChIJTestPlaceId12345";
    const url = getGoogleMapsViewUrl(customPlaceId);
    expect(url).toBe(`${GOOGLE_REVIEW_CONSTANTS.VIEW_REVIEWS_BASE_URL}${customPlaceId}`);
  });

  it("fetches active Google connection and reviews", async () => {
    const connection = await getGoogleConnection();
    expect(connection).toBeDefined();
    expect(connection.status).toBe("connected");
    expect(connection.availableLocations.length).toBeGreaterThan(0);

    const reviews = await getGoogleReviews();
    expect(reviews.length).toBeGreaterThan(0);
    expect(reviews[0].author).toBeDefined();
  });

  it("switches connected Google location and updates direct review URL", async () => {
    const connection = await getGoogleConnection();
    const secondLocation = connection.availableLocations[1];

    if (secondLocation) {
      const updated = await selectGoogleLocation(secondLocation.locationId);
      expect(updated.selectedLocation?.locationId).toBe(secondLocation.locationId);
      expect(updated.directReviewUrl).toContain(secondLocation.placeId);
    }
  });

  it("syncs reviews and updates summary metadata", async () => {
    const result = await syncGoogleReviews();
    expect(result.connection.status).toBe("connected");
    expect(result.connection.lastSyncedAt).toBeDefined();
    expect(result.reviews.length).toBeGreaterThan(0);
  });

  it("disconnects and reconnects Google account cleanly", async () => {
    const disconnected = await disconnectGoogleBusiness();
    expect(disconnected.status).toBe("disconnected");

    const reconnected = await connectGoogleBusiness();
    expect(reconnected.status).toBe("connected");
    expect(reconnected.selectedLocation).toBeDefined();
    expect(reconnected.directReviewUrl).toBeDefined();
  });
});
