import { describe, expect, it, vi } from "vitest";
import { apiClient } from "@/lib/api-client";
import type { BusinessValuation } from "@/types";
import { calculateBusinessValuation, calculatePublicValuation } from "../valuation.service";

describe("valuation service", () => {
  it("calculates real-time business valuation with valid range and tiers", async () => {
    const mockValuation: BusinessValuation = {
      estimatedLow: 3500000,
      estimatedHigh: 5500000,
      midpoint: 4500000,
      multiple: 2.8,
      tier: "established",
      tierLabel: "Established Studio",
      tierDescription: "Stable recurring clientele with established revenue velocity.",
      annualRunRate: 3000000,
      annualNetProfit: 1800000,
      profitMargin: 60,
      activeCustomerCount: 8,
      drivers: [],
      growthLevers: [],
      calculatedAt: "2026-08-20T10:00:00Z",
    };
    vi.spyOn(apiClient, "post").mockResolvedValueOnce(mockValuation);

    const valuation = await calculateBusinessValuation();
    expect(valuation.estimatedLow).toBeGreaterThan(0);
    expect(valuation.estimatedHigh).toBeGreaterThan(valuation.estimatedLow);
    expect(valuation.midpoint).toBe(4500000);
    expect(valuation.multiple).toBe(2.8);
  });

  it("calculates public valuation synchronously", () => {
    const publicResult = calculatePublicValuation({
      currency: "NGN",
      industry: "luxury_services",
      annualRevenue: 5000000,
      annualExpenses: 2000000,
      netAssets: 500000,
      customerRetentionRate: 65,
    });

    expect(publicResult.averageNetProfit).toBe(3000000);
    expect(publicResult.netAssets).toBe(500000);
    expect(publicResult.multiple).toBeGreaterThanOrEqual(1.5);
    expect(publicResult.approximateValue).toBeGreaterThan(3000000);
    expect(publicResult.valuationRangeLow).toBeLessThanOrEqual(publicResult.approximateValue);
    expect(publicResult.valuationRangeHigh).toBeGreaterThanOrEqual(publicResult.approximateValue);
    expect(publicResult.drivers.length).toBe(4);
    expect(publicResult.growthOpportunities.length).toBeGreaterThan(0);
  });
});
