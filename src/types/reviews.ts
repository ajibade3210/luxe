export type GoogleStarRating = "ONE" | "TWO" | "THREE" | "FOUR" | "FIVE";

export type GoogleConnectionStatus = "disconnected" | "connecting" | "connected" | "error";

export interface GoogleReviewReply {
  comment: string;
  updateTime: string;
}

export interface GoogleReview {
  id: string;
  author: string;
  authorPhotoUrl?: string;
  rating: number;
  comment: string;
  date: string;
  createTime: string;
  updateTime?: string;
  reply?: GoogleReviewReply;
  isVerified?: boolean;
}

export interface GoogleLocation {
  accountId: string;
  locationId: string;
  locationName: string;
  placeId: string;
  address: string;
  storeCode?: string;
}

export interface ReviewSummary {
  averageRating: number;
  totalReviews: number;
  ratingCounts: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
}

export interface GoogleBusinessConnection {
  status: GoogleConnectionStatus;
  accountId?: string;
  accountName?: string;
  selectedLocation?: GoogleLocation;
  availableLocations: GoogleLocation[];
  lastSyncedAt?: string;
  reviewSummary: ReviewSummary;
  directReviewUrl?: string;
}

export interface GoogleBusinessCardProps {
  googleReviewsLink: string;
  setGoogleReviewsLink: (url: string) => void;
  showReviews: boolean;
  setShowReviews: (show: boolean) => void;
  onToast: (msg: string) => void;
}
