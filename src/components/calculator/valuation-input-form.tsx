"use client";

import { INDUSTRY_SECTORS } from "@/constants/valuation";
import type { CurrencyCode, IndustrySector, ValuationInputFormProps } from "@/types";
import { CURRENCY_SYMBOLS } from "@/utils/currency";

const CURRENCIES: { code: CurrencyCode; label: string; symbol: string }[] = [
  { code: "GBP", label: "GBP (£) British Pound", symbol: "£" },
  { code: "USD", label: "USD ($) US Dollar", symbol: "$" },
  { code: "NGN", label: "NGN (₦) Nigerian Naira", symbol: "₦" },
  { code: "EUR", label: "EUR (€) Euro", symbol: "€" },
];

export function ValuationInputForm({
  values,
  onChange,
  onCalculate,
  isCalculating,
}: ValuationInputFormProps) {
  const sym = CURRENCY_SYMBOLS[values.currency] || "£";

  return (
    <div className="bg-white border border-[#eee7dc] rounded-2xl p-6 sm:p-7 shadow-[0_2px_12px_rgba(70,50,30,0.02)] flex flex-col justify-between">
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-[#f4eee6] pb-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#9e633d]">
              Step 1 • Business Inputs
            </span>
            <h2 className="text-lg font-serif font-bold text-[#1f1d1a] mt-0.5">
              Financial & Operational Details
            </h2>
          </div>
          <div className="flex items-center gap-1.5 bg-[#faf7f2] border border-[#e8dfd2] px-3 py-1.5 rounded-xl">
            <span className="text-xs font-semibold text-[#665e57]">Currency:</span>
            <select
              value={values.currency}
              onChange={e => onChange("currency", e.target.value as CurrencyCode)}
              aria-label="Select currency"
              className="bg-transparent text-xs font-bold text-[#1f1d1a] focus:outline-hidden cursor-pointer"
            >
              {CURRENCIES.map(c => (
                <option key={c.code} value={c.code}>
                  {c.code} ({c.symbol})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Industry Sector */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-[#1f1d1a] block">Industry / Sector</label>
          <select
            value={values.industry}
            onChange={e => onChange("industry", e.target.value as IndustrySector)}
            aria-label="Select industry sector"
            className="w-full bg-[#faf7f2] border border-[#e8dfd2] rounded-xl px-3.5 py-2.5 text-xs font-medium text-[#1f1d1a] focus:outline-hidden focus:border-[#c59a78] transition-colors cursor-pointer"
          >
            {Object.entries(INDUSTRY_SECTORS).map(([key, item]) => (
              <option key={key} value={key}>
                {item.label} (Base ~{item.baseMultiple}x multiple)
              </option>
            ))}
          </select>
          <p className="text-[11px] text-[#8c827a]">
            {INDUSTRY_SECTORS[values.industry]?.description}
          </p>
        </div>

        {/* Financial Inputs 2-Column Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Annual Turnover / Revenue */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#1f1d1a] block">
              Annual Revenue / Inflow
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-[#8c827a] font-sans">
                {sym}
              </span>
              <input
                type="number"
                min="0"
                step="1000"
                value={values.annualRevenue}
                onChange={e => onChange("annualRevenue", Math.max(0, Number(e.target.value) || 0))}
                aria-label="Annual Revenue / Inflow"
                className="w-full bg-[#faf7f2] border border-[#e8dfd2] rounded-xl pl-8 pr-3.5 py-2.5 text-xs font-bold font-sans tabular-nums text-[#1f1d1a] focus:outline-hidden focus:border-[#c59a78] transition-colors"
                placeholder="50000"
              />
            </div>
            <p className="text-[10px] text-[#8c827a]">
              Total gross billing over the past 12 months.
            </p>
          </div>

          {/* Annual Operating Expenses */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#1f1d1a] block">Annual Expenses</label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-[#8c827a] font-sans">
                {sym}
              </span>
              <input
                type="number"
                min="0"
                step="1000"
                value={values.annualExpenses}
                onChange={e => onChange("annualExpenses", Math.max(0, Number(e.target.value) || 0))}
                aria-label="Annual Expenses"
                className="w-full bg-[#faf7f2] border border-[#e8dfd2] rounded-xl pl-8 pr-3.5 py-2.5 text-xs font-bold font-sans tabular-nums text-[#1f1d1a] focus:outline-hidden focus:border-[#c59a78] transition-colors"
                placeholder="40000"
              />
            </div>
            <p className="text-[10px] text-[#8c827a]">
              Materials, logistics, salaries, utilities, and rent.
            </p>
          </div>
        </div>

        {/* Net Tangible Assets */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-[#1f1d1a] block">Net Tangible Assets</label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-[#8c827a] font-sans">
              {sym}
            </span>
            <input
              type="number"
              min="0"
              step="500"
              value={values.netAssets}
              onChange={e => onChange("netAssets", Math.max(0, Number(e.target.value) || 0))}
              aria-label="Net Tangible Assets"
              className="w-full bg-[#faf7f2] border border-[#e8dfd2] rounded-xl pl-8 pr-3.5 py-2.5 text-xs font-bold font-sans tabular-nums text-[#1f1d1a] focus:outline-hidden focus:border-[#c59a78] transition-colors"
              placeholder="15000"
            />
          </div>
          <p className="text-[10px] text-[#8c827a]">
            Equipment, studio inventory, stock, and cash minus debts.
          </p>
        </div>

        {/* Customer Retention Slider */}
        <div className="space-y-2 bg-[#faf7f2] border border-[#e8dfd2] rounded-xl p-3.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-[#1f1d1a] block">
              Customer Retention Rate
            </label>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold font-sans tabular-nums bg-white border border-[#ded5c8] text-[#1f1d1a]">
              {values.customerRetentionRate}% Repeat
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            step="5"
            value={values.customerRetentionRate}
            onChange={e => onChange("customerRetentionRate", Number(e.target.value))}
            aria-label="Customer Retention Rate slider"
            className="w-full accent-[#9e633d] cursor-pointer"
          />
          <div className="flex justify-between text-[10px] font-medium text-[#8c827a]">
            <span>0% (All 1-Off Clients)</span>
            <span>50% (Solid Loyalty)</span>
            <span>100% (Pure Subscriptions)</span>
          </div>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-[#f4eee6]">
        <button
          type="button"
          onClick={onCalculate}
          disabled={isCalculating}
          className="w-full bg-[#191c1d] hover:bg-black !text-white px-4 py-3 rounded-xl text-xs font-semibold hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 transition-all cursor-pointer flex items-center justify-center"
        >
          {isCalculating ? "Calculating Appraisal..." : "Update Valuation Appraisal"}
        </button>
      </div>
    </div>
  );
}
