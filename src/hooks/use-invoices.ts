"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useMemo, useState } from "react";
import { INVOICE_CSV_COLUMNS } from "@/constants";
import { queryKeys } from "@/lib/query-keys";
import type { Invoice, InvoiceMetrics, InvoiceStatusFilter, UseInvoicesReturn } from "@/types";
import {
  useInvoicesQuery,
  useInvoicesSummaryQuery,
  useMarkInvoicePaidMutation,
  useMarkInvoiceUnpaidMutation,
} from "./queries";

export function useInvoices(notify?: (message: string) => void): UseInvoicesReturn {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<InvoiceStatusFilter>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isExporting, setIsExporting] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | undefined>(undefined);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const queryClient = useQueryClient();
  const { data: rawInvoices = [] } = useInvoicesQuery();
  const { data: summary } = useInvoicesSummaryQuery();
  const markPaidMutation = useMarkInvoicePaidMutation();
  const markUnpaidMutation = useMarkInvoiceUnpaidMutation();

  const loadInvoices = useCallback(async () => {
    await queryClient.invalidateQueries({ queryKey: queryKeys.invoices.all });
  }, [queryClient]);

  // Filter and Search Logic
  const filteredInvoices = useMemo(() => {
    return rawInvoices.filter(invoice => {
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
  }, [rawInvoices, statusFilter, searchQuery]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredInvoices.length / pageSize));
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedItems = useMemo(() => {
    return filteredInvoices.slice(startIndex, startIndex + pageSize);
  }, [filteredInvoices, startIndex, pageSize]);

  // Metrics Calculation
  const metrics = useMemo<InvoiceMetrics>(() => {
    if (summary) return summary;
    const totalInvoiced = rawInvoices.reduce((acc, inv) => acc + (inv.total || 0), 0);
    const paidRevenue = rawInvoices
      .filter(inv => inv.status === "paid")
      .reduce((acc, inv) => acc + (inv.total || 0), 0);
    const outstandingRevenue = rawInvoices
      .filter(inv => inv.status === "sent")
      .reduce((acc, inv) => acc + (inv.total || 0), 0);
    const collectionRate = totalInvoiced > 0 ? Math.round((paidRevenue / totalInvoiced) * 100) : 0;
    const totalCount = rawInvoices.length;
    const paidCount = rawInvoices.filter(inv => inv.status === "paid").length;

    return {
      totalInvoiced,
      paidRevenue,
      outstandingRevenue,
      collectionRate,
      totalCount,
      paidCount,
    };
  }, [summary, rawInvoices]);

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
      const updated = await markPaidMutation.mutateAsync(id);
      notify?.(`Invoice ${updated.invoiceNumber} marked as Paid.`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to mark invoice as paid";
      notify?.(msg);
    }
  };

  const handleMarkUnpaid = async (id: string) => {
    try {
      const updated = await markUnpaidMutation.mutateAsync(id);
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
