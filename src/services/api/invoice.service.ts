/**
 * Invoice Domain Service
 * Handles invoice creation, draft persistence, dispatching, resending, and deletion.
 * Every action includes a 1-line swap for real REST/GraphQL backend APIs.
 */

import type { Invoice, InvoiceItem, InvoiceStatus, PaymentTerms } from "@/lib/types";

export type { Invoice, InvoiceItem, InvoiceStatus, PaymentTerms };

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
  items: InvoiceItem[];
  subtotal: number;
  discount: number;
  taxRate: number;
  taxAmount: number;
  total: number;
  notes: string;
  status?: InvoiceStatus;
}

const INITIAL_INVOICES: Invoice[] = [
  {
    id: "inv-101",
    invoiceNumber: "INV-2026-001",
    customerId: "c1",
    customerName: "Amara & David Sterling",
    customerEmail: "amara@sterling.com",
    billingAddress: "42 Victoria Island Boulevard, Lagos, Nigeria",
    issueDate: "2026-08-20",
    dueDate: "2026-09-03",
    paymentTerms: "Net 14",
    items: [
      {
        id: "item-1",
        description: "Full Wedding Production & Creative Scenography",
        quantity: 1,
        unit: "package",
        unitPrice: 38000,
        amount: 38000,
      },
      {
        id: "item-2",
        description: "Bespoke Floral Installation & Lighting Architecture",
        quantity: 1,
        unit: "package",
        unitPrice: 7000,
        amount: 7000,
      },
    ],
    subtotal: 45000,
    discount: 0,
    taxRate: 0,
    taxAmount: 0,
    total: 45000,
    notes:
      "Thank you for your trust in Élan Atelier. Initial retainer deposit confirmed; balance due prior to production commencement.",
    status: "paid",
    sentAt: "2026-08-20T10:15:00Z",
    createdAt: "2026-08-20T09:00:00Z",
    updatedAt: "2026-08-20T10:15:00Z",
  },
  {
    id: "inv-102",
    invoiceNumber: "INV-2026-002",
    customerId: "c2",
    customerName: "Tunde & Folake Balogun",
    customerEmail: "tunde@balogun.ng",
    billingAddress: "15 Ikoyi Crescent, Ikoyi, Lagos",
    issueDate: "2026-08-24",
    dueDate: "2026-09-07",
    paymentTerms: "Net 14",
    items: [
      {
        id: "item-3",
        description: "Executive Corporate Gala Production & Hospitality Curation",
        quantity: 1,
        unit: "event",
        unitPrice: 35000,
        amount: 35000,
      },
    ],
    subtotal: 35000,
    discount: 0,
    taxRate: 0,
    taxAmount: 0,
    total: 35000,
    notes: "Please remit payment to the specified studio account before the due date.",
    status: "sent",
    sentAt: "2026-08-24T14:30:00Z",
    createdAt: "2026-08-24T11:00:00Z",
    updatedAt: "2026-08-24T14:30:00Z",
  },
];

let persistedInvoices: Invoice[] = [...INITIAL_INVOICES];

const delay = (ms = 150) => new Promise(resolve => setTimeout(resolve, ms));

function notifyInvoicesUpdated() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent("luxe_invoices_updated", {
        detail: persistedInvoices,
      })
    );
  }
}

/**
 * 1. Fetch all invoices
 * Backend swap:
 * `const res = await fetch('/api/invoices'); return res.json();`
 */
export async function getInvoices(): Promise<Invoice[]> {
  await delay(100);
  return persistedInvoices;
}

/**
 * 2. Fetch single invoice by ID
 * Backend swap:
 * `const res = await fetch(`/api/invoices/${id}`); return res.json();`
 */
export async function getInvoice(id: string): Promise<Invoice | undefined> {
  await delay(100);
  return persistedInvoices.find(inv => inv.id === id);
}

/**
 * 3. Fetch invoices by customer ID
 * Backend swap:
 * `const res = await fetch(`/api/customers/${customerId}/invoices`); return res.json();`
 */
export async function getInvoicesByCustomer(customerId: string): Promise<Invoice[]> {
  await delay(100);
  return persistedInvoices.filter(inv => inv.customerId === customerId);
}

/**
 * 4. Save Invoice as DRAFT (Create new draft or update existing draft)
 * Backend swap:
 * `const res = await fetch('/api/invoices/draft', { method: 'POST', body: JSON.stringify(input) }); return res.json();`
 */
export async function saveInvoiceDraft(input: InvoiceInput): Promise<Invoice> {
  await delay(200);

  const existingIdx = input.id ? persistedInvoices.findIndex(i => i.id === input.id) : -1;
  const now = new Date().toISOString();

  if (existingIdx >= 0) {
    const existing = persistedInvoices[existingIdx];
    const updated: Invoice = {
      ...existing,
      ...input,
      id: existing.id,
      invoiceNumber: existing.invoiceNumber,
      status: "draft",
      updatedAt: now,
    };
    persistedInvoices[existingIdx] = updated;
    notifyInvoicesUpdated();
    return updated;
  }

  const newId = `inv-${Date.now()}`;
  const newInvoiceNumber =
    input.invoiceNumber ||
    `INV-${new Date().getFullYear()}-${String(persistedInvoices.length + 1).padStart(3, "0")}`;

  const newInvoice: Invoice = {
    id: newId,
    invoiceNumber: newInvoiceNumber,
    customerId: input.customerId,
    customerName: input.customerName,
    customerEmail: input.customerEmail,
    billingAddress: input.billingAddress,
    issueDate: input.issueDate,
    dueDate: input.dueDate,
    paymentTerms: input.paymentTerms,
    items: input.items,
    subtotal: input.subtotal,
    discount: input.discount,
    taxRate: input.taxRate,
    taxAmount: input.taxAmount,
    total: input.total,
    notes: input.notes,
    status: "draft",
    createdAt: now,
    updatedAt: now,
  };

  persistedInvoices = [newInvoice, ...persistedInvoices];
  notifyInvoicesUpdated();
  return newInvoice;
}

/**
 * 5. Send Invoice (Save and mark status as 'sent')
 * Backend swap:
 * `const res = await fetch('/api/invoices/send', { method: 'POST', body: JSON.stringify(input) }); return res.json();`
 */
export async function sendInvoice(input: InvoiceInput): Promise<Invoice> {
  await delay(300);

  const existingIdx = input.id ? persistedInvoices.findIndex(i => i.id === input.id) : -1;
  const now = new Date().toISOString();

  if (existingIdx >= 0) {
    const existing = persistedInvoices[existingIdx];
    const updated: Invoice = {
      ...existing,
      ...input,
      id: existing.id,
      invoiceNumber: existing.invoiceNumber,
      status: "sent",
      sentAt: now,
      updatedAt: now,
    };
    persistedInvoices[existingIdx] = updated;
    notifyInvoicesUpdated();
    return updated;
  }

  const newId = `inv-${Date.now()}`;
  const newInvoiceNumber =
    input.invoiceNumber ||
    `INV-${new Date().getFullYear()}-${String(persistedInvoices.length + 1).padStart(3, "0")}`;

  const newInvoice: Invoice = {
    id: newId,
    invoiceNumber: newInvoiceNumber,
    customerId: input.customerId,
    customerName: input.customerName,
    customerEmail: input.customerEmail,
    billingAddress: input.billingAddress,
    issueDate: input.issueDate,
    dueDate: input.dueDate,
    paymentTerms: input.paymentTerms,
    items: input.items,
    subtotal: input.subtotal,
    discount: input.discount,
    taxRate: input.taxRate,
    taxAmount: input.taxAmount,
    total: input.total,
    notes: input.notes,
    status: "sent",
    sentAt: now,
    createdAt: now,
    updatedAt: now,
  };

  persistedInvoices = [newInvoice, ...persistedInvoices];
  notifyInvoicesUpdated();
  return newInvoice;
}

/**
 * 6. Resend Invoice (Re-dispatch email delivery to customer)
 * Backend swap:
 * `const res = await fetch(`/api/invoices/${id}/resend`, { method: 'POST' }); return res.json();`
 */
export async function resendInvoice(id: string): Promise<Invoice> {
  await delay(250);

  const idx = persistedInvoices.findIndex(i => i.id === id);
  if (idx < 0) {
    throw new Error(`Invoice with id ${id} not found.`);
  }

  const now = new Date().toISOString();
  const updated: Invoice = {
    ...persistedInvoices[idx],
    status: "sent",
    sentAt: now,
    updatedAt: now,
  };

  persistedInvoices[idx] = updated;
  notifyInvoicesUpdated();
  return updated;
}

/**
 * 7. Delete Invoice (Only permitted if invoice is NOT SENT / is 'draft')
 * Backend swap:
 * `const res = await fetch(`/api/invoices/${id}`, { method: 'DELETE' }); return res.json();`
 */
export async function deleteInvoice(id: string): Promise<{ success: boolean; id: string }> {
  await delay(200);

  const target = persistedInvoices.find(i => i.id === id);
  if (!target) {
    throw new Error(`Invoice ${id} not found.`);
  }

  if (target.status !== "draft") {
    throw new Error(
      `Cannot delete an invoice with status '${target.status}'. Only unsent draft invoices can be deleted.`
    );
  }

  persistedInvoices = persistedInvoices.filter(i => i.id !== id);
  notifyInvoicesUpdated();
  return { success: true, id };
}
