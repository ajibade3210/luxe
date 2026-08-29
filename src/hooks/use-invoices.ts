"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { CUSTOM_EVENTS, INVOICE_CSV_COLUMNS } from "@/constants";
import { getInvoices, markInvoiceAsPaid, markInvoiceAsUnpaid } from "@/lib/api";
import type { Invoice, InvoiceMetrics, InvoiceStatusFilter, UseInvoicesReturn } from "@/types";

export function useInvoices(notify?: (message: string) => void): UseInvoicesReturn {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<InvoiceStatusFilter>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isExporting, setIsExporting] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | undefined>(undefined);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const loadInvoices = useCallback(async () => {
    try {
      const list = await getInvoices();
      setInvoices(list);
    } catch {
      setInvoices([]);
    }
  }, []);

  useEffect(() => {
    loadInvoices();

    const handleInvoicesUpdated = (e: Event) => {
      const customEvent = e as CustomEvent<Invoice[]>;
      if (customEvent.detail) {
        setInvoices(customEvent.detail);
      } else {
        loadInvoices();
      }
    };

    window.addEventListener(CUSTOM_EVENTS.invoicesUpdated, handleInvoicesUpdated);
    return () => {
      window.removeEventListener(CUSTOM_EVENTS.invoicesUpdated, handleInvoicesUpdated);
    };
  }, [loadInvoices]);

  // Filter and Search Logic
  const filteredInvoices = useMemo(() => {
    return invoices.filter(invoice => {
      const matchesStatus = statusFilter === "all" || invoice.status === statusFilter;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        invoice.invoiceNumber.toLowerCase().includes(q) ||
        invoice.customerName.toLowerCase().includes(q) ||
        invoice.customerEmail.toLowerCase().includes(q) ||
        invoice.items.some(it => it.description.toLowerCase().includes(q));

      return matchesStatus && matchesSearch;
    });
  }, [invoices, statusFilter, searchQuery]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredInvoices.length / pageSize));
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedItems = useMemo(() => {
    return filteredInvoices.slice(startIndex, startIndex + pageSize);
  }, [filteredInvoices, startIndex, pageSize]);

  // Metrics Calculation
  const metrics = useMemo<InvoiceMetrics>(() => {
    const totalInvoiced = invoices.reduce((acc, inv) => acc + (inv.total || 0), 0);
    const paidRevenue = invoices
      .filter(inv => inv.status === "paid")
      .reduce((acc, inv) => acc + (inv.total || 0), 0);
    const outstandingRevenue = invoices
      .filter(inv => inv.status === "sent")
      .reduce((acc, inv) => acc + (inv.total || 0), 0);
    const collectionRate = totalInvoiced > 0 ? Math.round((paidRevenue / totalInvoiced) * 100) : 0;
    const totalCount = invoices.length;
    const paidCount = invoices.filter(inv => inv.status === "paid").length;

    return {
      totalInvoiced,
      paidRevenue,
      outstandingRevenue,
      collectionRate,
      totalCount,
      paidCount,
    };
  }, [invoices]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handleStatusFilter = (status: InvoiceStatusFilter) => {
    setStatusFilter(status);
    setCurrentPage(1);
  };

  const handleOpenCreate = () => {
    setSelectedInvoice(undefined);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedInvoice(undefined);
  };

  const handleMarkPaid = async (id: string) => {
    try {
      const updated = await markInvoiceAsPaid(id);
      notify?.(`Invoice ${updated.invoiceNumber} marked as Paid.`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to mark invoice as paid";
      notify?.(msg);
    }
  };

  const handleMarkUnpaid = async (id: string) => {
    try {
      const updated = await markInvoiceAsUnpaid(id);
      notify?.(`Invoice ${updated.invoiceNumber} reverted to Sent status.`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to update invoice status";
      notify?.(msg);
    }
  };

  const handleExportCSV = () => {
    setIsExporting(true);
    try {
      const rows = filteredInvoices.map(inv => [
        `"${inv.invoiceNumber}"`,
        `"${inv.customerName}"`,
        `"${inv.customerEmail}"`,
        `"${inv.issueDate}"`,
        `"${inv.dueDate}"`,
        `"${inv.status}"`,
        `"${inv.currency || "NGN"}"`,
        `"${inv.subtotal || 0}"`,
        `"${inv.taxAmount || 0}"`,
        `"${inv.discount || 0}"`,
        `"${inv.total || 0}"`,
      ]);

      const csvContent = [INVOICE_CSV_COLUMNS.join(","), ...rows.map(r => r.join(","))].join("\n");
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute(
        "download",
        `invoices-register-${new Date().toISOString().split("T")[0]}.csv`
      );
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      notify?.("Invoice register exported as CSV.");
    } catch {
      notify?.("Failed to export invoices CSV.");
    } finally {
      setIsExporting(false);
    }
  };

  return {
    invoices: filteredInvoices,
    paginatedItems,
    searchQuery,
    statusFilter,
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    totalPages,
    startIndex,
    metrics,
    isExporting,
    selectedInvoice,
    isModalOpen,
    handleSearch,
    handleStatusFilter,
    handleOpenCreate,
    handleOpenEdit,
    handleCloseModal,
    handleMarkPaid,
    handleMarkUnpaid,
    handleExportCSV,
    reloadInvoices: loadInvoices,
  };
}
