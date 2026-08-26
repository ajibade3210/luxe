import { describe, expect, it } from "vitest";
import {
  addProjectToCustomer,
  createCustomer,
  deleteCustomerProject,
  getCustomers,
  toggleCustomerActiveStatus,
  updateCustomerProjectStatus,
} from "../customer.service";

describe("customer service", () => {
  it("fetches list of customers", async () => {
    const list = await getCustomers();
    expect(Array.isArray(list)).toBe(true);
    expect(list.length).toBeGreaterThan(0);
  });

  it("creates a customer and attaches initial project scope", async () => {
    const customer = await createCustomer({
      name: "Marcus & Elena Vance",
      email: "marcus@vance.com",
      phone: "+1 415 555 2671",
      company: "Vance Global",
      projectName: "Private Gala Reception",
      service: "Corporate Galas & Summits",
      amount: 40000,
      status: "active",
    });

    expect(customer.id).toBeDefined();
    expect(customer.name).toBe("Marcus & Elena Vance");
    expect(customer.projects.length).toBe(1);
    expect(customer.projects[0].name).toBe("Private Gala Reception");
    expect(customer.totalRevenue).toBe(40000);
  });

  it("adds a second project scope to a customer and recalculates revenue", async () => {
    const customer = await createCustomer({
      name: "Scope Expansion Client",
      email: "scope@test.com",
      amount: 20000,
      projectName: "Phase 1",
      service: "Bespoke Styling",
    });

    const updated = await addProjectToCustomer(customer.id, {
      name: "Phase 2 Lighting",
      service: "VIP Concierge Production",
      amount: 15000,
      status: "active",
    });

    expect(updated.projects.length).toBe(2);
    expect(updated.totalRevenue).toBe(35000);
  });

  it("updates project status and deletes a project scope", async () => {
    const customer = await createCustomer({
      name: "Status Mod Client",
      email: "status-mod@test.com",
      projectName: "Production Scope",
      service: "Full Wedding Production",
      amount: 30000,
    });

    const projId = customer.projects[0].id;
    const withUpdatedStatus = await updateCustomerProjectStatus(customer.id, projId, "completed");
    expect(withUpdatedStatus.projects[0].status).toBe("completed");

    const withDeletedProj = await deleteCustomerProject(customer.id, projId);
    expect(withDeletedProj.projects.length).toBe(0);
    expect(withDeletedProj.totalRevenue).toBe(0);
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
});
