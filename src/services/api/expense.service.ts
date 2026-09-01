import { apiClient } from "@/lib/api-client";
import { ExpenseInputSchema } from "@/lib/schemas";
import type {
  Expense,
  ExpenseCategory,
  ExpenseCategorySummary,
  ExpenseInput,
  ExpenseSummary,
} from "@/types";

/**
 * Fetch all expenses with optional search text and category filter.
 */
export async function getExpenses(
  query?: string,
  category?: ExpenseCategory | "all"
): Promise<Expense[]> {
  const data = await apiClient.get<
    Expense[] | { items?: Expense[]; expenses?: Expense[]; data?: Expense[] }
  >("/expenses", {
    q: query,
    category: category && category !== "all" ? category : undefined,
  });
  if (Array.isArray(data)) return data;
  return data?.items || data?.expenses || data?.data || [];
}

/**
 * Retrieve a single expense by ID
 */
export async function getExpenseById(id: string): Promise<Expense> {
  return apiClient.get<Expense>(`/expenses/${encodeURIComponent(id)}`);
}

/**
 * Create and log a new business expense
 */
export async function createExpense(input: ExpenseInput): Promise<Expense> {
  const validated = ExpenseInputSchema.parse(input);
  return apiClient.post<Expense>("/expenses", validated);
}

/**
 * Update an existing business expense
 */
export async function updateExpense(id: string, input: ExpenseInput): Promise<Expense> {
  const validated = ExpenseInputSchema.parse(input);
  return apiClient.put<Expense>(`/expenses/${encodeURIComponent(id)}`, validated);
}

/**
 * Delete an expense record
 */
export async function deleteExpense(id: string): Promise<{ success: boolean; id: string }> {
  return apiClient.delete(`/expenses/${encodeURIComponent(id)}`);
}

/**
 * Calculate categorized expense breakdown with percentage shares
 */
export async function getExpenseCategoryBreakdown(): Promise<ExpenseCategorySummary[]> {
  return apiClient.get<ExpenseCategorySummary[]>("/expenses/categories");
}

/**
 * Get aggregate expense summary metrics
 */
export async function getExpenseSummary(): Promise<ExpenseSummary> {
  return apiClient.get<ExpenseSummary>("/expenses/summary");
}

/**
 * Export expenses list as CSV
 */
export async function exportExpensesCSV(): Promise<{ count: number; filename: string }> {
  const csvData = await apiClient.get<string>("/expenses/export");
  const filename = `shopwus-expenses-${new Date().toISOString().split("T")[0]}.csv`;

  if (typeof window !== "undefined") {
    const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  const count = typeof csvData === "string" ? Math.max(csvData.split("\n").length - 1, 0) : 0;
  return { count, filename };
}
