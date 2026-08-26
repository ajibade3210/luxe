import { describe, expect, it } from "vitest";
import {
  addServiceToCustomer,
  createCustomer,
  deleteCustomerService,
  getCustomers,
  toggleCustomerActiveStatus,
  updateCustomerServiceStatus,
} from "../customer.service";

describe("customer service", () => {
  it("fetches list of customers", async () => {
    const list = await getCustomers();
    expect(Array.isArray(list)).toBe(true);
    expect(list.length).toBeGreaterThan(0);
  });

  it("creates a customer and attaches initial service scope", async () => {
    const customer = await createCustomer({
      name: "Marcus & Elena Vance",
      email: "marcus@vance.com",
      phone: "+1 415 555 2671",
      company: "Vance Global",
      serviceName: "Private Gala Reception",
      service: "Corporate Galas & Summits",
      amount: 40000,
      status: "active",
    });

    expect(customer.id).toBeDefined();
    expect(customer.name).toBe("Marcus & Elena Vance");
    expect(customer.services.length).toBe(1);
    expect(customer.services[0].name).toBe("Private Gala Reception");
    expect(customer.totalRevenue).toBe(40000);
  });

  it("adds a second service scope to a customer and recalculates revenue", async () => {
    const customer = await createCustomer({
      name: "Scope Expansion Client",
      email: "scope@test.com",
      amount: 20000,
      serviceName: "Phase 1",
      service: "Bespoke Styling",
    });

    const updated = await addServiceToCustomer(customer.id, {
      name: "Phase 2 Lighting",
      service: "VIP Concierge Production",
      amount: 15000,
      status: "active",
    });

    expect(updated.services.length).toBe(2);
    expect(updated.totalRevenue).toBe(35000);
  });

  it("updates service status and deletes a service scope", async () => {
    const customer = await createCustomer({
      name: "Status Mod Client",
      email: "status-mod@test.com",
      serviceName: "Production Scope",
      service: "Full Wedding Production",
      amount: 30000,
    });

    const svcId = customer.services[0].id;
    const withUpdatedStatus = await updateCustomerServiceStatus(customer.id, svcId, "completed");
    expect(withUpdatedStatus.services[0].status).toBe("completed");

    const withDeletedSvc = await deleteCustomerService(customer.id, svcId);
    expect(withDeletedSvc.services.length).toBe(0);
    expect(withDeletedSvc.totalRevenue).toBe(0);
  });

  it("toggles customer active status", async () => {
    const customer = await createCustomer({
      name: "Toggle Test Client",
      email: "toggle@test.com",
    });

    expect(customer.isActive).toBe(true);

    const inactive = await toggleCustomerActiveStatus(customer.id, false);
    expect(inactive.isActive).toBe(false);

    const activeAgain = await toggleCustomerActiveStatus(customer.id, true);
    expect(activeAgain.isActive).toBe(true);
  });

  it("filters customers by search query", async () => {
    await createCustomer({
      name: "Unique Searchable Name",
      email: "uniquesearch@example.com",
    });

    const searchByName = await getCustomers("Unique Searchable");
    expect(searchByName.some(c => c.name === "Unique Searchable Name")).toBe(true);

    const searchByEmail = await getCustomers("uniquesearch@example.com");
    expect(searchByEmail.some(c => c.email === "uniquesearch@example.com")).toBe(true);

    const noMatch = await getCustomers("nonexistent_random_xyz_query");
    expect(noMatch.length).toBe(0);
  });
});
