import type { GoogleLocation, GoogleReview } from "@/types";

export const GOOGLE_REVIEW_CONSTANTS = {
  WRITE_REVIEW_BASE_URL: "https://search.google.com/local/writereview?placeid=",
  VIEW_REVIEWS_BASE_URL: "https://www.google.com/maps/place/?q=place_id:",
  OAUTH_AUTH_URL: "https://accounts.google.com/o/oauth2/v2/auth",
  BUSINESS_API_BASE: "https://mybusinessbusinessinformation.googleapis.com/v1",
  STORAGE_KEY_CONNECTION: "shopwus_google_business_connection",
  STORAGE_KEY_REVIEWS: "shopwus_google_reviews_cache",
  DEFAULT_PLACE_ID: "ChIJN1t_tDeuEmsRUsoyG83frY4",
} as const;

export const INITIAL_MOCK_LOCATIONS: GoogleLocation[] = [
  {
    accountId: "acc-google-109283",
    locationId: "loc-982103",
    locationName: "Élan Events Flagship Studio",
    placeId: "ChIJN1t_tDeuEmsRUsoyG83frY4",
    address: "14 Victoria Island Boulevard, Lagos, Nigeria",
    storeCode: "ELAN-HQ",
  },
  {
    accountId: "acc-google-109283",
    locationId: "loc-982104",
    locationName: "Élan Atelier Lekki",
    placeId: "ChIJN2u_tDeuEmsRUsoyG83frZ5",
    address: "Admiralty Way, Lekki Phase 1, Lagos, Nigeria",
    storeCode: "ELAN-LEKKI",
  },
];

export const INITIAL_MOCK_GOOGLE_REVIEWS: GoogleReview[] = [
  {
    id: "g-rev-1",
    author: "Folashade Alakija",
    authorPhotoUrl: "",
    rating: 5,
    comment:
      "Élan Events orchestrated our anniversary gala with transcendent precision. Every lighting cue, floral arch, and VIP transition was flawless.",
    date: "2 days ago",
    createTime: "2026-08-26T10:00:00Z",
    isVerified: true,
    reply: {
      comment:
        "Thank you so much Lady Folashade! It was an absolute privilege designing this milestone for your family.",
      updateTime: "2026-08-26T14:30:00Z",
    },
  },
  {
    id: "g-rev-2",
    author: "Babatunde Adeleke",
    authorPhotoUrl: "",
    rating: 5,
    comment:
      "The digital card and live run-of-show was the smoothest experience our executive team has had. Unmatched hospitality standards.",
    date: "1 week ago",
    createTime: "2026-08-21T08:15:00Z",
    isVerified: true,
  },
  {
    id: "g-rev-3",
    author: "Zainab Haruna",
    authorPhotoUrl: "",
    rating: 5,
    comment:
      "From bespoke consultations to final invoice dispatch, the professionalism is world-class. Truly the gold standard.",
    date: "2 weeks ago",
    createTime: "2026-08-14T16:45:00Z",
    isVerified: true,
  },
  {
    id: "g-rev-4",
    author: "Chukwuma Eze",
    authorPhotoUrl: "",
    rating: 5,
    comment:
      "Stunning stage aesthetics and punctual coordination. Highly recommend them for any flagship corporate retreat.",
    date: "3 weeks ago",
    createTime: "2026-08-07T11:20:00Z",
    isVerified: true,
  },
  {
    id: "g-rev-5",
    author: "Amina Bello",
    authorPhotoUrl: "",
    rating: 4,
    comment:
      "Beautiful creative direction and swift WhatsApp coordination throughout our wedding week.",
    date: "1 month ago",
    createTime: "2026-07-28T09:00:00Z",
    isVerified: true,
  },
];
