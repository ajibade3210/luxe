import { APP_CONFIG } from "@/constants";
import { apiClient } from "@/lib/api-client";
import { InvoiceInputSchema } from "@/lib/schemas";
import type { Invoice, InvoiceInput, InvoiceStatus } from "@/types";
import { CURRENCY_SYMBOLS } from "@/utils";

/**
 * 1. Get All Invoices (Searchable, Filterable by status & customerId)
 */
export async function getInvoices(status?: InvoiceStatus): Promise<Invoice[]> {
  const data = await apiClient.get<Invoice[] | { invoices: Invoice[] }>("/invoices", {
    status,
  });
  return Array.isArray(data) ? data : data?.invoices || [];
}

export interface InvoicesSummary {
  totalInvoiced: number;
  paidRevenue: number;
  outstandingRevenue: number;
  totalCount: number;
  paidCount: number;
  collectionRate: number;
}

export async function getInvoicesSummary(): Promise<InvoicesSummary> {
  return apiClient.get<InvoicesSummary>("/invoices/summary");
}

/**
 * 2. Get Single Invoice by ID
 */
export async function getInvoiceById(id: string): Promise<Invoice> {
  return apiClient.get<Invoice>(`/invoices/${encodeURIComponent(id)}`);
}

/**
 * 3. Get Invoices for a specific Customer / Lead
 */
export async function getInvoicesByCustomerId(customerId: string): Promise<Invoice[]> {
  const data = await apiClient.get<Invoice[] | { invoices: Invoice[] }>("/invoices", {
    customerId,
  });
  return Array.isArray(data) ? data : data?.invoices || [];
}

/**
 * 4. Create or Save Draft Invoice
 */
export async function saveInvoiceDraft(input: InvoiceInput): Promise<Invoice> {
  const validated = InvoiceInputSchema.parse(input);
  if (validated.id && !validated.id.startsWith("inv-new-")) {
    return apiClient.put<Invoice>(`/invoices/${encodeURIComponent(validated.id)}`, {
      ...validated,
      status: "draft",
    });
  }
  return apiClient.post<Invoice>("/invoices", {
    ...validated,
    status: "draft",
  });
}

/**
 * 5. Send Invoice (Creates/updates and triggers email dispatch)
 */
export async function sendInvoice(input: InvoiceInput): Promise<Invoice> {
  const validated = InvoiceInputSchema.parse(input);
  if (validated.id && !validated.id.startsWith("inv-new-")) {
    await apiClient.put<Invoice>(`/invoices/${encodeURIComponent(validated.id)}`, {
      ...validated,
      status: "sent",
    });
    return apiClient.post<Invoice>(`/invoices/${encodeURIComponent(validated.id)}/send`);
  }
  const created = await apiClient.post<Invoice>("/invoices", {
    ...validated,
    status: "sent",
  });
  return created;
}

/**
 * 6. Resend Invoice (Re-dispatch email delivery to customer)
 */
export async function resendInvoice(id: string): Promise<Invoice> {
  return apiClient.post<Invoice>(`/invoices/${encodeURIComponent(id)}/send`);
}

/**
 * 7. Delete Invoice
 */
export async function deleteInvoice(id: string): Promise<{ success: boolean; id: string }> {
  return apiClient.delete(`/invoices/${encodeURIComponent(id)}`);
}

/**
 * 8. Mark Invoice as Paid
 */
export async function markInvoiceAsPaid(id: string): Promise<Invoice> {
  return apiClient.patch<Invoice>(`/invoices/${encodeURIComponent(id)}/status`, {
    status: "paid",
  });
}

/**
 * 9. Mark Invoice as Unpaid
 */
export async function markInvoiceAsUnpaid(id: string): Promise<Invoice> {
  return apiClient.patch<Invoice>(`/invoices/${encodeURIComponent(id)}/status`, {
    status: "sent",
  });
}

/**
 * 10. Generate Invoice PDF URL (Streamed directly from backend Puppeteer engine)
 */
export async function generateInvoicePdfUrl(id: string): Promise<string> {
  const pdfBlob = await apiClient.get<Blob>(`/invoices/${encodeURIComponent(id)}/pdf`);
  if (typeof window !== "undefined") {
    return URL.createObjectURL(pdfBlob);
  }
  return `/api/v1/invoices/${id}/pdf`;
}

/**
 * 11. Download Invoice PDF in browser
 */
export async function downloadInvoicePdf(invoice: Invoice | string): Promise<void> {
  const id = typeof invoice === "string" ? invoice : invoice.id;
  const invoiceNumber = typeof invoice === "string" ? invoice : invoice.invoiceNumber;
  const url = await generateInvoicePdfUrl(id);

  if (typeof window !== "undefined") {
    const link = document.createElement("a");
    link.href = url;
    link.download = `${invoiceNumber}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}

/**
 * 12. Generates pre-formatted WhatsApp brief for billing notice
 */
export function createWhatsAppInvoiceUrl(invoice: Invoice, studioPhone?: string): string {
  const defaultPhone = APP_CONFIG.defaultStudioPhone.replace(/[^0-9]/g, "");
  const rawPhone = (studioPhone || defaultPhone).replace(/[^0-9]/g, "");
  const targetPhone = rawPhone.length >= 7 ? rawPhone : defaultPhone;
  const sym = CURRENCY_SYMBOLS[invoice.currency || "NGN"] || "₦";

  const message = `📄 *Invoice ${invoice.invoiceNumber} — ${APP_CONFIG.name}*
━━━━━━━━━━━━━━━━━━━━━
👤 *Billed To:* ${invoice.customerName}
💰 *Total Due:* ${sym}${invoice.total.toLocaleString()}
📅 *Due Date:* ${invoice.dueDate}
⏳ *Payment Terms:* ${invoice.paymentTerms}

Thank you for choosing ${APP_CONFIG.name}. Please confirm receipt of your invoice.
━━━━━━━━━━━━━━━━━━━━━`;

  return `https://wa.me/${targetPhone}?text=${encodeURIComponent(message)}`;
}

/**
 * 13. Export Invoices Ledger as CSV
 */
export async function exportInvoicesCSV(): Promise<{ count: number; filename: string }> {
  const csvData = await apiClient.get<string>("/invoices/export");
  const filename = `shopwus-invoices-${new Date().toISOString().split("T")[0]}.csv`;

  if (typeof window !== "undefined") {
    const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  const count = typeof csvData === "string" ? Math.max(csvData.split("\n").length - 1, 0) : 0;
  return { count, filename };
}
