"use client";

import { useMemo, useState } from "react";
import {
  createWhatsAppInvoiceUrl,
  deleteInvoice,
  downloadInvoicePdf,
  markInvoiceAsPaid,
  markInvoiceAsUnpaid,
  resendInvoice,
  saveInvoiceDraft,
  sendInvoice,
} from "@/lib/api";
import type {
  CurrencyCode,
  Invoice,
  InvoiceInput,
  InvoiceItem,
  PaymentTerms,
  UseInvoiceFormOptions,
} from "@/types";
import { formatMoney, formatStatusLabel } from "@/utils";

export const PAYMENT_TERMS_OPTIONS: PaymentTerms[] = [
  "Due on receipt",
  "Net 14",
  "Net 30",
  "Net 60",
];

export function useInvoiceForm({
  initialCustomer,
  existingInvoice,
  allCustomers = [],
  onToast,
  onInvoiceSaved,
  onClose,
}: UseInvoiceFormOptions) {
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
  const [currency, setCurrency] = useState<CurrencyCode>(existingInvoice?.currency || "NGN");
  const [items, setItems] = useState<InvoiceItem[]>(
    existingInvoice?.items || [
      {
        id: "item-1",
        description: initialCustomer?.services[0]?.name || "",
        quantity: 1,
        unit: "package",
        unitPrice: initialCustomer?.services[0]?.amount || 45000,
        amount: initialCustomer?.services[0]?.amount || 45000,
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
  const [isMarkingPaid, setIsMarkingPaid] = useState(false);
  const [isMarkingUnpaid, setIsMarkingUnpaid] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

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

  const subtotal = useMemo(() => {
    return items.reduce((acc, item) => acc + (item.quantity * item.unitPrice || 0), 0);
  }, [items]);

  const taxAmount = useMemo(() => {
    return Math.round((subtotal - discount) * (taxRate / 100));
  }, [subtotal, discount, taxRate]);

  const total = useMemo(() => {
    return Math.max(0, subtotal - discount + taxAmount);
  }, [subtotal, discount, taxAmount]);

  const handleItemChange = (id: string, field: keyof InvoiceItem, value: string | number) => {
    setItems(prev =>
      prev.map(item => {
        if (item.id !== id) return item;
        const updated = { ...item, [field]: value };
        if (field === "quantity" || field === "unitPrice") {
          updated.amount = Number(updated.quantity) * Number(updated.unitPrice);
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
    currency,
    items,
    subtotal,
    discount,
    taxRate,
    taxAmount,
    total,
    notes,
  });

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

  const handleSendInvoice = async () => {
    if (!customerName || !customerEmail) {
      onToast("Please provide both customer name and email.");
      return;
    }
    setIsSending(true);
    try {
      const sent = await sendInvoice(buildPayload());
      onToast(
        `Invoice ${sent.invoiceNumber} sent via email to ${sent.customerEmail} (${formatMoney(sent.total, currency)}).`
      );
      if (onInvoiceSaved) onInvoiceSaved(sent);
      onClose();
    } catch {
      onToast("Failed to send invoice.");
    } finally {
      setIsSending(false);
    }
  };

  const handleSendWhatsApp = async () => {
    if (!customerName) {
      onToast("Please provide customer name.");
      return;
    }
    try {
      let activeInvoice: Invoice;
      if (!existingInvoice || existingInvoice.status === "draft") {
        activeInvoice = await sendInvoice(buildPayload());
        if (onInvoiceSaved) onInvoiceSaved(activeInvoice);
      } else {
        activeInvoice = existingInvoice;
      }
      const waUrl = createWhatsAppInvoiceUrl(activeInvoice);
      if (typeof window !== "undefined") {
        window.open(waUrl, "_blank");
      }
      onToast(`WhatsApp dispatch ready for ${activeInvoice.customerName}.`);
      onClose();
    } catch {
      onToast("Failed to prepare WhatsApp invoice dispatch.");
    }
  };

  const handleMarkAsPaid = async () => {
    if (!existingInvoice?.id) return;
    setIsMarkingPaid(true);
    try {
      const updated = await markInvoiceAsPaid(existingInvoice.id);
      onToast(
        `Invoice ${updated.invoiceNumber} marked as Paid (${formatMoney(updated.total, currency)}).`
      );
      if (onInvoiceSaved) onInvoiceSaved(updated);
      onClose();
    } catch {
      onToast("Failed to mark invoice as paid.");
    } finally {
      setIsMarkingPaid(false);
    }
  };

  const handleMarkAsUnpaid = async () => {
    if (!existingInvoice?.id) return;
    setIsMarkingUnpaid(true);
    try {
      const updated = await markInvoiceAsUnpaid(existingInvoice.id);
      onToast(
        `Invoice ${updated.invoiceNumber} reverted to Unpaid (${formatStatusLabel(updated.status)}).`
      );
      if (onInvoiceSaved) onInvoiceSaved(updated);
      onClose();
    } catch {
      onToast("Failed to mark invoice as unpaid.");
    } finally {
      setIsMarkingUnpaid(false);
    }
  };

  const handleDownloadPdf = async () => {
    setIsDownloadingPdf(true);
    try {
      let targetId = existingInvoice?.id;
      if (!targetId) {
        const savedDraft = await saveInvoiceDraft(buildPayload());
        targetId = savedDraft.id;
        if (onInvoiceSaved) onInvoiceSaved(savedDraft);
      }
      await downloadInvoicePdf(targetId);
      onToast("Invoice document generated for print/PDF download.");
    } catch {
      onToast("Failed to generate invoice PDF.");
    } finally {
      setIsDownloadingPdf(false);
    }
  };

  const handleCopyLink = () => {
    const invNum = existingInvoice?.invoiceNumber || "INV-2026-DRAFT";
    const publicUrl = `${typeof window !== "undefined" ? window.location.origin : "https://shopwus.com"}/invoices/${invNum}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(publicUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
      onToast("Invoice public link copied to clipboard.");
    }
  };

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

  return {
    customerId,
    customerName,
    setCustomerName,
    customerEmail,
    setCustomerEmail,
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
  };
}
