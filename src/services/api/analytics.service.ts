/**
 * Analytics Domain Service
 * Encapsulates studio overview metrics, telemetry trends, and revenue rollups.
 * Designed for effortless 1-line swap to real REST/GraphQL endpoints.
 */

import type {
  AnalyticsOverview,
  ChartData,
  MetricSummary,
  Timeframe,
  TrendingServiceItem,
} from "@/types";

export type { AnalyticsOverview, ChartData, MetricSummary, Timeframe, TrendingServiceItem };

const ANALYTICS_DATA: Record<Timeframe, AnalyticsOverview> = {
  daily: {
    timeframe: "daily",
    timeframeLabel: "Today",
    views: {
      value: "428",
      rawNumber: 428,
      change: "+18.40%",
      isPositive: true,
      progressPercent: 74,
    },
    leads: {
      value: "3",
      rawNumber: 3,
      change: "+50.00%",
      isPositive: true,
      progressPercent: 60,
    },
    revenue: {
      value: "₦62,000",
      rawNumber: 62000,
      change: "-2.33%",
      isPositive: false,
      progressPercent: 48,
    },
    chart: {
      peakValue: "230",
      peakCoord: { cx: 480, cy: 52 },
      linePath:
        "M 40 210 C 90 190, 120 150, 160 150 C 200 150, 230 195, 270 185 C 320 170, 360 85, 410 75 C 450 65, 465 52, 480 52 C 505 52, 530 175, 570 190 C 620 210, 660 120, 710 110 C 740 105, 770 135, 800 125",
      areaPath:
        "M 40 210 C 90 190, 120 150, 160 150 C 200 150, 230 195, 270 185 C 320 170, 360 85, 410 75 C 450 65, 465 52, 480 52 C 505 52, 530 175, 570 190 C 620 210, 660 120, 710 110 C 740 105, 770 135, 800 125 L 800 240 L 40 240 Z",
      xLabels: ["09:00 AM", "12:00 PM", "04:00 PM", "08:00 PM", "12:00 PM"],
      yLabels: ["250", "200", "150", "100", "50", "0"],
    },
    trendingServices: [
      {
        name: "Full Wedding Production",
        category: "Bespoke Styling",
        price: 96000,
        volume: 240,
        image:
          "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=160&q=80",
      },
      {
        name: "Private Gala & Dining",
        category: "Corporate & VIP",
        price: 74000,
        volume: 220,
        image:
          "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=160&q=80",
      },
      {
        name: "Floral Architecture",
        category: "Scenography",
        price: 28000,
        volume: 200,
        image:
          "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?auto=format&fit=crop&w=160&q=80",
      },
      {
        name: "Editorial Brand Launch",
        category: "Hospitality Gala",
        price: 45000,
        volume: 100,
        image:
          "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=160&q=80",
      },
      {
        name: "Private Soirée Curations",
        category: "Intimate Dinner",
        price: 18500,
        volume: 100,
        image:
          "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=160&q=80",
      },
    ],
  },
  monthly: {
    timeframe: "monthly",
    timeframeLabel: "This Month",
    views: {
      value: "21,375",
      rawNumber: 21375,
      change: "-2.33%",
      isPositive: false,
      progressPercent: 68,
    },
    leads: {
      value: "1,012",
      rawNumber: 1012,
      change: "+32.40%",
      isPositive: true,
      progressPercent: 78,
    },
    revenue: {
      value: "₦198,254",
      rawNumber: 198254,
      change: "+25.00%",
      isPositive: true,
      progressPercent: 84,
    },
    chart: {
      peakValue: "230",
      peakCoord: { cx: 480, cy: 52 },
      linePath:
        "M 40 205 C 90 185, 120 148, 160 148 C 200 148, 230 195, 270 185 C 320 170, 360 85, 410 75 C 450 65, 465 52, 480 52 C 505 52, 530 175, 570 190 C 620 210, 660 120, 710 110 C 740 105, 770 135, 800 125",
      areaPath:
        "M 40 205 C 90 185, 120 148, 160 148 C 200 148, 230 195, 270 185 C 320 170, 360 85, 410 75 C 450 65, 465 52, 480 52 C 505 52, 530 175, 570 190 C 620 210, 660 120, 710 110 C 740 105, 770 135, 800 125 L 800 240 L 40 240 Z",
      xLabels: ["Week 1", "Week 2", "Week 3", "Week 4", "Month Close"],
      yLabels: ["250k", "200k", "150k", "100k", "50k", "0"],
    },
    trendingServices: [
      {
        name: "Full Wedding Production",
        category: "Bespoke Styling",
        price: 96000,
        volume: 240,
        image:
          "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=160&q=80",
      },
      {
        name: "Private Gala & Dining",
        category: "Corporate & VIP",
        price: 74000,
        volume: 220,
        image:
          "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=160&q=80",
      },
      {
        name: "Floral Architecture",
        category: "Scenography",
        price: 28000,
        volume: 200,
        image:
          "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?auto=format&fit=crop&w=160&q=80",
      },
      {
        name: "Editorial Brand Launch",
        category: "Hospitality Gala",
        price: 45000,
        volume: 100,
        image:
          "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=160&q=80",
      },
      {
        name: "Private Soirée Curations",
        category: "Intimate Dinner",
        price: 18500,
        volume: 100,
        image:
          "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=160&q=80",
      },
    ],
  },
  yearly: {
    timeframe: "yearly",
    timeframeLabel: "Annual 2026",
    views: {
      value: "186,400",
      rawNumber: 186400,
      change: "+62.10%",
      isPositive: true,
      progressPercent: 90,
    },
    leads: {
      value: "4,210",
      rawNumber: 4210,
      change: "+48.20%",
      isPositive: true,
      progressPercent: 82,
    },
    revenue: {
      value: "₦1,420,000",
      rawNumber: 1420000,
      change: "+45.20%",
      isPositive: true,
      progressPercent: 94,
    },
    chart: {
      peakValue: "420k",
      peakCoord: { cx: 480, cy: 45 },
      linePath:
        "M 40 195 C 90 170, 120 135, 160 135 C 200 135, 230 180, 270 170 C 320 155, 360 75, 410 65 C 450 55, 465 45, 480 45 C 505 45, 530 160, 570 175 C 620 195, 660 105, 710 95 C 740 90, 770 120, 800 110",
      areaPath:
        "M 40 195 C 90 170, 120 135, 160 135 C 200 135, 230 180, 270 170 C 320 155, 360 75, 410 65 C 450 55, 465 45, 480 45 C 505 45, 530 160, 570 175 C 620 195, 660 105, 710 95 C 740 90, 770 120, 800 110 L 800 240 L 40 240 Z",
      xLabels: ["Q1", "Q2", "Q3", "Q4", "Year End"],
      yLabels: ["1.5M", "1.2M", "900k", "600k", "300k", "0"],
    },
    trendingServices: [
      {
        name: "Full Wedding Production",
        category: "Bespoke Styling",
        price: 96000,
        volume: 480,
        image:
          "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=160&q=80",
      },
      {
        name: "Private Gala & Dining",
        category: "Corporate & VIP",
        price: 74000,
        volume: 390,
        image:
          "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=160&q=80",
      },
      {
        name: "Floral Architecture",
        category: "Scenography",
        price: 28000,
        volume: 310,
        image:
          "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?auto=format&fit=crop&w=160&q=80",
      },
      {
        name: "Editorial Brand Launch",
        category: "Hospitality Gala",
        price: 45000,
        volume: 190,
        image:
          "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=160&q=80",
      },
      {
        name: "Private Soirée Curations",
        category: "Intimate Dinner",
        price: 18500,
        volume: 160,
        image:
          "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=160&q=80",
      },
    ],
  },
};

const delay = (ms = 100) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Fetch Studio Overview & Telemetry Analytics
 * When connecting to real backend, swap with:
 * `const res = await fetch(`/api/analytics?timeframe=${timeframe}`); return res.json();`
 */
export async function getAnalytics(timeframe: Timeframe = "monthly"): Promise<AnalyticsOverview> {
  await delay(120);
  return ANALYTICS_DATA[timeframe] || ANALYTICS_DATA.monthly;
}
