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
  chart: ChartData;
  trendingServices: TrendingServiceItem[];
}
