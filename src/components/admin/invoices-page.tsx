"use client";

import { Download, Plus } from "lucide-react";
import { INVOICE_PAGE_CONFIG } from "@/constants";
import { useInvoices } from "@/hooks";
import type { InvoicesPageProps } from "@/types";
import { formatMoney, Metric, PageTitle, useAdminToast } from "./admin-layout";
import { InvoiceModal } from "./invoices/invoice-modal";
import { InvoiceTable } from "./invoices/invoice-table";

export function InvoicesPage({ onToast }: InvoicesPageProps) {
  const { showToast } = useAdminToast();
  const notify = onToast || showToast;

  const {
    invoices,
    paginatedItems,
    searchQuery,
    statusFilter,
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    totalPages,
    startIndex,
    metrics,
    isExporting,
    selectedInvoice,
    isModalOpen,
    handleSearch,
    handleStatusFilter,
    handleOpenCreate,
    handleOpenEdit,
    handleCloseModal,
    handleMarkPaid,
    handleMarkUnpaid,
    handleExportCSV,
    reloadInvoices,
  } = useInvoices(notify);

  const actions = (
    <div className="flex items-center gap-2 sm:gap-2.5">
      <button
        type="button"
        onClick={handleExportCSV}
        disabled={isExporting}
        className="inline-flex items-center gap-1.5 sm:gap-2 bg-white hover:bg-[#faf7f2] text-[#191c1d] border border-[#ded5c8] hover:border-[#855e2e] px-3 sm:px-4 py-1.5 sm:py-2.5 rounded-xl text-[11px] sm:text-xs font-semibold hover:-translate-y-0.5 hover:shadow-xs active:translate-y-0 transition-all duration-200 cursor-pointer disabled:opacity-50"
      >
        <Download size={13} className={isExporting ? "animate-bounce" : ""} />
        <span>
          {isExporting
            ? INVOICE_PAGE_CONFIG.exportingLabel
            : INVOICE_PAGE_CONFIG.exportCsvButtonLabel}
        </span>
      </button>
      <button
        type="button"
        onClick={handleOpenCreate}
        className="dark-button bg-[#000000] border-[#000000] inline-flex items-center gap-1 sm:gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2.5 rounded-xl text-[11px] sm:text-xs font-semibold !text-white hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 transition-all duration-200 cursor-pointer"
      >
        <Plus size={13} />
        <span>{INVOICE_PAGE_CONFIG.createInvoiceButtonLabel}</span>
      </button>
    </div>
  );

  return (
    <section className="content">
      <PageTitle title={INVOICE_PAGE_CONFIG.title} action={actions} />

      {/* Top Metrics Strip */}
      <div className="metrics">
        <Metric
          label={INVOICE_PAGE_CONFIG.metricLabels.totalInvoiced}
          value={formatMoney(metrics.totalInvoiced)}
          detail={`${metrics.totalCount} ${metrics.totalCount === 1 ? "invoice" : "invoices"} total`}
        />
        <Metric
          label={INVOICE_PAGE_CONFIG.metricLabels.paidRevenue}
          value={formatMoney(metrics.paidRevenue)}
          detail={`${metrics.paidCount} settled (${metrics.collectionRate}% collected)`}
        />
        <Metric
          label={INVOICE_PAGE_CONFIG.metricLabels.outstandingRevenue}
          value={formatMoney(metrics.outstandingRevenue)}
          detail={
            metrics.outstandingRevenue > 0
              ? `${metrics.totalCount - metrics.paidCount} pending collection`
              : INVOICE_PAGE_CONFIG.metricDetails.outstandingRevenue
          }
        />
      </div>

      {/* Mobile/Tablet Action Bar directly above the register */}
      <div className="flex items-center justify-end gap-2.5 mb-3.5 lg:hidden">{actions}</div>

      {/* Unified Invoices Table matching Leads, Customers, and Expenses */}
      <InvoiceTable
        items={invoices}
        paginatedItems={paginatedItems}
        searchQuery={searchQuery}
        statusFilter={statusFilter}
        onSearch={handleSearch}
        onStatusFilterChange={handleStatusFilter}
        onSelectInvoice={handleOpenEdit}
        onMarkPaid={handleMarkPaid}
        onMarkUnpaid={handleMarkUnpaid}
        currentPage={currentPage}
        totalPages={totalPages}
        pageSize={pageSize}
        startIndex={startIndex}
        onPageChange={setCurrentPage}
        onPageSizeChange={setPageSize}
      />

      {/* Multi-Currency & Full Editing Invoice Modal */}
      {isModalOpen && (
        <InvoiceModal
          isOpen={isModalOpen}
          existingInvoice={selectedInvoice}
          onClose={handleCloseModal}
          onToast={notify}
          onInvoiceSaved={() => {
            reloadInvoices();
          }}
        />
      )}
    </section>
  );
}
