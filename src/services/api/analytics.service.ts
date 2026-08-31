import { apiClient } from "@/lib/api-client";
import type { AnalyticsOverview, Timeframe } from "@/types";

/**
 * Fetch Studio Overview & Telemetry Analytics
 */
export async function getAnalytics(timeframe: Timeframe = "monthly"): Promise<AnalyticsOverview> {
  return apiClient.get<AnalyticsOverview>("/analytics/overview", {
    timeframe,
  });
}

/**
 * Fetch 6-month historical revenue vs expense time series
 */
export async function getRevenueTimeSeries() {
  return apiClient.get<{
    months: string[];
    revenue: number[];
    expenses: number[];
    netProfit: number[];
  }>("/analytics/revenue");
}

/**
 * Fetch lead conversion pipeline funnel
 */
export async function getFunnelMetrics() {
  return apiClient.get<{
    views: number;
    inquiries: number;
    activeClients: number;
    completedProjects: number;
    conversionRate: string;
    leadToClientRate: string;
  }>("/analytics/funnel");
}

/**
 * Fetch service packages performance rankings
 */
export async function getServicesPerformance() {
  return apiClient.get<
    Array<{
      name: string;
      category: string;
      price: number;
      volume: number;
      revenue: number;
    }>
  >("/analytics/services-performance");
}
