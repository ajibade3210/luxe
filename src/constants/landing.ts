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

export type BillingPeriod = "monthly" | "biannual" | "annual";

export interface PricingPlan {
  id: string;
  name: string;
  tagline: string;
  badge?: string;
  isPopular?: boolean;
  isFreeTrial?: boolean;
  accentColor: string;
  buttonColor: string;
  buttonTextColor: string;
  monthlyPrice: number;
  biannualPrice: number;
  annualPrice: number;
  features: string[];
  ctaLabel: string;
  termsNote: string;
}

export const LANDING_PRICING_PLANS: readonly PricingPlan[] = [
  {
    id: "plan-trial",
    name: "Free Trial",
    badge: "3 Months Free",
    tagline: "Experience the complete digital shop suite with zero initial commitment.",
    isFreeTrial: true,
    accentColor: "#0f7b3d",
    buttonColor: "#1ed760",
    buttonTextColor: "#000000",
    monthlyPrice: 0,
    biannualPrice: 0,
    annualPrice: 0,
    features: [
      "3 months complimentary access",
      "Up to 20 customers, leads & invoices",
      "Interactive 3D business card",
      "WhatsApp orders & customer tracker",
      "Cancel anytime",
    ],
    ctaLabel: "Start 3 Months Free",
    termsNote: "Free for 3 months, then ₦1,600/month. Cancel anytime. Terms apply.",
  },
  {
    id: "plan-starter",
    name: "Starter",
    badge: "Essential",
    tagline: "For boutique online vendors and creators with focused customer scopes.",
    accentColor: "#0b7285",
    buttonColor: "#76e5d2",
    buttonTextColor: "#000000",
    monthlyPrice: 1600,
    biannualPrice: 8000,
    annualPrice: 16000,
    features: [
      "Capped at 20 customers, leads & invoices",
      "Interactive 3D digital storefront & card",
      "WhatsApp orders & CRM lead intake",
      "Itemized multi-currency invoicing & receipts",
      "Cancel anytime",
    ],
    ctaLabel: "Get Starter",
    termsNote: "Billed as selected. Cancel anytime. Terms apply.",
  },
  {
    id: "plan-unlimited",
    name: "Unlimited",
    badge: "Most Popular",
    isPopular: true,
    tagline: "For active online vendors, studios, and high-volume multi-client brands.",
    accentColor: "#d9480f",
    buttonColor: "#ff8a65",
    buttonTextColor: "#000000",
    monthlyPrice: 2500,
    biannualPrice: 12500,
    annualPrice: 25000,
    features: [
      "Unlimited customers, leads & invoices",
      "Unlimited WhatsApp & Email broadcasts",
      "Custom digital storefront & 3D card",
      "Sales, revenue & pipeline analytics",
      "Priority customer & studio support",
    ],
    ctaLabel: "Get Unlimited",
    termsNote: "Billed as selected. Cancel anytime. Terms apply.",
  },
] as const;
