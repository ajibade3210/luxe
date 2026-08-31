"use client";

import { useMemo, useState } from "react";
import { exportLeadsCSV } from "@/services/api/leads.service";
import type { Lead } from "@/types";
import { useConvertLeadMutation, useLeadsQuery, useUpdateLeadStatusMutation } from "./queries";

export function useLeads(notify?: (message: string) => void) {
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isExporting, setIsExporting] = useState(false);

  const { data: items = [], isLoading } = useLeadsQuery(searchQuery);
  const convertMutation = useConvertLeadMutation();
  const updateStatusMutation = useUpdateLeadStatusMutation();

  const handleSearch = (val: string) => {
    setSearchQuery(val);
    setCurrentPage(1);
  };

  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedItems = items.slice(startIndex, startIndex + pageSize);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const res = await exportLeadsCSV();
      notify?.(`Lead inquiries list exported successfully (${res.count} records).`);
    } catch {
      notify?.("Failed to export leads list.");
    } finally {
      setIsExporting(false);
    }
  };

  const handleConvertToCustomer = async (leadId: string) => {
    try {
      const { customer } = await convertMutation.mutateAsync({ id: leadId });
      setSelectedLeadId(null);
      notify?.(`Lead converted to customer and moved to customer register: ${customer.name}.`);
      return true;
    } catch {
      notify?.("Failed to convert lead to customer.");
      return false;
    }
  };

  const handleUpdateStatus = async (leadId: string, status: Lead["status"]) => {
    try {
      const updated = await updateStatusMutation.mutateAsync({ id: leadId, status });
      return updated;
    } catch {
      return null;
    }
  };

  const selectedLead = items.find(l => l.id === selectedLeadId) || null;

  const metrics = useMemo(
    () => ({
      total: items.length,
      newToday: items.filter(l => l.status === "new").length,
      conversion: Math.round(
        (items.filter(l => l.status === "converted").length / (items.length || 1)) * 100
      ),
    }),
    [items]
  );

  return {
    items,
    selectedLeadId,
    setSelectedLeadId,
    selectedLead,
    searchQuery,
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    totalPages,
    startIndex,
    paginatedItems,
    isExporting,
    isConverting: convertMutation.isPending,
    isLoading,
    metrics,
    handleSearch,
    handleExport,
    handleConvertToCustomer,
    handleUpdateStatus,
  };
}
