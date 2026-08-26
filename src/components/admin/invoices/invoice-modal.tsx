"use client";

import {
  ArrowLeft,
  Check,
  Copy,
  Download,
  FileText,
  Loader2,
  MessageSquare,
  MoreHorizontal,
  RefreshCw,
  RotateCcw,
  Send,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { PAYMENT_TERMS_OPTIONS, useInvoiceForm } from "@/hooks/use-invoice-form";
import type { Invoice, PaymentTerms } from "@/lib/api";
import type { CurrencyCode, Customer } from "@/lib/types";
import { InvoiceItemsTable } from "./invoice-items-table";
import { InvoicePreview } from "./invoice-preview";
import { InvoiceSummary } from "./invoice-summary";

interface InvoiceModalProps {
  initialCustomer?: Customer;
  existingInvoice?: Invoice;
  allCustomers?: Customer[];
  isOpen: boolean;
  onClose: () => void;
  onToast: (msg: string) => void;
  onInvoiceSaved?: (invoice: Invoice) => void;
}

export function InvoiceModal({
  initialCustomer,
  existingInvoice,
  allCustomers = [],
  isOpen,
  onClose,
  onToast,
  onInvoiceSaved,
}: InvoiceModalProps) {
  const [showMoreMenu, setShowMoreMenu] = useState(false);

  const {
    customerId,
    customerName,
    setCustomerName,
    customerEmail,
    billingAddress,
    setBillingAddress,
    issueDate,
    setIssueDate,
    dueDate,
    setDueDate,
    paymentTerms,
    setPaymentTerms,
    currency,
    setCurrency,
    items,
    discount,
    setDiscount,
    taxRate,
    setTaxRate,
    notes,
    setNotes,
    subtotal,
    taxAmount,
    total,
    isSavingDraft,
    isSending,
    isResending,
    isMarkingPaid,
    isMarkingUnpaid,
    isDeleting,
    isDownloadingPdf,
    copiedLink,
    handleCustomerChange,
    handleItemChange,
    handleAddItem,
    handleRemoveItem,
    handleSaveDraft,
    handleSendInvoice,
    handleSendWhatsApp,
    handleMarkAsPaid,
    handleMarkAsUnpaid,
    handleDownloadPdf,
    handleCopyLink,
    handleResendInvoice,
    handleDeleteInvoice,
  } = useInvoiceForm({
    initialCustomer,
    existingInvoice,
    allCustomers,
    onToast,
    onInvoiceSaved,
    onClose,
  });

  if (!isOpen) return null;

  const isExistingDraft = existingInvoice && existingInvoice.status === "draft";
  const isAlreadySent =
    existingInvoice && (existingInvoice.status === "sent" || existingInvoice.status === "paid");

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-[#f8f9fa] border border-[#e5e7eb] rounded-3xl max-w-7xl w-full max-h-[94vh] shadow-2xl overflow-hidden flex flex-col my-auto"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-white border-b border-[#e5e7eb] px-6 sm:px-8 py-4.5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0">
          <div>
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#6b7280] hover:text-[#111827] transition-colors cursor-pointer mb-1"
            >
              <ArrowLeft size={13} />
              <span>Back to customers</span>
            </button>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl sm:text-2xl font-serif font-bold text-[#111827] tracking-tight">
                {existingInvoice
                  ? `Invoice ${existingInvoice.invoiceNumber}`
                  : "Create New Invoice"}
              </h1>
              {existingInvoice?.status === "paid" && (
                <span className="inline-flex items-center gap-1 bg-[#ecfdf5] text-[#065f46] border border-[#a7f3d0] px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">
                  <Check size={11} />
                  <span>Payment Received</span>
                </span>
              )}
            </div>
          </div>

          {/* Top Actions Bar */}
          <div className="flex items-center gap-2.5">
            {(!existingInvoice || existingInvoice.status === "draft") && (
              <button
                type="button"
                onClick={handleSaveDraft}
                disabled={isSavingDraft || isSending}
                className="inline-flex items-center gap-1.5 bg-white hover:bg-[#fafaf9] text-[#1f2937] border border-[#d1d5db] px-3.5 py-2 rounded-xl text-xs font-semibold hover:-translate-y-0.5 hover:shadow-xs active:translate-y-0 transition-all cursor-pointer shadow-2xs disabled:opacity-50"
              >
                {isSavingDraft ? (
                  <>
                    <Loader2 size={13} className="animate-spin text-[#6b7280]" />
                    <span>Saving…</span>
                  </>
                ) : (
                  <>
                    <FileText size={13} />
                    <span>Save as Draft</span>
                  </>
                )}
              </button>
            )}

            {isAlreadySent ? (
              <button
                type="button"
                onClick={handleResendInvoice}
                disabled={isResending}
                className="inline-flex items-center gap-2 bg-[#111827] hover:bg-black text-white px-4 py-2 rounded-xl text-xs font-semibold hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 transition-all cursor-pointer shadow-xs disabled:opacity-50"
              >
                {isResending ? (
                  <>
                    <Loader2 size={13} className="animate-spin" />
                    <span>Resending…</span>
                  </>
                ) : (
                  <>
                    <RefreshCw size={13} />
                    <span>Resend Invoice</span>
                  </>
                )}
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSendInvoice}
                disabled={isSending || isSavingDraft}
                className="inline-flex items-center gap-2 bg-[#111827] hover:bg-black text-white px-4 py-2 rounded-xl text-xs font-semibold hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 transition-all cursor-pointer shadow-xs disabled:opacity-50"
              >
                {isSending ? (
                  <>
                    <Loader2 size={13} className="animate-spin" />
                    <span>Sending…</span>
                  </>
                ) : (
                  <>
                    <Send size={13} />
                    <span>Send Invoice</span>
                  </>
                )}
              </button>
            )}

            <div className="relative">
              <button
                type="button"
                onClick={() => setShowMoreMenu(prev => !prev)}
                className="inline-flex items-center justify-center w-9 h-9 bg-white hover:bg-[#faf7f2] text-[#191c1d] border border-[#d1d5db] hover:border-[#855e2e] rounded-xl transition-all cursor-pointer shadow-2xs"
                title="More actions"
              >
                <MoreHorizontal size={15} />
              </button>

              {showMoreMenu && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowMoreMenu(false)} />
                  <div className="absolute right-0 top-full mt-2 w-52 bg-white border border-[#e5e7eb] rounded-2xl shadow-xl z-50 p-1.5 space-y-0.5 text-xs animate-in fade-in zoom-in-95 duration-100">
                    <button
                      type="button"
                      onClick={() => {
                        setShowMoreMenu(false);
                        handleDownloadPdf();
                      }}
                      disabled={isDownloadingPdf}
                      className="w-full text-left px-3 py-2 rounded-xl hover:bg-[#faf7f2] text-[#374151] hover:text-[#111827] flex items-center gap-2.5 font-medium cursor-pointer transition-colors"
                    >
                      <Download size={13} />
                      <span>{isDownloadingPdf ? "Preparing PDF..." : "Download PDF"}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setShowMoreMenu(false);
                        handleSendWhatsApp();
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl hover:bg-[#f0fdf4] text-[#15803d] flex items-center gap-2.5 font-medium cursor-pointer transition-colors"
                    >
                      <MessageSquare size={13} />
                      <span>Send via WhatsApp</span>
                    </button>

                    {existingInvoice && (
                      <button
                        type="button"
                        onClick={() => {
                          setShowMoreMenu(false);
                          handleCopyLink();
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl hover:bg-[#faf7f2] text-[#374151] hover:text-[#111827] flex items-center gap-2.5 font-medium cursor-pointer transition-colors"
                      >
                        <Copy size={13} />
                        <span>{copiedLink ? "Copied!" : "Copy Invoice Link"}</span>
                      </button>
                    )}

                    {existingInvoice && existingInvoice.status !== "paid" && (
                      <button
                        type="button"
                        onClick={() => {
                          setShowMoreMenu(false);
                          handleMarkAsPaid();
                        }}
                        disabled={isMarkingPaid}
                        className="w-full text-left px-3 py-2 rounded-xl hover:bg-[#ecfdf5] text-[#065f46] flex items-center gap-2.5 font-medium cursor-pointer transition-colors"
                      >
                        <Check size={13} />
                        <span>{isMarkingPaid ? "Marking Paid..." : "Mark as Paid"}</span>
                      </button>
                    )}

                    {existingInvoice && existingInvoice.status === "paid" && (
                      <button
                        type="button"
                        onClick={() => {
                          setShowMoreMenu(false);
                          handleMarkAsUnpaid();
                        }}
                        disabled={isMarkingUnpaid}
                        className="w-full text-left px-3 py-2 rounded-xl hover:bg-[#fefce8] text-[#854d0e] flex items-center gap-2.5 font-medium cursor-pointer transition-colors"
                      >
                        <RotateCcw size={13} />
                        <span>{isMarkingUnpaid ? "Reverting..." : "Mark as Unpaid"}</span>
                      </button>
                    )}

                    {isExistingDraft && (
                      <>
                        <div className="border-t border-[#f3f4f6] my-1" />
                        <button
                          type="button"
                          onClick={() => {
                            setShowMoreMenu(false);
                            handleDeleteInvoice();
                          }}
                          disabled={isDeleting}
                          className="w-full text-left px-3 py-2 rounded-xl hover:bg-[#fef2f2] text-[#dc2626] flex items-center gap-2.5 font-medium cursor-pointer transition-colors"
                        >
                          <Trash2 size={13} />
                          <span>{isDeleting ? "Deleting..." : "Delete Draft"}</span>
                        </button>
                      </>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* 2-Column Content Area */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Form */}
            <div className="lg:col-span-7 space-y-6">
              <div className="bg-white border border-[#e5e7eb] rounded-3xl p-6 sm:p-7 shadow-xs space-y-5">
                <h2 className="text-sm font-serif font-bold text-[#111827] uppercase tracking-wider border-b border-[#f3f4f6] pb-3">
                  Invoice Details
                </h2>

                <div>
                  <label className="block text-[11px] font-bold text-[#374151] uppercase tracking-wider mb-1.5">
                    Customer *
                  </label>
                  {customerName ? (
                    <div className="w-full bg-[#f9fafb] border border-[#e5e7eb] rounded-xl px-4 py-2.5 text-xs text-[#111827] flex items-center justify-between">
                      <div className="min-w-0 pr-2 truncate">
                        <span className="font-semibold text-[#111827]">{customerName}</span>
                        {customerEmail && (
                          <span className="text-[#6b7280] text-[11px] ml-1.5 font-normal">
                            ({customerEmail})
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] uppercase font-bold text-[#855e2e] bg-[#f4ece1] px-2 py-0.5 rounded shrink-0">
                        Client
                      </span>
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
            </div>

            {/* Right Column: Preview */}
            <InvoicePreview
              existingInvoice={existingInvoice}
              customerName={customerName}
              billingAddress={billingAddress}
              issueDate={issueDate}
              dueDate={dueDate}
              paymentTerms={paymentTerms}
              currency={currency}
              items={items}
              subtotal={subtotal}
              discount={discount}
              taxRate={taxRate}
              taxAmount={taxAmount}
              total={total}
              notes={notes}
              copiedLink={copiedLink}
              onCopyLink={handleCopyLink}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
