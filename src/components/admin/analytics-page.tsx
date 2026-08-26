"use client";

import { Check, Copy, ExternalLink, Eye, Globe, ShoppingBag, Users } from "lucide-react";
import { useEffect, useState } from "react";
import {
  type AnalyticsOverview,
  getAnalytics,
  getBusinessProfile,
  type Timeframe,
} from "@/lib/api";
import { businessProfile as initialMockProfile } from "@/lib/mock-data";
import { formatMoney } from "./admin-layout";

export function AnalyticsPage({ onToast }: { onToast: (message: string) => void }) {
  const [timeframe, setTimeframe] = useState<Timeframe>("monthly");
  const [data, setData] = useState<AnalyticsOverview | null>(null);
  const [slug, setSlug] = useState(initialMockProfile.slug || "elan-events");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    getBusinessProfile().then(profile => {
      if (profile.slug) setSlug(profile.slug);
    });
  }, []);

  // Fetch telemetry from domain service (ready for backend API swap)
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
      onToast("Public studio URL copied to clipboard!");
    }
  };

  if (!data) {
    return (
      <section className="content max-w-6xl mx-auto py-12 flex justify-center items-center">
        <div className="text-xs text-[#8c827a] font-medium animate-pulse">
          Loading studio telemetry...
        </div>
      </section>
    );
  }

  return (
    <section className="content max-w-6xl mx-auto space-y-7 pb-16">
      {/* Top Header matching inspiration warm styling */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 pb-2">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#1f1d1a] tracking-tight">
            Welcome to Élan Atelier
          </h1>
          <p className="text-xs text-[#8c827a] mt-0.5 font-medium">
            Studio Performance & Overview Analytics
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

      {/* 3 Top Metric Cards in exact style of inspiration image */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Card 1: Profile Views */}
        <div className="bg-white border border-[#eee7dc] rounded-3xl p-6 shadow-[0_4px_24px_rgba(70,50,30,0.03)] flex flex-col justify-between space-y-4 hover:border-[#c59a78] transition-all">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-[#faf5ee] border border-[#f0e4d4] flex items-center justify-center shrink-0 text-[#a06840]">
              <Eye size={18} />
            </div>
            <div>
              <span className="text-xs font-semibold text-[#665e57] block">Profile Views</span>
              <span
                className={`text-[11px] font-bold block mt-0.5 ${
                  data.views.isPositive ? "text-[#16a34a]" : "text-[#dc2626]"
                }`}
              >
                {data.views.change}
              </span>
            </div>
          </div>

          <div>
            <div className="text-2xl sm:text-3xl font-serif font-bold text-[#1f1d1a] tracking-tight">
              {data.views.value}
            </div>

            {/* Custom Track Bar matching Inspo */}
            <div className="w-full bg-[#f2ede4] rounded-full h-1.5 mt-3 overflow-hidden">
              <div
                style={{ width: `${data.views.progressPercent}%` }}
                className="bg-[#9e633d] h-full rounded-full transition-all duration-700"
              />
            </div>
          </div>
        </div>

        {/* Card 2: New Inquiries / Leads */}
        <div className="bg-white border border-[#eee7dc] rounded-3xl p-6 shadow-[0_4px_24px_rgba(70,50,30,0.03)] flex flex-col justify-between space-y-4 hover:border-[#c59a78] transition-all">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-[#faf5ee] border border-[#f0e4d4] flex items-center justify-center shrink-0 text-[#a06840]">
              <Users size={18} />
            </div>
            <div>
              <span className="text-xs font-semibold text-[#665e57] block">New Inquiries</span>
              <span
                className={`text-[11px] font-bold block mt-0.5 ${
                  data.leads.isPositive ? "text-[#16a34a]" : "text-[#dc2626]"
                }`}
              >
                {data.leads.change}
              </span>
            </div>
          </div>

          <div>
            <div className="text-2xl sm:text-3xl font-serif font-bold text-[#1f1d1a] tracking-tight">
              {data.leads.value}
            </div>

            {/* Custom Track Bar */}
            <div className="w-full bg-[#f2ede4] rounded-full h-1.5 mt-3 overflow-hidden">
              <div
                style={{ width: `${data.leads.progressPercent}%` }}
                className="bg-[#9e633d] h-full rounded-full transition-all duration-700"
              />
            </div>
          </div>
        </div>

        {/* Card 3: Total Sales / Revenue */}
        <div className="bg-white border border-[#eee7dc] rounded-3xl p-6 shadow-[0_4px_24px_rgba(70,50,30,0.03)] flex flex-col justify-between space-y-4 hover:border-[#c59a78] transition-all">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-[#faf5ee] border border-[#f0e4d4] flex items-center justify-center shrink-0 text-[#a06840]">
              <ShoppingBag size={18} />
            </div>
            <div>
              <span className="text-xs font-semibold text-[#665e57] block">Total Sales</span>
              <span
                className={`text-[11px] font-bold block mt-0.5 ${
                  data.revenue.isPositive ? "text-[#16a34a]" : "text-[#dc2626]"
                }`}
              >
                {data.revenue.change}
              </span>
            </div>
          </div>

          <div>
            <div className="text-2xl sm:text-3xl font-serif font-bold text-[#1f1d1a] tracking-tight">
              {formatMoney(data.revenue.rawNumber)}
            </div>

            {/* Custom Track Bar */}
            <div className="w-full bg-[#f2ede4] rounded-full h-1.5 mt-3 overflow-hidden">
              <div
                style={{ width: `${data.revenue.progressPercent}%` }}
                className="bg-[#9e633d] h-full rounded-full transition-all duration-700"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Bottom Section: Sales Analytics Curve Chart + Trending Services */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (7 cols): Curved Area Spline Chart */}
        <div className="lg:col-span-7 bg-white border border-[#eee7dc] rounded-3xl p-6 sm:p-7 shadow-[0_4px_24px_rgba(70,50,30,0.03)] flex flex-col justify-between">
          <div className="flex items-center justify-between pb-4">
            <h2 className="text-base sm:text-lg font-serif font-bold text-[#1f1d1a]">
              Sales & Traffic Analytics
            </h2>
            <button
              type="button"
              onClick={() => onToast("Detailed telemetry report generated.")}
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
                  {/* Warm Gradient matching inspiration */}
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
                  {/* Outer circle */}
                  <circle
                    cx={data.chart.peakCoord.cx}
                    cy={data.chart.peakCoord.cy}
                    r="5"
                    fill="#c57f50"
                    stroke="#ffffff"
                    strokeWidth="2"
                  />
                  {/* Tooltip callout pill */}
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

        {/* Right Column (5 cols): Trending Services List */}
        <div className="lg:col-span-5 bg-white border border-[#eee7dc] rounded-3xl p-6 sm:p-7 shadow-[0_4px_24px_rgba(70,50,30,0.03)] flex flex-col justify-between">
          <div className="flex items-center justify-between pb-4 border-b border-[#f4eee6]">
            <h2 className="text-base sm:text-lg font-serif font-bold text-[#1f1d1a]">
              Trending Offerings
            </h2>
            <button
              type="button"
              onClick={() => onToast("Viewing all catalog items.")}
              className="text-xs font-semibold text-[#a06840] hover:text-[#6d3e1e] transition-colors cursor-pointer"
            >
              See all
            </button>
          </div>

          {/* List items matching the Inspo layout */}
          <div className="space-y-4 pt-3">
            {data.trendingServices.map(service => (
              <div
                key={service.name}
                className="flex items-center justify-between gap-3 group hover:bg-[#faf7f2] p-2 rounded-2xl transition-all cursor-pointer"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-11 h-11 rounded-2xl overflow-hidden bg-[#faf5ee] border border-[#eee3d5] shrink-0">
                    <img
                      src={service.image}
                      alt={service.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <div className="min-w-0">
                    <b className="text-xs font-bold text-[#1f1d1a] block truncate leading-tight">
                      {service.name}
                    </b>
                    <span className="text-[11px] text-[#8c827a] font-medium block mt-0.5">
                      {formatMoney(service.price)}
                    </span>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-xs font-mono font-bold text-[#1f1d1a] block">
                    {service.volume}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
