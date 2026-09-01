import { describe, expect, it, vi } from "vitest";
import { apiClient } from "@/lib/api-client";
import type { Customer } from "@/types";
import {
  addServiceToCustomer,
  createCustomer,
  deleteCustomerService,
  getCustomer,
  getCustomers,
  toggleCustomerActiveStatus,
  updateCustomerServiceStatus,
} from "../customer.service";

describe("customer service", () => {
  it("fetches active customers list with calculated metrics", async () => {
    const mockCustomers: Customer[] = [
      {
        id: "cust-1",
        businessId: "atelier-forma",
        name: "Folake Doherty",
        email: "folake@dohertyholdings.com",
        phone: "+234 803 555 1234",
        services: [
          {
            id: "svc-1",
            customerId: "cust-1",
            name: "Bespoke Styling",
            service: "Bespoke Styling",
            amount: 75000,
            status: "active",
            createdAt: "2026-06-15T10:00:00Z",
          },
        ],
        totalRevenue: 75000,
        isActive: true,
        createdAt: "2026-06-15T10:00:00Z",
      },
    ];
    vi.spyOn(apiClient, "get").mockResolvedValueOnce(mockCustomers);

    const customers = await getCustomers();
    expect(customers.length).toBeGreaterThan(0);
    expect(customers[0].totalRevenue).toBe(75000);
  });

  it("retrieves a single customer by ID", async () => {
    const mockCustomer: Customer = {
      id: "cust-1",
      businessId: "atelier-forma",
      name: "Folake Doherty",
      email: "folake@dohertyholdings.com",
      phone: "+234 803 555 1234",
      services: [],
      totalRevenue: 0,
      isActive: true,
      createdAt: "2026-06-15T10:00:00Z",
    };
    vi.spyOn(apiClient, "get").mockResolvedValueOnce(mockCustomer);

    const cust = await getCustomer("cust-1");
    expect(cust?.name).toBe("Folake Doherty");
  });

  it("creates a new customer with initial service and revenue calculation", async () => {
    const createdCustomer: Customer = {
      id: "cust-2",
      businessId: "atelier-forma",
      name: "Tunde Bakare",
      email: "tunde@bakare.ng",
      phone: "+234 802 111 9999",
      services: [
        {
          id: "svc-2",
          customerId: "cust-2",
          name: "Annual Gala Curation",
          service: "Annual Gala Curation",
          amount: 120000,
          status: "active",
          createdAt: "2026-08-20T10:00:00Z",
        },
      ],
      totalRevenue: 120000,
      isActive: true,
      createdAt: "2026-08-20T10:00:00Z",
    };
    vi.spyOn(apiClient, "post").mockResolvedValueOnce(createdCustomer);

    const customer = await createCustomer({
      name: "Tunde Bakare",
      email: "tunde@bakare.ng",
      phone: "+234 802 111 9999",
      serviceName: "Annual Gala Curation",
      service: "Annual Gala Curation",
      amount: 120000,
    });

    expect(customer.name).toBe("Tunde Bakare");
    expect(customer.services.length).toBe(1);
    expect(customer.totalRevenue).toBe(120000);
  });

  it("adds a second service scope to a customer and recalculates revenue", async () => {
    const updatedCustomer: Customer = {
      id: "cust-1",
      businessId: "atelier-forma",
      name: "Folake Doherty",
      email: "folake@dohertyholdings.com",
      services: [
        {
          id: "svc-1",
          customerId: "cust-1",
          name: "Bespoke Styling",
          service: "Bespoke Styling",
          amount: 75000,
          status: "active",
          createdAt: "2026-06-15T10:00:00Z",
        },
        {
          id: "svc-2",
          customerId: "cust-1",
          name: "VIP Afterparty Styling",
          service: "VIP Afterparty Styling",
          amount: 45000,
          status: "active",
          createdAt: "2026-08-20T10:00:00Z",
        },
      ],
      totalRevenue: 120000,
      isActive: true,
      createdAt: "2026-06-15T10:00:00Z",
    };
    vi.spyOn(apiClient, "post").mockResolvedValueOnce(updatedCustomer);

    const updated = await addServiceToCustomer("cust-1", {
      name: "VIP Afterparty Styling",
      service: "VIP Afterparty Styling",
      amount: 45000,
    });

    expect(updated.services.length).toBe(2);
    expect(updated.totalRevenue).toBe(120000);
  });

  it("updates service status and deletes a service scope", async () => {
    const updatedCustomer: Customer = {
      id: "cust-3",
      businessId: "atelier-forma",
      name: "Status Test Client",
      email: "status-client@test.com",
      services: [
        {
          id: "svc-3",
          customerId: "cust-3",
          name: "Floral Design",
          service: "Floral Design",
          amount: 30000,
          status: "completed",
          createdAt: "2026-08-20T10:00:00Z",
        },
      ],
      totalRevenue: 30000,
      isActive: true,
      createdAt: "2026-08-20T10:00:00Z",
    };
    vi.spyOn(apiClient, "patch").mockResolvedValueOnce(updatedCustomer);

    const updated = await updateCustomerServiceStatus("cust-3", "svc-3", "completed");
    expect(updated.services[0].status).toBe("completed");

    const deletedCustomer: Customer = {
      ...updatedCustomer,
      services: [],
      totalRevenue: 0,
    };
    vi.spyOn(apiClient, "delete").mockResolvedValueOnce(deletedCustomer);

    const afterDelete = await deleteCustomerService("cust-3", "svc-3");
    expect(afterDelete.services.length).toBe(0);
    expect(afterDelete.totalRevenue).toBe(0);
  });

  it("toggles customer active status", async () => {
    const inactiveCustomer: Customer = {
      id: "cust-4",
      businessId: "atelier-forma",
      name: "Toggle Client",
      email: "toggle@test.com",
      services: [],
      totalRevenue: 0,
      isActive: false,
      createdAt: "2026-08-20T10:00:00Z",
    };
    vi.spyOn(apiClient, "patch").mockResolvedValueOnce(inactiveCustomer);

    const toggled = await toggleCustomerActiveStatus("cust-4", false);
    expect(toggled.isActive).toBe(false);
  });
});
