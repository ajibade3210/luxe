"use client";

import type { CurrencyCode } from "@/lib/types";
import { CURRENCY_SYMBOLS, formatMoney } from "@/utils";

interface InvoiceSummaryProps {
  discount: number;
  taxRate: number;
  total: number;
  currency: CurrencyCode;
  notes: string;
  onDiscountChange: (val: number) => void;
  onTaxRateChange: (val: number) => void;
  onNotesChange: (val: string) => void;
}

export function InvoiceSummary({
  discount,
  taxRate,
  total,
  currency,
  notes,
  onDiscountChange,
  onTaxRateChange,
  onNotesChange,
}: InvoiceSummaryProps) {
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-3 border-t border-[#f3f4f6]">
        <div>
          <label className="block text-[11px] font-bold text-[#374151] uppercase tracking-wider mb-1.5">
            Discount ({CURRENCY_SYMBOLS[currency]})
          </label>
          <input
            type="number"
            min="0"
            step="100"
            value={discount}
            onChange={e => onDiscountChange(Number(e.target.value) || 0)}
            className="w-full bg-white border border-[#d1d5db] rounded-xl px-3.5 py-2.5 text-xs text-[#111827] focus:border-[#111827] focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-[11px] font-bold text-[#374151] uppercase tracking-wider mb-1.5">
            Tax Rate (%)
          </label>
          <input
            type="number"
            min="0"
            max="100"
            step="0.5"
            value={taxRate}
            onChange={e => onTaxRateChange(Number(e.target.value) || 0)}
            className="w-full bg-white border border-[#d1d5db] rounded-xl px-3.5 py-2.5 text-xs text-[#111827] focus:border-[#111827] focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-[11px] font-bold text-[#374151] uppercase tracking-wider mb-1.5">
            Total Due
          </label>
          <div className="w-full bg-[#f3f4f6] border border-[#e5e7eb] rounded-xl px-3.5 py-2.5 text-xs font-mono font-bold text-[#111827]">
            {formatMoney(total, currency)}
          </div>
        </div>
      </div>

      <div className="pt-2">
        <label className="block text-[11px] font-bold text-[#374151] uppercase tracking-wider mb-1.5">
          Notes to Customer *
        </label>
        <textarea
          rows={3}
          value={notes}
          onChange={e => onNotesChange(e.target.value)}
          placeholder="Thank you for your trust. Please complete the payment before the due date."
          className="w-full bg-white border border-[#d1d5db] rounded-xl p-3.5 text-xs text-[#111827] focus:border-[#111827] focus:outline-none transition-all"
        />
      </div>
    </>
  );
}
