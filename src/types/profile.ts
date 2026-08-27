import type { ButtonRadiusType, CurrencyCode } from "./common";

// Business and studio profile types
export type SocialChannelType =
  | "instagram"
  | "facebook"
  | "tiktok"
  | "linkedin"
  | "x"
  | "youtube"
  | "whatsapp"
  | "threads"
  | "pinterest"
  | "website";

export interface SocialChannel {
  id: string;
  type: SocialChannelType;
  connected: boolean;
  label: string;
  handle: string;
  url: string;
  lastSynced?: string;
  description?: string;
}

export interface ReviewItem {
  id: string;
  author: string;
  role?: string;
  eventType: string;
  rating: number;
  comment: string;
  date: string;
  avatar?: string;
}

export interface PortfolioProject {
  id: string;
  title: string;
  category: string;
  location: string;
  description: string;
  image: string;
  order?: number;
  isCover?: boolean;
  gallery?: string[];
  stats?: string;
}

export interface ColorScheme {
  primary: string;
  secondary: string;
  button: string;
  pageBackground?: string;
  cardBackground?: string;
  text: string;
}

export interface ServiceItem {
  id: string;
  name: string;
  category: string;
  description: string;
}

export interface BusinessProfile {
  id: string;
  businessId?: string;
  businessName: string;
  slug: string;
  tagline: string;
  description: string;
  location: string;
  website: string;
  email: string;
  phone: string;
  logoUrl?: string;
  googleReviewsLink?: string;
  services: ServiceItem[];
  socialChannels: SocialChannel[];
  reviews: ReviewItem[];
  portfolio: PortfolioProject[];
  operatingHours: string;
  timeFrom: string;
  timeTo: string;
  byAppointmentOnly: boolean;
  whatsAppNumber: string;
  emailAddress: string;
  physicalAddress: string;
  colors: ColorScheme;
  buttonRadius: ButtonRadiusType;
  currency?: CurrencyCode;
  updatedAt: string;
}
