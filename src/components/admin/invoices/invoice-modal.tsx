"use client";

import { ArrowLeft, FileText, Loader2, Plus, RefreshCw, Send, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import {
  deleteInvoice,
  type Invoice,
  type InvoiceInput,
  type InvoiceItem,
  type PaymentTerms,
  resendInvoice,
  saveInvoiceDraft,
  sendInvoice,
} from "@/lib/api";
import type { Customer } from "@/lib/types";
import { formatMoney } from "../admin-layout";

const PAYMENT_TERMS_OPTIONS: PaymentTerms[] = ["Due on receipt", "Net 14", "Net 30", "Net 60"];

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
  const [customerId, setCustomerId] = useState(
    existingInvoice?.customerId || initialCustomer?.id || ""
  );
  const [customerName, setCustomerName] = useState(
    existingInvoice?.customerName || initialCustomer?.name || ""
  );
  const [customerEmail, setCustomerEmail] = useState(
    existingInvoice?.customerEmail || initialCustomer?.email || ""
  );
  const [billingAddress, setBillingAddress] = useState(
    existingInvoice?.billingAddress || "Plot 14, Victoria Island Waterfront, Lagos, Nigeria"
  );
  const [issueDate, setIssueDate] = useState(
    existingInvoice?.issueDate || new Date().toISOString().split("T")[0]
  );
  const [dueDate, setDueDate] = useState(
    existingInvoice?.dueDate ||
      new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]
  );
  const [paymentTerms, setPaymentTerms] = useState<PaymentTerms>(
    existingInvoice?.paymentTerms || "Net 14"
  );
  const [items, setItems] = useState<InvoiceItem[]>(
    existingInvoice?.items || [
      {
        id: "item-1",
        description: initialCustomer?.projects[0]?.name || "Bespoke Event Production & Styling",
        quantity: 1,
        unit: "package",
        unitPrice: initialCustomer?.projects[0]?.amount || 45000,
        amount: initialCustomer?.projects[0]?.amount || 45000,
      },
    ]
  );
  const [discount, setDiscount] = useState<number>(existingInvoice?.discount || 0);
  const [taxRate, setTaxRate] = useState<number>(existingInvoice?.taxRate || 0);
  const [notes, setNotes] = useState<string>(
    existingInvoice?.notes ||
      "Thank you for your trust in Élan Atelier. Please complete the payment before the due date."
  );

  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Sync customer selection
  const handleCustomerChange = (cId: string) => {
    setCustomerId(cId);
    const found = allCustomers.find(c => c.id === cId);
    if (found) {
      setCustomerName(found.name);
      setCustomerEmail(found.email);
      if (found.company) {
        setBillingAddress(`${found.company}, Victoria Island, Lagos`);
      }
    }
  };

  // Dynamic calculations
  const subtotal = useMemo(() => {
    return items.reduce((acc, item) => acc + (item.quantity * item.unitPrice || 0), 0);
  }, [items]);

  const taxAmount = useMemo(() => {
    return Math.round((subtotal - discount) * (taxRate / 100));
  }, [subtotal, discount, taxRate]);

  const total = useMemo(() => {
    return Math.max(0, subtotal - discount + taxAmount);
  }, [subtotal, discount, taxAmount]);

  // Line item handlers
  const handleItemChange = (id: string, field: keyof InvoiceItem, value: string | number) => {
    setItems(prev =>
      prev.map(item => {
        if (item.id !== id) return item;
        const updated = { ...item, [field]: value };
        if (field === "quantity" || field === "unitPrice") {
          const qty = field === "quantity" ? Number(value) : item.quantity;
          const price = field === "unitPrice" ? Number(value) : item.unitPrice;
          updated.amount = qty * price;
        }
        return updated;
      })
    );
  };

  const handleAddItem = () => {
    const newItem: InvoiceItem = {
      id: `item-${Date.now()}`,
      description: "Additional Atelier Service / Curation",
      quantity: 1,
      unit: "session",
      unitPrice: 5000,
      amount: 5000,
    };
    setItems(prev => [...prev, newItem]);
  };

  const handleRemoveItem = (id: string) => {
    if (items.length <= 1) {
      onToast("Invoice must contain at least one line item.");
      return;
    }
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const buildPayload = (): InvoiceInput => ({
    id: existingInvoice?.id,
    invoiceNumber: existingInvoice?.invoiceNumber,
    customerId,
    customerName,
    customerEmail,
    billingAddress,
    issueDate,
    dueDate,
    paymentTerms,
    items,
    subtotal,
    discount,
    taxRate,
    taxAmount,
    total,
    notes,
  });

  // Action: Save as Draft
  const handleSaveDraft = async () => {
    if (!customerName || !customerEmail) {
      onToast("Please provide both customer name and email.");
      return;
    }
    setIsSavingDraft(true);
    try {
      const saved = await saveInvoiceDraft(buildPayload());
      onToast(`Invoice ${saved.invoiceNumber} saved as draft.`);
      if (onInvoiceSaved) onInvoiceSaved(saved);
      onClose();
    } catch {
      onToast("Failed to save invoice draft.");
    } finally {
      setIsSavingDraft(false);
    }
  };

  // Action: Send Invoice
  const handleSendInvoice = async () => {
    if (!customerName || !customerEmail) {
      onToast("Please provide both customer name and email.");
      return;
    }
    setIsSending(true);
    try {
      const sent = await sendInvoice(buildPayload());
      onToast(
        `Invoice ${sent.invoiceNumber} sent to ${sent.customerEmail} (${formatMoney(sent.total)}).`
      );
      if (onInvoiceSaved) onInvoiceSaved(sent);
      onClose();
    } catch {
      onToast("Failed to send invoice.");
    } finally {
      setIsSending(false);
    }
  };

  // Action: Resend Invoice (if already sent)
  const handleResendInvoice = async () => {
    if (!existingInvoice) return;
    setIsResending(true);
    try {
      const res = await resendInvoice(existingInvoice.id);
      onToast(`Invoice ${res.invoiceNumber} re-sent to ${res.customerEmail}.`);
      if (onInvoiceSaved) onInvoiceSaved(res);
      onClose();
    } catch {
      onToast("Failed to resend invoice.");
    } finally {
      setIsResending(false);
    }
  };

  // Action: Delete Invoice (ONLY IF DRAFT / NOT SENT)
  const handleDeleteInvoice = async () => {
    if (!existingInvoice) return;
    if (existingInvoice.status !== "draft") {
      onToast("Cannot delete a sent invoice. Only unsent drafts can be deleted.");
      return;
    }
    setIsDeleting(true);
    try {
      await deleteInvoice(existingInvoice.id);
      onToast(`Draft invoice ${existingInvoice.invoiceNumber} deleted.`);
      onClose();
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : "Failed to delete draft invoice.";
      onToast(errorMsg);
    } finally {
      setIsDeleting(false);
    }
  };

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
        {/* Header matching inspiration */}
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
            <h1 className="text-xl sm:text-2xl font-serif font-bold text-[#111827] tracking-tight">
              {existingInvoice ? `Invoice ${existingInvoice.invoiceNumber}` : "Create New Invoice"}
            </h1>
          </div>

          {/* Top Actions */}
          <div className="flex items-center gap-2.5 flex-wrap">
            {/* Delete button: ONLY FOR UNSENT DRAFTS */}
            {isExistingDraft && (
              <button
                type="button"
                onClick={handleDeleteInvoice}
                disabled={isDeleting}
                className="inline-flex items-center gap-1.5 bg-white hover:bg-[#fef2f2] text-[#dc2626] border border-[#fecaca] px-3.5 py-2 rounded-xl text-xs font-semibold hover:-translate-y-0.5 hover:shadow-xs active:translate-y-0 transition-all cursor-pointer disabled:opacity-50"
              >
                <Trash2 size={13} />
                <span>{isDeleting ? "Deleting..." : "Delete Draft"}</span>
              </button>
            )}

            {/* Save as Draft button */}
            <button
              type="button"
              onClick={handleSaveDraft}
              disabled={isSavingDraft || isSending}
              className="inline-flex items-center gap-2 bg-white hover:bg-[#fafaf9] text-[#1f2937] border border-[#d1d5db] px-4 py-2.5 rounded-xl text-xs font-semibold hover:-translate-y-0.5 hover:shadow-xs active:translate-y-0 transition-all cursor-pointer shadow-2xs disabled:opacity-50"
            >
              {isSavingDraft ? (
                <>
                  <Loader2 size={14} className="animate-spin text-[#6b7280]" />
                  <span>Saving…</span>
                </>
              ) : (
                <>
                  <FileText size={14} />
                  <span>Save as Draft</span>
                </>
              )}
            </button>

            {/* Send / Resend Invoice button */}
            {isAlreadySent ? (
              <button
                type="button"
                onClick={handleResendInvoice}
                disabled={isResending}
                className="inline-flex items-center gap-2 bg-[#111827] hover:bg-black text-white px-5 py-2.5 rounded-xl text-xs font-semibold hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 transition-all cursor-pointer shadow-xs disabled:opacity-50"
              >
                {isResending ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    <span>Resending…</span>
                  </>
                ) : (
                  <>
                    <RefreshCw size={14} />
                    <span>Resend Invoice</span>
                  </>
                )}
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSendInvoice}
                disabled={isSending || isSavingDraft}
                className="inline-flex items-center gap-2 bg-[#111827] hover:bg-black text-white px-5 py-2.5 rounded-xl text-xs font-semibold hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 transition-all cursor-pointer shadow-xs disabled:opacity-50"
              >
                {isSending ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    <span>Sending…</span>
                  </>
                ) : (
                  <>
                    <Send size={14} />
                    <span>Send Invoice</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* 2-Column Content Area */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column (7 cols): Invoice Details Form */}
            <div className="lg:col-span-7 space-y-6">
              <div className="bg-white border border-[#e5e7eb] rounded-3xl p-6 sm:p-7 shadow-xs space-y-5">
                <h2 className="text-sm font-serif font-bold text-[#111827] uppercase tracking-wider border-b border-[#f3f4f6] pb-3">
                  Invoice Details
                </h2>

                {/* Customer */}
                <div>
                  <label className="block text-[11px] font-bold text-[#374151] uppercase tracking-wider mb-1.5">
                    Customer *
                  </label>
                  {allCustomers.length > 0 ? (
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

                {/* Billing Address */}
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

                {/* Dates & Payment Terms */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                  <div>
                    <label className="block text-[11px] font-bold text-[#374151] uppercase tracking-wider mb-1.5">
                      Issue Date *
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        required
                        value={issueDate}
                        onChange={e => setIssueDate(e.target.value)}
                        className="w-full bg-white border border-[#d1d5db] rounded-xl px-3.5 py-2.5 text-xs text-[#111827] focus:border-[#111827] focus:outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#374151] uppercase tracking-wider mb-1.5">
                      Due Date *
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        required
                        value={dueDate}
                        onChange={e => setDueDate(e.target.value)}
                        className="w-full bg-white border border-[#d1d5db] rounded-xl px-3.5 py-2.5 text-xs text-[#111827] focus:border-[#111827] focus:outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#374151] uppercase tracking-wider mb-1.5">
                      Payment Terms *
                    </label>
                    <select
                      value={paymentTerms}
                      onChange={e => setPaymentTerms(e.target.value as PaymentTerms)}
                      className="w-full bg-white border border-[#d1d5db] rounded-xl px-3.5 py-2.5 text-xs text-[#111827] focus:border-[#111827] focus:outline-none transition-all"
                    >
                      {PAYMENT_TERMS_OPTIONS.map(opt => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Items Details */}
                <div className="space-y-3 pt-2">
                  <label className="block text-[11px] font-bold text-[#374151] uppercase tracking-wider">
                    Items Details *
                  </label>

                  <div className="space-y-2.5">
                    {items.map(item => (
                      <div
                        key={item.id}
                        className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 bg-[#f9fafb] p-3 rounded-2xl border border-[#f3f4f6]"
                      >
                        {/* Description */}
                        <div className="flex-1">
                          <input
                            value={item.description}
                            onChange={e => handleItemChange(item.id, "description", e.target.value)}
                            placeholder="Item description"
                            className="w-full bg-white border border-[#e5e7eb] rounded-xl px-3 py-2 text-xs text-[#111827] focus:border-[#111827] focus:outline-none"
                          />
                        </div>

                        {/* QTY */}
                        <div className="w-20">
                          <input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={e =>
                              handleItemChange(item.id, "quantity", Number(e.target.value) || 1)
                            }
                            placeholder="Qty"
                            className="w-full bg-white border border-[#e5e7eb] rounded-xl px-3 py-2 text-xs text-[#111827] text-center focus:border-[#111827] focus:outline-none"
                          />
                        </div>

                        {/* Unit Price */}
                        <div className="w-28">
                          <input
                            type="number"
                            min="0"
                            step="500"
                            value={item.unitPrice}
                            onChange={e =>
                              handleItemChange(item.id, "unitPrice", Number(e.target.value) || 0)
                            }
                            placeholder="Cost"
                            className="w-full bg-white border border-[#e5e7eb] rounded-xl px-3 py-2 text-xs text-[#111827] text-right focus:border-[#111827] focus:outline-none"
                          />
                        </div>

                        {/* Amount */}
                        <div className="w-28 text-right px-2">
                          <span className="text-xs font-mono font-bold text-[#111827]">
                            {formatMoney(item.amount)}
                          </span>
                        </div>

                        {/* Delete button */}
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(item.id)}
                          className="p-2 text-[#9ca3af] hover:text-[#ef4444] hover:bg-[#fee2e2] rounded-xl transition-colors cursor-pointer shrink-0"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={handleAddItem}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#111827] hover:text-[#855e2e] transition-colors py-1 cursor-pointer"
                  >
                    <Plus size={14} />
                    <span>Add Item</span>
                  </button>
                </div>

                {/* Discount, Tax & Total */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-3 border-t border-[#f3f4f6]">
                  <div>
                    <label className="block text-[11px] font-bold text-[#374151] uppercase tracking-wider mb-1.5">
                      Discount ($)
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="100"
                      value={discount}
                      onChange={e => setDiscount(Number(e.target.value) || 0)}
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
                      onChange={e => setTaxRate(Number(e.target.value) || 0)}
                      className="w-full bg-white border border-[#d1d5db] rounded-xl px-3.5 py-2.5 text-xs text-[#111827] focus:border-[#111827] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#374151] uppercase tracking-wider mb-1.5">
                      Total Due
                    </label>
                    <div className="w-full bg-[#f3f4f6] border border-[#e5e7eb] rounded-xl px-3.5 py-2.5 text-xs font-mono font-bold text-[#111827]">
                      {formatMoney(total)}
                    </div>
                  </div>
                </div>

                {/* Notes to Customer */}
                <div className="pt-2">
                  <label className="block text-[11px] font-bold text-[#374151] uppercase tracking-wider mb-1.5">
                    Notes to Customer *
                  </label>
                  <textarea
                    rows={3}
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                    placeholder="Thank you for your trust. Please complete the payment before the due date."
                    className="w-full bg-white border border-[#d1d5db] rounded-xl p-3.5 text-xs text-[#111827] focus:border-[#111827] focus:outline-none transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Right Column (5 cols): Live Real-Time Stationery Preview */}
            <div className="lg:col-span-5 space-y-4">
              <span className="text-[11px] font-bold text-[#6b7280] uppercase tracking-wider block">
                Preview
              </span>

              {/* Stationery Card matching inspiration */}
              <div className="bg-white border border-[#e5e7eb] rounded-3xl p-6 sm:p-7 shadow-lg space-y-6 text-xs text-[#374151]">
                {/* Logo & Header */}
                <div className="flex items-center justify-between border-b border-[#f3f4f6] pb-4">
                  <div className="w-10 h-10 rounded-2xl bg-[#111827] text-white flex items-center justify-center font-serif font-bold text-base shadow-xs">
                    É
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#855e2e] block">
                      {existingInvoice?.status?.toUpperCase() || "DRAFT"}
                    </span>
                    <span className="text-xs font-mono font-bold text-[#111827] block">
                      {existingInvoice?.invoiceNumber || "INV-2026-DRAFT"}
                    </span>
                  </div>
                </div>

                {/* Meta block */}
                <div className="grid grid-cols-3 gap-2 text-[11px] border-b border-[#f3f4f6] pb-4">
                  <div>
                    <span className="text-[#9ca3af] block">Issue Date</span>
                    <b className="text-[#111827] block mt-0.5">{issueDate}</b>
                  </div>
                  <div>
                    <span className="text-[#9ca3af] block">Due Date</span>
                    <b className="text-[#111827] block mt-0.5">{dueDate}</b>
                  </div>
                  <div>
                    <span className="text-[#9ca3af] block">Payment Terms</span>
                    <b className="text-[#111827] block mt-0.5">{paymentTerms}</b>
                  </div>
                </div>

                {/* Billed By & Billed To */}
                <div className="space-y-3 border-b border-[#f3f4f6] pb-4 text-[11px]">
                  <div>
                    <span className="text-[#9ca3af] block">Billed by:</span>
                    <b className="text-[#111827] block mt-0.5">Élan Atelier Limited</b>
                    <span className="text-[#6b7280] block text-[10px] mt-0.5">
                      Plot 14, Victoria Island Waterfront, Lagos, Nigeria
                    </span>
                  </div>

                  <div>
                    <span className="text-[#9ca3af] block">Billed to:</span>
                    <b className="text-[#111827] block mt-0.5">{customerName || "Customer Name"}</b>
                    <span className="text-[#6b7280] block text-[10px] mt-0.5">
                      {billingAddress || "Billing Address"}
                    </span>
                  </div>
                </div>

                {/* Itemized List */}
                <div className="space-y-2 border-b border-[#f3f4f6] pb-4">
                  <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-[#9ca3af] pb-1">
                    <span>Item</span>
                    <div className="flex items-center gap-6">
                      <span>QTY</span>
                      <span>Amount</span>
                    </div>
                  </div>

                  {items.map(item => (
                    <div key={item.id} className="flex items-center justify-between text-xs py-1">
                      <div className="min-w-0 pr-2">
                        <b className="text-[#111827] block truncate">{item.description}</b>
                        <span className="text-[10px] text-[#9ca3af] block">
                          {formatMoney(item.unitPrice)} each
                        </span>
                      </div>
                      <div className="flex items-center gap-6 shrink-0">
                        <span className="text-xs font-mono text-[#6b7280]">{item.quantity}</span>
                        <span className="text-xs font-mono font-bold text-[#111827]">
                          {formatMoney(item.amount)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Calculation Summary */}
                <div className="space-y-1.5 text-xs border-b border-[#f3f4f6] pb-4">
                  <div className="flex justify-between text-[#6b7280]">
                    <span>Subtotal</span>
                    <span className="font-mono">{formatMoney(subtotal)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-[#16a34a]">
                      <span>Discount</span>
                      <span className="font-mono">-{formatMoney(discount)}</span>
                    </div>
                  )}
                  {taxRate > 0 && (
                    <div className="flex justify-between text-[#6b7280]">
                      <span>Tax ({taxRate}%)</span>
                      <span className="font-mono">+{formatMoney(taxAmount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm font-bold text-[#111827] pt-1.5 border-t border-[#f3f4f6]">
                    <span>Total Due</span>
                    <span className="font-mono">{formatMoney(total)}</span>
                  </div>
                </div>

                {/* Bank / Payment Details */}
                <div className="bg-[#fafaf9] rounded-2xl p-3.5 border border-[#f3f4f6] space-y-1 text-[11px]">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#855e2e] block">
                    Remittance Banking Details
                  </span>
                  <div className="text-[#4b5563] text-[10px] space-y-0.5 pt-0.5">
                    <div>
                      Bank Name: <b className="text-[#111827]">Standard Chartered Bank</b>
                    </div>
                    <div>
                      Account Name: <b className="text-[#111827]">Élan Events Atelier Ltd</b>
                    </div>
                    <div>
                      Account Number: <b className="text-[#111827] font-mono">0039281745</b>
                    </div>
                  </div>
                </div>

                {/* Notes */}
                {notes && <div className="text-[10px] text-[#6b7280] italic">Note: {notes}</div>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
