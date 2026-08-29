import type { ValuationTier } from "@/types";

export const VALUATION_TIER_CONFIG: Record<
  ValuationTier,
  {
    label: string;
    description: string;
    minMultiple: number;
    maxMultiple: number;
    badgeColor: string;
    bg: string;
  }
> = {
  emerging: {
    label: "Emerging Boutique",
    description:
      "Active early stage with healthy initial customer acquisition and lean operating expenses.",
    minMultiple: 1.8,
    maxMultiple: 2.4,
    badgeColor: "#0284c7",
    bg: "#e0f2fe",
  },
  established: {
    label: "Established Studio",
    description:
      "Consistent monthly cashflow, steady repeat clients, and proven profit margins above 45%.",
    minMultiple: 2.5,
    maxMultiple: 3.2,
    badgeColor: "#16a34a",
    bg: "#dcfce7",
  },
  flagship: {
    label: "Flagship Brand",
    description:
      "Strong brand equity, high customer lifetime value, multi-channel sales, and excellent margins.",
    minMultiple: 3.3,
    maxMultiple: 4.2,
    badgeColor: "#9333ea",
    bg: "#f3e8ff",
  },
  haute: {
    label: "Haute Enterprise",
    description:
      "Premier tier enterprise with superior customer retention, high average order value, and scaled ARR.",
    minMultiple: 4.3,
    maxMultiple: 5.5,
    badgeColor: "#d97706",
    bg: "#fef3c7",
  },
};

export const VALUATION_GROWTH_LEVERS = [
  "Logging recurring customer retainers adds an estimated 2.8x multiple to your valuation.",
  "Maintaining gross profit margins above 50% moves your studio into the Flagship Brand tier.",
  "Converting incoming leads within 24 hours increases customer lifetime equity by up to 18%.",
  "Recording all operational expenses gives you an audit-ready P&L statement for grant and loan applications.",
] as const;

export const VALUATION_DISCLAIMER_NOTE =
  "Informational estimate only. This valuation is an automated analytical benchmark calculated from logged cashflow, expenses, and industry SDE multiples. It does not constitute a certified appraisal or formal financial audit.";

export const SDE_TOOLTIP_TEXT =
  "SDE (Seller's Discretionary Earnings) multiple is the industry standard benchmark used to value boutique studios based on owner net take-home earnings.";

export const VALUATION_EMPTY_STATE = {
  eyebrow: "Valuation Benchmark",
  title: "Unlock Live Studio Valuation",
  description:
    "Log your first paid invoices and operating expenses to calculate an automated real-time valuation model.",
  actionLabel: "View Invoices & Bookkeeping",
} as const;

export const INDUSTRY_SECTORS = {
  retail_ecommerce: {
    label: "Retail & E-Commerce",
    baseMultiple: 3.5,
    description: "Direct-to-consumer physical products, fashion, and retail inventory.",
  },
  luxury_services: {
    label: "Luxury Atelier & Bespoke Services",
    baseMultiple: 4.8,
    description: "High-ticket custom couture, bespoke events, bridal, and fine artisan services.",
  },
  agency_consulting: {
    label: "Agency & Creative Consulting",
    baseMultiple: 3.8,
    description: "Design studios, marketing firms, retainer models, and professional services.",
  },
  events_hospitality: {
    label: "Events & Hospitality Production",
    baseMultiple: 3.6,
    description: "Experiential production, luxury catering, decor, and event planning.",
  },
  digital_tech: {
    label: "Digital Products & Software",
    baseMultiple: 5.2,
    description: "Digital downloads, SaaS platforms, memberships, and content libraries.",
  },
  general_business: {
    label: "General SME & Commercial Trading",
    baseMultiple: 3.2,
    description: "Standard local merchant services, distribution, and commercial trade.",
  },
} as const;

export const DEFAULT_PUBLIC_VALUATION_INPUTS = {
  currency: "GBP" as const,
  industry: "luxury_services" as const,
  annualRevenue: 50000,
  annualExpenses: 40000,
  netAssets: 15000,
  customerRetentionRate: 50,
};

export const VALUATION_HOW_CALCULATED_SECTIONS = [
  {
    title: "1. SDE / EBITDA Earnings Multiple Method",
    description:
      "For small-to-medium businesses and boutique studios, the most widely accepted valuation framework is the Seller's Discretionary Earnings (SDE) multiple. This metric evaluates the true cashflow available to an owner after operating expenses, multiplied by an industry factor reflecting risk, market position, and growth trajectory.",
    badge: "Primary Metric",
  },
  {
    title: "2. Net Tangible Asset Valuation",
    description:
      "Tangible balance sheet assets — including production equipment, studio inventory, cash receivables, and proprietary tooling minus all outstanding liabilities — are added directly to the earnings baseline to form a complete enterprise asset valuation.",
    badge: "Balance Sheet",
  },
  {
    title: "3. Customer Equity & Retention Multiplier",
    description:
      "A business with an organized, recurring customer database and automated re-engagement channels commands a 20% to 50% premium multiple over an informal vendor relying purely on one-off serendipitous discovery.",
    badge: "Valuation Premium",
  },
] as const;

export const VALUATION_PURPOSE_GUIDES = [
  {
    id: "selling",
    title: "Valuing a Business For Selling",
    eyebrow: "Exit & Handover",
    summary:
      "Position your studio to command top market multiples and execute a smooth ownership transfer.",
    points: [
      "Prove recurring revenue and repeat client retention to eliminate buyer risk.",
      "Package clean, itemized customer CRM data and pipeline records that can be transferred instantly on Day 1.",
      "Demonstrate predictable profit margins with audit-ready bookkeeping and invoice histories.",
      "Show that the brand runs on established operational systems rather than chaotic personal DMs.",
    ],
  },
  {
    id: "buying",
    title: "Valuing a Business For Buying",
    eyebrow: "Acquisition Due Diligence",
    summary:
      "Assess fair market asking price, operational transferability, and hidden liabilities before making an offer.",
    points: [
      "Audit net tangible assets vs. unrecorded supplier liabilities and outstanding invoices.",
      "Verify historical customer retention rates to ensure revenue won't evaporate after founder departure.",
      "Examine cashflow consistency across low and high seasons over a 12 to 36 month lookback.",
      "Evaluate digital asset portability: custom domains, verified social badges, and client portals.",
    ],
  },
  {
    id: "investing",
    title: "Valuing a Business For Investing",
    eyebrow: "Capital & Growth",
    summary:
      "Evaluate scalability, unit economics, gross margins, and customer lifetime value (LTV).",
    points: [
      "Analyze gross margin trends and operational expense leverage at higher revenue scales.",
      "Assess the potential to expand average order value (AOV) via broadcast outreach and new service tiers.",
      "Verify that foundational financial ledgers and tax records are strictly compartmentalized.",
      "Estimate future exit valuation based on projected ARR and enterprise multiple expansion.",
    ],
  },
] as const;

export const VALUATION_SHOPWUS_BENEFITS = [
  {
    iconName: "Users",
    title: "1. Turn Informal DMs into Transferable Customer Equity",
    description:
      "When selling or appraising a business, buyers pay top dollar for organized, transferable customer databases. Shopwus replaces messy phone chat logs with a structured CRM that records client purchase histories, consultation budgets, and contact profiles — making your client database an institutional balance sheet asset.",
  },
  {
    iconName: "Send",
    title: "2. Boost Repeat Retention with Broadcast Outreach",
    description:
      "Repeat customers are the highest-margin revenue stream in any business. With Shopwus 1-click WhatsApp and email broadcasting, you re-engage past clients with seasonal announcements and exclusive drops, raising your customer lifetime value (LTV) and expanding your SDE valuation multiple.",
  },
  {
    iconName: "CreditCard",
    title: "3. Audit-Ready Bookkeeping & Live Financial Telemetry",
    description:
      "Nothing kills a business valuation faster than unorganized financial records. Shopwus gives you professional multi-currency invoicing, receipt tracking, categorized expense ledgers, and real-time Net Profit analytics, ensuring your books are continuously audit-ready for buyers, lenders, or investors.",
  },
  {
    iconName: "Crown",
    title: "4. Premium Brand Positioning & Interactive 3D Cards",
    description:
      "Businesses with bespoke, high-trust digital storefronts command higher pricing power and better gross margins. Your interactive 3D stationery card and verified social links establish immediate luxury authority that directly elevates your company's perceived market worth.",
  },
] as const;
