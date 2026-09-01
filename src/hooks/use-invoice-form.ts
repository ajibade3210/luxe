"use client";

import { useEffect, useMemo, useState } from "react";
import {
  createWhatsAppInvoiceUrl,
  deleteInvoice,
  downloadInvoicePdf,
  getBusinessProfile,
  getCurrentSession,
  getInvoicePdfUrl,
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
  const [issueDate, setIssueDate] = useState(existingInvoice?.issueDate || "");
  const [dueDate, setDueDate] = useState(existingInvoice?.dueDate || "");
  const [paymentTerms, setPaymentTerms] = useState<PaymentTerms | "">(
    (existingInvoice?.paymentTerms as PaymentTerms) || ""
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
  const [notes, setNotes] = useState<string>(() => {
    if (existingInvoice?.notes) return existingInvoice.notes;
    const sessionStudio = getCurrentSession()?.studioName;
    return `Thank you for your trust in ${sessionStudio || "our business"}. Please complete the payment before the due date.`;
  });

  useEffect(() => {
    if (existingInvoice) {
      setCustomerId(existingInvoice.customerId || initialCustomer?.id || "");
      setCustomerName(existingInvoice.customerName || initialCustomer?.name || "");
      setCustomerEmail(existingInvoice.customerEmail || initialCustomer?.email || "");
      setBillingAddress(
        existingInvoice.billingAddress || "Plot 14, Victoria Island Waterfront, Lagos, Nigeria"
      );
      setIssueDate(existingInvoice.issueDate || "");
      setDueDate(existingInvoice.dueDate || "");
      setPaymentTerms((existingInvoice.paymentTerms as PaymentTerms) || "");
      setCurrency(existingInvoice.currency || "NGN");
      setItems(
        existingInvoice.items && existingInvoice.items.length > 0
          ? existingInvoice.items
          : [
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
      setDiscount(existingInvoice.discount || 0);
      setTaxRate(existingInvoice.taxRate || 0);
      if (existingInvoice.notes) setNotes(existingInvoice.notes);
    } else if (initialCustomer) {
      setCustomerId(initialCustomer.id);
      setCustomerName(initialCustomer.name);
      setCustomerEmail(initialCustomer.email);
      setBillingAddress(
        initialCustomer.company
          ? `${initialCustomer.company}, Victoria Island, Lagos`
          : "Plot 14, Victoria Island Waterfront, Lagos, Nigeria"
      );
      setIssueDate("");
      setDueDate("");
      setPaymentTerms("");
      setCurrency("NGN");
      setItems([
        {
          id: "item-1",
          description: initialCustomer.services[0]?.name || "",
          quantity: 1,
          unit: "package",
          unitPrice: initialCustomer.services[0]?.amount || 45000,
          amount: initialCustomer.services[0]?.amount || 45000,
        },
      ]);
      setDiscount(0);
      setTaxRate(0);
    }
  }, [existingInvoice, initialCustomer]);

  useEffect(() => {
    if (!existingInvoice?.notes) {
      getBusinessProfile()
        .then(profile => {
          if (profile?.businessName) {
            setNotes(prev => {
              if (
                prev.includes("Thank you for your trust in") &&
                (prev.includes("our business") || prev.includes("Élan Atelier"))
              ) {
                return `Thank you for your trust in ${profile.businessName}. Please complete the payment before the due date.`;
              }
              return prev;
            });
          }
        })
        .catch(() => {});
    }
  }, [existingInvoice?.notes]);

  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [isMarkingPaid, setIsMarkingPaid] = useState(false);
  const [isMarkingUnpaid, setIsMarkingUnpaid] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);
  const [isSendingWhatsApp, setIsSendingWhatsApp] = useState(false);
  const [isCopyingLink, setIsCopyingLink] = useState(false);
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

  const buildPayload = (): InvoiceInput => {
    const cleanedItems = items.map((item, idx) => ({
      id: item.id || `item-${idx + 1}`,
      description: item.description?.trim() || `Service Item #${idx + 1}`,
      unit: item.unit?.trim() || "unit",
      quantity: Number(item.quantity) || 1,
      unitPrice: Number(item.unitPrice) || 0,
      amount: (Number(item.quantity) || 1) * (Number(item.unitPrice) || 0),
    }));

    return {
      id: existingInvoice?.id,
      invoiceNumber: existingInvoice?.invoiceNumber,
      customerId,
      customerName: customerName.trim(),
      customerEmail: customerEmail.trim().toLowerCase(),
      billingAddress: billingAddress.trim() || "Plot 14, Victoria Island, Lagos",
      issueDate: issueDate || new Date().toISOString().split("T")[0],
      dueDate:
        dueDate || new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      paymentTerms,
      currency,
      items: cleanedItems,
      subtotal,
      discount,
      taxRate,
      taxAmount,
      total,
      notes,
    };
  };

  const [currentInvoice, setCurrentInvoice] = useState<Invoice | undefined>(existingInvoice);

  useEffect(() => {
    setCurrentInvoice(existingInvoice);
  }, [existingInvoice]);

  const isFormDirty = useMemo(() => {
    if (!currentInvoice) return true;
    if (customerName.trim() !== currentInvoice.customerName) return true;
    if (customerEmail.trim().toLowerCase() !== currentInvoice.customerEmail) return true;
    if (billingAddress.trim() !== (currentInvoice.billingAddress || "")) return true;
    if (notes.trim() !== (currentInvoice.notes || "")) return true;
    if (paymentTerms !== currentInvoice.paymentTerms) return true;
    if (currency !== (currentInvoice.currency || "NGN")) return true;
    if (Number(discount) !== Number(currentInvoice.discount || 0)) return true;
    if (Number(taxRate) !== Number(currentInvoice.taxRate || 0)) return true;
    if (items.length !== (currentInvoice.items?.length || 0)) return true;
    return false;
  }, [
    currentInvoice,
    customerName,
    customerEmail,
    billingAddress,
    notes,
    paymentTerms,
    currency,
    discount,
    taxRate,
    items,
  ]);

  const handleSaveDraft = async () => {
    if (!customerName || !customerEmail) {
      onToast("Please provide both customer name and email.");
      return;
    }
    setIsSavingDraft(true);
    try {
      const saved = await saveInvoiceDraft(buildPayload());
      setCurrentInvoice(saved);
      onToast(`Invoice ${saved.invoiceNumber} saved as draft.`);
      if (onInvoiceSaved) onInvoiceSaved(saved);
      onClose();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to save invoice draft.";
      onToast(msg);
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
    onToast("Sending invoice via email...");
    try {
      const sent = await sendInvoice(buildPayload());
      setCurrentInvoice(sent);
      onToast(
        `Invoice ${sent.invoiceNumber} sent via email to ${sent.customerEmail} (${formatMoney(sent.total, currency)}).`
      );
      if (onInvoiceSaved) onInvoiceSaved(sent);
      onClose();
    } catch (err) {
      const msg =
        err instanceof Error
          ? err.message
          : "Failed to send invoice. Please verify customer email.";
      onToast(msg);
    } finally {
      setIsSending(false);
    }
  };

  const handleSendWhatsApp = async () => {
    if (!customerName) {
      onToast("Please provide customer name.");
      return;
    }

    // Synchronously open blank tab to guarantee popup blockers never block it
    const targetTab = typeof window !== "undefined" ? window.open("", "_blank") : null;

    setIsSendingWhatsApp(true);
    onToast("Generating PDF link and preparing WhatsApp dispatch...");
    try {
      let activeInvoice: Invoice;
      if (!currentInvoice?.id || isFormDirty) {
        activeInvoice = await saveInvoiceDraft(buildPayload());
        setCurrentInvoice(activeInvoice);
        if (onInvoiceSaved) onInvoiceSaved(activeInvoice);
      } else {
        activeInvoice = currentInvoice;
      }

      const pdfUrl = activeInvoice.pdfUrl || (await getInvoicePdfUrl(activeInvoice.id));
      if (pdfUrl && activeInvoice.pdfUrl !== pdfUrl) {
        activeInvoice = { ...activeInvoice, pdfUrl };
        setCurrentInvoice(activeInvoice);
      }

      const customerPhone = allCustomers.find(c => c.id === customerId)?.phone;
      const studioName = getCurrentSession()?.studioName;
      const waUrl = createWhatsAppInvoiceUrl(activeInvoice, customerPhone, studioName, pdfUrl);

      if (targetTab && !targetTab.closed) {
        targetTab.location.href = waUrl;
      } else if (typeof window !== "undefined") {
        window.open(waUrl, "_blank", "noopener,noreferrer");
      }

      onToast(`WhatsApp dispatch opened with PDF link for ${activeInvoice.customerName}.`);
    } catch (err) {
      if (targetTab && !targetTab.closed) {
        targetTab.close();
      }
      const msg =
        err instanceof Error ? err.message : "Failed to prepare WhatsApp invoice dispatch.";
      onToast(msg);
    } finally {
      setIsSendingWhatsApp(false);
    }
  };

  const handleMarkAsPaid = async () => {
    if (!currentInvoice?.id) return;
    setIsMarkingPaid(true);
    try {
      const updated = await markInvoiceAsPaid(currentInvoice.id);
      setCurrentInvoice(updated);
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
    if (!currentInvoice?.id) return;
    setIsMarkingUnpaid(true);
    try {
      const updated = await markInvoiceAsUnpaid(currentInvoice.id);
      setCurrentInvoice(updated);
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
    if (!customerName) {
      onToast("Please provide customer name before generating PDF.");
      return;
    }
    setIsDownloadingPdf(true);
    try {
      let activeInvoice: Invoice;
      if (!currentInvoice?.id || isFormDirty) {
        onToast("Saving latest invoice details and preparing fresh PDF...");
        activeInvoice = await saveInvoiceDraft(buildPayload());
        setCurrentInvoice(activeInvoice);
        if (onInvoiceSaved) onInvoiceSaved(activeInvoice);
      } else {
        activeInvoice = currentInvoice;
        onToast("Generating invoice PDF document...");
      }

      const pdfUrl = activeInvoice.pdfUrl || (await getInvoicePdfUrl(activeInvoice.id));
      if (pdfUrl && activeInvoice.pdfUrl !== pdfUrl) {
        activeInvoice = { ...activeInvoice, pdfUrl };
        setCurrentInvoice(activeInvoice);
      }

      await downloadInvoicePdf(activeInvoice);
      onToast("Invoice PDF ready & downloaded.");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to generate invoice PDF.";
      onToast(msg);
    } finally {
      setIsDownloadingPdf(false);
    }
  };

  const handleCopyLink = async () => {
    setIsCopyingLink(true);
    try {
      let activeInvoice = currentInvoice;
      if (!activeInvoice?.id) {
        onToast("Saving draft to generate link...");
        activeInvoice = await saveInvoiceDraft(buildPayload());
        setCurrentInvoice(activeInvoice);
        if (onInvoiceSaved) onInvoiceSaved(activeInvoice);
      }
      onToast("Retrieving PDF invoice link...");
      const pdfUrl = activeInvoice.pdfUrl || (await getInvoicePdfUrl(activeInvoice.id));
      if (pdfUrl && activeInvoice.pdfUrl !== pdfUrl) {
        activeInvoice = { ...activeInvoice, pdfUrl };
        setCurrentInvoice(activeInvoice);
      }
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(pdfUrl);
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 2000);
        onToast("PDF Invoice link copied to clipboard.");
      }
    } catch {
      onToast("Failed to copy PDF link.");
    } finally {
      setIsCopyingLink(false);
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
    isSendingWhatsApp,
    isCopyingLink,
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
