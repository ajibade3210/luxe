import { describe, expect, it } from "vitest";
import {
  deleteInvoice,
  getInvoiceById,
  getInvoices,
  markInvoiceAsPaid,
  markInvoiceAsUnpaid,
  saveInvoiceDraft,
  sendInvoice,
} from "../invoice.service";

describe("invoice service", () => {
  it("fetches list of initial invoices", async () => {
    const list = await getInvoices();
    expect(Array.isArray(list)).toBe(true);
    expect(list.length).toBeGreaterThan(0);
  });

  it("saves a new invoice draft with computed amounts", async () => {
    const draft = await saveInvoiceDraft({
      customerId: "c-test",
      customerName: "Test Client",
      customerEmail: "test@example.com",
      billingAddress: "Lagos, Nigeria",
      issueDate: "2026-08-26",
      dueDate: "2026-09-10",
      paymentTerms: "Net 14",
      currency: "USD",
      items: [
        {
          id: "item-1",
          description: "Floral Styling",
          quantity: 2,
          unit: "set",
          unitPrice: 500,
          amount: 1000,
        },
      ],
      subtotal: 1000,
      discount: 100,
      taxRate: 5,
      taxAmount: 45,
      total: 945,
      notes: "Test notes",
    });

    expect(draft.status).toBe("draft");
    expect(draft.customerName).toBe("Test Client");
    expect(draft.total).toBe(945);
    expect(draft.invoiceNumber).toContain("INV-");

    const fetched = await getInvoiceById(draft.id);
    expect(fetched).toBeDefined();
    expect(fetched?.id).toBe(draft.id);
  });

  it("sends an invoice and marks status as sent", async () => {
    const sent = await sendInvoice({
      customerId: "c-test-send",
      customerName: "Send Test Client",
      customerEmail: "send@example.com",
      billingAddress: "Victoria Island",
      issueDate: "2026-08-26",
      dueDate: "2026-09-10",
      paymentTerms: "Due on receipt",
      items: [
        {
          id: "item-1",
          description: "Lighting",
          quantity: 1,
          unit: "pkg",
          unitPrice: 2000,
          amount: 2000,
        },
      ],
      subtotal: 2000,
      discount: 0,
      taxRate: 0,
      taxAmount: 0,
      total: 2000,
      notes: "Immediate dispatch",
    });

    expect(sent.status).toBe("sent");
    expect(sent.sentAt).toBeDefined();
  });

  it("marks sent invoice as paid and can revert to unpaid", async () => {
    const sent = await sendInvoice({
      customerId: "c-paid-test",
      customerName: "Payment Test",
      customerEmail: "pay@example.com",
      billingAddress: "Ikoyi",
      issueDate: "2026-08-26",
      dueDate: "2026-09-10",
      paymentTerms: "Net 30",
      items: [
        {
          id: "item-1",
          description: "Gala Setup",
          quantity: 1,
          unit: "event",
          unitPrice: 15000,
          amount: 15000,
        },
      ],
      subtotal: 15000,
      discount: 0,
      taxRate: 0,
      taxAmount: 0,
      total: 15000,
      notes: "Payment status test",
    });

    const paid = await markInvoiceAsPaid(sent.id);
    expect(paid.status).toBe("paid");

    const unpaid = await markInvoiceAsUnpaid(sent.id);
    expect(unpaid.status).toBe("sent");
  });

  it("deletes a draft invoice", async () => {
    const draft = await saveInvoiceDraft({
      customerId: "c-del-test",
      customerName: "Delete Test",
      customerEmail: "del@example.com",
      billingAddress: "Lagos",
      issueDate: "2026-08-26",
      dueDate: "2026-09-10",
      paymentTerms: "Net 14",
      items: [
        {
          id: "item-1",
          description: "Consultation",
          quantity: 1,
          unit: "session",
          unitPrice: 1000,
          amount: 1000,
        },
      ],
      subtotal: 1000,
      discount: 0,
      taxRate: 0,
      taxAmount: 0,
      total: 1000,
      notes: "Draft to delete",
    });

    const result = await deleteInvoice(draft.id);
    expect(result.success).toBe(true);

    const fetched = await getInvoiceById(draft.id);
    expect(fetched).toBeUndefined();
  });
});
