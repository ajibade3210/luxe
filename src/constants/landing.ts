import {
  CreditCard,
  Crown,
  FileSpreadsheet,
  Layers,
  Smartphone,
  type Sparkles,
  Users,
} from "lucide-react";

export interface FeatureItem {
  id: string;
  icon: typeof Sparkles;
  badge: string;
  title: string;
  description: string;
  highlights: string[];
}

export const LANDING_FEATURES: readonly FeatureItem[] = [
  {
    id: "feat-flagship",
    icon: Crown,
    badge: "Digital Atelier",
    title: "Bespoke Digital Flagship & 3D Stationery Cards",
    description:
      "Showcase your studio with a considered digital home. Features an interactive 3D stationery card, verified social badges, and curated portfolio galleries.",
    highlights: [
      "Pure CSS 3D stationery card flipping",
      "Dynamic verified social channels sync",
      "Custom palette & typography controls",
    ],
  },
  {
    id: "feat-crm",
    icon: Users,
    badge: "Client Relations",
    title: "High-Ticket CRM & Lead Orchestration",
    description:
      "Capture and qualify VIP inquiries seamlessly. Track budgets, event dates, and multi-service scopes with one-click conversion into active client retainers.",
    highlights: [
      "Discreet inquiry intake & qualification",
      "Multi-service scope bundling",
      "Seamless lead-to-customer conversion",
    ],
  },
  {
    id: "feat-invoicing",
    icon: CreditCard,
    badge: "Financial Engine",
    title: "Executive Invoicing & Multi-Currency Billing",
    description:
      "Generate itemized, print-ready luxury invoices. Support for NGN, USD, GBP, and EUR with automated tax, discounts, and payment lifecycle tracking.",
    highlights: [
      "Multi-currency support (NGN, USD, GBP, EUR)",
      "Itemized service lines & retainer schedules",
      "Instant status tracking (Draft, Sent, Paid)",
    ],
  },
  {
    id: "feat-companion",
    icon: Smartphone,
    badge: "On-Site Production",
    title: "Live Run-of-Show & Mobile Companion",
    description:
      "Keep your production team synchronized on event day. Real-time show-calling, timeline cueing, and instantaneous approvals right from iPhone and iPad.",
    highlights: [
      "Instant QR-code device pairing",
      "Real-time schedule cueing & show-calls",
      "Live multi-user status synchronization",
    ],
  },
  {
    id: "feat-portal",
    icon: Layers,
    badge: "Client Experience",
    title: "Discreet VIP Client Portals",
    description:
      "Give high-net-worth clients a private digital portal to review service deliverables, approve moodboards, and track milestone progression.",
    highlights: [
      "Dedicated client consultation dashboards",
      "Transparent milestone progression",
      "Discreet, white-glove communication flow",
    ],
  },
  {
    id: "feat-analytics",
    icon: FileSpreadsheet,
    badge: "Studio Intelligence",
    title: "Studio Revenue & Portfolio Analytics",
    description:
      "Gain deep clarity into atelier performance. Track gross event volume, average booking values, and category revenue distribution at a glance.",
    highlights: [
      "Real-time gross revenue tracking",
      "Service category performance metrics",
      "Exportable ledgers for audit compliance",
    ],
  },
] as const;

export type BillingPeriod = "monthly" | "annual";

export interface PricingPlan {
  id: string;
  name: string;
  tagline: string;
  badge?: string;
  isPopular?: boolean;
  monthlyPrice: number;
  annualPrice: number;
  features: string[];
  ctaLabel: string;
}

export const LANDING_PRICING_PLANS: readonly PricingPlan[] = [
  {
    id: "plan-atelier",
    name: "Studio Atelier",
    tagline:
      "For independent luxury planners, floral designers, and bespoke private scenographers.",
    monthlyPrice: 49,
    annualPrice: 39,
    features: [
      "1 Digital Atelier Flagship",
      "Interactive 3D Stationery Card",
      "Up to 25 Active Client Scopes",
      "VIP Lead & Inquiry CRM",
      "Multi-Currency Invoicing (NGN/USD/GBP/EUR)",
      "Standard Client Milestone Portals",
    ],
    ctaLabel: "Begin Studio Trial",
  },
  {
    id: "plan-maison",
    name: "Maison Flagship",
    tagline: "For established luxury wedding studios, destination planners, and gala architects.",
    badge: "Most Popular",
    isPopular: true,
    monthlyPrice: 129,
    annualPrice: 99,
    features: [
      "Everything in Studio Atelier",
      "Unlimited Active Client Retainers",
      "Custom Studio Slug & Branding",
      "Live Run-of-Show & Mobile Companion",
      "Multi-Service Invoice Bundling & Tax Engine",
      "Verified Brand Social Channel Sync",
      "Priority Concierge Support",
    ],
    ctaLabel: "Enter Maison Flagship",
  },
  {
    id: "plan-haute",
    name: "Haute Production",
    tagline: "For multi-market event production houses, luxury agencies, and gala orchestrators.",
    monthlyPrice: 299,
    annualPrice: 239,
    features: [
      "Everything in Maison Flagship",
      "Multi-Market Studio Flagships",
      "Unlimited Team Members & Role Permissions",
      "Real-Time Multi-Device Show-Calling",
      "Dedicated VIP Concierge Manager",
      "Custom Legal Contract Frameworks",
      "Direct API & Webhook Integrations",
    ],
    ctaLabel: "Contact Haute Concierge",
  },
] as const;
