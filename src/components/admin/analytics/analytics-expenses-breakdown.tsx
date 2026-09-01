import Link from "next/link";
import { EXPENSE_CATEGORY_CONFIG, THEME_PALETTE } from "@/constants";
import type { AnalyticsExpensesBreakdownProps, ExpenseCategory } from "@/types";
import { formatMoney } from "../admin-layout";

export function AnalyticsExpensesBreakdown({ data }: AnalyticsExpensesBreakdownProps) {
  return (
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
  );
}
