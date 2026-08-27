// Lead and inquiry types
export type LeadStatus = "new" | "contacted" | "qualified" | "converted" | "closed";

export interface Lead {
  id: string;
  businessId?: string;
  name: string;
  email: string;
  phone?: string;
  service: string;
  services?: string[];
  eventDate: string;
  budget?: number;
  message: string;
  status: LeadStatus;
  createdAt: string;
}

// Customer and service types
export type ServiceStatus = "active" | "completed" | "pending" | "cancelled";

export interface CustomerService {
  id: string;
  businessId?: string;
  customerId: string;
  name: string;
  service: string;
  amount: number;
  status: ServiceStatus;
  createdAt: string;
  completedAt?: string;
}

export interface Activity {
  id: string;
  businessId?: string;
  customerId: string;
  type: "contact" | "update" | "note" | "service";
  description: string;
  timestamp: string;
}

export interface Customer {
  id: string;
  businessId?: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  services: CustomerService[];
  totalRevenue: number;
  notes?: string;
  isActive: boolean;
  createdAt: string;
}

// Currency types
export type CurrencyCode = "NGN" | "USD" | "GBP" | "EUR";

// Invoice types
export type InvoiceStatus = "draft" | "sent" | "paid" | "cancelled";
export type PaymentTerms = "Due on receipt" | "Net 14" | "Net 30" | "Net 60";

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  amount: number;
}

export interface Invoice {
  id: string;
  businessId?: string;
  invoiceNumber: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  billingAddress: string;
  issueDate: string;
  dueDate: string;
  paymentTerms: PaymentTerms;
  currency?: CurrencyCode;
  items: InvoiceItem[];
  subtotal: number;
  discount: number;
  taxRate: number;
  taxAmount: number;
  total: number;
  notes: string;
  status: InvoiceStatus;
  sentAt?: string;
  createdAt: string;
  updatedAt: string;
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
  cardBackground?: string;
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

// Broadcast types
export type BroadcastChannel = "whatsapp" | "email" | "both";

export interface BroadcastPayload {
  channel: BroadcastChannel;
  customerIds: string[];
  message: string;
  subject?: string;
  imageUrl?: string;
}

export interface BroadcastResult {
  broadcastId: string;
  channel: BroadcastChannel;
  totalRecipients: number;
  whatsAppRecipients: number;
  emailRecipients: number;
  deliveredCount: number;
  timestamp: string;
}
