"use client";

import { useEffect, useState } from "react";
import { CUSTOM_EVENTS } from "@/constants";
import {
  addServiceToCustomer,
  createCustomer,
  deleteCustomerService,
  deleteInvoice,
  exportCustomersCSV,
  getCustomers,
  getInvoices,
  type Invoice,
  type NewCustomerInput,
  resendInvoice,
  toggleCustomerActiveStatus,
  updateCustomerServiceStatus,
} from "@/lib/api";
import type { Customer, ServiceStatus } from "@/lib/types";

export const AVAILABLE_SERVICES = [
  "Full Wedding Production & Styling",
  "Corporate Galas & Summits",
  "Private Dinners & Floral Scenography",
  "VIP Concierge Production",
  "Bespoke Atelier Styling",
  "Brand Activations & Ephemeral Lounges",
] as const;

export function useCustomers(onToast?: (message: string) => void) {
  const [items, setItems] = useState<Customer[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isExporting, setIsExporting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    getCustomers(searchQuery)
      .then(setItems)
      .catch(() => setItems([]));
    getInvoices()
      .then(setInvoices)
      .catch(() => setInvoices([]));

    const handleCustomersUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<Customer[]>;
      if (customEvent.detail) {
        setItems(customEvent.detail);
      }
    };

    const handleInvoicesUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<Invoice[]>;
      if (customEvent.detail) {
        setInvoices(customEvent.detail);
      }
    };

    window.addEventListener(CUSTOM_EVENTS.customersUpdated, handleCustomersUpdate);
    window.addEventListener(CUSTOM_EVENTS.invoicesUpdated, handleInvoicesUpdate);

    return () => {
      window.removeEventListener(CUSTOM_EVENTS.customersUpdated, handleCustomersUpdate);
      window.removeEventListener(CUSTOM_EVENTS.invoicesUpdated, handleInvoicesUpdate);
    };
  }, [searchQuery]);

  const handleSearch = (val: string) => {
    setSearchQuery(val);
    setCurrentPage(1);
    getCustomers(val).then(setItems);
  };

  const reloadCustomers = () => {
    getCustomers(searchQuery).then(setItems);
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

    setIsSubmitting(true);
    try {
      const newCustomer = await createCustomer(formData);
      setItems(prev => [newCustomer, ...prev]);
      onToast?.(`Customer "${newCustomer.name}" added successfully.`);
      return true;
    } catch {
      onToast?.("Failed to create customer.");
      return false;
    } finally {
      setIsSubmitting(false);
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
      const updatedCust = await addServiceToCustomer(customerId, data);
      setItems(prev => prev.map(c => (c.id === updatedCust.id ? updatedCust : c)));
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
      const updated = await deleteCustomerService(customerId, serviceId);
      setItems(prev => prev.map(c => (c.id === customerId ? updated : c)));
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
      const updated = await updateCustomerServiceStatus(customerId, serviceId, status);
      setItems(prev => prev.map(c => (c.id === customerId ? updated : c)));
      onToast?.(`Service "${serviceName}" marked as ${statusLabel}.`);
      return true;
    } catch {
      onToast?.("Failed to update service status.");
      return false;
    }
  };

  const handleToggleCustomerStatus = async (customerId: string, isActive: boolean) => {
    try {
      const updated = await toggleCustomerActiveStatus(customerId, isActive);
      setItems(prev => prev.map(c => (c.id === customerId ? updated : c)));
      onToast?.(`Customer "${updated.name}" is now ${isActive ? "Active" : "Inactive"}.`);
      return true;
    } catch {
      onToast?.("Failed to update customer status.");
      return false;
    }
  };

  const handleResendInvoice = async (invoiceId: string) => {
    try {
      const res = await resendInvoice(invoiceId);
      onToast?.(`Invoice ${res.invoiceNumber} re-sent to ${res.customerEmail}.`);
      return true;
    } catch {
      onToast?.("Failed to resend invoice.");
      return false;
    }
  };

  const handleDeleteDraftInvoice = async (invoiceId: string) => {
    try {
      await deleteInvoice(invoiceId);
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
    isSubmitting,
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
