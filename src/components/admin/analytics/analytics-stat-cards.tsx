import { ArrowDownRight, ArrowUpRight, TrendingUp } from "lucide-react";
import type { AnalyticsStatCardsProps } from "@/types";
import { formatMoney } from "../admin-layout";

export function AnalyticsStatCards({ data }: AnalyticsStatCardsProps) {
  return (
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
              data.leads.isPositive ? "bg-[#ecfdf5] text-[#059669]" : "bg-[#fef2f2] text-[#dc2626]"
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
              data.views.isPositive ? "bg-[#ecfdf5] text-[#059669]" : "bg-[#fef2f2] text-[#dc2626]"
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
  );
}
