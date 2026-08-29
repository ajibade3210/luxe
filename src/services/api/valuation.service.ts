import { INDUSTRY_SECTORS, VALUATION_GROWTH_LEVERS, VALUATION_TIER_CONFIG } from "@/constants";
import type {
  BusinessValuation,
  PublicValuationInputs,
  PublicValuationResult,
  ValuationDriver,
  ValuationTier,
} from "@/types";
import { getCustomers } from "./customer.service";
import { getExpenseSummary } from "./expense.service";
import { getLeads } from "./leads.service";

const delay = (ms = 100) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Calculates real-time Studio Business Valuation based on:
 * 1. Annualized Revenue Velocity (ARR)
 * 2. Net Profit Run-Rate after operating expenses
 * 3. Customer Retention & Repeat Client Equity
 * 4. Inbound Lead Conversion Velocity
 */
export async function calculateBusinessValuation(
  monthlyRevenueOverride?: number
): Promise<BusinessValuation> {
  await delay(120);

  const [customers, expenseSummary, leads] = await Promise.all([
    getCustomers(),
    getExpenseSummary(),
    getLeads(),
  ]);

  const activeCustomers = customers.filter(c => c.isActive);
  const totalCustomerRevenue = customers.reduce((acc, c) => acc + c.totalRevenue, 0);

  // Determine monthly revenue basis (use override or derived from active customers)
  const monthlyRevenue =
    monthlyRevenueOverride ||
    (totalCustomerRevenue > 0 ? Math.round(totalCustomerRevenue / 2) : 250000);
  const monthlyExpenses = expenseSummary.totalAmount > 0 ? expenseSummary.totalAmount : 85000;

  const annualRunRate = monthlyRevenue * 12;
  const annualExpenses = monthlyExpenses * 12;
  const annualNetProfit = Math.max(annualRunRate - annualExpenses, Math.round(annualRunRate * 0.4));
  const profitMargin = Math.round((annualNetProfit / Math.max(annualRunRate, 1)) * 100);

  // Valuation Tier Classification
  let tier: ValuationTier = "emerging";
  if (annualRunRate >= 10000000 || activeCustomers.length >= 25) {
    tier = "haute";
  } else if (annualRunRate >= 5000000 || activeCustomers.length >= 10) {
    tier = "flagship";
  } else if (annualRunRate >= 2000000 || activeCustomers.length >= 5) {
    tier = "established";
  }

  const tierConfig = VALUATION_TIER_CONFIG[tier];

  // Base multiple adjusted by profit margin and customer retention
  let baseMultiple = (tierConfig.minMultiple + tierConfig.maxMultiple) / 2;
  if (profitMargin > 50) {
    baseMultiple += 0.3;
  }
  if (activeCustomers.length > 5) {
    baseMultiple += 0.2;
  }

  const multiple = Number(baseMultiple.toFixed(1));

  // Client Equity valuation bonus (₦15,000 per active retained client)
  const clientEquity = activeCustomers.length * 25000;

  const rawEstimatedLow = Math.max(
    annualNetProfit * (multiple * 0.88) + clientEquity * 0.8,
    1500000
  );
  const rawEstimatedHigh = Math.max(
    annualNetProfit * (multiple * 1.15) + clientEquity * 1.4,
    2500000
  );

  // Round to clean 10,000 increments
  const estimatedLow = Math.round(rawEstimatedLow / 10000) * 10000;
  const estimatedHigh = Math.round(rawEstimatedHigh / 10000) * 10000;
  const midpoint = Math.round((estimatedLow + estimatedHigh) / 2 / 10000) * 10000;

  // Valuation Drivers
  const drivers: ValuationDriver[] = [
    {
      id: "arr",
      name: "Annual Revenue Run-Rate",
      value: `₦${(annualRunRate / 1000000).toFixed(2)}M`,
      impact: "high",
      detail: "Annualized gross inflow from paid invoices & client retainers",
    },
    {
      id: "sde",
      name: "SDE Net Profit Multiple",
      value: `${multiple}x`,
      impact: profitMargin > 45 ? "high" : "neutral",
      detail: `${profitMargin}% net take-home margin after all logged expenses`,
    },
    {
      id: "clients",
      name: "Active Client Base",
      value: `${activeCustomers.length} Active`,
      impact: activeCustomers.length > 3 ? "positive" : "neutral",
      detail: "Repeat recurring relationships and service history",
    },
    {
      id: "pipeline",
      name: "Lead Conversion Pipeline",
      value: `${leads.length} Inquiries`,
      impact: "positive",
      detail: "Inbound quote demand from public storefront and 3D card",
    },
  ];

  return {
    estimatedLow,
    estimatedHigh,
    midpoint,
    multiple,
    tier,
    tierLabel: tierConfig.label,
    tierDescription: tierConfig.description,
    annualRunRate,
    annualNetProfit,
    profitMargin,
    activeCustomerCount: activeCustomers.length,
    drivers,
    growthLevers: [...VALUATION_GROWTH_LEVERS],
    calculatedAt: new Date().toISOString(),
  };
}

/**
 * Calculates a public valuation appraisal based on user-submitted financials:
 * Formula: (Average Net Profit * SDE Industry Multiple) + Net Tangible Assets
 */
export function calculatePublicValuation(inputs: PublicValuationInputs): PublicValuationResult {
  const { currency, industry, annualRevenue, annualExpenses, netAssets, customerRetentionRate } =
    inputs;

  const averageNetProfit = Math.max(0, annualRevenue - annualExpenses);
  const profitMargin = annualRevenue > 0 ? Math.round((averageNetProfit / annualRevenue) * 100) : 0;

  // Base multiple by sector
  const sectorConfig = INDUSTRY_SECTORS[industry] || INDUSTRY_SECTORS.luxury_services;
  let baseMultiple = sectorConfig.baseMultiple;

  // Margin adjustment
  if (profitMargin >= 40) {
    baseMultiple += 1.4;
  } else if (profitMargin >= 20) {
    baseMultiple += 0.8;
  } else if (profitMargin < 10 && profitMargin > 0) {
    baseMultiple -= 0.4;
  }

  // Retention adjustment (0% to 100% maps to +0.0x to +2.8x)
  const retentionBoost = (customerRetentionRate / 100) * 2.8;
  baseMultiple += retentionBoost;

  const multiple = Number(Math.max(1.5, baseMultiple).toFixed(1));

  // Valuation calculation
  const earningsValue = averageNetProfit * multiple;
  const approximateValue = Math.round(earningsValue + netAssets);

  const valuationRangeLow = Math.round(averageNetProfit * (multiple * 0.88) + netAssets * 0.9);
  const valuationRangeHigh = Math.round(averageNetProfit * (multiple * 1.15) + netAssets * 1.1);

  // Classify tier
  let tier: ValuationTier = "emerging";
  if (approximateValue >= 500000) {
    tier = "haute";
  } else if (approximateValue >= 200000) {
    tier = "flagship";
  } else if (approximateValue >= 75000) {
    tier = "established";
  }

  const tierConfig = VALUATION_TIER_CONFIG[tier];

  // Key drivers
  const drivers: ValuationDriver[] = [
    {
      id: "net_profit",
      name: "Average Net Profit",
      value: `${profitMargin}% Margin`,
      impact: profitMargin >= 30 ? "high" : "positive",
      detail: "True cashflow after deducting all annual operational expenses",
    },
    {
      id: "sde_multiple",
      name: "SDE Valuation Multiple",
      value: `${multiple}x`,
      impact: multiple >= 4.0 ? "high" : "neutral",
      detail: `${sectorConfig.label} industry baseline + retention score`,
    },
    {
      id: "net_assets",
      name: "Net Tangible Assets",
      value: "Balance Sheet",
      impact: netAssets > 0 ? "positive" : "neutral",
      detail: "Tangible studio assets, inventory, and equipment equity",
    },
    {
      id: "retention",
      name: "Customer Retention Score",
      value: `${customerRetentionRate}% Repeat`,
      impact: customerRetentionRate >= 40 ? "high" : "positive",
      detail: "Repeat purchase velocity and active client loyalty",
    },
  ];

  const growthOpportunities = [
    `Increasing customer retention from ${customerRetentionRate}% to ${Math.min(100, customerRetentionRate + 20)}% could increase your multiple by +0.4x.`,
    "Centralizing customer records into an exportable CRM eliminates buyer risk during due diligence.",
    "Categorizing operating expenses and issuing digital receipts protects your valuation from tax penalties.",
    "Broadcasting seasonal drops via WhatsApp to past buyers generates high-margin repeat revenue.",
  ];

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
