import type { CurrencyCode } from "./common";
import type { Customer } from "./customer";

// Invoice types
export type InvoiceStatus = "draft" | "sent" | "paid" | "cancelled";
export type PaymentTerms = "Due on receipt" | "Net 14" | "Net 30" | "Net 60";

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  amount: number;
}

export interface Invoice {
  id: string;
  businessId?: string;
  invoiceNumber: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  billingAddress: string;
  issueDate: string;
  dueDate: string;
  paymentTerms: PaymentTerms;
  currency?: CurrencyCode;
  items: InvoiceItem[];
  subtotal: number;
  discount: number;
  taxRate: number;
  taxAmount: number;
  total: number;
  notes: string;
  status: InvoiceStatus;
  sentAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface InvoiceInput {
  id?: string;
  invoiceNumber?: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  billingAddress: string;
  issueDate: string;
  dueDate: string;
  paymentTerms: PaymentTerms;
  currency?: CurrencyCode;
  items: InvoiceItem[];
  subtotal: number;
  discount: number;
  taxRate: number;
  taxAmount: number;
  total: number;
  notes: string;
  status?: InvoiceStatus;
}

export interface InvoiceModalProps {
  initialCustomer?: Customer;
  existingInvoice?: Invoice;
  allCustomers?: Customer[];
  isOpen: boolean;
  onClose: () => void;
  onToast: (msg: string) => void;
  onInvoiceSaved?: (invoice: Invoice) => void;
}

export interface InvoiceModalHeaderProps {
  existingInvoice?: Invoice;
  isSavingDraft: boolean;
  isSending: boolean;
  isResending: boolean;
  isDownloadingPdf: boolean;
  isMarkingPaid: boolean;
  isMarkingUnpaid: boolean;
  isDeleting: boolean;
  copiedLink: boolean;
  onClose: () => void;
  onSaveDraft: () => void;
  onSendInvoice: () => void;
  onResendInvoice: () => void;
  onDownloadPdf: () => void;
  onSendWhatsApp: () => void;
  onCopyLink: () => void;
  onMarkAsPaid: () => void;
  onMarkAsUnpaid: () => void;
  onDeleteInvoice: () => void;
}

export interface InvoiceFormFieldsProps {
  customerId: string;
  customerName: string;
  customerEmail: string;
  billingAddress: string;
  issueDate: string;
  dueDate: string;
  paymentTerms: PaymentTerms;
  currency: CurrencyCode;
  items: InvoiceItem[];
  discount: number;
  taxRate: number;
  total: number;
  notes: string;
  allCustomers: Customer[];
  setCustomerName: (v: string) => void;
  setBillingAddress: (v: string) => void;
  setIssueDate: (v: string) => void;
  setDueDate: (v: string) => void;
  setPaymentTerms: (v: PaymentTerms) => void;
  setCurrency: (v: CurrencyCode) => void;
  setDiscount: (v: number) => void;
  setTaxRate: (v: number) => void;
  setNotes: (v: string) => void;
  handleCustomerChange: (id: string) => void;
  handleItemChange: (id: string, field: keyof InvoiceItem, val: string | number) => void;
  handleAddItem: () => void;
  handleRemoveItem: (id: string) => void;
}

export interface InvoiceItemsTableProps {
  items: InvoiceItem[];
  currency: CurrencyCode;
  onItemChange: (id: string, field: keyof InvoiceItem, value: string | number) => void;
  onAddItem: () => void;
  onRemoveItem: (id: string) => void;
}

export interface InvoiceSummaryProps {
  discount: number;
  taxRate: number;
  total: number;
  currency: CurrencyCode;
  notes: string;
  onDiscountChange: (val: number) => void;
  onTaxRateChange: (val: number) => void;
  onNotesChange: (val: string) => void;
}

export interface InvoicePreviewProps {
  existingInvoice?: Invoice;
  customerName: string;
  billingAddress: string;
  issueDate: string;
  dueDate: string;
  paymentTerms: PaymentTerms;
  currency: CurrencyCode;
  items: InvoiceItem[];
  subtotal: number;
  discount: number;
  taxRate: number;
  taxAmount: number;
  total: number;
  notes: string;
  copiedLink: boolean;
  onCopyLink: () => void;
}

export interface UseInvoiceFormOptions {
  initialCustomer?: Customer;
  existingInvoice?: Invoice;
  allCustomers?: Customer[];
  onToast: (msg: string) => void;
  onInvoiceSaved?: (invoice: Invoice) => void;
  onClose: () => void;
}
