import { describe, expect, it } from "vitest";
import { calculateBusinessValuation, calculatePublicValuation } from "../valuation.service";

describe("valuation service", () => {
  it("calculates real-time business valuation with valid range and tiers", async () => {
    const valuation = await calculateBusinessValuation();

    expect(valuation.estimatedLow).toBeGreaterThan(0);
    expect(valuation.estimatedHigh).toBeGreaterThan(valuation.estimatedLow);
    expect(valuation.midpoint).toBeGreaterThanOrEqual(valuation.estimatedLow);
    expect(valuation.midpoint).toBeLessThanOrEqual(valuation.estimatedHigh);

    expect(["emerging", "established", "flagship", "haute"]).toContain(valuation.tier);
    expect(valuation.tierLabel).toBeDefined();
    expect(valuation.tierDescription).toBeDefined();

    expect(valuation.multiple).toBeGreaterThanOrEqual(1.5);
    expect(valuation.annualRunRate).toBeGreaterThan(0);
    expect(valuation.profitMargin).toBeGreaterThanOrEqual(0);
    expect(valuation.drivers.length).toBe(4);
    expect(valuation.growthLevers.length).toBeGreaterThan(0);
  });

  it("adjusts valuation proportionally when monthly revenue increases", async () => {
    const baseline = await calculateBusinessValuation(150000);
    const scaled = await calculateBusinessValuation(800000);

    expect(scaled.annualRunRate).toBeGreaterThan(baseline.annualRunRate);
    expect(scaled.estimatedHigh).toBeGreaterThan(baseline.estimatedHigh);
  });

  it("calculates public valuation with £10,000 net profit and £15,000 net assets", () => {
    const result = calculatePublicValuation({
      currency: "GBP",
      industry: "luxury_services",
      annualRevenue: 50000,
      annualExpenses: 40000,
      netAssets: 15000,
      customerRetentionRate: 50,
    });

    expect(result.averageNetProfit).toBe(10000);
    expect(result.netAssets).toBe(15000);
    expect(result.multiple).toBe(3.4);
    expect(result.approximateValue).toBe(49000);
    expect(result.valuationRangeLow).toBeLessThan(result.approximateValue);
    expect(result.valuationRangeHigh).toBeGreaterThan(result.approximateValue);
    expect(result.drivers.length).toBe(4);
    expect(result.growthOpportunities.length).toBeGreaterThan(0);
  });
});
