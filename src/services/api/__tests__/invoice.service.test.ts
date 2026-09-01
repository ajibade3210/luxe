import { describe, expect, it, vi } from "vitest";
import { apiClient } from "@/lib/api-client";
import type { Invoice } from "@/types";
import {
  deleteInvoice,
  getInvoices,
  markInvoiceAsPaid,
  markInvoiceAsUnpaid,
  saveInvoiceDraft,
  sendInvoice,
} from "../invoice.service";

describe("invoice service", () => {
  it("fetches list of initial invoices", async () => {
    const mockInvoices: Invoice[] = [
      {
        id: "inv-101",
        businessId: "atelier-forma",
        invoiceNumber: "INV-2026-001",
        customerId: "cust-1",
        customerName: "Folake Doherty",
        customerEmail: "folake@dohertyholdings.com",
        billingAddress: "Lagos, Nigeria",
        items: [
          {
            id: "item-1",
            description: "Bespoke Styling",
            quantity: 1,
            unit: "pkg",
            unitPrice: 75000,
            amount: 75000,
          },
        ],
        subtotal: 75000,
        discount: 0,
        taxRate: 0,
        taxAmount: 0,
        total: 75000,
        notes: "Please pay before due date",
        issueDate: "2026-08-01",
        dueDate: "2026-08-15",
        paymentTerms: "Due on receipt",
        status: "paid",
        createdAt: "2026-08-01T10:00:00Z",
        updatedAt: "2026-08-01T10:00:00Z",
      },
    ];
    vi.spyOn(apiClient, "get").mockResolvedValueOnce(mockInvoices);

    const list = await getInvoices();
    expect(Array.isArray(list)).toBe(true);
    expect(list.length).toBe(1);
    expect(list[0].invoiceNumber).toBe("INV-2026-001");
  });

  it("saves a new invoice draft with computed amounts", async () => {
    const draftInvoice: Invoice = {
      id: "inv-102",
      businessId: "atelier-forma",
      invoiceNumber: "INV-2026-002",
      customerId: "cust-2",
      customerName: "Adeola Adeleke",
      customerEmail: "adeola@adeleke.ng",
      billingAddress: "Victoria Island, Lagos",
      items: [
        {
          id: "item-1",
          description: "Full Production",
          quantity: 1,
          unit: "pkg",
          unitPrice: 120000,
          amount: 120000,
        },
      ],
      subtotal: 120000,
      discount: 0,
      taxRate: 0,
      taxAmount: 0,
      total: 120000,
      notes: "",
      issueDate: "2026-08-20",
      dueDate: "2026-09-03",
      paymentTerms: "Net 14",
      status: "draft",
      createdAt: "2026-08-20T10:00:00Z",
      updatedAt: "2026-08-20T10:00:00Z",
    };
    vi.spyOn(apiClient, "post").mockResolvedValueOnce(draftInvoice);

    const invoice = await saveInvoiceDraft({
      customerId: "cust-2",
      customerName: "Adeola Adeleke",
      customerEmail: "adeola@adeleke.ng",
      billingAddress: "Victoria Island, Lagos",
      issueDate: "2026-08-20",
      dueDate: "2026-09-03",
      paymentTerms: "Net 14",
      items: [
        {
          id: "item-1",
          description: "Full Production",
          quantity: 1,
          unit: "pkg",
          unitPrice: 120000,
          amount: 120000,
        },
      ],
      subtotal: 120000,
      discount: 0,
      taxRate: 0,
      taxAmount: 0,
      total: 120000,
      notes: "",
    });

    expect(invoice.id).toBe("inv-102");
    expect(invoice.status).toBe("draft");
    expect(invoice.total).toBe(120000);
  });

  it("sends an invoice and marks status as sent", async () => {
    const sentInvoice: Invoice = {
      id: "inv-103",
      businessId: "atelier-forma",
      invoiceNumber: "INV-2026-003",
      customerId: "cust-3",
      customerName: "Chinedu Obi",
      customerEmail: "chinedu@obi.com",
      billingAddress: "Ikoyi, Lagos",
      items: [
        {
          id: "item-1",
          description: "Consultation",
          quantity: 1,
          unit: "hr",
          unitPrice: 40000,
          amount: 40000,
        },
      ],
      subtotal: 40000,
      discount: 0,
      taxRate: 0,
      taxAmount: 0,
      total: 40000,
      notes: "",
      issueDate: "2026-08-20",
      dueDate: "2026-08-20",
      paymentTerms: "Due on receipt",
      status: "sent",
      createdAt: "2026-08-20T10:00:00Z",
      updatedAt: "2026-08-20T10:00:00Z",
    };
    vi.spyOn(apiClient, "post").mockResolvedValueOnce(sentInvoice);

    const sent = await sendInvoice({
      customerId: "cust-3",
      customerName: "Chinedu Obi",
      customerEmail: "chinedu@obi.com",
      billingAddress: "Ikoyi, Lagos",
      issueDate: "2026-08-20",
      dueDate: "2026-08-20",
      paymentTerms: "Due on receipt",
      items: [
        {
          id: "item-1",
          description: "Consultation",
          quantity: 1,
          unit: "hr",
          unitPrice: 40000,
          amount: 40000,
        },
      ],
      subtotal: 40000,
      discount: 0,
      taxRate: 0,
      taxAmount: 0,
      total: 40000,
      notes: "",
    });

    expect(sent.status).toBe("sent");
  });

  it("marks sent invoice as paid and can revert to unpaid", async () => {
    const paidInvoice: Invoice = {
      id: "inv-103",
      businessId: "atelier-forma",
      invoiceNumber: "INV-2026-003",
      customerId: "cust-3",
      customerName: "Chinedu Obi",
      customerEmail: "chinedu@obi.com",
      billingAddress: "Ikoyi, Lagos",
      items: [],
      subtotal: 40000,
      discount: 0,
      taxRate: 0,
      taxAmount: 0,
      total: 40000,
      notes: "",
      issueDate: "2026-08-20",
      dueDate: "2026-08-20",
      paymentTerms: "Due on receipt",
      status: "paid",
      createdAt: "2026-08-20T10:00:00Z",
      updatedAt: "2026-08-20T10:00:00Z",
    };
    vi.spyOn(apiClient, "patch").mockResolvedValueOnce(paidInvoice);

    const markedPaid = await markInvoiceAsPaid("inv-103");
    expect(markedPaid.status).toBe("paid");

    const unpaidInvoice: Invoice = { ...paidInvoice, status: "sent" };
    vi.spyOn(apiClient, "patch").mockResolvedValueOnce(unpaidInvoice);

    const reverted = await markInvoiceAsUnpaid("inv-103");
    expect(reverted.status).toBe("sent");
  });

  it("deletes an invoice", async () => {
    vi.spyOn(apiClient, "delete").mockResolvedValueOnce({ success: true, id: "inv-104" });
    const res = await deleteInvoice("inv-104");
    expect(res.success).toBe(true);
  });
});
