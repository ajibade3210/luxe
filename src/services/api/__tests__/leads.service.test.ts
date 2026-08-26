import { describe, expect, it } from "vitest";
import { convertLeadToCustomer, createLead, getLeads, updateLeadStatus } from "../leads.service";

describe("leads service", () => {
  it("fetches list of initial leads", async () => {
    const list = await getLeads();
    expect(Array.isArray(list)).toBe(true);
    expect(list.length).toBeGreaterThan(0);
  });

  it("creates a new consultation lead", async () => {
    const lead = await createLead({
      name: "Victoria Beckham",
      email: "vb@couture.com",
      phone: "+44 700 000 0000",
      service: "Bespoke Atelier Styling",
      eventDate: "2026-10-15",
      budget: 80000,
      message: "Looking for an exclusive bridal suite presentation.",
    });

    expect(lead.id).toBeDefined();
    expect(lead.status).toBe("new");
    expect(lead.name).toBe("Victoria Beckham");

    const all = await getLeads("Victoria");
    expect(all.some(l => l.id === lead.id)).toBe(true);
  });

  it("updates lead status", async () => {
    const lead = await createLead({
      name: "Status Test Lead",
      email: "status@test.com",
      service: "Corporate Gala",
      eventDate: "2026-11-20",
      message: "Inquiry status update test",
    });

    const updated = await updateLeadStatus(lead.id, "contacted");
    expect(updated?.status).toBe("contacted");
  });

  it("converts a lead into a customer", async () => {
    const lead = await createLead({
      name: "Conversion Client",
      email: "convert@luxury.com",
      phone: "+234 812 345 6789",
      service: "Full Wedding Production",
      eventDate: "2026-12-05",
      budget: 50000,
      message: "Ready to proceed with contract.",
    });

    const { customer, lead: convertedLead } = await convertLeadToCustomer(lead.id);
    expect(convertedLead.status).toBe("converted");
    expect(customer.name).toBe("Conversion Client");
    expect(customer.email).toBe("convert@luxury.com");
    expect(customer.projects.length).toBeGreaterThan(0);
    expect(customer.projects[0].name).toBe("Full Wedding Production");
  });
});
