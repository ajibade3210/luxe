"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import {
  createExpense,
  deleteExpense,
  getExpenseById,
  getExpenseCategoryBreakdown,
  getExpenseSummary,
  getExpenses,
  updateExpense,
} from "@/services/api/expense.service";
import type { ExpenseCategory, ExpenseInput } from "@/types";

export function useExpensesQuery(query?: string, category?: ExpenseCategory | "all") {
  return useQuery({
    queryKey: queryKeys.expenses.list(query, category),
    queryFn: () => getExpenses(query, category),
  });
}

export function useExpenseQuery(id: string | null | undefined) {
  return useQuery({
    queryKey: id ? queryKeys.expenses.detail(id) : ["expenses", "detail", "empty"],
    queryFn: () => {
      if (!id) throw new Error("Expense ID required");
      return getExpenseById(id);
    },
    enabled: Boolean(id),
  });
}

export function useExpenseSummaryQuery() {
  return useQuery({
    queryKey: queryKeys.expenses.summary(),
    queryFn: () => getExpenseSummary(),
  });
}

export function useExpenseCategoriesQuery() {
  return useQuery({
    queryKey: queryKeys.expenses.categories(),
    queryFn: () => getExpenseCategoryBreakdown(),
  });
}

export function useCreateExpenseMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: ExpenseInput) => createExpense(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.expenses.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.analytics.all });
    },
  });
}

export function useUpdateExpenseMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: ExpenseInput }) => updateExpense(id, input),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.expenses.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.expenses.detail(id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.analytics.all });
    },
  });
}

export function useDeleteExpenseMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteExpense(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.expenses.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.analytics.all });
    },
  });
}
