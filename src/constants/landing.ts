import { CreditCard, Crown, Landmark, Receipt, Send, TrendingUp, Users } from "lucide-react";
import type { BillingPeriod, FeatureItem, PricingPlan } from "@/types";

export type { BillingPeriod, FeatureItem, PricingPlan };

export const LANDING_FEATURES: readonly FeatureItem[] = [
  {
    id: "feat-storefront",
    icon: Crown,
    badge: "Digital Atelier",
    title: "Digital Storefront & 3D Card",
    description:
      "A branded public studio link with an interactive 3D stationery card and instant WhatsApp intake.",
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
    title: "Lead Tracker & CRM Pipeline",
    description:
      "Capture consultation inquiries, budgets, and timelines, then convert warm leads into paying clients in one click.",
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
    badge: "Executive Invoicing",
    title: "Invoicing & Instant Receipts",
    description:
      "Generate itemized multi-currency invoices with discount controls, balance tracking, and instant receipts.",
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
    title: "Expense Bookkeeping & Net Profit",
    description:
      "Log operational outflows and supplier payments to calculate real Net Profit instead of relying on gross sales.",
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
    badge: "Studio Worth",
    title: "Business Valuation Estimator",
    description:
      "Automated appraisal snapshots and SDE market multiple benchmarks calculated directly from logged cashflow.",
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
    title: "Broadcast Messaging & Outreach",
    description:
      "Dispatch targeted WhatsApp announcements and discreet email updates exclusively to active clients.",
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
      "Interactive 3D business card",
      "WhatsApp orders & customer tracker",
      "Cancel anytime",
    ],
    ctaLabel: "Start 14-Day Free Trial",
    termsNote: "Free for 14 days, then ₦1,600/month. Cancel anytime. Terms apply.",
  },
  {
    id: "plan-starter",
    name: "Starter",
    badge: "Starter",
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
    ctaLabel: "Choose Starter",
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
    ctaLabel: "Get Unlimited Access",
    termsNote: "Billed as selected. Cancel anytime. Terms apply.",
  },
] as const;

export const LANDING_FAQS = [
  {
    id: "faq-what-is",
    question: "What is Shopwus and who is it built for?",
    answer:
      "Shopwus (Shop With Us) is the premier studio operating system built for boutique online vendors, event planners, bespoke artisans, and creative directors. It combines a public digital storefront with an interactive 3D stationery card, CRM lead pipeline, executive multi-currency invoicing, expense bookkeeping, and business valuation modeling in one cohesive workspace.",
  },
  {
    id: "faq-3d-card",
    question: "How does the interactive 3D stationery card work?",
    answer:
      "Every studio gets a bespoke public link (e.g., shopwus.com/your-brand) with an interactive physics-driven 3D card that showcases your business logo, verified social channels, service menu, and contact details. Clients can flip the card and submit instant consultation inquiries directly into your studio CRM.",
  },
  {
    id: "faq-valuation",
    question: "How is the Business Valuation calculated?",
    answer:
      "The Business Valuation Estimator uses the industry-standard Seller's Discretionary Earnings (SDE) Multiple Method. It analyzes your annualized revenue run-rate (ARR), net profit margins after logged operating expenses, and active retained client base to provide a confidential appraisal range and strategic growth recommendations.",
  },
  {
    id: "faq-privacy",
    question: "Is my studio financial, expense, and client data private?",
    answer:
      "Yes, absolutely. All your financial ledgers, revenue numbers, operating expenses, customer records, and valuation models are encrypted and strictly private to your verified director account. We do not sell or share your proprietary business data with third parties or competitors, in full compliance with the Nigeria Data Protection Act (NDPA).",
  },
  {
    id: "faq-broadcast",
    question: "How does WhatsApp Broadcast and outreach work?",
    answer:
      "You can filter your active client list and dispatch 1-click bulk broadcast announcements or customized follow-ups directly via WhatsApp and discreet Email BCC. The system enforces anti-spam character limits and supports image attachment previews without third-party API lock-in.",
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
