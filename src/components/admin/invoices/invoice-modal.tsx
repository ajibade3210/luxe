"use client";

import { useInvoiceForm } from "@/hooks/use-invoice-form";
import type { Invoice } from "@/lib/api";
import type { Customer } from "@/types";
import { InvoiceFormFields } from "./invoice-form-fields";
import { InvoiceModalHeader } from "./invoice-modal-header";
import { InvoicePreview } from "./invoice-preview";

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

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-[#f8f9fa] border border-[#e5e7eb] rounded-3xl max-w-7xl w-full max-h-[94vh] shadow-2xl overflow-hidden flex flex-col my-auto"
        onClick={e => e.stopPropagation()}
      >
        <InvoiceModalHeader
          existingInvoice={existingInvoice}
          isSavingDraft={isSavingDraft}
          isSending={isSending}
          isResending={isResending}
          isDownloadingPdf={isDownloadingPdf}
          isMarkingPaid={isMarkingPaid}
          isMarkingUnpaid={isMarkingUnpaid}
          isDeleting={isDeleting}
          copiedLink={copiedLink}
          onClose={onClose}
          onSaveDraft={handleSaveDraft}
          onSendInvoice={handleSendInvoice}
          onResendInvoice={handleResendInvoice}
          onDownloadPdf={handleDownloadPdf}
          onSendWhatsApp={handleSendWhatsApp}
          onCopyLink={handleCopyLink}
          onMarkAsPaid={handleMarkAsPaid}
          onMarkAsUnpaid={handleMarkAsUnpaid}
          onDeleteInvoice={handleDeleteInvoice}
        />

        <div className="flex-1 overflow-y-auto p-6 sm:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-7 space-y-6">
              <InvoiceFormFields
                customerId={customerId}
                customerName={customerName}
                customerEmail={customerEmail}
                billingAddress={billingAddress}
                issueDate={issueDate}
                dueDate={dueDate}
                paymentTerms={paymentTerms}
                currency={currency}
                items={items}
                discount={discount}
                taxRate={taxRate}
                total={total}
                notes={notes}
                allCustomers={allCustomers}
                setCustomerName={setCustomerName}
                setBillingAddress={setBillingAddress}
                setIssueDate={setIssueDate}
                setDueDate={setDueDate}
                setPaymentTerms={setPaymentTerms}
                setCurrency={setCurrency}
                setDiscount={setDiscount}
                setTaxRate={setTaxRate}
                setNotes={setNotes}
                handleCustomerChange={handleCustomerChange}
                handleItemChange={handleItemChange}
                handleAddItem={handleAddItem}
                handleRemoveItem={handleRemoveItem}
              />
            </div>

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
