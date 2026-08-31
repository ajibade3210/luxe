import { describe, expect, it, vi } from "vitest";
import { apiClient } from "@/lib/api-client";
import type { Lead } from "@/types";
import {
  convertLeadToCustomer,
  createLead,
  getLeads,
  submitPublicInquiry,
  updateLeadStatus,
} from "../leads.service";

describe("leads service", () => {
  it("submits a public storefront inquiry", async () => {
    const mockResult = {
      id: "inquiry-1",
      status: "new",
      createdAt: "2026-08-31T20:00:00Z",
    };
    vi.spyOn(apiClient, "post").mockResolvedValueOnce(mockResult);

    const result = await submitPublicInquiry("atelier-forma", {
      name: "Amara Nwosu",
      email: "amara@example.com",
      service: "Bespoke Styling",
      message: "Need a wedding stylist",
    });

    expect(result.id).toBe("inquiry-1");
    expect(result.status).toBe("new");
  });
  it("fetches list of initial leads", async () => {
    const mockLeads: Lead[] = [
      {
        id: "lead-1",
        businessId: "atelier-forma",
        name: "Victoria Beckham",
        email: "vb@couture.com",
        service: "Bespoke Styling",
        eventDate: "2026-10-15",
        message: "Exclusive consultation",
        status: "new",
        createdAt: "2026-08-20T10:00:00Z",
      },
    ];
    vi.spyOn(apiClient, "get").mockResolvedValueOnce(mockLeads);

    const list = await getLeads();
    expect(Array.isArray(list)).toBe(true);
    expect(list.length).toBe(1);
    expect(list[0].name).toBe("Victoria Beckham");
  });

  it("creates a new consultation lead", async () => {
    const newLead: Lead = {
      id: "lead-2",
      businessId: "atelier-forma",
      name: "Victoria Beckham",
      email: "vb@couture.com",
      phone: "+44 700 000 0000",
      service: "Bespoke Atelier Styling",
      eventDate: "2026-10-15",
      budget: 80000,
      message: "Looking for an exclusive bridal suite presentation.",
      status: "new",
      createdAt: "2026-08-20T10:00:00Z",
    };
    vi.spyOn(apiClient, "post").mockResolvedValueOnce(newLead);

    const lead = await createLead({
      name: "Victoria Beckham",
      email: "vb@couture.com",
      phone: "+44 700 000 0000",
      service: "Bespoke Atelier Styling",
      eventDate: "2026-10-15",
      budget: 80000,
      message: "Looking for an exclusive bridal suite presentation.",
    });

    expect(lead.id).toBe("lead-2");
    expect(lead.status).toBe("new");
    expect(lead.name).toBe("Victoria Beckham");
  });

  it("updates lead status", async () => {
    const updatedLead: Lead = {
      id: "lead-3",
      businessId: "atelier-forma",
      name: "Status Test Lead",
      email: "status@test.com",
      service: "Corporate Gala",
      eventDate: "2026-11-20",
      message: "Inquiry status update test",
      status: "contacted",
      createdAt: "2026-08-20T10:00:00Z",
    };
    vi.spyOn(apiClient, "patch").mockResolvedValueOnce(updatedLead);

    const updated = await updateLeadStatus("lead-3", "contacted");
    expect(updated?.status).toBe("contacted");
  });

  it("converts a lead into a customer", async () => {
    const conversionResult = {
      customer: {
        id: "cust-1",
        businessId: "atelier-forma",
        name: "Conversion Client",
        email: "convert@luxury.com",
        phone: "+234 812 345 6789",
        services: [
          {
            id: "svc-1",
            customerId: "cust-1",
            name: "Full Wedding Production",
            service: "Full Wedding Production",
            amount: 50000,
            status: "active" as const,
            createdAt: "2026-08-20T10:00:00Z",
          },
        ],
        totalRevenue: 50000,
        isActive: true,
        createdAt: "2026-08-20T10:00:00Z",
      },
      lead: {
        id: "lead-4",
        businessId: "atelier-forma",
        name: "Conversion Client",
        email: "convert@luxury.com",
        service: "Full Wedding Production",
        eventDate: "2026-12-05",
        message: "Ready to proceed with contract.",
        status: "converted" as const,
        createdAt: "2026-08-20T10:00:00Z",
      },
    };
    vi.spyOn(apiClient, "post").mockResolvedValueOnce(conversionResult);

    const { customer, lead: convertedLead } = await convertLeadToCustomer("lead-4");
    expect(convertedLead.status).toBe("converted");
    expect(customer.name).toBe("Conversion Client");
    expect(customer.email).toBe("convert@luxury.com");
    expect(customer.services.length).toBeGreaterThan(0);
    expect(customer.services[0].name).toBe("Full Wedding Production");
  });
});
