import {
  CUSTOM_EVENTS,
  EXPENSE_CATEGORIES,
  EXPENSE_CATEGORY_CONFIG,
  INITIAL_EXPENSES,
} from "@/constants";
import { ExpenseInputSchema } from "@/lib/schemas";
import type {
  Expense,
  ExpenseCategory,
  ExpenseCategorySummary,
  ExpenseInput,
  ExpenseSummary,
} from "@/types";

let currentExpenses: Expense[] = [...INITIAL_EXPENSES];

const delay = (ms = 120) => new Promise(resolve => setTimeout(resolve, ms));

function notifyExpensesUpdated() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent(CUSTOM_EVENTS.expensesUpdated, {
        detail: currentExpenses,
      })
    );
  }
}

/**
 * Fetch all expenses with optional search text and category filter.
 * When connecting to real backend, swap with:
 * `const res = await fetch('/api/expenses' + params); return res.json();`
 */
export async function getExpenses(
  query?: string,
  category?: ExpenseCategory | "all"
): Promise<Expense[]> {
  await delay(100);
  let filtered = [...currentExpenses];

  if (category && category !== "all") {
    filtered = filtered.filter(e => e.category === category);
  }

  if (query?.trim()) {
    const q = query.toLowerCase().trim();
    filtered = filtered.filter(
      e =>
        e.title.toLowerCase().includes(q) ||
        e.notes?.toLowerCase().includes(q) ||
        EXPENSE_CATEGORY_CONFIG[e.category]?.label.toLowerCase().includes(q)
    );
  }

  return filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

/**
 * Retrieve a single expense by ID
 */
export async function getExpenseById(id: string): Promise<Expense | undefined> {
  await delay(80);
  return currentExpenses.find(e => e.id === id);
}

/**
 * Create and log a new business expense
 * When connecting to real backend, swap with:
 * `const res = await fetch('/api/expenses', { method: 'POST', body: JSON.stringify(input) }); return res.json();`
 */
export async function createExpense(input: ExpenseInput): Promise<Expense> {
  const validated = ExpenseInputSchema.parse(input);
  await delay(200);

  const newExpense: Expense = {
    id: `exp-${Date.now()}`,
    businessId: "elan-events",
    title: validated.title,
    amount: validated.amount,
    category: validated.category,
    date: validated.date,
    paymentMethod: validated.paymentMethod,
    notes: validated.notes || "",
    receiptUrl: validated.receiptUrl || "",
    currency: validated.currency || "NGN",
    createdAt: new Date().toISOString(),
  };

  currentExpenses = [newExpense, ...currentExpenses];
  notifyExpensesUpdated();
  return newExpense;
}

/**
 * Update an existing business expense
 */
export async function updateExpense(id: string, input: ExpenseInput): Promise<Expense> {
  const validated = ExpenseInputSchema.parse(input);
  await delay(180);

  const index = currentExpenses.findIndex(e => e.id === id);
  if (index === -1) {
    throw new Error("Expense record not found");
  }

  const existing = currentExpenses[index];
  const updatedExpense: Expense = {
    ...existing,
    title: validated.title,
    amount: validated.amount,
    category: validated.category,
    date: validated.date,
    paymentMethod: validated.paymentMethod,
    notes: validated.notes || "",
    receiptUrl: validated.receiptUrl || "",
    currency: validated.currency || existing.currency || "NGN",
    updatedAt: new Date().toISOString(),
  };

  currentExpenses[index] = updatedExpense;
  notifyExpensesUpdated();
  return updatedExpense;
}

/**
 * Delete an expense record
 */
export async function deleteExpense(id: string): Promise<{ success: boolean; id: string }> {
  await delay(150);
  const index = currentExpenses.findIndex(e => e.id === id);
  if (index === -1) {
    throw new Error("Expense record not found");
  }

  currentExpenses = currentExpenses.filter(e => e.id !== id);
  notifyExpensesUpdated();
  return { success: true, id };
}

/**
 * Calculate categorized expense breakdown with percentage shares
 */
export async function getExpenseCategoryBreakdown(): Promise<ExpenseCategorySummary[]> {
  await delay(100);
  const total = currentExpenses.reduce((acc, e) => acc + e.amount, 0);

  const breakdown: ExpenseCategorySummary[] = EXPENSE_CATEGORIES.map(cat => {
    const catExpenses = currentExpenses.filter(e => e.category === cat);
    const amount = catExpenses.reduce((acc, e) => acc + e.amount, 0);
    const config = EXPENSE_CATEGORY_CONFIG[cat];

    return {
      category: cat,
      label: config.label,
      amount,
      count: catExpenses.length,
      percentage: total > 0 ? Math.round((amount / total) * 100) : 0,
      color: config.color,
    };
  }).filter(c => c.count > 0);

  return breakdown.sort((a, b) => b.amount - a.amount);
}

/**
 * Get aggregate expense summary metrics
 */
export async function getExpenseSummary(): Promise<ExpenseSummary> {
  await delay(100);
  const totalAmount = currentExpenses.reduce((acc, e) => acc + e.amount, 0);
  const categories = await getExpenseCategoryBreakdown();
  const topCategory = categories.length > 0 ? categories[0] : null;
  const averageExpense =
    currentExpenses.length > 0 ? Math.round(totalAmount / currentExpenses.length) : 0;

  return {
    totalAmount,
    expenseCount: currentExpenses.length,
    topCategory,
    categories,
    averageExpense,
  };
}

/**
 * Export expenses list as CSV
 */
export async function exportExpensesCSV(): Promise<{ count: number; filename: string }> {
  await delay(250);

  if (typeof window === "undefined") {
    return { count: currentExpenses.length, filename: "expenses.csv" };
  }

  const headers = ["ID", "Title", "Amount", "Category", "Date", "Payment Method", "Notes"];
  const rows = currentExpenses.map(e => [
    e.id,
    `"${e.title}"`,
    e.amount,
    `"${EXPENSE_CATEGORY_CONFIG[e.category]?.label || e.category}"`,
    e.date,
    e.paymentMethod,
    `"${e.notes || ""}"`,
  ]);

  const csvContent = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  const filename = `elan-atelier-expenses-${new Date().toISOString().split("T")[0]}.csv`;
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  return { count: currentExpenses.length, filename };
}
