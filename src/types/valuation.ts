export type ValuationTier = "emerging" | "established" | "flagship" | "haute";

export interface ValuationDriver {
  id: string;
  name: string;
  value: string;
  impact: "positive" | "neutral" | "high";
  detail: string;
}

export interface BusinessValuation {
  estimatedLow: number;
  estimatedHigh: number;
  midpoint: number;
  multiple: number;
  tier: ValuationTier;
  tierLabel: string;
  tierDescription: string;
  annualRunRate: number;
  annualNetProfit: number;
  profitMargin: number;
  activeCustomerCount: number;
  drivers: ValuationDriver[];
  growthLevers: string[];
  calculatedAt: string;
}

export interface ValuationCardProps {
  valuation: BusinessValuation | null;
  onRefresh?: () => void;
  onToast?: (msg: string) => void;
}
