"use client";

import { Info, Landmark, RefreshCw, Sparkles } from "lucide-react";
import { useState } from "react";
import { VALUATION_DISCLAIMER_NOTE, VALUATION_EMPTY_STATE } from "@/constants";
import type { ValuationCardProps } from "@/types";
import { formatCompactMoney } from "@/utils";

export function ValuationCard({ valuation, onRefresh, onToast }: ValuationCardProps) {
  const [isRefreshing, setIsRefreshing] = useState(false);

  if (!valuation) return null;

  // Zero-data empty state for brand new studios with no revenue/records yet
  if (valuation.estimatedHigh <= 0 || valuation.annualRunRate <= 0) {
    return (
      <div className="bg-white border border-[#eee7dc] rounded-2xl p-5 sm:p-6 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-[#faf5ee] border border-[#f0e4d4] flex items-center justify-center shrink-0 text-[#a06840]">
            <Sparkles size={18} />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#9e633d] block">
              {VALUATION_EMPTY_STATE.eyebrow}
            </span>
            <h3 className="text-base font-serif font-bold text-[#1f1d1a] mt-0.5">
              {VALUATION_EMPTY_STATE.title}
            </h3>
            <p className="text-xs text-[#665e57] mt-1 max-w-lg leading-relaxed">
              {VALUATION_EMPTY_STATE.description}
            </p>
          </div>
        </div>

        <a
          href="/expenses"
          className="inline-flex items-center gap-1.5 bg-[#191c1d] hover:bg-black !text-white px-4 py-2 rounded-xl text-xs font-semibold hover:-translate-y-0.5 hover:shadow-xs transition-all shrink-0 cursor-pointer"
        >
          <span>{VALUATION_EMPTY_STATE.actionLabel}</span>
        </a>
      </div>
    );
  }

  const handleRefresh = async () => {
    if (!onRefresh) return;
    setIsRefreshing(true);
    await onRefresh();
    setIsRefreshing(false);
    onToast?.("Valuation model updated with real-time sales and expense records.");
  };

  const asOfDate = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date());

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Left Hero Card: ESTIMATED VALUATION RANGE FOR YOUR STORE       */}
      <div className="md:col-span-2 bg-white border border-[#eee7dc] rounded-2xl p-6 sm:p-7 relative overflow-hidden flex flex-col justify-between min-h-[170px] shadow-2xs">
        <div className="relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#6b7280] block">
                ESTIMATED VALUATION RANGE FOR YOUR STORE{" "}
              </span>
              <span className="relative inline-flex items-center group">
                <button
                  type="button"
                  className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#fef2f2] text-[#ef4444] border border-[#fca5a5] hover:bg-[#fee2e2] hover:scale-110 transition-all cursor-pointer shadow-xs"
                  aria-label="Valuation appraisal disclaimer"
                >
                  <Info size={16} className="stroke-[2.5]" />
                </button>
                {/* Instant Hover Tooltip Popover */}
                <span
                  role="tooltip"
                  className="absolute left-0 sm:left-1/2 sm:-translate-x-1/2 top-full mt-2 w-72 sm:w-80 p-3 bg-[#191c1d] text-white text-[11px] leading-relaxed rounded-xl shadow-xl border border-white/10 opacity-0 invisible group-hover:opacity-100 group-hover:visible group-focus-within:opacity-100 group-focus-within:visible transition-all duration-150 pointer-events-none z-50 text-left font-normal"
                >
                  {VALUATION_DISCLAIMER_NOTE}
                  <span className="absolute left-4 sm:left-1/2 sm:-translate-x-1/2 -top-1 border-4 border-transparent border-b-[#191c1d]" />
                </span>
              </span>
            </div>

            {/* Date & Refresh Trigger inside card header */}
            <div className="flex items-center gap-2 text-[11px] text-[#6b7280]">
              <span>
                Data as of: <strong className="text-[#191c1d] font-semibold">{asOfDate}</strong>
              </span>
              {onRefresh && (
                <button
                  type="button"
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                  className="w-6 h-6 rounded-md bg-[#faf7f2] hover:bg-[#f0ebe3] flex items-center justify-center text-[#665e57] hover:text-[#191c1d] transition-colors cursor-pointer disabled:opacity-50"
                  title="Recalculate valuation"
                  aria-label="Recalculate valuation"
                >
                  <RefreshCw size={11} className={isRefreshing ? "animate-spin" : ""} />
                </button>
              )}
            </div>
          </div>

          <div className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#191c1d] font-sans tabular-nums mt-3">
            {formatCompactMoney(valuation.estimatedLow)} –{" "}
            {formatCompactMoney(valuation.estimatedHigh)}
          </div>
          <p className="text-xs text-[#665e57] mt-3.5 font-normal max-w-lg leading-relaxed">
            {valuation.tierDescription}
          </p>
        </div>

        {/* Architectural Landmark Pantheon Watermark */}
        <Landmark
          size={110}
          strokeWidth={1}
          className="absolute right-5 top-1/2 -translate-y-1/2 text-[#191c1d]/[0.05] pointer-events-none select-none"
        />
      </div>

      {/* Right Card: Key Metrics */}
      <div className="bg-white border border-[#eee7dc] rounded-2xl p-6 flex flex-col justify-between space-y-4 shadow-2xs">
        <span className="text-[10px] font-bold uppercase tracking-wider text-[#6b7280] block">
          KEY METRICS
        </span>

        <div className="space-y-4">
          <div>
            <span className="text-xs text-[#665e57] block">SDE Net Multiple</span>
            <strong className="text-base font-bold font-sans text-[#191c1d] block mt-0.5 tabular-nums">
              {valuation.multiple}x
            </strong>
          </div>

          <div>
            <span className="text-xs text-[#665e57] block">Net Margin</span>
            <strong className="text-base font-bold font-sans text-[#191c1d] block mt-0.5 tabular-nums">
              {valuation.profitMargin}%
            </strong>
          </div>
        </div>
      </div>
    </div>
  );
}
