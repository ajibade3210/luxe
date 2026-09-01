/** @vitest-environment jsdom */
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";

import type { ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { apiClient } from "@/lib/api-client";
import {
  useCreateCustomerMutation,
  useCustomersQuery,
  useInvoicesQuery,
  useLeadsQuery,
  useSaveInvoiceMutation,
  useStudioProfileQuery,
} from "../index";

function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
      mutations: {
        retry: false,
      },
    },
  });
}

function createWrapper(queryClient: QueryClient) {
  return function TestQueryWrapper({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
  };
}

describe("React Query Domain Hooks & Cache Invalidation", () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = createTestQueryClient();
    vi.restoreAllMocks();
  });

  it("fetches and caches customer list via useCustomersQuery", async () => {
    const mockCustomers = [
      {
        id: "cust-1",
        name: "Luxe Events Co",
        email: "contact@luxeevents.com",
        phone: "+2348000000000",
        services: [],
        totalRevenue: 250000,
        createdAt: "2026-08-01T00:00:00Z",
      },
    ];

    const getSpy = vi.spyOn(apiClient, "get").mockResolvedValueOnce(mockCustomers);

    const { result } = renderHook(() => useCustomersQuery(), {
      wrapper: createWrapper(queryClient),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(mockCustomers);
    expect(getSpy).toHaveBeenCalledTimes(1);
  });

  it("deduplicates concurrent queries for the same resource", async () => {
    const mockStudio = {
      id: "studio-1",
      slug: "elan-events",
      name: "Elan Events",
      services: [],
    };

    const getSpy = vi.spyOn(apiClient, "get").mockResolvedValue(mockStudio);

    const wrapper = createWrapper(queryClient);

    const { result: hook1 } = renderHook(() => useStudioProfileQuery(), { wrapper });
    const { result: hook2 } = renderHook(() => useStudioProfileQuery(), { wrapper });

    await waitFor(() => expect(hook1.current.isSuccess).toBe(true));
    await waitFor(() => expect(hook2.current.isSuccess).toBe(true));

    expect(hook1.current.data?.slug).toBe("elan-events");
    expect(hook2.current.data?.slug).toBe("elan-events");
    expect(getSpy).toHaveBeenCalledTimes(1);
  });

  it("invalidates customer queries on useCreateCustomerMutation", async () => {
    const newCustomer = {
      id: "cust-new",
      name: "New VIP Customer",
      email: "vip@example.com",
      phone: "+2348011112222",
      services: [],
      createdAt: new Date().toISOString(),
    };

    vi.spyOn(apiClient, "post").mockResolvedValueOnce(newCustomer);
    const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");

    const { result } = renderHook(() => useCreateCustomerMutation(), {
      wrapper: createWrapper(queryClient),
    });

    await result.current.mutateAsync({
      name: "New VIP Customer",
      email: "vip@example.com",
      phone: "+2348011112222",
    });

    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: ["customers"],
    });
    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: ["analytics"],
    });
  });

  it("invalidates invoice queries on useSaveInvoiceMutation", async () => {
    const savedInvoice = {
      id: "inv-123",
      invoiceNumber: "INV-2026-001",
      customerId: "cust-1",
      customerName: "Luxe Events Co",
      customerEmail: "contact@luxeevents.com",
      issueDate: "2026-08-30",
      dueDate: "2026-09-06",
      status: "draft",
      currency: "NGN",
      items: [{ description: "Consultation", quantity: 1, unitPrice: 50000, total: 50000 }],
      subtotal: 50000,
      taxRate: 0,
      taxAmount: 0,
      discount: 0,
      total: 50000,
      notes: "",
      paymentTerms: "Due on receipt",
      createdAt: "2026-08-30T00:00:00Z",
    };

    vi.spyOn(apiClient, "post").mockResolvedValueOnce(savedInvoice);
    const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");

    const { result } = renderHook(() => useSaveInvoiceMutation(), {
      wrapper: createWrapper(queryClient),
    });

    await result.current.mutateAsync({
      customerId: "cust-1",
      customerName: "Luxe Events Co",
      customerEmail: "contact@luxeevents.com",
      billingAddress: "Victoria Island, Lagos",
      issueDate: "2026-08-30",
      dueDate: "2026-09-06",
      status: "draft",
      currency: "NGN",
      items: [
        {
          id: "item-1",
          description: "Consultation",
          quantity: 1,
          unit: "session",
          unitPrice: 50000,
          amount: 50000,
        },
      ],
      subtotal: 50000,
      taxRate: 0,
      taxAmount: 0,
      discount: 0,
      total: 50000,
      notes: "",
      paymentTerms: "Due on receipt",
    });

    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: ["invoices"],
    });
    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: ["customers"],
    });
    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: ["analytics"],
    });
  });

  it("fetches leads with query filter via useLeadsQuery", async () => {
    const mockLeads = [
      {
        id: "lead-1",
        clientName: "Adeola Adeleke",
        clientEmail: "adeola@example.com",
        clientPhone: "+2348031234567",
        service: "Wedding Planning",
        status: "new",
        source: "direct",
        createdAt: "2026-08-30T00:00:00Z",
      },
    ];

    vi.spyOn(apiClient, "get").mockResolvedValueOnce(mockLeads);

    const { result } = renderHook(() => useLeadsQuery("Adeola"), {
      wrapper: createWrapper(queryClient),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(mockLeads);
  });

  it("fetches invoice list via useInvoicesQuery", async () => {
    const mockInvoices = [
      {
        id: "inv-1",
        invoiceNumber: "INV-001",
        customerName: "Client A",
        customerEmail: "a@example.com",
        issueDate: "2026-08-01",
        dueDate: "2026-08-08",
        status: "paid",
        currency: "NGN",
        items: [],
        subtotal: 100000,
        taxAmount: 0,
        discount: 0,
        total: 100000,
        paymentTerms: "Immediate",
        createdAt: "2026-08-01T00:00:00Z",
      },
    ];

    vi.spyOn(apiClient, "get").mockResolvedValueOnce(mockInvoices);

    const { result } = renderHook(() => useInvoicesQuery("paid"), {
      wrapper: createWrapper(queryClient),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(mockInvoices);
  });
});
