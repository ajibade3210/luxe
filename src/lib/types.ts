// Lead and inquiry types
export type LeadStatus = "new" | "contacted" | "qualified" | "converted" | "closed";

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone?: string;
  service: string;
  eventDate: string;
  budget?: number;
  message: string;
  status: LeadStatus;
  createdAt: string;
}

// Customer and project types
export type ProjectStatus = "active" | "completed" | "pending" | "cancelled";

export interface Project {
  id: string;
  customerId: string;
  name: string;
  service: string;
  amount: number;
  status: ProjectStatus;
  createdAt: string;
  completedAt?: string;
}

export interface Activity {
  id: string;
  customerId: string;
  type: "contact" | "update" | "note" | "project";
  description: string;
  timestamp: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  projects: Project[];
  totalRevenue: number;
  notes?: string;
  createdAt: string;
}

// Business profile types
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
  text: string;
}

export type ButtonRadiusType = "Square" | "Subtle" | "Rounded" | "Pill";

export interface ServiceItem {
  id: string;
  name: string;
  category: string;
  description: string;
}

export interface BusinessProfile {
  id: string;
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
  updatedAt: string;
}

// User types
export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  avatar?: string;
  role: "admin" | "user";
}

// Auth types
export interface AuthSession {
  user: User;
  expiresAt: string;
}

// Organization preview definition for landing hero rotation
export interface OrganizationPreview {
  id: string;
  name: string;
  slug: string;
  eyebrow: string;
  tagline: string;
  logoUrl: string;
  badge: string;
}
