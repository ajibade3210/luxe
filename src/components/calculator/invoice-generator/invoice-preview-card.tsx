"use client";

import type { InvoicePreviewCardProps } from "@/types";
import { formatMoney } from "@/utils/currency";

export function InvoicePreviewCard({ invoice, totals, cardRef }: InvoicePreviewCardProps) {
  const currency = invoice.currency || "USD";

  return (
    <div
      ref={cardRef}
      id="invoice-printable-card"
      className="bg-white border border-[#eee7dc] rounded-3xl p-6 sm:p-8 shadow-sm space-y-7 text-[#1f1d1a] relative overflow-hidden"
    >
      {/* Top Header: Business Logo/Name & Invoice Meta */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 border-b border-[#f3eee6] pb-6">
        <div className="space-y-3">
          {invoice.senderLogo ? (
            <div className="w-14 h-14 rounded-2xl overflow-hidden border border-[#eee7dc] bg-[#faf7f2] flex items-center justify-center">
              <img
                src={invoice.senderLogo}
                alt={invoice.senderName || "Studio Logo"}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="w-12 h-12 rounded-2xl bg-[#191c1d] text-white flex items-center justify-center font-serif font-bold text-xl shadow-xs">
              {invoice.senderName ? invoice.senderName.charAt(0).toUpperCase() : "S"}
            </div>
          )}

          <div>
            <h1 className="font-serif font-bold text-lg sm:text-xl text-[#1f1d1a] tracking-tight">
              {invoice.senderName || "Your Studio Name"}
            </h1>
            {invoice.senderAddress && (
              <p className="text-xs text-[#665e57] whitespace-pre-line mt-1">
                {invoice.senderAddress}
              </p>
            )}
            {invoice.senderEmail && (
              <p className="text-xs text-[#665e57] mt-0.5">{invoice.senderEmail}</p>
            )}
            {invoice.senderTaxId && (
              <p className="text-[11px] text-[#8c827a] mt-0.5">Tax ID: {invoice.senderTaxId}</p>
            )}
          </div>
        </div>

        {/* Invoice Title & Number */}
        <div className="text-left sm:text-right space-y-1">
          <span className="text-[11px] font-bold text-[#855e2e] uppercase tracking-wider block">
            Official Invoice
          </span>
          <p className="font-mono font-bold text-base sm:text-lg text-[#1f1d1a]">
            {invoice.invoiceNumber || "INV-001"}
          </p>
          <div className="pt-2 space-y-0.5 text-xs text-[#665e57]">
            <p>
              <span className="text-[#8c827a]">Issue Date:</span>{" "}
              <span className="font-medium text-[#1f1d1a]">{invoice.issueDate || "—"}</span>
            </p>
            <p>
              <span className="text-[#8c827a]">Due Date:</span>{" "}
              <span className="font-medium text-[#1f1d1a]">{invoice.dueDate || "—"}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Billed To Section */}
      <div className="space-y-1.5">
        <span className="text-[10px] font-bold text-[#8c827a] uppercase tracking-wider block">
          Billed To
        </span>
        <p className="text-sm font-semibold text-[#1f1d1a]">
          {invoice.clientName || "Client Name"}
        </p>
        {invoice.clientEmail && <p className="text-xs text-[#665e57]">{invoice.clientEmail}</p>}
        {invoice.clientAddress && (
          <p className="text-xs text-[#665e57] whitespace-pre-line">{invoice.clientAddress}</p>
        )}
      </div>

      {/* Line Items Table */}
      <div className="border-t border-[#f3eee6] pt-4 space-y-3">
        {/* Table Header */}
        <div className="grid grid-cols-12 gap-2 text-[10px] font-bold text-[#8c827a] uppercase tracking-wider pb-2 border-b border-[#f3eee6]">
          <div className="col-span-6 sm:col-span-7">Description</div>
          <div className="col-span-2 text-center">Qty</div>
          <div className="col-span-2 text-right">Rate</div>
          <div className="col-span-2 sm:col-span-1 text-right">Total</div>
        </div>

        {/* Rows */}
        <div className="divide-y divide-[#faf7f2] space-y-1">
          {invoice.items.map((item, idx) => (
            <div
              key={item.id || idx}
              className="grid grid-cols-12 gap-2 py-2.5 text-xs items-center"
            >
              <div className="col-span-6 sm:col-span-7 font-medium text-[#1f1d1a]">
                {item.description || "Service deliverable"}
              </div>
              <div className="col-span-2 text-center text-[#665e57] font-mono">{item.quantity}</div>
              <div className="col-span-2 text-right text-[#665e57] font-mono">
                {formatMoney(Number(item.unitPrice || 0), currency)}
              </div>
              <div className="col-span-2 sm:col-span-1 text-right font-mono font-semibold text-[#1f1d1a]">
                {formatMoney(Number(item.total || 0), currency)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Financial Summary Calculation */}
      <div className="border-t border-[#f3eee6] pt-4 flex justify-end">
        <div className="w-full sm:w-64 space-y-2 text-xs">
          <div className="flex justify-between text-[#665e57]">
            <span>Subtotal</span>
            <span className="font-mono font-medium text-[#1f1d1a]">
              {formatMoney(totals.subtotal, currency)}
            </span>
          </div>

          {totals.discountAmount > 0 && (
            <div className="flex justify-between text-[#059669]">
              <span>
                Discount{" "}
                {invoice.discountType === "percentage" ? `(${invoice.discountValue}%)` : ""}
              </span>
              <span className="font-mono font-medium">
                -{formatMoney(totals.discountAmount, currency)}
              </span>
            </div>
          )}

          {totals.taxAmount > 0 && (
            <div className="flex justify-between text-[#665e57]">
              <span>Tax ({invoice.taxRate}%)</span>
              <span className="font-mono font-medium text-[#1f1d1a]">
                {formatMoney(totals.taxAmount, currency)}
              </span>
            </div>
          )}

          <div className="border-t border-[#eee7dc] pt-2.5 flex justify-between items-baseline font-bold">
            <span className="text-xs uppercase tracking-wider text-[#1f1d1a]">Total Due</span>
            <span className="font-mono text-base sm:text-lg text-[#1f1d1a]">
              {formatMoney(totals.total, currency)}
            </span>
          </div>
        </div>
      </div>

      {/* Notes & Instructions */}
      {(invoice.notes || invoice.terms) && (
        <div className="border-t border-[#f3eee6] pt-5 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          {invoice.notes && (
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-[#8c827a] uppercase tracking-wider block">
                Payment Instructions
              </span>
              <p className="text-[#665e57] whitespace-pre-line leading-relaxed">{invoice.notes}</p>
            </div>
          )}

          {invoice.terms && (
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-[#8c827a] uppercase tracking-wider block">
                Terms & Conditions
              </span>
              <p className="text-[#665e57] whitespace-pre-line leading-relaxed">{invoice.terms}</p>
            </div>
          )}
        </div>
      )}

      {/* Footer Branding (Viral PLG loop) */}
      <div className="border-t border-[#f3eee6] pt-4 text-center">
        <p className="text-[10px] text-[#998e82]">
          Created with <span className="font-semibold text-[#665e57]">Shopwus</span> — The operating
          platform for boutique studios & commerce (shopwus.com)
        </p>
      </div>
    </div>
  );
}
