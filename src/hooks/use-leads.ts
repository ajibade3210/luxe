"use client";

import { useEffect, useMemo, useState } from "react";
import { CUSTOM_EVENTS } from "@/constants";
import { convertLeadToCustomer, exportLeadsCSV, getLeads, updateLeadStatus } from "@/lib/api";
import type { Lead } from "@/lib/types";

export function useLeads(notify?: (message: string) => void) {
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);
  const [items, setItems] = useState<Lead[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isExporting, setIsExporting] = useState(false);
  const [isConverting, setIsConverting] = useState(false);

  useEffect(() => {
    getLeads(searchQuery).then(setItems);
    const handleLeadsUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<Lead[]>;
      if (customEvent.detail) {
        setItems(customEvent.detail);
      }
    };
    window.addEventListener(CUSTOM_EVENTS.leadsUpdated, handleLeadsUpdate);
    return () => window.removeEventListener(CUSTOM_EVENTS.leadsUpdated, handleLeadsUpdate);
  }, [searchQuery]);

  const handleSearch = (val: string) => {
    setSearchQuery(val);
    setCurrentPage(1);
    getLeads(val).then(setItems);
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
    setIsConverting(true);
    try {
      const { customer } = await convertLeadToCustomer(leadId);
      setItems(prev => prev.filter(l => l.id !== leadId));
      setSelectedLeadId(null);
      notify?.(`Lead converted to customer and moved to customer register: ${customer.name}.`);
      return true;
    } catch {
      notify?.("Failed to convert lead to customer.");
      return false;
    } finally {
      setIsConverting(false);
    }
  };

  const handleUpdateStatus = async (leadId: string, status: Lead["status"]) => {
    try {
      const updated = await updateLeadStatus(leadId, status);
      if (updated) {
        setItems(prev => prev.map(l => (l.id === leadId ? updated : l)));
      }
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
    isConverting,
    metrics,
    handleSearch,
    handleExport,
    handleConvertToCustomer,
    handleUpdateStatus,
  };
}
