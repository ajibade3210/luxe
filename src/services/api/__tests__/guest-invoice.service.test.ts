/** @vitest-environment jsdom */
import { beforeEach, describe, expect, it } from "vitest";
import { DEFAULT_GUEST_INVOICE, GUEST_INVOICE_STORAGE_KEYS } from "@/constants";
import type { GuestInvoiceData } from "@/types";
import {
  calculateInvoiceTotals,
  checkGuestQuota,
  clearDraftInvoice,
  getGuestQuotaRecord,
  loadDraftInvoice,
  recordGuestInvoiceGeneration,
  saveDraftInvoice,
} from "../guest-invoice.service";

describe("guest-invoice.service", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe("calculateInvoiceTotals", () => {
    it("calculates simple subtotal without discount or tax", () => {
      const invoice: GuestInvoiceData = {
        ...DEFAULT_GUEST_INVOICE,
        items: [
          { id: "1", description: "Design", quantity: 2, unitPrice: 500, total: 1000 },
          { id: "2", description: "Consulting", quantity: 1, unitPrice: 250, total: 250 },
        ],
        discountType: "percentage",
        discountValue: 0,
        taxRate: 0,
      };

      const totals = calculateInvoiceTotals(invoice);
      expect(totals.subtotal).toBe(1250);
      expect(totals.discountAmount).toBe(0);
      expect(totals.taxAmount).toBe(0);
      expect(totals.total).toBe(1250);
    });

    it("applies percentage discount and tax correctly", () => {
      const invoice: GuestInvoiceData = {
        ...DEFAULT_GUEST_INVOICE,
        items: [{ id: "1", description: "Design", quantity: 1, unitPrice: 1000, total: 1000 }],
        discountType: "percentage",
        discountValue: 10, // 10% off -> 100 off, taxable = 900
        taxRate: 10, // 10% tax on 900 -> 90 tax
      };

      const totals = calculateInvoiceTotals(invoice);
      expect(totals.subtotal).toBe(1000);
      expect(totals.discountAmount).toBe(100);
      expect(totals.taxAmount).toBe(90);
      expect(totals.total).toBe(990);
    });

    it("applies fixed discount correctly", () => {
      const invoice: GuestInvoiceData = {
        ...DEFAULT_GUEST_INVOICE,
        items: [{ id: "1", description: "Service", quantity: 1, unitPrice: 500, total: 500 }],
        discountType: "fixed",
        discountValue: 50,
        taxRate: 0,
      };

      const totals = calculateInvoiceTotals(invoice);
      expect(totals.subtotal).toBe(500);
      expect(totals.discountAmount).toBe(50);
      expect(totals.total).toBe(450);
    });
  });

  describe("quota management", () => {
    it("permits generation on fresh quota", () => {
      const check = checkGuestQuota();
      expect(check.allowed).toBe(true);
      expect(check.reason).toBeUndefined();
    });

    it("blocks generation when daily limit of 3 is reached", () => {
      recordGuestInvoiceGeneration();
      recordGuestInvoiceGeneration();
      recordGuestInvoiceGeneration();

      const record = getGuestQuotaRecord();
      expect(record.dailyCount).toBe(3);

      const check = checkGuestQuota();
      expect(check.allowed).toBe(false);
      expect(check.reason).toBe("daily_exceeded");
    });

    it("blocks generation when monthly limit of 6 is reached", () => {
      const today = new Date().toISOString().split("T")[0];
      const monthKey = today.slice(0, 7);

      // Simulate prior days in the month reaching 6
      localStorage.setItem(
        GUEST_INVOICE_STORAGE_KEYS.quota,
        JSON.stringify({
          dailyCount: 1,
          dailyDate: today,
          monthlyCount: 6,
          monthlyMonth: monthKey,
        })
      );

      const check = checkGuestQuota();
      expect(check.allowed).toBe(false);
      expect(check.reason).toBe("monthly_exceeded");
    });
  });

  describe("draft persistence", () => {
    it("saves and loads draft invoices safely", () => {
      const customInvoice: GuestInvoiceData = {
        ...DEFAULT_GUEST_INVOICE,
        senderName: "Nova Commerce Lab",
        invoiceNumber: "INV-999",
      };

      saveDraftInvoice(customInvoice);
      const loaded = loadDraftInvoice();

      expect(loaded.senderName).toBe("Nova Commerce Lab");
      expect(loaded.invoiceNumber).toBe("INV-999");

      clearDraftInvoice();
      const afterClear = loadDraftInvoice();
      expect(afterClear.senderName).toBe(DEFAULT_GUEST_INVOICE.senderName);
    });
  });
});
