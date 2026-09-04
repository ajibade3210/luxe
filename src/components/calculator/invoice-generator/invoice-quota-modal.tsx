"use client";

import { CheckCircle2, X } from "lucide-react";
import type { InvoiceQuotaModalProps } from "@/types";

export function InvoiceQuotaModal({
  isOpen,
  reason = "daily_exceeded",
  onClose,
}: InvoiceQuotaModalProps) {
  if (!isOpen) return null;

  const isDaily = reason === "daily_exceeded";
  const title = isDaily
    ? "You've reached today's free limit"
    : "You've reached this month's free limit";
  const subtitle = isDaily
    ? "Guests can create up to 3 invoices a day. Start your free trial to keep going with no limits."
    : "Guests can create up to 6 invoices a month. Start your free trial to keep going with no limits.";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-md bg-white rounded-2xl border border-[#eee7dc] shadow-2xl p-6 sm:p-7 space-y-5 overflow-hidden">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-[#8c827a] hover:text-[#1f1d1a] hover:bg-[#faf7f2] transition-colors"
          aria-label="Close modal"
        >
          <X size={18} />
        </button>

        {/* Headline & Context */}
        <div className="space-y-1.5 pr-6">
          <h2 className="font-serif font-bold text-xl text-[#1f1d1a] tracking-tight">{title}</h2>
          <p className="text-xs text-[#665e57] leading-relaxed">{subtitle}</p>
        </div>

        {/* Concise Benefits */}
        <div className="space-y-2.5 py-3 border-y border-[#f3eee6]">
          <div className="flex items-center gap-2.5 text-xs text-[#374151]">
            <CheckCircle2 size={15} className="text-[#059669] shrink-0" />
            <span>
              <strong>Unlimited invoices</strong> with no daily or monthly caps
            </span>
          </div>

          <div className="flex items-center gap-2.5 text-xs text-[#374151]">
            <CheckCircle2 size={15} className="text-[#059669] shrink-0" />
            <span>
              <strong>Online payment links</strong> so clients can pay you directly
            </span>
          </div>

          <div className="flex items-center gap-2.5 text-xs text-[#374151]">
            <CheckCircle2 size={15} className="text-[#059669] shrink-0" />
            <span>
              <strong>Saved client directory</strong> so you never retype info
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-2.5 pt-1">
          <a
            href="/signup?intent=invoice_quota"
            className="w-full inline-flex items-center justify-center px-4 py-3 rounded-xl bg-[#111827] hover:bg-black text-white text-xs sm:text-sm font-semibold transition-all shadow-xs hover:shadow-xs cursor-pointer"
          >
            <span>Start My Free Trial Now</span>
          </a>

          <div className="text-center">
            <button
              type="button"
              onClick={onClose}
              className="text-xs text-[#8c827a] hover:text-[#1f1d1a] transition-colors"
            >
              I like living dangerously with manual PDFs
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
