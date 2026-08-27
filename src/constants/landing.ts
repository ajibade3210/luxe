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
    title: "Broadcast Messages & Quick Follow-Up",
    description:
      "Send bulk announcements and offers directly via WhatsApp or Email, and follow up in one click.",
    highlights: [
      "Bulk WhatsApp & Email broadcasting",
      "Automatic active client filtering",
      "1-click direct chat follow-ups",
    ],
  },
  {
    id: "feat-leads",
    icon: Users,
    badge: "CRM & Leads",
    title: "Lead Tracker & Sales Pipeline",
    description:
      "Capture customer inquiries and budgets, then convert warm leads into paying clients in seconds.",
    highlights: [
      "Automated inquiry intake form",
      "Budget & timeline tracking",
      "1-click lead-to-customer conversion",
    ],
  },
  {
    id: "feat-invoicing",
    icon: CreditCard,
    badge: "Invoicing",
    title: "Instant Professional Invoices",
    description:
      "Create clean, itemized invoices with multi-currency support, custom discounts, and instant PDF receipts.",
    highlights: [
      "Multi-currency support (NGN, USD, GBP, EUR)",
      "Itemized services & discount controls",
      "Live payment tracking (Draft, Sent, Paid)",
    ],
  },
  {
    id: "feat-sales",
    icon: TrendingUp,
    badge: "Sales Tracking",
    title: "Sales & Revenue Analytics",
    description:
      "Track your earnings, top-selling services, and outstanding balances in real time without spreadsheets.",
    highlights: [
      "Real-time gross revenue & metrics",
      "Top-performing service breakdown",
      "Paid vs. pending balance tracking",
    ],
  },
  {
    id: "feat-reviews",
    icon: Star,
    badge: "Social Proof",
    title: "5-Star Reviews & Verified Socials",
    description:
      "Build instant trust with 1-click Google review request prompts and verified social media badges.",
    highlights: [
      "1-click Google review request prompts",
      "Verified social media badges",
      "Client testimonial showcase",
    ],
  },
  {
    id: "feat-profile",
    icon: Crown,
    badge: "Mini Storefront",
    title: "Mini Storefront & 3D Business Card",
    description:
      "A branded public storefront featuring your custom theme, interactive 3D business card, and instant quotes.",
    highlights: [
      "Interactive 3D business card",
      "Custom brand themes & colors",
      "Instant quote & inquiry intake",
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
