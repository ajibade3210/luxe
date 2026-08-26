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

  let existingIdx = input.id ? persistedInvoices.findIndex(i => i.id === input.id) : -1;

  // RULE: If invoice is for a Lead (lead IDs start with 'l'), override and replace the last invoice for that lead
  if (existingIdx < 0 && input.customerId?.startsWith("l")) {
    existingIdx = persistedInvoices.findIndex(
      i => i.customerId === input.customerId || i.customerEmail === input.customerEmail
    );
  }

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

  let existingIdx = input.id ? persistedInvoices.findIndex(i => i.id === input.id) : -1;

  // RULE: If invoice is for a Lead (lead IDs start with 'l'), override and replace the last invoice for that lead
  if (existingIdx < 0 && input.customerId?.startsWith("l")) {
    existingIdx = persistedInvoices.findIndex(
      i => i.customerId === input.customerId || i.customerEmail === input.customerEmail
    );
  }

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

/**
 * 8. Generate Invoice PDF URL
 * Backend generates the PDF and returns a hosted or blob URL.
 * Backend swap:
 * `const res = await fetch(`/api/invoices/${id}/pdf`); const data = await res.json(); return data.url;`
 */
export async function generateInvoicePdfUrl(id: string): Promise<string> {
  await delay(300);
  const target = persistedInvoices.find(i => i.id === id);
  const invoiceNum = target ? target.invoiceNumber : "INV-2026";

  if (typeof window === "undefined") {
    return `https://shopwus.com/invoices/${invoiceNum}.pdf`;
  }

  // Create an interactive printable document blob URL
  const htmlContent = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>Invoice ${invoiceNum} - Élan Atelier</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; color: #111827; margin: 40px; }
    .header { display: flex; justify-content: space-between; border-bottom: 2px solid #f3f4f6; padding-bottom: 20px; }
    .title { font-size: 24px; font-weight: bold; }
    .badge { color: #855e2e; font-size: 12px; font-weight: bold; text-transform: uppercase; }
    .meta { margin-top: 24px; display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; font-size: 12px; }
    .table { width: 100%; border-collapse: collapse; margin-top: 30px; }
    .table th, .table td { text-align: left; padding: 10px; border-bottom: 1px solid #f3f4f6; font-size: 12px; }
    .total-box { margin-top: 20px; text-align: right; font-size: 14px; font-weight: bold; }
    .bank-box { margin-top: 30px; background: #fafaf9; padding: 16px; border-radius: 12px; font-size: 11px; border: 1px solid #eee7dc; }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <div class="title">Élan Atelier</div>
      <div style="font-size: 12px; color: #6b7280; margin-top: 4px;">Luxury Event Scenography & Production</div>
    </div>
    <div style="text-align: right;">
      <div class="badge">${target?.status || "INVOICE"}</div>
      <div style="font-size: 16px; font-weight: bold; margin-top: 4px;">${invoiceNum}</div>
    </div>
  </div>
  <div class="meta">
    <div><b>Billed by:</b><br/>Élan Atelier Limited<br/>Victoria Island, Lagos</div>
    <div><b>Billed to:</b><br/>${target?.customerName || "Client"}<br/>${target?.billingAddress || ""}</div>
    <div><b>Dates:</b><br/>Issue: ${target?.issueDate || ""}<br/>Due: ${target?.dueDate || ""}<br/>Terms: ${target?.paymentTerms || "Net 14"}</div>
  </div>
  <table class="table">
    <thead>
      <tr style="color: #6b7280;">
        <th>Item Description</th>
        <th>QTY</th>
        <th>Rate</th>
        <th style="text-align: right;">Amount</th>
      </tr>
    </thead>
    <tbody>
      ${(target?.items || [])
        .map(
          item => `
        <tr>
          <td><b>${item.description}</b></td>
          <td>${item.quantity}</td>
          <td>$${item.unitPrice.toLocaleString()}</td>
          <td style="text-align: right;">$${item.amount.toLocaleString()}</td>
        </tr>
      `
        )
        .join("")}
    </tbody>
  </table>
  <div class="total-box">
    <div>Total Due: $${(target?.total || 0).toLocaleString()}</div>
  </div>
  <div class="bank-box">
    <b>Remittance Banking Details</b><br/>
    Bank: Standard Chartered Bank · Account Name: Élan Events Atelier Ltd · Account Number: 0039281745
  </div>
  <script>window.print();</script>
</body>
</html>`;

  const blob = new Blob([htmlContent], { type: "text/html" });
  return URL.createObjectURL(blob);
}

/**
 * 9. Trigger Direct PDF Download / Print View
 */
export async function downloadInvoicePdf(id: string): Promise<void> {
  const url = await generateInvoicePdfUrl(id);
  if (typeof window !== "undefined") {
    const printWindow = window.open(url, "_blank");
    if (!printWindow) {
      const a = document.createElement("a");
      a.href = url;
      a.download = `invoice-${id}.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  }
}

/**
 * 10. Generate WhatsApp Invoice Link with Remittance Info & Public View Link
 */
export function createWhatsAppInvoiceUrl(
  invoice: Invoice,
  studioPhone?: string,
  studioName = "Élan Atelier"
): string {
  const defaultPhone = "+2348055966944";
  const rawPhone = (invoice.customerId || studioPhone || defaultPhone).replace(/[^0-9]/g, "");
  const targetPhone = rawPhone.length >= 7 ? rawPhone : "2348055966944";

  const publicUrl = `${typeof window !== "undefined" ? window.location.origin : "https://shopwus.com"}/invoices/${invoice.invoiceNumber}`;

  const message = `✨ *Invoice ${invoice.invoiceNumber} — ${studioName}*
━━━━━━━━━━━━━━━━━━━━━
Dear *${invoice.customerName}*,

Here are your invoice details for *${invoice.items[0]?.description || "Atelier Services"}*:

💰 *Total Amount Due:* $${Number(invoice.total).toLocaleString()}
📅 *Due Date:* ${invoice.dueDate}
📄 *Payment Terms:* ${invoice.paymentTerms}

🔗 *View / Download Invoice:*
${publicUrl}

🏦 *Remittance Banking Details:*
• Bank Name: Standard Chartered Bank
• Account Name: Élan Events Atelier Ltd
• Account Number: 0039281745

Please review and notify us once payment is remitted. Thank you for your partnership!
━━━━━━━━━━━━━━━━━━━━━
_Sent via ${studioName}_`;

  return `https://wa.me/${targetPhone}?text=${encodeURIComponent(message)}`;
}

/**
 * 11. Send Invoice Via Email Dispatch
 * Backend swap:
 * `const res = await fetch(`/api/invoices/${id}/send-email`, { method: 'POST' }); return res.json();`
 */
export async function sendInvoiceViaEmail(
  id: string
): Promise<{ success: boolean; recipient: string; invoiceNumber: string }> {
  await delay(350);
  const target = persistedInvoices.find(i => i.id === id);
  if (!target) throw new Error(`Invoice ${id} not found.`);

  return {
    success: true,
    recipient: target.customerEmail,
    invoiceNumber: target.invoiceNumber,
  };
}
