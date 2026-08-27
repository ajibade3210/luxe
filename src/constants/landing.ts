import { CreditCard, Crown, Send, type Sparkles, Star, TrendingUp, Users } from "lucide-react";

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
    id: "feat-broadcast",
    icon: Send,
    badge: "Client Outreach",
    title: "Broadcast Messaging & Easy Follow-Up",
    description:
      "Send announcements, updates, and promotions directly to active clients via WhatsApp or Email in bulk, and follow up in one click.",
    highlights: [
      "WhatsApp & Email bulk broadcasting",
      "Automatic active customer filtering",
      "1-click direct chat follow-ups",
    ],
  },
  {
    id: "feat-leads",
    icon: Users,
    badge: "Leads",
    title: "Lead Tracking & Pipeline",
    description:
      "Capture consultation inquiries with event dates and budgets, then convert qualified leads into paying clients instantly.",
    highlights: [
      "Automated inquiry intake form",
      "Budget size & event date tracking",
      "1-click lead to customer conversion",
    ],
  },
  {
    id: "feat-invoicing",
    icon: CreditCard,
    badge: "Invoicing",
    title: "Instant Invoice Generation",
    description:
      "Create professional, itemized invoices in seconds with multi-currency support (NGN, USD, GBP, EUR), discounts, tax, and PDF exports.",
    highlights: [
      "Multi-currency support (NGN, USD, GBP, EUR)",
      "Itemized services & discount controls",
      "Live status tracking (Draft, Sent, Paid)",
    ],
  },
  {
    id: "feat-sales",
    icon: TrendingUp,
    badge: "Sales Tracking",
    title: "Sales & Revenue Analytics",
    description:
      "Get clear visibility into total earnings, average project values, and top-booked services without messy spreadsheets.",
    highlights: [
      "Real-time gross sales & earnings metrics",
      "Top-performing service breakdown",
      "Paid vs unpaid revenue tracking",
    ],
  },
  {
    id: "feat-reviews",
    icon: Star,
    badge: "Google Reviews",
    title: "Google Review Prompts & Socials",
    description:
      "Collect 5-star Google reviews effortlessly with 1-click review prompts and display verified social media channels.",
    highlights: [
      "1-click Google review request prompt",
      "Verified social channel links",
      "Client review showcase",
    ],
  },
  {
    id: "feat-profile",
    icon: Crown,
    badge: "Studio Storefront",
    title: "Custom 3D Digital Studio Profile",
    description:
      "A personalized public link featuring your brand colors, 3D stationery card, curated services, portfolio, and auto-quote popup.",
    highlights: [
      "Interactive 3D business card",
      "Custom theme & color palettes",
      "1-minute auto quote inquiry popup",
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
