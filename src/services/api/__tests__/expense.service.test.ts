import { describe, expect, it, vi } from "vitest";
import { apiClient } from "@/lib/api-client";
import type { Expense, ExpenseCategorySummary, ExpenseSummary } from "@/types";
import {
  createExpense,
  deleteExpense,
  getExpenseCategoryBreakdown,
  getExpenseSummary,
  getExpenses,
  updateExpense,
} from "../expense.service";

describe("expense service", () => {
  it("fetches list of initial expenses", async () => {
    const mockExpenses: Expense[] = [
      {
        id: "exp-1",
        businessId: "atelier-forma",
        title: "Floral Studio Props",
        amount: 85000,
        category: "materials",
        date: "2026-08-10",
        paymentMethod: "bank_transfer",
        currency: "NGN",
        createdAt: "2026-08-10T10:00:00Z",
      },
    ];
    vi.spyOn(apiClient, "get").mockResolvedValueOnce(mockExpenses);

    const list = await getExpenses();
    expect(list.length).toBe(1);
    expect(list[0].title).toBe("Floral Studio Props");
  });

  it("creates a new expense record with valid schema", async () => {
    const newExpense: Expense = {
      id: "exp-2",
      businessId: "atelier-forma",
      title: "Runway Lighting Truss Rental",
      amount: 145000,
      category: "equipment",
      date: "2026-08-20",
      paymentMethod: "bank_transfer",
      currency: "NGN",
      notes: "4x 500W warm profile stage spots",
      createdAt: "2026-08-20T10:00:00Z",
    };
    vi.spyOn(apiClient, "post").mockResolvedValueOnce(newExpense);

    const created = await createExpense({
      title: "Runway Lighting Truss Rental",
      amount: 145000,
      category: "equipment",
      date: "2026-08-20",
      paymentMethod: "bank_transfer",
      notes: "4x 500W warm profile stage spots",
    });

    expect(created.id).toBe("exp-2");
    expect(created.amount).toBe(145000);
  });

  it("updates an existing expense record", async () => {
    const updatedExpense: Expense = {
      id: "exp-2",
      businessId: "atelier-forma",
      title: "Runway Lighting Truss Rental - Extended",
      amount: 175000,
      category: "equipment",
      date: "2026-08-20",
      paymentMethod: "bank_transfer",
      currency: "NGN",
      createdAt: "2026-08-20T10:00:00Z",
    };
    vi.spyOn(apiClient, "put").mockResolvedValueOnce(updatedExpense);

    const updated = await updateExpense("exp-2", {
      title: "Runway Lighting Truss Rental - Extended",
      amount: 175000,
      category: "equipment",
      date: "2026-08-20",
      paymentMethod: "bank_transfer",
    });

    expect(updated.amount).toBe(175000);
  });

  it("calculates category breakdown and expense summary accurately", async () => {
    const mockCategories: ExpenseCategorySummary[] = [
      {
        category: "materials",
        label: "Materials & Supplies",
        amount: 85000,
        count: 1,
        percentage: 100,
        color: "#99583d",
      },
    ];
    vi.spyOn(apiClient, "get").mockResolvedValueOnce(mockCategories);

    const breakdown = await getExpenseCategoryBreakdown();
    expect(breakdown.length).toBe(1);
    expect(breakdown[0].category).toBe("materials");

    const mockSummary: ExpenseSummary = {
      totalAmount: 85000,
      expenseCount: 1,
      topCategory: mockCategories[0],
      categories: mockCategories,
      averageExpense: 85000,
    };
    vi.spyOn(apiClient, "get").mockResolvedValueOnce(mockSummary);

    const summary = await getExpenseSummary();
    expect(summary.totalAmount).toBe(85000);
    expect(summary.expenseCount).toBe(1);
  });

  it("deletes an expense record", async () => {
    vi.spyOn(apiClient, "delete").mockResolvedValueOnce({ success: true, id: "exp-3" });
    const res = await deleteExpense("exp-3");
    expect(res.success).toBe(true);
  });
});
