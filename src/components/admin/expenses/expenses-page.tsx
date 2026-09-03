"use client";

import { Download, MoreHorizontal, Plus } from "lucide-react";
import { useState } from "react";

import { useExpenses } from "@/hooks";
import type { ExpensesPageProps } from "@/types";
import { formatMoney, Metric, PageTitle, useAdminToast } from "../admin-layout";
import { ExpenseListTable } from "./expense-list-table";
import { ExpenseModal } from "./expense-modal";

export function ExpensesPage({ onToast }: ExpensesPageProps) {
  const { showToast } = useAdminToast();
  const notify = onToast || showToast;
  const [showMoreMenu, setShowMoreMenu] = useState(false);

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
        onClick={handleOpenCreate}
        className="inline-flex items-center gap-1.5 sm:gap-2 bg-[#191c1d] hover:bg-black text-white px-3 sm:px-4 py-1.5 sm:py-2.5 rounded-xl text-[11px] sm:text-xs font-semibold hover:-translate-y-0.5 hover:shadow-xs active:translate-y-0 transition-all duration-200 cursor-pointer"
      >
        <Plus size={13} />
        <span>Add</span>
      </button>

      {/* More Actions Menu Button & Dropdown */}
      <div className="relative flex items-center">
        <button
          type="button"
          onClick={() => setShowMoreMenu(prev => !prev)}
          className="inline-flex items-center justify-center p-1.5 sm:p-2.5 bg-white hover:bg-[#faf7f2] text-[#191c1d] border border-[#ded5c8] hover:border-[#855e2e] rounded-xl transition-all cursor-pointer shadow-2xs hover:-translate-y-0.5 active:translate-y-0 duration-200"
          title="More actions"
          aria-label="More actions"
        >
          <MoreHorizontal size={14} />
        </button>

        {showMoreMenu && (
          <>
            <div className="fixed inset-0 z-20" onClick={() => setShowMoreMenu(false)} />
            <div className="absolute right-0 top-full mt-1.5 w-44 bg-white border border-[#ded7cb] rounded-2xl shadow-xl z-30 py-1 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
              <button
                type="button"
                onClick={() => {
                  setShowMoreMenu(false);
                  handleExportCSV();
                }}
                disabled={isExporting}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-[#2a1d15] hover:bg-[#faf7f2] transition-colors text-left font-medium cursor-pointer disabled:opacity-50"
              >
                <Download
                  size={14}
                  className={`text-[#855e2e] ${isExporting ? "animate-bounce" : ""}`}
                />
                <span>{isExporting ? "Exporting..." : "Export"}</span>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );

  return (
    <section className="content">
      <PageTitle title="Business Expenses" action={actions} />

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
