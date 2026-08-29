import type { CurrencyCode } from "./common";

export type ValuationTier = "emerging" | "established" | "flagship" | "haute";

export type IndustrySector =
  | "retail_ecommerce"
  | "luxury_services"
  | "agency_consulting"
  | "events_hospitality"
  | "digital_tech"
  | "general_business";

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

export interface PublicValuationInputs {
  currency: CurrencyCode;
  industry: IndustrySector;
  annualRevenue: number;
  annualExpenses: number;
  netAssets: number;
  customerRetentionRate: number;
}

export interface PublicValuationResult {
  currency: CurrencyCode;
  annualRevenue: number;
  annualExpenses: number;
  averageNetProfit: number;
  netAssets: number;
  multiple: number;
  approximateValue: number;
  valuationRangeLow: number;
  valuationRangeHigh: number;
  tier: ValuationTier;
  tierLabel: string;
  tierDescription: string;
  profitMargin: number;
  calculatedAt: string;
  drivers: ValuationDriver[];
  growthOpportunities: string[];
}

export interface ValuationInputFormProps {
  values: PublicValuationInputs;
  onChange: <K extends keyof PublicValuationInputs>(
    field: K,
    value: PublicValuationInputs[K]
  ) => void;
  onCalculate?: () => void;
  isCalculating?: boolean;
}

export interface ValuationResultsDisplayProps {
  result: PublicValuationResult;
  onRecalculate?: () => void;
}
