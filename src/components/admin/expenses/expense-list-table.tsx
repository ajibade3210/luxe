"use client";

import { ChevronDown, ChevronLeft, ChevronRight, Edit2, Search, Trash2 } from "lucide-react";
import { EXPENSE_CATEGORIES, EXPENSE_CATEGORY_CONFIG, EXPENSE_PAYMENT_METHODS } from "@/constants";
import type { ExpenseCategory, ExpenseListTableProps } from "@/types";
import { formatDate, formatMoney } from "../admin-layout";
import { TableEmptyState } from "../common/table-empty-state";

export function ExpenseListTable({
  items,
  paginatedItems,
  searchQuery,
  selectedCategory,
  onSearch,
  onCategoryChange,
  onEdit,
  onDelete,
  currentPage,
  totalPages,
  pageSize,
  startIndex,
  onPageChange,
  onPageSizeChange,
}: ExpenseListTableProps) {
  return (
    <div className="table-card">
      {/* Table Head matching Leads and Customers */}
      <div className="table-head justify-end">
        <div className="flex items-center gap-3 ml-auto">
          {/* Category Filter Dropdown */}
          <div className="relative">
            <select
              value={selectedCategory}
              onChange={e => onCategoryChange(e.target.value as ExpenseCategory | "all")}
              aria-label="Filter expenses by category"
              className="appearance-none pl-3.5 pr-8 py-2 bg-white border border-[#ded7cb] rounded-xl text-xs font-medium text-[#191c1d] hover:bg-[#faf8f5] focus:outline-none focus:border-[#855e2e] transition-colors cursor-pointer shadow-2xs"
            >
              <option value="all">All Categories</option>
              {EXPENSE_CATEGORIES.map(cat => {
                const cfg = EXPENSE_CATEGORY_CONFIG[cat];
                return (
                  <option key={cat} value={cat}>
                    {cfg.label}
                  </option>
                );
              })}
            </select>
            <ChevronDown
              size={13}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#8c827a] pointer-events-none"
            />
          </div>

          {/* Standard Search Box */}
          <div className="table-search-box">
            <Search size={13} />
            <input
              type="text"
              value={searchQuery}
              onChange={e => onSearch(e.target.value)}
              placeholder="Search expenses..."
            />
          </div>
        </div>
      </div>

      {/* Table Wrap */}
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Expense & Notes</th>
              <th>Category</th>
              <th>Payment Method</th>
              <th>Amount</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedItems.map(expense => {
              const categoryConfig = EXPENSE_CATEGORY_CONFIG[expense.category] || {
                label: expense.category,
                bg: "#f3f4f6",
                color: "#4b5563",
                border: "#e5e7eb",
              };

              return (
                <tr key={expense.id} className="transition-colors">
                  <td className="whitespace-nowrap text-[#665e57] font-medium">
                    {formatDate(expense.date)}
                  </td>
                  <td>
                    <b>{expense.title}</b>
                    {expense.notes && <small className="truncate max-w-md">{expense.notes}</small>}
                  </td>
                  <td>
                    <span
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold border"
                      style={{
                        backgroundColor: categoryConfig.bg,
                        color: categoryConfig.text || categoryConfig.color,
                        borderColor: categoryConfig.border,
                      }}
                    >
                      {categoryConfig.label}
                    </span>
                  </td>
                  <td className="text-[#665e57]">
                    {EXPENSE_PAYMENT_METHODS[expense.paymentMethod] || expense.paymentMethod}
                  </td>
                  <td>
                    <span className="font-sans tabular-nums font-bold text-[#191c1d]">
                      -{formatMoney(expense.amount)}
                    </span>
                  </td>
                  <td>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => onEdit(expense)}
                        className="p-1.5 rounded-lg text-[#665e57] hover:text-[#191c1d] hover:bg-[#faf7f2] transition-colors cursor-pointer"
                        title="Edit expense"
                        aria-label={`Edit ${expense.title}`}
                      >
                        <Edit2 size={13} />
                      </button>
                      <button
                        type="button"
                        onClick={() => onDelete(expense.id, expense.title)}
                        className="p-1.5 rounded-lg text-[#dc2626] hover:text-[#b91c1c] hover:bg-[#fef2f2] transition-colors cursor-pointer"
                        title="Delete expense"
                        aria-label={`Delete ${expense.title}`}
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}

            {paginatedItems.length === 0 && (
              <TableEmptyState
                colSpan={6}
                title="No expenses found"
                description="Try adjusting your search query or add a new expense"
              />
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Bar matching Leads & Customers */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-6 py-4 border-t border-[#f0e8dc] bg-[#fdfbf7] text-xs text-[#5c5f60] rounded-b-3xl">
        <div className="flex items-center gap-2">
          <span>
            Showing <b className="text-[#191c1d]">{items.length === 0 ? 0 : startIndex + 1}</b>–
            <b className="text-[#191c1d]">{Math.min(startIndex + pageSize, items.length)}</b> of{" "}
            <b className="text-[#191c1d]">{items.length}</b> records
          </span>
          <div className="hidden sm:flex items-center gap-1.5 ml-3 border-l border-[#ded7cb] pl-3">
            <span className="text-[11px] text-[#8c827a]">Per page:</span>
            <select
              value={pageSize}
              onChange={e => onPageSizeChange(Number(e.target.value))}
              aria-label="Records per page"
              className="bg-white border border-[#ded7cb] rounded-lg px-2 py-0.5 text-xs text-[#191c1d] focus:outline-none"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            disabled={currentPage <= 1}
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-[#ded7cb] bg-white text-xs font-semibold text-[#191c1d] hover:bg-[#faf8f5] disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
          >
            <ChevronLeft size={13} />
            <span>Previous</span>
          </button>

          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                type="button"
                onClick={() => onPageChange(page)}
                className={`w-7 h-7 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  page === currentPage
                    ? "bg-[#191c1d] text-white shadow-2xs"
                    : "bg-white border border-[#ded7cb] text-[#5c5f60] hover:bg-[#faf8f5] hover:text-[#191c1d]"
                }`}
              >
                {page}
              </button>
            ))}
          </div>

          <button
            type="button"
            disabled={currentPage >= totalPages}
            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-[#ded7cb] bg-white text-xs font-semibold text-[#191c1d] hover:bg-[#faf8f5] disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
          >
            <span>Next</span>
            <ChevronRight size={13} />
          </button>
        </div>
      </div>
    </div>
  );
}
