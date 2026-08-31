"use client";

import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import {
  getAnalytics,
  getFunnelMetrics,
  getRevenueTimeSeries,
  getServicesPerformance,
} from "@/services/api/analytics.service";
import type { Timeframe } from "@/types";

export function useAnalyticsOverviewQuery(timeframe: Timeframe = "monthly") {
  return useQuery({
    queryKey: queryKeys.analytics.overview(timeframe),
    queryFn: () => getAnalytics(timeframe),
  });
}

export function useRevenueTimeSeriesQuery() {
  return useQuery({
    queryKey: queryKeys.analytics.revenue(),
    queryFn: () => getRevenueTimeSeries(),
  });
}

export function useFunnelMetricsQuery() {
  return useQuery({
    queryKey: queryKeys.analytics.funnel(),
    queryFn: () => getFunnelMetrics(),
  });
}

export function useServicesPerformanceQuery() {
  return useQuery({
    queryKey: queryKeys.analytics.servicesPerformance(),
    queryFn: () => getServicesPerformance(),
  });
}
