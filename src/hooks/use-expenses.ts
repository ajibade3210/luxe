"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { CUSTOM_EVENTS } from "@/constants";
import {
  createExpense,
  deleteExpense,
  exportExpensesCSV,
  getExpenseSummary,
  getExpenses,
  updateExpense,
} from "@/lib/api";
import type { Expense, ExpenseCategory, ExpenseInput, ExpenseSummary } from "@/types";

export function useExpenses(notify?: (message: string) => void) {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [summary, setSummary] = useState<ExpenseSummary | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<ExpenseCategory | "all">("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const loadData = useCallback(async (query: string, category: ExpenseCategory | "all") => {
    try {
      const [list, sum] = await Promise.all([getExpenses(query, category), getExpenseSummary()]);
      setExpenses(list);
      setSummary(sum);
    } catch {
      setExpenses([]);
    }
  }, []);

  useEffect(() => {
    loadData(searchQuery, categoryFilter);

    const handleExpensesUpdate = () => {
      loadData(searchQuery, categoryFilter);
    };

    window.addEventListener(CUSTOM_EVENTS.expensesUpdated, handleExpensesUpdate);
    return () => window.removeEventListener(CUSTOM_EVENTS.expensesUpdated, handleExpensesUpdate);
  }, [searchQuery, categoryFilter, loadData]);

  const handleSearch = (val: string) => {
    setSearchQuery(val);
    setCurrentPage(1);
  };

  const handleCategoryFilter = (cat: ExpenseCategory | "all") => {
    setCategoryFilter(cat);
    setCurrentPage(1);
  };

  const handleOpenCreate = () => {
    setEditingExpense(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (expense: Expense) => {
    setEditingExpense(expense);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingExpense(null);
  };

  const handleSaveExpense = async (input: ExpenseInput): Promise<boolean> => {
    setIsSubmitting(true);
    try {
      if (editingExpense) {
        await updateExpense(editingExpense.id, input);
        notify?.(`Expense updated: ${input.title}`);
      } else {
        await createExpense(input);
        notify?.(`Expense logged: ${input.title}`);
      }
      handleCloseModal();
      return true;
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to save expense";
      notify?.(msg);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteExpense = async (id: string, title: string) => {
    try {
      await deleteExpense(id);
      notify?.(`Expense deleted: ${title}`);
    } catch {
      notify?.("Failed to delete expense record");
    }
  };

  const handleExportCSV = async () => {
    setIsExporting(true);
    try {
      const res = await exportExpensesCSV();
      notify?.(`Expenses exported successfully (${res.count} records).`);
    } catch {
      notify?.("Failed to export expenses.");
    } finally {
      setIsExporting(false);
    }
  };

  const totalPages = Math.max(1, Math.ceil(expenses.length / pageSize));
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedItems = useMemo(
    () => expenses.slice(startIndex, startIndex + pageSize),
    [expenses, startIndex, pageSize]
  );

  return {
    expenses,
    paginatedItems,
    summary,
    searchQuery,
    categoryFilter,
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    totalPages,
    startIndex,
    isModalOpen,
    editingExpense,
    isSubmitting,
    isExporting,
    handleSearch,
    handleCategoryFilter,
    handleOpenCreate,
    handleOpenEdit,
    handleCloseModal,
    handleSaveExpense,
    handleDeleteExpense,
    handleExportCSV,
  };
}
