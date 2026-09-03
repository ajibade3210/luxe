"use client";

import { Download, MoreHorizontal, Plus } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { Metric, MetricsGrid, PageTitle } from "@/components/admin/common";
import { useAdminToast } from "@/components/admin/layout/admin-toast-provider";
import { useExpenses } from "@/hooks";
import type { ExpensesPageProps } from "@/types";
import { formatMoney } from "@/utils";
import { ExpenseListTable } from "./expense-list-table";
import { ExpenseModal } from "./expense-modal";

export function ExpensesPage({ onToast }: ExpensesPageProps) {
  const { showToast } = useAdminToast();
  const notify = onToast || showToast;
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const moreMenuRef = useRef<HTMLDivElement>(null);

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
    isLoading,
    handleSearch,
    handleCategoryFilter,
    handleOpenCreate,
    handleOpenEdit,
    handleCloseModal,
    handleDeleteExpense,
    handleExportCSV,
  } = useExpenses(notify);

  // Non-blocking click outside & Escape key dismiss
  useEffect(() => {
    if (!showMoreMenu) return;

    const handlePointerDown = (e: MouseEvent | TouchEvent) => {
      if (moreMenuRef.current && !moreMenuRef.current.contains(e.target as Node)) {
        setShowMoreMenu(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setShowMoreMenu(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("touchstart", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("touchstart", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [showMoreMenu]);

  const actions = (
    <>
      <button
        type="button"
        onClick={handleOpenCreate}
        className="inline-flex items-center gap-1.5 sm:gap-2 bg-atelier-ink hover:bg-black text-white px-3 sm:px-4 py-1.5 sm:py-2.5 rounded-xl text-[11px] sm:text-xs font-semibold hover:-translate-y-0.5 hover:shadow-xs active:translate-y-0 transition-all duration-200 cursor-pointer"
      >
        <Plus size={13} />
        <span>Add</span>
      </button>

      {/* More Actions Menu Button & Dropdown */}
      <div className="relative flex items-center" ref={moreMenuRef}>
        <button
          type="button"
          onClick={() => setShowMoreMenu(prev => !prev)}
          className="inline-flex items-center justify-center p-1.5 sm:p-2.5 bg-white hover:bg-atelier-warm text-atelier-ink border border-atelier-line hover:border-atelier-accent rounded-xl transition-all cursor-pointer shadow-2xs hover:-translate-y-0.5 active:translate-y-0 duration-200"
          title="More actions"
          aria-label="More actions"
          aria-expanded={showMoreMenu}
        >
          <MoreHorizontal size={14} />
        </button>

        {showMoreMenu && (
          <div className="absolute right-0 top-full mt-1.5 w-44 bg-white border border-atelier-subtle rounded-2xl shadow-xl z-30 py-1 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <button
              type="button"
              onClick={() => {
                setShowMoreMenu(false);
                handleExportCSV();
              }}
              disabled={isExporting}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-atelier-ink hover:bg-atelier-warm transition-colors text-left font-medium cursor-pointer disabled:opacity-50"
            >
              <Download
                size={14}
                className={`text-atelier-accent ${isExporting ? "animate-bounce" : ""}`}
              />
              <span>{isExporting ? "Exporting..." : "Export"}</span>
            </button>
          </div>
        )}
      </div>
    </>
  );

  return (
    <section className="content">
      <PageTitle title="Business Expenses" action={actions} />

      {/* Top Metrics Row */}
      <MetricsGrid>
        <Metric
          label="Total expenses"
          value={formatMoney(summary?.totalAmount || 0)}
          detail="All time outflow"
          isLoading={isLoading}
        />
        <Metric
          label="Logged records"
          value={String(summary?.expenseCount || 0)}
          detail="Expense entries"
          isLoading={isLoading}
        />
        <Metric
          label="Top expense category"
          value={summary?.topCategory?.label || "N/A"}
          detail={
            summary?.topCategory
              ? `${formatMoney(summary.topCategory.amount)} (${summary.topCategory.percentage}%)`
              : "No expenses logged"
          }
          isLoading={isLoading}
        />
      </MetricsGrid>

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
