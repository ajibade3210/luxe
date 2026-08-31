"use client";

import {
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Eye,
  RefreshCw,
  Search,
} from "lucide-react";
import { INVOICE_PAGE_CONFIG, INVOICE_STATUS_FILTERS } from "@/constants";
import type { InvoiceStatusFilter, InvoiceTableProps } from "@/types";
import { formatDate, formatMoney, formatStatusLabel } from "@/utils";
import { TableEmptyState } from "../common/table-empty-state";

export function InvoiceTable({
  items,
  paginatedItems,
  searchQuery,
  statusFilter,
  onSearch,
  onStatusFilterChange,
  onSelectInvoice,
  onMarkPaid,
  onMarkUnpaid,
  currentPage,
  totalPages,
  pageSize,
  startIndex,
  onPageChange,
  onPageSizeChange,
}: InvoiceTableProps) {
  return (
    <div className="table-card">
      <div className="table-head justify-end">
        <div className="flex items-center gap-3 ml-auto">
          {/* Status Filter Dropdown matching Expenses */}
          <div className="relative">
            <select
              value={statusFilter}
              onChange={e => onStatusFilterChange(e.target.value as InvoiceStatusFilter)}
              aria-label="Filter invoices by status"
              className="appearance-none pl-3.5 pr-8 py-2 bg-white border border-[#ded7cb] rounded-xl text-xs font-medium text-[#191c1d] hover:bg-[#faf8f5] focus:outline-none focus:border-[#855e2e] transition-colors cursor-pointer shadow-2xs"
            >
              {INVOICE_STATUS_FILTERS.map(f => (
                <option key={f.key} value={f.key}>
                  {f.label}
                </option>
              ))}
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
              placeholder={INVOICE_PAGE_CONFIG.searchPlaceholder}
            />
          </div>
        </div>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Invoice #</th>
              <th>Customer</th>
              <th>Date Issued</th>
              <th>Due Date</th>
              <th>Amount</th>
              <th>Status</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedItems.map(inv => (
              <tr
                key={inv.id}
                onClick={() => onSelectInvoice(inv)}
                className="cursor-pointer transition-colors"
              >
                <td>
                  <b className="font-mono text-xs text-[#191c1d] block">{inv.invoiceNumber}</b>
                  <small className="text-[#8c827a]">
                    {inv.items.length} {inv.items.length === 1 ? "item" : "items"}
                  </small>
                </td>
                <td>
                  <b className="text-[#191c1d] block">{inv.customerName}</b>
                  <small className="text-[#8c827a] truncate max-w-[180px] block">
                    {inv.customerEmail}
                  </small>
                </td>
                <td>{formatDate(inv.issueDate)}</td>
                <td>{formatDate(inv.dueDate)}</td>
                <td>
                  <span className="font-sans font-bold text-[#191c1d] tabular-nums">
                    {formatMoney(inv.total, inv.currency || "NGN")}
                  </span>
                </td>
                <td>
                  <span className={`status ${inv.status}`}>{formatStatusLabel(inv.status)}</span>
                </td>
                <td className="text-right" onClick={e => e.stopPropagation()}>
                  <div className="inline-flex items-center gap-1.5 justify-end">
                    {inv.status === "sent" && (
                      <button
                        type="button"
                        onClick={() => onMarkPaid(inv.id)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#ecfdf5] hover:bg-[#d1fae5] text-[#065f46] border border-[#a7f3d0] text-xs font-semibold transition-all cursor-pointer"
                        title="Mark invoice as paid"
                        aria-label="Mark invoice as paid"
                      >
                        <Check size={12} />
                        <span>Mark Paid</span>
                      </button>
                    )}

                    {inv.status === "paid" && (
                      <button
                        type="button"
                        onClick={() => onMarkUnpaid(inv.id)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#faf7f2] hover:bg-[#f0ebe3] text-[#5c5f60] border border-[#ded7cb] text-xs font-semibold transition-all cursor-pointer"
                        title="Revert invoice to unpaid"
                        aria-label="Revert invoice to unpaid"
                      >
                        <RefreshCw size={11} />
                        <span>Revert</span>
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => onSelectInvoice(inv)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white hover:bg-[#faf7f2] text-[#191c1d] border border-[#ded7cb] hover:border-[#c59a78] text-xs font-semibold transition-all cursor-pointer"
                      title="View and edit invoice details"
                      aria-label="View and edit invoice details"
                    >
                      <Eye size={12} />
                      <span>View</span>
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {paginatedItems.length === 0 && (
              <TableEmptyState
                colSpan={7}
                title="No invoices found"
                description={INVOICE_PAGE_CONFIG.emptyStateMessage}
              />
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Bar */}
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
              className="bg-white border border-[#ded7cb] rounded-lg px-2 py-0.5 text-xs text-[#191c1d] focus:outline-none"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage <= 1}
            className="p-1.5 rounded-lg border border-[#ded7cb] bg-white hover:bg-[#faf7f2] disabled:opacity-40 disabled:cursor-not-allowed text-[#191c1d] transition-colors cursor-pointer"
            aria-label="Previous page"
          >
            <ChevronLeft size={14} />
          </button>
          <span className="px-2 text-xs font-semibold text-[#191c1d]">
            {currentPage} / {totalPages}
          </span>
          <button
            type="button"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
            className="p-1.5 rounded-lg border border-[#ded7cb] bg-white hover:bg-[#faf7f2] disabled:opacity-40 disabled:cursor-not-allowed text-[#191c1d] transition-colors cursor-pointer"
            aria-label="Next page"
          >
            <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
