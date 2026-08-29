"use client";

import { PAYMENT_TERMS_OPTIONS } from "@/hooks/use-invoice-form";
import type { CurrencyCode, InvoiceFormFieldsProps, PaymentTerms } from "@/types";
import { InvoiceItemsTable } from "./invoice-items-table";
import { InvoiceSummary } from "./invoice-summary";

export function InvoiceFormFields({
  customerId,
  customerName,
  customerEmail,
  billingAddress,
  issueDate,
  dueDate,
  paymentTerms,
  currency,
  items,
  discount,
  taxRate,
  total,
  notes,
  allCustomers,
  setCustomerName,
  setBillingAddress,
  setIssueDate,
  setDueDate,
  setPaymentTerms,
  setCurrency,
  setDiscount,
  setTaxRate,
  setNotes,
  handleCustomerChange,
  handleItemChange,
  handleAddItem,
  handleRemoveItem,
}: InvoiceFormFieldsProps) {
  return (
    <div className="bg-white border border-[#e5e7eb] rounded-3xl p-6 sm:p-7 shadow-xs space-y-5">
      <h2 className="text-sm font-serif font-bold text-[#111827] uppercase tracking-wider border-b border-[#f3f4f6] pb-3">
        Invoice Details
      </h2>

      <div>
        <label className="block text-[11px] font-bold text-[#374151] uppercase tracking-wider mb-1.5">
          Customer *
        </label>
        {customerName ? (
          <div className="w-full bg-[#f9fafb] border border-[#e5e7eb] rounded-xl px-4 py-2.5 text-xs text-[#111827]">
            <span className="font-semibold text-[#111827]">{customerName}</span>
            {customerEmail && (
              <span className="text-[#6b7280] text-[11px] ml-1.5 font-normal">
                ({customerEmail})
              </span>
            )}
          </div>
        ) : allCustomers.length > 0 ? (
          <select
            value={customerId}
            onChange={e => handleCustomerChange(e.target.value)}
            className="w-full bg-white border border-[#d1d5db] rounded-xl px-4 py-3 text-xs text-[#111827] focus:border-[#111827] focus:outline-none transition-all"
          >
            <option value="">Select customer relationship...</option>
            {allCustomers.map(c => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.email})
              </option>
            ))}
          </select>
        ) : (
          <input
            required
            value={customerName}
            onChange={e => setCustomerName(e.target.value)}
            placeholder="e.g. PT Nusantara Digital Solusi"
            className="w-full bg-white border border-[#d1d5db] rounded-xl px-4 py-3 text-xs text-[#111827] focus:border-[#111827] focus:outline-none transition-all"
          />
        )}
      </div>

      <div>
        <label className="block text-[11px] font-bold text-[#374151] uppercase tracking-wider mb-1.5">
          Billing Address *
        </label>
        <input
          required
          value={billingAddress}
          onChange={e => setBillingAddress(e.target.value)}
          placeholder="Jl. Jendral Sudirman No. 45 Jakarta Selatan"
          className="w-full bg-white border border-[#d1d5db] rounded-xl px-4 py-3 text-xs text-[#111827] focus:border-[#111827] focus:outline-none transition-all"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div>
          <label className="block text-[11px] font-bold text-[#374151] uppercase tracking-wider mb-1.5">
            Issue Date *
          </label>
          <input
            type="date"
            required
            value={issueDate}
            onChange={e => setIssueDate(e.target.value)}
            className="w-full bg-white border border-[#d1d5db] rounded-xl px-3 py-2 text-xs text-[#111827] focus:border-[#111827] focus:outline-none transition-all"
          />
        </div>

        <div>
          <label className="block text-[11px] font-bold text-[#374151] uppercase tracking-wider mb-1.5">
            Due Date *
          </label>
          <input
            type="date"
            required
            value={dueDate}
            onChange={e => setDueDate(e.target.value)}
            className="w-full bg-white border border-[#d1d5db] rounded-xl px-3 py-2 text-xs text-[#111827] focus:border-[#111827] focus:outline-none transition-all"
          />
        </div>

        <div>
          <label className="block text-[11px] font-bold text-[#374151] uppercase tracking-wider mb-1.5">
            Payment Terms *
          </label>
          <select
            value={paymentTerms}
            onChange={e => setPaymentTerms(e.target.value as PaymentTerms)}
            className="w-full bg-white border border-[#d1d5db] rounded-xl px-3 py-2 text-xs text-[#111827] focus:border-[#111827] focus:outline-none transition-all"
          >
            {PAYMENT_TERMS_OPTIONS.map(opt => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-[11px] font-bold text-[#374151] uppercase tracking-wider mb-1.5">
            Currency *
          </label>
          <select
            value={currency}
            onChange={e => setCurrency(e.target.value as CurrencyCode)}
            className="w-full bg-white border border-[#d1d5db] rounded-xl px-3 py-2 text-xs font-semibold text-[#111827] focus:border-[#111827] focus:outline-none transition-all"
          >
            <option value="NGN">NGN (₦) · Naira</option>
            <option value="USD">USD ($) · Dollar</option>
            <option value="GBP">GBP (£) · Pound</option>
            <option value="EUR">EUR (€) · Euro</option>
          </select>
        </div>
      </div>

      <InvoiceItemsTable
        items={items}
        currency={currency}
        onItemChange={handleItemChange}
        onAddItem={handleAddItem}
        onRemoveItem={handleRemoveItem}
      />

      <InvoiceSummary
        discount={discount}
        taxRate={taxRate}
        total={total}
        currency={currency}
        notes={notes}
        onDiscountChange={setDiscount}
        onTaxRateChange={setTaxRate}
        onNotesChange={setNotes}
      />
    </div>
  );
}
