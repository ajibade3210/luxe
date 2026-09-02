"use client";

import { Plus, Trash2, Upload, X } from "lucide-react";
import { GUEST_CURRENCY_OPTIONS } from "@/constants";
import type { InvoiceInputFormProps } from "@/types";

export function InvoiceInputForm({
  invoice,
  onChange,
  onAddItem,
  onUpdateItem,
  onRemoveItem,
  onLogoUpload,
  onRemoveLogo,
}: InvoiceInputFormProps) {
  return (
    <div className="space-y-6">
      {/* 1. Sender & Logo Section */}
      <div className="bg-white border border-[#eee7dc] rounded-2xl p-5 sm:p-6 space-y-4 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#f3eee6] pb-4">
          <div>
            <h2 className="text-sm font-semibold text-[#1f1d1a]">Your Business Details</h2>
            <p className="text-xs text-[#665e57]">Who is issuing this invoice?</p>
          </div>

          {/* Logo Uploader */}
          <div className="flex items-center gap-3">
            {invoice.senderLogo ? (
              <div className="relative group w-14 h-14 rounded-xl border border-[#e5dfd5] bg-[#faf7f2] overflow-hidden flex items-center justify-center">
                <img
                  src={invoice.senderLogo}
                  alt="Business Logo"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={onRemoveLogo}
                  className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white"
                  title="Remove Logo"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <label className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-dashed border-[#d5cdbf] hover:border-[#1f1d1a] bg-[#faf7f2] hover:bg-white text-xs font-medium text-[#665e57] hover:text-[#1f1d1a] cursor-pointer transition-all">
                <Upload size={13} />
                <span>Upload Logo</span>
                <input
                  type="file"
                  accept="image/png, image/jpeg, image/webp, image/svg+xml"
                  className="hidden"
                  onChange={onLogoUpload}
                />
              </label>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-[#524a43]">Business Name</label>
            <input
              type="text"
              value={invoice.senderName}
              onChange={e => onChange("senderName", e.target.value)}
              placeholder="e.g. Atelier Forma"
              className="w-full px-3.5 py-2 rounded-xl bg-[#faf7f2] border border-[#e5dfd5] text-xs text-[#1f1d1a] placeholder:text-[#998e82] transition-colors"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-[#524a43]">Billing Email</label>
            <input
              type="email"
              value={invoice.senderEmail}
              onChange={e => onChange("senderEmail", e.target.value)}
              placeholder="e.g. billing@atelierforma.co"
              className="w-full px-3.5 py-2 rounded-xl bg-[#faf7f2] border border-[#e5dfd5] text-xs text-[#1f1d1a] placeholder:text-[#998e82] transition-colors"
            />
          </div>

          <div className="space-y-1.5 sm:col-span-2">
            <label className="text-xs font-medium text-[#524a43]">Business Address</label>
            <textarea
              rows={2}
              value={invoice.senderAddress}
              onChange={e => onChange("senderAddress", e.target.value)}
              placeholder="Studio street address, city, state, postal code"
              className="w-full px-3.5 py-2 rounded-xl bg-[#faf7f2] border border-[#e5dfd5] text-xs text-[#1f1d1a] placeholder:text-[#998e82] transition-colors resize-none"
            />
          </div>

          <div className="space-y-1.5 sm:col-span-2">
            <label className="text-xs font-medium text-[#524a43]">Tax / VAT ID (Optional)</label>
            <input
              type="text"
              value={invoice.senderTaxId}
              onChange={e => onChange("senderTaxId", e.target.value)}
              placeholder="e.g. US-9284729-EIN or VAT Registration"
              className="w-full px-3.5 py-2 rounded-xl bg-[#faf7f2] border border-[#e5dfd5] text-xs text-[#1f1d1a] placeholder:text-[#998e82] transition-colors"
            />
          </div>
        </div>
      </div>

      {/* 2. Client & Invoice Metadata */}
      <div className="bg-white border border-[#eee7dc] rounded-2xl p-5 sm:p-6 space-y-4 shadow-xs">
        <div className="border-b border-[#f3eee6] pb-4">
          <h2 className="text-sm font-semibold text-[#1f1d1a]">Billed To & Terms</h2>
          <p className="text-xs text-[#665e57]">Client information and invoice scheduling.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-[#524a43]">Client or Company Name</label>
            <input
              type="text"
              value={invoice.clientName}
              onChange={e => onChange("clientName", e.target.value)}
              placeholder="e.g. Eleanor Vance"
              className="w-full px-3.5 py-2 rounded-xl bg-[#faf7f2] border border-[#e5dfd5] text-xs text-[#1f1d1a] placeholder:text-[#998e82] transition-colors"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-[#524a43]">Client Email</label>
            <input
              type="email"
              value={invoice.clientEmail}
              onChange={e => onChange("clientEmail", e.target.value)}
              placeholder="e.g. eleanor@vancestudio.com"
              className="w-full px-3.5 py-2 rounded-xl bg-[#faf7f2] border border-[#e5dfd5] text-xs text-[#1f1d1a] placeholder:text-[#998e82] transition-colors"
            />
          </div>

          <div className="space-y-1.5 sm:col-span-2">
            <label className="text-xs font-medium text-[#524a43]">Client Address</label>
            <textarea
              rows={2}
              value={invoice.clientAddress}
              onChange={e => onChange("clientAddress", e.target.value)}
              placeholder="Client billing address or office location"
              className="w-full px-3.5 py-2 rounded-xl bg-[#faf7f2] border border-[#e5dfd5] text-xs text-[#1f1d1a] placeholder:text-[#998e82] transition-colors resize-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-[#524a43]">Invoice Number</label>
            <input
              type="text"
              value={invoice.invoiceNumber}
              onChange={e => onChange("invoiceNumber", e.target.value)}
              placeholder="INV-001"
              className="w-full px-3.5 py-2 rounded-xl bg-[#faf7f2] border border-[#e5dfd5] text-xs text-[#1f1d1a] placeholder:text-[#998e82] transition-colors"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-[#524a43]">Currency</label>
            <select
              value={invoice.currency}
              onChange={e => onChange("currency", e.target.value as typeof invoice.currency)}
              className="w-full px-3.5 py-2 rounded-xl bg-[#faf7f2] border border-[#e5dfd5] text-xs text-[#1f1d1a] transition-colors cursor-pointer"
            >
              {GUEST_CURRENCY_OPTIONS.map(c => (
                <option key={c.code} value={c.code}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-[#524a43]">Issue Date</label>
            <input
              type="date"
              value={invoice.issueDate}
              onChange={e => onChange("issueDate", e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-[#faf7f2] border border-[#e5dfd5] text-xs text-[#1f1d1a] transition-colors"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-[#524a43]">Due Date</label>
            <input
              type="date"
              value={invoice.dueDate}
              onChange={e => onChange("dueDate", e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-[#faf7f2] border border-[#e5dfd5] text-xs text-[#1f1d1a] transition-colors"
            />
          </div>
        </div>
      </div>

      {/* 3. Line Items Section */}
      <div className="bg-white border border-[#eee7dc] rounded-2xl p-5 sm:p-6 space-y-4 shadow-xs">
        <div className="flex items-center justify-between border-b border-[#f3eee6] pb-4">
          <div>
            <h2 className="text-sm font-semibold text-[#1f1d1a]">Items & Services</h2>
            <p className="text-xs text-[#665e57]">Add line items with quantity and unit rates.</p>
          </div>
          <button
            type="button"
            onClick={onAddItem}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#191c1d] hover:bg-black text-white text-xs font-semibold transition-colors"
          >
            <Plus size={13} />
            <span>Add Item</span>
          </button>
        </div>

        {/* Desktop Table Headers */}
        <div className="hidden md:grid md:grid-cols-12 gap-3 text-[11px] font-semibold text-[#8c827a] uppercase tracking-wider px-2">
          <div className="col-span-6">Description</div>
          <div className="col-span-2">Qty</div>
          <div className="col-span-2">Rate</div>
          <div className="col-span-1 text-right">Total</div>
          <div className="col-span-1" />
        </div>

        {/* Items List (Responsive Cards on Mobile, Table Rows on Desktop) */}
        <div className="space-y-3">
          {invoice.items.map((item, index) => (
            <div
              key={item.id}
              className="p-3.5 md:p-2 rounded-xl bg-[#faf7f2] border border-[#e5dfd5] md:border-transparent md:bg-transparent grid grid-cols-1 md:grid-cols-12 gap-2.5 md:gap-3 items-center"
            >
              {/* Description */}
              <div className="md:col-span-6">
                <span className="md:hidden text-[10px] font-bold text-[#8c827a] uppercase block mb-1">
                  Item #{index + 1} Description
                </span>
                <input
                  type="text"
                  value={item.description}
                  onChange={e => onUpdateItem(item.id, "description", e.target.value)}
                  placeholder="Service description or item name"
                  className="w-full px-3 py-2 rounded-xl bg-white border border-[#e5dfd5] text-xs text-[#1f1d1a] placeholder:text-[#998e82]"
                />
              </div>

              {/* Quantity */}
              <div className="grid grid-cols-2 md:block md:col-span-2 gap-2">
                <div>
                  <span className="md:hidden text-[10px] font-bold text-[#8c827a] uppercase block mb-1">
                    Qty
                  </span>
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={e => onUpdateItem(item.id, "quantity", Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#e5dfd5] text-xs text-[#1f1d1a]"
                  />
                </div>

                {/* Rate on mobile alongside Qty */}
                <div className="md:hidden">
                  <span className="text-[10px] font-bold text-[#8c827a] uppercase block mb-1">
                    Rate
                  </span>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={item.unitPrice}
                    onChange={e => onUpdateItem(item.id, "unitPrice", Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#e5dfd5] text-xs text-[#1f1d1a]"
                  />
                </div>
              </div>

              {/* Rate (Desktop only) */}
              <div className="hidden md:block md:col-span-2">
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={item.unitPrice}
                  onChange={e => onUpdateItem(item.id, "unitPrice", Number(e.target.value))}
                  placeholder="0.00"
                  className="w-full px-3 py-2 rounded-xl bg-white border border-[#e5dfd5] text-xs text-[#1f1d1a]"
                />
              </div>

              {/* Line Total */}
              <div className="flex md:block md:col-span-1 justify-between items-center md:text-right pt-2 md:pt-0 border-t md:border-0 border-[#eee7dc]">
                <span className="md:hidden text-xs font-semibold text-[#665e57]">Line Total:</span>
                <span className="text-xs font-mono font-semibold text-[#1f1d1a]">
                  {Number(item.total || 0).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
              </div>

              {/* Remove Action */}
              <div className="md:col-span-1 flex justify-end">
                <button
                  type="button"
                  onClick={() => onRemoveItem(item.id)}
                  disabled={invoice.items.length <= 1}
                  className="p-1.5 rounded-lg text-[#998e82] hover:text-[#dc2626] hover:bg-[#fee2e2]/40 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  title="Remove Item"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Adjustments: Discount & Tax */}
        <div className="pt-4 border-t border-[#f3eee6] grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-[#524a43]">Discount</label>
              <div className="flex items-center gap-1 text-[11px]">
                <button
                  type="button"
                  onClick={() => onChange("discountType", "percentage")}
                  className={`px-2 py-0.5 rounded-md font-semibold transition-colors ${
                    invoice.discountType === "percentage"
                      ? "bg-[#191c1d] text-white"
                      : "text-[#665e57] hover:text-[#1f1d1a]"
                  }`}
                >
                  %
                </button>
                <button
                  type="button"
                  onClick={() => onChange("discountType", "fixed")}
                  className={`px-2 py-0.5 rounded-md font-semibold transition-colors ${
                    invoice.discountType === "fixed"
                      ? "bg-[#191c1d] text-white"
                      : "text-[#665e57] hover:text-[#1f1d1a]"
                  }`}
                >
                  Flat
                </button>
              </div>
            </div>
            <input
              type="number"
              min="0"
              step="0.1"
              value={invoice.discountValue}
              onChange={e => onChange("discountValue", Number(e.target.value))}
              className="w-full px-3.5 py-2 rounded-xl bg-[#faf7f2] border border-[#e5dfd5] text-xs text-[#1f1d1a]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-[#524a43]">Tax Rate (%)</label>
            <input
              type="number"
              min="0"
              step="0.1"
              value={invoice.taxRate}
              onChange={e => onChange("taxRate", Number(e.target.value))}
              placeholder="e.g. 7.5 or 20"
              className="w-full px-3.5 py-2 rounded-xl bg-[#faf7f2] border border-[#e5dfd5] text-xs text-[#1f1d1a]"
            />
          </div>
        </div>
      </div>

      {/* 4. Notes & Payment Terms */}
      <div className="bg-white border border-[#eee7dc] rounded-2xl p-5 sm:p-6 space-y-4 shadow-xs">
        <div className="border-b border-[#f3eee6] pb-4">
          <h2 className="text-sm font-semibold text-[#1f1d1a]">Payment Notes & Terms</h2>
          <p className="text-xs text-[#665e57]">
            Provide wire transfer details and settlement terms.
          </p>
        </div>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-[#524a43]">
              Payment Instructions / Notes
            </label>
            <textarea
              rows={2}
              value={invoice.notes}
              onChange={e => onChange("notes", e.target.value)}
              placeholder="e.g. Bank wire instructions, payment reference instructions..."
              className="w-full px-3.5 py-2 rounded-xl bg-[#faf7f2] border border-[#e5dfd5] text-xs text-[#1f1d1a] resize-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-[#524a43]">Terms & Conditions</label>
            <textarea
              rows={2}
              value={invoice.terms}
              onChange={e => onChange("terms", e.target.value)}
              placeholder="e.g. Payment due within 14 calendar days. Late balances subject to interest."
              className="w-full px-3.5 py-2 rounded-xl bg-[#faf7f2] border border-[#e5dfd5] text-xs text-[#1f1d1a] resize-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
