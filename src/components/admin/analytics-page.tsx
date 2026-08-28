"use client";

import {
  ArrowDownRight,
  ArrowUpRight,
  Check,
  Copy,
  ExternalLink,
  Eye,
  Globe,
  PieChart,
  Receipt,
  ShoppingBag,
  TrendingUp,
  Users,
  Wallet,
} from "lucide-react";
import { useEffect, useState } from "react";
import { APP_CONFIG } from "@/constants";
import { getAnalytics, getBusinessProfile } from "@/lib/api";
import { businessProfile as initialMockProfile } from "@/lib/mock-data";
import type { AnalyticsOverview, AnalyticsPageProps, Timeframe } from "@/types";
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
      notify("Public studio URL copied to clipboard!");
    }
  };

  if (!data) {
    return (
      <section className="content max-w-6xl mx-auto py-12 flex justify-center items-center">
        <div className="text-xs text-[#8c827a] font-medium animate-pulse">
          Loading studio telemetry & financial records...
        </div>
      </section>
    );
  }

  return (
    <section className="content max-w-6xl mx-auto space-y-7 pb-16">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 pb-2">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#1f1d1a] tracking-tight">
            Welcome to Élan Atelier
          </h1>
          <p className="text-xs text-[#8c827a] mt-0.5 font-medium">
            Financial Health, Records & Studio Overview
          </p>
        </div>

        {/* Timeframe Filter Switch */}
        <div className="flex items-center gap-3">
          <div className="bg-[#f0ebe3] p-1 rounded-2xl flex items-center border border-[#e2dad0] shadow-2xs">
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
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  timeframe === key
                    ? "bg-white text-[#2a1d15] shadow-xs"
                    : "text-[#7d746d] hover:text-[#2a1d15]"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions Bar */}
      <div className="bg-[#fbf9f5] border border-[#eee7dc] rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-2xs">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-white border border-[#e5ded3] flex items-center justify-center shrink-0 shadow-2xs text-[#9e633d]">
            <Globe size={18} />
          </div>
          <div className="min-w-0">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#9e633d] block">
              Public Atelier URL
            </span>
            <span className="text-xs text-[#524a43] font-mono block truncate max-w-xs sm:max-w-md">
              {publicUrl}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto shrink-0">
          <button
            type="button"
            onClick={copyUrl}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 bg-white hover:bg-[#f8f4ed] text-[#2a1d15] border border-[#ded5c8] hover:border-[#c59a78] px-4 py-2 rounded-xl text-xs font-semibold hover:-translate-y-0.5 hover:shadow-xs active:translate-y-0 transition-all duration-200 cursor-pointer"
          >
            {copied ? (
              <>
                <Check size={13} className="text-[#10b981]" />
                <span className="text-[#10b981]">Copied!</span>
              </>
            ) : (
              <Copy size={13} />
            )}
          </button>
          <a
            href={`/${slug}?from=analytics`}
            target="_blank"
            rel="noreferrer"
            className="group flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 bg-[#191c1d] hover:bg-[#000000] !text-white px-4 py-2 rounded-xl text-xs font-semibold hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 transition-all duration-200 cursor-pointer"
          >
            <span>View Live</span>
            <ExternalLink
              size={13}
              className="text-white transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </a>
        </div>
      </div>

      {/* 5 Financial & Growth Metric Cards (Responsive 5-column layout) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Card 1: Total Gross Sales (Inflow) */}
        <div className="bg-white border border-[#eee7dc] rounded-2xl p-5 shadow-[0_2px_12px_rgba(70,50,30,0.02)] flex flex-col justify-between space-y-4 hover:border-[#c59a78]/60 hover:shadow-md transition-all">
          <div className="flex items-center justify-between gap-2">
            <div className="w-9 h-9 rounded-xl bg-[#faf5ee] border border-[#f0e4d4] flex items-center justify-center shrink-0 text-[#a06840]">
              <ShoppingBag size={17} />
            </div>
            <span
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold border ${
                data.revenue.isPositive
                  ? "bg-[#ecfdf5] text-[#059669] border-[#a7f3d0]"
                  : "bg-[#fef2f2] text-[#dc2626] border-[#fecaca]"
              }`}
            >
              {data.revenue.isPositive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
              {data.revenue.change}
            </span>
          </div>

          <div>
            <span className="text-xs font-medium text-[#8c827a] block">Gross Sales (Inflow)</span>
            <div className="text-2xl font-bold tracking-tight text-[#1f1d1a] font-sans tabular-nums mt-0.5">
              {formatMoney(data.revenue.rawNumber)}
            </div>
          </div>
        </div>

        {/* Card 2: Total Operating Expenses (Outflow) */}
        <div className="bg-white border border-[#eee7dc] rounded-2xl p-5 shadow-[0_2px_12px_rgba(70,50,30,0.02)] flex flex-col justify-between space-y-4 hover:border-[#c59a78]/60 hover:shadow-md transition-all">
          <div className="flex items-center justify-between gap-2">
            <div className="w-9 h-9 rounded-xl bg-[#fef2f2] border border-[#fee2e2] flex items-center justify-center shrink-0 text-[#b91c1c]">
              <Receipt size={17} />
            </div>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-[#fef2f2] text-[#b91c1c] border border-[#fecaca]">
              <ArrowDownRight size={12} />
              {data.expenses?.change || "Outflow"}
            </span>
          </div>

          <div>
            <span className="text-xs font-medium text-[#8c827a] block">Operating Expenses</span>
            <div className="text-2xl font-bold tracking-tight text-[#1f1d1a] font-sans tabular-nums mt-0.5">
              {data.expenses ? formatMoney(data.expenses.rawNumber) : "₦0"}
            </div>
          </div>
        </div>

        {/* Card 3: Real Net Profit (Take-Home - Highlight Card) */}
        <div className="bg-gradient-to-b from-[#f0fdf4]/80 via-white to-white border-2 border-[#10b981]/50 rounded-2xl p-5 shadow-[0_4px_16px_rgba(16,185,129,0.08)] flex flex-col justify-between space-y-4 hover:border-[#10b981] hover:shadow-lg transition-all relative overflow-hidden">
          <div className="flex items-center justify-between gap-2">
            <div className="w-9 h-9 rounded-xl bg-[#dcfce7] border border-[#bbf7d0] flex items-center justify-center shrink-0 text-[#15803d]">
              <Wallet size={17} />
            </div>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-[#dcfce7] text-[#15803d] border border-[#86efac]">
              <TrendingUp size={12} />
              {data.netProfit?.change || "45% margin"}
            </span>
          </div>

          <div>
            <span className="text-xs font-semibold text-[#15803d] block">Real Net Profit</span>
            <div className="text-2xl font-bold tracking-tight text-[#15803d] font-sans tabular-nums mt-0.5">
              {data.netProfit ? formatMoney(data.netProfit.rawNumber) : "₦0"}
            </div>
          </div>
        </div>

        {/* Card 4: New Inquiries */}
        <div className="bg-white border border-[#eee7dc] rounded-2xl p-5 shadow-[0_2px_12px_rgba(70,50,30,0.02)] flex flex-col justify-between space-y-4 hover:border-[#c59a78]/60 hover:shadow-md transition-all">
          <div className="flex items-center justify-between gap-2">
            <div className="w-9 h-9 rounded-xl bg-[#faf5ee] border border-[#f0e4d4] flex items-center justify-center shrink-0 text-[#a06840]">
              <Users size={17} />
            </div>
            <span
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold border ${
                data.leads.isPositive
                  ? "bg-[#ecfdf5] text-[#059669] border-[#a7f3d0]"
                  : "bg-[#fef2f2] text-[#dc2626] border-[#fecaca]"
              }`}
            >
              {data.leads.isPositive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
              {data.leads.change}
            </span>
          </div>

          <div>
            <span className="text-xs font-medium text-[#8c827a] block">New Inquiries</span>
            <div className="text-2xl font-bold tracking-tight text-[#1f1d1a] font-sans tabular-nums mt-0.5">
              {data.leads.value}
            </div>
          </div>
        </div>

        {/* Card 5: Profile Views */}
        <div className="bg-white border border-[#eee7dc] rounded-2xl p-5 shadow-[0_2px_12px_rgba(70,50,30,0.02)] flex flex-col justify-between space-y-4 hover:border-[#c59a78]/60 hover:shadow-md transition-all">
          <div className="flex items-center justify-between gap-2">
            <div className="w-9 h-9 rounded-xl bg-[#faf5ee] border border-[#f0e4d4] flex items-center justify-center shrink-0 text-[#a06840]">
              <Eye size={17} />
            </div>
            <span
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold border ${
                data.views.isPositive
                  ? "bg-[#ecfdf5] text-[#059669] border-[#a7f3d0]"
                  : "bg-[#fef2f2] text-[#dc2626] border-[#fecaca]"
              }`}
            >
              {data.views.isPositive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
              {data.views.change}
            </span>
          </div>

          <div>
            <span className="text-xs font-medium text-[#8c827a] block">Storefront Views</span>
            <div className="text-2xl font-bold tracking-tight text-[#1f1d1a] font-sans tabular-nums mt-0.5">
              {data.views.value}
            </div>
          </div>
        </div>
      </div>

      {/* Main Section: Sales Curve Chart + Expense Category Breakdown / Trending Offerings */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (7 cols): Curved Area Spline Chart */}
        <div className="lg:col-span-7 bg-white border border-[#eee7dc] rounded-3xl p-6 sm:p-7 shadow-[0_4px_24px_rgba(70,50,30,0.03)] flex flex-col justify-between">
          <div className="flex items-center justify-between pb-4">
            <h2 className="text-base sm:text-lg font-serif font-bold text-[#1f1d1a]">
              Sales & Cashflow Telemetry
            </h2>
            <button
              type="button"
              onClick={() => notify("Detailed telemetry report generated.")}
              className="text-xs font-semibold text-[#a06840] hover:text-[#6d3e1e] transition-colors cursor-pointer"
            >
              See all
            </button>
          </div>

          {/* SVG Smooth Curve Area Chart */}
          <div className="relative w-full overflow-x-auto pt-4 pb-2">
            <div className="min-w-[480px]">
              <svg viewBox="0 0 840 260" className="w-full h-56 overflow-visible">
                <defs>
                  <linearGradient id="curveGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#e5a97f" stopOpacity="0.55" />
                    <stop offset="70%" stopColor="#faede2" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#ffffff" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Horizontal Dotted Grid Lines */}
                {[40, 80, 120, 160, 200, 240].map((y, idx) => (
                  <g key={y}>
                    <text
                      x="0"
                      y={y + 4}
                      fill="#9a918a"
                      fontSize="11"
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
                      stroke="#f0ece5"
                      strokeDasharray="4 4"
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
                  stroke="#c57f50"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />

                {/* Peak Indicator Callout Pill */}
                <g>
                  <circle
                    cx={data.chart.peakCoord.cx}
                    cy={data.chart.peakCoord.cy}
                    r="5"
                    fill="#c57f50"
                    stroke="#ffffff"
                    strokeWidth="2"
                  />
                  <rect
                    x={data.chart.peakCoord.cx - 24}
                    y={data.chart.peakCoord.cy - 34}
                    width="48"
                    height="24"
                    rx="6"
                    fill="#e59f71"
                    className="shadow-md"
                  />
                  <text
                    x={data.chart.peakCoord.cx}
                    y={data.chart.peakCoord.cy - 18}
                    textAnchor="middle"
                    fill="#ffffff"
                    fontSize="11"
                    fontWeight="700"
                    fontFamily="sans-serif"
                  >
                    {data.chart.peakValue}
                  </text>
                </g>
              </svg>

              {/* X-Axis Labels */}
              <div className="flex justify-between pl-8 pr-4 pt-2 text-[11px] font-medium text-[#9a918a]">
                {data.chart.xLabels.map(lbl => (
                  <span key={lbl}>{lbl}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (5 cols): Expense Category Breakdown */}
        <div className="lg:col-span-5 bg-white border border-[#eee7dc] rounded-3xl p-6 sm:p-7 shadow-[0_4px_24px_rgba(70,50,30,0.03)] flex flex-col justify-between">
          <div className="flex items-center justify-between pb-4 border-b border-[#f4eee6]">
            <h2 className="text-base sm:text-lg font-serif font-bold text-[#1f1d1a] flex items-center gap-2">
              <PieChart size={16} className="text-[#9e633d]" /> Spending by Category
            </h2>
            <a
              href="/expenses"
              className="text-xs font-semibold text-[#a06840] hover:text-[#6d3e1e] transition-colors cursor-pointer"
            >
              Manage
            </a>
          </div>

          {/* Expense Category Bars */}
          <div className="space-y-3.5 pt-3">
            {data.expenseCategoryBreakdown && data.expenseCategoryBreakdown.length > 0 ? (
              data.expenseCategoryBreakdown.map(cat => (
                <div key={cat.category} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-[#1f1d1a]">{cat.label}</span>
                    <span className="font-mono text-[#665e57]">
                      {formatMoney(cat.amount)} ({cat.percentage}%)
                    </span>
                  </div>
                  <div className="w-full bg-[#f2ede4] rounded-full h-2 overflow-hidden">
                    <div
                      style={{
                        width: `${cat.percentage}%`,
                        backgroundColor: cat.color,
                      }}
                      className="h-full rounded-full transition-all duration-500"
                    />
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-6 text-xs text-[#8c827a]">
                No expense category records found.
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
