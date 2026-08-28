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
