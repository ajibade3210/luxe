import type { ExpenseCategorySummary } from "./expense";
import type { BusinessValuation } from "./valuation";

// Analytics telemetry and overview types
export type Timeframe = "daily" | "monthly" | "yearly";

export interface MetricSummary {
  value: string;
  rawNumber: number;
  change: string;
  isPositive: boolean;
  progressPercent: number;
}

export interface ChartData {
  peakValue: string;
  peakCoord: { cx: number; cy: number };
  linePath: string;
  areaPath: string;
  xLabels: string[];
  yLabels: string[];
}

export interface TrendingServiceItem {
  name: string;
  category: string;
  price: number;
  volume: number;
  image: string;
}

export interface AnalyticsOverview {
  timeframe: Timeframe;
  timeframeLabel: string;
  views: MetricSummary;
  leads: MetricSummary;
  revenue: MetricSummary;
  expenses?: MetricSummary;
  netProfit?: MetricSummary;
  expenseCategoryBreakdown?: ExpenseCategorySummary[];
  valuation?: BusinessValuation;
  chart: ChartData;
  trendingServices: TrendingServiceItem[];
}

export interface AnalyticsStatCardsProps {
  data: AnalyticsOverview;
}

export interface AnalyticsChartProps {
  data: AnalyticsOverview;
  onSeeAll?: () => void;
}

export interface AnalyticsExpensesBreakdownProps {
  data: AnalyticsOverview;
}

export interface AnalyticsPublicUrlBarProps {
  slug: string;
  onNotify?: (message: string) => void;
}
