import { CreditCard, Crown, Landmark, Receipt, Send, TrendingUp, Users } from "lucide-react";
import type { BillingPeriod, FeatureItem, PricingPlan } from "@/types";

export type { BillingPeriod, FeatureItem, PricingPlan };

export const LANDING_FEATURES: readonly FeatureItem[] = [
  {
    id: "feat-storefront",
    icon: Crown,
    badge: "Digital Storefront",
    title: "Interactive 3D Storefront & Card",
    description:
      "A bespoke public link featuring your physics-modeled 3D stationery card and instant WhatsApp inquiry capture.",
    highlights: [
      "Interactive 3D business card",
      "Custom brand identity & verified social links",
      "Direct WhatsApp order & consultation intake",
    ],
    iconBg: "#ecfdf5",
    iconColor: "#059669",
  },
  {
    id: "feat-leads",
    icon: Users,
    badge: "CRM Pipeline",
    title: "Lead Tracker & Customer CRM",
    description:
      "Capture consultation budgets and project timelines, then convert warm leads into paying clients in one click.",
    highlights: [
      "Automated inquiry intake form",
      "Budget & timeline tracking",
      "1-click lead-to-customer conversion",
    ],
    iconBg: "#e0f2fe",
    iconColor: "#0284c7",
  },
  {
    id: "feat-invoicing",
    icon: CreditCard,
    badge: "Invoicing",
    title: "Itemized Invoicing & Receipts",
    description:
      "Generate multi-currency invoices with deposit tracking, discount controls, and instant digital receipts.",
    highlights: [
      "Multi-currency support (NGN, USD, GBP, EUR)",
      "Itemized service scopes & discounts",
      "Real-time status tracking (Draft, Sent, Paid)",
    ],
    iconBg: "#fce7f3",
    iconColor: "#db2777",
  },
  {
    id: "feat-expenses",
    icon: Receipt,
    badge: "Bookkeeping",
    title: "Expense Tracking & Real Net Profit",
    description:
      "Log operational costs and supplier payments to calculate true take-home earnings instead of guessing.",
    highlights: [
      "Category breakdowns & supplier logging",
      "Net profit calculation vs. gross revenue",
      "1-click CSV bookkeeping export",
    ],
    iconBg: "#fef3c7",
    iconColor: "#d97706",
  },
  {
    id: "feat-valuation",
    icon: Landmark,
    badge: "Business Value",
    title: "Live Business Valuation Estimator",
    description:
      "Real-time enterprise appraisal benchmarks and SDE profit multiples calculated directly from logged cashflow.",
    highlights: [
      "Real-time equity valuation range",
      "SDE earnings multiple benchmark",
      "Automated profit margin analytics",
    ],
    iconBg: "#ffedd5",
    iconColor: "#ea580c",
  },
  {
    id: "feat-broadcast",
    icon: Send,
    badge: "Client Outreach",
    title: "1-Click Client Broadcasts",
    description:
      "Re-engage past clients with targeted WhatsApp announcements and discreet email drops without third-party lock-in.",
    highlights: [
      "WhatsApp & Email bulk broadcasting",
      "Automatic active client filtering",
      "Anti-spam character protection meters",
    ],
    iconBg: "#ede9fe",
    iconColor: "#7c3aed",
  },
  {
    id: "feat-analytics",
    icon: TrendingUp,
    badge: "Revenue Intelligence",
    title: "Sales & Revenue Analytics",
    description:
      "Track gross receipts, top-performing services, and outstanding balances in real time without spreadsheets.",
    highlights: [
      "Real-time gross revenue & metrics",
      "Top-performing service breakdown",
      "Paid vs. pending balance tracking",
    ],
    iconBg: "#f5f3ff",
    iconColor: "#6366f1",
  },
] as const;

export const LANDING_PRICING_PLANS: readonly PricingPlan[] = [
  {
    id: "plan-trial",
    name: "Free Trial",
    badge: "14-Day Trial",
    tagline: "Experience the complete digital shop suite with zero initial commitment.",
    isFreeTrial: true,
    accentColor: "#0f7b3d",
    buttonColor: "#1ed760",
    buttonTextColor: "#000000",
    monthlyPrice: 0,
    biannualPrice: 0,
    annualPrice: 0,
    features: [
      "14 days complimentary full access",
      "Up to 20 customers, leads & invoices",
      "Up to 3 showcase projects & 3 categories",
      "Interactive 3D digital storefront & card",
      "WhatsApp orders & CRM lead intake",
      "Cancel anytime",
    ],
    ctaLabel: "Start 14-Day Free Trial",
    termsNote: "Free for 14 days, then ₦1,600/month. Cancel anytime. Terms apply.",
  },
  {
    id: "plan-starter",
    name: "Starter",
    badge: "Starter",
    tagline: "For boutique online vendors, solo artisans, and growing creators.",
    accentColor: "#0b7285",
    buttonColor: "#76e5d2",
    buttonTextColor: "#000000",
    monthlyPrice: 1600,
    biannualPrice: 8000,
    annualPrice: 16000,
    features: [
      "Up to 20 customers, leads & invoices",
      "Up to 3 showcase projects & 3 categories",
      "Interactive 3D digital storefront & card",
      "WhatsApp orders & CRM lead intake",
      "Itemized multi-currency invoicing & receipts",
      "Cancel anytime",
    ],
    ctaLabel: "Choose Starter",
    termsNote: "Billed as selected. Cancel anytime. Terms apply.",
  },
  {
    id: "plan-unlimited",
    name: "Unlimited",
    badge: "Most Popular",
    socialProofBadge: "+500 vendors subscribed",
    isPopular: true,
    tagline: "For high-volume vendors, busy studios, and scaling brands.",
    accentColor: "#d9480f",
    buttonColor: "#ff8a65",
    buttonTextColor: "#000000",
    monthlyPrice: 2500,
    biannualPrice: 12500,
    annualPrice: 25000,
    features: [
      "Unlimited customers, leads & invoices",
      "Up to 10 showcase projects & 5 categories",
      "Multi-photo gallery lightboxes per project",
      "Unlimited WhatsApp & Email broadcasts",
      "Custom digital storefront & 3D card",
      "Sales, revenue & pipeline analytics",
      "Priority customer & studio support",
    ],
    ctaLabel: "Get Unlimited Access",
    termsNote: "Billed as selected. Cancel anytime. Terms apply.",
  },
] as const;

export const LANDING_FAQS = [
  {
    id: "faq-what-is",
    question: "What is Shopwus and who is it built for?",
    answer:
      "Shopwus (Shop With Us) is the premier operating system built for boutique online vendors, event planners, bespoke artisans, and creative studios. It combines a public 3D storefront with a CRM lead pipeline, multi-currency invoicing, expense bookkeeping, and live business valuation in one workspace.",
  },
  {
    id: "faq-limits",
    question: "How many showcase projects and categories can I feature?",
    answer:
      "On the Starter tier, you can feature up to 3 showcase projects and 3 custom categories. On the Unlimited tier, you can showcase up to 10 rich projects with multi-photo gallery lightboxes and up to 5 custom categories.",
  },
  {
    id: "faq-3d-card",
    question: "How does the interactive 3D stationery card work?",
    answer:
      "Every studio gets a bespoke public link (e.g., shopwus.com/your-brand) with an interactive physics-driven 3D card displaying your business logo, verified social channels, service menu, and contact details. Clients can flip the card and submit instant consultation inquiries directly into your CRM.",
  },
  {
    id: "faq-valuation",
    question: "How is the Business Valuation calculated?",
    answer:
      "The Business Valuation Estimator uses the industry-standard Seller's Discretionary Earnings (SDE) Multiple Method. It analyzes your annual profit run-rate, net assets, and customer repeat retention to provide a confidential appraisal range and growth recommendations.",
  },
  {
    id: "faq-privacy",
    question: "Is my financial, expense, and client data private?",
    answer:
      "Yes, absolutely. All your financial ledgers, revenue numbers, operating expenses, customer records, and valuation models are encrypted and strictly private to your verified account. We do not sell or share your proprietary business data with third parties or competitors.",
  },
  {
    id: "faq-broadcast",
    question: "How does WhatsApp Broadcast and outreach work?",
    answer:
      "You can filter your active client list and dispatch 1-click bulk broadcast announcements or customized follow-ups directly via WhatsApp and discreet Email BCC. The system enforces anti-spam character limits and supports image attachments without third-party API lock-in.",
  },
  {
    id: "faq-export",
    question: "Can I export my invoices, leads, and bookkeeping records?",
    answer:
      "Yes. You can export your leads, customer contacts, and expense ledgers into structured CSV spreadsheets at any time with a single click for your accountant or tax bookkeeping.",
  },
  {
    id: "faq-trial",
    question: "Is there a free trial?",
    answer:
      "Yes, we offer a 14-day complimentary trial with complete access to all studio tools, 3D cards, invoicing, and expense bookkeeping with zero initial commitment. You can upgrade or cancel at any time.",
  },
] as const;
