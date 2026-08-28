"use client";

import {
  ArrowDownRight,
  ArrowUpRight,
  Check,
  Copy,
  ExternalLink,
  Globe,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { APP_CONFIG, EXPENSE_CATEGORY_CONFIG, THEME_PALETTE } from "@/constants";
import { getAnalytics, getBusinessProfile } from "@/lib/api";
import { businessProfile as initialMockProfile } from "@/lib/mock-data";
import type { AnalyticsOverview, AnalyticsPageProps, ExpenseCategory, Timeframe } from "@/types";
import { formatMoney, useAdminToast } from "./admin-layout";

export function AnalyticsPage({ onToast }: AnalyticsPageProps) {
  const { showToast } = useAdminToast();
  const notify = onToast || showToast;
  const [timeframe, setTimeframe] = useState<Timeframe>("monthly");
  const [data, setData] = useState<AnalyticsOverview | null>(null);
  const [slug, setSlug] = useState(initialMockProfile.slug || APP_CONFIG.defaultSlug);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    getBusinessProfile().then(profile => {
      if (profile.slug) setSlug(profile.slug);
    });
  }, []);

  useEffect(() => {
    getAnalytics(timeframe).then(res => {
      setData(res);
    });
  }, [timeframe]);

  const publicUrl = `${typeof window !== "undefined" ? window.location.origin : "https://shopwus.com"}/${slug}`;

  const copyUrl = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(publicUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
      notify("Public shop URL copied to clipboard!");
    }
  };

  if (!data) {
    return (
      <section className="content max-w-6xl mx-auto py-16 flex justify-center items-center">
        <div className="text-xs text-[#8c827a] font-medium animate-pulse">
          Loading studio telemetry &amp; financial records...
        </div>
      </section>
    );
  }

  return (
    <section className="content max-w-6xl mx-auto space-y-6 pb-16 font-sans">
      {/* Top Header & Timeframe Switch */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#191c1d] tracking-tight">
            Welcome to Élan Atelier
          </h1>
        </div>

        {/* Timeframe Filter Switch */}
        <div className="inline-flex items-center p-1 rounded-xl bg-[#f0ebe3] border border-[#e2dad0]">
          {(
            [
              ["daily", "Daily"],
              ["monthly", "Monthly"],
              ["yearly", "Yearly"],
            ] as const
          ).map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => setTimeframe(key)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                timeframe === key
                  ? "bg-white text-[#191c1d] shadow-2xs"
                  : "text-[#747878] hover:text-[#191c1d]"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Public Shop URL Bar */}
      <div className="bg-white border border-[#eee7dc] rounded-2xl p-4 sm:p-4.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-[#faf8f5] border border-[#e8e2d8] flex items-center justify-center shrink-0 text-[#855e2e]">
            <Globe size={15} />
          </div>
          <div className="min-w-0">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#855e2e] block">
              Public Shop URL
            </span>
            <span className="text-xs text-[#444748] font-mono block truncate max-w-xs sm:max-w-md">
              {publicUrl}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
          <button
            type="button"
            onClick={copyUrl}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 bg-[#faf8f5] hover:bg-[#f2ece3] text-[#191c1d] border border-[#ded7cb] px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer"
          >
            {copied ? (
              <>
                <Check size={13} className="text-[#059669]" />
                <span className="text-[#059669]">Copied</span>
              </>
            ) : (
              <>
                <Copy size={13} />
                <span>Copy Link</span>
              </>
            )}
          </button>
          <a
            href={`/${slug}?from=analytics`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center gap-1.5 bg-[#191c1d] hover:bg-black !text-white px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer shadow-2xs"
          >
            <span>View Live</span>
            <ExternalLink size={12} className="text-white" />
          </a>
        </div>
      </div>

      {/* 5 Financial & Growth Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
        {/* Card 1: Gross Sales */}
        <div className="bg-white border border-[#eee7dc] rounded-2xl p-4.5 flex flex-col justify-between space-y-3 shadow-2xs hover:border-[#ded7cb] transition-colors">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#747878]">
              Gross Sales (Inflow)
            </span>
            <span
              className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md text-[10px] font-bold ${
                data.revenue.isPositive
                  ? "bg-[#ecfdf5] text-[#059669]"
                  : "bg-[#fef2f2] text-[#dc2626]"
              }`}
            >
              {data.revenue.isPositive ? <ArrowUpRight size={11} /> : <ArrowDownRight size={11} />}
              {data.revenue.change}
            </span>
          </div>
          <div className="text-2xl font-bold tracking-tight text-[#191c1d] tabular-nums">
            {formatMoney(data.revenue.rawNumber)}
          </div>
        </div>

        {/* Card 2: Operating Expenses */}
        <div className="bg-white border border-[#eee7dc] rounded-2xl p-4.5 flex flex-col justify-between space-y-3 shadow-2xs hover:border-[#ded7cb] transition-colors">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#747878]">
              Operating Expenses
            </span>
            <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md text-[10px] font-bold bg-[#fef2f2] text-[#dc2626]">
              <ArrowDownRight size={11} />
              {data.expenses?.change || "-5.40%"}
            </span>
          </div>
          <div className="text-2xl font-bold tracking-tight text-[#191c1d] tabular-nums">
            {data.expenses ? formatMoney(data.expenses.rawNumber) : "₦0"}
          </div>
        </div>

        {/* Card 3: Real Net Profit */}
        <div className="bg-white border border-[#059669]/30 rounded-2xl p-4.5 flex flex-col justify-between space-y-3 shadow-2xs hover:border-[#059669]/50 transition-colors">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#059669]">
              Real Net Profit
            </span>
            <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md text-[10px] font-bold bg-[#ecfdf5] text-[#059669]">
              <TrendingUp size={11} />
              {data.netProfit?.change || "+41% margin"}
            </span>
          </div>
          <div className="text-2xl font-bold tracking-tight text-[#059669] tabular-nums">
            {data.netProfit ? formatMoney(data.netProfit.rawNumber) : "₦0"}
          </div>
        </div>

        {/* Card 4: Inquiries */}
        <div className="bg-white border border-[#eee7dc] rounded-2xl p-4.5 flex flex-col justify-between space-y-3 shadow-2xs hover:border-[#ded7cb] transition-colors">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#747878]">
              New Inquiries
            </span>
            <span
              className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md text-[10px] font-bold ${
                data.leads.isPositive
                  ? "bg-[#ecfdf5] text-[#059669]"
                  : "bg-[#fef2f2] text-[#dc2626]"
              }`}
            >
              {data.leads.isPositive ? <ArrowUpRight size={11} /> : <ArrowDownRight size={11} />}
              {data.leads.change}
            </span>
          </div>
          <div className="text-2xl font-bold tracking-tight text-[#191c1d] tabular-nums">
            {data.leads.value}
          </div>
        </div>

        {/* Card 5: Storefront Views */}
        <div className="bg-white border border-[#eee7dc] rounded-2xl p-4.5 flex flex-col justify-between space-y-3 shadow-2xs hover:border-[#ded7cb] transition-colors">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#747878]">
              Profile Views
            </span>
            <span
              className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md text-[10px] font-bold ${
                data.views.isPositive
                  ? "bg-[#ecfdf5] text-[#059669]"
                  : "bg-[#fef2f2] text-[#dc2626]"
              }`}
            >
              {data.views.isPositive ? <ArrowUpRight size={11} /> : <ArrowDownRight size={11} />}
              {data.views.change}
            </span>
          </div>
          <div className="text-2xl font-bold tracking-tight text-[#191c1d] tabular-nums">
            {data.views.value}
          </div>
        </div>
      </div>

      {/* Main Section: Sales Curve Chart + Spending Category Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (7 cols): Clean Minimal Spline Chart */}
        <div className="lg:col-span-7 bg-white border border-[#eee7dc] rounded-2xl p-5 sm:p-6 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-[#f4eee6]">
            <div>
              <h2 className="text-sm sm:text-base font-serif font-bold text-[#191c1d]">
                Sales &amp; Cashflow Telemetry
              </h2>
              <span className="text-[11px] text-[#747878] block mt-0.5">
                Volume trends and client transaction flow
              </span>
            </div>
            <button
              type="button"
              onClick={() => notify("Detailed telemetry report generated.")}
              className="text-xs font-semibold text-[#855e2e] hover:underline cursor-pointer"
            >
              See all
            </button>
          </div>

          {/* SVG Smooth Curve Area Chart */}
          <div className="relative w-full overflow-x-auto pt-4 pb-1">
            <div className="min-w-[480px]">
              <svg viewBox="0 0 840 260" className="w-full h-56 overflow-visible">
                <defs>
                  <linearGradient id="curveGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#855e2e" stopOpacity="0.18" />
                    <stop offset="70%" stopColor="#855e2e" stopOpacity="0.04" />
                    <stop offset="100%" stopColor="#ffffff" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Horizontal Dotted Grid Lines */}
                {[40, 80, 120, 160, 200, 240].map((y, idx) => (
                  <g key={y}>
                    <text
                      x="0"
                      y={y + 4}
                      fill="#a19d97"
                      fontSize="10"
                      fontFamily="sans-serif"
                      fontWeight="500"
                    >
                      {data.chart.yLabels[idx]}
                    </text>
                    <line
                      x1="35"
                      y1={y}
                      x2="800"
                      y2={y}
                      stroke="#f0ebe3"
                      strokeDasharray="3 3"
                      strokeWidth="1"
                    />
                  </g>
                ))}

                {/* Filled Area Gradient */}
                <path d={data.chart.areaPath} fill="url(#curveGradient)" />

                {/* Main Stroke Curve */}
                <path
                  d={data.chart.linePath}
                  fill="none"
                  stroke="#855e2e"
                  strokeWidth="2.25"
                  strokeLinecap="round"
                />

                {/* Peak Indicator Callout */}
                <g>
                  <circle
                    cx={data.chart.peakCoord.cx}
                    cy={data.chart.peakCoord.cy}
                    r="4.5"
                    fill="#855e2e"
                    stroke="#ffffff"
                    strokeWidth="2"
                  />
                  <rect
                    x={data.chart.peakCoord.cx - 22}
                    y={data.chart.peakCoord.cy - 30}
                    width="44"
                    height="20"
                    rx="5"
                    fill="#191c1d"
                  />
                  <text
                    x={data.chart.peakCoord.cx}
                    y={data.chart.peakCoord.cy - 16}
                    textAnchor="middle"
                    fill="#ffffff"
                    fontSize="10"
                    fontWeight="600"
                    fontFamily="sans-serif"
                  >
                    {data.chart.peakValue}
                  </text>
                </g>
              </svg>

              {/* X-Axis Labels */}
              <div className="flex justify-between pl-9 pr-4 pt-2 text-[10px] font-medium text-[#a19d97]">
                {data.chart.xLabels.map(lbl => (
                  <span key={lbl}>{lbl}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (5 cols): Spending by Category */}
        <div className="lg:col-span-5 bg-white border border-[#eee7dc] rounded-2xl p-5 sm:p-6 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-[#f4eee6]">
            <div>
              <h2 className="text-sm sm:text-base font-serif font-bold text-[#191c1d]">
                Spending by Category
              </h2>
              <span className="text-[11px] text-[#747878] block mt-0.5">
                Expense distribution &amp; budget allocation
              </span>
            </div>
            <Link href="/expenses" className="text-xs font-semibold text-[#855e2e] hover:underline">
              Manage
            </Link>
          </div>

          {/* Expense Category Progress Bars */}
          <div className="space-y-4 pt-3">
            {data.expenseCategoryBreakdown && data.expenseCategoryBreakdown.length > 0 ? (
              data.expenseCategoryBreakdown.map(cat => {
                const config = EXPENSE_CATEGORY_CONFIG[cat.category as ExpenseCategory];
                const color = config ? config.color : THEME_PALETTE.bronze.color;
                return (
                  <div key={cat.category} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-[#191c1d]">{cat.label}</span>
                      <span className="font-mono text-[11px] text-[#747878]">
                        {formatMoney(cat.amount)}{" "}
                        <span className="text-[#a19d97]">({cat.percentage}%)</span>
                      </span>
                    </div>
                    <div className="w-full bg-[#f4f0e8] rounded-full h-1.5 overflow-hidden">
                      <div
                        style={{
                          width: `${cat.percentage}%`,
                          backgroundColor: color,
                        }}
                        className="h-full rounded-full transition-all duration-500"
                      />
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-8 text-xs text-[#8c827a]">
                No recorded expense categories found.
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
