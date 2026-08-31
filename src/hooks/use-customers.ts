"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { queryKeys } from "@/lib/query-keys";
import { exportCustomersCSV } from "@/services/api/customer.service";
import type { NewCustomerInput, ServiceStatus } from "@/types";
import {
  useAddCustomerServiceMutation,
  useCreateCustomerMutation,
  useCustomersQuery,
  useDeleteCustomerServiceMutation,
  useDeleteInvoiceMutation,
  useInvoicesQuery,
  useResendInvoiceMutation,
  useToggleCustomerStatusMutation,
  useUpdateCustomerServiceStatusMutation,
} from "./queries";

export const AVAILABLE_SERVICES = [
  "Full Wedding Production & Styling",
  "Corporate Galas & Summits",
  "Private Dinners & Floral Scenography",
  "VIP Concierge Production",
  "Bespoke Atelier Styling",
  "Brand Activations & Ephemeral Lounges",
] as const;

export function useCustomers(onToast?: (message: string) => void) {
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isExporting, setIsExporting] = useState(false);

  const queryClient = useQueryClient();
  const { data: customersData = [], isLoading: isLoadingCustomers } =
    useCustomersQuery(searchQuery);
  const { data: invoicesData = [], isLoading: isLoadingInvoices } = useInvoicesQuery();

  const createCustomerMutation = useCreateCustomerMutation();
  const addServiceMutation = useAddCustomerServiceMutation();
  const deleteServiceMutation = useDeleteCustomerServiceMutation();
  const updateServiceStatusMutation = useUpdateCustomerServiceStatusMutation();
  const toggleStatusMutation = useToggleCustomerStatusMutation();
  const resendInvoiceMutation = useResendInvoiceMutation();
  const deleteInvoiceMutation = useDeleteInvoiceMutation();

  const items = customersData;
  const invoices = invoicesData;

  const handleSearch = (val: string) => {
    setSearchQuery(val);
    setCurrentPage(1);
  };

  const reloadCustomers = () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.customers.all });
    queryClient.invalidateQueries({ queryKey: queryKeys.invoices.all });
  };

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const res = await exportCustomersCSV();
      onToast?.(`Customer list exported successfully (${res.count} records).`);
    } catch {
      onToast?.("Failed to export customer list.");
    } finally {
      setIsExporting(false);
    }
  };

  const handleCreateCustomer = async (formData: NewCustomerInput) => {
    if (!formData.name?.trim()) {
      onToast?.("Please enter customer name.");
      return false;
    }

    if (!formData.email?.trim() && !formData.phone?.trim()) {
      onToast?.("Please provide at least one contact method (Email or Phone/WhatsApp number).");
      return false;
    }

    try {
      const newCustomer = await createCustomerMutation.mutateAsync(formData);
      onToast?.(`Customer "${newCustomer.name}" added successfully.`);
      return true;
    } catch {
      onToast?.("Failed to create customer.");
      return false;
    }
  };

  const handleAddService = async (
    customerId: string,
    customerName: string,
    data: { name: string; service: string; amount: number; status: ServiceStatus }
  ) => {
    if (!data.name) {
      onToast?.("Please enter a service name.");
      return false;
    }

    try {
      await addServiceMutation.mutateAsync({ customerId, input: data });
      onToast?.(`Service "${data.name}" added to ${customerName}.`);
      return true;
    } catch {
      onToast?.("Failed to add service.");
      return false;
    }
  };

  const handleDeleteService = async (
    customerId: string,
    serviceId: string,
    serviceName: string
  ) => {
    try {
      await deleteServiceMutation.mutateAsync({ customerId, serviceId });
      onToast?.(`Service "${serviceName}" removed.`);
      return true;
    } catch {
      onToast?.("Failed to remove service.");
      return false;
    }
  };

  const handleUpdateServiceStatus = async (
    customerId: string,
    serviceId: string,
    status: ServiceStatus,
    serviceName: string,
    statusLabel: string
  ) => {
    try {
      await updateServiceStatusMutation.mutateAsync({ customerId, serviceId, status });
      onToast?.(`Service "${serviceName}" marked as ${statusLabel}.`);
      return true;
    } catch {
      onToast?.("Failed to update service status.");
      return false;
    }
  };

  const handleToggleCustomerStatus = async (customerId: string, isActive: boolean) => {
    try {
      const updated = await toggleStatusMutation.mutateAsync({ id: customerId, isActive });
      onToast?.(`Customer "${updated.name}" is now ${isActive ? "Active" : "Inactive"}.`);
      return true;
    } catch {
      onToast?.("Failed to update customer status.");
      return false;
    }
  };

  const handleResendInvoice = async (invoiceId: string) => {
    try {
      const res = await resendInvoiceMutation.mutateAsync(invoiceId);
      onToast?.(`Invoice ${res.invoiceNumber} re-sent to ${res.customerEmail}.`);
      return true;
    } catch {
      onToast?.("Failed to resend invoice.");
      return false;
    }
  };

  const handleDeleteDraftInvoice = async (invoiceId: string) => {
    try {
      await deleteInvoiceMutation.mutateAsync(invoiceId);
      onToast?.("Draft invoice deleted successfully.");
      return true;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to delete draft.";
      onToast?.(msg);
      return false;
    }
  };

  const selectedCustomer = items.find(c => c.id === selectedCustomerId) || null;
  const customerInvoices = selectedCustomer
    ? invoices.filter(
        inv =>
          inv.customerId === selectedCustomer.id || inv.customerEmail === selectedCustomer.email
      )
    : [];

  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedItems = items.slice(startIndex, startIndex + pageSize);
  const totalRevenue = items.reduce((acc, c) => acc + (c.totalRevenue || 0), 0);
  const activeServicesCount = items.reduce(
    (acc, c) => acc + c.services.filter(s => s.status === "active").length,
    0
  );

  return {
    items,
    invoices,
    selectedCustomerId,
    setSelectedCustomerId,
    selectedCustomer,
    customerInvoices,
    searchQuery,
    setSearchQuery,
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    totalPages,
    startIndex,
    paginatedItems,
    totalRevenue,
    activeServicesCount,
    isExporting,
    isSubmitting: createCustomerMutation.isPending,
    isLoading: isLoadingCustomers || isLoadingInvoices,
    handleSearch,
    reloadCustomers,
    handleExport,
    handleCreateCustomer,
    handleAddService,
    handleDeleteService,
    handleUpdateServiceStatus,
    handleToggleCustomerStatus,
    handleResendInvoice,
    handleDeleteDraftInvoice,
  };
}
