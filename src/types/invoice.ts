import type { CurrencyCode } from "./common";

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
