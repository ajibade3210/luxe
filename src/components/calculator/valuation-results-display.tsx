import { ArrowRight, HelpCircle } from "lucide-react";
import { SDE_TOOLTIP_TEXT, VALUATION_DISCLAIMER_NOTE } from "@/constants/valuation";
import type { ValuationResultsDisplayProps } from "@/types";
import { formatMoney } from "@/utils/currency";

export function ValuationResultsDisplay({ result }: ValuationResultsDisplayProps) {
  const formattedNetProfit = formatMoney(result.averageNetProfit, result.currency);
  const formattedNetAssets = formatMoney(result.netAssets, result.currency);
  const formattedApproxValue = formatMoney(result.approximateValue, result.currency);
  const formattedLow = formatMoney(result.valuationRangeLow, result.currency);
  const formattedHigh = formatMoney(result.valuationRangeHigh, result.currency);

  return (
    <div className="bg-gradient-to-br from-[#faf7f2] via-[#fcfbf9] to-[#f5efe6]/70 border border-[#e8dfd2] rounded-2xl p-6 sm:p-7 shadow-xs flex flex-col justify-between space-y-6">
      {/* Top Header */}
      <div>
        <div className="flex items-center justify-between border-b border-[#eee7dc] pb-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#9e633d]">
              Step 2 • Appraisal Snapshot
            </span>
            <h2 className="text-lg font-serif font-bold text-[#1f1d1a] mt-0.5">Your results</h2>
          </div>
          <div className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-[#ecfdf5] text-[#059669] border border-[#a7f3d0]">
            <span>{result.tierLabel}</span>
          </div>
        </div>

        {/* Primary 3-Metric Hero Results Card */}
        <div className="mt-5 bg-white border border-[#eee7dc] rounded-2xl p-5 shadow-xs space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-b border-[#f4eee6] pb-4">
            {/* Average Net Profit */}
            <div className="space-y-1">
              <div className="flex items-center gap-1 text-xs font-medium text-[#8c827a]">
                <span>Average net profit</span>
              </div>
              <div className="text-2xl font-bold font-sans tabular-nums tracking-tight text-[#1f1d1a]">
                {formattedNetProfit}
              </div>
              <p className="text-[10px] text-[#059669] font-medium">
                {result.profitMargin}% Net take-home margin
              </p>
            </div>

            {/* Net Assets */}
            <div className="space-y-1">
              <div className="flex items-center gap-1 text-xs font-medium text-[#8c827a]">
                <span>Net assets</span>
              </div>
              <div className="text-2xl font-bold font-sans tabular-nums tracking-tight text-[#1f1d1a]">
                {formattedNetAssets}
              </div>
              <p className="text-[10px] text-[#8c827a]">
                Tangible equipment & balance sheet equity
              </p>
            </div>
          </div>

          {/* Approximate Business Value (Featured Highlight) */}
          <div className="bg-[#faf7f2] border border-[#ded5c8] rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-0.5">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold uppercase tracking-wider text-[#9e633d]">
                  Approximate business value
                </span>
                <div className="relative group cursor-pointer" title={SDE_TOOLTIP_TEXT}>
                  <HelpCircle size={13} className="text-[#8c827a]" />
                </div>
              </div>
              <div className="text-3xl sm:text-4xl font-bold font-sans tabular-nums tracking-tight text-[#1f1d1a]">
                {formattedApproxValue}
              </div>
              <div className="text-[11px] text-[#665e57]">
                Estimated Range:{" "}
                <span className="font-semibold font-sans tabular-nums text-[#1f1d1a]">
                  {formattedLow}
                </span>{" "}
                –{" "}
                <span className="font-semibold font-sans tabular-nums text-[#1f1d1a]">
                  {formattedHigh}
                </span>
              </div>
            </div>

            <div className="bg-white px-3.5 py-2.5 rounded-xl border border-[#eee7dc] text-right shrink-0">
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#8c827a] block">
                Applied Multiple
              </span>
              <span className="text-xl font-bold font-sans tabular-nums text-[#9e633d]">
                {result.multiple}x SDE
              </span>
            </div>
          </div>
        </div>

        {/* 4 Drivers Grid */}
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {result.drivers.map(driver => (
            <div
              key={driver.id}
              className="bg-white border border-[#eee7dc] rounded-xl p-3 shadow-2xs space-y-0.5"
            >
              <span className="text-[10px] font-medium text-[#8c827a] block truncate">
                {driver.name}
              </span>
              <span className="text-xs font-bold font-sans tabular-nums text-[#1f1d1a] block truncate">
                {driver.value}
              </span>
              <span className="text-[9px] text-[#665e57] line-clamp-1 block">{driver.detail}</span>
            </div>
          ))}
        </div>

        {/* Growth Opportunities */}
        <div className="mt-4 bg-white/90 border border-[#eee7dc] rounded-xl p-3.5 space-y-2">
          <div className="text-xs font-bold text-[#1f1d1a]">
            <span>Valuation Multiplier Levers</span>
          </div>
          <ul className="space-y-1.5 text-[11px] text-[#665e57]">
            {result.growthOpportunities.slice(0, 3).map((item, idx) => (
              <li key={idx} className="flex items-start gap-1.5">
                <span className="text-[#059669] font-bold mt-0.5">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Action Footer & Disclaimer */}
      <div className="space-y-3 pt-2">
        <a
          href="/signup"
          className="w-full bg-[#191c1d] hover:bg-black !text-white px-4 py-3 rounded-xl text-xs font-semibold hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 transition-all cursor-pointer flex items-center justify-center gap-2"
        >
          <span>Claim Studio & Track Valuation Live</span>
          <ArrowRight size={14} />
        </a>

        <p className="text-[10px] text-[#8c827a] leading-relaxed text-center">
          {VALUATION_DISCLAIMER_NOTE}
        </p>
      </div>
    </div>
  );
}
