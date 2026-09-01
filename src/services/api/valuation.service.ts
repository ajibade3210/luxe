import { INDUSTRY_SECTORS, VALUATION_TIER_CONFIG } from "@/constants/valuation";
import { apiClient } from "@/lib/api-client";
import type {
  BusinessValuation,
  PublicValuationInputs,
  PublicValuationResult,
  ValuationDriver,
  ValuationTier,
} from "@/types";

/**
 * Calculates real-time Studio Business Valuation based on live database ledger
 */
export async function calculateBusinessValuation(
  monthlyRevenueOverride?: number
): Promise<BusinessValuation> {
  return apiClient.post<BusinessValuation>("/valuation/calculate-advanced", {
    monthlyRevenueOverride,
  });
}

/**
 * Calculates public valuation appraisal (Instant UI calculation + background sync)
 */
export function calculatePublicValuation(inputs: PublicValuationInputs): PublicValuationResult {
  const {
    currency,
    industry,
    annualRevenue,
    annualExpenses,
    netAssets,
    customerRetentionRate,
    email,
    phone,
  } = inputs;

  const averageNetProfit = Math.max(0, annualRevenue - annualExpenses);
  const profitMargin = annualRevenue > 0 ? Math.round((averageNetProfit / annualRevenue) * 100) : 0;

  const sector =
    (
      INDUSTRY_SECTORS as Record<
        string,
        { label: string; baseMultiple: number; description: string }
      >
    )[industry] || INDUSTRY_SECTORS.luxury_services;
  let baseMultiple = sector.baseMultiple;

  if (profitMargin >= 40) baseMultiple += 0.4;
  else if (profitMargin >= 20) baseMultiple += 0.2;
  else if (profitMargin < 10 && profitMargin > 0) baseMultiple -= 0.3;

  const retentionBoost = (customerRetentionRate / 100) * 0.8;
  baseMultiple += retentionBoost;

  const maxCap = industry === "digital_tech" ? 6.0 : 4.8;
  const multiple = Number(Math.min(maxCap, Math.max(1.5, baseMultiple)).toFixed(1));

  const earningsValue = averageNetProfit * multiple;
  const approximateValue = Math.round(earningsValue + netAssets);

  const valuationRangeLow =
    averageNetProfit > 0
      ? Math.round(averageNetProfit * (multiple * 0.88) + netAssets * 0.95)
      : Math.round(netAssets * 0.9);

  const valuationRangeHigh =
    averageNetProfit > 0
      ? Math.round(averageNetProfit * (multiple * 1.15) + netAssets * 1.05)
      : Math.round(netAssets * 1.1);

  let tier: ValuationTier = "emerging";
  if (averageNetProfit === 0 && customerRetentionRate < 30) {
    tier = "emerging";
  } else if (profitMargin >= 40 && customerRetentionRate >= 60) {
    tier = "haute";
  } else if (profitMargin >= 25 && customerRetentionRate >= 40) {
    tier = "flagship";
  } else if (profitMargin >= 10 || customerRetentionRate >= 25) {
    tier = "established";
  }

  const tierConfig = VALUATION_TIER_CONFIG[tier];

  const drivers: ValuationDriver[] = [
    {
      id: "net_profit",
      name: "Annual Net Profit",
      value: `${profitMargin}% Margin`,
      impact: profitMargin >= 30 ? "high" : "positive",
      detail: "Annual cashflow after deducting all operating expenses",
    },
    {
      id: "sde_multiple",
      name: "Profit Multiple",
      value: `${multiple}x`,
      impact: multiple >= 3.0 ? "high" : "neutral",
      detail: "Industry baseline + client retention equity score",
    },
    {
      id: "net_assets",
      name: "Net Assets",
      value: "Balance Sheet",
      impact: netAssets > 0 ? "positive" : "neutral",
      detail: "Tangible studio assets, inventory, and equipment",
    },
    {
      id: "retention",
      name: "Repeat Customer Rate",
      value: `${customerRetentionRate}% Repeat`,
      impact: customerRetentionRate >= 40 ? "high" : "positive",
      detail: "Repeat purchase velocity and customer loyalty",
    },
  ];

  const growthOpportunities = [
    `Increasing repeat customer rate from ${customerRetentionRate}% to ${Math.min(100, customerRetentionRate + 20)}% could add up to +0.3x to your valuation multiple.`,
    "Centralizing customer records into an exportable CRM eliminates buyer risk during due diligence.",
    "Categorizing operating expenses and issuing digital receipts protects your valuation from tax penalties.",
    "Broadcasting seasonal drops via WhatsApp to past buyers generates high-margin repeat revenue.",
  ];

  // Background sync if contact info is attached
  if (email || phone) {
    apiClient.post("/valuation/calculate-public", inputs).catch(() => {});
  }

  return {
    currency,
    annualRevenue,
    annualExpenses,
    averageNetProfit,
    netAssets,
    multiple,
    approximateValue,
    valuationRangeLow,
    valuationRangeHigh,
    tier,
    tierLabel: tierConfig.label,
    tierDescription: tierConfig.description,
    profitMargin,
    calculatedAt: new Date().toISOString(),
    drivers,
    growthOpportunities,
  };
}
