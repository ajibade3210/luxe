"use client";

import { Download, Plus } from "lucide-react";

import { useExpenses } from "@/hooks";
import type { ExpensesPageProps } from "@/types";
import { formatMoney, Metric, PageTitle, useAdminToast } from "../admin-layout";
import { ExpenseListTable } from "./expense-list-table";
import { ExpenseModal } from "./expense-modal";

export function ExpensesPage({ onToast }: ExpensesPageProps) {
  const { showToast } = useAdminToast();
  const notify = onToast || showToast;

  const {
    expenses,
    paginatedItems,
    summary,
    categories,
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
    isExporting,
    handleSearch,
    handleCategoryFilter,
    handleOpenCreate,
    handleOpenEdit,
    handleCloseModal,
    handleDeleteExpense,
    handleExportCSV,
  } = useExpenses(notify);

  const actions = (
    <div className="flex items-center gap-2 sm:gap-2.5">
      <button
        type="button"
        onClick={handleExportCSV}
        disabled={isExporting}
        className="inline-flex items-center gap-1.5 sm:gap-2 bg-white hover:bg-[#faf7f2] text-[#191c1d] border border-[#ded5c8] hover:border-[#855e2e] px-3 sm:px-4 py-1.5 sm:py-2.5 rounded-xl text-[11px] sm:text-xs font-semibold hover:-translate-y-0.5 hover:shadow-xs active:translate-y-0 transition-all duration-200 cursor-pointer disabled:opacity-50"
      >
        <Download size={13} className={isExporting ? "animate-bounce" : ""} />
        <span>{isExporting ? "Exporting..." : "Export CSV"}</span>
      </button>
      <button
        type="button"
        onClick={handleOpenCreate}
        className="dark-button bg-[#000000] border-[#000000] inline-flex items-center gap-1 sm:gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2.5 rounded-xl text-[11px] sm:text-xs font-semibold !text-white hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 transition-all duration-200 cursor-pointer"
      >
        <Plus size={13} />
        <span>Log Expense</span>
      </button>
    </div>
  );

  return (
    <section className="content">
      <PageTitle title="Business expenses" action={actions} />

      {/* Top Metrics Row */}
      <div className="metrics">
        <Metric
          label="Total expenses"
          value={formatMoney(summary?.totalAmount || 0)}
          detail="All time outflow"
        />
        <Metric
          label="Logged records"
          value={String(summary?.expenseCount || 0)}
          detail="Expense entries"
        />
        <Metric
          label="Top expense category"
          value={summary?.topCategory?.label || "N/A"}
          detail={
            summary?.topCategory
              ? `${formatMoney(summary.topCategory.amount)} (${summary.topCategory.percentage}%)`
              : "No expenses logged"
          }
        />
      </div>

      {/* Mobile/Tablet Action Bar directly above the register */}
      <div className="flex items-center justify-end gap-2.5 mb-3.5 lg:hidden">{actions}</div>

      {/* Unified Expenses Table Card matching Leads and Customers */}
      <ExpenseListTable
        items={expenses}
        paginatedItems={paginatedItems}
        searchQuery={searchQuery}
        selectedCategory={categoryFilter}
        categories={categories}
        onSearch={handleSearch}
        onCategoryChange={handleCategoryFilter}
        onEdit={handleOpenEdit}
        onDelete={handleDeleteExpense}
        currentPage={currentPage}
        totalPages={totalPages}
        pageSize={pageSize}
        startIndex={startIndex}
        onPageChange={setCurrentPage}
        onPageSizeChange={setPageSize}
      />

      {/* Log / Edit Expense Modal */}
      <ExpenseModal
        isOpen={isModalOpen}
        existingExpense={editingExpense}
        onClose={handleCloseModal}
        onToast={notify}
      />
    </section>
  );
}
