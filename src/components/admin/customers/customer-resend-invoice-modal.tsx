"use client";

import { RefreshCw, X } from "lucide-react";
import type { CustomerResendInvoiceModalProps } from "@/types";
import { formatMoney } from "@/utils";

export function CustomerResendInvoiceModal({
  invoice,
  onClose,
  onConfirm,
}: CustomerResendInvoiceModalProps) {
  if (!invoice) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white border border-[#eae3d7] rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl space-y-4 relative"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-start justify-between pb-3 border-b border-[#f0e8dc]">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#1e40af] block">
              Invoice Re-Dispatch
            </span>
            <h3 className="text-lg font-serif font-bold text-[#191c1d] tracking-tight mt-0.5">
              Resend Invoice {invoice.invoiceNumber}?
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-full text-[#8e9192] hover:text-[#191c1d] hover:bg-[#f3f4f5] transition-colors cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        <div className="text-xs text-[#5c5f60] space-y-2">
          <p>
            Are you sure you want to re-send this invoice to{" "}
            <b className="text-[#191c1d]">{invoice.customerName}</b>?
          </p>
          <div className="bg-[#faf8f5] p-3 rounded-xl border border-[#eee7dc] space-y-1">
            <div className="flex justify-between">
              <span className="text-[#8c827a]">Recipient:</span>
              <b className="text-[#191c1d]">{invoice.customerEmail}</b>
            </div>
            <div className="flex justify-between">
              <span className="text-[#8c827a]">Total Due:</span>
              <b className="font-mono text-[#191c1d]">{formatMoney(invoice.total)}</b>
            </div>
            <div className="flex justify-between">
              <span className="text-[#8c827a]">Due Date:</span>
              <span className="text-[#191c1d]">{invoice.dueDate}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#f0e8dc]">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-[#ded7cb] text-xs font-semibold text-[#5c5f60] hover:bg-[#faf8f5] transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={async () => {
              const success = await onConfirm(invoice.id);
              if (success) {
                onClose();
              }
            }}
            className="inline-flex items-center gap-1.5 bg-[#111827] hover:bg-black text-white px-5 py-2 rounded-xl text-xs font-semibold shadow-xs hover:-translate-y-0.5 transition-all cursor-pointer"
          >
            <RefreshCw size={13} />
            <span>Confirm Resend</span>
          </button>
        </div>
      </div>
    </div>
  );
}
