import { describe, expect, it } from "vitest";
import {
  AddServiceInputSchema,
  CreateLeadInputSchema,
  InvoiceInputSchema,
  NewCustomerInputSchema,
} from "../index";

describe("Runtime Schema Validation (Zod)", () => {
  describe("CreateLeadInputSchema", () => {
    it("validates valid lead input correctly", () => {
      const validLead = {
        name: "Elena Rostova",
        email: "elena@example.com",
        service: "Full Production",
        eventDate: "2026-10-15",
        budget: 50000,
        message: "Looking for wedding design",
      };
      const parsed = CreateLeadInputSchema.parse(validLead);
      expect(parsed.name).toBe("Elena Rostova");
      expect(parsed.email).toBe("elena@example.com");
    });

    it("rejects invalid email for lead", () => {
      const invalidLead = {
        name: "Elena Rostova",
        email: "not-an-email",
        service: "Full Production",
        eventDate: "2026-10-15",
        message: "Looking for wedding design",
      };
      expect(() => CreateLeadInputSchema.parse(invalidLead)).toThrow();
    });
  });

  describe("NewCustomerInputSchema & AddServiceInputSchema", () => {
    it("validates valid customer input", () => {
      const validCustomer = {
        name: "Crown & Laurel Co.",
        email: "events@crownlaurel.com",
        serviceName: "Gala 2026",
        amount: 25000,
      };
      const parsed = NewCustomerInputSchema.parse(validCustomer);
      expect(parsed.name).toBe("Crown & Laurel Co.");
    });

    it("validates valid customer input with phone only (no email)", () => {
      const validPhoneCustomer = {
        name: "Sterling & Co.",
        phone: "+234 800 123 4567",
        service: "Luxury Weddings",
        amount: 30000,
      };
      const parsed = NewCustomerInputSchema.parse(validPhoneCustomer);
      expect(parsed.name).toBe("Sterling & Co.");
      expect(parsed.phone).toBe("+234 800 123 4567");
    });

    it("rejects customer input with neither email nor phone", () => {
      const invalidCustomer = {
        name: "No Contact Client",
        service: "Floral Design",
        amount: 5000,
      };
      expect(() => NewCustomerInputSchema.parse(invalidCustomer)).toThrow(
        "At least one contact method"
      );
    });

    it("rejects negative amount in service input", () => {
      const invalidService = {
        name: "Autumn Exhibition",
        service: "Curation",
        amount: -500,
      };
      expect(() => AddServiceInputSchema.parse(invalidService)).toThrow();
    });
  });

  describe("InvoiceInputSchema", () => {
    it("validates valid invoice with items", () => {
      const validInvoice = {
        customerId: "c1",
        customerName: "Amara Sterling",
        customerEmail: "amara@sterling.com",
        billingAddress: "42 Victoria Island Boulevard",
        issueDate: "2026-08-20",
        dueDate: "2026-09-03",
        paymentTerms: "Net 14" as const,
        currency: "NGN" as const,
        items: [
          {
            id: "item-1",
            description: "Production package",
            quantity: 1,
            unit: "pkg",
            unitPrice: 10000,
            amount: 10000,
          },
        ],
        subtotal: 10000,
        total: 10000,
      };
      const parsed = InvoiceInputSchema.parse(validInvoice);
      expect(parsed.items).toHaveLength(1);
      expect(parsed.total).toBe(10000);
    });

    it("rejects invoice with empty items list", () => {
      const invalidInvoice = {
        customerId: "c1",
        customerName: "Amara Sterling",
        customerEmail: "amara@sterling.com",
        billingAddress: "42 Victoria Island Boulevard",
        issueDate: "2026-08-20",
        dueDate: "2026-09-03",
        paymentTerms: "Net 14" as const,
        items: [],
        subtotal: 0,
        total: 0,
      };
      expect(() => InvoiceInputSchema.parse(invalidInvoice)).toThrow();
    });
  });

  describe("Reserved Slug Guard", () => {
    it("flags system reserved paths as unavailable", async () => {
      const { isReservedSlug } = await import("@/constants/reserved-slugs");
      expect(isReservedSlug("vendor")).toBe(true);
      expect(isReservedSlug("vendors")).toBe(true);
      expect(isReservedSlug("admin")).toBe(true);
      expect(isReservedSlug("invoices")).toBe(true);
      expect(isReservedSlug("leads")).toBe(true);
      expect(isReservedSlug("login")).toBe(true);
      expect(isReservedSlug("signup")).toBe(true);
      expect(isReservedSlug("custom-atelier-2026")).toBe(false);
    });
  });
});
