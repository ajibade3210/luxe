import { describe, expect, it } from "vitest";
import { calculateBusinessValuation } from "../valuation.service";

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
});
