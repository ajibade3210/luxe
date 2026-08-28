import { describe, expect, it } from "vitest";
import {
  createExpense,
  deleteExpense,
  getExpenseById,
  getExpenseCategoryBreakdown,
  getExpenseSummary,
  getExpenses,
  updateExpense,
} from "../expense.service";

describe("expense service", () => {
  it("fetches list of initial expenses", async () => {
    const list = await getExpenses();
    expect(Array.isArray(list)).toBe(true);
    expect(list.length).toBeGreaterThan(0);
  });

  it("filters expenses by category and search query", async () => {
    const materials = await getExpenses(undefined, "materials");
    expect(materials.every(e => e.category === "materials")).toBe(true);

    const searchResults = await getExpenses("Fabric");
    expect(searchResults.length).toBeGreaterThan(0);
    expect(searchResults[0].title.toLowerCase()).toContain("fabric");
  });

  it("creates a new expense record with valid input", async () => {
    const newExpense = await createExpense({
      title: "Packaging Ribbon and Stickers",
      amount: 12000,
      category: "packaging",
      date: "2026-08-25",
      paymentMethod: "bank_transfer",
      notes: "Custom satin gold ribbon rolls",
      currency: "NGN",
    });

    expect(newExpense.id).toBeDefined();
    expect(newExpense.title).toBe("Packaging Ribbon and Stickers");
    expect(newExpense.amount).toBe(12000);
    expect(newExpense.category).toBe("packaging");

    const fetched = await getExpenseById(newExpense.id);
    expect(fetched).toBeDefined();
    expect(fetched?.amount).toBe(12000);
  });

  it("updates an existing expense record", async () => {
    const expense = await createExpense({
      title: "Temporary Expense to Update",
      amount: 8000,
      category: "logistics",
      date: "2026-08-22",
      paymentMethod: "cash",
      notes: "Initial note",
    });

    const updated = await updateExpense(expense.id, {
      title: "Updated Logistics Outflow",
      amount: 9500,
      category: "logistics",
      date: "2026-08-22",
      paymentMethod: "bank_transfer",
      notes: "Adjusted with toll charges",
    });

    expect(updated.title).toBe("Updated Logistics Outflow");
    expect(updated.amount).toBe(9500);
    expect(updated.notes).toBe("Adjusted with toll charges");
  });

  it("calculates category breakdown and expense summary accurately", async () => {
    const summary = await getExpenseSummary();
    expect(summary.totalAmount).toBeGreaterThan(0);
    expect(summary.expenseCount).toBeGreaterThan(0);
    expect(summary.categories.length).toBeGreaterThan(0);

    const breakdown = await getExpenseCategoryBreakdown();
    expect(Array.isArray(breakdown)).toBe(true);
    const sumPercentage = breakdown.reduce((acc, c) => acc + c.percentage, 0);
    expect(sumPercentage).toBeGreaterThanOrEqual(95); // accounts for integer rounding
  });

  it("deletes an expense record", async () => {
    const expense = await createExpense({
      title: "Expense to Delete",
      amount: 4000,
      category: "other",
      date: "2026-08-21",
      paymentMethod: "pos",
    });

    const res = await deleteExpense(expense.id);
    expect(res.success).toBe(true);

    const fetched = await getExpenseById(expense.id);
    expect(fetched).toBeUndefined();
  });
});
